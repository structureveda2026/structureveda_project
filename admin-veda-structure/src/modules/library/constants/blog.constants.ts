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
  { value: "article", label: "Article", desc: "Research & knowledge articles" },
  { value: "blog", label: "Blog", desc: "General reflections, stories & insights" },
  { value: "mantra", label: "Mantra & Stotra", desc: "Sanskrit mantras, stotras & chanting guides" },
  { value: "sukta", label: "Vedic Sukta", desc: "Vedic suktas & rishi richas" },
  { value: "stotra", label: "Stotra & Stuti", desc: "Deity hymns & sahasranamas" },
  { value: "custom", label: "Custom Type...", desc: "Create your own custom format" },
] as const;

export const POPULAR_DEITIES = [
  { id: "shiva", label: "Lord Shiva", en: "Lord Shiva" },
  { id: "vishnu", label: "Lord Vishnu / Narayana", en: "Lord Vishnu" },
  { id: "devi", label: "Maa Durga / Bhagavati", en: "Devi Durga" },
  { id: "gayatri", label: "Gayatri & Maa Saraswati", en: "Gayatri & Saraswati" },
  { id: "ganesh", label: "Lord Ganesha", en: "Lord Ganesha" },
  { id: "surya", label: "Lord Surya & Navagraha", en: "Surya & Navagraha" },
  { id: "hanuman", label: "Lord Hanuman", en: "Lord Hanuman" },
  { id: "krishna", label: "Lord Krishna", en: "Lord Krishna" },
  { id: "rama", label: "Lord Rama", en: "Lord Rama" },
] as const;

export const SACRED_METERS = [
  "Gayatri",
  "Anushtup",
  "Trishtup",
  "Jagati",
  "Brihati",
  "Pankti",
  "Ushnih",
] as const;

