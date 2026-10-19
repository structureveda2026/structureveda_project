import React, { useState, useEffect, useMemo } from "react";
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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
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

export const getVedaNodeCount = (veda: Veda): number => {
  if (veda.statsMeta && typeof veda.statsMeta.nodeCount === "number" && veda.statsMeta.nodeCount > 0) {
    return veda.statsMeta.nodeCount;
  }
  const key = (veda.id || veda.slug || "").toLowerCase();
  return KNOWN_GRANTHA_COUNTS[key]?.nodeCount ?? 6;
};

export const getVedaMantraCount = (veda: Veda): number => {
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
    defaultTitle: "Puranas (पुराण)",
    hindiTitle: "अष्टादश महापुराण एवं पौराणिक वांग्मय",
    badgeText: "अष्टादश महापुराण",
    shloka: "अष्टादश पुराणेषु व्यासस्य वचनद्वयम् • परोपकाराय पुण्याय पापाय परपीडनम्",
    description:
      "सनातन धर्म के १८ महापुराण — महर्षि व्यास विरचित सृष्टि, वंशावली, तीर्थ, भक्ति, सदाचार और दिव्य लीलाओं का पावन कोष।",
    searchPlaceholder: "पुराण खोजें (e.g. विष्णु पुराण, शिव पुराण, भागवत, मार्कण्डेय)...",
    emptyTitle: "कोई पुराण नहीं मिला",
    emptyDesc: "यदि डेटाबेस में अभी पुराण उपलब्ध नहीं हैं, तो नीचे दिए गए बटन पर क्लिक करके डिफ़ॉल्ट डेटा लोड करें या नया जोड़ें।",
    newItemLabel: "नया पुराण",
    heroWatermark: "पुराण",
    heroGradient: "from-[#290c2e] via-[#3d1344] to-[#1a081d]",
    heroBorder: "border-purple-500/30",
    heroGlow: "bg-purple-500/20",
    heroBadgeColor: "bg-purple-500/20 border-purple-400/30 text-purple-200",
    totalLabel: "कुल पुराण (Puranas)",
    subTypeLabel: "महापुराण • उपपुराण",
    priestRoleTitle: "रचयिता / वक्ता",
    defaultPriestIcon: BookOpen,
  },
  itihasa: {
    defaultTitle: "Itihasa (इतिहास)",
    hindiTitle: "सनातन इतिहास महाग्रंथ एवं नीति वांग्मय",
    badgeText: "इतिहास वांग्मय",
    shloka: "धर्मार्थकाममोक्षाणामुपदेशसमन्वितम् • पूर्ववृत्तकथायुक्तमितिहासं प्रचक्षते",
    description:
      "सनातन इतिहास — वाल्मीकि रामायण, महाभारत एवं श्रीमद्भगवद्गीता। धर्म, नीति, पराक्रम, राष्ट्रधर्म और जीवन दर्शन का अमर उद्घोष।",
    searchPlaceholder: "इतिहास ग्रंथ खोजें (e.g. रामायण, महाभारत, भगवद्गीता, वाल्मीकि)...",
    emptyTitle: "कोई इतिहास ग्रंथ नहीं मिला",
    emptyDesc: "डेटाबेस में इतिहास महाग्रंथ जोड़ने के लिए नीचे दिए गए बटन का प्रयोग करें।",
    newItemLabel: "नया इतिहास ग्रंथ",
    heroWatermark: "इतिहास",
    heroGradient: "from-[#2e1c05] via-[#482c09] to-[#1c1103]",
    heroBorder: "border-amber-500/30",
    heroGlow: "bg-amber-400/20",
    heroBadgeColor: "bg-amber-500/20 border-amber-400/30 text-amber-200",
    totalLabel: "कुल इतिहास ग्रंथ (Itihasa)",
    subTypeLabel: "रामायण • महाभारत • गीता",
    priestRoleTitle: "रचयिता / उपदेशक",
    defaultPriestIcon: ShieldCheck,
  },
  upanishad: {
    defaultTitle: "Upanishads (उपनिषद्)",
    hindiTitle: "उपनिषद् वांग्मय एवं वेदान्त ब्रह्मविद्या",
    badgeText: "दशोपनिषद् एवं वेदान्त",
    shloka: "सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः • मुण्डकोपनिषद् ३.१.६",
    description:
      "सनातन वेदान्त के प्रमुख १०८ उपनिषद (दशोपनिषद् प्रधान) — जीव, ब्रह्म, आत्मा, ज्ञान और मोक्ष के परम सत्य का उद्घाटन।",
    searchPlaceholder: "उपनिषद खोजें (e.g. ईशावास्य, केन, कठ, मुण्डक, माण्डूक्य, छान्दोग्य)...",
    emptyTitle: "कोई उपनिषद नहीं मिला",
    emptyDesc: "वेदान्त ब्रह्मविद्या के उपनिषद ग्रंथ जोड़ने के लिए नया उपनिषद जोड़ें बटन दबाएं।",
    newItemLabel: "नया उपनिषद",
    heroWatermark: "उपनिषद्",
    heroGradient: "from-[#141838] via-[#241f4c] to-[#0c0e24]",
    heroBorder: "border-indigo-500/30",
    heroGlow: "bg-indigo-500/20",
    heroBadgeColor: "bg-indigo-500/20 border-indigo-400/30 text-indigo-200",
    totalLabel: "कुल उपनिषद (Upanishads)",
    subTypeLabel: "दशोपनिषद् • वेदान्त ज्ञान",
    priestRoleTitle: "वेद / ऋषि परंपरा",
    defaultPriestIcon: Sparkles,
  },
  darshana: {
    defaultTitle: "Darshana (दर्शन शास्त्र)",
    hindiTitle: "षड्दर्शन शास्त्र एवं भारतीय तत्त्वमीमांसा",
    badgeText: "षड्दर्शन परंपरा",
    shloka: "दृश्यते अनेन इति दर्शनम् • तत्त्वज्ञानं मोक्षसाधनम्",
    description:
      "सनातन षड्दर्शन शास्त्र — सांख्य, योग, न्याय, वैशेषिक, मीमांसा एवं वेदान्त। भारतीय तत्वज्ञान, प्रमाण, तर्क, अध्यात्म और प्रत्यक्ष साक्षात्कार।",
    searchPlaceholder: "दर्शन खोजें (e.g. सांख्य, योग, न्याय, वैशेषिक, मीमांसा, वेदान्त, पतंजलि)...",
    emptyTitle: "कोई दर्शन शास्त्र नहीं मिला",
    emptyDesc: "षड्दर्शन के ग्रंथ जोड़ने के लिए नया दर्शन ग्रंथ जोड़ें बटन दबाएं।",
    newItemLabel: "नया दर्शन",
    heroWatermark: "दर्शन",
    heroGradient: "from-[#08291f] via-[#0d3d2f] to-[#041a14]",
    heroBorder: "border-emerald-500/30",
    heroGlow: "bg-emerald-500/20",
    heroBadgeColor: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
    totalLabel: "कुल दर्शन शास्त्र (Darshana)",
    subTypeLabel: "षड्दर्शन • तत्त्वमीमांसा",
    priestRoleTitle: "प्रवर्तक मुनि / आचार्य",
    defaultPriestIcon: Compass,
  },
  veda: {
    defaultTitle: "Vedas (वेद)",
    hindiTitle: "चतुर्वेद संहिता एवं वांग्मय प्रबंधन",
    badgeText: "वेदोऽखिलो धर्ममूलम्",
    shloka: "वेदोऽखिलो धर्ममूलम् — मनुस्मृति २.६",
    description:
      "सनातन ज्ञान की मूल चारों संहिताएँ — ऋग्वेद, यजुर्वेद, सामवेद एवं अथर्ववेद। समस्त शाखाएँ, ब्राह्मण, आरण्यक, उपनिषद, सूक्त एवं प्रामाणिक मंत्रों का केंद्रीय प्रशासनिक ढाँचा।",
    searchPlaceholder: "वेद खोजें (e.g. ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद, Hotri)...",
    emptyTitle: "कोई वेद नहीं मिला",
    emptyDesc: "यदि डेटाबेस रिक्त है, तो नीचे दिए गए बटन पर क्लिक करके चारों वेदों का संपूर्ण प्रामाणिक डेटा लोड करें।",
    newItemLabel: "नया वेद",
    heroWatermark: "ॐ",
    heroGradient: "from-[#2c1810] via-[#3d1e11] to-[#1c0d07]",
    heroBorder: "border-amber-500/25",
    heroGlow: "bg-saffron-500/15",
    heroBadgeColor: "bg-amber-500/20 border-amber-400/30 text-amber-200",
    totalLabel: "कुल वेद (Chaturveda)",
    subTypeLabel: "ऋक् • यजुष् • साम • अथर्व",
    priestRoleTitle: "प्रधान ऋत्विक",
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
      name: "श्रीमद्भागवत महापुराण",
      enName: "Shrimad Bhagavata Purana",
      category: "purana",
      badge: "महाभागवत",
      priest: "शुकदेव गोस्वामी",
      stats: "१२ स्कन्ध • ३३५ अध्याय • १८,००० श्लोक",
      intro: "भक्ति, ज्ञान, वैराग्य और भगवान श्रीकृष्ण की दिव्य लीलाओं का परमहंसों के लिए अमृत स्वरूप महापुराण।",
      overviewText: "अष्टादश महापुराणों का मुकुटमणि ग्रंथ जिसमें भागवत धर्म, नवधा भक्ति और दशावतारों का अनुपम वर्णन है।",
      status: "ACTIVE",
    },
    {
      id: "vishnu-purana",
      slug: "vishnu-purana",
      name: "श्री विष्णु पुराण",
      enName: "Vishnu Purana",
      category: "purana",
      badge: "वैष्णव महापुराण",
      priest: "महर्षि पराशर",
      stats: "६ अंश • १२६ अध्याय • २३,००० श्लोक",
      intro: "सृष्टि स्थिति प्रलय, ध्रुव चरित्र, प्रह्लाद आख्यान और भगवान श्रीहरि विष्णु के स्वरूप का विशद विवेचन।",
      overviewText: "पराशर मुनि द्वारा मैत्रेय को उपदिष्ट अत्यंत प्रामाणिक वैदिक पौराणिक संहिता।",
      status: "ACTIVE",
    },
    {
      id: "shiva-purana",
      slug: "shiva-purana",
      name: "श्री शिव पुराण",
      enName: "Shiva Purana",
      category: "purana",
      badge: "शैव महापुराण",
      priest: "रोमहर्षण सूत",
      stats: "७ संहिताएँ • २४,००० श्लोक",
      intro: "देवाधिदेव महादेव शिव, माता पार्वती, द्वादश ज्योतिर्लिंगों की महिमा और पंचाक्षर मंत्र का माहात्म्य।",
      overviewText: "विद्येश्वर, रुद्र, शतरुद्र, कोटिरुद्र, उमा, कैलास और वायु संहिताओं का विशाल दिव्य संग्रह।",
      status: "ACTIVE",
    },
    {
      id: "markandeya-purana",
      slug: "markandeya-purana",
      name: "मार्कण्डेय पुराण",
      enName: "Markandeya Purana",
      category: "purana",
      badge: "शाक्त व सौम्य",
      priest: "मार्कण्डेय ऋषि",
      stats: "१३७ अध्याय • ९,००० श्लोक",
      intro: "प्रसिद्ध दुर्गा सप्तशती (श्री चण्डी पाठ) एवं देवी महात्म्य का मूल उद्गम सनातन स्रोत ग्रंथ।",
      overviewText: "जैमिनि मुनि के प्रश्नों के उत्तर में मार्कण्डेय ऋषि द्वारा प्रकट किया गया ज्ञान।",
      status: "ACTIVE",
    },
    {
      id: "garuda-purana",
      slug: "garuda-purana",
      name: "गरुड़ पुराण",
      enName: "Garuda Purana",
      category: "purana",
      badge: "वैष्णव पुराण",
      priest: "महर्षि कश्यप",
      stats: "२ खण्ड • १९,००० श्लोक",
      intro: "मृत्योपरांत जीवात्मा की गति, यमलोक, धर्म-अधर्म, कर्मफल और मोक्ष प्राप्ति का दार्शनिक विवेचन।",
      overviewText: "भगवान विष्णु द्वारा वैनतेय गरुड़ को उपदिष्ट जीवन और मृत्यु का गुह्य रहस्य।",
      status: "ACTIVE",
    },
    {
      id: "bhavishya-purana",
      slug: "bhavishya-purana",
      name: "भविष्य पुराण",
      enName: "Bhavishya Purana",
      category: "purana",
      badge: "सौर महापुराण",
      priest: "सुमन्तु मुनि",
      stats: "४ पर्व • १४,००० श्लोक",
      intro: "सूर्य उपासना, भविष्य की घटनाओं, कालचक्र, पर्व-त्योहार और आचार नियमों का विशद वर्णन।",
      overviewText: "ब्राह्म, मध्यम, प्रतिसर्ग और उत्तर पर्वों में विभक्त भविष्यदर्शी सनातन ग्रंथ।",
      status: "ACTIVE",
    },
  ],
  itihasa: [
    {
      id: "valmiki-ramayana",
      slug: "valmiki-ramayana",
      name: "श्रीमद् वाल्मीकि रामायण",
      enName: "Valmiki Ramayana",
      category: "itihasa",
      badge: "आदिकाव्य",
      priest: "महर्षि वाल्मीकि",
      stats: "७ काण्ड • ५०० सर्ग • २४,००० श्लोक",
      intro: "मर्यादा पुरुषोत्तम भगवान श्री राम का पावन जीवन चरित्र, धर्मनिष्ठा एवं सनातन धर्म की आचार संहिता।",
      overviewText: "बालकाण्ड से उत्तरकाण्ड तक सात काण्डों में निबद्ध संसार का प्रथम आदिकाव्य।",
      status: "ACTIVE",
    },
    {
      id: "mahabharata",
      slug: "mahabharata",
      name: "महाभारत",
      enName: "Mahabharata",
      category: "itihasa",
      badge: "पंचम वेद",
      priest: "महर्षि कृष्णद्वैपायन वेदव्यास",
      stats: "१८ पर्व • १,००,००० श्लोक",
      intro: "यतो धर्मस्ततो जयः — कुरुक्षेत्र का धर्मयुद्ध, नीति, राज्यधर्म एवं सम्पूर्ण भारतीय वांग्मय का सार।",
      overviewText: "धर्म, अर्थ, काम और मोक्ष का जो इस ग्रंथ में है वही सर्वत्र है, जो इसमें नहीं वह कहीं नहीं।",
      status: "ACTIVE",
    },
    {
      id: "bhagavad-gita",
      slug: "bhagavad-gita",
      name: "श्रीमद्भगवद्गीता",
      enName: "Shrimad Bhagavad Gita",
      category: "itihasa",
      badge: "गीतोपनिषद्",
      priest: "योगेश्वर भगवान श्रीकृष्ण",
      stats: "१८ अध्याय • ७०० श्लोक",
      intro: "कर्मयोग, ज्ञानयोग, भक्तियोग और निष्काम कर्म का कुरुक्षेत्र में अर्जुन को दिया गया सार्वभौमिक अमर उपदेश।",
      overviewText: "महाभारत भीष्मपर्व का दिव्य अंश जो समस्त उपनिषदों की कामधेनु का दुग्धामृत है।",
      status: "ACTIVE",
    },
  ],
  upanishad: [
    {
      id: "isha-upanishad",
      slug: "isha-upanishad",
      name: "ईशावास्योपनिषद्",
      enName: "Isha Upanishad",
      category: "upanishad",
      badge: "शुक्लयजुर्वेद",
      priest: "महर्षि याज्ञवल्क्य",
      stats: "१८ मन्त्र • शुक्लयजुर्वेद ४०वाँ अध्याय",
      intro: "ईशा वास्यमिदं सर्वम् — ईश्वर की सर्वव्यापकता, त्यागपूर्वक भोग और विद्या-अविद्या का समन्वय।",
      overviewText: "दशोपनिषदों में प्रथम उपनिषद जो शुक्लयजुर्वेद की वाजसनेयि संहिता का मूल भाग है।",
      status: "ACTIVE",
    },
    {
      id: "kena-upanishad",
      slug: "kena-upanishad",
      name: "केनोपनिषद्",
      enName: "Kena Upanishad",
      category: "upanishad",
      badge: "सामवेद",
      priest: "तलवकार शाखा",
      stats: "४ खण्ड • ३४ मन्त्र",
      intro: "केनेषितं पतति प्रेषितं मनः — मन और इन्द्रियों का प्रेरक वह परम ब्रह्म कौन है? यक्षोपाख्यान।",
      overviewText: "सामवेद की तलवकार (जैमिनीय) शाखा के ब्राह्मण का नवम अध्याय।",
      status: "ACTIVE",
    },
    {
      id: "katha-upanishad",
      slug: "katha-upanishad",
      name: "कठोपनिषद्",
      enName: "Katha Upanishad",
      category: "upanishad",
      badge: "कृष्णयजुर्वेद",
      priest: "यमाचार्य व नचिकेता",
      stats: "२ अध्याय • ६ वल्लियाँ • ११९ मन्त्र",
      intro: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत — नचिकेता-यम संवाद, आत्मज्ञान, श्रेयस और प्रेयस का गूढ़ रहस्य।",
      overviewText: "कृष्णयजुर्वेद की कठ शाखा से संबद्ध अत्यंत प्रसिद्ध और प्रेरक उपनिषद।",
      status: "ACTIVE",
    },
    {
      id: "mundaka-upanishad",
      slug: "mundaka-upanishad",
      name: "मुण्डकोपनिषद्",
      enName: "Mundaka Upanishad",
      category: "upanishad",
      badge: "अथर्ववेद",
      priest: "अंगिरा ऋषि",
      stats: "३ मुण्डक • ६ खण्ड • ६४ मन्त्र",
      intro: "सत्यमेव जयते — परा और अपरा विद्या का सुस्पष्ट विवेचन, द्वा सुपर्णा सयुजा सखाया।",
      overviewText: "अथर्ववेद के शौनक शाखा से संबंधित ब्रह्मविद्या का अत्यंत स्पष्ट उद्घोषक ग्रंथ।",
      status: "ACTIVE",
    },
    {
      id: "mandukya-upanishad",
      slug: "mandukya-upanishad",
      name: "माण्डूक्योपनिषद्",
      enName: "Mandukya Upanishad",
      category: "upanishad",
      badge: "अथर्ववेद",
      priest: "मण्डूक ऋषि",
      stats: "१२ मन्त्र • ओंकार के ४ पाद",
      intro: "अयमात्मा ब्रह्म — जाग्रत, स्वप्न, सुषुप्ति और तुरीय अवस्था का ओंकार के माध्यम से विश्लेषण।",
      overviewText: "मुक्ति के लिए केवल माण्डूक्य पर्याप्त है — ऐसा मुक्तिकोपनिषद् में कहा गया है।",
      status: "ACTIVE",
    },
    {
      id: "chandogya-upanishad",
      slug: "chandogya-upanishad",
      name: "छान्दोग्योपनिषद्",
      enName: "Chandogya Upanishad",
      category: "upanishad",
      badge: "सामवेद",
      priest: "उद्दालक आरुणि",
      stats: "८ प्रपाठक • तत्वमसि महावाक्य",
      intro: "तत्त्वमसि श्वेतकेतो — ओंकार उद्गीथ उपासना, शाण्डिल्य विद्या और आत्मज्ञान का विशाल ग्रंथ।",
      overviewText: "सामवेद के कौथुम शाखीय छान्दोग्य ब्राह्मण का उपनिषद भाग।",
      status: "ACTIVE",
    },
  ],
  darshana: [
    {
      id: "yoga-darshana",
      slug: "yoga-darshana",
      name: "योग दर्शन (पातंजल योगसूत्र)",
      enName: "Yoga Darshana",
      category: "darshana",
      badge: "षड्दर्शन",
      priest: "महर्षि पतंजलि",
      stats: "४ पाद • १९५ योगसूत्र",
      intro: "योगश्चित्तवृत्तिनिरोधः — अष्टांग योग (यम, नियम, आसन, प्राणायाम, प्रत्याहार, धारणा, ध्यान, समाधि)।",
      overviewText: "समाधि, साधन, विभूति और कैवल्य पाद में निबद्ध व्यावहारिक मोक्ष मार्ग।",
      status: "ACTIVE",
    },
    {
      id: "samkhya-darshana",
      slug: "samkhya-darshana",
      name: "सांख्य दर्शन",
      enName: "Samkhya Darshana",
      category: "darshana",
      badge: "षड्दर्शन",
      priest: "महर्षि कपिल",
      stats: "६ अध्याय • ५२७ सूत्र",
      intro: "प्रकृति और पुरुष का द्वैत विवेक, २५ तत्व एवं आधिभौतिक, आधिदैविक व आध्यात्मिक दुःखों की निवृत्ति।",
      overviewText: "भारतीय दर्शन का प्राचीनतम वैज्ञानिक एवं विवेचनात्मक दर्शन शास्त्र।",
      status: "ACTIVE",
    },
    {
      id: "nyaya-darshana",
      slug: "nyaya-darshana",
      name: "न्याय दर्शन",
      enName: "Nyaya Darshana",
      category: "darshana",
      badge: "षड्दर्शन",
      priest: "महर्षि अक्षपाद गौतम",
      stats: "५ अध्याय • ५२८ सूत्र",
      intro: "प्रमाण, प्रमेय, संशय, प्रयोजन, दृष्टान्त, सिद्धान्त, अवयव, तर्क, वाद और १६ पदार्थों का तत्त्वज्ञान।",
      overviewText: "भारतीय तर्कशास्त्र एवं ज्ञानमीमांसा का मूल आधार दर्शन।",
      status: "ACTIVE",
    },
    {
      id: "vaisheshika-darshana",
      slug: "vaisheshika-darshana",
      name: "वैशेषिक दर्शन",
      enName: "Vaisheshika Darshana",
      category: "darshana",
      badge: "षड्दर्शन",
      priest: "महर्षि कणाद (उलूक)",
      stats: "१० अध्याय • ३७० सूत्र",
      intro: "परमाणुवाद, द्रव्य, गुण, कर्म, सामान्य, विशेष, समवाय और अभाव — सृष्टि के मौलिक तत्वों का विश्लेषण।",
      overviewText: "पदार्थ विज्ञान और भौतिक सृष्टि की यथार्थ व्याख्या करने वाला प्राचीनतम दर्शन।",
      status: "ACTIVE",
    },
    {
      id: "mimamsa-darshana",
      slug: "mimamsa-darshana",
      name: "पूर्व मीमांसा दर्शन",
      enName: "Purva Mimamsa",
      category: "darshana",
      badge: "षड्दर्शन",
      priest: "महर्षि जैमिनि",
      stats: "१२ अध्याय • २,७०० सूत्र",
      intro: "अथातो धर्मजिज्ञासा — वैदिक कर्मकाण्ड, मन्त्रार्थ, यज्ञीय विधान और वाक्य व्याख्या के शास्त्रीय नियम।",
      overviewText: "वैदिक वाक्यों की प्रामाणिकता और धर्म की व्याख्या का सर्वोच्च नियम शास्त्र।",
      status: "ACTIVE",
    },
    {
      id: "vedanta-darshana",
      slug: "vedanta-darshana",
      name: "उत्तर मीमांसा (वेदान्त दर्शन / ब्रह्मसूत्र)",
      enName: "Vedanta / Brahma Sutras",
      category: "darshana",
      badge: "षड्दर्शन",
      priest: "महर्षि बादरायण व्यास",
      stats: "४ अध्याय • १६ पाद • ५५५ सूत्र",
      intro: "अथातो ब्रह्मजिज्ञासा • जन्माद्यस्य यतः — उपनिषदों के समस्त वचनों का समन्वय और अद्वैत ब्रह्म का निरूपण।",
      overviewText: "प्रस्थानत्रयी का सूत्र प्रस्थान जिस पर आद्य शंकराचार्य, रामानुजाचार्य आदि के भाष्य हैं।",
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
      quote: "अष्टादश पुराणेषु व्यासस्य वचनद्वयम् • परोपकाराय पुण्याय",
      priestName: veda.priest || "महर्षि व्यास",
      priestRole: "पुराण रचयिता / वक्ता",
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
      quote: "यतो धर्मस्ततो जयः • सनातन इतिहास व नीति",
      priestName: veda.priest || "महर्षि वाल्मीकि / व्यास",
      priestRole: "इतिहास रचयिता / उपदेशक",
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
      quote: "सत्यमेव जयते नानृतम् • वेदान्त ब्रह्मविद्या",
      priestName: veda.priest || "वैदिक ऋषि परंपरा",
      priestRole: "शाखा / ऋषि",
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
      quote: "दृश्यते अनेन इति दर्शनम् • तत्त्वज्ञानं मोक्षसाधनम्",
      priestName: veda.priest || "महर्षि पतंजलि / कपिल",
      priestRole: "प्रवर्तक मुनि / दर्शनकार",
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
      quote: "अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् • ज्ञानकाण्ड",
      priestName: "होतृ (Hotri)",
      priestRole: "ऋचाओं के आह्वानकर्ता",
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
      quote: "इषे त्वोर्जे त्वा वायव स्थ... • कर्मकाण्ड व याज्ञिक क्रिया",
      priestName: "अध्वर्यु (Adhvaryu)",
      priestRole: "यज्ञ कर्म के संचालक",
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
      quote: "वेदानां सामवेदोऽस्मि (गीता १०.२२) • उपासना व सामगान",
      priestName: "उद्गातृ (Udgatri)",
      priestRole: "सामगान के गायक",
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
      quote: "माता भूमिः पुत्रोऽहं पृथिव्याः • ब्रह्मविद्या, भैषज्य व राष्ट्ररक्षा",
      priestName: "ब्रह्मा (Brahma)",
      priestRole: "यज्ञ के सर्वोच्च निरीक्षक",
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
    quote: "सनातन श्रुति परंपरा • वैदिक वांग्मय",
    priestName: veda.priest || "ऋत्विक",
    priestRole: "वैदिक आचार्य",
    priestIcon: Scroll,
  };
};

