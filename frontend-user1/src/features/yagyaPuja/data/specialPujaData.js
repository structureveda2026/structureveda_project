/**
 * Veda Structure - Special Puja & Shodasha Samskar Master Data
 * Authentic Vedic Life-Cycle Rites, Birthday Pujas, Pinda Daan & Tirth Shradh
 */

// Image Assets for Special Puja
import specialPujaHeroImg from "../../../assets/images/special-puja-hero.jpg";
import homaNavagrahaFireImg from "../../../assets/images/homa/navagraha-hero-sacred-fire.jpg";
import pujaKashiHeroImg from "../../../assets/images/puja/puja-kashi.webp.png";
import cardSamskaraImg from "../../../assets/images/library/cards/card-samskara.jpg";
import homaKashiImg from "../../../assets/images/homa/homa-hero-kashi-ceremony.jpg";
import bannerGhatImg from "../../../assets/images/library/banners/banner-temple-ghat.jpg";
import bannerSanctumImg from "../../../assets/images/library/banners/banner-sanctum.png";
import bannerHeroImg from "../../../assets/images/library/banners/banner-temple-hero.jpg";
import bannerAltarImg from "../../../assets/images/library/banners/banner-altar.png";
import bannerRitualSetupImg from "../../../assets/images/library/banners/banner-ritual-setup.png";
import pujaFamilyImg from "../../../assets/images/puja/puja-family.webp.png";
import pujaPanditImg from "../../../assets/images/puja/puja-pandit.webp.png";
import pujaPrasadImg from "../../../assets/images/puja/puja-prasad.webp.png";
import pujaDevotionalAltarImg from "../../../assets/images/puja/puja-devotional-altar.webp.png";
import pujaRudrabhishekImg from "../../../assets/images/puja-rudrabhishek.jpg";
import pujaMrityunjayaImg from "../../../assets/images/puja-mrityunjaya.jpg";
import pujaNavagrahaImg from "../../../assets/images/puja-navagraha.jpg";
import pujaGaneshImg from "../../../assets/images/puja-ganesh.jpg";
import pujaVishnuImg from "../../../assets/images/puja-vishnu.jpg";
import pujaGangaImg from "../../../assets/images/puja-ganga.jpg";
import pujaKashiImg from "../../../assets/images/puja-kashi.jpg";
import guidanceMarriageImg from "../../../assets/images/guidance-marriage.png";
import deviSaraswatiCardImg from "../../../assets/images/devi_saraswati_card.jpg";
import cardRigvedaImg from "../../../assets/images/library/cards/card-rigveda.jpg";
import cMeditationImg from "../../../assets/images/c-meditation.jpg";
import yagyaFinalCtaImg from "../../../assets/images/yagya/yagya-final-cta.webp.png";

// Reusable Image Configuration Registry
export const SPECIAL_PUJA_IMAGES = {
  hero: specialPujaHeroImg,
  samskarCategory: cardSamskaraImg,
  birthdayCategory: homaKashiImg,
  pindaDaanCategory: bannerGhatImg,
  tirthShradhCategory: bannerSanctumImg,
  finalCtaBg: yagyaFinalCtaImg,
  templeGhat: bannerGhatImg,
  templeHero: bannerHeroImg,
  familyPuja: pujaFamilyImg,
  panditPuja: pujaPanditImg,
};

// 4 Primary Categories for Special Puja Portal
export const SPECIAL_PUJA_CATEGORIES = [
  {
    id: "samskar",
    name: "Shodasha Samskars",
    hindiName: "षोडश संस्कार",
    slug: "samskar",
    path: "/yagya-puja/special-puja/samskar",
    count: "16 Ceremonies",
    tagline: "16 Sacred Life-Cycle Rites from Conception to Moksha",
    description: "Vedic rites of passage that purify body, mind, and soul, aligning human consciousness with cosmic dharma across life milestones.",
    badge: "16 Complete Rites",
    image: cardSamskaraImg,
    categoryBadge: "Life Milestones",
    highlight: "16 Canonical Vedic Rites",
    highlights: ["Pre-natal Rites", "Childhood Milestones", "Gurukul Initiation", "Vivaha & Final Transition"]
  },
  {
    id: "birthday-puja",
    name: "Vedic Birthday Puja",
    hindiName: "जन्मदिन पूजन एवं आयुष्य होम",
    slug: "birthday-puja",
    path: "/yagya-puja/special-puja/birthday-puja",
    count: "4 Ceremonies",
    tagline: "Ayushya Homa, Markandeya Puja & Nakshatra Shanti for Longevity",
    description: "Celebrate your sacred annual milestone with authentic Vedic Tithi calculations, longevity Agni Ahutis, and protective blessings.",
    badge: "Longevity & Health",
    image: homaKashiImg,
    categoryBadge: "Annual Blessings",
    highlight: "Vedic Tithi Alignment",
    highlights: ["Vedic Tithi Alignment", "Ayushya Homa", "Markandeya Chiranjivi Puja", "Navagraha Blessings"]
  },
  {
    id: "pinda-daan",
    name: "Pinda Daan",
    hindiName: "पिण्ड दान एवं पितृ तर्पण",
    slug: "pinda-daan",
    path: "/yagya-puja/special-puja/pinda-daan",
    count: "5 Holy Tirthas",
    tagline: "Sacred Ancestral Liberation at Kashi, Gaya & Prayagraj",
    description: "Fulfill Pitru Rin and bestow eternal peace upon departed ancestors through traditional Pinda Visarjan and Tarpanam.",
    badge: "Ancestral Liberation",
    image: bannerGhatImg,
    categoryBadge: "Sacred Tirthas",
    highlight: "Holy Teertha Sanctums",
    highlights: ["Vishnupad Gaya", "Kashi Manikarnika", "Triveni Sangam Prayagraj", "Full Shastric Vidhi"]
  },
  {
    id: "tirth-shradh",
    name: "Tirth Shradh",
    hindiName: "तीर्थ श्राद्ध एवं नारायण बलि",
    slug: "tirth-shradh",
    path: "/yagya-puja/special-puja/tirth-shradh",
    count: "4 Ritual Types",
    tagline: "Pitru Tarpana & Annual Shradh Performed Along Sacred Holy River Ghats",
    description: "Annual Shradh, Pitru Paksha Mahasankalp, and Narayan Bali performed along sacred river ghats for ancestral peace.",
    badge: "Pitru Shanti",
    image: bannerSanctumImg,
    categoryBadge: "Ghat Ceremonies",
    highlight: "Ghat Teertha Purohits",
    highlights: ["Pitru Paksha Shradh", "Tripindi Shradh", "Narayan Bali", "Ghat Teertha Vidhi"]
  }
];

