import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaKashiImg from "../../../assets/images/puja-kashi.jpg";
import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import pujaLakshmiImg from "../../../assets/images/puja-lakshmi.jpg";
import pujaGangaImg from "../../../assets/images/puja-ganga.jpg";
import pujaGaneshImg from "../../../assets/images/puja-ganesh.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";

/**
 * Isolated Puja Service Catalogue Data
 * (Represents reusable Puja SERVICES, separate from scheduled Upcoming Puja events)
 */
export const PUJA_CATALOGUE_LIST = [
  {
    id: "service-puja-001",
    slug: "rudrabhishek-puja",
    name: "Sacred Rudrabhishek Puja",
    eyebrow: "VEDIC PUJA • SHIVA SEVA",
    tagline: "Consecrated Jal & Panchamrit Abhishekam for Inner Peace & Protection",
    shortDescription:
      "Traditional Vedic abhishekam performed with Shukla Yajurveda Sri Rudram chanting, bilva patra, and panchamrit for family peace and spiritual elevation.",
    fullDescription:
      "Rudrabhishek is one of the most venerable Vedic ceremonies dedicated to Lord Shiva. Officiated by knowledgeable Vedic purohits, this sacred ritual involves continuous bathing of the sanctified Shiva Lingam with 11 holy dravyas while reciting the ancient hymns of Sri Rudra Prashna. The ceremony is traditionally conducted to harmonize household energies, relieve mental unrest, and invoke divine grace for family wellbeing.",
    deity: "Lord Shiva",
    purpose: "Protection, inner peace and spiritual wellbeing",
    purposeCategory: "Protection & Peace",
    purposeKey: "protection-peace",
    availableDurations: ["2 Hours", "3 Hours", "5 Hours"],
    duration: "2 - 3 Hours",
    durationHours: [2, 3, 5],
    locationType: "Kashi Ghats & Consecrated Mandirs",
    location: "Kashi (Varanasi) / Consecrated Shrines",
    availableMode: "In-Person (Kashi) or Remote",
    isKashiAvailable: true,
    startingPrice: 1100,
    formattedPrice: "₹1,100",
    isFeatured: true,
    isActive: true,
    image: pujaRudrabhishekImg,
    images: [pujaRudrabhishekImg, pujaKashiImg, pujaGangaImg],
    whatsIncluded: [
      "Authentic Vedic Rudrabhishek Vidhi as per Shastric standards",
      "All required 100% pure puja samagri (Panchamrit, Bilva, Bhasma, Gangajal)",
      "Personalized Sankalp chanted with your Name & Gotra",
      "Conducted by traditionally qualified Vedic Acharyas",
      "High-definition video update of your personalized Gotra Sankalp",
      "Energized sacred Prasadam and Bhasma delivered to your address",
    ],
    whyPerform: [
      {
        title: "Peace of Mind & Clarity",
        description: "Traditionally performed to calm mental restlessness and dissolve anxiety through sacred acoustic resonance.",
        icon: "Sparkles",
      },
      {
        title: "Protection & Harmony",
        description: "Invokes divine shielding for household members and mitigates disruptive environmental vibrations.",
        icon: "ShieldCheck",
      },
      {
        title: "Spiritual Rejuvenation",
        description: "Awakens inner awareness and aligns seeker consciousness with universal cosmic order.",
        icon: "Sun",
      },
      {
        title: "Family Wellbeing",
        description: "Nurtures longevity, mutual harmony, and auspicious positivity across generations.",
        icon: "Heart",
      },
    ],
    significance: [
      "Sri Rudram is an ancient Shukla Yajurveda text whose vibrational cadence is hailed for cleansing deep psychic channels.",
      "The offering of Bilva patra and Ganga jal symbolizes the surrender of ego and absorption of sattvic divine grace.",
      "Conducted with formal Gotra Sankalpa, the spiritual merit is dedicated to the devotee and their designated family lineage.",
    ],
    procedureSteps: [
      { step: "01", title: "Pratham Sankalp", description: "Formal recitation of seeker Name, Gotra, and devotional intention by the Acharya." },
      { step: "02", title: "Swasti Vachan & Aavahan", description: "Purification of the altar, kalash sthapana, and invocation of Ganesha and Shiva Parivar." },
      { step: "03", title: "Continuous Abhishek", description: "Chanting of Sri Rudra Prashna with Panchamrit, honey, sugarcane juice, and Gangajal." },
      { step: "04", title: "Maha Aarti & Prasadam", description: "Closing Karpura Aarti, pushpanjali, distribution of sacred bhasma, and prasad dispatch." },
    ],
    faqs: [
      { question: "Can this Puja be arranged specifically in Kashi?", answer: "Yes, this ritual can be coordinated directly on sacred Ganga ghats and temple shrines in Varanasi." },
      { question: "Do I need to know my exact Gotra?", answer: "If your Gotra is uncertain, the Acharya will invoke the universal Kashyapa Gotra as prescribed in traditional shastras." },
      { question: "Will I receive recorded footage of my Sankalpa?", answer: "Yes, video footage of your individual Name and Gotra Sankalpa is shared with you upon ritual completion." },
    ],
  },
  {
    id: "service-puja-002",
    slug: "maha-mrityunjaya-puja",
    name: "Maha Mrityunjaya Puja",
    eyebrow: "VEDIC PUJA • HEALTH & LONGEVITY",
    tagline: "Ancient Tryambakam Recitation for Health, Courage & Life Vitality",
    shortDescription:
      "Potent Vedic worship invoking Lord Mrityunjaya through continuous chanting of the nectar-bestowing mantra for courage, rejuvenation, and physical wellbeing.",
    deity: "Lord Shiva (Mrityunjaya)",
    purpose: "Healing intentions, vitality, fearlessness and protection",
    purposeCategory: "Health & Wellbeing",
    purposeKey: "health-wellbeing",
    availableDurations: ["3 Hours", "5 Hours"],
    duration: "3 - 5 Hours",
    durationHours: [3, 5],
    locationType: "Vedic Yagya Shala & Sacred Kshetras",
    location: "Kashi / Consecrated Vedic Mandirs",
    availableMode: "In-Person (Kashi) or Remote",
    isKashiAvailable: true,
    startingPrice: 1500,
    formattedPrice: "₹1,500",
    isFeatured: true,
    isActive: true,
    image: pujaMrityunjayaImg,
    images: [pujaMrityunjayaImg, pujaRudrabhishekImg, pujaKashiImg],
    whatsIncluded: [
      "Authentic Maha Mrityunjaya Japa with committed count vidhi",
      "Pure herbal samagri, cow ghee, and lotus seeds for sacred offerings",
      "Personalized Gotra Sankalp for devotee or designated family member",
      "Officiated by trained Vedic sadhakas",
      "Video recording of the Sankalpa and closing Purnahuti",
      "Energized Mrityunjaya Raksha thread and Prasadam dispatched home",
    ],
    whyPerform: [
      {
        title: "Vitality & Resilience",
        description: "Traditionally chanted for recovering strength during prolonged fatigue and cultivating physical vitality.",
        icon: "ShieldCheck",
      },
      {
        title: "Mental Fearlessness",
        description: "Dispels persistent anxieties, fears of unforeseen setbacks, and negative thought patterns.",
        icon: "Sparkles",
      },
      {
        title: "Karmic Balancing",
        description: "Mitigates planetary imbalances connected with Saturn, Rahu, and chronic astrological afflictions.",
        icon: "Sun",
      },
    ],
    significance: [
      "The Maha Mrityunjaya mantra appears in the Rigveda and Yajurveda as the prime mantra for liberation from spiritual and physical decay.",
      "The sonic resonance creates a protective auric field that fosters deep calm and emotional endurance.",
    ],
    procedureSteps: [
      { step: "01", title: "Sankalp & Nyasa", description: "Purification of breath and recitation of seeker Gotra with dedicated prayer intention." },
      { step: "02", title: "Ganesha & Shiva Sthapana", description: "Consecration of the altar and invoking the presence of Lord Tryambaka." },
      { step: "03", title: "Mantra Chanting", description: "Disciplined recitation of the sacred Mrityunjaya hymn by learned priests." },
      { step: "04", title: "Aarti & Raksha", description: "Concluding prayers, distribution of energized sacred thread, and prasad blessing." },
    ],
    faqs: [
      { question: "Can I perform this for an elderly parent?", answer: "Yes, you can register on behalf of parents, children, or loved ones by providing their details during Sankalp." },
      { question: "How does remote participation work?", answer: "The Sankalpa is recited in your name, with complete video verification and prasad delivery to your address." },
    ],
  },
  {
    id: "service-puja-003",
    slug: "navagraha-shanti-puja",
    name: "Navagraha Shanti Puja",
    eyebrow: "VEDIC PUJA • PLANETARY HARMONY",
    tagline: "Harmonizing the 9 Planetary Energies for Balance, Growth & Auspiciousness",
    shortDescription:
      "Comprehensive 9-planet Vedic propitiation invoking Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, and Ketu to balance planetary influences.",
    deity: "Navagraha Devas",
    purpose: "Planetary balance, career hurdles mitigation and dosha shanti",
    purposeCategory: "ग्रह / ज्योतिष आधारित",
    purposeKey: "graha-astrological",
    availableDurations: ["3 Hours", "5 Hours"],
    duration: "3 - 5 Hours",
    durationHours: [3, 5],
    locationType: "Consecrated Vedic Mandirs",
    location: "Vedic Yagya Shala, Varanasi",
    availableMode: "In-Person (Kashi) or Remote",
    isKashiAvailable: true,
    startingPrice: 1500,
    formattedPrice: "₹1,500",
    isFeatured: true,
    isActive: true,
    image: pujaNavagrahaImg,
    images: [pujaNavagrahaImg, pujaKashiImg, pujaRudrabhishekImg],
    whatsIncluded: [
      "Individual samidha and grain offerings for each of the 9 planetary deities",
      "Chanting of authentic Vedic Navagraha Suktam mantras",
      "Personalized Gotra Sankalp for astrological alignment",
      "Performed by certified Vedic Jyotish Acharyas",
      "HD video update of the ritual",
      "Energized Navagraha Yantra coin and Prasadam sent to your home",
    ],
    whyPerform: [
      {
        title: "Planetary Balance",
        description: "Softens challenging astrological transits like Sade Sati, Dhaiya, and Mahadasha transitions.",
        icon: "Sparkles",
      },
      {
        title: "Professional Endeavors",
        description: "Clears subtle stagnations in career, education, and professional decision-making.",
        icon: "Sun",
      },
      {
        title: "Household Equilibrium",
        description: "Brings balanced temperament and mutual understanding among family members.",
        icon: "Heart",
      },
    ],
    significance: [
      "Vedic astrology recognizes the Navagrahas as cosmic administrators influencing human karmic experiences.",
      "Propitiating all nine deities simultaneously creates a balanced equilibrium across all life dimensions.",
    ],
    procedureSteps: [
      { step: "01", title: "Navagraha Mandala Sthapana", description: "Drawing the sacred 9-deity mandala using sanctified colored grains." },
      { step: "02", title: "Gotra Sankalp", description: "Invoking seeker name, gotra, and birth rashi for planetary alignment." },
      { step: "03", title: "Mantra Ahuti & Pujan", description: "Specific herbal offerings dedicated to each planet in accordance with shastras." },
      { step: "04", title: "Maha Mangal Aarti", description: "Blessings and consecration of protective Navagraha prasadam." },
    ],
    faqs: [
      { question: "Should I know my birth chart before booking?", answer: "It is helpful to provide your Rashi and Nakshatra if known; otherwise, the Acharya performs the universal gotra vidhi." },
    ],
  },
  {
    id: "service-puja-004",
    slug: "maha-lakshmi-sri-suktam-puja",
    name: "Maha Lakshmi Sri Suktam Puja",
    eyebrow: "VEDIC PUJA • PROSPERITY & GRACE",
    tagline: "Sacred Rigvedic Sri Suktam Recitation for Abundance, Harmony & Grace",
    shortDescription:
      "Venerable Lakshmi-Kubera puja with lotus flower offerings and continuous recitation of Rigvedic Sri Suktam to invoke auspiciousness and household wellbeing.",
    deity: "Goddess Mahalakshmi",
    purpose: "Prosperity, financial stability, abundance and grace",
    purposeCategory: "Prosperity & Wealth",
    purposeKey: "prosperity-wealth",
    availableDurations: ["2 Hours", "3 Hours"],
    duration: "2 - 3 Hours",
    durationHours: [2, 3],
    locationType: "Sacred Dhams & Consecrated Mandirs",
    location: "Kashi / Vedic Mandir",
    availableMode: "In-Person (Kashi) or Remote",
    isKashiAvailable: true,
    startingPrice: 1200,
    formattedPrice: "₹1,200",
    isFeatured: true,
    isActive: true,
    image: pujaLakshmiImg,
    images: [pujaLakshmiImg, pujaGaneshImg, pujaKashiImg],
    whatsIncluded: [
      "Rigvedic 16-verse Sri Suktam recitation with Samput vidhi",
      "Fresh lotus flowers, bilva fruits, pure ghee, and kumkum offerings",
      "Personalized Gotra Sankalp for family prosperity and ventures",
      "Vedic priests specializing in Devi worship",
      "Video updates of the Lakshmi archana",
      "Energized Lakshmi coin, dry fruits, and holy prasadam delivery",
    ],
    whyPerform: [
      {
        title: "Auspicious Prosperity",
        description: "Invokes positive wealth consciousness and ethical abundance in personal and professional life.",
        icon: "Sparkles",
      },
      {
        title: "Household Peace",
        description: "Fosters warmth, mutual respect, and gracious atmosphere in the family dwelling.",
        icon: "Heart",
      },
    ],
    significance: [
      "Sri Suktam is the foundational Vedic hymn from the Rigveda celebrating the divine feminine principle of prosperity and light.",
    ],
    procedureSteps: [
      { step: "01", title: "Lakshmi Aavahan", description: "Consecration of the kalash and invoking Maa Lakshmi and Lord Kubera." },
      { step: "02", title: "Gotra Sankalp", description: "Recitation of seeker details and auspicious family intentions." },
      { step: "03", title: "Sri Suktam Archana", description: "16-verse chanting with lotus offerings and kumkum abhishekam." },
      { step: "04", title: "Deepa Aarti", description: "Grand ghee lamp aarti and prasadam consecration." },
    ],
    faqs: [
      { question: "Is this suitable for a new business launch?", answer: "Yes, this puja is traditionally performed to mark new enterprises, commercial milestones, and Griha Pravesh." },
    ],
  },
  {
    id: "service-puja-005",
    slug: "ganesh-vighnaharta-puja",
    name: "Ganesha Vighnaharta Puja",
    eyebrow: "VEDIC PUJA • OBSTACLE REMOVAL",
    tagline: "Sacred Ganapati Atharvashirsha Pujan for Clarity, Wisdom & New Ventures",
    shortDescription:
      "Traditional worship of Lord Ganesha with 21 Durva grass offerings, modaks, and Atharvashirsha avartan to dissolve hurdles and bless new beginnings.",
    deity: "Lord Ganesha",
    purpose: "Professional growth, success and removing obstacles",
    purposeCategory: "Career & Success",
    purposeKey: "career-success",
    availableDurations: ["2 Hours", "3 Hours"],
    duration: "2 - 3 Hours",
    durationHours: [2, 3],
    locationType: "Consecrated Ganesha Mandirs",
    location: "Kashi / Vedic Mandir",
    availableMode: "In-Person (Kashi) or Remote",
    isKashiAvailable: true,
    startingPrice: 1100,
    formattedPrice: "₹1,100",
    isFeatured: true,
    isActive: true,
    image: pujaGaneshImg,
    images: [pujaGaneshImg, pujaVishnuImg, pujaKashiImg],
    whatsIncluded: [
      "Ganapati Atharvashirsha 11-Avartan recitation",
      "21 Durva grass bundles, red flowers, modak offerings, and pure sindoor",
      "Personalized Gotra Sankalp for auspicious beginnings",
      "Vedic purohits following authentic Ganapatya vidhi",
      "Video updates of the main archana",
      "Energized Ganesha Raksha thread and holy prasadam delivery",
    ],
    whyPerform: [
      {
        title: "Clear Roadblocks",
        description: "Traditionally performed before starting new projects, education journeys, and major life decisions.",
        icon: "Sparkles",
      },
      {
        title: "Mental Clarity",
        description: "Enhances intellect, discernment, and steady focus during critical transitions.",
        icon: "Sun",
      },
    ],
    significance: [
      "Lord Ganesha is hailed in the Vedas as the Prathama Pujya—the first deity worshipped to secure harmony in all subsequent endeavors.",
    ],
    procedureSteps: [
      { step: "01", title: "Sthapana & Sankalp", description: "Altar sanctification and formal gotra prayer dedication." },
      { step: "02", title: "Durva Archana", description: "Chanting Atharvashirsha while offering sanctified Durva grass." },
      { step: "03", title: "Naivedya & Modak Seva", description: "Offering traditional sweets and fragrant incense." },
      { step: "04", title: "Maha Aarti", description: "Closing prayers and holy prasad packing." },
    ],
    faqs: [
      { question: "Can I perform this on a Wednesday or Chaturthi?", answer: "Yes, you can request your preferred auspicious day during the coordination step." },
    ],
  },
  {
    id: "service-puja-006",
    slug: "kashi-ganga-pujan",
    name: "Kashi Ganga Ghat Pujan & Aarti",
    eyebrow: "VEDIC PUJA • TIRTHA SEVA",
    tagline: "Sacred Jal Pujan & Deep Daan on the Ancient Ghats of Varanasi",
    shortDescription:
      "Venerable River Ganga worship on Dashashwamedh and Manikarnika Ghats in Kashi with milk abhishekam, flower chadar, and 108 oil lamp offerings.",
    deity: "Maa Ganga",
    purpose: "Family wellbeing, spiritual purification and ancestral peace",
    purposeCategory: "Family & Home",
    purposeKey: "family-home",
    availableDurations: ["2 Hours"],
    duration: "2 Hours",
    durationHours: [2],
    locationType: "Dashashwamedh & Manikarnika Ghats",
    location: "Kashi (Varanasi)",
    availableMode: "In-Person (Kashi) or Remote",
    isKashiAvailable: true,
    startingPrice: 1100,
    formattedPrice: "₹1,100",
    isFeatured: true,
    isActive: true,
    image: pujaGangaImg,
    images: [pujaGangaImg, pujaKashiImg, pujaRudrabhishekImg],
    whatsIncluded: [
      "Complete Ganga Stotram chanting and Panchamrit jal offering",
      "108 deep daan (oil lamps) floated on the sacred river",
      "Personalized Gotra Sankalp on the riverbank",
      "Experienced Kashi Ghat Purohits",
      "High-definition video of the Ganga Aarti with your name invoked",
      "Energized Gangajal bottle, dry prasadam, and sacred threads delivered home",
    ],
    whyPerform: [
      {
        title: "Spiritual Cleansing",
        description: "Purifies subtle karmic impressions through direct devotion to the holy waters of Ganga.",
        icon: "Sparkles",
      },
      {
        title: "Pitri & Family Peace",
        description: "Invokes ancestral blessings and peace for departed lineage elders.",
        icon: "Heart",
      },
    ],
    significance: [
      "The holy river Ganga in Kashi is celebrated in the Puranas as the descending stream of cosmic purity that bestows spiritual liberation.",
    ],
    procedureSteps: [
      { step: "01", title: "Ghat Sankalp", description: "Priests hold Gangajal in hand and recite your family Name & Gotra." },
      { step: "02", title: "Panchamrit Abhishek", description: "Bathing the riverbank altar with milk, honey, and sacred flowers." },
      { step: "03", title: "Deep Daan", description: "Lighting 108 sanctified clay lamps on the holy river waters." },
      { step: "04", title: "Ganga Aarti", description: "Maha Aarti dedicated to Maa Ganga with conch sounds and bells." },
    ],
    faqs: [
      { question: "Is physical travel to Kashi required?", answer: "No, the Purohits conduct the ceremony directly on the ghat with your Gotra Sankalp and send full video proof." },
    ],
  },
  {
    id: "service-puja-007",
    slug: "shiva-parvati-vivah-puja",
    name: "Gauri Shankar & Vivah Badha Nivaran Puja",
    eyebrow: "VEDIC PUJA • MARRIAGE & HARMONY",
    tagline: "Sacred Shiva-Parvati Archana for Relationship Harmony & Timely Marriage",
    shortDescription:
      "Venerable Vedic prayer invoking Gauri-Shankar to resolve delays in marriage, promote relationship harmony, and bless couples with mutual understanding.",
    deity: "Lord Shiva & Mata Parvati",
    purpose: "Marriage, relationship harmony and conjugal blessing",
    purposeCategory: "Marriage & Relationships",
    purposeKey: "marriage-relationships",
    availableDurations: ["2 Hours", "3 Hours"],
    duration: "2 - 3 Hours",
    durationHours: [2, 3],
    locationType: "Consecrated Shiva Shrines",
    location: "Kashi / Vedic Mandir",
    availableMode: "In-Person (Kashi) or Remote",
    isKashiAvailable: true,
    startingPrice: 1350,
    formattedPrice: "₹1,350",
    isFeatured: true,
    isActive: true,
    image: pujaVishnuImg,
    images: [pujaVishnuImg, pujaRudrabhishekImg, pujaLakshmiImg],
    whatsIncluded: [
      "Gauri Shankar Vivah Stotram and traditional Rudra recitation",
      "Yellow flowers, sacred sindoor, suhag samagri, and fruit offerings",
      "Personalized Gotra Sankalp for marriage intentions and relationship harmony",
      "Vedic priests specializing in Saiva-Shakta rituals",
      "HD video update of the Sankalp and archana",
      "Energized Gauri-Shankar Raksha thread and holy prasadam sent home",
    ],
    whyPerform: [
      {
        title: "Overcoming Delays",
        description: "Addresses subtle planetary blockages delaying marital prospects.",
        icon: "Sparkles",
      },
      {
        title: "Conjugal Harmony",
        description: "Fosters deeper empathy, mutual respect, and long-lasting partnership peace.",
        icon: "Heart",
      },
    ],
    significance: [
      "The divine union of Shiva and Parvati represents the ultimate harmony of cosmic consciousness and creative energy.",
    ],
    procedureSteps: [
      { step: "01", title: "Gauri Ganesh Sthapana", description: "Consecration of the sacred kalash and invoking Maa Gauri." },
      { step: "02", title: "Gotra Sankalp", description: "Dedication of seeker name, gotra, and marriage intention." },
      { step: "03", title: "Gauri-Shankar Archana", description: "Sacred offerings with bilateral suhag dravyas and stotram chanting." },
      { step: "04", title: "Mangal Aarti", description: "Consecration of holy prasad and concluding mangal blessings." },
    ],
    faqs: [
      { question: "Can parents perform this for their child?", answer: "Yes, parents can provide their son or daughter's name and gotra during the Sankalpa step." },
    ],
  },
];

