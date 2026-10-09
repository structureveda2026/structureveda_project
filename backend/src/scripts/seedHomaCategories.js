import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { default: db, HomaCategory, HomaService } = await import("../models/index.js");

export const HOMA_CATEGORY_SEED_DATA = [
  {
    name: "Shiva & Rudra Homa",
    slug: "shiva-rudra-homa",
    description: "Potent Vedic fire rituals invoking Lord Shiva and Rudra for supreme health, inner transformation, liberation, and overcoming severe afflictions.",
    displayOrder: 1,
    iconName: "Flame",
    isActive: true,
  },
  {
    name: "Ganapati Homa",
    slug: "ganapati-homa",
    description: "Auspicious Vedic havan dedicated to Lord Ganesha for removing obstacles, gaining intellect, and invoking divine success for new beginnings.",
    displayOrder: 2,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Durga & Chandi Homa",
    slug: "durga-chandi-homa",
    description: "Consecrated sacred fire ceremonies invoking the fiery divine energy of Goddess Durga and Chandi for absolute protection, courage, and victory.",
    displayOrder: 3,
    iconName: "Shield",
    isActive: true,
  },
  {
    name: "Lakshmi & Kubera Homa",
    slug: "lakshmi-kubera-homa",
    description: "Vedic prosperity rituals honoring Goddess Lakshmi and Lord Kubera for continuous abundance, wealth growth, business success, and financial harmony.",
    displayOrder: 4,
    iconName: "Coins",
    isActive: true,
  },
  {
    name: "Navagraha Planetary Homa",
    slug: "navagraha-planetary-homa",
    description: "Sacred fire oblations to the nine celestial planetary deities to harmonize astrological influences, mitigate doshas, and invite cosmic grace.",
    displayOrder: 5,
    iconName: "Compass",
    isActive: true,
  },
  {
    name: "Vastu & Griha Homa",
    slug: "vastu-griha-homa",
    description: "Purifying fire rituals for consecrating residential and commercial properties, clearing negative energies, and establishing Vastu harmony.",
    displayOrder: 6,
    iconName: "Home",
    isActive: true,
  },
  {
    name: "Ayushya & Longevity Homa",
    slug: "ayushya-longevity-homa",
    description: "Vedic health rituals invoking Ayur Devata and Markandeya for vitality, long life, holistic well-being, and recovery from prolonged illnesses.",
    displayOrder: 7,
    iconName: "Heart",
    isActive: true,
  },
];

// Deterministic mapping of canonical Homa service slugs to their respective Category slug
export const HOMA_SERVICE_CATEGORY_MAPPINGS = {
  "maha-mrityunjaya-homa": "shiva-rudra-homa",
  "rudra-homa": "shiva-rudra-homa",
  "ganapati-homa": "ganapati-homa",
  "durga-chandi-homa": "durga-chandi-homa",
  "lakshmi-kubera-homa": "lakshmi-kubera-homa",
  "navagraha-homa": "navagraha-planetary-homa",
  "vastu-shanti-homa": "vastu-griha-homa",
  "ayushya-homa": "ayushya-longevity-homa",
};

export const seedHomaCategories = async () => {
  console.log("Starting Homa Categories Seeding & Mapping...");

  // 1. Seed Categories (Idempotent)
  const categoryMap = new Map();

  for (const catData of HOMA_CATEGORY_SEED_DATA) {
    let [category, created] = await HomaCategory.findOrCreate({
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

  console.log(`Successfully seeded ${categoryMap.size} Homa categories.`);

  // 2. Map existing Homa services
  const allServices = await HomaService.findAll({ order: [["name", "ASC"]] });
  console.log(`Found ${allServices.length} existing Homa services in database.`);

  const mappedResults = [];
  const unmappedServices = [];

  for (const service of allServices) {
    const targetCategorySlug = HOMA_SERVICE_CATEGORY_MAPPINGS[service.slug];

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

  console.log("\n=================== HOMA SEED SUMMARY ===================");
  console.log(`Total Categories: ${categoryMap.size}`);
  console.log(`Total Homa Services: ${allServices.length}`);
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
  seedHomaCategories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Homa Seeding error:", err);
      process.exit(1);
    });
}
