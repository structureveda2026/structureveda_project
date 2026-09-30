import dotenv from "dotenv";
import db, { JapaPurpose, JapaService } from "../models/index.js";

dotenv.config();

/**
 * 6 Purpose Categories extracted faithfully from japaCatalogueData.js
 */
export const SEED_JAPA_PURPOSES = [
  {
    id: "spiritual-practice",
    title: "Spiritual Practice",
    description: "For devotees undertaking a structured Mantra practice.",
    iconName: "Sparkles",
    displayOrder: 1,
  },
  {
    id: "shanti-wellbeing",
    title: "Shanti & Wellbeing",
    description: "Selected Mantra Japa performed with a Sankalpa for peace and wellbeing.",
    iconName: "Heart",
    displayOrder: 2,
  },
  {
    id: "graha-shanti",
    title: "Graha / Shanti",
    description: "Selected Japa services associated with traditional planetary practices.",
    iconName: "Compass",
    displayOrder: 3,
  },
  {
    id: "protection",
    title: "Protection",
    description: "Selected Mantra practices traditionally associated with protection.",
    iconName: "Shield",
    displayOrder: 4,
  },
  {
    id: "prosperity",
    title: "Prosperity",
    description: "Selected Japa services associated with traditional prosperity-oriented practices.",
    iconName: "Coins",
    displayOrder: 5,
  },
  {
    id: "special-sankalpa",
    title: "Special Sankalpa",
    description: "For a specific personal or family Sankalpa.",
    iconName: "Flame",
    displayOrder: 6,
  },
];

/**
 * 8 Authoritative Japa Services extracted faithfully from japaCatalogueData.js
 */
