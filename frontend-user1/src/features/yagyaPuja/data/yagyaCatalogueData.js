import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaGaneshImg from "../../../assets/images/puja-ganesh.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";
import pujaKashiImg from "../../../assets/images/puja-kashi.jpg";
import samagriImg from "../../../assets/images/p-samagri.jpg";

/**
 * 6 Structured Purpose/Intention Categories for Multi-Day Yagya
 */
export const YAGYA_PURPOSE_CATEGORIES = [
  {
    id: "spiritual-sankalpa",
    title: "Spiritual Sankalpa",
    description: "For a defined spiritual intention and disciplined ritual practice.",
    iconName: "Sparkles",
  },
  {
    id: "family-sankalpa",
    title: "Family Sankalpa",
    description: "For a family-oriented ritual intention.",
    iconName: "Heart",
  },
  {
    id: "specific-ritual-purpose",
    title: "Specific Ritual Purpose",
    description: "For Yagya services associated with a particular traditional purpose.",
    iconName: "Flame",
  },
  {
    id: "extended-vedic-anushthan",
    title: "Extended Vedic Anushthan",
    description: "For rituals that are traditionally structured over multiple days.",
    iconName: "Calendar",
  },
  {
    id: "graha-shanti-related",
    title: "Graha / Shanti Related",
    description: "Selected Yagya services associated with traditional planetary or Shanti-oriented purposes.",
    iconName: "Compass",
  },
  {
    id: "special-occasions",
    title: "Special Occasions",
    description: "For selected auspicious occasions and spiritual observances.",
    iconName: "Sun",
  },
];

/**
 * Standard Multi-Day Yagya Catalogue List
 * Architecture-ready for CMS/Admin management and future API integration (GET /api/yagyas)
 */