// Complete 16 Shodasha Samskars in Exact Canonical Vedic Order
export const SHODASHA_SAMSKARS = [
  {
    id: 1,
    number: "01",
    name: "Garbhadhana",
    sanskritName: "गर्भाधान",
    slug: "garbhadhana",
    phase: "Pre-natal",
    timing: "Prior to conception during auspicious Muhurta",
    tagline: "The Sacred Rite of Conception & Invoking a Divine Soul",
    shortDesc: "The consecrated union of husband and wife with Vedic mantras to invoke a noble, virtuous soul into the womb.",
    description: "Garbhadhana is the primary Samskara ordained in the Grihya Sutras. It elevates conception into a sanctified yagya. Through preliminary purification, prayer to Prajapati, Vishnu, and Sinivali, the parents align their physical, mental, and astral energies to attract an elevated jivatma.",
    significance: "Purifies the reproductive seeds, clears ancestral karmic impediments, and blesses the prospective child with health, wisdom, and longevity.",
    keyOfferings: ["Prajapati Ahuti", "Ghee & Charu", "Navagraha Smaran", "Sankalpa for Noble Lineage"],
    vidhiSteps: [
      "Pratah Snana & Achamana of couple",
      "Gauri-Ganesh & Navagraha Puja",
      "Prajapati & Garbhadhana Ahuti",
      "Recitation of Rigvedic Garbhadhana Sukta",
      "Elders' Ashirwad & Satvik bhojan"
    ],
    duration: "2 to 3 Hours",
    priestsRequired: "1 to 2 Vedic Pandits",
    image: pujaDevotionalAltarImg
  },
  {
    id: 2,
    number: "02",
    name: "Punsavana",
    sanskritName: "पुंसवन",
    slug: "punsavana",
    phase: "Pre-natal",
    timing: "3rd month of pregnancy (when fetus begins quickening)",
    tagline: "Fostering Physical Vitality & Fetal Spiritual Fortitude",
    shortDesc: "Performed in the third month to ensure healthy physical and mental development of the fetus, invoking strength and valor.",
    description: "Punsavana is performed when the embryo begins to develop limbs and cognitive awareness. Consecrated banyan shoots (Vata shringa) and sacred mantras are administered to promote wholesome cellular growth and endow the child with courage, intellect, and physical stamina.",
    significance: "Protects the pregnancy from astral harm, stabilizes the developing embryo, and transmits high cognitive and physical vitality.",
    keyOfferings: ["Vata Shringa Herb Infusion", "Ghee Ahutis to Agni", "Ashirwad Mantras", "Mother's Protection Shield"],
    vidhiSteps: [
      "Panchang Puja & Svasti Vachana",
      "Ayushya Mantras invocation",
      "Administration of consecrated herbal drop",
      "Pradakshina and protective Kavacham recitation",
      "Distribution of Prasad and Ashirwad"
    ],
    duration: "2 Hours",
    priestsRequired: "1 to 2 Vedic Pandits",
    image: bannerRitualSetupImg
  },
  {
    id: 3,
    number: "03",
    name: "Simantonnayana",
    sanskritName: "सीमन्तोन्नयन",
    slug: "simantonnayana",
    phase: "Pre-natal",
    timing: "4th to 8th month of pregnancy (commonly 7th month)",
    tagline: "Mental Tranquility & Protection of the Expectant Mother",
    shortDesc: "The Vedic baby shower rite where the expectant mother's hair is lovingly parted with auspicious porcupine quill, barley, and mantras to banish anxiety.",
    description: "Simantonnayana focuses directly on the mental well-being of the expectant mother. Ancient Rishis designed this ceremony with soothing Veena music, Vedic chanting, fragrant flowers, and celebratory blessings to fill the mother with unalloyed joy.",
    significance: "Wards off negative astral influences, induces deep psychological peace in the mother, and sharpens the fetal brain faculties.",
    keyOfferings: ["Darvi Homa", "Porcupine Quill (Shalyaki)", "Audumbara Twig", "Traditional Saubhagya Samagri"],
    vidhiSteps: [
      "Sankalpa for mother & unborn child's safe delivery",
      "Parting of hair with sacred Mantras by husband",
      "Recitation of Raka and Soma Suktas",
      "Elders offering Turmeric, Kumkum & Sweets",
      "Gau Daan & Vedic blessings"
    ],
    duration: "2 to 3 Hours",
    priestsRequired: "2 Vedic Pandits",
    image: pujaFamilyImg
  },
  {
    id: 4,
    number: "04",
    name: "Jatakarma",
    sanskritName: "जातकर्म",
    slug: "jatakarma",
    phase: "Infancy",
    timing: "Immediately upon birth, prior to severing umbilical cord",
    tagline: "Welcoming the Newborn with Medha, Honey & Ghee",
    shortDesc: "The newborn is welcomed into the universe. The father chants sacred mantras into the baby's right ear for supreme intellect (Medha Janana).",
    description: "Jatakarma connects the soul just emerged from the womb to the terrestrial cosmos. The father gently administers microscopic drops of purified gold-touched ghee and wild honey (Medha Janana) while chanting Rigvedic verses imparting intellectual clarity, health, and an unblemished lifespan.",
    significance: "Immunizes the newborn against psychic shocks, activates sensory centers, and seals the child under divine paternal and cosmic protection.",
    keyOfferings: ["Gold Leaf / Ring Touch", "Purified Desi Ghee", "Forest Honey", "Ayushya Mantras"],
    vidhiSteps: [
      "Medha Janana (Whispering intellect mantras)",
      "Ayushya Sukta recitation into infant's right ear",
      "Panchamahabhuta prayer for long life",
      "Maternal breast consecration before first feeding",
      "Thanksgiving prayer and charity"
    ],
    duration: "1 to 1.5 Hours",
    priestsRequired: "1 Family Purohit",
    image: bannerAltarImg
  },
  {
    id: 5,
    number: "05",
    name: "Namakarana",
    sanskritName: "नामकरण",
    slug: "namakarana",
    phase: "Infancy",
    timing: "11th or 12th day after birth",
    tagline: "Sacred Vedic Naming Ceremony according to Nakshatra & Swara",
    shortDesc: "Formal bestowing of an auspicious name aligned with the newborn's birth constellation, Rashi, and family deity (Kuladevata).",
    description: "A name in Vedic tradition is not merely a social tag; it is an acoustic vibration that resonates with the child's subtle astral blueprint. Four names are determined: Nakshatra nama, Gupt nama, Masa nama, and Vyavaharika nama.",
    significance: "Attunes the infant's subtle body to positive planetary vibrations and bestows lifelong divine protection whenever the sacred syllables are voiced.",
    keyOfferings: ["Rice Plate for Inscription", "Panchagavya Shuddhi", "Navagraha Homa", "New Clothes & Gold Ornament"],
    vidhiSteps: [
      "Shuddhi Puja following Sutaka completion",
      "Navagraha and Kuladevata invocation",
      "Inscribing the chosen sacred name on unbroken rice grains (Akshata)",
      "Father whispers the name three times into baby's right ear",
      "Public announcement and blessings by elders"
    ],
    duration: "2 to 3 Hours",
    priestsRequired: "2 Vedic Pandits",
    image: pujaFamilyImg
  },
  {
    id: 6,
    number: "06",
    name: "Nishkramana",
    sanskritName: "निष्क्रमण",
    slug: "nishkramana",
    phase: "Infancy",
    timing: "4th month after birth",
    tagline: "First Outing to Gaze upon Surya Deva & Chandra Deva",
    shortDesc: "The child's first ceremonial journey outside the house to behold the radiant Sun, the cool Moon, and the five cosmic elements.",
    description: "In the fourth month, Nishkramana introduces the child to the cosmic realm. Clad in new garments, the baby is brought to the open courtyard where prayers are offered to Surya (solar vitality) and Chandra (mind & emotion).",
    significance: "Stimulates visual faculties, harmonizes the child's circadian rhythm with natural cosmic forces, and invokes divine guardians of the ten cardinal directions.",
    keyOfferings: ["Surya Arghya with Copper Kalash", "Chandra Darsana Offerings", "Sandalwood & White Flowers", "Curd & Honey"],
    vidhiSteps: [
      "Svasti Vachana and Dikpala Puja",
      "Carrying child to doorway with conch shell sounding",
      "Surya Namaskara & Arghya offering with infant facing East",
      "Evening Chandra Darsana with maternal uncle/parents",
      "Ashirwad for radiant vision and healthy senses"
    ],
    duration: "1.5 Hours",
    priestsRequired: "1 Vedic Pandit",
    image: bannerHeroImg
  },
  {
    id: 7,
    number: "07",
    name: "Annaprashana",
    sanskritName: "अन्नप्राशन",
    slug: "annaprashana",
    phase: "Infancy",
    timing: "6th month for boy / 5th or 7th month for girl",
    tagline: "First Solid Food Offering & Consecrated Kheer Feeding",
    shortDesc: "The sacred rite of introducing consecrated solid food (kheer / payasam) cooked with pure ingredients, seeking blessings of Goddess Annapurna.",
    description: "As teeth begin to emerge and digestive fire strengthens, Mother Annapurna and Lord Agni are worshipped. Delicious rice kheer prepared with cows' milk, honey, and cardamom is offered to the deities before being fed to the baby using a silver or gold spoon.",
    significance: "Purifies bodily tissues (Dhatus), activates healthy metabolism, and ensures the child develops refined dietary sensibilities and physical strength.",
    keyOfferings: ["Consecrated Payasam/Kheer", "Silver/Gold Spoon", "Annapurna Puja Samagri", "Curiosity Objects (Book, Pen, Gold, Grain)"],
    vidhiSteps: [
      "Gauri-Ganesh & Annapurna Yagya",
      "Consecration of cooked Kheer with Gayatri Mantra",
      "Maternal uncle or father feeds the first morsel",
      "Jeevika Pariksha (baby chooses between pen, book, coin, grain)",
      "Aarti and feast for family & guests"
    ],
    duration: "2 Hours",
    priestsRequired: "1 to 2 Vedic Pandits",
    image: pujaPrasadImg
  },
  {
    id: 8,
    number: "08",
    name: "Chudakarana (Mundan)",
    sanskritName: "चूड़ाकर्म / मुंडन",
    slug: "chudakarana",
    phase: "Childhood",
    timing: "End of 1st year or 3rd year",
    tagline: "First Haircut / Tonsure for Health, Intellect & Longevity",
    shortDesc: "The ceremonial shaving of the birth hair, purifying past-life karmic impressions and stimulating neurological development and head cooling.",
    description: "The womb hair carries subtle residual impressions of previous births. Chudakarana removes these psychic sheaths, exposes the skull's crown (Brahmarandhra) to pure solar prana, and leaves a sacred tuft (Shikha) at the vortex to protect higher mental faculties.",
    significance: "Enhances mental acuity, stabilizes nervous system balance, improves eyesight, and cleanses the subtle aura of past karmic weight.",
    keyOfferings: ["Chudakarana Homa", "Cow Dung & Curd Blend", "Kusha Grass Blades", "New Clothes for Child"],
    vidhiSteps: [
      "Agni Sthapana & Navagraha Puja",
      "Moistening hair with warm sanctified water and curd",
      "Purohit shears first locks with Kusha grass and sacred prayers",
      "Complete tonsure, applying soothing Chandan & Haldi paste",
      "Hair immersed in sacred holy river waters"
    ],
    duration: "2 to 3 Hours",
    priestsRequired: "2 Vedic Pandits",
    image: bannerGhatImg
  },
  {
    id: 9,
    number: "09",
    name: "Karnavedha",
    sanskritName: "कर्णवेध",
    slug: "karnavedha",
    phase: "Childhood",
    timing: "6th, 7th, or 8th month, or 3rd to 5th year",
    tagline: "Sacred Piercing of the Ears for Acupuncture & Mental Acuity",
    shortDesc: "The consecrated piercing of earlobes with gold or silver needles, harmonizing inner ear meridians and fostering memory and sharp intellect.",
    description: "Vedic science and Ayurveda recognize vital acupressure points on earlobes connected to the cerebrum. Right ear first for boys, left ear first for girls, accompanied by Surya and Ashwini Kumara invocations to preserve sound hearing and neurological equilibrium.",
    significance: "Protects against nervous disorders, sharpens receptive listening skills, and filters negative psychic vibrations.",
    keyOfferings: ["Gold or Silver Needle", "Ayurvedic Healing Ointment", "Surya Mantras", "Sweet Batashas"],
    vidhiSteps: [
      "Surya and Ashwini Kumara invocations",
      "Whispering blessing in child's ears",
      "Piercing right ear lobe with steady precision and mantra",
      "Piercing left ear lobe with steady precision and mantra",
      "Applying healing sandalwood paste and feeding sweets"
    ],
    duration: "1 to 1.5 Hours",
    priestsRequired: "1 Vedic Pandit",
    image: pujaPanditImg
  },
  {
    id: 10,
    number: "10",
    name: "Vidyarambha",
    sanskritName: "विद्यारम्भ",
    slug: "vidyarambha",
    phase: "Childhood",
    timing: "5th year on an auspicious day (Akshaya Tritiya / Vijayadashami)",
    tagline: "Formal Initiation into Alphabets, Learning & Saraswati",
    shortDesc: "The child's initiation into the world of letters and divine knowledge by inscribing 'Om' and 'Hari Sri' upon consecrated rice or sand.",
    description: "Also known as Aksharabhyasa, this ceremony marks the transition into formal education. With the guidance of the Acharya, the child writes sacred mantras and the alphabet on a tray of raw rice or gold sand, dedicating their intellect to Goddess Saraswati and Lord Ganesha.",
    significance: "Awakens the intellect (Buddhi), invokes literary mastery, articulates speech clarity, and establishes lifelong reverence for knowledge.",
    keyOfferings: ["Saraswati Yantra", "Plate of Golden Rice (Akshata)", "Slate / Stylus / Gold Coin", "White Lotus & Books"],
    vidhiSteps: [
      "Ganesha & Saraswati Avahana",
      "Guru Puja and seeking preceptor's blessings",
      "Guiding child's finger to write 'Om Namah Shivaya' or 'Hari Sri Ganapataye'",
      "Reading the first alphabet aloud",
      "Daan of stationery, books, and dakshina to scholars"
    ],
    duration: "1.5 to 2 Hours",
    priestsRequired: "1 to 2 Vedic Pandits",
    image: deviSaraswatiCardImg
  },
  {
    id: 11,
    number: "11",
    name: "Upanayana (Yajnopavita)",
    sanskritName: "उपनयन / यज्ञोपवीत",
    slug: "upanayana",
    phase: "Student Life",
    timing: "8th to 16th year depending on family tradition",
    tagline: "The Sacred Thread Ceremony & Rebirth into Vedic Wisdom (Dvija)",
    shortDesc: "One of the most momentous Samskars where the youth receives the Yajnopavita (sacred thread) and the Gayatri Mantra, becoming 'twice-born' (Dvija).",
    description: "Upanayana means 'bringing near'—near to the Guru, near to the Vedas, and near to the Divine. The child receives the triple-stranded Yajnopavita representing debt to Rishis, Pitrus, and Devas, receives Brahmopadesha (Gayatri initiation), and takes the vow of Brahmacharya.",
    significance: "Grants eligibility to perform Vedic sandhyavandanam, activates spiritual discernment, instills discipline, and protects the mind with Gayatri shakti.",
    keyOfferings: ["Three-Stranded Cotton Yajnopavita", "Munj Grass Belt (Mekhala)", "Palasa Staff (Danda)", "Brahmachari Vastra"],
    vidhiSteps: [
      "Matri Bhojana (last meal with mother as child)",
      "Tonsure, sacred bath, and wearing Brahmachari robes",
      "Yajnopavita Dharana with consecrated Vedic mantras",
      "Brahmopadesha (Gayatri initiation into the ear)",
      "Bhikshacharanam (seeking alms from mother and elders)"
    ],
    duration: "4 to 6 Hours",
    priestsRequired: "3 to 4 Vedic Pandits",
    image: cardSamskaraImg
  },
  {
    id: 12,
    number: "12",
    name: "Vedarambha",
    sanskritName: "वेदारम्भ",
    slug: "vedarambha",
    phase: "Student Life",
    timing: "Immediately following Upanayana or within 1 year",
    tagline: "Commencing the Study of Rig, Sama, Yajur & Atharva Vedas",
    shortDesc: "The formal beginning of Vedic study under an authentic Guru, reciting the first Sukta of each Veda with proper Swara intonation.",
    description: "Vedarambha signifies deep immersion into sacred literature. Each Veda has its designated Rishi, Devata, and Chhandas. The student vows to memorize, contemplate, and live by Vedic injunctions, beginning with 'Agnimile Purohitam' and the opening hymns.",
    significance: "Connects the student to unbroken lineages of Rishis, protects mental clarity through flawless pronunciation, and establishes cosmic ethical balance.",
    keyOfferings: ["Prajapati & Indra Homa", "Samidha Ahutis", "Veda Granthas Puja", "Guru Dakshina"],
    vidhiSteps: [
      "Veda Purusha invocation and Homa",
      "Chanting opening hymns of the 4 Vedas",
      "Taking vows of truth, purity, and intellectual diligence",
      "Guru blessing with sacred Akshata",
      "Charity to students and scholars"
    ],
    duration: "2 to 3 Hours",
    priestsRequired: "2 Vedic Pandits",
    image: cardRigvedaImg
  },
  {
    id: 13,
    number: "13",
    name: "Keshanta (Godana)",
    sanskritName: "केशान्त / गोदान",
    slug: "keshanta",
    phase: "Student Life",
    timing: "Around 16th year (adulthood)",
    tagline: "First Shaving of the Beard & Sacred Vow of Adult Chastity",
    shortDesc: "Marks the arrival of physical maturity with the first shaving of facial hair, gifting of a cow (Godana) to the Guru, and reaffirming moral integrity.",
    description: "Keshanta mirrors Chudakarana on an adult scale. As the young student reaches adolescence and facial hair appears, this ceremony reminds them that adult vitality must be harnessed with Brahmacharya, humility, and moral responsibility.",
    significance: "Converts physical vitality into spiritual radiance (Ojas and Tejas), preserving character during critical formative years.",
    keyOfferings: ["Godana (Cow / Go-seva contribution)", "Keshanta Homa", "New White Robes", "Shaving Samagri"],
    vidhiSteps: [
      "Purification Snana and Agni worship",
      "Ceremonial shaving of facial hair with mantras",
      "Performance of Godana ritual to the Acharya",
      "Renewal of Brahmacharya vows for remaining study period",
      "Feast and distribution of gifts"
    ],
    duration: "2 Hours",
    priestsRequired: "2 Vedic Pandits",
    image: bannerAltarImg
  },
  {
    id: 14,
    number: "14",
    name: "Samavartana (Snana)",
    sanskritName: "समावर्तन",
    slug: "samavartana",
    phase: "Student Life",
    timing: "Conclusion of student life (graduation)",
    tagline: "Graduation from Gurukul & Return to Society as Snataka",
    shortDesc: "The joyous homecoming and formal graduation ceremony where the student relinquishes student vows and enters society as a cultured scholar (Snataka).",
    description: "Samavartana marks the completion of education. The student takes a ceremonial eight-vessel holy bath (Snana), receives the title 'Snataka', presents their heartfelt Guru Dakshina, and receives the celebrated Taittiriya valedictory address: 'Satyam Vada, Dharmam Chara'.",
    significance: "Transitions the individual into civic responsibility with high ethical standards, academic prestige, and readiness for household life.",
    keyOfferings: ["Ashtakalasha Snana Water", "Umbrella, Shoes & Garland (Symbols of Snataka)", "Guru Dakshina", "Navagraha Homa"],
    vidhiSteps: [
      "Eight Kalash sacred ceremonial bath (Snana)",
      "Discarding student staff and garments",
      "Adorning fine garments, perfume, umbrella, and footwear",
      "Final instruction (Dikshanta Bashana) by Acharya",
      "Triumphant return to family and societal welcome"
    ],
    duration: "3 Hours",
    priestsRequired: "2 to 3 Vedic Pandits",
    image: cardSamskaraImg
  },
  {
    id: 15,
    number: "15",
    name: "Vivaha",
    sanskritName: "विवाह",
    slug: "vivaha",
    phase: "Householder",
    timing: "Upon entering Grihastha Ashrama during auspicious Muhurta",
    tagline: "Sacred Vedic Union with Saptapadi, Agni Pradakshina & Kanyadaan",
    shortDesc: "The supreme Samskara joining bride and groom as equal spiritual partners (Dharmapatni & Dharmapati) for dharma, artha, kama, and moksha.",
    description: "Vedic Vivaha is an unbreakable spiritual pact witnessed by Agni Deva, parents, ancestors, and cosmic devatas. Vivaha fuses two souls into one unit to maintain societal stability, perform daily Pancha Maha Yagyas, and continue the noble ancestry.",
    significance: "Establishes the foundation of Grihastha Ashrama—the pillar supporting all other ashramas—through Kanyadaan, Panigrahana, Saptapadi, and Sindoor Daan.",
    keyOfferings: ["Laja Homa (Parched Grain Offerings)", "Vivaha Homa Kund", "Mangalsutra & Sindoor", "Saptapadi Rice Heaps"],
    vidhiSteps: [
      "Vara Puja & Madhuparka offering",
      "Kanyadaan & Panigrahana (joining of hands)",
      "Agni Pradakshina & Laja Homa",
      "Saptapadi (Seven steps taking seven sacred vows)",
      "Arundhati-Dhruva Nakshatra Darsana & Sindoor Daan"
    ],
    duration: "4 to 6 Hours",
    priestsRequired: "3 to 5 Vedic Pandits",
    image: guidanceMarriageImg
  },
  {
    id: 16,
    number: "16",
    name: "Antyeshti",
    sanskritName: "अन्त्येष्टि",
    slug: "antyeshti",
    phase: "Final Transition",
    timing: "Upon bodily departure (final journey)",
    tagline: "The Final Sacrifice Returning the Body to the Panchamahabhutas",
    shortDesc: "The last Samskara offering the mortal physical sheath back into sacred Agni, releasing the soul for its journey towards higher realms or Moksha.",
    description: "Antyeshti literally means 'the final sacrifice'. In Vedic philosophy, death is a transition. The body, having served its purpose, is offered to Agni so that the five great elements dissolve back into cosmic equilibrium.",
    significance: "Liberates the departing jivatma from terrestrial attachments, protects it during its astral journey, and guides it toward Pitruloka or ultimate liberation.",
    keyOfferings: ["Pavitra Ganga Jal & Tulsi Leaves", "Sandalwood & Camphor Logs", "Desi Ghee Ahutis", "Kusha Grass & Black Sesame"],
    vidhiSteps: [
      "Snana & shroud wrapping of mortal frame",
      "Pavitra Ganga Jal and Tulsi placed on lips and brow",
      "Carrying to cremation ground with Ram Naam chanting",
      "Pravritta Homa and Kapala Kriya by eldest son / family",
      "Asthi Sanchayana & submersion in sacred river (Ganga Visarjan)"
    ],
    duration: "Post-departure rites (13 Days complete cycle)",
    priestsRequired: "Learned Teertha Purohits",
    image: pujaGangaImg
  }
].map((s) => ({
  ...s,
  bookingPath: `/yagya-puja/special-puja/samskar/${s.slug}/book`,
}));

