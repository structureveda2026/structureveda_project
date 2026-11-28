import { Op } from "sequelize";
import LibraryMantraStotra from "../models/libraryMantraStotra.model.js";
import LibraryBranch from "../models/libraryBranch.model.js";
import LibraryBranchService, { normalizeCategorySlug } from "./libraryBranch.service.js";
import LibrarySectionService from "./librarySection.service.js";
import { sanitizeSlug, calculateReadTime, normalizeTags } from "../helpers/blog.helper.js";
import {
  DEFAULT_MANTRA_BRANCHES_UNIFIED,
  DEFAULT_MANTRA_STOTRAS,
} from "../../../data/mantraStotraSeedData.js";

let MEMORY_ITEMS = JSON.parse(JSON.stringify(DEFAULT_MANTRA_STOTRAS)).map((item) => ({
  ...item,
  viewsCount: Number(item.viewsCount) || 0,
  readTime:
    item.readTime ||
    calculateReadTime(`${item.sanskrit || ""} ${item.hindiTranslation || ""} ${item.englishTranslation || ""}`),
}));

let tableSynced = false;

export const normalizeItemType = (rawType) => {
  if (!rawType) return "";
  const s = String(rawType).trim().toLowerCase();
  if (s === "mantra" || s === "mantras") return "mantra";
  if (s === "stotra" || s === "stotram" || s === "stotras") return "stotra";
  if (s === "sukti" || s === "suktis" || s === "sukta" || s === "suktas") return "sukti";
  if (s === "all") return "";
  return s;
};

const toBranchRef = (branch) => {
  if (!branch) return null;
  const b = typeof branch.toJSON === "function" ? branch.toJSON() : branch;
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    enName: b.enName || null,
    categorySlug: b.categorySlug,
    deity: b.deity || null,
    imageKey: b.imageKey || null,
  };
};

class LibraryMantraStotraService {
  /**
   * Ensure table is synced and seed defaults if empty
   */
  async ensureSeeded() {
    try {
      await LibraryBranchService.ensureSeeded("mantra-stotra");
      if (!tableSynced) {
        await LibraryMantraStotra.sync({ alter: true });
        tableSynced = true;
      }
      const count = await LibraryMantraStotra.count();
      if (count === 0) {
        for (const item of DEFAULT_MANTRA_STOTRAS) {
          await LibraryMantraStotra.findOrCreate({
            where: { id: item.id },
            defaults: {
              ...item,
              viewsCount: Number(item.viewsCount) || 0,
              readTime:
                item.readTime ||
                calculateReadTime(
                  `${item.sanskrit || ""} ${item.hindiTranslation || ""} ${item.englishTranslation || ""}`
                ),
            },
          });
        }
      }
    } catch (err) {
      console.warn("Could not sync/seed LibraryMantraStotra:", err.message);
    }
  }

  /**
   * Resolve branch reference from DB or memory branches
   */
  async resolveBranch({ branchId, branchSlug, categorySlug, type }) {
    const targetCat = normalizeCategorySlug(categorySlug || type || "mantra");
    let allBranches = [];
    try {
      allBranches = await LibraryBranchService.getSubcategories("mantra-stotra", true, {
        skipItemCounts: true,
      });
    } catch {
      allBranches = DEFAULT_MANTRA_BRANCHES_UNIFIED;
    }

    let matched = null;
    if (branchId) {
      matched = allBranches.find((b) => b.id === branchId) || null;
    }
    if (!matched && branchSlug) {
      matched =
        allBranches.find(
          (b) => b.slug === branchSlug && (b.categorySlug === targetCat || b.categorySlug === "mantra-stotra")
        ) ||
        allBranches.find((b) => b.slug === branchSlug) ||
        null;
    }

    return matched ? toBranchRef(matched) : null;
  }