export const YAGYA_CATALOGUE_LIST = [
  {
    id: "yagya-001",
    slug: "maha-mrityunjaya-yagya",
    name: "Maha Mrityunjaya Yagya",
    eyebrow: "VEDIC YAGYA • TRYAMBAKAM SEVA",
    tagline: "Sacred Rigvedic Maha Mrityunjaya Ahutis for Longevity, Courage & Vitality",
    shortDescription:
      "Traditional Mantra and Homa-based Yagya performed with a defined Sankalpa and structured schedule.",
    description:
      "The Maha Mrityunjaya Yagya is one of the most revered multi-day fire ceremonies in Vedic tradition. Dedicated to Lord Shiva as Tryambaka, it combines Rigvedic mantra chanting with continuous holy offerings (ahutis) into consecrated Agni. Officiated by trained Vedic purohits, the ritual is arranged over multiple days according to prescribed shastric count commitments.",
    purpose: "Healing intentions, longevity, inner courage and spiritual vitality",
    purposeCategoryId: "spiritual-sankalpa",
    purposeCategory: "Spiritual Sankalpa",
    availableDurations: [3, 5, 7, 9, 11],
    durationDisplay: "3 / 5 / 7 / 9 / 11 Days",
    dailyRitualHours: 5,
    dailyHoursDisplay: "5 Hours / Day",
    startingPrice: 21000,
    formattedPrice: "₹21,000",
    availableMode: "In-Person (Kashi) or Remote Gotra Sankalpa",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    isFeatured: true,
    isActive: true,
    image: pujaMrityunjayaImg,
    images: [pujaMrityunjayaImg, pujaKashiImg, samagriImg],
    panditRequirement: {
      minimumPandits: 3,
      recommendedPandits: 5,
      maximumPandits: 11,
      skillRequirements: "Trained in Shukla/Krishna Yajurveda and Sri Rudram",
      dailyHours: 5,
    },
    samagri: [
      { name: "Sacred Herbal Ahuti Dravyas", status: "included" },
      { name: "Pure Desi Cow Ghee (Ghrita)", status: "included" },
      { name: "Bilva Patra & Lotus Seeds", status: "included" },
      { name: "Navadhanya & Sesame Offerings", status: "included" },
      { name: "Special Vedic Oshadhi Guggul", status: "optional" },
      { name: "Silver Kalash Sthapana Set", status: "additional" },
    ],
    prasad: "Energized Bhasma, Raksha Sutra, and dry prasadam packed after Purnahuti",
    dailySchedule: [
      { day: 1, title: "Sthapana & Pratham Sankalp", details: "Altar sanctification, Agni Mathan/Establishment, and initial 2,100 ahutis." },
      { day: 2, title: "Continuance of Mantra Vidhi", details: "Continuous Tryambakam recitation, Bilva offerings, and dedicated midday oblations." },
      { day: 3, title: "Mid-Anushthan Ahutis", details: "Deepening mantra resonance with Panchamrit tarpana and evening Aarti." },
      { day: "Final", title: "Maha Purnahuti", details: "Closing Mahapurnahuti, Vasordhara continuous ghee stream, and Gotra blessing." },
    ],
  },
  {
    id: "yagya-002",
    slug: "navagraha-shanti-maha-yagya",
    name: "Navagraha Shanti Maha Yagya",
    eyebrow: "VEDIC YAGYA • PLANETARY HARMONY",
    tagline: "Harmonizing Cosmic Planetary Influences Through 9 Sacred Agni Kshetras",
    shortDescription:
      "Comprehensive multi-day propitiation invoking the nine celestial planetary deities with specific samidha, mantras, and ahutis.",
    description:
      "The Navagraha Maha Yagya is structured to soften planetary dissonances and invoke auspicious alignment across all nine cosmic spheres. Each planet is propitiated with its dedicated sacred wood (samidha)—such as Arka for Surya, Khadira for Mangala, and Shami for Shani—consecrated through precise Vedic hymns.",
    purpose: "Planetary balance, career hurdles mitigation and dosha shanti",
    purposeCategoryId: "graha-shanti-related",
    purposeCategory: "Graha / Shanti Related",
    availableDurations: [3, 5, 7],
    durationDisplay: "3 / 5 / 7 Days",
    dailyRitualHours: 5,
    dailyHoursDisplay: "5 Hours / Day",
    startingPrice: 25000,
    formattedPrice: "₹25,000",
    availableMode: "In-Person (Kashi) or Remote Gotra Sankalpa",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    isFeatured: true,
    isActive: true,
    image: pujaNavagrahaImg,
    images: [pujaNavagrahaImg, pujaKashiImg, samagriImg],
    panditRequirement: {
      minimumPandits: 4,
      recommendedPandits: 7,
      maximumPandits: 9,
      skillRequirements: "Jyotish & Vedic Suktam recitation specialists",
      dailyHours: 5,
    },
    samagri: [
      { name: "9 Planetary Samidha Woods", status: "included" },
      { name: "9 Sacred Grains (Navadhanya)", status: "included" },
      { name: "Pure Cow Ghee & Honey", status: "included" },
      { name: "Colored Cloth & Mandap Dravyas", status: "included" },
      { name: "Energized Navagraha Yantra Plate", status: "optional" },
    ],
    prasad: "Energized Navagraha Yantra Coin and consecrated Prasadam",
    dailySchedule: [
      { day: 1, title: "Mandala Drawing & Invocation", details: "Drawing the sacred 9-planet geometric mandala and Kalash consecration." },
      { day: 2, title: "Surya to Brihaspati Pujan", details: "Specific herbal ahutis dedicated to inner planets." },
      { day: "Final", title: "Shani, Rahu, Ketu Ahuti & Purnahuti", details: "Harmonizing shadow planetary transits and concluding Shanti path." },
    ],
  },
  {
    id: "yagya-003",
    slug: "maha-ganapati-atharvashirsha-yagya",
    name: "Ganapati Siddhi Maha Yagya",
    eyebrow: "VEDIC YAGYA • OBSTACLE REMOVAL",
    tagline: "Sacred Modak & Durva Ahutis for Wisdom, Clarity & Auspicious Beginnings",
    shortDescription:
      "Venerable multi-day worship invoking Lord Ganesha through Atharvashirsha avartan and sweet oblations to clear critical undertakings.",
    description:
      "Arranged for new ventures, major family milestones, and overcoming persistent roadblocks, this Yagya focuses on invoking Vighnaharta with continuous Ganapati Atharvashirsha avartan, modak ahutis, and pure red lotus offerings into consecrated fire.",
    purpose: "Obstacle mitigation, wisdom and auspicious enterprise commencement",
    purposeCategoryId: "specific-ritual-purpose",
    purposeCategory: "Specific Ritual Purpose",
    availableDurations: [3, 5],
    durationDisplay: "3 / 5 Days",
    dailyRitualHours: 5,
    dailyHoursDisplay: "5 Hours / Day",
    startingPrice: 18000,
    formattedPrice: "₹18,000",
    availableMode: "In-Person (Kashi) or Remote Gotra Sankalpa",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    isFeatured: true,
    isActive: true,
    image: pujaGaneshImg,
    images: [pujaGaneshImg, pujaVishnuImg, samagriImg],
    panditRequirement: {
      minimumPandits: 3,
      recommendedPandits: 5,
      maximumPandits: 7,
      skillRequirements: "Ganapatya vidhi and Atharvashirsha scholars",
      dailyHours: 5,
    },
    samagri: [
      { name: "21 Sanctified Durva grass bundles", status: "included" },
      { name: "Pure Cow Ghee & Modak Dravyas", status: "included" },
      { name: "Red Sandalwood & Sindoor Offerings", status: "included" },
      { name: "Sugarcane juice & Dry Fruits", status: "optional" },
    ],
    prasad: "Energized Ganesha Raksha thread and holy Modak prasad",
    dailySchedule: [
      { day: 1, title: "Sthapana & Pratham Ahuti", details: "Altar consecration and 108 initial Atharvashirsha recitations." },
      { day: 2, title: "1008 Modak Havan", details: "Consecrated sweet oblations into Agni with Vedic chanting." },
      { day: "Final", title: "Maha Purnahuti & Mangal Aarti", details: "Concluding blessings, Raksha invocation, and Gotra dedications." },
    ],
  },
  {
    id: "yagya-004",
    slug: "maha-lakshmi-kubera-yagya",
    name: "Maha Lakshmi Sri Suktam Yagya",
    eyebrow: "VEDIC YAGYA • PROSPERITY & ABUNDANCE",
    tagline: "Rigvedic Sri Suktam Chanting With Lotus & Bilva Fruit Oblations",
    shortDescription:
      "Venerable multi-day Yagya performed with 16-verse Rigvedic hymns and lotus ahutis to invoke ethical abundance and household stability.",
    description:
      "Conducted over 3 to 7 consecutive days, this Yagya draws upon the earliest Rigvedic hymns honoring the divine feminine principle of prosperity, light, and ethical sustenance. Trained Purohits chant Sri Suktam Samput mantras while making bilva and lotus seed offerings into the sanctified fire.",
    purpose: "Prosperity, financial stability, abundance and ethical grace",
    purposeCategoryId: "family-sankalpa",
    purposeCategory: "Family Sankalpa",
    availableDurations: [3, 5, 7],
    durationDisplay: "3 / 5 / 7 Days",
    dailyRitualHours: 5,
    dailyHoursDisplay: "5 Hours / Day",
    startingPrice: 22000,
    formattedPrice: "₹22,000",
    availableMode: "In-Person (Kashi) or Remote Gotra Sankalpa",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    isFeatured: true,
    isActive: true,
    image: pujaLakshmiImg,
    images: [pujaLakshmiImg, pujaGaneshImg, samagriImg],
    panditRequirement: {
      minimumPandits: 3,
      recommendedPandits: 5,
      maximumPandits: 9,
      skillRequirements: "Devi Mahatmya and Rigvedic Sri Suktam scholars",
      dailyHours: 5,
    },
    samagri: [
      { name: "Fresh Pink Lotus flowers", status: "included" },
      { name: "Dry Bilva fruits & Makhana", status: "included" },
      { name: "Pure Cow Ghee & Honey", status: "included" },
      { name: "Kumkum, Chandan & Kesar", status: "included" },
      { name: "Energized Sri Yantra Coin", status: "optional" },
    ],
    prasad: "Energized Lakshmi Coin, Dry Fruits, and blessed Kumkum",
    dailySchedule: [
      { day: 1, title: "Lakshmi-Kubera Kalash Sthapana", details: "Consecration of the central Kalash and Sri Suktam invocations." },
      { day: 2, title: "Lotus Ahuti Vidhi", details: "Continuous oblations with lotus petals and clarified butter." },
      { day: "Final", title: "Purnahuti & Kanakadhara Stotra", details: "Golden oblations, Purnahuti, and family Gotra blessing." },
    ],
  },
  {
    id: "yagya-005",
    slug: "durga-saptashati-chandi-homa",
    name: "Durga Chandi Maha Yagya",
    eyebrow: "VEDIC YAGYA • EXTENDED ANUSHTHAN",
    tagline: "Sacred Durga Saptashati Samput Recitation with Protective Agni Ahutis",
    shortDescription:
      "Grand multi-day Shakta anushthan invoking Maa Chandi for spiritual shielding, overcoming adversity, and dissolving negativity.",
    description:
      "The Chandi Yagya is an elaborate multi-day Vedic rite invoking the primordial cosmic energy of Goddess Durga. Incorporating all 700 verses of the Durga Saptashati from the Markandeya Purana, each day entails disciplined recitation followed by specific herbal ahutis into the ceremonial havan kund.",
    purpose: "Spiritual shielding, overcoming prolonged adversity and inner strength",
    purposeCategoryId: "extended-vedic-anushthan",
    purposeCategory: "Extended Vedic Anushthan",
    availableDurations: [5, 7, 9],
    durationDisplay: "5 / 7 / 9 Days",
    dailyRitualHours: 5,
    dailyHoursDisplay: "5 Hours / Day",
    startingPrice: 35000,
    formattedPrice: "₹35,000",
    availableMode: "In-Person (Kashi) or Remote Gotra Sankalpa",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    isFeatured: true,
    isActive: true,
    image: pujaRudrabhishekImg,
    images: [pujaRudrabhishekImg, pujaKashiImg, samagriImg],
    panditRequirement: {
      minimumPandits: 5,
      recommendedPandits: 9,
      maximumPandits: 11,
      skillRequirements: "Durga Saptashati pathakas and Saiva-Shakta Acharyas",
      dailyHours: 5,
    },
    samagri: [
      { name: "Special 108-herb Chandi Samagri", status: "included" },
      { name: "Pure Ghee & Red silk altar fabrics", status: "included" },
      { name: "Pomegranate, Coconuts & Kheer ahutis", status: "included" },
      { name: "Silver Trishul Consecration Set", status: "additional" },
    ],
    prasad: "Energized Durga Raksha Sutra, Chandi Bhasma, and blessed Prasadam",
    dailySchedule: [
      { day: 1, title: "Devi Mahatmya Pratham Charitra", details: "Altar sthapana, Kavacham, Argala, Kilaka and Chapter 1." },
      { day: 2, title: "Madhyama Charitra", details: "Chapters 2 to 4 with continuous Ghee and herbal ahutis." },
      { day: "Final", title: "Uttama Charitra & Purnahuti", details: "Concluding verses, grand Purnahuti with coconut and silk offerings." },
    ],
  },
  {
    id: "yagya-006",
    slug: "maha-rudra-yagya-kashi",
    name: "Rudra Maha Yagya",
    eyebrow: "VEDIC YAGYA • SHIVA SEVA",
    tagline: "Sacred Shukla Yajurvedic Rudra Prashna Recitation & Agni Homa in Kashi",
    shortDescription:
      "Venerable multi-day Yagya performed with Sri Rudram Namakam-Chamakam chanting and thousands of Bilva ahutis on the holy banks of Ganga.",
    description:
      "Rudra Maha Yagya is hailed across Vedic literature as an all-encompassing ceremony that harmonizes environmental acoustics, clears ancestral debts, and brings supreme equanimity to the devotee's household. Performed with precise acoustic pitch and rhythm by Kashi's traditionally qualified Vedic priests.",
    purpose: "Environmental purification, inner peace and universal harmony",
    purposeCategoryId: "special-occasions",
    purposeCategory: "Special Occasions",
    availableDurations: [5, 7, 11],
    durationDisplay: "5 / 7 / 11 Days",
    dailyRitualHours: 5,
    dailyHoursDisplay: "5 Hours / Day",
    startingPrice: 32000,
    formattedPrice: "₹32,000",
    availableMode: "In-Person (Kashi) or Remote Gotra Sankalpa",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    isFeatured: true,
    isActive: true,
    image: pujaKashiImg,
    images: [pujaKashiImg, pujaRudrabhishekImg, samagriImg],
    panditRequirement: {
      minimumPandits: 5,
      recommendedPandits: 7,
      maximumPandits: 11,
      skillRequirements: "Yajurvedic Sri Rudra Prashna experts",
      dailyHours: 5,
    },
    samagri: [
      { name: "Bilva Patra & Lotus Seeds", status: "included" },
      { name: "Panchamrit & Pure Desi Cow Ghee", status: "included" },
      { name: "Ganga Jal & Bhasma Dravyas", status: "included" },
      { name: "Silver Shiva Linga consecration", status: "optional" },
    ],
    prasad: "Energized Shiva Bhasma, Rudraksha, and consecrated Prasad",
    dailySchedule: [
      { day: 1, title: "Linga Abhishekam & Agni Sthapana", details: "Morning Jalabhishekam and initial 11 Rudra avartans." },
      { day: 2, title: "Namakam-Chamakam Ahuti", details: "Ahutis dedicated to each verse of Sri Rudram." },
      { day: "Final", title: "Maha Rudra Purnahuti", details: "Grand Vasordhara offering and Gotra dedication." },
    ],
  },
];

/**
 * Helper to retrieve Yagya by slug
 */
export const getYagyaCatalogueBySlug = (slug) => {
  if (!slug) return null;
  return YAGYA_CATALOGUE_LIST.find((y) => y.slug === slug);
};

/**
 * Helper to retrieve featured active Yagyas
 */
export const getFeaturedYagyaServices = () => {
  return YAGYA_CATALOGUE_LIST.filter((y) => y.isFeatured && y.isActive);
};