// Special Birthday Puja Services
export const BIRTHDAY_PUJA_SERVICES = [
  {
    id: "ayushya-homa",
    name: "Maha Ayushya Homa",
    hindiName: "महा आयुष्य होम",
    slug: "ayushya-homa",
    backendSlug: "ayushya-homa",
    serviceType: "HOMA",
    bookingPath: "/yagya-puja/homa/ayushya-homa/book",
    timing: "On birth tithi morning",
    duration: "3 to 4 Hours",
    priests: "3 Vedic Pandits",
    summary: "Ancient Rigvedic fire ritual dissolving longevity afflictions to bless the Yajman with health, vigor, and vitality.",
    deities: ["Lord Brahma", "Ayur Devata", "Markandeya Maharshi", "Ashwini Kumaras"],
    keyBenefits: [
      "Protects against sudden health impediments",
      "Enhances vitality & balances Tridoshas",
      "Sacred Agni Ahutis on your Janma Tithi"
    ],
    image: homaNavagrahaFireImg
  },
  {
    id: "markandeya-puja",
    name: "Chiranjivi Markandeya Puja",
    hindiName: "चिरंजीवी मार्कण्डेय पूजन",
    slug: "maha-mrityunjaya-puja",
    backendSlug: "maha-mrityunjaya-puja",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/maha-mrityunjaya-puja/book",
    timing: "Brahma Muhurta / Morning",
    duration: "2 Hours",
    priests: "2 Vedic Pandits",
    summary: "Dedicated to immortal Sage Markandeya who conquered untimely adversity, bestowing steadfast longevity and deep spiritual fearlessness.",
    deities: ["Rishi Markandeya", "Lord Shiva", "Maha Mrityunjaya"],
    keyBenefits: [
      "Conquers anxiety and fear of mortality",
      "Bestows protective Kavacha shield",
      "Strengthens mental stamina & memory"
    ],
    image: pujaMrityunjayaImg
  },
  {
    id: "nakshatra-shanti",
    name: "Janma Nakshatra Shanti & Navagraha Puja",
    hindiName: "जन्म नक्षत्र शान्ति एवं नवग्रह पूजन",
    slug: "navagraha-shanti-puja",
    backendSlug: "navagraha-shanti-puja",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/navagraha-shanti-puja/book",
    timing: "Day of Moon transiting Janma Nakshatra",
    duration: "2.5 Hours",
    priests: "2 Vedic Pandits",
    summary: "Harmonizes birth planetary configurations and ruling Nakshatra deities to dissolve annual astrological doshas and invite auspiciousness.",
    deities: ["Janma Nakshatra Devata", "Navagrahas", "Ishta Devata"],
    keyBenefits: [
      "Neutralizes negative annual transit doshas",
      "Energizes ruling Janma Nakshatra deity",
      "Harmonizes personal and family destiny"
    ],
    image: pujaNavagrahaImg
  },
  {
    id: "rudrabhishek-birthday",
    name: "Kashi Ekadasa Rudrabhishek",
    hindiName: "काशी एकादश रुद्राभिषेक",
    slug: "rudrabhishek-puja",
    backendSlug: "rudrabhishek-puja",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/rudrabhishek-puja/book",
    timing: "Morning / Pradosha Kaal",
    duration: "3 Hours",
    priests: "3 Kashi Acharyas",
    summary: "Sacred Panchamrit abhishek of Lord Shiva performed at Kashi with eleven continuous recitations of Sri Rudram and Chamakam.",
    deities: ["Lord Shiva (Kashi Vishwanath)", "Maa Annapurna"],
    keyBenefits: [
      "Deep purification of accumulated karma",
      "Dispels subtle negativity and doshas",
      "Spiritual peace & Shiva's divine shield"
    ],
    image: pujaRudrabhishekImg
  }
];