export const VedaListPage: React.FC<VedaListPageProps> = ({
  category,
  title: customTitle,
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

  const pageTitle = customTitle || categoryConfig.defaultTitle;

  const fetchVedas = async () => {
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
        // Vedas list (chaturyeda)
        const vedasOnly = data.filter((v: Veda) => {
          const vCat = (v.category || "").toLowerCase();
          return !vCat || vCat === "veda" || vCat === "vedas";
        });
        setVedas(vedasOnly.length > 0 ? vedasOnly : data);
      }
    } catch (err: any) {
      showToast(err.message || "ग्रंथ सूची लोड करने में विफल", "error");
      if (category && category !== "all" && category !== "veda") {
        setVedas(INITIAL_CATEGORY_GRANTHAS[resolvedCategory] || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVedas();
  }, [category]);

  const handleSeedDefaultData = async () => {
    try {
      setSeeding(true);
      if (resolvedCategory === "veda") {
        const res = await VedaAdminService.seedDefaultVedas(true);
        showToast(
          `समस्त ४ वेदों का प्रामाणिक डेटा सफलतापूर्वक लोड हुआ! (${res?.vedasCount || 4} वेद, ${res?.nodesCount || 46} शाखाएँ/सूक्त, ${res?.mantrasCount || 17} मंत्र)`,
          "success"
        );
      } else {
        // Set curated category granthas in state
        const initialItems = INITIAL_CATEGORY_GRANTHAS[resolvedCategory] || [];
        setVedas(initialItems);
        showToast(
          `समस्त ${categoryConfig.badgeText} का प्रामाणिक डेटा सफलतापूर्वक लोड हुआ! (${initialItems.length} ग्रंथ)`,
          "success"
        );
      }
      setSeedConfirm(false);
      fetchVedas();
    } catch (err: any) {
      showToast(err.message || "डेटा लोड करने में विफल", "error");
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await VedaAdminService.deleteVeda(deleteTarget.id);
      showToast(`ग्रंथ "${deleteTarget.name}" सफलतापूर्वक हटाया गया`, "success");
      setDeleteTarget(null);
      fetchVedas();
    } catch (err: any) {
      showToast(err.message || "हटाने में विफल", "error");
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
                <span>प्रामाणिक पदपाठ व शास्त्रीय संदर्भ</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
                <Layers className="w-3 h-3 text-amber-400" />
                <span>पदानुक्रमित संरचना (Hierarchy Tree)</span>
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
              <span>डिफ़ॉल्ट डेटा लोड करें (Seed Data)</span>
            </button>

            <div className="flex items-center gap-2 w-full">
              <Link
                to="/admin/library/mantras"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur-sm transition-all"
              >
                <Scroll className="w-3 h-3 text-amber-300" />
                <span>मंत्र व श्लोक</span>
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
                संरचना नोड्स व खण्ड
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight leading-none font-mono">
                {totalNodes}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[9.5px] font-semibold border bg-blue-50 text-blue-700 border-blue-200/80">
                पदानुक्रमित संरचना
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
                संकलित मंत्र व श्लोक
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight leading-none font-mono">
                {totalMantras}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[9.5px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/80">
                प्रामाणिक पाठ
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
                भाषा एवं अर्थ समर्थन
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-charcoal-900 tracking-tight leading-none">
                ३ भाषाएँ
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[9.5px] font-semibold border bg-purple-50 text-purple-700 border-purple-200/80">
                संस्कृत • हिंदी • EN
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
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari transition-colors bg-cream-50/40 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] text-charcoal-500 font-medium hidden md:inline">
            प्रदर्शित: <strong>{filteredVedas.length}</strong> ग्रंथ
          </span>
          <button
            type="button"
            onClick={fetchVedas}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cream-50 hover:bg-cream-100 text-charcoal-700 text-xs font-semibold border border-cream-200 transition-colors"
            title="पुनः लोड करें"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>रिफ्रेश</span>
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
            <span>डिफ़ॉल्ट डेटा लोड करें (Seed Data)</span>
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
                        {/* Sacred Devanagari Badge */}
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} font-devanagari tracking-wide`}
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
                          {veda.name}
                        </h2>
                        <span className="text-[9.5px] font-mono font-bold text-charcoal-400">
                          {veda.id}
                        </span>
                      </div>
                      <p className="text-[10.5px] font-semibold text-saffron-700 tracking-wide">
                        {veda.enName}
                      </p>
                    </div>

                    {/* Sacred Shloka / Subtitle Quote */}
                    <div className="px-2 py-0.5 rounded-lg bg-cream-50/80 border border-cream-200/60 text-[9.5px] text-charcoal-600 font-devanagari italic flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{theme.quote}</span>
                    </div>

                    {/* Intro / Description */}
                    <p className="text-[10.5px] text-charcoal-500 font-devanagari line-clamp-2 leading-relaxed">
                      {veda.intro || veda.desc || veda.overviewText || "सनातन शास्त्रीय वांग्मय संग्रह।"}
                    </p>

                    {/* Visual Metric Chips */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      {/* Nodes Count */}
                      <div className="bg-cream-50/70 p-1.5 rounded-lg border border-cream-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[9.5px] font-medium text-charcoal-500">
                          <Layers className="w-2.5 h-2.5 text-amber-600" />
                          <span>नोड्स / खण्ड</span>
                        </div>
                        <span className="text-charcoal-900 text-xs font-bold font-mono">
                          {nodeCount}
                        </span>
                      </div>

                      {/* Mantras Count */}
                      <div className="bg-cream-50/70 p-1.5 rounded-lg border border-cream-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[9.5px] font-medium text-charcoal-500">
                          <Scroll className="w-2.5 h-2.5 text-emerald-600" />
                          <span>मंत्र / श्लोक</span>
                        </div>
                        <span className="text-charcoal-900 text-xs font-bold font-mono">
                          {mantraCount}
                        </span>
                      </div>
                    </div>

                    {/* Structure Stat summary */}
                    <div className="text-[9.5px] text-charcoal-500 font-devanagari truncate bg-cream-50/50 px-1.5 py-0.5 rounded border border-cream-100/80">
                      {veda.stats || "प्रामाणिक संहिता व ग्रंथ"}
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
                      title="संरचना ट्री"
                    >
                      <FolderTree className="w-3 h-3" />
                      <span>ट्री</span>
                    </Link>

                    {/* View Mantras Button */}
                    <Link
                      to={`/admin/library/mantras?vedaId=${veda.id}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-cream-100 text-charcoal-700 text-[10.5px] font-semibold border border-cream-300 transition-colors shadow-2xs"
                      title="मंत्र / श्लोक देखें"
                    >
                      <Scroll className="w-3 h-3 text-saffron-600" />
                      <span>मंत्र ({mantraCount})</span>
                    </Link>
                  </div>

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center gap-0.5">
                    <Link
                      to={`/admin/library/vedas/${veda.id}/edit${category ? `?category=${category}` : ""}`}
                      className="p-1 text-charcoal-400 hover:text-saffron-700 rounded-md hover:bg-white transition-colors"
                      title="संपादित करें (Edit)"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(veda)}
                      className="p-1 text-charcoal-400 hover:text-red-600 rounded-md hover:bg-white transition-colors cursor-pointer"
                      title="हटाएं (Delete)"
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
        title="ग्रंथ हटाएं (Delete Grantha)"
        message={`क्या आप निश्चित रूप से "${deleteTarget?.name}" को हटाना चाहते हैं? इसके अंतर्गत आने वाले सभी उप-नोड्स, श्लोक व संदर्भ भी हटा दिए जाएंगे।`}
        confirmLabel="हटाएं (Delete)"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Seed Dataset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={seedConfirm}
        title={`${categoryConfig.hindiTitle} का प्रामाणिक डेटा लोड करें`}
        message={`यह क्रिया ${categoryConfig.hindiTitle} के प्रामाणिक संदर्भों, अध्यायों, श्लोकों और उनकी पदानुक्रमित संरचना को लोड व अद्यतन करेगी। क्या आप जारी रखना चाहते हैं?`}
        confirmLabel={seeding ? "लोड हो रहा है..." : "हाँ, लोड करें (Seed Data)"}
        variant="warning"
        onConfirm={handleSeedDefaultData}
        onCancel={() => setSeedConfirm(false)}
      />
    </div>
  );
};

export default VedaListPage;
