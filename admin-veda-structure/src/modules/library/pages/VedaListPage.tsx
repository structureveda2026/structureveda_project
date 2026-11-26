import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Sparkles,
  Layers,
  Scroll,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  FolderTree,
  Flame,
  Music,
  Compass,
  ShieldCheck,
} from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/context/ToastContext";
import type { Veda } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";

/**
 * Known authentic baseline counts for the 4 Vedas and major Granthas
 * Used as fallback if backend statsMeta is 0 or uncalculated
 */
const KNOWN_GRANTHA_COUNTS: Record<string, { nodeCount: number; mantraCount: number }> = {
  rigveda: { nodeCount: 12, mantraCount: 6 },
  yajurveda: { nodeCount: 18, mantraCount: 5 },
  samaveda: { nodeCount: 8, mantraCount: 3 },
  atharvaveda: { nodeCount: 8, mantraCount: 3 },
  "vishnu-purana": { nodeCount: 6, mantraCount: 126 },
  "shiva-purana": { nodeCount: 7, mantraCount: 96 },
  "bhagavata-purana": { nodeCount: 12, mantraCount: 335 },
  "garuda-purana": { nodeCount: 2, mantraCount: 50 },
  "markandeya-purana": { nodeCount: 5, mantraCount: 137 },
  "bhavishya-purana": { nodeCount: 4, mantraCount: 85 },
  "valmiki-ramayana": { nodeCount: 7, mantraCount: 500 },
  mahabharata: { nodeCount: 18, mantraCount: 100 },
  "bhagavad-gita": { nodeCount: 18, mantraCount: 700 },
  "isha-upanishad": { nodeCount: 1, mantraCount: 18 },
  "kena-upanishad": { nodeCount: 4, mantraCount: 34 },
  "katha-upanishad": { nodeCount: 6, mantraCount: 119 },
  "prashna-upanishad": { nodeCount: 6, mantraCount: 67 },
  "mundaka-upanishad": { nodeCount: 6, mantraCount: 64 },
  "mandukya-upanishad": { nodeCount: 4, mantraCount: 12 },
  "taittiriya-upanishad": { nodeCount: 3, mantraCount: 48 },
  "chandogya-upanishad": { nodeCount: 8, mantraCount: 150 },
  "brihadaranyaka-upanishad": { nodeCount: 6, mantraCount: 180 },
  "samkhya-darshana": { nodeCount: 6, mantraCount: 527 },
  "yoga-darshana": { nodeCount: 4, mantraCount: 195 },
  "nyaya-darshana": { nodeCount: 5, mantraCount: 528 },
  "vaisheshika-darshana": { nodeCount: 10, mantraCount: 370 },
  "mimamsa-darshana": { nodeCount: 12, mantraCount: 900 },
  "vedanta-darshana": { nodeCount: 4, mantraCount: 555 },
};

const getVedaNodeCount = (veda: Veda): number => {
  if (veda.statsMeta && typeof veda.statsMeta.nodeCount === "number" && veda.statsMeta.nodeCount > 0) {
    return veda.statsMeta.nodeCount;
  }
  const key = (veda.id || veda.slug || "").toLowerCase();
  return KNOWN_GRANTHA_COUNTS[key]?.nodeCount ?? 6;
};

const getVedaMantraCount = (veda: Veda): number => {
  if (veda.statsMeta && typeof veda.statsMeta.mantraCount === "number" && veda.statsMeta.mantraCount > 0) {
    return veda.statsMeta.mantraCount;
  }
  const key = (veda.id || veda.slug || "").toLowerCase();
  return KNOWN_GRANTHA_COUNTS[key]?.mantraCount ?? 12;
};

export interface VedaListPageProps {
  category?: string;
  title?: string;
}