// Pinda Daan Locations and Ritual Vidhi
export const PINDA_DAAN_LOCATIONS = [
  {
    id: "gaya",
    name: "Gaya Tirtha",
    state: "Bihar",
    slug: "gaya-pinda-daan",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    holySites: ["Vishnupad Temple", "Falgu River", "Akshaya Vat"],
    significance: "Lord Rama performed Pinda Daan for King Dasharatha here. According to Puranas, a single Pinda offered at the footprint of Lord Vishnu liberates 21 generations of ancestors.",
    idealTime: "Pitru Paksha or any Amavasya",
    priests: "Traditional Gayawal Pandas",
    image: bannerHeroImg
  },
  {
    id: "kashi",
    name: "Kashi (Varanasi)",
    state: "Uttar Pradesh",
    slug: "kashi-pinda-daan",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    holySites: ["Manikarnika Ghat", "Harishchandra Ghat", "Dashashwamedh Ghat", "Pishacha Mochan Kund"],
    significance: "City of Lord Shiva where departing souls receive Taraka Mantra. Pinda Daan at Pishacha Mochan Kund releases spirits trapped in lower astral realms.",
    idealTime: "Throughout the year, especially Shradh fortnight",
    priests: "Vedic Kashi Teertha Purohits",
    image: pujaKashiImg
  },
  {
    id: "prayagraj",
    name: "Triveni Sangam (Prayagraj)",
    state: "Uttar Pradesh",
    slug: "prayagraj-pinda-daan",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    holySites: ["Triveni Sangam (Confluence of Ganga, Yamuna & Saraswati)", "Veni Madhav"],
    significance: "King of all Tirthas (Teertharaja). Performing Tarpana at the confluence carries blessings of purifying holy bath, tonsure (Veni Daan), and ancestral liberation.",
    idealTime: "Magh Mela, Pitru Paksha, Somavati Amavasya",
    priests: "Prayag Teertha Purohits",
    image: bannerGhatImg
  },
  {
    id: "badrinath",
    name: "Brahma Kapal (Badrinath)",
    state: "Uttarakhand",
    slug: "badrinath-brahma-kapal",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    holySites: ["Brahma Kapal Ghat along Alaknanda River"],
    significance: "Where Lord Shiva was absolved of Brahma Hatya dosha. Pinda Daan performed here is considered final—no further Shradh is required thereafter.",
    idealTime: "May to October when Badrinath temple is open",
    priests: "Badri Teertha Purohits",
    image: cMeditationImg
  },
  {
    id: "haridwar",
    name: "Haridwar & Rishikesh",
    state: "Uttarakhand",
    slug: "haridwar-tarpana",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    holySites: ["Har Ki Pauri", "Brahma Kund", "Kushavarta Ghat"],
    significance: "Where Mother Ganga enters the plains. Kushavarta Ghat is specifically designated by Sage Dattatreya for ancestral peace rites.",
    idealTime: "Amavasya, Solar/Lunar Eclipses, Shradh Paksha",
    priests: "Vedic Gangaputras",
    image: pujaGangaImg
  }
];

