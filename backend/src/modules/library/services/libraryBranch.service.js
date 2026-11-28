import { Op } from "sequelize";
import LibraryBranch from "../models/libraryBranch.model.js";
import {
  DEFAULT_MANTRA_BRANCHES as MANTRA_ONLY_BRANCHES,
  DEFAULT_STOTRA_BRANCHES as STOTRA_ONLY_BRANCHES,
  DEFAULT_MANTRA_BRANCHES_UNIFIED,
} from "../../../data/mantraStotraSeedData.js";

export const DEFAULT_MANTRA_ONLY_BRANCHES = MANTRA_ONLY_BRANCHES;
export const DEFAULT_STOTRA_ONLY_BRANCHES = STOTRA_ONLY_BRANCHES;
export const DEFAULT_MANTRA_BRANCHES = DEFAULT_MANTRA_BRANCHES_UNIFIED;

let MEMORY_BRANCHES = JSON.parse(JSON.stringify(DEFAULT_MANTRA_BRANCHES_UNIFIED));
let branchTableSynced = false;

export const normalizeCategorySlug = (rawSlug = "mantra-stotra") => {
  const s = String(rawSlug || "mantra-stotra").trim().toLowerCase();
  if (s === "mantra" || s === "mantras") return "mantra";
  if (s === "stotra" || s === "stotram" || s === "stotras") return "stotra";
  if (s === "sukti" || s === "suktis" || s === "sukta" || s === "suktas") return "sukti";
  if (s === "mantra-stotra" || s === "mantras-stotras") return "mantra-stotra";
  return s || "mantra-stotra";
};

const sanitizeBranchSlug = (raw) =>
  String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeTypeFilter = (rawType) => {
  if (!rawType) return "";
  const s = String(rawType).trim().toLowerCase();
  if (s === "mantra" || s === "mantras") return "mantra";
  if (s === "stotra" || s === "stotram" || s === "stotras") return "stotra";
  if (s === "sukti" || s === "suktis" || s === "sukta" || s === "suktas") return "sukti";
  if (s === "all") return "";
  return s;
};

class LibraryBranchService {
  /**
   * Ensure table is synced and seed defaults if empty
   */
  async ensureSeeded(categorySlug = "mantra-stotra") {
    const normalizedCat = normalizeCategorySlug(categorySlug);
    try {
      if (!branchTableSynced) {
        await LibraryBranch.sync({ alter: true });
        branchTableSynced = true;
      }

      if (normalizedCat === "mantra" || normalizedCat === "mantra-stotra") {
        const mantraCount = await LibraryBranch.count({ where: { categorySlug: "mantra" } });
        if (mantraCount === 0) {
          for (const item of DEFAULT_MANTRA_ONLY_BRANCHES) {
            await LibraryBranch.findOrCreate({ where: { id: item.id }, defaults: item });
          }
        }
      }

      if (normalizedCat === "stotra" || normalizedCat === "mantra-stotra") {
        const stotraCount = await LibraryBranch.count({ where: { categorySlug: "stotra" } });
        if (stotraCount === 0) {
          for (const item of DEFAULT_STOTRA_ONLY_BRANCHES) {
            await LibraryBranch.findOrCreate({ where: { id: item.id }, defaults: item });
          }
        }
      }
    } catch (err) {
      console.warn("Could not sync/seed LibraryBranch:", err.message);
    }
  }