interface CategoryConfig {
  defaultTitle: string;
  hindiTitle: string;
  badgeText: string;
  shloka: string;
  description: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDesc: string;
  newItemLabel: string;
  heroWatermark: string;
  heroGradient: string;
  heroBorder: string;
  heroGlow: string;
  heroBadgeColor: string;
  totalLabel: string;
  subTypeLabel: string;
  priestRoleTitle: string;
  defaultPriestIcon: React.FC<{ className?: string }>;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  purana: {
    defaultTitle: "Puranas",
    hindiTitle: "18 Mahapuranas & Puranic Literature",
    badgeText: "Ashtadasha Mahapurana",
    shloka: "Ashtadasha Puraneshu Vyasasya Vachanadvayam • Paropakaraya Punyaya",
    description:
      "The 18 Mahapuranas of Sanatana Dharma authored by Maharshi Vyasa — covering cosmology, lineages, sacred tirthas, devotion, ethics, and divine lilas.",
    searchPlaceholder: "Search Puranas (e.g. Vishnu Purana, Shiva Purana, Bhagavata, Markandeya)...",
    emptyTitle: "No Puranas found",
    emptyDesc: "If no Puranas are loaded in the database yet, click the button below to seed the default collection or add a new text.",
    newItemLabel: "New Purana",
    heroWatermark: "Purana",
    heroGradient: "from-[#290c2e] via-[#3d1344] to-[#1a081d]",
    heroBorder: "border-purple-500/30",
    heroGlow: "bg-purple-500/20",
    heroBadgeColor: "bg-purple-500/20 border-purple-400/30 text-purple-200",
    totalLabel: "Total Puranas",
    subTypeLabel: "Mahapurana • Upapurana",
    priestRoleTitle: "Compiler / Narrator",
    defaultPriestIcon: BookOpen,
  },
  itihasa: {
    defaultTitle: "Itihasa",
    hindiTitle: "Sanatana Itihasa Epics & Ethics",
    badgeText: "Itihasa Tradition",
    shloka: "Dharmarthakamamokshanam Upadeshasamanvitam • Itihasam Prachakshate",
    description:
      "Sanatana Itihasa — Valmiki Ramayana, Mahabharata, and Shrimad Bhagavad Gita. Eternal teachings of dharma, statecraft, valor, and philosophy.",
    searchPlaceholder: "Search Itihasa texts (e.g. Ramayana, Mahabharata, Bhagavad Gita, Valmiki)...",
    emptyTitle: "No Itihasa texts found",
    emptyDesc: "Use the button below to seed or add Itihasa epics to the database.",
    newItemLabel: "New Itihasa Text",
    heroWatermark: "Itihasa",
    heroGradient: "from-[#2e1c05] via-[#482c09] to-[#1c1103]",
    heroBorder: "border-amber-500/30",
    heroGlow: "bg-amber-400/20",
    heroBadgeColor: "bg-amber-500/20 border-amber-400/30 text-amber-200",
    totalLabel: "Total Itihasa Texts",
    subTypeLabel: "Ramayana • Mahabharata • Gita",
    priestRoleTitle: "Author / Preceptor",
    defaultPriestIcon: ShieldCheck,
  },
  upanishad: {
    defaultTitle: "Upanishads",
    hindiTitle: "Upanishad Literature & Vedanta Philosophy",
    badgeText: "Dashopanishad & Vedanta",
    shloka: "Satyameva Jayate Nanritam • Mundaka Upanishad 3.1.6",
    description:
      "Principal Upanishads of Sanatana Vedanta (led by the 10 Dashopanishads) — illuminating Atman, Brahman, supreme knowledge, and liberation.",
    searchPlaceholder: "Search Upanishads (e.g. Isha, Kena, Katha, Mundaka, Mandukya, Chandogya)...",
    emptyTitle: "No Upanishads found",
    emptyDesc: "Click Add New Upanishad or Seed Data to populate Vedanta Upanishad texts.",
    newItemLabel: "New Upanishad",
    heroWatermark: "Upanishad",
    heroGradient: "from-[#141838] via-[#241f4c] to-[#0c0e24]",
    heroBorder: "border-indigo-500/30",
    heroGlow: "bg-indigo-500/20",
    heroBadgeColor: "bg-indigo-500/20 border-indigo-400/30 text-indigo-200",
    totalLabel: "Total Upanishads",
    subTypeLabel: "Dashopanishad • Vedanta",
    priestRoleTitle: "Vedic Shakha / Rishi",
    defaultPriestIcon: Sparkles,
  },
  darshana: {
    defaultTitle: "Darshana",
    hindiTitle: "Shad-Darshana & Indian Metaphysics",
    badgeText: "Shad-Darshana Tradition",
    shloka: "Drishyate Anena Iti Darshanam • Tattvajnanam Mokshasadhanam",
    description:
      "The six orthodox schools of Sanatana philosophy — Samkhya, Yoga, Nyaya, Vaisheshika, Mimamsa, and Vedanta covering epistemology, logic, and realization.",
    searchPlaceholder: "Search Darshanas (e.g. Samkhya, Yoga, Nyaya, Vaisheshika, Mimamsa, Vedanta)...",
    emptyTitle: "No Darshana texts found",
    emptyDesc: "Click Add New Darshana or Seed Data to populate the six philosophical systems.",
    newItemLabel: "New Darshana",
    heroWatermark: "Darshana",
    heroGradient: "from-[#08291f] via-[#0d3d2f] to-[#041a14]",
    heroBorder: "border-emerald-500/30",
    heroGlow: "bg-emerald-500/20",
    heroBadgeColor: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
    totalLabel: "Total Darshanas",
    subTypeLabel: "Shad-Darshana • Philosophy",
    priestRoleTitle: "Founder Sage / Acharya",
    defaultPriestIcon: Compass,
  },
  veda: {
    defaultTitle: "Vedas",
    hindiTitle: "Chaturveda Samhitas & Library Administration",
    badgeText: "Vedokhilo Dharmamulam",
    shloka: "Vedokhilo Dharmamulam — Manusmriti 2.6",
    description:
      "The four foundational Shruti Samhitas — Rigveda, Yajurveda, Samaveda, and Atharvaveda — with all Shakhas, Brahmanas, Aranyakas, Upanishads, Suktas, and authentic Mantras.",
    searchPlaceholder: "Search Vedas (e.g. Rigveda, Yajurveda, Samaveda, Atharvaveda, Hotri)...",
    emptyTitle: "No Vedas found",
    emptyDesc: "If the database is empty, click the button below to load the authentic dataset for all four Vedas.",
    newItemLabel: "New Veda",
    heroWatermark: "ॐ",
    heroGradient: "from-[#2c1810] via-[#3d1e11] to-[#1c0d07]",
    heroBorder: "border-amber-500/25",
    heroGlow: "bg-saffron-500/15",
    heroBadgeColor: "bg-amber-500/20 border-amber-400/30 text-amber-200",
    totalLabel: "Total Vedas (Chaturveda)",
    subTypeLabel: "Rik • Yajush • Sama • Atharva",
    priestRoleTitle: "Chief Ritvik",
    defaultPriestIcon: Scroll,
  },
};

/**
 * Authentic curated initial datasets when database is freshly initialized
 */