// Tirth Shradh Ceremonies
export const TIRTH_SHRADH_CEREMONIES = [
  {
    id: "pitru-paksha-shradh",
    name: "Mahalaya Pitru Paksha Shradh",
    hindiName: "महालया पितृ पक्ष श्राद्ध",
    slug: "pitru-paksha-shradh",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    significance: "The sacred 16-day lunar fortnight when Sun transitions through Virgo and ancestors descend to receive food and water offerings from descendants.",
    vidhiIncludes: ["Panchabali (Cow, Dog, Crow, Deva, Ant)", "Kusha Grass Tarpanam", "16 Pindas Offering", "Brahmana Bhojana & Daan"],
    image: pujaKashiHeroImg
  },
  {
    id: "tripindi-shradh",
    name: "Tripindi Shradh (Pitru Dosha Nivarana)",
    hindiName: "त्रिपिण्डी श्राद्ध (पितृ दोष निवारण)",
    slug: "tripindi-shradh",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    significance: "Special ritual performed when ancestral rituals have been neglected or when unfulfilled desires cause distress to family members.",
    vidhiIncludes: ["Three Kalasha Sthapana (Brahma, Vishnu, Mahesh)", "Three Types of Pindas (Barley, Rice, Black Sesame)", "Graha Shanti & Daan"],
    image: bannerAltarImg
  },
  {
    id: "narayan-bali",
    name: "Narayan Bali & Nag Bali",
    hindiName: "नारायण बलि एवं नाग बलि",
    slug: "narayan-bali",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    significance: "Prescribed in Garuda Purana for departed souls who suffered untimely or unnatural departures, invoking Lord Narayana for Moksha.",
    vidhiIncludes: ["Golden Narayana Murti Ahuti", "Pravritta Homa", "Pratima Visarjan in Ganga", "Shodasha Shradh"],
    image: pujaVishnuImg
  },
  {
    id: "amavasya-tarpana",
    name: "Monthly Amavasya Tarpana",
    hindiName: "मासिक अमावस्या तर्पण",
    slug: "amavasya-tarpana",
    backendSlug: "kashi-ganga-pujan",
    serviceType: "PUJA",
    bookingPath: "/yagya-puja/puja/kashi-ganga-pujan/book",
    significance: "A monthly offering of water, black sesame seeds, and sacred Kusha grass on the new moon day to nourish ancestors with spiritual peace.",
    vidhiIncludes: ["Rishi Tarpana", "Deva Tarpana", "Pitru Tarpana", "Gau Grass Daan"],
    image: pujaGangaImg
  }
];

