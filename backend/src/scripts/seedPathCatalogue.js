import dotenv from "dotenv";
import db, { PathPurpose, PathService } from "../models/index.js";

dotenv.config();

/**
 * 6 Purpose Categories extracted faithfully from pathCatalogueData.js
 */
export const SEED_PATH_PURPOSES = [
  {
    name: "Shanti & Wellbeing",
    slug: "shanti-wellbeing",
    description: "Selected sacred recitations performed with a Sankalpa for peace and wellbeing.",
    iconName: "Heart",
    displayOrder: 1,
  },
  {
    name: "Devotional Practice",
    slug: "devotional-practice",
    description: "Traditional scripture and Stotra recitations for devotional practice.",
    iconName: "BookOpen",
    displayOrder: 2,
  },
  {
    name: "Family Sankalpa",
    slug: "family-sankalpa",
    description: "Selected Paths arranged with a family Sankalpa.",
    iconName: "Users",
    displayOrder: 3,
  },
  {
    name: "Auspicious Occasions",
    slug: "auspicious-occasions",
    description: "Recitations for selected festivals and auspicious occasions.",
    iconName: "Sparkles",
    displayOrder: 4,
  },
  {
    name: "Spiritual Anushthan",
    slug: "spiritual-anushthan",
    description: "Longer or structured recitations according to the selected text.",
    iconName: "Calendar",
    displayOrder: 5,
  },
  {
    name: "Special Requirement",
    slug: "special-requirement",
    description: "Custom scripture or recitation requests.",
    iconName: "Scroll",
    displayOrder: 6,
  },
];

/**
 * 8 Authoritative Path Services extracted faithfully from pathCatalogueData.js
 */