/**
 * 7 Client-Specified Puja Purpose Categories
 */
export const PUJA_PURPOSE_CATEGORIES = [
  {
    id: "health-wellbeing",
    categoryName: "Health & Wellbeing",
    description: "Pujas traditionally associated with wellbeing, healing intentions and protection.",
    iconName: "ShieldCheck",
    filterKey: "Health & Wellbeing",
  },
  {
    id: "marriage-relationships",
    categoryName: "Marriage & Relationships",
    description: "Pujas associated with marriage, relationships and family harmony.",
    iconName: "Heart",
    filterKey: "Marriage & Relationships",
  },
  {
    id: "prosperity-wealth",
    categoryName: "Prosperity & Wealth",
    description: "Pujas performed with Sankalpa for prosperity, stability and abundance.",
    iconName: "Coins",
    filterKey: "Prosperity & Wealth",
  },
  {
    id: "career-success",
    categoryName: "Career & Success",
    description: "Rituals associated with professional growth, success and removing obstacles.",
    iconName: "TrendingUp",
    filterKey: "Career & Success",
  },
  {
    id: "protection-peace",
    categoryName: "Protection & Peace",
    description: "Pujas performed for spiritual protection, peace and overcoming difficulties.",
    iconName: "Sparkles",
    filterKey: "Protection & Peace",
  },
  {
    id: "family-home",
    categoryName: "Family & Home",
    description: "Pujas for family wellbeing, गृह शांति and auspicious beginnings.",
    iconName: "Home",
    filterKey: "Family & Home",
  },
  {
    id: "graha-astrological",
    categoryName: "ग्रह / ज्योतिष आधारित",
    description: "Pujas selected according to specific planetary or astrological considerations.",
    iconName: "Compass",
    filterKey: "ग्रह / ज्योतिष आधारित",
  },
];

/**
 * Helper to retrieve service by slug
 */
export const getPujaCatalogueBySlug = (slug) => {
  if (!slug) return null;
  return PUJA_CATALOGUE_LIST.find((p) => p.slug === slug);
};

/**
 * Helper to retrieve featured active services
 */
export const getFeaturedPujaServices = () => {
  return PUJA_CATALOGUE_LIST.filter((p) => p.isFeatured && p.isActive);
};