// Why Choose Veda Structure Trust Pillars
export const WHY_CHOOSE_SPECIAL_PUJA = [
  {
    icon: "ShieldCheck",
    title: "Traditional Vedic Acharyas",
    subtitle: "Gurukul & Veda Pathashala Lineage",
    description: "Every ceremony is solemnized exclusively by traditionally trained Acharyas from established lineages in Varanasi, Haridwar, and Prayagraj."
  },
  {
    icon: "ScrollText",
    title: "Authentic Shastric Vidhi",
    subtitle: "Strict Grihya Sutra Compliance",
    description: "Mantras, swaras, herbs, and offerings conform precisely to Rig, Sama, Yajur, and Atharva Vedic texts without synthetic shortcuts."
  },
  {
    icon: "HeartHandshake",
    title: "Personalized Family Sankalp",
    subtitle: "Gotra, Nakshatra & Lineage Chanted",
    description: "Prior to ignition of the sacred fire, your specific Gotra, Janma Nakshatra, and ancestral lineage are chanted aloud during the live Sankalpa."
  },
  {
    icon: "Truck",
    title: "Sacred Prasad & Video Updates",
    subtitle: "Doorstep Delivery & Recording",
    description: "Receive the consecrated holy Prasad, Yantra, and Raksha Sutra shipped to your home, backed by comprehensive video footage of the ceremony."
  }
];