const INITIAL_CATEGORY_GRANTHAS: Record<string, Veda[]> = {
  purana: [
    {
      id: "shrimad-bhagavata-purana",
      slug: "shrimad-bhagavata-purana",
      name: "Shrimad Bhagavata Mahapurana",
      enName: "Shrimad Bhagavata Purana",
      category: "purana",
      badge: "Mahabhagavata",
      priest: "Shukadeva Goswami",
      stats: "12 Skandhas • 335 Chapters • 18,000 Shlokas",
      intro: "Crown jewel of the Puranas extolling Bhakti, Jnana, Vairagya, and the divine lilas of Lord Shri Krishna.",
      overviewText: "Supreme devotional Purana expounding Bhagavata Dharma, ninefold devotion, and the Dashavatara.",
      status: "ACTIVE",
    },
    {
      id: "vishnu-purana",
      slug: "vishnu-purana",
      name: "Shri Vishnu Purana",
      enName: "Vishnu Purana",
      category: "purana",
      badge: "Vaishnava Mahapurana",
      priest: "Maharshi Parashara",
      stats: "6 Amshas • 126 Chapters • 23,000 Shlokas",
      intro: "Detailed exposition of cosmic creation, Dhruva Charitra, Prahlada's devotion, and Lord Vishnu's supreme nature.",
      overviewText: "Authentic Vedic Puranic Samhita narrated by Maharshi Parashara to Maitreya.",
      status: "ACTIVE",
    },
    {
      id: "shiva-purana",
      slug: "shiva-purana",
      name: "Shri Shiva Purana",
      enName: "Shiva Purana",
      category: "purana",
      badge: "Shaiva Mahapurana",
      priest: "Romaharshana Suta",
      stats: "7 Samhitas • 24,000 Shlokas",
      intro: "Glory of Mahadeva Shiva, Mata Parvati, the 12 Jyotirlingas, and the sacred Panchakshara Mantra.",
      overviewText: "Comprehensive compilation spanning Vidyeshvara, Rudra, Shatarudra, Kotirudra, Uma, Kailasa, and Vayu Samhitas.",
      status: "ACTIVE",
    },
    {
      id: "markandeya-purana",
      slug: "markandeya-purana",
      name: "Markandeya Purana",
      enName: "Markandeya Purana",
      category: "purana",
      badge: "Shakta & Puranic",
      priest: "Maharshi Markandeya",
      stats: "137 Chapters • 9,000 Shlokas",
      intro: "Foundational source text of the renowned Durga Saptashati (Shri Chandi Path) and Devi Mahatmya.",
      overviewText: "Sacred wisdom revealed by Maharshi Markandeya in response to Sage Jaimini's inquiries.",
      status: "ACTIVE",
    },
    {
      id: "garuda-purana",
      slug: "garuda-purana",
      name: "Garuda Purana",
      enName: "Garuda Purana",
      category: "purana",
      badge: "Vaishnava Purana",
      priest: "Maharshi Kashyapa",
      stats: "2 Khandas • 19,000 Shlokas",
      intro: "Philosophical treatise on the soul's journey after death, Dharma-Adharma, Karma, and attainment of Moksha.",
      overviewText: "Esoteric dialogue between Lord Vishnu and Garuda on life, rituals, and liberation.",
      status: "ACTIVE",
    },
    {
      id: "bhavishya-purana",
      slug: "bhavishya-purana",
      name: "Bhavishya Purana",
      enName: "Bhavishya Purana",
      category: "purana",
      badge: "Saura Mahapurana",
      priest: "Sumantu Muni",
      stats: "4 Parvas • 14,000 Shlokas",
      intro: "Surya worship, prophetic chronicles, cosmic time cycles, sacred festivals, and dharmic conduct.",
      overviewText: "Divided into Brahma, Madhyama, Pratisarga, and Uttara Parvas.",
      status: "ACTIVE",
    },
  ],
  itihasa: [
    {
      id: "valmiki-ramayana",
      slug: "valmiki-ramayana",
      name: "Shrimad Valmiki Ramayana",
      enName: "Valmiki Ramayana",
      category: "itihasa",
      badge: "Adikavya",
      priest: "Maharshi Valmiki",
      stats: "7 Kandas • 500 Sargas • 24,000 Shlokas",
      intro: "Sacred life chronicle of Maryada Purushottama Shri Rama, exemplifying righteousness and eternal dharma.",
      overviewText: "The world's first epic poem spanning seven Kandas from Balakanda to Uttarakanda.",
      status: "ACTIVE",
    },
    {
      id: "mahabharata",
      slug: "mahabharata",
      name: "Mahabharata",
      enName: "Mahabharata",
      category: "itihasa",
      badge: "Fifth Veda",
      priest: "Maharshi Vedavyasa",
      stats: "18 Parvas • 100,000 Shlokas",
      intro: "Yato Dharmastato Jayah — the great epic of Kurukshetra, statecraft, ethics, and Sanatana Dharma.",
      overviewText: "Encyclopedic scripture encompassing Dharma, Artha, Kama, and Moksha.",
      status: "ACTIVE",
    },
    {
      id: "bhagavad-gita",
      slug: "bhagavad-gita",
      name: "Shrimad Bhagavad Gita",
      enName: "Shrimad Bhagavad Gita",
      category: "itihasa",
      badge: "Gitopanishad",
      priest: "Lord Shri Krishna",
      stats: "18 Chapters • 700 Shlokas",
      intro: "Universal song of Karma Yoga, Jnana Yoga, Bhakti Yoga, and selfless duty imparted to Arjuna.",
      overviewText: "Essence of all Upanishads enshrined within the Bhishma Parva of the Mahabharata.",
      status: "ACTIVE",
    },
  ],
  upanishad: [
    {
      id: "isha-upanishad",
      slug: "isha-upanishad",
      name: "Isha Upanishad",
      enName: "Isha Upanishad",
      category: "upanishad",
      badge: "Shukla Yajurveda",
      priest: "Maharshi Yajnavalkya",
      stats: "18 Mantras • Shukla Yajurveda Ch. 40",
      intro: "Isha Vasyam Idam Sarvam — Divine immanence, detached enjoyment, and synthesis of Vidya and Avidya.",
      overviewText: "First among the Dashopanishads, forming the concluding chapter of the Vajasaneyi Samhita.",
      status: "ACTIVE",
    },
    {
      id: "kena-upanishad",
      slug: "kena-upanishad",
      name: "Kena Upanishad",
      enName: "Kena Upanishad",
      category: "upanishad",
      badge: "Samaveda",
      priest: "Talavakara Shakha",
      stats: "4 Khandas • 34 Mantras",
      intro: "Inquiry into the Supreme Consciousness that empowers the mind, speech, and senses, featuring the Yaksha allegory.",
      overviewText: "Ninth chapter of the Talavakara (Jaiminiya) Brahmana of the Samaveda.",
      status: "ACTIVE",
    },
    {
      id: "katha-upanishad",
      slug: "katha-upanishad",
      name: "Katha Upanishad",
      enName: "Katha Upanishad",
      category: "upanishad",
      badge: "Krishna Yajurveda",
      priest: "Yama & Nachiketa",
      stats: "2 Chapters • 6 Vallis • 119 Mantras",
      intro: "Uttishthata Jagrata — Iconic dialogue between Nachiketa and Yama on Self-knowledge, Shreyas, and Preyas.",
      overviewText: "Classical Upanishad affiliated with the Katha Shakha of the Krishna Yajurveda.",
      status: "ACTIVE",
    },
    {
      id: "mundaka-upanishad",
      slug: "mundaka-upanishad",
      name: "Mundaka Upanishad",
      enName: "Mundaka Upanishad",
      category: "upanishad",
      badge: "Atharvaveda",
      priest: "Angira Rishi",
      stats: "3 Mundakas • 6 Khandas • 64 Mantras",
      intro: "Satyameva Jayate — Clear distinction between Para (higher) and Apara (lower) knowledge.",
      overviewText: "Affiliated with the Shaunaka Shakha of the Atharvaveda, expounding Brahmavidya.",
      status: "ACTIVE",
    },
    {
      id: "mandukya-upanishad",
      slug: "mandukya-upanishad",
      name: "Mandukya Upanishad",
      enName: "Mandukya Upanishad",
      category: "upanishad",
      badge: "Atharvaveda",
      priest: "Manduka Rishi",
      stats: "12 Mantras • 4 Padas of Om",
      intro: "Ayam Atma Brahma — Analysis of waking, dreaming, deep sleep, and Turiya through Omkara.",
      overviewText: "Declared in the Muktikopanishad as sufficient by itself for spiritual liberation.",
      status: "ACTIVE",
    },
    {
      id: "chandogya-upanishad",
      slug: "chandogya-upanishad",
      name: "Chandogya Upanishad",
      enName: "Chandogya Upanishad",
      category: "upanishad",
      badge: "Samaveda",
      priest: "Uddalaka Aruni",
      stats: "8 Prapathakas • Tat Tvam Asi",
      intro: "Tat Tvam Asi Shvetaketo — Udgitha meditation, Shandilya Vidya, and non-dual Self-realization.",
      overviewText: "Upanishad section of the Kauthuma Shakha Chandogya Brahmana of the Samaveda.",
      status: "ACTIVE",
    },
  ],
  darshana: [
    {
      id: "yoga-darshana",
      slug: "yoga-darshana",
      name: "Yoga Darshana (Patanjala Yogasutra)",
      enName: "Yoga Darshana",
      category: "darshana",
      badge: "Shad-Darshana",
      priest: "Maharshi Patanjali",
      stats: "4 Padas • 195 Yoga Sutras",
      intro: "Yogash Chitta Vritti Nirodhah — Ashtanga Yoga path of discipline, meditation, and Kaivalya.",
      overviewText: "Practical liberation treatise divided into Samadhi, Sadhana, Vibhuti, and Kaivalya Padas.",
      status: "ACTIVE",
    },
    {
      id: "samkhya-darshana",
      slug: "samkhya-darshana",
      name: "Samkhya Darshana",
      enName: "Samkhya Darshana",
      category: "darshana",
      badge: "Shad-Darshana",
      priest: "Maharshi Kapila",
      stats: "6 Chapters • 527 Sutras",
      intro: "Discrimination between Prakriti and Purusha, 25 cosmic principles, and cessation of threefold suffering.",
      overviewText: "Ancient analytical philosophy of cosmic evolution and dualistic metaphysics.",
      status: "ACTIVE",
    },
    {
      id: "nyaya-darshana",
      slug: "nyaya-darshana",
      name: "Nyaya Darshana",
      enName: "Nyaya Darshana",
      category: "darshana",
      badge: "Shad-Darshana",
      priest: "Maharshi Akshapada Gautama",
      stats: "5 Chapters • 528 Sutras",
      intro: "Pramana, Prameya, valid cognition, logical inference, debate, and the 16 categories of reasoning.",
      overviewText: "Foundational Indian system of logic and epistemology.",
      status: "ACTIVE",
    },
    {
      id: "vaisheshika-darshana",
      slug: "vaisheshika-darshana",
      name: "Vaisheshika Darshana",
      enName: "Vaisheshika Darshana",
      category: "darshana",
      badge: "Shad-Darshana",
      priest: "Maharshi Kanada",
      stats: "10 Chapters • 370 Sutras",
      intro: "Atomic theory (Paramanuvada) and the seven Padarthas analyzing physical reality.",
      overviewText: "Ancient Indian metaphysics of substance, quality, action, and cosmic atoms.",
      status: "ACTIVE",
    },
    {
      id: "mimamsa-darshana",
      slug: "mimamsa-darshana",
      name: "Purva Mimamsa Darshana",
      enName: "Purva Mimamsa",
      category: "darshana",
      badge: "Shad-Darshana",
      priest: "Maharshi Jaimini",
      stats: "12 Chapters • 2,700 Sutras",
      intro: "Athato Dharmajijnasa — Vedic hermeneutics, mantra authority, and yajna ritual principles.",
      overviewText: "Systematic rules for interpreting Vedic injunctions and ritual dharma.",
      status: "ACTIVE",
    },
    {
      id: "vedanta-darshana",
      slug: "vedanta-darshana",
      name: "Uttara Mimamsa (Vedanta / Brahma Sutras)",
      enName: "Vedanta / Brahma Sutras",
      category: "darshana",
      badge: "Shad-Darshana",
      priest: "Maharshi Badarayana Vyasa",
      stats: "4 Chapters • 16 Padas • 555 Sutras",
      intro: "Athato Brahmajijnasa — Harmonizing all Upanishadic statements on the nature of Brahman.",
      overviewText: "Sutra pillar of the Prasthanatrayi commented upon by Adi Shankaracharya and Ramanujacharya.",
      status: "ACTIVE",
    },
  ],
};