export const SEED_JAPA_SERVICES = [
  {
    slug: "maha-mrityunjaya-japa",
    name: "Maha Mrityunjaya Japa",
    mantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्यgroupोर्मुक्षीय मामृतात्॥",
    mantraMeaning: "Classical Rigvedic mantra dedicated to Bhagwan Shiva, chanted with disciplined focus and reverent Sankalpa.",
    shortDescription: "Traditional Mantra Japa arranged with Sankalpa and a defined chanting schedule.",
    description: "The Maha Mrityunjaya Mantra Japa is performed with sacred intention for peace, health, longevity, and inner tranquility. Recited with classical Chandas by qualified Vedic scholars.",
    purpose: "Spiritual practice, peace, vitality and wellbeing",
    purposeCategory: "shanti-wellbeing",
    purposeCategories: ["shanti-wellbeing", "spiritual-practice", "special-sankalpa"],
    availableCounts: [11000, 21000, 51000, 125000],
    variants: [
      { count: 11000, label: "11,000 Japa", startingPrice: 18000, estimatedDuration: "3 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2000 },
      { count: 21000, label: "21,000 Japa", startingPrice: 28000, estimatedDuration: "4 Days", minimumPandits: 3, recommendedPandits: 4, dailyCapacity: 2000 },
      { count: 51000, label: "51,000 Japa", startingPrice: 52000, estimatedDuration: "6 Days", minimumPandits: 4, recommendedPandits: 6, dailyCapacity: 2200 },
      { count: 125000, label: "1,25,000 Japa", startingPrice: 95000, estimatedDuration: "11 Days", minimumPandits: 6, recommendedPandits: 11, dailyCapacity: 2200 },
    ],
    dailyCapacityPerPandit: 2200,
    minimumPandits: 2,
    recommendedPandits: 4,
    maximumPandits: 11,
    requiredSkills: "Rigvedic Samhita & Rudrashtadhyayi Japa Acharyas",
    dailyHours: "4 – 5 Hours Daily",
    completionWindow: "3 to 11 Days",
    startingPrice: 18000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-mrityunjaya.jpg",
    galleryImages: ["/assets/puja-mrityunjaya.jpg", "/assets/p-mala.jpg", "/assets/p-rudraksha.jpg"],
    samagri: ["Rudraksha Mala", "Shiva Linga Archana Samagri", "Belpatra", "Bhasma", "Gangajal"],
    prasad: "Consecrated Rudraksha and energized Vibhuti (where applicable)",
    seo: {
      title: "Maha Mrityunjaya Mantra Japa Services | Veda Structure",
      description: "Book structured Maha Mrityunjaya Mantra Japa with verified Vedic priests in Kashi or remotely.",
    },
    faqs: [
      {
        question: "How is the daily count recorded for Maha Mrityunjaya Japa?",
        answer: "Each designated priest tracks recitation using traditional Rudraksha chanting malas and disciplined tally metrics under senior Acharya supervision.",
      },
      {
        question: "Can this Japa be arranged in Kashi on specific dates?",
        answer: "Yes, Japa arrangements in Kashi can be coordinated based on priest availability and your preferred Sankalpa dates.",
      },
    ],
  },
  {
    slug: "navagraha-mantra-japa",
    name: "Navagraha Mantra Japa",
    mantra: "ब्रह्मामुरारिस्त्रिपुरान्तकारी भानुः शशी भूमिसुतो बुधश्च। गुरुश्च शुक्रः शनिराहुकेतवः सर्वे ग्रहाः शान्तिकरा भवन्तु॥",
    mantraMeaning: "Prescribed Shanti mantras for all nine cosmic influences, performed for harmony and equilibrium.",
    shortDescription: "Planetary harmony Japa performed with dedicated Samidha and traditional mantras for cosmic balance.",
    description: "The Navagraha Mantra Japa addresses the planetary spheres with structured Beeja mantras and Samidha offerings, seeking harmony, clarity, and peace.",
    purpose: "Harmonizing planetary influences and Shanti",
    purposeCategory: "graha-shanti",
    purposeCategories: ["graha-shanti", "shanti-wellbeing"],
    availableCounts: [11000, 21000, 51000],
    variants: [
      { count: 11000, label: "11,000 Japa", startingPrice: 16000, estimatedDuration: "3 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2000 },
      { count: 21000, label: "21,000 Japa", startingPrice: 26000, estimatedDuration: "4 Days", minimumPandits: 3, recommendedPandits: 4, dailyCapacity: 2000 },
      { count: 51000, label: "51,000 Japa", startingPrice: 48000, estimatedDuration: "7 Days", minimumPandits: 4, recommendedPandits: 6, dailyCapacity: 2000 },
    ],
    dailyCapacityPerPandit: 2000,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 9,
    requiredSkills: "Navagraha Samhita & Beeja Mantra Recitation",
    dailyHours: "4 Hours Daily",
    completionWindow: "3 to 7 Days",
    startingPrice: 16000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-navagraha.jpg",
    galleryImages: ["/assets/puja-navagraha.jpg", "/assets/c-mantra.jpg", "/assets/p-samagri.jpg"],
    samagri: ["Navadhanya", "9 Colored Cloths", "Specific Planetary Woods", "Ghee"],
    prasad: "Navagraha Yantra coin and consecrated Akshat (as included)",
    seo: {
      title: "Navagraha Mantra Japa Services | Veda Structure",
      description: "Structured Navagraha Mantra Japa for planetary balance and peace.",
    },
    faqs: [
      {
        question: "Are all 9 planetary mantras recited equally?",
        answer: "Yes, the total count is systematically distributed across the 9 grahas according to classical Shastric proportions.",
      },
    ],
  },
  {
    slug: "gayatri-mantra-japa",
    name: "Gayatri Mantra Japa",
    mantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
    mantraMeaning: "The supreme Vedic solar illumination mantra from the Rigveda, fostering intellect, wisdom, and inner light.",
    shortDescription: "Sacred Savitur recitation undertaken with rigorous Brahmacharya and Vedic meter.",
    description: "Gayatri Japa is the foundational Vedic anushthan for mental clarity, spiritual awakening, intellect refinement, and personal transformation.",
    purpose: "Intellectual clarity, spiritual illumination and Vedic anushthan",
    purposeCategory: "spiritual-practice",
    purposeCategories: ["spiritual-practice", "special-sankalpa"],
    availableCounts: [21000, 51000, 125000],
    variants: [
      { count: 21000, label: "21,000 Japa", startingPrice: 24000, estimatedDuration: "5 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2500 },
      { count: 51000, label: "51,000 Japa", startingPrice: 46000, estimatedDuration: "7 Days", minimumPandits: 3, recommendedPandits: 5, dailyCapacity: 2500 },
      { count: 125000, label: "1,25,000 Japa", startingPrice: 88000, estimatedDuration: "12 Days", minimumPandits: 5, recommendedPandits: 8, dailyCapacity: 2500 },
    ],
    dailyCapacityPerPandit: 2500,
    minimumPandits: 2,
    recommendedPandits: 4,
    maximumPandits: 9,
    requiredSkills: "Vedic Gayatri Dikshit Acharyas",
    dailyHours: "4 – 5 Hours Daily (Brahma Muhurta & Sandhya)",
    completionWindow: "5 to 12 Days",
    startingPrice: 24000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: true,
    active: true,
    bannerImage: "/assets/c-meditation.jpg",
    galleryImages: ["/assets/c-meditation.jpg", "/assets/c-mantra.jpg", "/assets/p-mala.jpg"],
    samagri: ["Tulsi / Sandalwood Mala", "Kusha Asana", "Ganga Jal", "White / Yellow Flowers"],
    prasad: "Vedic Raksha Sutra and sacred sandalwood paste",
    seo: {
      title: "Gayatri Mantra Japa Services | Veda Structure",
      description: "Book authentic Gayatri Mantra Japa Anushthan with verified Vedic priests.",
    },
    faqs: [
      {
        question: "When are Gayatri Japa sessions conducted during the day?",
        answer: "Recitation is carried out during authentic Sandhya transitions, particularly early morning Brahma Muhurta and Madhyahna.",
      },
    ],
  },
  {
    slug: "durga-saptashati-mantra-japa",
    name: "Durga Saptashati & Navarna Japa",
    mantra: "ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे॥",
    mantraMeaning: "Potent Shakti Navarna mantra for courage, protection, removing obstacles, and supreme spiritual strength.",
    shortDescription: "Revered Shakti chanting invoking the grace of Maa Durga for fortitude and shielding against adversities.",
    description: "Performed with the divine nine-syllable Navarna mantra alongside Saptashati recitation, this Japa provides spiritual protection and resilience.",
    purpose: "Inner resilience, spiritual protection and fortitude",
    purposeCategory: "protection",
    purposeCategories: ["protection", "special-sankalpa", "spiritual-practice"],
    availableCounts: [11000, 21000, 51000, 125000],
    variants: [
      { count: 11000, label: "11,000 Japa", startingPrice: 19000, estimatedDuration: "3 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2000 },
      { count: 21000, label: "21,000 Japa", startingPrice: 30000, estimatedDuration: "4 Days", minimumPandits: 3, recommendedPandits: 4, dailyCapacity: 2000 },
      { count: 51000, label: "51,000 Japa", startingPrice: 55000, estimatedDuration: "7 Days", minimumPandits: 4, recommendedPandits: 7, dailyCapacity: 2000 },
      { count: 125000, label: "1,25,000 Japa", startingPrice: 99000, estimatedDuration: "12 Days", minimumPandits: 6, recommendedPandits: 11, dailyCapacity: 2000 },
    ],
    dailyCapacityPerPandit: 2000,
    minimumPandits: 2,
    recommendedPandits: 4,
    maximumPandits: 11,
    requiredSkills: "Shakta Sampradaya Mantra Reciters",
    dailyHours: "4 Hours Daily",
    completionWindow: "3 to 12 Days",
    startingPrice: 19000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-lakshmi.jpg",
    galleryImages: ["/assets/puja-lakshmi.jpg", "/assets/p-samagri.jpg", "/assets/c-mantra.jpg"],
    samagri: ["Lal Chandan Mala", "Sindoor", "Kumkum", "Red Cloth", "Ghee Lamp"],
    prasad: "Blessed Kumkum and Maa Durga Raksha Dhaga",
    seo: {
      title: "Durga Navarna Mantra Japa | Veda Structure",
      description: "Traditional Durga Navarna Mantra Japa performed by verified Shakti priests.",
    },
    faqs: [
      {
        question: "Can Navarna Japa be performed on specific Navratri tithis?",
        answer: "Yes, Navarna anushthan dates can be scheduled during Navratri as well as Shukla Paksha Ashtami or Navami.",
      },
    ],
  },
  {
    slug: "hanuman-mantra-japa",
    name: "Hanuman Moola Mantra Japa",
    mantra: "ॐ हं हनुमते रुद्रात्मकाय हुं फट्॥",
    mantraMeaning: "Invoking Bhagwan Hanuman for courage, overcoming fear, dispelling negativity, and inner resolve.",
    shortDescription: "Devotional recitation focused on unshakeable courage, discipline, and removal of deep-seated fears.",
    description: "The Hanuman Moola Mantra Japa brings immense mental stamina, protection from negative afflictions, and clarity of intention.",
    purpose: "Courage, overcoming obstacles and protection",
    purposeCategory: "protection",
    purposeCategories: ["protection", "shanti-wellbeing"],
    availableCounts: [11000, 21000],
    variants: [
      { count: 11000, label: "11,000 Japa", startingPrice: 14000, estimatedDuration: "3 Days", minimumPandits: 2, recommendedPandits: 2, dailyCapacity: 2500 },
      { count: 21000, label: "21,000 Japa", startingPrice: 22000, estimatedDuration: "4 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2500 },
    ],
    dailyCapacityPerPandit: 2500,
    minimumPandits: 2,
    recommendedPandits: 2,
    maximumPandits: 5,
    requiredSkills: "Hanumad Upasana & Sundarkand Chanting Priests",
    dailyHours: "3 – 4 Hours Daily",
    completionWindow: "3 to 4 Days",
    startingPrice: 14000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: false,
    active: true,
    bannerImage: "/assets/p-rudraksha.jpg",
    galleryImages: ["/assets/p-rudraksha.jpg", "/assets/p-mala.jpg", "/assets/puja-kashi.jpg"],
    samagri: ["Sindoor", "Chameli Oil", "Betel Leaves", "Tulsi Mala"],
    prasad: "Sankat Mochan consecrated Sindoor and Prasad (as applicable)",
    seo: {
      title: "Hanuman Mantra Japa Services | Veda Structure",
      description: "Focused Hanuman Mantra Japa for protection and confidence.",
    },
    faqs: [
      {
        question: "Is Tuesday or Saturday commencement preferred?",
        answer: "Yes, traditional Hanuman anushthans typically commence on a Mangalvar or Shanivar for optimal spiritual alignment.",
      },
    ],
  },
  {
    slug: "ganapati-atharvashirsha-japa",
    name: "Maha Ganapati Mantra Japa",
    mantra: "ॐ गं गणपतये नमः। ॐ श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा॥",
    mantraMeaning: "Sacred invocation to the remover of all obstacles, bestowal of wisdom, auspicious beginnings, and discernment.",
    shortDescription: "Auspicious invocation for unobstructed beginnings, business initiatives, and academic progress.",
    description: "Performed with Vedic Ganapati Atharvashirsha and Beeja mantra for smooth execution of tasks and auspicious start to important life endeavors.",
    purpose: "Auspicious beginnings, removing hindrances and wisdom",
    purposeCategory: "prosperity",
    purposeCategories: ["prosperity", "spiritual-practice"],
    availableCounts: [11000, 21000, 51000],
    variants: [
      { count: 11000, label: "11,000 Japa", startingPrice: 15000, estimatedDuration: "3 Days", minimumPandits: 2, recommendedPandits: 2, dailyCapacity: 2500 },
      { count: 21000, label: "21,000 Japa", startingPrice: 24000, estimatedDuration: "4 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2500 },
      { count: 51000, label: "51,000 Japa", startingPrice: 42000, estimatedDuration: "6 Days", minimumPandits: 3, recommendedPandits: 5, dailyCapacity: 2500 },
    ],
    dailyCapacityPerPandit: 2500,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 6,
    requiredSkills: "Rigvedic Ganapati Upasana Vidhi",
    dailyHours: "3 – 4 Hours Daily",
    completionWindow: "3 to 6 Days",
    startingPrice: 15000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: false,
    active: true,
    bannerImage: "/assets/puja-ganesh.jpg",
    galleryImages: ["/assets/puja-ganesh.jpg", "/assets/p-samagri.jpg", "/assets/p-mala.jpg"],
    samagri: ["Durva Grass", "Modak", "Red Flowers", "Haldi", "Kumkum"],
    prasad: "Blessed Durva and Ganapati Yantra token (as included)",
    seo: {
      title: "Maha Ganapati Mantra Japa | Veda Structure",
      description: "Maha Ganapati Mantra Japa for auspicious beginnings and wisdom.",
    },
    faqs: [
      {
        question: "How many Pandits participate in Ganapati Japa?",
        answer: "Depending on the selected target count (11k, 21k, or 51k), between 2 and 5 qualified Vedic priests chant simultaneously.",
      },
    ],
  },
  {
    slug: "maha-lakshmi-shri-suktam-japa",
    name: "Maha Lakshmi & Shri Suktam Japa",
    mantra: "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः॥",
    mantraMeaning: "Vedic Rigvedic hymn invoking Bhagwati Lakshmi for prosperity, contentment, family stability, and grace.",
    shortDescription: "Traditional prosperity chanting invoking the auspicious grace of Maa Lakshmi and Lord Kubera.",
    description: "Conducted with Kamalgatta (lotus seed) malas and continuous recitation of the classical Shri Suktam and Kamalatmika mantras for spiritual and material harmony.",
    purpose: "Prosperity, family harmony, contentment and stability",
    purposeCategory: "prosperity",
    purposeCategories: ["prosperity", "special-sankalpa"],
    availableCounts: [11000, 21000, 51000],
    variants: [
      { count: 11000, label: "11,000 Japa", startingPrice: 17000, estimatedDuration: "3 Days", minimumPandits: 2, recommendedPandits: 2, dailyCapacity: 2200 },
      { count: 21000, label: "21,000 Japa", startingPrice: 27000, estimatedDuration: "4 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 2200 },
      { count: 51000, label: "51,000 Japa", startingPrice: 49000, estimatedDuration: "7 Days", minimumPandits: 3, recommendedPandits: 5, dailyCapacity: 2200 },
    ],
    dailyCapacityPerPandit: 2200,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 7,
    requiredSkills: "Shri Vidya & Rigvedic Shri Suktam Recitation",
    dailyHours: "4 Hours Daily",
    completionWindow: "3 to 7 Days",
    startingPrice: 17000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: false,
    active: true,
    bannerImage: "/assets/puja-lakshmi.jpg",
    galleryImages: ["/assets/puja-lakshmi.jpg", "/assets/c-mantra.jpg", "/assets/p-mala.jpg"],
    samagri: ["Kamalgatta Mala", "Lotus Petals", "Pure Cow Ghee", "Honey", "Coins"],
    prasad: "Consecrated Kamalgatta seed and Lakshmi silver token (as applicable)",
    seo: {
      title: "Maha Lakshmi & Shri Suktam Japa | Veda Structure",
      description: "Book structured Shri Suktam and Maha Lakshmi Japa with Vedic priests.",
    },
    faqs: [
      {
        question: "Is Kamalgatta mala used for this japa?",
        answer: "Yes, genuine energized Kamalgatta (lotus seed) malas are exclusively utilized for all Shri Suktam recitations.",
      },
    ],
  },
  {
    slug: "shiva-panchakshari-japa",
    name: "Shiva Panchakshari Mantra Japa",
    mantra: "ॐ नमः शिवाय॥",
    mantraMeaning: "The five sacred primordial syllables honoring Bhagwan Shiva, transcending illusion and anchoring devotion.",
    shortDescription: "Direct devotional meditation on Shiva consciousness with disciplined count and steady japa cadence.",
    description: "The Om Namah Shivaya Japa is revered throughout classical scriptures as an all-encompassing path to spiritual purity, dissolution of internal discord, and stillness.",
    purpose: "Spiritual practice, inner silence, devotion and liberation",
    purposeCategory: "spiritual-practice",
    purposeCategories: ["spiritual-practice", "shanti-wellbeing", "special-sankalpa"],
    availableCounts: [11000, 21000, 51000, 125000],
    variants: [
      { count: 11000, label: "11,000 Japa", startingPrice: 15000, estimatedDuration: "3 Days", minimumPandits: 2, recommendedPandits: 2, dailyCapacity: 3000 },
      { count: 21000, label: "21,000 Japa", startingPrice: 23000, estimatedDuration: "4 Days", minimumPandits: 2, recommendedPandits: 3, dailyCapacity: 3000 },
      { count: 51000, label: "51,000 Japa", startingPrice: 42000, estimatedDuration: "6 Days", minimumPandits: 3, recommendedPandits: 4, dailyCapacity: 3000 },
      { count: 125000, label: "1,25,000 Japa", startingPrice: 79000, estimatedDuration: "10 Days", minimumPandits: 4, recommendedPandits: 7, dailyCapacity: 3000 },
    ],
    dailyCapacityPerPandit: 3000,
    minimumPandits: 2,
    recommendedPandits: 3,
    maximumPandits: 8,
    requiredSkills: "Shaiva Agam & Rudrabhishek Priests",
    dailyHours: "4 Hours Daily",
    completionWindow: "3 to 10 Days",
    startingPrice: 15000,
    kashiAvailable: true,
    remoteAvailable: true,
    featured: true,
    active: true,
    bannerImage: "/assets/puja-rudrabhishek.jpg",
    galleryImages: ["/assets/puja-rudrabhishek.jpg", "/assets/p-mala.jpg", "/assets/puja-kashi.jpg"],
    samagri: ["Rudraksha Mala", "Bhasma", "Gangajal", "Belpatra"],
    prasad: "Blessed Rudraksha bead and sacred Kashi Vibhuti",
    seo: {
      title: "Shiva Panchakshari Mantra Japa | Veda Structure",
      description: "Sacred Om Namah Shivaya Japa coordinated in Kashi or performed remotely.",
    },
    faqs: [
      {
        question: "Can Shiva Panchakshari Japa be arranged on Pradosham?",
        answer: "Yes, commencing or culminating this anushthan on Pradosha Vrat or Somvar is considered especially auspicious.",
      },
    ],
  },
];

export const seedJapaCatalogue = async () => {
  console.log("Starting idempotent Japa catalogue seed...");

  const transaction = await db.sequelize.transaction();
  try {
    // 1. Seed Japa Purposes
    const purposeMap = new Map();

    for (const p of SEED_JAPA_PURPOSES) {
      let purpose = await JapaPurpose.findOne({
        where: { slug: p.id },
        transaction,
      });

      if (!purpose) {
        purpose = await JapaPurpose.create(
          {
            name: p.title,
            slug: p.id,
            description: p.description,
            iconName: p.iconName,
            displayOrder: p.displayOrder,
            isActive: true,
          },
          { transaction }
        );
        console.log(`  + Created Japa Purpose: ${p.title} (${p.id})`);
      } else {
        await purpose.update(
          {
            name: p.title,
            description: p.description,
            iconName: p.iconName,
            displayOrder: p.displayOrder,
            isActive: true,
          },
          { transaction }
        );
        console.log(`  ~ Updated Japa Purpose: ${p.title} (${p.id})`);
      }
      purposeMap.set(p.id, purpose.id);
    }

    // 2. Seed Japa Services
    for (const s of SEED_JAPA_SERVICES) {
      const purposeId = purposeMap.get(s.purposeCategory) || null;

      let service = await JapaService.findOne({
        where: { slug: s.slug },
        transaction,
      });

      const serviceData = {
        name: s.name,
        slug: s.slug,
        mantra: s.mantra,
        mantraMeaning: s.mantraMeaning,
        shortDescription: s.shortDescription,
        description: s.description,
        purposeId,
        purposeSummary: s.purpose,
        purposeCategory: s.purposeCategory,
        purposeCategories: s.purposeCategories,
        availableCounts: s.availableCounts,
        variants: s.variants,
        dailyCapacityPerPandit: s.dailyCapacityPerPandit,
        minimumPandits: s.minimumPandits,
        recommendedPandits: s.recommendedPandits,
        maximumPandits: s.maximumPandits,
        requiredSkills: s.requiredSkills,
        dailyHours: s.dailyHours,
        completionWindow: s.completionWindow,
        startingPrice: s.startingPrice,
        isKashiAvailable: s.kashiAvailable,
        isRemoteAvailable: s.remoteAvailable,
        isFeatured: s.featured,
        isActive: s.active,
        bannerImage: s.bannerImage,
        galleryImages: s.galleryImages,
        samagri: s.samagri,
        prasad: s.prasad,
        seo: s.seo,
        faqs: s.faqs,
      };

      if (!service) {
        service = await JapaService.create(serviceData, { transaction });
        console.log(`  + Created Japa Service: ${s.name} (${s.slug})`);
      } else {
        await service.update(serviceData, { transaction });
        console.log(`  ~ Updated Japa Service: ${s.name} (${s.slug})`);
      }
    }

    await transaction.commit();
    console.log("Japa catalogue seeding completed successfully!");
  } catch (error) {
    await transaction.rollback();
    console.error("Japa catalogue seeding failed:", error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith("seedJapaCatalogue.js")) {
  seedJapaCatalogue()
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
