"use strict";

const crypto = require("crypto");

const YAGYA_PURPOSE_SEED_DATA = [
  {
    name: "Spiritual Sankalpa",
    slug: "spiritual-sankalpa",
    description: "For a defined spiritual intention and disciplined ritual practice.",
    icon_name: "Sparkles",
    display_order: 1,
    is_active: true,
  },
  {
    name: "Family Sankalpa",
    slug: "family-sankalpa",
    description: "For a family-oriented ritual intention.",
    icon_name: "Heart",
    display_order: 2,
    is_active: true,
  },
  {
    name: "Specific Ritual Purpose",
    slug: "specific-ritual-purpose",
    description: "For Yagya services associated with a particular traditional purpose.",
    icon_name: "Flame",
    display_order: 3,
    is_active: true,
  },
  {
    name: "Extended Vedic Anushthan",
    slug: "extended-vedic-anushthan",
    description: "For rituals that are traditionally structured over multiple days.",
    icon_name: "Calendar",
    display_order: 4,
    is_active: true,
  },
  {
    name: "Graha / Shanti Related",
    slug: "graha-shanti-related",
    description: "Selected Yagya services associated with traditional planetary or Shanti-oriented purposes.",
    icon_name: "Compass",
    display_order: 5,
    is_active: true,
  },
  {
    name: "Special Occasions",
    slug: "special-occasions",
    description: "For selected auspicious occasions and spiritual observances.",
    icon_name: "Sun",
    display_order: 6,
    is_active: true,
  },
];


const YAGYA_TIERS_MAP = {
  'maha-mrityunjaya-yagya': [
    { days: 3, price: 21000, panditCount: 5, label: '3-Day Sacred Cycle (Laghu Anushthan)' },
    { days: 5, price: 35000, panditCount: 5, label: '5-Day Vedic Anushthan (Madhya Cycle)' },
    { days: 7, price: 51000, panditCount: 7, label: '7-Day Mahayagya Cycle (Purna Anushthan)' },
    { days: 9, price: 71000, panditCount: 9, label: '9-Day Nava-Dina Anushthan' },
    { days: 11, price: 91000, panditCount: 11, label: '11-Day Maha Purna Anushthan' },
  ],
  'navagraha-shanti-maha-yagya': [
    { days: 3, price: 25000, panditCount: 7, label: '3-Day Navagraha Shanti' },
    { days: 5, price: 41000, panditCount: 7, label: '5-Day Navagraha Maha Anushthan' },
    { days: 7, price: 59000, panditCount: 9, label: '7-Day Sampurna Navagraha Shanti' },
  ],
  'maha-ganapati-atharvashirsha-yagya': [
    { days: 3, price: 18000, panditCount: 5, label: '3-Day Ganapati Siddhi Anushthan' },
    { days: 5, price: 29000, panditCount: 5, label: '5-Day Ganapati Maha Anushthan' },
  ],
  'maha-lakshmi-kubera-yagya': [
    { days: 3, price: 21000, panditCount: 5, label: '3-Day Sri Suktam Yagya' },
    { days: 5, price: 35000, panditCount: 5, label: '5-Day Lakshmi Kubera Anushthan' },
    { days: 7, price: 51000, panditCount: 7, label: '7-Day Sampurna Sri Yagya' },
  ],
  'durga-saptashati-chandi-homa': [
    { days: 5, price: 31000, panditCount: 9, label: '5-Day Chandi Maha Anushthan' },
    { days: 7, price: 47000, panditCount: 9, label: '7-Day Saptashati Mahayagya' },
    { days: 9, price: 65000, panditCount: 11, label: '9-Day Nava-Chandi Mahayagya' },
  ],
  'maha-rudra-yagya-kashi': [
    { days: 5, price: 35000, panditCount: 7, label: '5-Day Rudra Anushthan' },
    { days: 7, price: 51000, panditCount: 7, label: '7-Day Maha Rudra Yagya' },
    { days: 11, price: 85000, panditCount: 11, label: '11-Day Ati Rudra Mahayagya' },
  ],
};

