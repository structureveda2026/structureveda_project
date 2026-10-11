import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { default: db, YagyaCategory, YagyaService } = await import("../models/index.js");

export const YAGYA_CATEGORY_SEED_DATA = [
  {
    name: "Shiva & Healing Yagya",
    slug: "shiva-healing-yagya",
    description: "Grand Vedic Yagyas dedicated to Lord Shiva and Mrityunjaya for supreme health, longevity, soul purification, and overcoming karmic afflictions.",
    displayOrder: 1,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Ganapati & Siddhi Yagya",
    slug: "ganapati-siddhi-yagya",
    description: "Auspicious Maha Yagyas dedicated to Lord Ganesha for unobstructed success, intellect, mastery, and new beginnings.",
    displayOrder: 2,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Lakshmi & Prosperity Yagya",
    slug: "lakshmi-prosperity-yagya",
    description: "Sacred fire ceremonies honoring Goddess Maha Lakshmi and Lord Kubera for abundance, wealth, and commercial flourishing.",
    displayOrder: 3,
    iconName: "Coins",
    isActive: true,
  },
  {
    name: "Durga & Shakti Yagya",
    slug: "durga-shakti-yagya",
    description: "Potent Chandi and Durga Maha Yagyas invoking Supreme Shakti for divine protection, courage, and destruction of negative energies.",
    displayOrder: 4,
    iconName: "ShieldCheck",
    isActive: true,
  },
  {
    name: "Navagraha & Planetary Yagya",
    slug: "navagraha-planetary-yagya",
    description: "Comprehensive planetary pacification Yagyas to harmonize planetary influences, neutralize doshas, and bring cosmic balance.",
    displayOrder: 5,
    iconName: "Compass",
    isActive: true,
  },
];

// Deterministic mapping of canonical Yagya service slugs to their respective Category slug
export const YAGYA_SERVICE_CATEGORY_MAPPINGS = {
  "maha-mrityunjaya-yagya": "shiva-healing-yagya",
  "maha-rudra-yagya-kashi": "shiva-healing-yagya",
  "maha-ganapati-atharvashirsha-yagya": "ganapati-siddhi-yagya",
  "maha-lakshmi-kubera-yagya": "lakshmi-prosperity-yagya",
  "durga-saptashati-chandi-homa": "durga-shakti-yagya",
  "navagraha-shanti-maha-yagya": "navagraha-planetary-yagya",
};

export const seedYagyaCategories = async () => {
  console.log("Starting Yagya Categories Seeding & Mapping...");

  // 1. Seed Categories (Idempotent)
  const categoryMap = new Map();

  for (const catData of YAGYA_CATEGORY_SEED_DATA) {
    let [category, created] = await YagyaCategory.findOrCreate({
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

  console.log(`Successfully seeded ${categoryMap.size} Yagya categories.`);

  // 2. Map existing Yagya services
  const allServices = await YagyaService.findAll({ order: [["name", "ASC"]] });
  console.log(`Found ${allServices.length} existing Yagya services in database.`);

  const mappedResults = [];
  const unmappedServices = [];

  for (const service of allServices) {
    const targetCategorySlug = YAGYA_SERVICE_CATEGORY_MAPPINGS[service.slug];

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

  console.log("\n=================== YAGYA SEED SUMMARY ===================");
  console.log(`Total Categories: ${categoryMap.size}`);
  console.log(`Total Yagya Services: ${allServices.length}`);
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
  seedYagyaCategories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Yagya Seeding error:", err);
      process.exit(1);
    });
}