// 4-Step How It Works Stepper
export const SPECIAL_PUJA_STEPS = [
  {
    step: "01",
    title: "Select Your Ritual",
    desc: "Choose from 16 Shodasha Samskars, Birthday Pujas, or Ancestral Shradh ceremonies suited to your spiritual requirements."
  },
  {
    step: "02",
    title: "Share Your Details",
    desc: "Provide Yajman and family details including Names, Gotra, Janma Nakshatra, and specific sankalp intentions."
  },
  {
    step: "03",
    title: "Confirm Muhurat & Ritual",
    desc: "Our senior Acharyas determine the most auspicious Vedic Muhurta and prepare the consecrated Vedi and samagri."
  },
  {
    step: "04",
    title: "Complete Your Sacred Ceremony",
    desc: "Participate in person or virtually via live broadcast, and receive consecrated Prasad and video updates delivered to your doorstep."
  }
];

// FAQ Array for Accordion
export const SPECIAL_PUJA_FAQS = [
  {
    id: "faq-1",
    question: "What are the 16 Shodasha Samskars, and can adults perform missed ones?",
    answer: "The 16 Shodasha Samskars are ancient Vedic rites of passage outlined in the Grihya Sutras that sanctify a human being from conception (Garbhadhana) to the final rite (Antyeshti). If childhood Samskars like Namakarana, Chudakarana (Mundan), Vidyarambha, or Upanayana were inadvertently missed, Shastras prescribe 'Prayashchitta' (atonement rite) followed by ceremonial performance of the missed Samskara even in adulthood before Vivaha."
  },
  {
    id: "faq-2",
    question: "Can Birthday Puja or Ayushya Homa be conducted based on Vedic Tithi rather than English date?",
    answer: "Yes, in fact, performing Birthday Puja on your Vedic Janma Tithi (calculated using your birth Nakshatra and lunar day) is traditionally recommended over the Gregorian calendar date. When you submit your birth details, our senior astrologers calculate your exact Vedic birth anniversary and schedule the Ayushya Homa for optimal cosmic resonance."
  },
  {
    id: "faq-3",
    question: "How is Pinda Daan performed remotely if our family cannot travel to Gaya or Kashi?",
    answer: "While personal presence at Vishnupad Temple or Manikarnika Ghat is commendable, Vedic scriptures explicitly allow 'Pratinidhi' (designated proxy) rituals. Our learned Teertha Purohits take the formal Sankalpa invoking your specific Gotra, three generations of paternal and maternal ancestors' names, and family details. You can join the ritual live via video broadcast."
  },
  {
    id: "faq-4",
    question: "What information is needed to take Sankalpa for Pitru Shradh?",
    answer: "For an authentic Pitru Sankalpa, you provide: (1) Yajman's full name, Gotra, and Janma Nakshatra; (2) Names of departed ancestors up to three generations (Father, Grandfather, Great-grandfather; and Mother, Grandmother, Great-grandmother) if known; (3) Tithi (lunar day) of departure if known; and (4) The chosen holy Teertha venue."
  },
  {
    id: "faq-5",
    question: "What is included in the sacred Prasad package shipped to our home?",
    answer: "Following the ceremony, a consecrated Prasad box is prepared under strict purity protocols. It contains: Consecrated Vibhuti / Bhasma from the Homa kunda, energized Raksha Sutra (sacred thread for wrist), Panchamrit-purified Tulsi leaves, dry fruits and Pancha Meva, and a laminated Vedic Yantra card or deity blessing photograph, along with a link to your ritual video."
  }
];