const YAGYA_SERVICE_SEED_DATA = [
  {
    slug: "maha-mrityunjaya-yagya",
    name: "Maha Mrityunjaya Yagya",
    eyebrow: "VEDIC YAGYA • TRYAMBAKAM SEVA",
    tagline: "Sacred Rigvedic Maha Mrityunjaya Ahutis for Longevity, Courage & Vitality",
    short_description: "Traditional Mantra and Homa-based Yagya performed with a defined Sankalpa and structured schedule.",
    full_description: "The Maha Mrityunjaya Yagya is one of the most revered multi-day fire ceremonies in Vedic tradition. Dedicated to Lord Shiva as Tryambaka, it combines Rigvedic mantra chanting with continuous holy offerings (ahutis) into consecrated Agni. Officiated by trained Vedic purohits, the ritual is arranged over multiple days according to prescribed shastric count commitments. Performed on the holy banks of Ganga in Varanasi with consecrated samagri.",
    deity: "Lord Shiva (Tryambaka)",
    purpose_slug: "spiritual-sankalpa",
    purpose_summary: "Healing intentions, longevity, inner courage and spiritual vitality",
    available_durations: JSON.stringify([3, 5, 7, 9, 11]),
    duration_display: "3 / 5 / 7 / 9 / 11 Days",
    daily_ritual_hours: 5,
    daily_hours_display: "5 Hours / Day",
    starting_price: 21000,
    available_mode: "hybrid",
    is_kashi_available: true,
    is_remote_available: true,
    is_featured: true,
    is_active: true,
    banner_image: "/assets/images/puja-mrityunjaya.jpg",
    gallery_images: JSON.stringify([
      "/assets/images/puja-mrityunjaya.jpg",
      "/assets/images/puja-kashi.jpg",
      "/assets/images/p-samagri.jpg"
    ]),
    pandit_requirement: JSON.stringify({
      minimumPandits: 3,
      recommendedPandits: 5,
      maximumPandits: 11,
      skillRequirements: "Trained in Shukla/Krishna Yajurveda and Sri Rudram",
      dailyHours: 5,
    }),
    samagri: JSON.stringify([
      { name: "Sacred Herbal Ahuti Dravyas", status: "included" },
      { name: "Pure Desi Cow Ghee (Ghrita)", status: "included" },
      { name: "Bilva Patra & Lotus Seeds", status: "included" },
      { name: "Navadhanya & Sesame Offerings", status: "included" },
      { name: "Special Vedic Oshadhi Guggul", status: "optional" },
      { name: "Silver Kalash Sthapana Set", status: "additional" },
    ]),
    prasad: "Energized Bhasma, Raksha Sutra, and dry prasadam packed after Purnahuti",
    daily_schedule: JSON.stringify([
      { day: 1, title: "Sthapana & Pratham Sankalp", details: "Altar sanctification, Agni Mathan/Establishment, and initial 2,100 ahutis." },
      { day: 2, title: "Continuance of Mantra Vidhi", details: "Continuous Tryambakam recitation, Bilva offerings, and dedicated midday oblations." },
      { day: 3, title: "Mid-Anushthan Ahutis", details: "Deepening mantra resonance with Panchamrit tarpana and evening Aarti." },
      { day: "Final", title: "Maha Purnahuti", details: "Closing Mahapurnahuti, Vasordhara continuous ghee stream, and Gotra blessing." },
    ]),
    whats_included: JSON.stringify([
      "Consecrated altar sthapana and daily Agni Mathan",
      "Continuous daily mantra japa and herbal ahutis",
      "All authentic samagri including pure desi cow ghee and bilva",
      "Daily gotra sankalpa and video updates for remote seekers",
      "Energized Raksha Sutra and Maha Prasad delivery"
    ]),
    why_perform: JSON.stringify([
      { title: "Vitality & Longevity", description: "Invokes Tryambaka Shiva for health restoration, overcoming vulnerabilities, and fearlessness." },
      { title: "Karmic Dosha Shanti", description: "Dissolves persistent hurdles and purifies household atmosphere through continuous Agni ahutis." },
      { title: "Acoustic Mantra Resonance", description: "Multi-day Rigvedic chanting creates profound sattvic acoustic alignment." }
    ]),
    significance: JSON.stringify([
      "Prescribed in Rigveda Mandala 7 and Shiva Purana as supreme Mrita-Sanjivani rite",
      "Traditional continuous oblations into sacred fire for multi-day anushthan",
      "Performed in Kashi by traditionally certified Yajurvedic purohits"
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Sthapana & Gotra Sankalp", description: "Priests sanctify the yagyashala and register your family Gotra and intentions." },
      { step: "02", title: "Agni Mathan & Daily Ahutis", description: "Consecrated sacrificial fire is kindled with sacred herbs and bilva offerings." },
      { step: "03", title: "Continuous Tryambakam Japa", description: "Structured daily recitation of Maha Mrityunjaya hymns according to shastric commitments." },
      { step: "04", title: "Maha Purnahuti & Blessing", description: "Grand concluding oblations, Vasordhara continuous stream, and Gotra aashirwad." }
    ]),
    faqs: JSON.stringify([
      { question: "What is the difference between Puja and Yagya?", answer: "A Puja is a focused ritual involving prayers and direct deity archana, often completed in 1 to 3 hours. A Yagya is a multi-day ceremonial Vedic fire sacrifice centered around consecrated Agni, disciplined mantra commitments (anushthan), continuous ahutis, and a dedicated team of Vedic Purohits working systematically across multiple days." },
      { question: "How many days is this Yagya performed?", answer: "This Yagya can be performed for 3, 5, 7, 9, or 11 days depending on your chosen count commitment and personal Sankalpa." },
      { question: "Can we participate remotely from home?", answer: "Yes, complete Gotra and family Sankalpa are taken at the commencement. Daily video updates and consecrated prasad are provided." }
    ]),
  },
  {
    slug: "navagraha-shanti-maha-yagya",
    name: "Navagraha Shanti Maha Yagya",
    eyebrow: "VEDIC YAGYA • PLANETARY HARMONY",
    tagline: "Harmonizing Cosmic Planetary Influences Through 9 Sacred Agni Kshetras",
    short_description: "Comprehensive multi-day propitiation invoking the nine celestial planetary deities with specific samidha, mantras, and ahutis.",
    full_description: "The Navagraha Maha Yagya is structured to soften planetary dissonances and invoke auspicious alignment across all nine cosmic spheres. Each planet is propitiated with its dedicated sacred wood (samidha)—such as Arka for Surya, Khadira for Mangala, and Shami for Shani—consecrated through precise Vedic hymns.",
    deity: "Navagraha Mandala",
    purpose_slug: "graha-shanti-related",
    purpose_summary: "Planetary balance, career hurdles mitigation and dosha shanti",
    available_durations: JSON.stringify([3, 5, 7]),
    duration_display: "3 / 5 / 7 Days",
    daily_ritual_hours: 5,
    daily_hours_display: "5 Hours / Day",
    starting_price: 25000,
    available_mode: "hybrid",
    is_kashi_available: true,
    is_remote_available: true,
    is_featured: true,
    is_active: true,
    banner_image: "/assets/images/puja-navagraha.jpg",
    gallery_images: JSON.stringify([
      "/assets/images/puja-navagraha.jpg",
      "/assets/images/puja-kashi.jpg",
      "/assets/images/p-samagri.jpg"
    ]),
    pandit_requirement: JSON.stringify({
      minimumPandits: 4,
      recommendedPandits: 7,
      maximumPandits: 9,
      skillRequirements: "Jyotish & Vedic Suktam recitation specialists",
      dailyHours: 5,
    }),
    samagri: JSON.stringify([
      { name: "9 Planetary Samidha Woods", status: "included" },
      { name: "9 Sacred Grains (Navadhanya)", status: "included" },
      { name: "Pure Cow Ghee & Honey", status: "included" },
      { name: "Colored Cloth & Mandap Dravyas", status: "included" },
      { name: "Energized Navagraha Yantra Plate", status: "optional" },
    ]),
    prasad: "Energized Navagraha Yantra Coin and consecrated Prasadam",
    daily_schedule: JSON.stringify([
      { day: 1, title: "Mandala Drawing & Invocation", details: "Drawing the sacred 9-planet geometric mandala and Kalash consecration." },
      { day: 2, title: "Surya to Brihaspati Pujan", details: "Specific herbal ahutis dedicated to inner planets." },
      { day: "Final", title: "Shani, Rahu, Ketu Ahuti & Purnahuti", details: "Harmonizing shadow planetary transits and concluding Shanti path." },
    ]),
    whats_included: JSON.stringify([
      "Consecrated 9-planet mandala invocation and Kalash sthapana",
      "Specific samidha wood oblations for each of the 9 celestial grahas",
      "Navadhanya and pure cow ghee havan offerings",
      "Energized Navagraha Yantra Coin and consecrated prasad delivery"
    ]),
    why_perform: JSON.stringify([
      { title: "Planetary Harmony", description: "Soothes malefic transit effects and strengthens benefic planetary rays." },
      { title: "Dosha Shanti", description: "Mitigates Sade Sati, Manglik dosha, and Rahu-Ketu vulnerabilities." },
      { title: "Household Equilibrium", description: "Brings balanced cosmic energy and peace into family life." }
    ]),
    significance: JSON.stringify([
      "Invokes ancient Vedic planetary suktams from Shukla Yajurveda",
      "Utilizes authentic species-specific planetary samidha woods",
      "Conducted over 3 to 7 consecutive days for deep planetary propitiation"
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Navagraha Mandala Sthapana", description: "Consecration of the 9 planetary squares with authentic grains and symbols." },
      { step: "02", title: "Planetary Suktam Chanting", description: "Priests recite Vedic hymns for Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, Ketu." },
      { step: "03", title: "Samidha Ahutis", description: "Consecrated sacrificial offerings into sacred Agni with designated wood." },
      { step: "04", title: "Mahapurnahuti & Shanti Path", description: "Final peace invocations and Gotra blessings." }
    ]),
    faqs: JSON.stringify([
      { question: "How does Navagraha Yagya differ from a single Graha Puja?", answer: "A single Graha Puja focuses solely on one planet. This multi-day Mahayagya harmonizes all 9 celestial grahas simultaneously in a unified cosmic mandala." },
      { question: "Can we configure more Pandits?", answer: "Yes, recommended configuration is 7 Pandits, expandable up to 9 Vedic scholars." }
    ]),
  },
  {
    slug: "maha-ganapati-atharvashirsha-yagya",
    name: "Ganapati Siddhi Maha Yagya",
    eyebrow: "VEDIC YAGYA • OBSTACLE REMOVAL",
    tagline: "Sacred Modak & Durva Ahutis for Wisdom, Clarity & Auspicious Beginnings",
    short_description: "Venerable multi-day worship invoking Lord Ganesha through Atharvashirsha avartan and sweet oblations to clear critical undertakings.",
    full_description: "Arranged for new ventures, major family milestones, and overcoming persistent roadblocks, this Yagya focuses on invoking Vighnaharta with continuous Ganapati Atharvashirsha avartan, modak ahutis, and pure red lotus offerings into consecrated fire.",
    deity: "Lord Maha Ganapati",
    purpose_slug: "specific-ritual-purpose",
    purpose_summary: "Obstacle mitigation, wisdom and auspicious enterprise commencement",
    available_durations: JSON.stringify([3, 5]),
    duration_display: "3 / 5 Days",
    daily_ritual_hours: 5,
    daily_hours_display: "5 Hours / Day",
    starting_price: 18000,
    available_mode: "hybrid",
    is_kashi_available: true,
    is_remote_available: true,
    is_featured: true,
    is_active: true,
    banner_image: "/assets/images/puja-ganesh.jpg",
    gallery_images: JSON.stringify([
      "/assets/images/puja-ganesh.jpg",
      "/assets/images/puja-vishnu.jpg",
      "/assets/images/p-samagri.jpg"
    ]),
    pandit_requirement: JSON.stringify({
      minimumPandits: 3,
      recommendedPandits: 5,
      maximumPandits: 7,
      skillRequirements: "Ganapatya vidhi and Atharvashirsha scholars",
      dailyHours: 5,
    }),
    samagri: JSON.stringify([
      { name: "21 Sanctified Durva grass bundles", status: "included" },
      { name: "Pure Cow Ghee & Modak Dravyas", status: "included" },
      { name: "Red Sandalwood & Sindoor Offerings", status: "included" },
      { name: "Sugarcane juice & Dry Fruits", status: "optional" },
    ]),
    prasad: "Energized Ganesha Raksha thread and holy Modak prasad",
    daily_schedule: JSON.stringify([
      { day: 1, title: "Sthapana & Pratham Ahuti", details: "Altar consecration and 108 initial Atharvashirsha recitations." },
      { day: 2, title: "1008 Modak Havan", details: "Consecrated sweet oblations into Agni with Vedic chanting." },
      { day: "Final", title: "Maha Purnahuti & Mangal Aarti", details: "Concluding blessings, Raksha invocation, and Gotra dedications." },
    ]),
    whats_included: JSON.stringify([
      "Consecration of Sri Siddhi Vinayaka altar and sacred fire",
      "1,008 Modak and Durva ahutis with Atharvashirsha avartan",
      "All ritual dravyas, pure cow ghee, and red chandan",
      "Energized Ganesha Raksha Sutra and blessed Prasadam"
    ]),
    why_perform: JSON.stringify([
      { title: "Vighna Nivaran", description: "Removes persistent roadblocks in business, career, and legal hurdles." },
      { title: "Auspicious Beginnings", description: "Bestows divine grace for housewarmings, marriages, and new enterprise launches." },
      { title: "Buddhi & Siddhi", description: "Sharpens intellect, intuition, and focused clarity of thought." }
    ]),
    significance: JSON.stringify([
      "Draws from Atharvaveda Ganapati Upanishad (Atharvashirsha)",
      "Traditional 1,008 sweet modak oblations into consecrated Agni",
      "Conducted by trained Ganapatya Acharyas in Varanasi"
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Kalash Sthapana & Avahan", description: "Establishing the sacred pot and invoking Sri Ganesha with Durva." },
      { step: "02", title: "Atharvashirsha Avartan", description: "Rhythmic recitation of Upanishadic verses with continuous ghee ahutis." },
      { step: "03", title: "Modak Havan Oblations", description: "Sweet offerings to Agni invoking Siddhi and Buddhi." },
      { step: "04", title: "Purnahuti & Gotra Aashirwad", description: "Concluding blessings, Raksha invocation, and Gotra dedications." }
    ]),
    faqs: JSON.stringify([
      { question: "Is this suitable before starting a business?", answer: "Yes, this Yagya is traditionally recommended prior to major ventures, property purchases, and career milestones." },
      { question: "What is the recommended duration?", answer: "3 Days is ideal for focused personal intentions, and 5 Days for extended business or family endeavors." }
    ]),
  },
  {
    slug: "maha-lakshmi-kubera-yagya",
    name: "Maha Lakshmi Sri Suktam Yagya",
    eyebrow: "VEDIC YAGYA • PROSPERITY & ABUNDANCE",
    tagline: "Rigvedic Sri Suktam Chanting With Lotus & Bilva Fruit Oblations",
    short_description: "Venerable multi-day Yagya performed with 16-verse Rigvedic hymns and lotus ahutis to invoke ethical abundance and household stability.",
    full_description: "Conducted over 3 to 7 consecutive days, this Yagya draws upon the earliest Rigvedic hymns honoring the divine feminine principle of prosperity, light, and ethical sustenance. Trained Purohits chant Sri Suktam Samput mantras while making bilva and lotus seed offerings into the sanctified fire.",
    deity: "Maha Lakshmi & Lord Kubera",
    purpose_slug: "family-sankalpa",
    purpose_summary: "Prosperity, financial stability, abundance and ethical grace",
    available_durations: JSON.stringify([3, 5, 7]),
    duration_display: "3 / 5 / 7 Days",
    daily_ritual_hours: 5,
    daily_hours_display: "5 Hours / Day",
    starting_price: 22000,
    available_mode: "hybrid",
    is_kashi_available: true,
    is_remote_available: true,
    is_featured: true,
    is_active: true,
    banner_image: "/assets/images/puja-lakshmi.jpg",
    gallery_images: JSON.stringify([
      "/assets/images/puja-lakshmi.jpg",
      "/assets/images/puja-ganesh.jpg",
      "/assets/images/p-samagri.jpg"
    ]),
    pandit_requirement: JSON.stringify({
      minimumPandits: 3,
      recommendedPandits: 5,
      maximumPandits: 9,
      skillRequirements: "Devi Mahatmya and Rigvedic Sri Suktam scholars",
      dailyHours: 5,
    }),
    samagri: JSON.stringify([
      { name: "Fresh Pink Lotus flowers", status: "included" },
      { name: "Dry Bilva fruits & Makhana", status: "included" },
      { name: "Pure Cow Ghee & Honey", status: "included" },
      { name: "Kumkum, Chandan & Kesar", status: "included" },
      { name: "Energized Sri Yantra Coin", status: "optional" },
    ]),
    prasad: "Energized Lakshmi Coin, Dry Fruits, and blessed Kumkum",
    daily_schedule: JSON.stringify([
      { day: 1, title: "Lakshmi-Kubera Kalash Sthapana", details: "Consecration of the central Kalash and Sri Suktam invocations." },
      { day: 2, title: "Lotus Ahuti Vidhi", details: "Continuous oblations with lotus petals and clarified butter." },
      { day: "Final", title: "Purnahuti & Kanakadhara Stotra", details: "Golden oblations, Purnahuti, and family Gotra blessing." },
    ]),
    whats_included: JSON.stringify([
      "Complete Lakshmi-Kubera mandala consecration",
      "Continuous Sri Suktam samput chanting by Vedic Acharyas",
      "Fresh pink lotus, bilva fruit, and pure cow ghee oblations",
      "Energized Lakshmi Yantra Coin and blessed dry fruit prasad"
    ]),
    why_perform: JSON.stringify([
      { title: "Financial Stability", description: "Attracts sustainable abundance, clears business stagnation, and protects assets." },
      { title: "Household Grace", description: "Bestows mutual harmony, auspiciousness, and removes Daridra dosha." },
      { title: "Rigvedic Grace", description: "Consecrates the devotee home through 16 timeless verses of Sri Suktam." }
    ]),
    significance: JSON.stringify([
      "Derived from Rigveda Khilani hymns dedicated to Goddess Sri",
      "Kamal (Lotus) and Bilva fruit ahutis create divine sattvic resonance",
      "Performed in sacred Varanasi for enduring household prosperity"
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Lakshmi-Kubera Sthapana", description: "Altar sanctification with gold and silver Kalash consecration." },
      { step: "02", title: "Sri Suktam Chanting", description: "Rigvedic priests chant all 16 verses with Samput formulations." },
      { step: "03", title: "Kamal Ahuti Vidhi", description: "Continuous offering of fresh pink lotuses coated in cow ghee into Agni." },
      { step: "04", title: "Purnahuti & Kanakadhara Path", description: "Closing Mahapurnahuti with golden oblations and Gotra dedications." }
    ]),
    faqs: JSON.stringify([
      { question: "What samagri is unique to this Yagya?", answer: "Pink lotus flowers, dried bilva fruits, pure ghee, and lotus seeds (Kamal Gatta) are specially consecrated for every session." },
      { question: "How many days should a family choose?", answer: "3 Days is standard for household peace and prosperity, while 5 or 7 Days is recommended for deep financial breakthrough." }
    ]),
  },
  {
    slug: "durga-saptashati-chandi-homa",
    name: "Durga Chandi Maha Yagya",
    eyebrow: "VEDIC YAGYA • EXTENDED ANUSHTHAN",
    tagline: "Sacred Durga Saptashati Samput Recitation with Protective Agni Ahutis",
    short_description: "Grand multi-day Shakta anushthan invoking Maa Chandi for spiritual shielding, overcoming adversity, and dissolving negativity.",
    full_description: "The Chandi Yagya is an elaborate multi-day Vedic rite invoking the primordial cosmic energy of Goddess Durga. Incorporating all 700 verses of the Durga Saptashati from the Markandeya Purana, each day entails disciplined recitation followed by specific herbal ahutis into the ceremonial havan kund.",
    deity: "Goddess Chandi (Durga)",
    purpose_slug: "extended-vedic-anushthan",
    purpose_summary: "Spiritual shielding, overcoming prolonged adversity and inner strength",
    available_durations: JSON.stringify([5, 7, 9]),
    duration_display: "5 / 7 / 9 Days",
    daily_ritual_hours: 5,
    daily_hours_display: "5 Hours / Day",
    starting_price: 35000,
    available_mode: "hybrid",
    is_kashi_available: true,
    is_remote_available: true,
    is_featured: true,
    is_active: true,
    banner_image: "/assets/images/puja-rudrabhishek.jpg",
    gallery_images: JSON.stringify([
      "/assets/images/puja-rudrabhishek.jpg",
      "/assets/images/puja-kashi.jpg",
      "/assets/images/p-samagri.jpg"
    ]),
    pandit_requirement: JSON.stringify({
      minimumPandits: 5,
      recommendedPandits: 9,
      maximumPandits: 11,
      skillRequirements: "Durga Saptashati pathakas and Saiva-Shakta Acharyas",
      dailyHours: 5,
    }),
    samagri: JSON.stringify([
      { name: "Special 108-herb Chandi Samagri", status: "included" },
      { name: "Pure Ghee & Red silk altar fabrics", status: "included" },
      { name: "Pomegranate, Coconuts & Kheer ahutis", status: "included" },
      { name: "Silver Trishul Consecration Set", status: "additional" },
    ]),
    prasad: "Energized Durga Raksha Sutra, Chandi Bhasma, and blessed Prasadam",
    daily_schedule: JSON.stringify([
      { day: 1, title: "Devi Mahatmya Pratham Charitra", details: "Altar sthapana, Kavacham, Argala, Kilaka and Chapter 1." },
      { day: 2, title: "Madhyama Charitra", details: "Chapters 2 to 4 with continuous Ghee and herbal ahutis." },
      { day: "Final", title: "Uttama Charitra & Purnahuti", details: "Concluding verses, grand Purnahuti with coconut and silk offerings." },
    ]),
    whats_included: JSON.stringify([
      "Complete 700-verse Durga Saptashati recitation across multiple days",
      "Special 108-herb Chandi havan samagri and red silk altar fabrics",
      "Daily Kumari Puja and Gotra Sankalpa recitation",
      "Energized Chandi Bhasma, Durga Raksha Sutra, and Maha Prasad"
    ]),
    why_perform: JSON.stringify([
      { title: "Spiritual Shielding", description: "Formidable protective armor against negative energies, jealousy, and evil eye." },
      { title: "Overcoming Adversity", description: "Dissolves intractable court matters, chronic health issues, and prolonged hardships." },
      { title: "Inner Strength", description: "Infuses the devotee mind with fearless resolve, dignity, and divine fortitude." }
    ]),
    significance: JSON.stringify([
      "Centered on Markandeya Purana Devi Mahatmya (700 sacred mantras)",
      "Regarded as the most potent Shakta ritual for dissolving chronic adversity",
      "Requires consecrated Acharyas trained in complex Navarna vidhi"
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Kavacham, Argala & Kilaka", description: "Recitation of preliminary protective verses and Navarna mantra japa." },
      { step: "02", title: "Charitra Recitation", description: "Systematic daily chanting of the 3 Charitras with continuous oblations." },
      { step: "03", title: "108-Herb Chandi Havan", description: "Consecrated sacrificial offerings with guggul, camphor, and bilva." },
      { step: "04", title: "Maha Purnahuti & Kumari Pujan", description: "Final offering of whole coconuts, silk dravyas, and Gotra blessings." }
    ]),
    faqs: JSON.stringify([
      { question: "Why is Chandi Yagya scheduled over 5 to 9 days?", answer: "The 700 verses of Durga Saptashati require disciplined acoustic recitation with precise samput rules that are properly distributed across multiple days." },
      { question: "Who should sponsor this Yagya?", answer: "Seekers facing heavy karmic hurdles, intense opposition, or those wishing for comprehensive spiritual empowerment." }
    ]),
  },
  {
    slug: "maha-rudra-yagya-kashi",
    name: "Rudra Maha Yagya",
    eyebrow: "VEDIC YAGYA • SHIVA SEVA",
    tagline: "Sacred Shukla Yajurvedic Rudra Prashna Recitation & Agni Homa in Kashi",
    short_description: "Venerable multi-day Yagya performed with Sri Rudram Namakam-Chamakam chanting and thousands of Bilva ahutis on the holy banks of Ganga.",
    full_description: "Rudra Maha Yagya is hailed across Vedic literature as an all-encompassing ceremony that harmonizes environmental acoustics, clears ancestral debts, and brings supreme equanimity to the devotee's household. Performed with precise acoustic pitch and rhythm by Kashi's traditionally qualified Vedic priests.",
    deity: "Lord Shiva (Rudra)",
    purpose_slug: "special-occasions",
    purpose_summary: "Environmental purification, inner peace and universal harmony",
    available_durations: JSON.stringify([5, 7, 11]),
    duration_display: "5 / 7 / 11 Days",
    daily_ritual_hours: 5,
    daily_hours_display: "5 Hours / Day",
    starting_price: 32000,
    available_mode: "hybrid",
    is_kashi_available: true,
    is_remote_available: true,
    is_featured: true,
    is_active: true,
    banner_image: "/assets/images/puja-kashi.jpg",
    gallery_images: JSON.stringify([
      "/assets/images/puja-kashi.jpg",
      "/assets/images/puja-rudrabhishek.jpg",
      "/assets/images/p-samagri.jpg"
    ]),
    pandit_requirement: JSON.stringify({
      minimumPandits: 5,
      recommendedPandits: 7,
      maximumPandits: 11,
      skillRequirements: "Yajurvedic Sri Rudra Prashna experts",
      dailyHours: 5,
    }),
    samagri: JSON.stringify([
      { name: "Bilva Patra & Lotus Seeds", status: "included" },
      { name: "Panchamrit & Pure Desi Cow Ghee", status: "included" },
      { name: "Ganga Jal & Bhasma Dravyas", status: "included" },
      { name: "Silver Shiva Linga consecration", status: "optional" },
    ]),
    prasad: "Energized Shiva Bhasma, Rudraksha, and consecrated Prasad",
    daily_schedule: JSON.stringify([
      { day: 1, title: "Linga Abhishekam & Agni Sthapana", details: "Morning Jalabhishekam and initial 11 Rudra avartans." },
      { day: 2, title: "Namakam-Chamakam Ahuti", details: "Ahutis dedicated to each verse of Sri Rudram." },
      { day: "Final", title: "Maha Rudra Purnahuti", details: "Grand Vasordhara offering and Gotra dedication." },
    ]),
    whats_included: JSON.stringify([
      "Consecration on holy banks of Ganga in Kashi",
      "Continuous Sri Rudram Namakam and Chamakam recitation",
      "Thousands of Bilva patra, panchamrit, and pure cow ghee ahutis",
      "Energized Rudraksha, Shiva Bhasma, and blessed Prasadam delivery"
    ]),
    why_perform: JSON.stringify([
      { title: "Universal Harmony", description: "Brings profound peace, clears ancestral debts, and dissolves spiritual unrest." },
      { title: "Shiva Anugraha", description: "Direct benediction of Lord Vishwanath in the eternal spiritual capital Kashi." },
      { title: "Inner Equanimity", description: "Elevates consciousness and calms the nervous system through Vedic acoustic vibrations." }
    ]),
    significance: JSON.stringify([
      "Vedic Shukla Yajurveda Chapter 16 (Namakam) and Chapter 18 (Chamakam)",
      "The pinnacle of Shaivite fire ceremonies celebrated across classical puranas",
      "Conducted exclusively by certified Ghanapathis and Salakshana Purohits in Kashi"
    ]),
    procedure_steps: JSON.stringify([
      { step: "01", title: "Kashi Linga Abhishekam", description: "Consecrated panchamrit and holy Ganga jal abhishekam on sanctified Lingam." },
      { step: "02", title: "Agni Sthapana & Rudra Japa", description: "Kindling the havan kund with continuous Namakam recitation." },
      { step: "03", title: "Chamakam Ahuti Vidhi", description: "Pairing prayers with herbal oblations and continuous ghee streams." },
      { step: "04", title: "Maha Purnahuti & Vasordhara", description: "Continuous stream of ghee poured into the blazing fire with Gotra blessing." }
    ]),
    faqs: JSON.stringify([
      { question: "Is this Yagya performed in Kashi?", answer: "Yes, this Yagya is consecrated on the sacred Ghats and shrines of Kashi (Varanasi)." },
      { question: "How many recitations of Sri Rudram are included?", answer: "Depending on duration (5, 7, or 11 days), multiple avartans (up to Laghu Rudra or Maha Rudra scale) are completed." }
    ]),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const purposeRows = [];
    const purposeMap = {};

    for (const p of YAGYA_PURPOSE_SEED_DATA) {
      const existing = await queryInterface.rawSelect(
        "yagya_purposes",
        { where: { slug: p.slug } },
        ["id"]
      );

      let id = existing;
      if (!id) {
        id = crypto.randomUUID();
        purposeRows.push({
          id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          icon_name: p.icon_name,
          display_order: p.display_order,
          is_active: p.is_active,
          created_at: now,
          updated_at: now,
        });
      }
      purposeMap[p.slug] = id;
    }

    if (purposeRows.length > 0) {
      await queryInterface.bulkInsert("yagya_purposes", purposeRows);
    }

    const serviceRows = [];

    for (const s of YAGYA_SERVICE_SEED_DATA) {
      const existing = await queryInterface.rawSelect(
        "yagya_services",
        { where: { slug: s.slug } },
        ["id"]
      );

      if (!existing) {
        serviceRows.push({
          id: crypto.randomUUID(),
          slug: s.slug,
          name: s.name,
          eyebrow: s.eyebrow,
          tagline: s.tagline,
          short_description: s.short_description,
          full_description: s.full_description,
          deity: s.deity,
          purpose_id: purposeMap[s.purpose_slug],
          purpose_summary: s.purpose_summary,
          available_durations: s.available_durations,
          duration_display: s.duration_display,
          daily_ritual_hours: s.daily_ritual_hours,
          daily_hours_display: s.daily_hours_display,
          pandit_requirement: s.pandit_requirement,
          location_type: s.location_type || "Kashi Kshetras & Sacred Mandaps",
          location: s.location || "Kashi (Varanasi)",
          available_mode: s.available_mode,
          is_kashi_available: s.is_kashi_available,
          is_remote_available: s.is_remote_available,
          starting_price: s.starting_price,
          pricing_tiers: JSON.stringify(YAGYA_TIERS_MAP[s.slug] || []),
          is_featured: s.is_featured,
          is_active: s.is_active,
          banner_image: s.banner_image,
          gallery_images: s.gallery_images,
          samagri: s.samagri,
          prasad: s.prasad,
          daily_schedule: s.daily_schedule,
          whats_included: s.whats_included,
          why_perform: s.why_perform,
          significance: s.significance,
          procedure_steps: s.procedure_steps,
          faqs: s.faqs,
          created_at: now,
          updated_at: now,
        });
      }
    }

    if (serviceRows.length > 0) {
      await queryInterface.bulkInsert("yagya_services", serviceRows);
    }
  },

  async down(queryInterface, Sequelize) {
    const serviceSlugs = YAGYA_SERVICE_SEED_DATA.map((s) => s.slug);
    const purposeSlugs = YAGYA_PURPOSE_SEED_DATA.map((p) => p.slug);

    await queryInterface.bulkDelete("yagya_services", {
      slug: serviceSlugs,
    });

    await queryInterface.bulkDelete("yagya_purposes", {
      slug: purposeSlugs,
    });
  },
};
