import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { default: db, PujaCategory, PujaService } = await import("../models/index.js");

export const CATEGORY_SEED_DATA = [
  {
    name: "Ganesh Puja",
    slug: "ganesh-puja",
    description: "Invoking Lord Ganesha's sacred blessings for auspicious beginnings, wisdom, and removal of obstacles.",
    displayOrder: 1,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Shiva Puja",
    slug: "shiva-puja",
    description: "Sacred Vedic rituals dedicated to Lord Shiva for inner peace, health, spiritual growth, and divine grace.",
    displayOrder: 2,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Lakshmi & Prosperity Puja",
    slug: "lakshmi-prosperity-puja",
    description: "Consecrated Vedic rituals honoring Goddess Lakshmi and Kubera for wealth, abundance, and prosperity.",
    displayOrder: 3,
    iconName: "Coins",
    isActive: true,
  },
  {
    name: "Durga & Shakti Puja",
    slug: "durga-shakti-puja",
    description: "Powerful invocations of Maa Durga and Divine Shakti for courage, victory, protection, and overcoming adversity.",
    displayOrder: 4,
    iconName: "ShieldCheck",
    isActive: true,
  },
  {
    name: "Vishnu & Narayan Puja",
    slug: "vishnu-narayan-puja",
    description: "Revered Vedic pujas for Lord Vishnu, Satyanarayan, and Shaligram for preservation, righteousness, and household harmony.",
    displayOrder: 5,
    iconName: "Sun",
    isActive: true,
  },
  {
    name: "Navagraha & Planetary Puja",
    slug: "navagraha-planetary-puja",
    description: "Astrological and planetary pacification pujas for dosha nivaran, planetary balance, and favorable cosmic influences.",
    displayOrder: 6,
    iconName: "Compass",
    isActive: true,
  },
  {
    name: "Marriage & Family Puja",
    slug: "marriage-family-puja",
    description: "Auspicious pujas dedicated to marital bliss, timely marriage, relationship harmony, and family wellbeing.",
    displayOrder: 7,
    iconName: "Heart",
    isActive: true,
  },
  {
    name: "Special Occasion Puja",
    slug: "special-occasion-puja",
    description: "Consecrated pujas for holy teerth kshetras, festivals, auspicious milestones, and specialized sankalpas.",
    displayOrder: 8,
    iconName: "Sparkles",
    isActive: true,
  },
];

// Deterministic mapping of known Puja service slugs to their respective Category slug
export const SERVICE_CATEGORY_MAPPINGS = {
  "rudrabhishek-puja": "shiva-puja",
  "maha-mrityunjaya-puja": "shiva-puja",
  "navagraha-shanti-puja": "navagraha-planetary-puja",
  "maha-lakshmi-sri-suktam-puja": "lakshmi-prosperity-puja",
  "ganesh-vighnaharta-puja": "ganesh-puja",
  "kashi-ganga-pujan": "special-occasion-puja",
  "shiva-parvati-vivah-puja": "marriage-family-puja",
};

export const seedPujaCategories = async () => {
  console.log("Starting Puja Categories Seeding & Mapping...");

  // 1. Seed Categories (Idempotent)
  const categoryMap = new Map();

  for (const catData of CATEGORY_SEED_DATA) {
    let [category, created] = await PujaCategory.findOrCreate({
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

  console.log(`Successfully seeded ${categoryMap.size} categories.`);

  // 2. Map existing Puja services
  const allServices = await PujaService.findAll({ order: [["name", "ASC"]] });
  console.log(`Found ${allServices.length} existing Puja services in database.`);

  const mappedResults = [];
  const unmappedServices = [];

  for (const service of allServices) {
    const targetCategorySlug = SERVICE_CATEGORY_MAPPINGS[service.slug];

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

  console.log("\n=================== SEED SUMMARY ===================");
  console.log(`Total Categories: ${categoryMap.size}`);
  console.log(`Total Puja Services: ${allServices.length}`);
  console.log(`Successfully Mapped Services: ${mappedResults.length}`);
  console.log(`Unmapped Services: ${unmappedServices.length}`);
  console.log("===================================================\n");

  return {
    categoriesCount: categoryMap.size,
    servicesCount: allServices.length,
    mappedResults,
    unmappedServices,
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedPujaCategories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding error:", err);
      process.exit(1);
    });
}