export const SEED_PATH_SERVICES = [
  {
    slug: "sundarkand-path",
    name: "Sundarkand Path",
    pathType: "Ramcharitmanas Adhyaya",
    scripture: "Shri Ramcharitmanas (Goswami Tulsidas)",
    shortDescription: "Traditional recitation of the fifth chapter of Ramcharitmanas invoking Bhagwan Hanuman's devotion and strength.",
    description: "The Sundarkand narrates Bhagwan Hanuman's journey to Lanka, exemplifying unwavering devotion, courage, and faith. Chanted by experienced Acharyas with classical samput and traditional Doha-Chaupai melodies.",
    purpose: "Overcoming obstacles, mental strength, and family harmony",
    purposeCategory: "devotional-practice",
    purposeCategories: ["devotional-practice", "family-sankalpa", "shanti-wellbeing"],
    availableFormats: ["single_session", "same_day"],
    availableDurations: ["3 to 4 Hours", "Same-Day Extended (Morning & Evening)"],
    chapterStructure: "Complete 5th Sarga (60 Chaupais & Dohas)",
    totalChapters: 1,
    totalSections: 60,
    totalVerses: 526,
    estimatedRecitationHours: 3.5,
    dailyRecitationTarget: "Complete Sundarkand in a single session",
    minimumDays: 1,
    recommendedDays: 1,
    maximumDays: 1,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 5,
    requiredSkills: "Traditional Ramcharitmanas Doha-Chaupai Reciters",
    dailyHours: "3 – 4 Hours",
    dailyRecitationCapacity: "Complete Chapter / Session",
    samagri: ["Ramcharitmanas Granth", "Sindoor", "Tulsi Patra", "Janeu", "Ghee Lamp", "Panchamrit"],
    prasad: "Hanuman Prasad, blessed Raksha Sutra, and consecrated Vibhuti",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 5100,
    featured: true,
    active: true,
    seo: {
      title: "Sundarkand Path Booking & Recitation | Veda Structure",
      description: "Book authentic Sundarkand Path recitation in Kashi or remotely with trained Vedic pandits.",
    },
    faqs: [
      {
        question: "Can Sundarkand Path be completed in one sitting?",
        answer: "Yes, Sundarkand is traditionally chanted in a focused single session lasting approximately 3 to 4 hours with opening Ram Vandana and closing Aarti.",
      },
    ],
  },
  {
    slug: "durga-saptashati-path",
    name: "Durga Saptashati Path (Chandi Path)",
    pathType: "Shakta Scripture",
    scripture: "Markandeya Purana (700 Shlokas)",
    shortDescription: "Complete 13 chapters of Devi Mahatmya with preliminary Argala, Kilaka, Kavacha, and Navarna Japa.",
    description: "Revered as the supreme Shakta recitation, the Durga Saptashati contains 700 sacred mantras invoking Maa Durga's protection, supreme courage, and divine benevolence.",
    purpose: "Inner resilience, spiritual protection, and divine grace",
    purposeCategory: "spiritual-anushthan",
    purposeCategories: ["spiritual-anushthan", "shanti-wellbeing", "auspicious-occasions"],
    availableFormats: ["same_day", "multi_day"],
    availableDurations: ["Single-Day Extended (6–7 Hours)", "3 Days (Structured Anushthan)", "9 Days (Navaratri Saptashati)"],
    chapterStructure: "13 Chapters (Prathama, Madhyama, and Uttama Charita) + Shodasha Anga",
    totalChapters: 13,
    totalSections: 3,
    totalVerses: 700,
    estimatedRecitationHours: 7.0,
    dailyRecitationTarget: "4 to 5 Chapters Daily for 3-Day format",
    minimumDays: 1,
    recommendedDays: 3,
    maximumDays: 9,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 7,
    requiredSkills: "Initiated Shakta Sampradaya Saptashati Pathaks",
    dailyHours: "3 – 4 Hours Daily",
    dailyRecitationCapacity: "4 to 5 Chapters / Day",
    samagri: ["Durga Saptashati Gutika", "Lal Vastra", "Roli", "Kumkum", "Chandan", "Supari", "Akshat"],
    prasad: "Blessed Kumkum, Raksha Sutra, and Devi Prasadam (as applicable)",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 11000,
    featured: true,
    active: true,
    seo: {
      title: "Durga Saptashati Chandi Path | Veda Structure",
      description: "Authentic Durga Saptashati recitation by qualified Vedic priests in Kashi or remotely.",
    },
    faqs: [],
  },
  {
    slug: "shrimad-bhagavad-gita-recitation",
    name: "Shrimad Bhagavad Gita Sampurna Recitation",
    pathType: "Vedic Philosophical Scripture",
    scripture: "Mahabharata Bhishma Parva (Chapters 23–40)",
    shortDescription: "Complete recitation of all 18 Adhyayas and 700 verses of the divine dialogue between Bhagwan Krishna and Arjuna.",
    description: "The Bhagavad Gita is the crown jewel of Vedic wisdom. This systematic recitation encompasses all 18 chapters with traditional Gita Dhyanam, Nyasa, and Gita Mahatmya.",
    purpose: "Clarity of mind, ancestral peace, and spiritual illumination",
    purposeCategory: "spiritual-anushthan",
    purposeCategories: ["spiritual-anushthan", "devotional-practice", "shanti-wellbeing"],
    availableFormats: ["same_day", "multi_day"],
    availableDurations: ["Single-Day Intensive (6 Hours)", "3 Days (6 Chapters / Day)", "7 Days (Gita Saptaha)"],
    chapterStructure: "18 Chapters (Karma, Bhakti, and Jnana Yoga sections)",
    totalChapters: 18,
    totalSections: 3,
    totalVerses: 700,
    estimatedRecitationHours: 6.5,
    dailyRecitationTarget: "6 Chapters Daily for 3-Day format",
    minimumDays: 1,
    recommendedDays: 3,
    maximumDays: 7,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 5,
    requiredSkills: "Vedic Sanskrit Shloka Pathaks with Gita Mahatmya expertise",
    dailyHours: "3 – 4 Hours Daily",
    dailyRecitationCapacity: "6 Chapters / Day",
    samagri: ["Bhagavad Gita Granth", "Peeta Vastra", "Tulsi Mala", "Ganga Jal", "White Sandalwood"],
    prasad: "Consecrated Tulsi leaf, sacred Gita bookmark, and Prasad token",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 9500,
    featured: true,
    active: true,
    seo: {
      title: "Bhagavad Gita Sampurna Recitation | Veda Structure",
      description: "Complete 18-chapter Bhagavad Gita recitation performed with Sankalpa.",
    },
    faqs: [],
  },
  {
    slug: "ramcharitmanas-navah-parayan",
    name: "Shri Ramcharitmanas Akhand / Navah Parayan",
    pathType: "Maha Granth Parayan",
    scripture: "Complete Ramcharitmanas (7 Kandas)",
    shortDescription: "Comprehensive recitation of the entire Ramayana across 9 sacred days or continuous 24-hour Akhand Path.",
    description: "The complete 7 Kandas (Bal, Ayodhya, Aranya, Kishkindha, Sundar, Lanka, and Uttar Kanda) recited continuously with strict adherence to Parayan norms by relay teams of Pandits.",
    purpose: "Family prosperity, collective blessing, and grand auspicious anushthan",
    purposeCategory: "family-sankalpa",
    purposeCategories: ["family-sankalpa", "spiritual-anushthan", "auspicious-occasions"],
    availableFormats: ["multi_day", "custom_request"],
    availableDurations: ["24-Hour Akhand Path (Relay Priests)", "9 Days (Navah Parayan)"],
    chapterStructure: "7 Kandas complete (Over 1,000 Dohas and Chaupais)",
    totalChapters: 7,
    totalSections: 7,
    totalVerses: 12800,
    estimatedRecitationHours: 24.0,
    dailyRecitationTarget: "Structured Kanda targets daily",
    minimumDays: 1,
    recommendedDays: 9,
    maximumDays: 9,
    minimumPandits: 4,
    recommendedPandits: 7,
    maximumPandits: 11,
    requiredSkills: "Senior Ramayana Samiti Acharyas and Manas Pathaks",
    dailyHours: "4 – 5 Hours Daily (or continuous 24h relay)",
    dailyRecitationCapacity: "1 Kanda / Day",
    samagri: ["Shri Ram Yantra", "Ram Darbar Archana Samagri", "Panch Pallav", "Ghee Lamps", "Havan Samagri"],
    prasad: "Consecrated Ram Darbar coin, blessed Akshat, and Purnahuti Prasad",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 31000,
    featured: true,
    active: true,
    seo: {
      title: "Ramcharitmanas Akhand & Navah Path | Veda Structure",
      description: "Book complete Ramcharitmanas 9-day or 24-hour Akhand Path with dedicated Ramayana scholars.",
    },
    faqs: [],
  },
  {
    slug: "vishnu-sahasranama-purusha-suktam-path",
    name: "Vishnu Sahasranama & Purusha Suktam Path",
    pathType: "Stotra & Vedic Suktam",
    scripture: "Mahabharata Anushasana Parva & Rigveda 10.90",
    shortDescription: "Chanting of the 1,000 holy names of Lord Vishnu preceded by the foundational cosmic hymn Purusha Suktam.",
    description: "Performed with continuous Salagrama Archana, Tulsi leaves, and Vedic meters. Renowned for peace, harmonizing cosmic relationships, and nurturing gratitude.",
    purpose: "Planetary peace, spiritual devotion, and family tranquility",
    purposeCategory: "shanti-wellbeing",
    purposeCategories: ["shanti-wellbeing", "devotional-practice"],
    availableFormats: ["single_session", "same_day"],
    availableDurations: ["Single Session (2 Hours)", "Same-Day 11-Avritti (Extended)"],
    chapterStructure: "Purusha Suktam + Vishnu Sahasranama Stotra + Phalasruti",
    totalChapters: 2,
    totalSections: 2,
    totalVerses: 142,
    estimatedRecitationHours: 2.5,
    dailyRecitationTarget: "Complete single or 11 Avritti in 1 day",
    minimumDays: 1,
    recommendedDays: 1,
    maximumDays: 3,
    minimumPandits: 2,
    recommendedPandits: 2,
    maximumPandits: 4,
    requiredSkills: "Vaishnava Agam & Vedic Suktam Reciters",
    dailyHours: "2 – 3 Hours",
    dailyRecitationCapacity: "Complete Stotra with Avritti",
    samagri: ["Tulsi Dal", "Yellow Flowers", "Gopichandan", "Panchamrit", "Salagrama Archana Items"],
    prasad: "Tulsi Prasad, Vishnu Yantra Raksha, and Panchamrit",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 4500,
    featured: false,
    active: true,
    seo: {
      title: "Vishnu Sahasranama Stotra Path | Veda Structure",
      description: "Traditional chanting of Vishnu Sahasranama and Purusha Suktam with Vedic priests.",
    },
    faqs: [],
  },
  {
    slug: "shiva-mahimna-rudri-path",
    name: "Shiva Mahimna Stotra & Namakam-Chamakam (Rudri Path)",
    pathType: "Shaiva Vedic Path",
    scripture: "Krishna Yajurveda Taittiriya Samhita & Pushpadanta Stotra",
    shortDescription: "Recitation of sacred Vedic Rudri (Namakam & Chamakam) along with Gandharvaraja Pushpadanta's Shiva Mahimna Stotra.",
    description: "The definitive Vedic recitation honoring Bhagwan Shiva. Chanted alongside Bilvarchana with precise Swara accents by trained Vedic scholars in Kashi.",
    purpose: "Spiritual purity, mental calm, and dissolution of negative karma",
    purposeCategory: "devotional-practice",
    purposeCategories: ["devotional-practice", "shanti-wellbeing", "spiritual-anushthan"],
    availableFormats: ["single_session", "same_day", "multi_day"],
    availableDurations: ["Single Session (2.5 Hours)", "Ekadasa Rudri (Same-Day)", "3-Day Rudri Anushthan"],
    chapterStructure: "Shri Rudram (11 Anuvakas Namakam + 11 Anuvakas Chamakam) + Shiva Mahimna",
    totalChapters: 2,
    totalSections: 22,
    totalVerses: 180,
    estimatedRecitationHours: 3.0,
    dailyRecitationTarget: "Full Rudri Avritti per session",
    minimumDays: 1,
    recommendedDays: 1,
    maximumDays: 3,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 5,
    requiredSkills: "Yajurvedic Ghana/Jata Pathi Priests with Swara proficiency",
    dailyHours: "3 Hours Daily",
    dailyRecitationCapacity: "Complete Rudri & Mahimna",
    samagri: ["Bilva Patra", "Bhasma", "Ganga Jal", "Dhatura", "White Flowers", "Cow Milk"],
    prasad: "Kashi Bhasma, energized Rudraksha bead, and sacred Belpatra",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 6500,
    featured: true,
    active: true,
    seo: {
      title: "Shiva Mahimna & Rudri Path in Kashi | Veda Structure",
      description: "Book authentic Vedic Rudri Path and Shiva Mahimna recitation in Kashi or remotely.",
    },
    faqs: [],
  },
  {
    slug: "shri-suktam-kanakadhara-stotra-path",
    name: "Shri Suktam & Kanakadhara Stotra Path",
    pathType: "Rigvedic Lakshmi Recitation",
    scripture: "Rigveda Khilani & Adi Shankaracharya Stotra",
    shortDescription: "Auspicious recitation of the 16 mantras of Rigvedic Shri Suktam and Shankaracharya's 21 stanzas of Kanakadhara.",
    description: "Invoking the divine grace of Bhagwati Mahalakshmi for prosperity, contentment, and family equilibrium through classical Vedic meters and lotus seed offerings.",
    purpose: "Prosperity, family harmony, contentment, and auspiciousness",
    purposeCategory: "auspicious-occasions",
    purposeCategories: ["auspicious-occasions", "family-sankalpa", "shanti-wellbeing"],
    availableFormats: ["single_session", "same_day"],
    availableDurations: ["Single Session (2 Hours)", "16 Avritti Same-Day Path"],
    chapterStructure: "16 Mantras Shri Suktam + 21 Verses Kanakadhara",
    totalChapters: 2,
    totalSections: 2,
    totalVerses: 37,
    estimatedRecitationHours: 2.0,
    dailyRecitationTarget: "Complete single or 16-Avritti recitation",
    minimumDays: 1,
    recommendedDays: 1,
    maximumDays: 3,
    minimumPandits: 2,
    recommendedPandits: 2,
    maximumPandits: 4,
    requiredSkills: "Rigvedic Shri Suktam Samhita Reciters",
    dailyHours: "2 Hours",
    dailyRecitationCapacity: "Full Stotra with Samput",
    samagri: ["Kamalgatta", "Lotus Flowers", "Pure Cow Ghee", "Honey", "Kumkum", "Silver Coin"],
    prasad: "Blessed Kamalgatta bead, Lakshmi token, and sacred Kumkum",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 4800,
    featured: false,
    active: true,
    seo: {
      title: "Shri Suktam & Kanakadhara Path | Veda Structure",
      description: "Recitation of Shri Suktam and Kanakadhara Stotra by qualified Vedic priests.",
    },
    faqs: [],
  },
  {
    slug: "aditya-hridaya-stotra-surya-path",
    name: "Aditya Hridaya Stotra & Surya Namaskar Recitation",
    pathType: "Solar Vedic Hymn",
    scripture: "Valmiki Ramayana Yuddha Kanda (Canto 105)",
    shortDescription: "The sacred solar hymn imparted by Sage Agastya to Lord Rama on the battlefield for clarity, vitality, and resolve.",
    description: "Chanted at sunrise with Arghya offerings to Lord Surya. Celebrated for infusing vitality, confidence, leadership clarity, and dispelling inner hesitation.",
    purpose: "Vitality, courage, focus, and overcoming adversity",
    purposeCategory: "devotional-practice",
    purposeCategories: ["devotional-practice", "shanti-wellbeing"],
    availableFormats: ["single_session", "same_day"],
    availableDurations: ["Single Session (1.5 Hours)", "12 Avritti Extended Recitation"],
    chapterStructure: "Complete Canto 105 (31 Sacred Verses)",
    totalChapters: 1,
    totalSections: 1,
    totalVerses: 31,
    estimatedRecitationHours: 1.5,
    dailyRecitationTarget: "Complete hymn recitation with 12 Sun Arghyas",
    minimumDays: 1,
    recommendedDays: 1,
    maximumDays: 1,
    minimumPandits: 2,
    recommendedPandits: 2,
    maximumPandits: 3,
    requiredSkills: "Valmiki Ramayana Sanskrit Reciters with Surya Arghya Vidhi",
    dailyHours: "1.5 – 2 Hours",
    dailyRecitationCapacity: "Complete Stotra with Avritti",
    samagri: ["Copper Kalash", "Red Sandalwood", "Raktachandan", "Red Flowers", "Jaggery"],
    prasad: "Sun-energized sacred copper token and blessed Raksha Sutra",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      familyMembers: false,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    startingPrice: 3800,
    featured: false,
    active: true,
    seo: {
      title: "Aditya Hridaya Stotra Recitation | Veda Structure",
      description: "Structured Aditya Hridaya Stotra recitation with solar Arghya by Vedic scholars.",
    },
    faqs: [],
  },
];

