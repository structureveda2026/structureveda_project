import LibraryBranch from "../models/libraryBranch.model.js";

export const DEFAULT_MANTRA_BRANCHES = [
  {
    id: "branch-shiva",
    categorySlug: "mantra-stotra",
    slug: "shiva",
    name: "शिव मंत्र एवं स्तोत्र",
    enName: "Shiva Mantras & Stotras",
    desc: "महामृत्युंजय, शिव तांडव, रुद्राष्टकम, पञ्चाक्षर मंत्र एवं कर्पूरगौरं स्तुति।",
    stats: "२५+ स्तोत्र व मंत्र",
    badge: "स्तोत्र व मंत्र",
    deity: "shiva",
    imageKey: "deity-shiva.jpg",
    orderIndex: 1,
    status: "ACTIVE",
  },
  {
    id: "branch-vishnu",
    categorySlug: "mantra-stotra",
    slug: "vishnu",
    name: "विष्णु मंत्र एवं स्तोत्र",
    enName: "Vishnu Mantras & Stotras",
    desc: "विष्णु सहस्रनाम, नारायण कवच, द्वादशाक्षर मंत्र एवं पुरुष सूक्त।",
    stats: "२०+ स्तोत्र व मंत्र",
    badge: "स्तोत्र व मंत्र",
    deity: "vishnu",
    imageKey: "deity-vishnu.jpg",
    orderIndex: 2,
    status: "ACTIVE",
  },
  {
    id: "branch-devi",
    categorySlug: "mantra-stotra",
    slug: "devi",
    name: "देवी मंत्र एवं सूक्त",
    enName: "Devi Mantras & Suktas",
    desc: "श्री सूक्त, दुर्गा सप्तशती, कनकधारा स्तोत्र, ललिता सहस्रनाम।",
    stats: "३०+ स्तोत्र व मंत्र",
    badge: "सूक्त व स्तोत्र",
    deity: "devi",
    imageKey: "deity-durga.jpg",
    orderIndex: 3,
    status: "ACTIVE",
  },
  {
    id: "branch-gayatri",
    categorySlug: "mantra-stotra",
    slug: "gayatri",
    name: "वैदिक शांति व गायत्री मंत्र",
    enName: "Vaidika Shanti & Gayatri",
    desc: "महाशांति पाठ, गायत्री महामंत्र, पवमान व हिरण्यगर्भ सूक्त।",
    stats: "१५+ वैदिक सूक्त",
    badge: "वैदिक सूक्त",
    deity: "gayatri",
    imageKey: "deity-saraswati.jpg",
    orderIndex: 4,
    status: "ACTIVE",
  },
  {
    id: "branch-ganesh",
    categorySlug: "mantra-stotra",
    slug: "ganesh",
    name: "श्री गणेश मंत्र व स्तुति",
    enName: "Ganesh Mantras & Stutis",
    desc: "संकटनाशन गणेश स्तोत्र, अथर्वशीर्ष, वक्रतुण्ड महामंत्र।",
    stats: "१०+ स्तोत्र व मंत्र",
    badge: "स्तोत्र व स्तुति",
    deity: "ganesh",
    imageKey: "deity-ganesh.jpg",
    orderIndex: 5,
    status: "ACTIVE",
  },
  {
    id: "branch-surya",
    categorySlug: "mantra-stotra",
    slug: "surya",
    name: "सूर्य एवं नवग्रह मंत्र",
    enName: "Surya & Navagraha Mantras",
    desc: "आदित्य हृदय स्तोत्र, नवग्रह स्तोत्र एवं शांति विधान।",
    stats: "१२+ स्तोत्र व मंत्र",
    badge: "नवग्रह शांति",
    deity: "surya",
    imageKey: "deity-navagraha.jpg",
    orderIndex: 6,
    status: "ACTIVE",
  },
  {
    id: "branch-hanuman",
    categorySlug: "mantra-stotra",
    slug: "hanuman",
    name: "हनुमान चालीसा एवं स्तोत्र",
    enName: "Hanuman Chalisa & Stotras",
    desc: "हनुमान चालीसा, बजरंग बाण, संकटमोचन हनुमानाष्टक।",
    stats: "८+ स्तोत्र व पाठ",
    badge: "चालीसा व पाठ",
    deity: "hanuman",
    imageKey: "card-puja.jpg",
    orderIndex: 7,
    status: "ACTIVE",
  },
];