  /**
   * Attach itemCount to each branch from LibraryMantraStotraService
   */
  async attachItemCounts(branches = [], isAdmin = false) {
    let allItems = [];
    try {
      const LibraryMantraStotraService = (
        await import("./libraryMantraStotra.service.js")
      ).default;
      const res = await LibraryMantraStotraService.getItems(
        { limit: 1000, skipBranchRefs: true },
        isAdmin
      );
      allItems = res?.items || [];
    } catch {
      allItems = [];
    }

    return branches.map((b) => {
      const plain = b && typeof b.toJSON === "function" ? b.toJSON() : { ...b };
      const count = allItems.filter((item) => {
        if (item.branchId && plain.id && item.branchId === plain.id) {
          return true;
        }
        if (item.branchSlug && plain.slug && item.branchSlug === plain.slug) {
          if (!item.type || plain.categorySlug === "mantra-stotra") {
            return true;
          }
          return item.type === plain.categorySlug;
        }
        return false;
      }).length;

      return {
        ...plain,
        itemCount: count,
      };
    });
  }

  /**
   * Get all subcategories/branches for a category (e.g. mantra, stotra, mantra-stotra)
   */
  async getSubcategories(categorySlug = "mantra-stotra", isAdmin = false, options = {}) {
    const normalizedCat = normalizeCategorySlug(categorySlug);
    const typeFilter = normalizeTypeFilter(options.type || options.postType);

    try {
      await this.ensureSeeded(normalizedCat);

      const where = {};
      if (normalizedCat === "mantra-stotra") {
        if (typeFilter === "mantra" || typeFilter === "stotra" || typeFilter === "sukti") {
          where.categorySlug = typeFilter;
        } else {
          where.categorySlug = { [Op.in]: ["mantra", "stotra", "sukti", "mantra-stotra"] };
        }
      } else {
        where.categorySlug = normalizedCat;
      }

      if (!isAdmin) {
        where.status = "ACTIVE";
      }

      const branches = await LibraryBranch.findAll({
        where,
        order: [
          ["orderIndex", "ASC"],
          ["createdAt", "ASC"],
        ],
      });

      if (branches && branches.length > 0) {
        if (options.skipItemCounts) {
          return branches.map((b) => (b && typeof b.toJSON === "function" ? b.toJSON() : { ...b }));
        }
        return await this.attachItemCounts(branches, isAdmin);
      }
    } catch (err) {
      console.warn("Database fetch failed for LibraryBranch:", err.message);
    }

    // Default in-memory fallback
    let filtered = [...MEMORY_BRANCHES];

    if (normalizedCat === "mantra-stotra") {
      if (typeFilter === "mantra" || typeFilter === "stotra" || typeFilter === "sukti") {
        filtered = filtered.filter((b) => b.categorySlug === typeFilter);
      } else {
        filtered = filtered.filter((b) =>
          ["mantra", "stotra", "sukti", "mantra-stotra"].includes(b.categorySlug)
        );
      }
    } else {
      filtered = filtered.filter((b) => b.categorySlug === normalizedCat);
    }

    if (!isAdmin) {
      filtered = filtered.filter((b) => b.status === "ACTIVE");
    }

    filtered.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    if (options.skipItemCounts) {
      return filtered.map((b) => ({ ...b }));
    }
    return await this.attachItemCounts(filtered, isAdmin);
  }