/**
 * Main Seeding Function (Fully Idempotent)
 */
export const seedPathCatalogue = async () => {
  console.log("Beginning Path / Recitation Catalogue Seeding...");
  const transaction = await db.sequelize.transaction();

  try {
    // 1. Seed or Update Purposes
    const purposeMap = new Map();
    for (const p of SEED_PATH_PURPOSES) {
      let purpose = await PathPurpose.findOne({
        where: { slug: p.slug },
        transaction,
      });

      if (!purpose) {
        purpose = await PathPurpose.create(
          {
            name: p.name,
            slug: p.slug,
            description: p.description,
            iconName: p.iconName,
            displayOrder: p.displayOrder,
            isActive: true,
          },
          { transaction }
        );
        console.log(`  + Created Path Purpose: ${p.name} (${p.slug})`);
      } else {
        await purpose.update(
          {
            name: p.name,
            description: p.description,
            iconName: p.iconName,
            displayOrder: p.displayOrder,
            isActive: true,
          },
          { transaction }
        );
        console.log(`  ~ Updated Path Purpose: ${p.name} (${p.slug})`);
      }

      purposeMap.set(p.slug, purpose.id);
    }

    // 2. Seed or Update Path Services
    for (const s of SEED_PATH_SERVICES) {
      const purposeId = purposeMap.get(s.purposeCategory) || null;

      let service = await PathService.findOne({
        where: { slug: s.slug },
        transaction,
      });

      const serviceData = {
        name: s.name,
        slug: s.slug,
        pathType: s.pathType,
        scripture: s.scripture,
        shortDescription: s.shortDescription,
        description: s.description,
        purposeId,
        purposeSummary: s.purpose,
        purposeCategory: s.purposeCategory,
        purposeCategories: s.purposeCategories,
        availableFormats: s.availableFormats,
        availableDurations: s.availableDurations,
        chapterStructure: s.chapterStructure,
        totalChapters: s.totalChapters,
        totalSections: s.totalSections,
        totalVerses: s.totalVerses,
        estimatedRecitationHours: s.estimatedRecitationHours,
        dailyRecitationTarget: s.dailyRecitationTarget,
        minimumDays: s.minimumDays,
        recommendedDays: s.recommendedDays,
        maximumDays: s.maximumDays,
        minimumPandits: s.minimumPandits,
        recommendedPandits: s.recommendedPandits,
        maximumPandits: s.maximumPandits,
        requiredSkills: s.requiredSkills,
        dailyHours: s.dailyHours,
        dailyRecitationCapacity: s.dailyRecitationCapacity,
        samagri: s.samagri,
        prasad: s.prasad,
        sankalpaFields: s.sankalpaFields,
        isKashiAvailable: s.kashiAvailable,
        isRemoteAvailable: s.remoteAvailable,
        availableLocations: s.availableLocations,
        startingPrice: s.startingPrice,
        isFeatured: s.featured,
        isActive: s.active,
        bannerImage: null,
        galleryImages: [],
        seo: s.seo,
        faqs: s.faqs,
      };

      if (!service) {
        service = await PathService.create(serviceData, { transaction });
        console.log(`  + Created Path Service: ${s.name} (${s.slug})`);
      } else {
        await service.update(serviceData, { transaction });
        console.log(`  ~ Updated Path Service: ${s.name} (${s.slug})`);
      }
    }

    await transaction.commit();
    console.log("Path catalogue seeding completed successfully!");
  } catch (error) {
    await transaction.rollback();
    console.error("Path catalogue seeding failed:", error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith("seedPathCatalogue.js")) {
  seedPathCatalogue()
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default seedPathCatalogue;