let MEMORY_BRANCHES = JSON.parse(JSON.stringify(DEFAULT_MANTRA_BRANCHES));

class LibraryBranchService {
  /**
   * Ensure table is synced and seed defaults if empty
   */
  async ensureSeeded(categorySlug = "mantra-stotra") {
    try {
      await LibraryBranch.sync({ alter: true });
      const count = await LibraryBranch.count({ where: { categorySlug } });
      if (count === 0 && categorySlug === "mantra-stotra") {
        for (const item of DEFAULT_MANTRA_BRANCHES) {
          await LibraryBranch.create(item);
        }
      }
    } catch (err) {
      console.warn("Could not sync/seed LibraryBranch:", err.message);
    }
  }

  /**
   * Get all subcategories/branches for a category (e.g. mantra-stotra)
   */
  async getSubcategories(categorySlug = "mantra-stotra", isAdmin = false) {
    try {
      await this.ensureSeeded(categorySlug);
      const where = { categorySlug };
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
        return branches;
      }
    } catch (err) {
      console.warn("Database fetch failed for LibraryBranch:", err.message);
    }

    // Default fallback if database query failed or table is being created
    if (categorySlug === "mantra-stotra") {
      return isAdmin ? MEMORY_BRANCHES : MEMORY_BRANCHES.filter(b => b.status === "ACTIVE");
    }
    return [];
  }

  /**
   * Create new subcategory branch
   */
  async createSubcategory(data) {
    const {
      categorySlug = "mantra-stotra",
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

    if (!name || !String(name).trim()) {
      throw new Error("Branch name is required");
    }

    const cleanSlug = (slug || name)
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    const id = `branch-${cleanSlug}-${Date.now()}`;

    try {
      await LibraryBranch.sync({ alter: true });
      const created = await LibraryBranch.create({
        id,
        categorySlug,
        slug: cleanSlug,
        name: String(name).trim(),
        enName: enName ? String(enName).trim() : null,
        desc: desc ? String(desc).trim() : null,
        stats: stats ? String(stats).trim() : "१०+ स्तोत्र व मंत्र",
        badge: badge ? String(badge).trim() : null,
        deity: deity ? String(deity).trim() : cleanSlug,
        imageKey: imageKey ? String(imageKey).trim() : null,
        orderIndex: Number(orderIndex) || 0,
        status,
      });
      const plain = created.toJSON ? created.toJSON() : created;
      const existingIdx = MEMORY_BRANCHES.findIndex((b) => b.slug === cleanSlug || b.id === id);
      if (existingIdx !== -1) {
        MEMORY_BRANCHES[existingIdx] = { ...MEMORY_BRANCHES[existingIdx], ...plain };
      } else {
        MEMORY_BRANCHES.push(plain);
      }
      return created;
    } catch (dbErr) {
      console.warn("Database create failed for LibraryBranch, saving to memory store:", dbErr.message);
      const newBranch = {
        id,
        categorySlug,
        slug: cleanSlug,
        name: String(name).trim(),
        enName: enName ? String(enName).trim() : null,
        desc: desc ? String(desc).trim() : null,
        stats: stats ? String(stats).trim() : "१०+ स्तोत्र व मंत्र",
        badge: badge ? String(badge).trim() : null,
        deity: deity ? String(deity).trim() : cleanSlug,
        imageKey: imageKey ? String(imageKey).trim() : null,
        orderIndex: Number(orderIndex) || 0,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const existingIdx = MEMORY_BRANCHES.findIndex((b) => b.slug === cleanSlug || b.id === id);
      if (existingIdx !== -1) {
        MEMORY_BRANCHES[existingIdx] = { ...MEMORY_BRANCHES[existingIdx], ...newBranch };
        return MEMORY_BRANCHES[existingIdx];
      } else {
        MEMORY_BRANCHES.push(newBranch);
        return newBranch;
      }
    }
  }

  /**
   * Update existing branch
   */
  async updateSubcategory(id, data) {
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

    try {
      const branch = (await LibraryBranch.findByPk(id)) || (await LibraryBranch.findOne({ where: { slug: id } }));
      if (branch) {
        await branch.update({
          name: typeof name !== "undefined" ? String(name).trim() : branch.name,
          enName: typeof enName !== "undefined" ? (enName ? String(enName).trim() : null) : branch.enName,
          slug: typeof slug !== "undefined" && slug ? String(slug).trim() : branch.slug,
          desc: typeof desc !== "undefined" ? (desc ? String(desc).trim() : null) : branch.desc,
          stats: typeof stats !== "undefined" ? (stats ? String(stats).trim() : null) : branch.stats,
          badge: typeof badge !== "undefined" ? (badge ? String(badge).trim() : null) : branch.badge,
          deity: typeof deity !== "undefined" ? (deity ? String(deity).trim() : null) : branch.deity,
          imageKey: typeof imageKey !== "undefined" ? (imageKey ? String(imageKey).trim() : null) : branch.imageKey,
          orderIndex: typeof orderIndex !== "undefined" ? Number(orderIndex) : branch.orderIndex,
          status: typeof status !== "undefined" ? status : branch.status,
        });
        const plain = branch.toJSON ? branch.toJSON() : branch;
        const memIdx = MEMORY_BRANCHES.findIndex((b) => b.id === id || b.slug === id);
        if (memIdx !== -1) {
          MEMORY_BRANCHES[memIdx] = { ...MEMORY_BRANCHES[memIdx], ...plain };
        } else {
          MEMORY_BRANCHES.push(plain);
        }
        return branch;
      }
    } catch (dbErr) {
      console.warn("Database update failed for LibraryBranch, updating memory store:", dbErr.message);
    }

    const memIdx = MEMORY_BRANCHES.findIndex((b) => b.id === id || b.slug === id);
    if (memIdx !== -1) {
      MEMORY_BRANCHES[memIdx] = {
        ...MEMORY_BRANCHES[memIdx],
        ...(name && { name: String(name).trim() }),
        ...(typeof enName !== "undefined" && { enName: enName ? String(enName).trim() : null }),
        ...(slug && { slug: String(slug).trim() }),
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
  async deleteSubcategory(id) {
    try {
      const branch = (await LibraryBranch.findByPk(id)) || (await LibraryBranch.findOne({ where: { slug: id } }));
      if (branch) {
        await branch.destroy();
      }
    } catch (dbErr) {
      console.warn("Database delete failed for LibraryBranch, mutating memory store:", dbErr.message);
    }

    const beforeLen = MEMORY_BRANCHES.length;
    MEMORY_BRANCHES = MEMORY_BRANCHES.filter((b) => b.id !== id && b.slug !== id);
    return true;
  }

  /**
   * Reorder subcategories/branches
   */
  async reorderSubcategories(categorySlug = "mantra-stotra", orderedIds = []) {
    const list = Array.isArray(orderedIds)
      ? orderedIds
      : orderedIds?.orderedIds || orderedIds?.items || [];

    if (!Array.isArray(list)) {
      throw new Error("orderedIds must be an array");
    }

    // 1. Update memory store
    list.forEach((item, index) => {
      const id = typeof item === "string" ? item : item?.id || item?.slug;
      const orderIndex =
        typeof item === "object" && typeof item?.orderIndex === "number"
          ? item.orderIndex
          : index + 1;
      const branch = MEMORY_BRANCHES.find((b) => b.id === id || b.slug === id);
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
          const branch =
            (await LibraryBranch.findByPk(id)) ||
            (await LibraryBranch.findOne({ where: { slug: id, categorySlug } }));
          if (branch) {
            await branch.update({ orderIndex });
          }
        }
      }
    } catch (dbErr) {
      console.warn("Database reorder failed for LibraryBranch, in-memory updated:", dbErr.message);
    }

    return this.getSubcategories(categorySlug, true);
  }
}

export default new LibraryBranchService();