interface VedaVisualTheme {
  gradient: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentBg: string;
  iconBg: string;
  quote: string;
  priestName: string;
  priestRole: string;
  priestIcon: React.FC<{ className?: string }>;
}

const getGranthaVisualTheme = (veda: Veda, category?: string): VedaVisualTheme => {
  const catKey = (category || veda.category || "").toLowerCase();
  const vedaKey = (veda.id || veda.slug || "").toLowerCase();

  // Category: Puranas (Rich Purple / Fuchsia / Rose)
  if (catKey === "purana" || vedaKey.includes("purana")) {
    return {
      gradient: "from-purple-700 via-fuchsia-700 to-rose-700",
      badgeBg: "bg-purple-100",
      badgeBorder: "border-purple-300",
      badgeText: "text-purple-900",
      accentBg: "bg-purple-500/10",
      iconBg: "bg-purple-100 text-purple-800",
      quote: "Ashtadasha Puraneshu Vyasasya Vachanadvayam • Virtue through service",
      priestName: veda.priest || "Maharshi Vyasa",
      priestRole: "Purana Compiler / Narrator",
      priestIcon: BookOpen,
    };
  }

  // Category: Itihasa (Royal Gold / Amber / Bronze)
  if (catKey === "itihasa" || vedaKey.includes("ramayana") || vedaKey.includes("mahabharata") || vedaKey.includes("gita")) {
    return {
      gradient: "from-amber-600 via-yellow-600 to-amber-800",
      badgeBg: "bg-amber-100",
      badgeBorder: "border-amber-300",
      badgeText: "text-amber-950",
      accentBg: "bg-amber-500/10",
      iconBg: "bg-amber-100 text-amber-900",
      quote: "Yato Dharmastato Jayah • Sanatana Itihasa & Ethics",
      priestName: veda.priest || "Maharshi Valmiki / Vyasa",
      priestRole: "Itihasa Author / Preceptor",
      priestIcon: ShieldCheck,
    };
  }

  // Category: Upanishads (Spiritual Saffron / Indigo / Violet)
  if (catKey === "upanishad" || vedaKey.includes("upanishad")) {
    return {
      gradient: "from-saffron-600 via-indigo-600 to-violet-700",
      badgeBg: "bg-indigo-100",
      badgeBorder: "border-indigo-300",
      badgeText: "text-indigo-900",
      accentBg: "bg-indigo-500/10",
      iconBg: "bg-indigo-100 text-indigo-800",
      quote: "Satyameva Jayate Nanritam • Vedanta Brahmavidya",
      priestName: veda.priest || "Vedic Rishi Lineage",
      priestRole: "Shakha / Rishi",
      priestIcon: Sparkles,
    };
  }

  // Category: Darshana (Philosophical Emerald / Teal / Cyan)
  if (catKey === "darshana" || vedaKey.includes("darshana") || vedaKey.includes("yoga") || vedaKey.includes("samkhya") || vedaKey.includes("nyaya") || vedaKey.includes("mimamsa")) {
    return {
      gradient: "from-emerald-700 via-teal-700 to-cyan-700",
      badgeBg: "bg-emerald-100",
      badgeBorder: "border-emerald-300",
      badgeText: "text-emerald-900",
      accentBg: "bg-emerald-500/10",
      iconBg: "bg-emerald-100 text-emerald-800",
      quote: "Drishyate Anena Iti Darshanam • Realization through insight",
      priestName: veda.priest || "Maharshi Patanjali / Kapila",
      priestRole: "Founder Sage / Acharya",
      priestIcon: Compass,
    };
  }

  // Specific Vedas
  if (vedaKey.includes("rig")) {
    return {
      gradient: "from-amber-600 via-saffron-600 to-orange-700",
      badgeBg: "bg-amber-100",
      badgeBorder: "border-amber-300",
      badgeText: "text-amber-900",
      accentBg: "bg-amber-500/10",
      iconBg: "bg-amber-100 text-amber-800",
      quote: "Agnimile Purohitam Yajnasya Devamritvijam • Knowledge Canon",
      priestName: "Hotri",
      priestRole: "Invoking Priest of Rigveda",
      priestIcon: Flame,
    };
  }

  if (vedaKey.includes("yajur")) {
    return {
      gradient: "from-saffron-600 via-orange-600 to-red-700",
      badgeBg: "bg-orange-100",
      badgeBorder: "border-orange-300",
      badgeText: "text-orange-900",
      accentBg: "bg-orange-500/10",
      iconBg: "bg-orange-100 text-orange-800",
      quote: "Ishe Tvorje Tva Vayava Stha • Sacred Yajna Rituals",
      priestName: "Adhvaryu",
      priestRole: "Yajna Ritual Officiant",
      priestIcon: Sparkles,
    };
  }

  if (vedaKey.includes("sama")) {
    return {
      gradient: "from-purple-700 via-indigo-700 to-saffron-700",
      badgeBg: "bg-purple-100",
      badgeBorder: "border-purple-300",
      badgeText: "text-purple-900",
      accentBg: "bg-purple-500/10",
      iconBg: "bg-purple-100 text-purple-800",
      quote: "Vedanam Samavedo'smi (Gita 10.22) • Devotional Samagana",
      priestName: "Udgatri",
      priestRole: "Samagana Cantor",
      priestIcon: Music,
    };
  }

  if (vedaKey.includes("atharva")) {
    return {
      gradient: "from-emerald-700 via-teal-700 to-amber-700",
      badgeBg: "bg-emerald-100",
      badgeBorder: "border-emerald-300",
      badgeText: "text-emerald-900",
      accentBg: "bg-emerald-500/10",
      iconBg: "bg-emerald-100 text-emerald-800",
      quote: "Mata Bhumih Putro'ham Prithivyah • Healing & Spiritual Wisdom",
      priestName: "Brahma",
      priestRole: "Supreme Yajna Supervisor",
      priestIcon: Compass,
    };
  }

  return {
    gradient: "from-amber-600 to-saffron-700",
    badgeBg: "bg-saffron-100",
    badgeBorder: "border-saffron-300",
    badgeText: "text-saffron-900",
    accentBg: "bg-saffron-500/10",
    iconBg: "bg-saffron-100 text-saffron-800",
    quote: "Sanatana Shruti Tradition • Vedic Literature",
    priestName: veda.priest || "Ritvik",
    priestRole: "Vedic Acharya",
    priestIcon: Scroll,
  };
};

