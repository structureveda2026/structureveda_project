import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { default: db, JapaCategory, JapaService } = await import("../models/index.js");

export const JAPA_CATEGORY_SEED_DATA = [
  {
    name: "Shiva & Moola Mantra Japa",
    slug: "shiva-mantra-japa",
    description: "Potent Japa Anushthans invoking Lord Shiva for longevity, inner healing, karmic purification, and spiritual liberation.",
    displayOrder: 1,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Gayatri & Vedic Wisdom Japa",
    slug: "gayatri-vedic-japa",
    description: "Sacred Vedic recitation of the Savitur Gayatri mantra for intellect purification, wisdom, clarity, and solar vital energy.",
    displayOrder: 2,
    iconName: "Flame",
    isActive: true,
  },
  {
    name: "Durga & Shakti Japa",
    slug: "durga-shakti-japa",
    description: "Consecrated Durga Saptashati and Navarna Mantra recitations invoking the Supreme Goddess for strength, victory, and divine protection.",
    displayOrder: 3,
    iconName: "ShieldCheck",
    isActive: true,
  },
  {
    name: "Hanuman & Sankat Mochan Japa",
    slug: "hanuman-raksha-japa",
    description: "Powerful Hanuman Moola Mantra Anushthan for fearless courage, dispelling malevolent influences, and overcoming life obstacles.",
    displayOrder: 4,
    iconName: "Shield",
    isActive: true,
  },
  {
    name: "Ganapati & Siddhi Japa",
    slug: "ganapati-siddhi-japa",
    description: "Sacred Ganapati Atharvashirsha and Moola Mantra recitations for obstacle removal, wisdom, and auspicious new beginnings.",
    displayOrder: 5,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Lakshmi & Prosperity Japa",
    slug: "lakshmi-prosperity-japa",
    description: "Consecrated recitation of Shri Suktam and Lakshmi mantras for sustained prosperity, financial stability, and divine grace.",
    displayOrder: 6,
    iconName: "Coins",
    isActive: true,
  },
  {
    name: "Navagraha & Planetary Japa",
    slug: "navagraha-planetary-japa",
    description: "Structured planetary mantra japa to harmonize astrological planetary influences, pacify afflicted grahas, and bring cosmic balance.",
    displayOrder: 7,
    iconName: "Compass",
    isActive: true,
  },
];

// Deterministic mapping of canonical Japa service slugs to their respective Category slug
export const JAPA_SERVICE_CATEGORY_MAPPINGS = {
  "maha-mrityunjaya-japa": "shiva-mantra-japa",
  "shiva-panchakshari-japa": "shiva-mantra-japa",
  "gayatri-mantra-japa": "gayatri-vedic-japa",
  "durga-saptashati-mantra-japa": "durga-shakti-japa",
  "hanuman-mantra-japa": "hanuman-raksha-japa",
  "ganapati-atharvashirsha-japa": "ganapati-siddhi-japa",
  "maha-lakshmi-shri-suktam-japa": "lakshmi-prosperity-japa",
  "navagraha-mantra-japa": "navagraha-planetary-japa",
};

export const seedJapaCategories = async () => {
  console.log("Starting Japa Categories Seeding & Mapping...");

  // 1. Seed Categories (Idempotent)
  const categoryMap = new Map();

  for (const catData of JAPA_CATEGORY_SEED_DATA) {
    let [category, created] = await JapaCategory.findOrCreate({
      where: { slug: catData.slug },
      defaults: {
        id: randomUUID(),
        ...catData,
      },
    });

    if (!created) {
      await category.update({
        name: catData.name,
        description: catData.description,
        iconName: catData.iconName,
        displayOrder: catData.displayOrder,
        isActive: catData.isActive,
      });
      console.log(`  - Category updated: "${category.name}" (${category.slug}) [Order: ${category.displayOrder}]`);
    } else {
      console.log(`  + Category created: "${category.name}" (${category.slug}) [Order: ${category.displayOrder}]`);
    }

    categoryMap.set(category.slug, category.id);
  }

  console.log(`Successfully seeded ${categoryMap.size} Japa categories.`);

  // 2. Map existing Japa services
  const allServices = await JapaService.findAll({ order: [["name", "ASC"]] });
  console.log(`Found ${allServices.length} existing Japa services in database.`);

  const mappedResults = [];
  const unmappedServices = [];

  for (const service of allServices) {
    const targetCategorySlug = JAPA_SERVICE_CATEGORY_MAPPINGS[service.slug];

    if (targetCategorySlug && categoryMap.has(targetCategorySlug)) {
      const targetCategoryId = categoryMap.get(targetCategorySlug);
      await service.update({ categoryId: targetCategoryId });
      mappedResults.push({
        id: service.id,
        name: service.name,
        slug: service.slug,
        categorySlug: targetCategorySlug,
        categoryId: targetCategoryId,
      });
      console.log(`  ✔ Mapped: "${service.name}" (${service.slug}) -> Category: "${targetCategorySlug}"`);
    } else {
      unmappedServices.push({
        id: service.id,
        name: service.name,
        slug: service.slug,
        currentCategoryId: service.categoryId || null,
        reason: targetCategorySlug ? "Category slug not in categoryMap" : "No confident mapping defined (remains NULL)",
      });
      console.log(`  ⚠ Unmapped: "${service.name}" (${service.slug}) -> categoryId remains NULL`);
    }
  }

  console.log("\n=================== JAPA SEED SUMMARY ===================");
  console.log(`Total Categories: ${categoryMap.size}`);
  console.log(`Total Japa Services: ${allServices.length}`);
  console.log(`Successfully Mapped Services: ${mappedResults.length}`);
  console.log(`Unmapped Services: ${unmappedServices.length}`);
  console.log("==========================================================\n");

  return {
    categoriesCount: categoryMap.size,
    servicesCount: allServices.length,
    mappedResults,
    unmappedServices,
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedJapaCategories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Japa Seeding error:", err);
      process.exit(1);
    });
}