  /**
   * Get single branch detail by slug or id + associated items
   */
  async getSubcategoryBySlug(categorySlug = "mantra-stotra", slug, isAdmin = false) {
    const normalizedCat = normalizeCategorySlug(categorySlug);
    let branch = null;

    try {
      await this.ensureSeeded(normalizedCat);

      const baseWhere = {
        [Op.or]: [{ slug }, { id: slug }],
      };
      if (!isAdmin) {
        baseWhere.status = "ACTIVE";
      }

      if (normalizedCat === "mantra-stotra") {
        branch = await LibraryBranch.findOne({
          where: {
            ...baseWhere,
            categorySlug: { [Op.in]: ["mantra", "stotra", "sukti", "mantra-stotra"] },
          },
        });
      } else {
        branch = await LibraryBranch.findOne({
          where: {
            ...baseWhere,
            categorySlug: normalizedCat,
          },
        });
        if (!branch) {
          branch = await LibraryBranch.findOne({
            where: {
              ...baseWhere,
              categorySlug: "mantra-stotra",
            },
          });
        }
      }
    } catch (err) {
      console.warn("Database getSubcategoryBySlug failed:", err.message);
    }

    if (!branch) {
      if (normalizedCat === "mantra-stotra") {
        branch = MEMORY_BRANCHES.find(
          (b) =>
            (b.slug === slug || b.id === slug) &&
            (!b.categorySlug || ["mantra", "stotra", "sukti", "mantra-stotra"].includes(b.categorySlug)) &&
            (isAdmin || b.status === "ACTIVE")
        );
      } else {
        branch =
          MEMORY_BRANCHES.find(
            (b) =>
              (b.slug === slug || b.id === slug) &&
              b.categorySlug === normalizedCat &&
              (isAdmin || b.status === "ACTIVE")
          ) ||
          MEMORY_BRANCHES.find(
            (b) =>
              (b.slug === slug || b.id === slug) &&
              (!b.categorySlug || b.categorySlug === "mantra-stotra") &&
              (isAdmin || b.status === "ACTIVE")
          );
      }
    }

    if (!branch) {
      const err = new Error("Library branch not found");
      err.statusCode = 404;
      throw err;
    }

    const plainBranch =
      branch && typeof branch.toJSON === "function" ? branch.toJSON() : { ...branch };

    let items = [];
    try {
      const LibraryMantraStotraService = (
        await import("./libraryMantraStotra.service.js")
      ).default;
      const itemType =
        normalizedCat === "mantra" || normalizedCat === "stotra" || normalizedCat === "sukti"
          ? normalizedCat
          : undefined;
      const res = await LibraryMantraStotraService.getItems(
        {
          branchSlug: plainBranch.slug,
          type: itemType,
          limit: 100,
        },
        isAdmin
      );
      items = res?.items || [];
    } catch (itemErr) {
      console.warn("Could not attach items to branch detail:", itemErr.message);
    }

    return {
      branch: {
        ...plainBranch,
        itemCount: items.length,
      },
      items,
    };
  }

