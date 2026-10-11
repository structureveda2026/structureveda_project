import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { default: db, PathCategory, PathService } = await import("../models/index.js");

export const PATH_CATEGORY_SEED_DATA = [
  {
    name: "Ramayana & Manas Parayan",
    slug: "ramayana-manas-path",
    description: "Sacred recitations of Goswami Tulsidas's Shri Ramcharitmanas, ranging from focused Sundarkand chapters to complete 7-Kanda multi-day Akhand and Navah Parayan.",
    displayOrder: 1,
    iconName: "BookOpen",
    isActive: true,
  },
  {
    name: "Shiva & Rudri Path",
    slug: "shiva-rudri-path",
    description: "Sacred Shaiva Vedic recitations invoking Lord Shiva through the Krishna Yajurvedic Namakam-Chamakam (Shri Rudram) and Pushpadanta's Shiva Mahimna Stotra.",
    displayOrder: 2,
    iconName: "Flame",
    isActive: true,
  },
  {
    name: "Durga & Shakta Scriptures",
    slug: "durga-shakta-path",
    description: "Consecrated Shakta scriptural recitations comprising the complete 700 verses of the Durga Saptashati (Chandi Path / Devi Mahatmya) from the Markandeya Purana.",
    displayOrder: 3,
    iconName: "ShieldCheck",
    isActive: true,
  },
  {
    name: "Bhagavad Gita & Vedanta",
    slug: "bhagavad-gita-scripture",
    description: "Systematic recitation of all 18 Adhyayas and 700 verses of Shrimad Bhagavad Gita from the Mahabharata Bhishma Parva, expounding karma, bhakti, and jnana yoga.",
    displayOrder: 4,
    iconName: "Scroll",
    isActive: true,
  },
  {
    name: "Vishnu & Vedic Suktams",
    slug: "vishnu-suktam-path",
    description: "Sacred Vaishnava recitations featuring the foundational cosmic hymn Purusha Suktam (Rigveda 10.90) and the thousand divine names of Vishnu (Vishnu Sahasranama).",
    displayOrder: 5,
    iconName: "Sparkles",
    isActive: true,
  },
  {
    name: "Lakshmi & Kanakadhara Recitations",
    slug: "lakshmi-stotra-path",
    description: "Auspicious recitations honoring Goddess Mahalakshmi through the Rigvedic Shri Suktam and Adi Shankaracharya's Kanakadhara Stotra for sustained prosperity.",
    displayOrder: 6,
    iconName: "Coins",
    isActive: true,
  },
  {
    name: "Surya & Solar Vedic Hymns",
    slug: "surya-solar-path",
    description: "Sacred solar hymns honoring Lord Surya, prominently featuring Sage Agastya's Aditya Hridaya Stotra from Valmiki Ramayana chanted with classical Surya Arghya vidhi.",
    displayOrder: 7,
    iconName: "Sun",
    isActive: true,
  },
];

// Deterministic mapping of canonical Path service slugs to their respective Category slug
export const PATH_SERVICE_CATEGORY_MAPPINGS = {
  "sundarkand-path": "ramayana-manas-path",
  "ramcharitmanas-navah-parayan": "ramayana-manas-path",
  "shiva-mahimna-rudri-path": "shiva-rudri-path",
  "durga-saptashati-path": "durga-shakta-path",
  "shrimad-bhagavad-gita-recitation": "bhagavad-gita-scripture",
  "vishnu-sahasranama-purusha-suktam-path": "vishnu-suktam-path",
  "shri-suktam-kanakadhara-stotra-path": "lakshmi-stotra-path",
  "aditya-hridaya-stotra-surya-path": "surya-solar-path",
};

export const seedPathCategories = async () => {
  console.log("Starting Path Categories Seeding & Mapping...");

  // 1. Seed Categories (Idempotent)
  const categoryMap = new Map();

  for (const catData of PATH_CATEGORY_SEED_DATA) {
    let [category, created] = await PathCategory.findOrCreate({
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

  console.log(`Successfully seeded ${categoryMap.size} Path categories.`);

  // 2. Map existing Path services
  const allServices = await PathService.findAll({ order: [["name", "ASC"]] });
  console.log(`Found ${allServices.length} existing Path services in database.`);

  const mappedResults = [];
  const unmappedServices = [];

  for (const service of allServices) {
    const targetCategorySlug = PATH_SERVICE_CATEGORY_MAPPINGS[service.slug];

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

  console.log("\n=================== PATH SEED SUMMARY ===================");
  console.log(`Total Categories: ${categoryMap.size}`);
  console.log(`Total Path Services: ${allServices.length}`);
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
  seedPathCategories()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Path Seeding error:", err);
      process.exit(1);
    });
}
