import dotenv from "dotenv";
import db, { HomaPurpose, HomaService } from "../models/index.js";

dotenv.config();

/**
 * 6 Purpose Categories extracted faithfully from homaCatalogueData.js
 */
export const SEED_HOMA_PURPOSES = [
  {
    id: "shanti-wellbeing",
    name: "Shanti & Wellbeing",
    slug: "shanti-wellbeing",
    description: "Selected sacred Homa rituals performed with a Sankalpa for inner peace and holistic wellbeing.",
    iconName: "Heart",
    displayOrder: 1,
  },
  {
    id: "graha-shanti",
    name: "Graha Shanti",
    slug: "graha-shanti",
    description: "Vedic planetary fire rituals performed to harmonize cosmic and planetary influences.",
    iconName: "Compass",
    displayOrder: 2,
  },
  {
    id: "prosperity",
    name: "Prosperity",
    slug: "prosperity",
    description: "Traditional prosperity-oriented fire rituals invoking divine abundance and stability.",
    iconName: "Coins",
    displayOrder: 3,
  },
  {
    id: "protection",
    name: "Protection",
    slug: "protection",
    description: "Potent Shakti and Shaiva fire rituals for spiritual shielding, courage, and overcoming obstacles.",
    iconName: "Shield",
    displayOrder: 4,
  },
  {
    id: "family-home",
    name: "Family & Home",
    slug: "family-home",
    description: "Auspicious Homas for family harmony, Vastu purification, and household wellbeing.",
    iconName: "Home",
    displayOrder: 5,
  },
  {
    id: "special-occasions",
    name: "Special Occasions",
    slug: "special-occasions",
    description: "Selected festive, milestone, longevity, and celebratory Vedic fire rituals.",
    iconName: "Sparkles",
    displayOrder: 6,
  },
];

/**
 * 8 Authoritative Homa Services extracted faithfully from homaCatalogueData.js
 */