  /**
   * Create new subcategory branch
   */
  async createSubcategory(data) {
    const {
      categorySlug: rawCategorySlug = "mantra-stotra",
      slug,
      name,
      enName,
      desc,
      stats,
      badge,
      deity,
      imageKey,
      orderIndex,
      status = "ACTIVE",
    } = data;

    const categorySlug = normalizeCategorySlug(rawCategorySlug);

    if (!name || !String(name).trim()) {
      const err = new Error("Branch name is required");
      err.statusCode = 400;
      throw err;
    }

    const rawSlugSource = slug || enName || deity || name;
    let cleanSlug = sanitizeBranchSlug(rawSlugSource);
    if (!cleanSlug) {
      cleanSlug = `branch-${Date.now()}`;
    }

    const hasExplicitId = Boolean(data.id && String(data.id).trim());
    const id = hasExplicitId
      ? String(data.id).trim()
      : `branch-${categorySlug}-${cleanSlug}-${Date.now()}`;
    const defaultStats =
      categorySlug === "stotra"
        ? "10+ Stotras"
        : categorySlug === "mantra"
        ? "10+ Mantras"
        : categorySlug === "sukti"
        ? "10+ Suktis"
        : "10+ Mantras & Stotras";

    try {
      if (!branchTableSynced) {
        await LibraryBranch.sync({ alter: true });
        branchTableSynced = true;
      }

      if (hasExplicitId) {
        const existingById = await LibraryBranch.findByPk(id);
        if (existingById) {
          const conflictErr = new Error(`Branch with id '${id}' already exists`);
          conflictErr.statusCode = 409;
          throw conflictErr;
        }
      }

      const existingDb = await LibraryBranch.findOne({
        where: { categorySlug, slug: cleanSlug },
      });
      if (existingDb) {
        const conflictErr = new Error(
          `Branch with slug '${cleanSlug}' already exists in '${categorySlug}'`
        );
        conflictErr.statusCode = 409;
        throw conflictErr;
      }

      const created = await LibraryBranch.create({
        id,
        categorySlug,
        slug: cleanSlug,
        name: String(name).trim(),
        enName: enName ? String(enName).trim() : null,
        desc: desc ? String(desc).trim() : null,
        stats: stats ? String(stats).trim() : defaultStats,
        badge: badge ? String(badge).trim() : null,
        deity: deity ? String(deity).trim() : cleanSlug,
        imageKey: imageKey ? String(imageKey).trim() : null,
        orderIndex: Number(orderIndex) || 0,
        status,
      });

      const plain = created.toJSON ? created.toJSON() : created;
      const existingIdx = MEMORY_BRANCHES.findIndex(
        (b) => b.id === id || (b.slug === cleanSlug && b.categorySlug === categorySlug)
      );
      if (existingIdx !== -1) {
        MEMORY_BRANCHES[existingIdx] = { ...MEMORY_BRANCHES[existingIdx], ...plain };
      } else {
        MEMORY_BRANCHES.push(plain);
      }
      return created;
    } catch (dbErr) {
      if (dbErr?.statusCode === 409 || dbErr?.name === "SequelizeUniqueConstraintError") {
        const conflictErr = new Error(
          dbErr.errors?.[0]?.message ||
            dbErr.message ||
            `Branch with slug '${cleanSlug}' already exists in '${categorySlug}'`
        );
        conflictErr.statusCode = 409;
        throw conflictErr;
      }

      console.warn("Database create failed for LibraryBranch, saving to memory store:", dbErr.message);

      if (hasExplicitId && MEMORY_BRANCHES.some((b) => b.id === id)) {
        const conflictErr = new Error(`Branch with id '${id}' already exists`);
        conflictErr.statusCode = 409;
        throw conflictErr;
      }

      const memConflict = MEMORY_BRANCHES.find(
        (b) => b.categorySlug === categorySlug && b.slug === cleanSlug
      );
      if (memConflict) {
        const conflictErr = new Error(
          `Branch with slug '${cleanSlug}' already exists in '${categorySlug}'`
        );
        conflictErr.statusCode = 409;
        throw conflictErr;
      }

      const newBranch = {
        id,
        categorySlug,
        slug: cleanSlug,
        name: String(name).trim(),
        enName: enName ? String(enName).trim() : null,
        desc: desc ? String(desc).trim() : null,
        stats: stats ? String(stats).trim() : defaultStats,
        badge: badge ? String(badge).trim() : null,
        deity: deity ? String(deity).trim() : cleanSlug,
        imageKey: imageKey ? String(imageKey).trim() : null,
        orderIndex: Number(orderIndex) || 0,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MEMORY_BRANCHES.push(newBranch);
      return newBranch;
    }
  }

  /**
   * Update existing branch
   */
  async updateSubcategory(id, data = {}, categorySlug) {
    if (data.name !== undefined && (data.name === null || !String(data.name).trim())) {
      const err = new Error("Branch name cannot be empty");
      err.statusCode = 400;
      throw err;
    }

    const normalizedCat = categorySlug ? normalizeCategorySlug(categorySlug) : undefined;
    const {
      name,
      enName,
      slug,
      desc,
      stats,
      badge,
      deity,
      imageKey,
      orderIndex,
      status,
    } = data;

    const cleanUpdatedSlug =
      typeof slug !== "undefined" && String(slug).trim()
        ? sanitizeBranchSlug(slug) || String(slug).trim()
        : null;

    try {
      let branch = await LibraryBranch.findByPk(id);
      if (!branch) {
        const where = { slug: id };
        if (normalizedCat && normalizedCat !== "mantra-stotra") {
          where.categorySlug = normalizedCat;
        }
        branch = await LibraryBranch.findOne({ where });
      }

      if (branch) {
        if (cleanUpdatedSlug && cleanUpdatedSlug !== branch.slug) {
          const conflict = await LibraryBranch.findOne({
            where: {
              categorySlug: branch.categorySlug,
              slug: cleanUpdatedSlug,
              id: { [Op.ne]: branch.id },
            },
          });
          if (conflict) {
            const conflictErr = new Error(
              `Branch with slug '${cleanUpdatedSlug}' already exists in '${branch.categorySlug}'`
            );
            conflictErr.statusCode = 409;
            throw conflictErr;
          }
        }

        await branch.update({
          name: typeof name !== "undefined" ? String(name).trim() : branch.name,
          enName:
            typeof enName !== "undefined"
              ? enName
                ? String(enName).trim()
                : null
              : branch.enName,
          slug: cleanUpdatedSlug || branch.slug,
          desc:
            typeof desc !== "undefined" ? (desc ? String(desc).trim() : null) : branch.desc,
          stats:
            typeof stats !== "undefined" ? (stats ? String(stats).trim() : null) : branch.stats,
          badge:
            typeof badge !== "undefined" ? (badge ? String(badge).trim() : null) : branch.badge,
          deity:
            typeof deity !== "undefined" ? (deity ? String(deity).trim() : null) : branch.deity,
          imageKey:
            typeof imageKey !== "undefined"
              ? imageKey
                ? String(imageKey).trim()
                : null
              : branch.imageKey,
          orderIndex:
            typeof orderIndex !== "undefined" ? Number(orderIndex) : branch.orderIndex,
          status: typeof status !== "undefined" ? status : branch.status,
        });

        const plain = branch.toJSON ? branch.toJSON() : branch;
        const memIdx = MEMORY_BRANCHES.findIndex(
          (b) =>
            b.id === id ||
            (b.slug === id &&
              (!normalizedCat || normalizedCat === "mantra-stotra" || b.categorySlug === normalizedCat))
        );
        if (memIdx !== -1) {
          MEMORY_BRANCHES[memIdx] = { ...MEMORY_BRANCHES[memIdx], ...plain };
        } else {
          MEMORY_BRANCHES.push(plain);
        }
        return branch;
      }
    } catch (dbErr) {
      if (dbErr?.statusCode === 409 || dbErr?.name === "SequelizeUniqueConstraintError") {
        const conflictErr = new Error(
          dbErr.errors?.[0]?.message || dbErr.message || "Branch slug already exists in this category"
        );
        conflictErr.statusCode = 409;
        throw conflictErr;
      }
      console.warn("Database update failed for LibraryBranch, updating memory store:", dbErr.message);
    }

    let memIdx = MEMORY_BRANCHES.findIndex((b) => b.id === id);
    if (memIdx === -1) {
      memIdx = MEMORY_BRANCHES.findIndex(
        (b) =>
          b.slug === id &&
          (!normalizedCat || normalizedCat === "mantra-stotra" || b.categorySlug === normalizedCat)
      );
    }

    if (memIdx !== -1) {
      const existing = MEMORY_BRANCHES[memIdx];
      if (cleanUpdatedSlug && cleanUpdatedSlug !== existing.slug) {
        const conflict = MEMORY_BRANCHES.find(
          (b) =>
            b.id !== existing.id &&
            b.categorySlug === existing.categorySlug &&
            b.slug === cleanUpdatedSlug
        );
        if (conflict) {
          const conflictErr = new Error(
            `Branch with slug '${cleanUpdatedSlug}' already exists in '${existing.categorySlug}'`
          );
          conflictErr.statusCode = 409;
          throw conflictErr;
        }
      }

      MEMORY_BRANCHES[memIdx] = {
        ...existing,
        ...(typeof name !== "undefined" && { name: String(name).trim() }),
        ...(typeof enName !== "undefined" && { enName: enName ? String(enName).trim() : null }),
        ...(cleanUpdatedSlug && { slug: cleanUpdatedSlug }),
        ...(typeof desc !== "undefined" && { desc: desc ? String(desc).trim() : null }),
        ...(typeof stats !== "undefined" && { stats: stats ? String(stats).trim() : null }),
        ...(typeof badge !== "undefined" && { badge: badge ? String(badge).trim() : null }),
        ...(typeof deity !== "undefined" && { deity: deity ? String(deity).trim() : null }),
        ...(typeof imageKey !== "undefined" && { imageKey: imageKey ? String(imageKey).trim() : null }),
        ...(typeof orderIndex !== "undefined" && { orderIndex: Number(orderIndex) }),
        ...(typeof status !== "undefined" && { status }),
        updatedAt: new Date().toISOString(),
      };
      return MEMORY_BRANCHES[memIdx];
    }

    const err = new Error("Library branch not found");
    err.statusCode = 404;
    throw err;
  }

  /**
   * Delete a branch
   */
  async deleteSubcategory(id, categorySlug) {
    const normalizedCat = categorySlug ? normalizeCategorySlug(categorySlug) : undefined;
    try {
      let branch = await LibraryBranch.findByPk(id);
      if (!branch) {
        const where = { slug: id };
        if (normalizedCat && normalizedCat !== "mantra-stotra") {
          where.categorySlug = normalizedCat;
        }
        branch = await LibraryBranch.findOne({ where });
      }
      if (branch) {
        await branch.destroy();
      }
    } catch (dbErr) {
      console.warn("Database delete failed for LibraryBranch, mutating memory store:", dbErr.message);
    }

    MEMORY_BRANCHES = MEMORY_BRANCHES.filter(
      (b) =>
        !(
          b.id === id ||
          (b.slug === id &&
            (!normalizedCat || normalizedCat === "mantra-stotra" || b.categorySlug === normalizedCat))
        )
    );
    return true;
  }

  /**
   * Reorder subcategories/branches
   */
  async reorderSubcategories(categorySlug = "mantra-stotra", orderedIds = []) {
    const normalizedCat = normalizeCategorySlug(categorySlug);
    const list = Array.isArray(orderedIds)
      ? orderedIds
      : orderedIds?.orderedIds || orderedIds?.items || [];

    if (!Array.isArray(list)) {
      const err = new Error("orderedIds must be an array");
      err.statusCode = 400;
      throw err;
    }

    // 1. Update memory store (match primary key id globally first, then (categorySlug, slug))
    list.forEach((item, index) => {
      const id = typeof item === "string" ? item : item?.id || item?.slug;
      if (!id) return;
      const orderIndex =
        typeof item === "object" && typeof item?.orderIndex === "number"
          ? item.orderIndex
          : index + 1;

      const branch =
        MEMORY_BRANCHES.find((b) => b.id === id) ||
        MEMORY_BRANCHES.find(
          (b) =>
            b.slug === id &&
            (normalizedCat === "mantra-stotra" || b.categorySlug === normalizedCat)
        );
      if (branch) {
        branch.orderIndex = orderIndex;
        branch.updatedAt = new Date().toISOString();
      }
    });
    MEMORY_BRANCHES.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // 2. Update database records
    try {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const id = typeof item === "string" ? item : item?.id || item?.slug;
        const orderIndex =
          typeof item === "object" && typeof item?.orderIndex === "number"
            ? item.orderIndex
            : i + 1;
        if (id) {
          let branch = await LibraryBranch.findByPk(id);
          if (!branch) {
            const where = { slug: id };
            if (normalizedCat && normalizedCat !== "mantra-stotra") {
              where.categorySlug = normalizedCat;
            }
            branch = await LibraryBranch.findOne({ where });
          }
          if (branch) {
            await branch.update({ orderIndex });
          }
        }
      }
    } catch (dbErr) {
      console.warn("Database reorder failed for LibraryBranch, in-memory updated:", dbErr.message);
    }

    return this.getSubcategories(normalizedCat, true);
  }
}

export default new LibraryBranchService();
