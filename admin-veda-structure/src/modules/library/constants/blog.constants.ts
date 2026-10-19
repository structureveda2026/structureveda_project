/**
 * Constants & Categories for Veda Library Module
 */

export const BLOG_CATEGORIES = [
  "Vedas",
  "Upanishads",
  "Yagya & Havans",
  "Puja & Rituals",
  "Vedic Astrology",
  "Ayurveda & Health",
  "Vastu Shastra",
  "Mantras & Stotrams",
  "Spirituality & Meditation",
  "Festivals & Fasting",
  "Kundali & Planetary Remedies",
  "Sanatan Dharma",
] as const;

export const SUGGESTED_TAGS = [
  "Rigveda",
  "Yajurveda",
  "Samaveda",
  "Atharvaveda",
  "Upanishads",
  "Maha Yagya",
  "Havan Vidhi",
  "Vedic Astrology",
  "Lord Shiva",
  "Rudrabhishek",
  "Navgrah Shanti",
  "Vastu Tips",
  "Maha Shivratri",
  "Diwali Puja",
  "Kundali Dosha",
  "Gayatri Mantra",
  "Ayurveda",
  "Peace & Prosperity",
  "Spiritual Rituals",
  "Daily Sadhana",
  "Grah Shanti",
] as const;

export const DEFAULT_AUTHOR = "Veda Structure Team";
export const DEFAULT_READ_TIME = "5 min read";
export const DEFAULT_CATEGORY = "Vedas";

export const POST_TYPES = [
  { value: "article", label: "लेख (Article)", desc: "शोध व ज्ञानवर्धक आलेख" },
  { value: "blog", label: "ब्लॉग (Blog)", desc: "सामान्य विचार, कथा व प्रसंग" },
  { value: "mantra", label: "मंत्र एवं स्तोत्र (Mantra & Stotra)", desc: "संस्कृत मंत्र, स्तोत्र व जप विधि" },
  { value: "sukta", label: "वैदिक सूक्त (Vaidik Sukta)", desc: "वेद सूक्त व ऋषि ऋचाएँ" },
  { value: "stotra", label: "स्तोत्र व स्तुति (Stotra & Stuti)", desc: "देव स्तुति व सहस्रनाम" },
  { value: "custom", label: "कस्टम प्रकार (Custom Type...)", desc: "स्वयं का नया प्रकार बनाएँ" },
] as const;

export const POPULAR_DEITIES = [
  { id: "shiva", label: "भगवान शिव (Lord Shiva)", en: "Lord Shiva" },
  { id: "vishnu", label: "भगवान विष्णु / नारायण (Lord Vishnu)", en: "Lord Vishnu" },
  { id: "devi", label: "माँ दुर्गा / भगवती (Maa Durga)", en: "Devi Durga" },
  { id: "gayatri", label: "गायत्री व माँ सरस्वती (Gayatri / Saraswati)", en: "Gayatri & Saraswati" },
  { id: "ganesh", label: "श्री गणेश (Lord Ganesha)", en: "Lord Ganesha" },
  { id: "surya", label: "भगवान सूर्य व नवग्रह (Surya & Navagraha)", en: "Surya & Navagraha" },
  { id: "hanuman", label: "श्री हनुमान जी (Lord Hanuman)", en: "Lord Hanuman" },
  { id: "krishna", label: "भगवान श्री कृष्ण (Lord Krishna)", en: "Lord Krishna" },
  { id: "rama", label: "मर्यादा पुरुषोत्तम श्री राम (Lord Rama)", en: "Lord Rama" },
] as const;

export const SACRED_METERS = [
  "गायत्री (Gayatri)",
  "अनुष्टुप् (Anushtup)",
  "त्रिष्टुप् (Trishtup)",
  "जगती (Jagati)",
  "बृहती (Brihati)",
  "पङ्क्ति (Pankti)",
  "उष्णिह् (Ushnih)",
] as const;