export const SEED_HOMA_SERVICES = [
  {
    slug: "maha-mrityunjaya-homa",
    name: "Maha Mrityunjaya Homa",
    homaType: "Shaiva Ayu Homa",
    shortDescription: "Sacred Rigvedic fire ritual invoking Bhagwan Shiva for vitality, health, and longevity.",
    description: "The Maha Mrityunjaya Homa is among the most revered Vedic fire rituals. Conducted with Amrita-Valli, Durva, pure cow ghee, and Belpatra ahutis into Agni to bestow peace, protection, and spiritual vitality.",
    purpose: "Longevity, health, spiritual protection, and vitality",
    purposeCategory: "shanti-wellbeing",
    purposeCategories: ["shanti-wellbeing", "protection", "special-occasions"],
    availableHavanCounts: [1, 3, 5, 7, 11],
    availableDays: [1, 2, 3],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 2,
    recommendedPandits: 4,
    maximumPandits: 11,
    requiredSkills: "Rigvedic Samhita & Rudrashtadhyayi Homa Acharyas",
    dailyHours: "4 Hours Daily",
    havanCapacityPerPandit: "500–1000 Ahutis per Pandit / Day",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "Herbs & Belpatra", status: "Included" },
      { name: "Samidha (Palash / Peepal Wood)", status: "Included" },
      { name: "Dhanya & Sesame", status: "Included" },
      { name: "Special Offerings (Amrita herbs)", status: "Optional" },
      { name: "Flowers & Garlands", status: "Included" },
      { name: "Kashi Bhasma Consecration", status: "Included" },
    ],
    prasad: "Consecrated Homa Bhasma, blessed Raksha Sutra, and energized Rudraksha token",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      rashi: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 11000,
    basePrice: 11000,
    perHavanPrice: 4000,
    perDayPrice: 3500,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-mrityunjaya.jpg",
    galleryImages: ["/assets/puja-mrityunjaya.jpg", "/assets/p-samagri.jpg", "/assets/puja-kashi.jpg"],
    seo: {
      title: "Maha Mrityunjaya Homa in Kashi & Remote | Veda Structure",
      description: "Book authentic Maha Mrityunjaya Homa fire ritual performed by initiated Vedic priests.",
    },
    faqs: [
      {
        question: "What is offered into the sacred fire during Maha Mrityunjaya Homa?",
        answer: "Prescribed ahutis include pure cow ghee, Durva grass, Belpatra, sesame seeds, and traditional herbal medicinal samagri accompanied by the Maha Mrityunjaya mantra.",
      },
      {
        question: "Can this Homa be conducted across multiple days?",
        answer: "Yes, depending on your chosen Havan count (e.g. 5, 7, or 11 Havans), the ritual can be structured over 1, 2, or 3 days.",
      },
    ],
  },
  {
    slug: "navagraha-homa",
    name: "Navagraha Homa",
    homaType: "Vedic Planetary Homa",
    shortDescription: "Cosmic fire ritual offering nine specific Samidha woods to harmonize all nine planetary spheres.",
    description: "The Navagraha Homa utilizes specific sacred woods (such as Arka for Sun, Palasha for Moon, Khadira for Mars) and Beeja mantras to balance astrological planetary periods (Dashas) and foster serenity.",
    purpose: "Harmonizing planetary spheres and pacifying astrological afflictions",
    purposeCategory: "graha-shanti",
    purposeCategories: ["graha-shanti", "shanti-wellbeing"],
    availableHavanCounts: [1, 3, 5],
    availableDays: [1, 2],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 9,
    requiredSkills: "Navagraha Samhita & Beeja Mantra Homa Priests",
    dailyHours: "3 – 4 Hours Daily",
    havanCapacityPerPandit: "500 Ahutis per Pandit / Day",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "9 Planetary Sacred Woods", status: "Included" },
      { name: "Navadhanya (9 Grains)", status: "Included" },
      { name: "9 Colored Cloths", status: "Included" },
      { name: "Special Offerings (Planetary Herbs)", status: "Included" },
      { name: "Flowers", status: "Included" },
      { name: "Navagraha Yantra Archana", status: "Optional" },
    ],
    prasad: "Blessed Navagraha coin, sacred Homa ash, and consecrated Akshat",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      rashi: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 9500,
    basePrice: 9500,
    perHavanPrice: 3500,
    perDayPrice: 3000,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-navagraha.jpg",
    galleryImages: ["/assets/puja-navagraha.jpg", "/assets/p-samagri.jpg", "/assets/p-rudraksha.jpg"],
    seo: {
      title: "Navagraha Homa Fire Ritual | Veda Structure",
      description: "Book traditional Navagraha Homa with authentic planetary samidhas in Kashi or remotely.",
    },
    faqs: [
      {
        question: "Why are nine distinct sacred woods used in Navagraha Homa?",
        answer: "Each planetary deity corresponds to a specific botanical Samidha in classical Shastras, such as Apamarga for Budha and Shami for Shani, to attract harmonic planetary vibrations.",
      },
    ],
  },
  {
    slug: "ganapati-homa",
    name: "Maha Ganapati Homa",
    homaType: "Vighnaharta Homa",
    shortDescription: "Auspicious invocation offering sweet modaks, sugarcane, and ghee to remove all obstacles.",
    description: "Conducted in the early morning (Brahma Muhurta or Sunrise) using Ganapati Atharvashirsha mantras. The sacred fire is propitiated to ensure unobstructed commencement of new ventures, marriages, or educational pursuits.",
    purpose: "Auspicious beginnings, obstacle removal, and intellect refinement",
    purposeCategory: "family-home",
    purposeCategories: ["family-home", "prosperity", "special-occasions"],
    availableHavanCounts: [1, 3],
    availableDays: [1],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 2,
    recommendedPandits: 2,
    maximumPandits: 5,
    requiredSkills: "Rigvedic Ganapati Atharvashirsha Reciters",
    dailyHours: "2.5 – 3 Hours",
    havanCapacityPerPandit: "500 Ahutis per Pandit",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "Durva Grass Bundles", status: "Included" },
      { name: "Modak & Jaggery Ahutis", status: "Included" },
      { name: "Red Flowers & Kumkum", status: "Included" },
      { name: "Coconut & Dry Fruits", status: "Included" },
      { name: "Sugarcane Pieces", status: "Optional" },
      { name: "Ganapati Yantra", status: "Optional" },
    ],
    prasad: "Blessed Durva, Ganapati silver coin, and energized sacred Bhasma",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      rashi: false,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 7500,
    basePrice: 7500,
    perHavanPrice: 3000,
    perDayPrice: 0,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-ganesh.jpg",
    galleryImages: ["/assets/puja-ganesh.jpg", "/assets/p-samagri.jpg", "/assets/puja-kashi.jpg"],
    seo: {
      title: "Maha Ganapati Homa for Auspicious Beginnings | Veda Structure",
      description: "Book traditional Maha Ganapati Homa with Atharvashirsha ahutis in Kashi or remotely.",
    },
    faqs: [
      {
        question: "Is Ganapati Homa performed before other major rituals?",
        answer: "Yes, in the Vedic tradition, Bhagwan Ganapati is worshipped first to clear the path and dissolve obstacles before any major anushthan.",
      },
    ],
  },
  {
    slug: "durga-chandi-homa",
    name: "Durga Homa (Chandi Homa)",
    homaType: "Shakta Maha Yajna",
    shortDescription: "Grand Shakta fire sacrifice invoking Maa Durga with Navarna mantra and Saptashati ahutis.",
    description: "The Chandi Homa is celebrated for immense spiritual fortification. Performed with red silk offerings, lotus flowers, aromatic herbs, and sweet naivedya into Agni to clear profound negative energies and kindle inner resilience.",
    purpose: "Spiritual fortitude, courage, removal of adversity, and divine protection",
    purposeCategory: "protection",
    purposeCategories: ["protection", "special-occasions", "shanti-wellbeing"],
    availableHavanCounts: [1, 3, 5, 9],
    availableDays: [1, 2, 3],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 3,
    recommendedPandits: 5,
    maximumPandits: 11,
    requiredSkills: "Initiated Shakta Sampradaya Chandi Homa Acharyas",
    dailyHours: "4 – 5 Hours Daily",
    havanCapacityPerPandit: "700 Ahutis per Pandit / Day",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "Red Sandalwood & Kumkum", status: "Included" },
      { name: "Red Flowers & Lotus Petals", status: "Included" },
      { name: "Dry Fruits & Sweet Purnahuti Items", status: "Included" },
      { name: "Silk Sari Offering to Agni", status: "Optional" },
      { name: "Special Shakti Yantra", status: "Optional" },
      { name: "Purnahuti Coconut & Silver Token", status: "Included" },
    ],
    prasad: "Blessed Kumkum, Maa Durga Raksha Sutra, and energized Chandi Prasad",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      rashi: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 15000,
    basePrice: 15000,
    perHavanPrice: 5000,
    perDayPrice: 4000,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-lakshmi.jpg",
    galleryImages: ["/assets/puja-lakshmi.jpg", "/assets/p-samagri.jpg", "/assets/p-rudraksha.jpg"],
    seo: {
      title: "Durga Chandi Homa Fire Sacrifice | Veda Structure",
      description: "Book powerful Durga Chandi Homa performed by qualified Shakta priests in Kashi.",
    },
    faqs: [
      {
        question: "How is the Purnahuti performed in Chandi Homa?",
        answer: "The final offering (Purnahuti) includes consecrated dry coconut stuffed with herbs, ghee, and auspicious red vastra offered into the blazing Agni with sacred Vedic slokas.",
      },
    ],
  },
  {
    slug: "lakshmi-kubera-homa",
    name: "Maha Lakshmi & Kubera Homa",
    homaType: "Vaishnava Prosperity Homa",
    shortDescription: "Prosperity fire ritual performed with Shri Suktam mantras, lotus seeds, and cow ghee.",
    description: "Invoking Goddess Mahalakshmi and Lord Kubera for ethical wealth, family stability, and contentment. Performed with continuous recitation of Rigvedic Shri Suktam and lotus petal offerings into sacred Agni.",
    purpose: "Prosperity, ethical abundance, debt relief, and business equilibrium",
    purposeCategory: "prosperity",
    purposeCategories: ["prosperity", "family-home", "special-occasions"],
    availableHavanCounts: [1, 3, 5],
    availableDays: [1, 2],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 7,
    requiredSkills: "Rigvedic Shri Suktam Reciters & Vaishnava Acharyas",
    dailyHours: "3 Hours Daily",
    havanCapacityPerPandit: "500 Ahutis per Pandit / Day",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "Kamalgatta (Lotus Seeds)", status: "Included" },
      { name: "Fresh Lotus Flowers", status: "Included" },
      { name: "Honey & Cow Milk", status: "Included" },
      { name: "Panchamrit", status: "Included" },
      { name: "Silver Coin for Purnahuti", status: "Optional" },
      { name: "Shri Yantra Archana", status: "Optional" },
    ],
    prasad: "Blessed Kamalgatta bead, Lakshmi silver coin, and consecrated Akshat",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      rashi: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 10500,
    basePrice: 10500,
    perHavanPrice: 3800,
    perDayPrice: 3200,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-lakshmi.jpg",
    galleryImages: ["/assets/puja-lakshmi.jpg", "/assets/p-samagri.jpg", "/assets/puja-kashi.jpg"],
    seo: {
      title: "Maha Lakshmi Kubera Homa | Veda Structure",
      description: "Book sacred Lakshmi Kubera Homa with lotus seed ahutis in Kashi or remotely.",
    },
    faqs: [
      {
        question: "What is the primary spiritual significance of Shri Suktam in Lakshmi Homa?",
        answer: "The Rigvedic Shri Suktam is the foundational Vedic hymn praising Lakshmi as the radiant golden energy of creation, abundance, and auspicious tranquility.",
      },
    ],
  },
  {
    slug: "rudra-homa",
    name: "Rudra Homa (Shri Rudram Fire Ritual)",
    homaType: "Vedic Rudrabhishek Fire Sacrifice",
    shortDescription: "Potent Vedic fire sacrifice chanting the Namakam and Chamakam hymns of Krishna Yajurveda.",
    description: "The Rudra Homa channels the transformative and purifying aspects of Agni and Shiva. Performed in Kashi with eleven rounds of Namakam-Chamakam ahutis to dissolve deep karmic burdens and bestow serene peace.",
    purpose: "Karmic purification, inner stillness, and universal peace",
    purposeCategory: "shanti-wellbeing",
    purposeCategories: ["shanti-wellbeing", "protection", "special-occasions"],
    availableHavanCounts: [1, 3, 5, 11],
    availableDays: [1, 2, 3],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 2,
    recommendedPandits: 4,
    maximumPandits: 11,
    requiredSkills: "Krishna Yajurveda Ghana/Jata Pathi Priests",
    dailyHours: "4 Hours Daily",
    havanCapacityPerPandit: "600 Ahutis per Pandit / Day",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "Bilva Patra & Dhatura", status: "Included" },
      { name: "Sacred Bhasma (Vibhuti)", status: "Included" },
      { name: "Gangajal & Cow Milk", status: "Included" },
      { name: "Sugarcane Juice", status: "Optional" },
      { name: "White Lotus Flowers", status: "Included" },
      { name: "Special Shiva Linga Archana", status: "Included" },
    ],
    prasad: "Consecrated Kashi Vibhuti, sacred Bilva leaf, and energized Rudraksha",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      rashi: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 12500,
    basePrice: 12500,
    perHavanPrice: 4200,
    perDayPrice: 3800,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-rudrabhishek.jpg",
    galleryImages: ["/assets/puja-rudrabhishek.jpg", "/assets/p-samagri.jpg", "/assets/p-rudraksha.jpg"],
    seo: {
      title: "Rudra Homa in Kashi | Veda Structure",
      description: "Authentic Rudra Homa with Namakam Chamakam fire offerings by Kashi Vedic scholars.",
    },
    faqs: [
      {
        question: "How is Shri Rudram recited during the fire offerings?",
        answer: "The Namakam praise hymns and Chamakam prayer hymns are intoned with high Vedic Swara precision as pure cow ghee and Bilva leaves are offered into blazing sacrificial embers.",
      },
    ],
  },
  {
    slug: "vastu-shanti-homa",
    name: "Vastu Shanti Homa",
    homaType: "Griha Vastu Yajna",
    shortDescription: "Consecration and purification fire ritual for residences, workplaces, and commercial buildings.",
    description: "Invoking Lord Vastu Purusha and the guardians of the eight cardinal directions (Ashta Dikpalas) to dispel negative energy lines, promote family health, and invite tranquil auspiciousness into premises.",
    purpose: "Purification of home/workplace and harmonizing directional energies",
    purposeCategory: "family-home",
    purposeCategories: ["family-home", "shanti-wellbeing"],
    availableHavanCounts: [1, 3],
    availableDays: [1],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 5,
    requiredSkills: "Vastu Shastra & Griha Pravesha Vidhi Acharyas",
    dailyHours: "3 – 4 Hours",
    havanCapacityPerPandit: "500 Ahutis per Pandit",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "Vastu Purusha Metal Idol", status: "Included" },
      { name: "Ashta Dhanya (8 Grains)", status: "Included" },
      { name: "9 Navagraha Samidhas", status: "Included" },
      { name: "Yellow Mustard & Camphor", status: "Included" },
      { name: "Panchagavya Purification Kit", status: "Included" },
      { name: "Copper Vastu Pyramid", status: "Optional" },
    ],
    prasad: "Blessed Vastu Yantra plate, sacred Homa ash for boundaries, and Raksha Sutra",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: false,
      rashi: false,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 8500,
    basePrice: 8500,
    perHavanPrice: 3200,
    perDayPrice: 0,
    featured: false,
    active: true,
    bannerImage: "/assets/c-vastu.jpg",
    galleryImages: ["/assets/c-vastu.jpg", "/assets/p-samagri.jpg", "/assets/puja-kashi.jpg"],
    seo: {
      title: "Vastu Shanti Homa Fire Ritual | Veda Structure",
      description: "Purify your residence or commercial property with authentic Vastu Shanti Homa.",
    },
    faqs: [
      {
        question: "Can Vastu Shanti Homa be performed remotely?",
        answer: "Yes, special Vastu Kalasha consecration and Dikpala prayers can be performed in Kashi with the devotee's land coordinates and floor plan placed under the sacred Mandapa.",
      },
    ],
  },
  {
    slug: "ayushya-homa",
    name: "Ayushya Homa (Longevity Fire Ritual)",
    homaType: "Vedic Ayu Vardhak Homa",
    shortDescription: "Traditional fire offering propitiating Ayur Devata, Markandeya, and the Chiranjivis for longevity and health.",
    description: "Traditionally performed on birthdays, star birthdays (Janma Nakshatra), or milestones to pray for healthy lifespan, vitality, and protection from chronic illnesses.",
    purpose: "Longevity, rejuvenation, recovery, and milestone blessings",
    purposeCategory: "special-occasions",
    purposeCategories: ["special-occasions", "shanti-wellbeing", "family-home"],
    availableHavanCounts: [1, 3],
    availableDays: [1],
    availableLocations: ["kashi", "remote"],
    minimumPandits: 2,
    recommendedPandits: 2,
    maximumPandits: 4,
    requiredSkills: "Rigvedic & Yajurvedic Ayushya Suktam Reciters",
    dailyHours: "2.5 – 3 Hours",
    havanCapacityPerPandit: "500 Ahutis per Pandit",
    samagri: [
      { name: "Havan Samagri", status: "Included" },
      { name: "Pure Cow Ghrita", status: "Included" },
      { name: "Boiled Rice & Milk Payasam Offering", status: "Included" },
      { name: "Durva Grass Bundles", status: "Included" },
      { name: "Samidha Woods", status: "Included" },
      { name: "Herbs & Camphor", status: "Included" },
      { name: "Ayu Vardhana Raksha Thread", status: "Included" },
      { name: "Special Gold/Silver Coin Offering", status: "Optional" },
    ],
    prasad: "Blessed Ayushya Payasam Prasad, sacred Vibhuti, and protective Raksha thread",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      rashi: true,
      familyMembers: true,
      specialSankalpa: true,
    },
    kashiAvailable: true,
    remoteAvailable: true,
    startingPrice: 8000,
    basePrice: 8000,
    perHavanPrice: 3000,
    perDayPrice: 0,
    featured: false,
    active: true,
    bannerImage: "/assets/yagya_hero.png",
    galleryImages: ["/assets/yagya_hero.png", "/assets/p-samagri.jpg", "/assets/puja-kashi.jpg"],
    seo: {
      title: "Ayushya Homa for Long Life & Health | Veda Structure",
      description: "Book traditional Ayushya Homa fire ritual for health, birthdays, and longevity.",
    },
    faqs: [
      {
        question: "When is the most auspicious time to perform Ayushya Homa?",
        answer: "Traditionally conducted on Janma Nakshatra (birth star day), annual birthdays, or upon recovering from critical illnesses to invite renewal of physical and spiritual vitality.",
      },
    ],
  },
];