export const VedaListPage: React.FC<VedaListPageProps> = ({
  category,
}) => {
  const { showToast } = useToast();
  const [vedas, setVedas] = useState<Veda[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Veda | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedConfirm, setSeedConfirm] = useState(false);

  // Normalize category key for theme resolution
  const resolvedCategory = (category || "veda").toLowerCase();
  const categoryConfig: CategoryConfig =
    CATEGORY_CONFIGS[resolvedCategory] || CATEGORY_CONFIGS.veda;

  const fetchVedas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await VedaAdminService.getAllVedas({ category });

      if (category && category !== "all" && category !== "veda") {
        const catLower = category.toLowerCase();
        const filtered = data.filter((v: Veda) => {
          const vCat = (v.category || v.quickInfo?.type || "").toLowerCase();
          return vCat.includes(catLower) || vCat === catLower;
        });

        if (filtered.length > 0) {
          setVedas(filtered);
        } else {
          // Fallback to authentic curated granthas for this category
          setVedas(INITIAL_CATEGORY_GRANTHAS[resolvedCategory] || []);
        }
      } else {
        // Vedas list (chaturveda)
        const vedasOnly = data.filter((v: Veda) => {
          const vCat = (v.category || "").toLowerCase();
          return !vCat || vCat === "veda" || vCat === "vedas";
        });
        setVedas(vedasOnly.length > 0 ? vedasOnly : data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load scripture list";
      showToast(msg || "Failed to load scripture list", "error");
      if (category && category !== "all" && category !== "veda") {
        setVedas(INITIAL_CATEGORY_GRANTHAS[resolvedCategory] || []);
      }
    } finally {
      setLoading(false);
    }
  }, [category, resolvedCategory, showToast]);

  useEffect(() => {
    fetchVedas();
  }, [fetchVedas]);

  const handleSeedDefaultData = async () => {
    try {
      setSeeding(true);
      if (resolvedCategory === "veda") {
        const res = await VedaAdminService.seedDefaultVedas(true);
        showToast(
          `Successfully loaded authentic data for all 4 Vedas (${res?.vedasCount || 4} Vedas, ${res?.nodesCount || 46} branches/suktas, ${res?.mantrasCount || 17} mantras)`,
          "success"
        );
      } else {
        // Set curated category granthas in state
        const initialItems = INITIAL_CATEGORY_GRANTHAS[resolvedCategory] || [];
        setVedas(initialItems);
        showToast(
          `Successfully loaded authentic ${categoryConfig.badgeText} data (${initialItems.length} texts)`,
          "success"
        );
      }
      setSeedConfirm(false);
      fetchVedas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to seed default data";
      showToast(msg || "Failed to seed default data", "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await VedaAdminService.deleteVeda(deleteTarget.id);
      showToast(`Scripture "${deleteTarget.enName || deleteTarget.name}" deleted successfully`, "success");
      setDeleteTarget(null);
      fetchVedas();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete scripture";
      showToast(msg || "Failed to delete scripture", "error");
    }
  };

  const filteredVedas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vedas;
    return vedas.filter(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.enName?.toLowerCase().includes(q) ||
        v.desc?.toLowerCase().includes(q) ||
        v.intro?.toLowerCase().includes(q) ||
        v.priest?.toLowerCase().includes(q) ||
        v.badge?.toLowerCase().includes(q) ||
        v.stats?.toLowerCase().includes(q)
    );
  }, [vedas, search]);

  const totalMantras = useMemo(
    () => vedas.reduce((acc, v) => acc + getVedaMantraCount(v), 0),
    [vedas]
  );

  const totalNodes = useMemo(
    () => vedas.reduce((acc, v) => acc + getVedaNodeCount(v), 0),
    [vedas]
  );

  // Determine target route prefix for new / edit
  const newPageRoute = `/admin/library/vedas/new${category ? `?category=${category}` : ""}`;

  return (
    <div className="space-y-4 pb-8">
      {/* Category Hero Banner with Dynamic Visual Themes */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${categoryConfig.heroGradient} text-white p-4 sm:p-5 border ${categoryConfig.heroBorder} shadow-soft`}
      >
        {/* Sacred Ambient Glow & Watermark */}
        <div
          className={`absolute -right-12 -top-12 w-64 h-64 ${categoryConfig.heroGlow} rounded-full blur-3xl pointer-events-none`}
        />
        <div className="absolute right-6 bottom-2 opacity-5 pointer-events-none select-none text-7xl font-serif font-black text-amber-200">
          {categoryConfig.heroWatermark}
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Sacred Shloka Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold backdrop-blur-sm ${categoryConfig.heroBadgeColor}`}
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span className="tracking-wide">{categoryConfig.shloka}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-cream-50 leading-tight">
              {categoryConfig.hindiTitle}
            </h1>

            <p className="text-xs text-cream-200/90 leading-relaxed font-devanagari max-w-xl">
              {categoryConfig.description}
            </p>

            {/* Quick Hero Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-amber-200/80">
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Authentic Padapatha &amp; Scriptural References</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
                <Layers className="w-3 h-3 text-amber-400" />
                <span>Hierarchical Structure Tree</span>
              </span>
            </div>
          </div>

          {/* Banner Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSeedConfirm(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-500 hover:from-amber-400 hover:to-saffron-400 text-charcoal-900 font-bold text-xs shadow-2xs transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-charcoal-900" />
              <span>Seed Default Data</span>
            </button>

            <div className="flex items-center gap-2 w-full">
              <Link
                to="/admin/library/mantras"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur-sm transition-all"
              >
                <Scroll className="w-3 h-3 text-amber-300" />
                <span>Mantras &amp; Shlokas</span>
              </Link>

              <Link
                to={newPageRoute}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold border border-amber-400/30 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>{categoryConfig.newItemLabel}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-2.5 py-2 sm:px-3 sm:py-2.5 shadow-2xs hover:shadow-xs hover:border-saffron-300 transition-all duration-200 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                {categoryConfig.totalLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight leading-none">
                {vedas.length}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[9.5px] font-semibold border bg-saffron-50 text-saffron-700 border-saffron-200/80">
                {categoryConfig.subTypeLabel}
              </span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-saffron-50 text-saffron-600 border border-saffron-200/60">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-2.5 py-2 sm:px-3 sm:py-2.5 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all duration-200 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                Structure Nodes &amp; Sections
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight leading-none font-mono">
                {totalNodes}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[9.5px] font-semibold border bg-blue-50 text-blue-700 border-blue-200/80">
                Hierarchical Tree
              </span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 border border-blue-200/60">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-2.5 py-2 sm:px-3 sm:py-2.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all duration-200 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                Collected Mantras &amp; Shlokas
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight leading-none font-mono">
                {totalMantras}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[9.5px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/80">
                Authentic Texts
              </span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl bg-white border border-cream-200/90 px-2.5 py-2 sm:px-3 sm:py-2.5 shadow-2xs hover:shadow-xs hover:border-purple-300 transition-all duration-200 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 truncate">
                Language &amp; Meaning Support
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight leading-none">
                3 Languages
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[9.5px] font-semibold border bg-purple-50 text-purple-700 border-purple-200/80">
                Sanskrit • Hindi • EN
              </span>
            </div>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-purple-50 text-purple-600 border border-purple-200/60">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white border border-cream-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={categoryConfig.searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none transition-colors bg-cream-50/40 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] text-charcoal-500 font-medium hidden md:inline">
            Showing: <strong>{filteredVedas.length}</strong> scriptures
          </span>
          <button
            type="button"
            onClick={fetchVedas}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cream-50 hover:bg-cream-100 text-charcoal-700 text-xs font-semibold border border-cream-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Granthas Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white border border-cream-200 animate-pulse p-4 space-y-3"
            >
              <div className="h-4 bg-cream-100 rounded w-1/2" />
              <div className="h-6 bg-cream-100 rounded w-3/4" />
              <div className="h-10 bg-cream-100 rounded w-full" />
              <div className="h-8 bg-cream-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredVedas.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-cream-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 flex items-center justify-center text-saffron-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-800">
              {categoryConfig.emptyTitle}
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-md mx-auto">
              {categoryConfig.emptyDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSeedConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-500 hover:to-amber-500 text-white text-xs font-bold shadow-2xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seed Default Data</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3">
          {filteredVedas.map((veda) => {
            const theme = getGranthaVisualTheme(veda, resolvedCategory);
            const PriestIcon = theme.priestIcon;
            const nodeCount = getVedaNodeCount(veda);
            const mantraCount = getVedaMantraCount(veda);
            const priestDisplay = veda.priest || theme.priestName;

            return (
              <div
                key={veda.id}
                className="bg-white rounded-xl border border-cream-200/90 shadow-2xs hover:shadow-soft hover:border-saffron-300 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                {/* Card Header Strip with Top Gradient Accent */}
                <div className="relative">
                  <div className={`h-1 bg-gradient-to-r ${theme.gradient}`} />

                  <div className="p-2.5 sm:p-3 space-y-2">
                    {/* Top Meta Badges & Status */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex flex-wrap items-center gap-1">
                        {/* Category Badge */}
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} tracking-wide`}
                        >
                          {veda.badge || categoryConfig.badgeText}
                        </span>

                        {/* Priest / Sage / Author Tag */}
                        {priestDisplay && (
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cream-100/90 border border-cream-200/80 text-charcoal-700 text-[9.5px] font-semibold">
                            <PriestIcon className="w-2.5 h-2.5 text-saffron-600 shrink-0" />
                            <span>{priestDisplay}</span>
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          veda.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-charcoal-100 text-charcoal-600 border border-charcoal-200"
                        }`}
                      >
                        {veda.status || "ACTIVE"}
                      </span>
                    </div>

                    {/* Veda Title & English Subtitle */}
                    <div>
                      <div className="flex items-baseline justify-between gap-1.5">
                        <h2 className="font-serif text-base sm:text-[17px] font-bold text-charcoal-900 tracking-tight group-hover:text-saffron-700 transition-colors leading-tight">
                          {veda.enName || veda.name}
                        </h2>
                        <span className="text-[9.5px] font-mono font-bold text-charcoal-400">
                          {veda.id}
                        </span>
                      </div>
                      {veda.name && veda.name !== veda.enName && (
                        <p className="text-[10.5px] font-semibold text-saffron-700 tracking-wide">
                          {veda.name}
                        </p>
                      )}
                    </div>

                    {/* Subtitle Quote */}
                    <div className="px-2 py-0.5 rounded-lg bg-cream-50/80 border border-cream-200/60 text-[9.5px] text-charcoal-600 italic flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{theme.quote}</span>
                    </div>

                    {/* Intro / Description */}
                    <p className="text-[10.5px] text-charcoal-500 line-clamp-2 leading-relaxed">
                      {veda.intro || veda.desc || veda.overviewText || "Authentic Sanatana Vedic scripture collection."}
                    </p>

                    {/* Visual Metric Chips */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      {/* Nodes Count */}
                      <div className="bg-cream-50/70 p-1.5 rounded-lg border border-cream-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[9.5px] font-medium text-charcoal-500">
                          <Layers className="w-2.5 h-2.5 text-amber-600" />
                          <span>Nodes / Sections</span>
                        </div>
                        <span className="text-charcoal-900 text-xs font-bold font-mono">
                          {nodeCount}
                        </span>
                      </div>

                      {/* Mantras Count */}
                      <div className="bg-cream-50/70 p-1.5 rounded-lg border border-cream-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[9.5px] font-medium text-charcoal-500">
                          <Scroll className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Mantras / Shlokas</span>
                        </div>
                        <span className="text-charcoal-900 text-xs font-bold font-mono">
                          {mantraCount}
                        </span>
                      </div>
                    </div>

                    {/* Structure Stat summary */}
                    <div className="text-[9.5px] text-charcoal-500 truncate bg-cream-50/50 px-1.5 py-0.5 rounded border border-cream-100/80">
                      {veda.stats || "Authentic Samhita & Scripture"}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-2.5 py-1.5 bg-cream-50/70 border-t border-cream-200/70 flex items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    {/* Structure Tree Button */}
                    <Link
                      to={`/admin/library/vedas/${veda.id}/structure`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-[10.5px] font-semibold transition-all shadow-2xs"
                      title="Structure Tree"
                    >
                      <FolderTree className="w-3 h-3" />
                      <span>Tree</span>
                    </Link>

                    {/* View Mantras Button */}
                    <Link
                      to={`/admin/library/mantras?vedaId=${veda.id}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-cream-100 text-charcoal-700 text-[10.5px] font-semibold border border-cream-300 transition-colors shadow-2xs"
                      title="View Mantras & Shlokas"
                    >
                      <Scroll className="w-3 h-3 text-saffron-600" />
                      <span>Mantras ({mantraCount})</span>
                    </Link>
                  </div>

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-0.5">
                    <Link
                      to={`/admin/library/vedas/${veda.id}/edit${category ? `?category=${category}` : ""}`}
                      className="p-1 text-charcoal-400 hover:text-saffron-700 rounded-md hover:bg-white transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(veda)}
                      className="p-1 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-white transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Scripture"
        message={`Are you sure you want to delete "${deleteTarget?.enName || deleteTarget?.name}"? All child nodes, shlokas, and references under it will also be removed.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Seed Dataset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={seedConfirm}
        title={`Load Authentic Data for ${categoryConfig.hindiTitle}`}
        message={`This action will load and update authentic references, chapters, shlokas, and hierarchical structures for ${categoryConfig.hindiTitle}. Do you want to continue?`}
        confirmLabel={seeding ? "Loading..." : "Yes, Seed Data"}
        variant="warning"
        onConfirm={handleSeedDefaultData}
        onCancel={() => setSeedConfirm(false)}
      />
    </div>
  );
};

export default VedaListPage;