  /**
   * Attach branch ref to plain item(s) when missing
   */
  async attachBranchRefs(items = []) {
    let allBranches = [];
    try {
      allBranches = await LibraryBranchService.getSubcategories("mantra-stotra", true, {
        skipItemCounts: true,
      });
    } catch {
      allBranches = DEFAULT_MANTRA_BRANCHES_UNIFIED;
    }

    return items.map((raw) => {
      const item = raw && typeof raw.toJSON === "function" ? raw.toJSON() : { ...raw };
      if (item.branch) {
        item.branch = toBranchRef(item.branch);
        return item;
      }

      const matched =
        (item.branchId && allBranches.find((b) => b.id === item.branchId)) ||
        (item.branchSlug &&
          (allBranches.find(
            (b) =>
              b.slug === item.branchSlug &&
              (b.categorySlug === (item.categorySlug || item.type) || b.categorySlug === "mantra-stotra")
          ) ||
            allBranches.find((b) => b.slug === item.branchSlug))) ||
        null;

      return {
        ...item,
        branch: matched ? toBranchRef(matched) : null,
      };
    });
  }

  /**
   * Get items with filters, search, and pagination
   */
  async getItems(options = {}, isAdminOverride) {
    const isAdmin =
      typeof isAdminOverride === "boolean" ? isAdminOverride : Boolean(options.isAdmin);

    const {
      type: rawType,
      categorySlug: rawCategorySlug,
      branchId,
      branchSlug,
      deity,
      isFeatured,
      featured,
      status,
      search,
      page = 1,
      limit = 20,
      sort = "orderIndex",
      order = "ASC",
    } = options;

    const type = normalizeItemType(rawType);
    const categorySlug =
      rawCategorySlug && String(rawCategorySlug).toUpperCase() !== "ALL"
        ? normalizeCategorySlug(rawCategorySlug)
        : "";

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(1000, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const sortOrder = String(order).toUpperCase() === "DESC" ? "DESC" : "ASC";
    const sortField = ["orderIndex", "createdAt", "title", "viewsCount"].includes(sort)
      ? sort
      : "orderIndex";

    try {
      await this.ensureSeeded();

      const where = {};
      if (type) {
        where.type = type;
      }
      if (categorySlug && categorySlug !== "mantra-stotra") {
        where.categorySlug = categorySlug;
      }
      if (branchId) {
        where.branchId = branchId;
      }
      if (branchSlug) {
        where.branchSlug = branchSlug;
      }
      if (deity && String(deity).toUpperCase() !== "ALL" && String(deity).trim()) {
        const d = `%${String(deity).trim()}%`;
        where[Op.and] = [
          ...(where[Op.and] || []),
          {
            [Op.or]: [
              { deity: { [Op.iLike]: d } },
              { deityHi: { [Op.iLike]: d } },
            ],
          },
        ];
      }
      if (typeof isFeatured !== "undefined" && isFeatured !== "") {
        where.isFeatured = isFeatured === "true" || isFeatured === true;
      } else if (typeof featured !== "undefined" && featured !== "") {
        where.isFeatured = featured === "true" || featured === true;
      }

      if (!isAdmin) {
        where.status = "ACTIVE";
      } else if (status && String(status).toUpperCase() !== "ALL") {
        where.status = status;
      }

      if (search && String(search).trim()) {
        const q = `%${String(search).trim()}%`;
        where[Op.and] = [
          ...(where[Op.and] || []),
          {
            [Op.or]: [
              { title: { [Op.iLike]: q } },
              { titleHi: { [Op.iLike]: q } },
              { subtitle: { [Op.iLike]: q } },
              { subtitleHi: { [Op.iLike]: q } },
              { slug: { [Op.iLike]: q } },
              { deity: { [Op.iLike]: q } },
              { deityHi: { [Op.iLike]: q } },
              { sanskrit: { [Op.iLike]: q } },
              { sourceRef: { [Op.iLike]: q } },
              { astrologicalRemedy: { [Op.iLike]: q } },
            ],
          },
        ];
      }

      const { count, rows } = await LibraryMantraStotra.findAndCountAll({
        where,
        order: [
          [sortField, sortOrder],
          ["createdAt", "ASC"],
        ],
        limit: limitNum,
        offset,
        include: [
          {
            model: LibraryBranch,
            as: "branch",
            required: false,
          },
        ],
      });

      const items = rows.map((r) => {
        const plain = r.toJSON ? r.toJSON() : { ...r };
        plain.branch = plain.branch ? toBranchRef(plain.branch) : null;
        return plain;
      });

      return {
        items,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          pages: Math.max(1, Math.ceil(count / limitNum)),
        },
      };
    } catch (err) {
      console.warn("Database getItems failed for LibraryMantraStotra, falling back to memory store:", err.message);
    }

    // In-memory fallback
    let filtered = [...MEMORY_ITEMS];

    if (type) {
      filtered = filtered.filter((i) => i.type === type);
    }
    if (categorySlug && categorySlug !== "mantra-stotra") {
      filtered = filtered.filter((i) => normalizeCategorySlug(i.categorySlug) === categorySlug);
    }
    if (branchId) {
      filtered = filtered.filter((i) => i.branchId === branchId);
    }
    if (branchSlug) {
      filtered = filtered.filter((i) => i.branchSlug === branchSlug);
    }
    if (deity && String(deity).toUpperCase() !== "ALL" && String(deity).trim()) {
      const d = String(deity).trim().toLowerCase();
      filtered = filtered.filter(
        (i) =>
          (i.deity && i.deity.toLowerCase().includes(d)) ||
          (i.deityHi && i.deityHi.toLowerCase().includes(d))
      );
    }
    if (typeof isFeatured !== "undefined" && isFeatured !== "") {
      const feat = isFeatured === "true" || isFeatured === true;
      filtered = filtered.filter((i) => Boolean(i.isFeatured) === feat);
    } else if (typeof featured !== "undefined" && featured !== "") {
      const feat = featured === "true" || featured === true;
      filtered = filtered.filter((i) => Boolean(i.isFeatured) === feat);
    }

    if (!isAdmin) {
      filtered = filtered.filter((i) => i.status === "ACTIVE");
    } else if (status && String(status).toUpperCase() !== "ALL") {
      filtered = filtered.filter((i) => i.status === status);
    }

    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      filtered = filtered.filter(
        (i) =>
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.titleHi && i.titleHi.toLowerCase().includes(q)) ||
          (i.subtitle && i.subtitle.toLowerCase().includes(q)) ||
          (i.subtitleHi && i.subtitleHi.toLowerCase().includes(q)) ||
          (i.slug && i.slug.toLowerCase().includes(q)) ||
          (i.deity && i.deity.toLowerCase().includes(q)) ||
          (i.deityHi && i.deityHi.toLowerCase().includes(q)) ||
          (i.sanskrit && i.sanskrit.toLowerCase().includes(q)) ||
          (i.sourceRef && i.sourceRef.toLowerCase().includes(q)) ||
          (i.astrologicalRemedy && i.astrologicalRemedy.toLowerCase().includes(q)) ||
          (Array.isArray(i.tags) && i.tags.some((t) => String(t).toLowerCase().includes(q)))
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (aVal === bVal) return 0;
      return sortOrder === "DESC" ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
    });

    const total = filtered.length;
    const paginatedRaw = filtered.slice(offset, offset + limitNum);
    const paginatedItems = options.skipBranchRefs
      ? paginatedRaw.map((i) => ({ ...i }))
      : await this.attachBranchRefs(paginatedRaw);

    return {
      items: paginatedItems,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.max(1, Math.ceil(total / limitNum)),
      },
    };
  }

  /**
   * Get single item by slug or id
   */
  async getAvailableTypes() {
    const known = ["mantra", "stotra", "sukti"];
    let sectionSlugs = [];
    try {
      const sections = await LibrarySectionService.getSections(false);
      sectionSlugs = sections.map((s) => s.slug).filter(Boolean);
    } catch {
      // ignore
    }
    try {
      await this.ensureSeeded();
      const rows = await LibraryMantraStotra.findAll({
        attributes: ["type"],
        where: { status: "ACTIVE" },
        group: ["type"],
        raw: true,
      });
      return [...new Set([...known, ...sectionSlugs, ...rows.map((row) => normalizeItemType(row.type)).filter(Boolean)])];
    } catch {
      return [...new Set([...known, ...sectionSlugs, ...MEMORY_ITEMS.map((item) => normalizeItemType(item.type)).filter(Boolean)])];
    }
  }

  async getItemByIdOrSlug(idOrSlug, isAdmin = false, incrementViews = false) {
    try {
      await this.ensureSeeded();

      const where = {
        [Op.or]: [{ id: idOrSlug }, { slug: idOrSlug }],
      };
      if (!isAdmin) {
        where.status = "ACTIVE";
      }

      const item = await LibraryMantraStotra.findOne({
        where,
        include: [
          {
            model: LibraryBranch,
            as: "branch",
            required: false,
          },
        ],
      });

      if (item) {
        if (incrementViews) {
          await item.increment("viewsCount");
          await item.reload({
            include: [
              {
                model: LibraryBranch,
                as: "branch",
                required: false,
              },
            ],
          });
        }
        const [enriched] = await this.attachBranchRefs([item]);
        return enriched;
      }
    } catch (err) {
      console.warn("Database getItemByIdOrSlug failed:", err.message);
    }

    const memItem = MEMORY_ITEMS.find(
      (i) => (i.id === idOrSlug || i.slug === idOrSlug) && (isAdmin || i.status === "ACTIVE")
    );

    if (!memItem) {
      const err = new Error("Mantra/Stotra item not found");
      err.statusCode = 404;
      throw err;
    }

    if (incrementViews) {
      memItem.viewsCount = (Number(memItem.viewsCount) || 0) + 1;
    }

    const [enriched] = await this.attachBranchRefs([memItem]);
    return enriched;
  }

  /**
   * Create new Mantra or Stotra item
   */
  async createItem(data = {}) {
    const { title, sanskrit } = data;
    if (!title || !String(title).trim()) {
      const err = new Error("Title is required");
      err.statusCode = 400;
      throw err;
    }
    if (!sanskrit || !String(sanskrit).trim()) {
      const err = new Error("Sanskrit text is required");
      err.statusCode = 400;
      throw err;
    }

    const parsedType = normalizeItemType(data.type);
    const normalizedType = parsedType || "mantra";
    const categorySlug = data.categorySlug
      ? normalizeCategorySlug(data.categorySlug)
      : normalizedType;

    const hasExplicitSlug = Boolean(data.slug && String(data.slug).trim());
    let cleanSlug = sanitizeSlug(data.slug || data.title);
    if (!cleanSlug) {
      cleanSlug = `ms-${normalizedType}-${Date.now()}`;
    }

    // Check explicit slug conflict or suffix auto-generated slug
    const memSlugConflict = MEMORY_ITEMS.some(
      (i) => i.categorySlug === categorySlug && i.slug === cleanSlug
    );
    if (memSlugConflict) {
      if (hasExplicitSlug) {
        const err = new Error(`Slug '${cleanSlug}' already exists in '${categorySlug}'`);
        err.statusCode = 409;
        throw err;
      }
      cleanSlug = `${cleanSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const resolvedBranch = await this.resolveBranch({
      branchId: data.branchId,
      branchSlug: data.branchSlug,
      categorySlug,
      type: normalizedType,
    });

    const branchId = data.branchId || resolvedBranch?.id || null;
    const branchSlug = data.branchSlug || resolvedBranch?.slug || null;

    const canonAnga =
      data.canonAnga && typeof data.canonAnga === "object" ? data.canonAnga : {};
    const vidhi = data.vidhi && typeof data.vidhi === "object" ? data.vidhi : {};
    const verses = Array.isArray(data.verses)
      ? data.verses.map((v, idx) => ({
          ...v,
          verseNo: v?.verseNo ?? idx + 1,
        }))
      : [];
    const benefits = Array.isArray(data.benefits) ? data.benefits : [];
    const tags = normalizeTags(data.tags);

    const readTime =
      data.readTime ||
      calculateReadTime(
        `${sanskrit || ""} ${data.hindiTranslation || ""} ${data.englishTranslation || ""} ${
          data.hinglishTranslation || ""
        }`
      );

    const id = data.id || `ms-${normalizedType}-${cleanSlug}-${Date.now()}`;

    const itemPayload = {
      id,
      slug: cleanSlug,
      type: normalizedType,
      categorySlug,
      branchId,
      branchSlug,
      deity: data.deity ? String(data.deity).trim() : resolvedBranch?.deity || null,
      deityHi: data.deityHi ? String(data.deityHi).trim() : null,
      title: String(title).trim(),
      titleHi: data.titleHi ? String(data.titleHi).trim() : null,
      subtitle: data.subtitle ? String(data.subtitle).trim() : null,
      subtitleHi: data.subtitleHi ? String(data.subtitleHi).trim() : null,
      sourceRef: data.sourceRef ? String(data.sourceRef).trim() : null,
      featuredImage: data.featuredImage ? String(data.featuredImage).trim() : null,
      sanskrit: String(sanskrit).trim(),
      transliteration: data.transliteration ? String(data.transliteration).trim() : null,
      hindiTranslation: data.hindiTranslation ? String(data.hindiTranslation).trim() : null,
      englishTranslation: data.englishTranslation ? String(data.englishTranslation).trim() : null,
      hinglishTranslation: data.hinglishTranslation ? String(data.hinglishTranslation).trim() : null,
      verses,
      canonAnga,
      vidhi,
      benefits,
      count: data.count ? String(data.count).trim() : null,
      rishi: data.rishi ? String(data.rishi).trim() : canonAnga.rishi || null,
      chhandas: data.chhandas ? String(data.chhandas).trim() : canonAnga.chhandas || null,
      astrologicalRemedy: data.astrologicalRemedy
        ? String(data.astrologicalRemedy).trim()
        : null,
      tags,
      audioUrl: data.audioUrl ? String(data.audioUrl).trim() : null,
      readTime,
      viewsCount: Number(data.viewsCount) || 0,
      isFeatured: Boolean(data.isFeatured ?? data.featured),
      orderIndex: Number(data.orderIndex) || 0,
      status: data.status || "ACTIVE",
    };

    try {
      await LibraryBranchService.ensureSeeded("mantra-stotra");
      if (!tableSynced) {
        await LibraryMantraStotra.sync({ alter: true });
        tableSynced = true;
      }

      if (hasExplicitSlug) {
        const existingDb = await LibraryMantraStotra.findOne({
          where: { categorySlug, slug: cleanSlug },
        });
        if (existingDb) {
          const err = new Error(`Slug '${cleanSlug}' already exists in '${categorySlug}'`);
          err.statusCode = 409;
          throw err;
        }
      }

      const created = await LibraryMantraStotra.create(itemPayload);
      const plain = created.toJSON ? created.toJSON() : { ...created };
      MEMORY_ITEMS.push(plain);
      const [enriched] = await this.attachBranchRefs([plain]);
      return enriched;
    } catch (dbErr) {
      if (dbErr.statusCode === 409 || dbErr?.name === "SequelizeUniqueConstraintError") {
        const conflictErr = new Error(
          dbErr.errors?.[0]?.message || dbErr.message || "Mantra/Stotra slug already exists"
        );
        conflictErr.statusCode = 409;
        throw conflictErr;
      }
      if (dbErr?.name === "SequelizeValidationError") {
        const valErr = new Error(dbErr.errors?.[0]?.message || dbErr.message);
        valErr.statusCode = 400;
        throw valErr;
      }

      console.warn("Database createItem failed, adding to memory store:", dbErr.message);
      const memRecord = {
        ...itemPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MEMORY_ITEMS.push(memRecord);
      const [enriched] = await this.attachBranchRefs([memRecord]);
      return enriched;
    }
  }

  /**
   * Update existing Mantra or Stotra item
   */
  async updateItem(idOrSlug, data = {}) {
    if (data.title !== undefined && (data.title === null || !String(data.title).trim())) {
      const err = new Error("Title cannot be empty");
      err.statusCode = 400;
      throw err;
    }
    if (data.sanskrit !== undefined && (data.sanskrit === null || !String(data.sanskrit).trim())) {
      const err = new Error("Sanskrit text cannot be empty");
      err.statusCode = 400;
      throw err;
    }
    if (data.slug !== undefined) {
      const cleanSlug = sanitizeSlug(data.slug || "");
      if (data.slug === null || !cleanSlug) {
        const err = new Error("Slug cannot be empty");
        err.statusCode = 400;
        throw err;
      }
    }

    const updateData = { ...data };

    if (updateData.title !== undefined) {
      updateData.title = String(updateData.title).trim();
    }
    if (updateData.sanskrit !== undefined) {
      updateData.sanskrit = String(updateData.sanskrit).trim();
    }
    if (updateData.slug !== undefined) {
      updateData.slug = sanitizeSlug(updateData.slug || "");
    }
    if (typeof updateData.type !== "undefined") {
      const parsedType = normalizeItemType(updateData.type);
      updateData.type = parsedType || "mantra";
    }
    if (typeof updateData.categorySlug !== "undefined") {
      updateData.categorySlug = normalizeCategorySlug(updateData.categorySlug);
    }
    if (typeof updateData.tags !== "undefined") {
      updateData.tags = normalizeTags(updateData.tags);
    }
    if (typeof updateData.transliteration !== "undefined") {
      updateData.transliteration = updateData.transliteration
        ? String(updateData.transliteration).trim()
        : null;
    }
    if (typeof updateData.featured !== "undefined" && typeof updateData.isFeatured === "undefined") {
      updateData.isFeatured = Boolean(updateData.featured);
      delete updateData.featured;
    }

    const hasBranchId =
      data.branchId !== undefined && data.branchId !== null && String(data.branchId).trim() !== "";
    const hasBranchSlug =
      data.branchSlug !== undefined &&
      data.branchSlug !== null &&
      String(data.branchSlug).trim() !== "";
    const clearBranchRequested =
      !hasBranchId &&
      !hasBranchSlug &&
      ((data.branchSlug !== undefined &&
        (data.branchSlug === null || String(data.branchSlug).trim() === "")) ||
        (data.branchId !== undefined &&
          (data.branchId === null || String(data.branchId).trim() === "")));

    try {
      const item =
        (await LibraryMantraStotra.findByPk(idOrSlug)) ||
        (await LibraryMantraStotra.findOne({ where: { slug: idOrSlug } }));

      if (item) {
        const dbUpdateData = { ...updateData };
        if (
          dbUpdateData.type !== undefined &&
          data.categorySlug === undefined &&
          dbUpdateData.type !== item.type &&
          normalizeCategorySlug(item.categorySlug) === item.type
        ) {
          dbUpdateData.categorySlug = dbUpdateData.type;
        }

        const targetCategorySlug = dbUpdateData.categorySlug || item.categorySlug;
        const targetSlug = dbUpdateData.slug || item.slug;

        if (targetSlug !== item.slug || targetCategorySlug !== item.categorySlug) {
          const conflict = await LibraryMantraStotra.findOne({
            where: {
              categorySlug: targetCategorySlug,
              slug: targetSlug,
              id: { [Op.ne]: item.id },
            },
          });
          if (conflict) {
            const err = new Error(`Slug '${targetSlug}' already exists in '${targetCategorySlug}'`);
            err.statusCode = 409;
            throw err;
          }
        }

        if (hasBranchId && !hasBranchSlug) {
          const suppliedId = String(data.branchId).trim();
          const resolvedBranch = await this.resolveBranch({
            branchId: suppliedId,
            categorySlug: targetCategorySlug,
            type: dbUpdateData.type || item.type,
          });
          dbUpdateData.branchId = suppliedId;
          dbUpdateData.branchSlug = resolvedBranch ? resolvedBranch.slug : null;
        } else if (hasBranchSlug && !hasBranchId) {
          const suppliedSlug = String(data.branchSlug).trim();
          const resolvedBranch = await this.resolveBranch({
            branchSlug: suppliedSlug,
            categorySlug: targetCategorySlug,
            type: dbUpdateData.type || item.type,
          });
          dbUpdateData.branchId = resolvedBranch ? resolvedBranch.id : null;
          dbUpdateData.branchSlug = resolvedBranch ? resolvedBranch.slug : suppliedSlug;
        } else if (hasBranchId && hasBranchSlug) {
          const suppliedId = String(data.branchId).trim();
          const suppliedSlug = String(data.branchSlug).trim();
          const resolvedBranch = await this.resolveBranch({
            branchId: suppliedId,
            branchSlug: suppliedSlug,
            categorySlug: targetCategorySlug,
            type: dbUpdateData.type || item.type,
          });
          dbUpdateData.branchId = resolvedBranch ? resolvedBranch.id : suppliedId;
          dbUpdateData.branchSlug = resolvedBranch ? resolvedBranch.slug : suppliedSlug;
        } else if (clearBranchRequested) {
          dbUpdateData.branchId = null;
          dbUpdateData.branchSlug = null;
        }

        await item.update(dbUpdateData);
        const plain = item.toJSON ? item.toJSON() : { ...item };
        const memIdx = MEMORY_ITEMS.findIndex((i) => i.id === item.id || i.slug === idOrSlug);
        if (memIdx !== -1) {
          MEMORY_ITEMS[memIdx] = { ...MEMORY_ITEMS[memIdx], ...plain };
        } else {
          MEMORY_ITEMS.push(plain);
        }
        const [enriched] = await this.attachBranchRefs([plain]);
        return enriched;
      }
    } catch (dbErr) {
      if (dbErr.statusCode === 409 || dbErr?.name === "SequelizeUniqueConstraintError") {
        const conflictErr = new Error(dbErr.message || "Slug conflict");
        conflictErr.statusCode = 409;
        throw conflictErr;
      }
      if (dbErr.statusCode === 400 || dbErr?.name === "SequelizeValidationError") {
        const valErr = new Error(dbErr.errors?.[0]?.message || dbErr.message);
        valErr.statusCode = 400;
        throw valErr;
      }
      console.warn("Database updateItem failed, updating memory store:", dbErr.message);
    }

    const memIdx = MEMORY_ITEMS.findIndex((i) => i.id === idOrSlug || i.slug === idOrSlug);
    if (memIdx === -1) {
      const err = new Error("Mantra/Stotra item not found");
      err.statusCode = 404;
      throw err;
    }

    const current = MEMORY_ITEMS[memIdx];
    const memUpdateData = { ...updateData };
    if (
      memUpdateData.type !== undefined &&
      data.categorySlug === undefined &&
      memUpdateData.type !== current.type &&
      normalizeCategorySlug(current.categorySlug) === current.type
    ) {
      memUpdateData.categorySlug = memUpdateData.type;
    }

    const targetCategorySlug = memUpdateData.categorySlug || current.categorySlug;
    const targetSlug = memUpdateData.slug || current.slug;

    if (targetSlug !== current.slug || targetCategorySlug !== current.categorySlug) {
      const conflict = MEMORY_ITEMS.some(
        (i) => i.id !== current.id && i.categorySlug === targetCategorySlug && i.slug === targetSlug
      );
      if (conflict) {
        const err = new Error(`Slug '${targetSlug}' already exists in '${targetCategorySlug}'`);
        err.statusCode = 409;
        throw err;
      }
    }

    if (hasBranchId && !hasBranchSlug) {
      const suppliedId = String(data.branchId).trim();
      const resolvedBranch = await this.resolveBranch({
        branchId: suppliedId,
        categorySlug: targetCategorySlug,
        type: memUpdateData.type || current.type,
      });
      memUpdateData.branchId = suppliedId;
      memUpdateData.branchSlug = resolvedBranch ? resolvedBranch.slug : null;
    } else if (hasBranchSlug && !hasBranchId) {
      const suppliedSlug = String(data.branchSlug).trim();
      const resolvedBranch = await this.resolveBranch({
        branchSlug: suppliedSlug,
        categorySlug: targetCategorySlug,
        type: memUpdateData.type || current.type,
      });
      memUpdateData.branchId = resolvedBranch ? resolvedBranch.id : null;
      memUpdateData.branchSlug = resolvedBranch ? resolvedBranch.slug : suppliedSlug;
    } else if (hasBranchId && hasBranchSlug) {
      const suppliedId = String(data.branchId).trim();
      const suppliedSlug = String(data.branchSlug).trim();
      const resolvedBranch = await this.resolveBranch({
        branchId: suppliedId,
        branchSlug: suppliedSlug,
        categorySlug: targetCategorySlug,
        type: memUpdateData.type || current.type,
      });
      memUpdateData.branchId = resolvedBranch ? resolvedBranch.id : suppliedId;
      memUpdateData.branchSlug = resolvedBranch ? resolvedBranch.slug : suppliedSlug;
    } else if (clearBranchRequested) {
      memUpdateData.branchId = null;
      memUpdateData.branchSlug = null;
    }

    MEMORY_ITEMS[memIdx] = {
      ...current,
      ...memUpdateData,
      updatedAt: new Date().toISOString(),
    };
    const [enriched] = await this.attachBranchRefs([MEMORY_ITEMS[memIdx]]);
    return enriched;
  }

  /**
   * Delete item
   */
  async deleteItem(idOrSlug) {
    let deletedFromDb = false;

    try {
      const item =
        (await LibraryMantraStotra.findByPk(idOrSlug)) ||
        (await LibraryMantraStotra.findOne({ where: { slug: idOrSlug } }));

      if (item) {
        await item.destroy();
        deletedFromDb = true;
      }
    } catch (dbErr) {
      console.warn("Database deleteItem failed, mutating memory store:", dbErr.message);
    }

    const beforeLen = MEMORY_ITEMS.length;
    MEMORY_ITEMS = MEMORY_ITEMS.filter((i) => i.id !== idOrSlug && i.slug !== idOrSlug);
    const deletedFromMemory = MEMORY_ITEMS.length < beforeLen;

    if (!deletedFromDb && !deletedFromMemory) {
      const err = new Error("Mantra/Stotra item not found");
      err.statusCode = 404;
      throw err;
    }

    return true;
  }

  /**
   * Seed default branches & items
   */
  async seedDefaults(overwrite = false) {
    let branchesSeeded = 0;
    let itemsSeeded = 0;
    let mode = "memory";

    try {
      await LibraryBranchService.ensureSeeded("mantra-stotra");
      if (!tableSynced) {
        await LibraryMantraStotra.sync({ alter: true });
        tableSynced = true;
      }

      for (const branch of DEFAULT_MANTRA_BRANCHES_UNIFIED) {
        if (overwrite) {
          await LibraryBranch.upsert(branch);
          branchesSeeded++;
        } else {
          const [, created] = await LibraryBranch.findOrCreate({
            where: { id: branch.id },
            defaults: branch,
          });
          if (created) branchesSeeded++;
        }
      }

      for (const item of DEFAULT_MANTRA_STOTRAS) {
        const defaults = {
          ...item,
          viewsCount: Number(item.viewsCount) || 0,
          readTime:
            item.readTime ||
            calculateReadTime(
              `${item.sanskrit || ""} ${item.hindiTranslation || ""} ${item.englishTranslation || ""}`
            ),
        };
        if (overwrite) {
          await LibraryMantraStotra.upsert(defaults);
          itemsSeeded++;
        } else {
          const [, created] = await LibraryMantraStotra.findOrCreate({
            where: { id: item.id },
            defaults,
          });
          if (created) itemsSeeded++;
        }
      }

      const totalItems = await LibraryMantraStotra.count();
      mode = "database";
      return {
        branchesSeeded,
        itemsSeeded,
        totalItems,
        mode,
      };
    } catch (err) {
      console.warn("Database seedDefaults failed, seeding memory store:", err.message);
    }

    // Memory seed fallback
    for (const item of DEFAULT_MANTRA_STOTRAS) {
      const idx = MEMORY_ITEMS.findIndex((i) => i.id === item.id);
      if (idx === -1) {
        MEMORY_ITEMS.push({
          ...JSON.parse(JSON.stringify(item)),
          viewsCount: Number(item.viewsCount) || 0,
          readTime:
            item.readTime ||
            calculateReadTime(
              `${item.sanskrit || ""} ${item.hindiTranslation || ""} ${item.englishTranslation || ""}`
            ),
        });
        itemsSeeded++;
      } else if (overwrite) {
        MEMORY_ITEMS[idx] = {
          ...JSON.parse(JSON.stringify(item)),
          viewsCount: Number(item.viewsCount) || 0,
          readTime:
            item.readTime ||
            calculateReadTime(
              `${item.sanskrit || ""} ${item.hindiTranslation || ""} ${item.englishTranslation || ""}`
            ),
        };
        itemsSeeded++;
      }
    }

    return {
      branchesSeeded: DEFAULT_MANTRA_BRANCHES_UNIFIED.length,
      itemsSeeded,
      totalItems: MEMORY_ITEMS.length,
      mode,
    };
  }
}

export default new LibraryMantraStotraService();