export const seedHomaCatalogue = async () => {
  const transaction = await db.sequelize.transaction();
  try {
    console.log("Seeding Homa purpose categories...");
    const purposeMap = new Map();

    // 1. Seed Homa Purposes
    for (const p of SEED_HOMA_PURPOSES) {
      let purpose = await HomaPurpose.findOne({
        where: { slug: p.slug },
        transaction,
      });

      if (!purpose) {
        purpose = await HomaPurpose.create(
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
        console.log(`  + Created Homa Purpose: ${p.name}`);
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
        console.log(`  ~ Updated Homa Purpose: ${p.name}`);
      }
      purposeMap.set(p.slug, purpose.id);
    }

    // 2. Seed Homa Services
    console.log("Seeding 8 canonical Homa services...");
    for (const s of SEED_HOMA_SERVICES) {
      const purposeId = purposeMap.get(s.purposeCategory) || null;

      let service = await HomaService.findOne({
        where: { slug: s.slug },
        transaction,
      });

      const serviceData = {
        name: s.name,
        slug: s.slug,
        homaType: s.homaType,
        shortDescription: s.shortDescription,
        description: s.description,
        purposeId,
        purposeSummary: s.purpose,
        purposeCategory: s.purposeCategory,
        purposeCategories: s.purposeCategories,
        availableHavanCounts: s.availableHavanCounts.map(Number),
        availableDays: s.availableDays.map(Number),
        minimumPandits: s.minimumPandits,
        recommendedPandits: s.recommendedPandits,
        maximumPandits: s.maximumPandits,
        requiredSkills: s.requiredSkills,
        dailyHours: s.dailyHours,
        havanCapacityPerPandit: s.havanCapacityPerPandit,
        samagri: s.samagri,
        prasad: s.prasad,
        sankalpaFields: s.sankalpaFields,
        isKashiAvailable: s.kashiAvailable,
        isRemoteAvailable: s.remoteAvailable,
        availableLocations: s.availableLocations,
        startingPrice: s.startingPrice,
        basePrice: s.basePrice || s.startingPrice,
        perHavanPrice: s.perHavanPrice || 0,
        perDayPrice: s.perDayPrice || 0,
        isFeatured: s.featured,
        isActive: s.active,
        bannerImage: s.bannerImage,
        galleryImages: s.galleryImages,
        seo: s.seo,
        faqs: s.faqs,
      };

      if (!service) {
        service = await HomaService.create(serviceData, { transaction });
        console.log(`  + Created Homa Service: ${s.name} (${s.slug})`);
      } else {
        await service.update(serviceData, { transaction });
        console.log(`  ~ Updated Homa Service: ${s.name} (${s.slug})`);
      }
    }

    await transaction.commit();
    console.log("Homa catalogue seeding completed successfully!");
  } catch (error) {
    await transaction.rollback();
    console.error("Homa catalogue seeding failed:", error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith("seedHomaCatalogue.js")) {
  seedHomaCatalogue()
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default seedHomaCatalogue;
