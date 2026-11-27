import { Op } from "sequelize";
import LibrarySection from "../models/librarySection.model.js";

export const DEFAULT_LIBRARY_SECTIONS = [
  {
    id: "section-mantra",
    slug: "mantra",
    name: "मंत्र",
    enName: "Mantras",
    label: "Mantras",
    labelHi: "मंत्र",
    path: "/mantras",
    adminPath: "/admin/library/mantra-branches",
    categorySlug: "mantra-stotra",
    orderIndex: 1,
    status: "ACTIVE",
    isPreset: true,
  },
  {
    id: "section-stotra",
    slug: "stotra",
    name: "स्तोत्र",
    enName: "Stotras",
    label: "Stotras",
    labelHi: "स्तोत्र",
    path: "/stotras",
    adminPath: "/admin/library/stotra-branches",
    categorySlug: "mantra-stotra",
    orderIndex: 2,
    status: "ACTIVE",
    isPreset: true,
  },
  {
    id: "section-sukti",
    slug: "sukti",
    name: "सूक्त",
    enName: "Suktis",
    label: "Suktis",
    labelHi: "सूक्त",
    path: "/suktis",
    adminPath: "/admin/library/sukti-branches",
    categorySlug: "mantra-stotra",
    orderIndex: 3,
    status: "ACTIVE",
    isPreset: true,
  },
  {
    id: "section-puranas",
    slug: "puranas",
    name: "पुराण",
    enName: "Puranas",
    label: "Puranas",
    labelHi: "पुराण",
    path: "/library/purana",
    adminPath: "/admin/library/puranas-branches",
    categorySlug: "mantra-stotra",
    orderIndex: 4,
    status: "ACTIVE",
    isPreset: false,
  },
];

let MEMORY_SECTIONS = JSON.parse(JSON.stringify(DEFAULT_LIBRARY_SECTIONS));
let sectionTableSynced = false;

const sanitizeSlug = (raw) =>
  String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const KNOWN_LABELS = {
  purana: { hi: "पुराण", en: "Puranas" },
  puranas: { hi: "पुराण", en: "Puranas" },
  sukti: { hi: "सूक्त", en: "Suktis" },
  suktis: { hi: "सूक्त", en: "Suktis" },
  sukta: { hi: "सूक्त", en: "Suktas" },
  suktas: { hi: "सूक्त", en: "Suktas" },
  stuti: { hi: "स्तुति", en: "Stutis" },
  kavach: { hi: "कवच", en: "Kavach" },
  aarti: { hi: "आरती", en: "Aartis" },
  chalisa: { hi: "चालीसा", en: "Chalisas" },
  ashtakam: { hi: "अष्टकम", en: "Ashtakams" },
  sahasranama: { hi: "सहस्रनाम", en: "Sahasranama" },
  namavali: { hi: "नामावली", en: "Namavali" },
  mantra: { hi: "मंत्र", en: "Mantras" },
  stotra: { hi: "स्तोत्र", en: "Stotras" },
};

class LibrarySectionService {
  async ensureSeeded() {
    try {
      if (!sectionTableSynced) {
        await LibrarySection.sync({ alter: true });
        sectionTableSynced = true;
      }
      const count = await LibrarySection.count();
      if (count === 0) {
        for (const item of DEFAULT_LIBRARY_SECTIONS) {
          await LibrarySection.findOrCreate({
            where: { slug: item.slug },
            defaults: item,
          });
        }
      }
    } catch (err) {
      console.warn("Could not sync/seed LibrarySection:", err.message);
    }
  }

  async getSections(isAdmin = false) {
    await this.ensureSeeded();
    try {
      const where = isAdmin ? {} : { status: "ACTIVE" };
      const rows = await LibrarySection.findAll({
        where,
        order: [["orderIndex", "ASC"], ["createdAt", "ASC"]],
      });
      if (rows && rows.length > 0) {
        return rows.map((r) => (typeof r.toJSON === "function" ? r.toJSON() : r));
      }
    } catch {
      // fallback
    }

    const items = isAdmin
      ? MEMORY_SECTIONS
      : MEMORY_SECTIONS.filter((s) => s.status === "ACTIVE");
    return items.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  }

  async createSection(data) {
    await this.ensureSeeded();

    const rawLabel = String(data.name || data.label || data.enName || "").trim();
    if (!rawLabel) {
      const err = new Error("Section name or label is required");
      err.statusCode = 400;
      throw err;
    }

    const slug = sanitizeSlug(data.slug || rawLabel);
    if (!slug) {
      const err = new Error("Invalid section slug");
      err.statusCode = 400;
      throw err;
    }

    const labelKnown = KNOWN_LABELS[slug] || {};
    const label = data.label || data.enName || rawLabel;
    const labelHi = data.labelHi || labelKnown.hi || data.name || rawLabel;
    const enName = data.enName || labelKnown.en || rawLabel;
    const name = data.name || labelHi || rawLabel;

    let path = data.path;
    if (!path) {
      if (slug === "purana" || slug === "puranas") {
        path = "/library/purana";
      } else if (slug === "mantra") {
        path = "/mantras";
      } else if (slug === "stotra") {
        path = "/stotras";
      } else if (slug === "sukti") {
        path = "/suktis";
      } else {
        path = `/library/mantra-stotra/all?type=${slug}`;
      }
    }

    const adminPath = data.adminPath || `/admin/library/${slug}-branches`;
    const id = data.id || `section-${slug}`;

    const newRecord = {
      id,
      slug,
      name,
      enName,
      label,
      labelHi,
      path,
      adminPath,
      categorySlug: data.categorySlug || "mantra-stotra",
      orderIndex: data.orderIndex || 10,
      status: "ACTIVE",
      isPreset: false,
    };

    try {
      const [record, created] = await LibrarySection.findOrCreate({
        where: { [Op.or]: [{ id }, { slug }] },
        defaults: newRecord,
      });

      if (!created) {
        await record.update({
          ...newRecord,
          status: "ACTIVE",
        });
      }

      const result = typeof record.toJSON === "function" ? record.toJSON() : record;
      // sync in memory
      const memIdx = MEMORY_SECTIONS.findIndex((s) => s.id === id || s.slug === slug);
      if (memIdx >= 0) {
        MEMORY_SECTIONS[memIdx] = result;
      } else {
        MEMORY_SECTIONS.push(result);
      }
      return result;
    } catch (err) {
      console.warn("DB save failed for LibrarySection, storing in-memory:", err.message);
      const memIdx = MEMORY_SECTIONS.findIndex((s) => s.id === id || s.slug === slug);
      if (memIdx >= 0) {
        MEMORY_SECTIONS[memIdx] = newRecord;
      } else {
        MEMORY_SECTIONS.push(newRecord);
      }
      return newRecord;
    }
  }

  async deleteSection(idOrSlug) {
    await this.ensureSeeded();
    try {
      await LibrarySection.destroy({
        where: {
          [Op.or]: [{ id: idOrSlug }, { slug: idOrSlug }],
          isPreset: false,
        },
      });
    } catch (err) {
      console.warn("DB delete failed for LibrarySection:", err.message);
    }

    MEMORY_SECTIONS = MEMORY_SECTIONS.filter(
      (s) => s.id !== idOrSlug && s.slug !== idOrSlug
    );
    return true;
  }
}

export default new LibrarySectionService();
