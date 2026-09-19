import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Scroll,
  Compass,
  BookOpen,
  Sun,
  Flame,
  Sparkles,
  ChevronRight,
  Network,
} from "lucide-react";
import { VEDA_HIERARCHY_TREE } from "../data/vedaHierarchyData";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const getCategoryIcon = (id) => {
  switch (id) {
    case "vedic-knowledge":
      return Scroll;
    case "shastra-darshana":
      return Compass;
    case "itihasa-purana":
      return BookOpen;
    case "dharma-jeevan":
      return Sun;
    case "puja-anushthana":
      return Flame;
    default:
      return Sparkles;
  }
};

// Curated list of direct Granthas/Types for each Knowledge Area for fast 1-click navigation
const KNOWLEDGE_AREA_TYPES = {
  "vedic-knowledge": [
    {
      id: "rigveda",
      title: { en: "Rigveda Samhita", hi: "ऋग्वेद संहिता" },
      sanskrit: "ऋग्वेदः (१० मण्डल, १,०२८ सूक्त)",
      desc: { en: "Primordial hymns, Agni & Gayatri mantras", hi: "अग्नि सूक्त, गायत्री व शांति मंत्र" },
      badge: "10 Mandalas",
      type: "Veda",
    },
    {
      id: "yajurveda",
      title: { en: "Yajurveda Samhita", hi: "यजुर्वेद संहिता" },
      sanskrit: "यजुर्वेदः (शुक्ल व कृष्ण)",
      desc: { en: "Sacred fire formulas & Ishavasya", hi: "वाजसनेयि व तैत्तिरीय शाखा" },
      badge: "Ritual Rites",
      type: "Veda",
    },
    {
      id: "samaveda",
      title: { en: "Samaveda Samhita", hi: "सामवेद संहिता" },
      sanskrit: "सामवेदः (गान प्रधान)",
      desc: { en: "Sacred celestial chanting & melodies", hi: "पूर्वार्चिक एवं उत्तरार्चिक" },
      badge: "Melodies",
      type: "Veda",
    },
    {
      id: "atharvaveda",
      title: { en: "Atharvaveda Samhita", hi: "अथर्ववेद संहिता" },
      sanskrit: "अथर्ववेदः (शौनक शाखा)",
      desc: { en: "Prithvi Sukta, wellness & holistic living", hi: "भूमि सूक्त एवं दैनिक शांति" },
      badge: "20 Kandas",
      type: "Veda",
    },
    {
      id: "vedanga",
      title: { en: "The 6 Vedangas", hi: "षड् वेदांग (६ अंग)" },
      sanskrit: "शिक्षा, व्याकरण, छन्द, निरुक्त, ज्योतिष, कल्प",
      desc: { en: "Phonetics, Grammar, Metres, Astronomy", hi: "वेद के छह अनिवार्य शास्त्र" },
      badge: "6 Branches",
      type: "Vedanga",
    },
    {
      id: "upanishad",
      title: { en: "Principal Upanishads", hi: "दशोपनिषद् (वेदान्त)" },
      sanskrit: "ईश, केन, कठ, माण्डूक्य, छान्दोग्य...",
      desc: { en: "Non-dual spiritual inquiry & Atman", hi: "आत्मानुभूति एवं ब्रह्मविद्या" },
      badge: "Vedanta",
      type: "Upanishad",
    },
  ],

  "shastra-darshana": [
    {
      id: "darshana-samkhya",
      title: { en: "Samkhya Darshana", hi: "सांख्य दर्शन" },
      sanskrit: "महर्षि कपिल (२५ तत्त्व)",
      desc: { en: "25 Tattvas, Purusha & Prakriti dualism", hi: "प्रकृति-पुरुष विवेक एवं तत्त्वज्ञान" },
      badge: "Kapila",
      type: "Darshana",
    },
    {
      id: "darshana-yoga",
      title: { en: "Yoga Darshana", hi: "पातञ्जल योग दर्शन" },
      sanskrit: "योगसूत्रम् (अष्टांग योग)",
      desc: { en: "Mind mastery, Samadhi & 8 limbs of yoga", hi: "चित्तवृत्ति निरोध एवं कैवल्य" },
      badge: "Patanjali",
      type: "Darshana",
    },
    {
      id: "darshana-nyaya",
      title: { en: "Nyaya Darshana", hi: "न्याय दर्शन (तर्कशास्त्र)" },
      sanskrit: "महर्षि गौतम (४ प्रमाण)",
      desc: { en: "Epistemology, reasoning & formal logic", hi: "प्रत्यक्ष, अनुमान, उपमान, शब्द" },
      badge: "Gautama",
      type: "Darshana",
    },
    {
      id: "darshana-vaisheshika",
      title: { en: "Vaisheshika Darshana", hi: "वैशेषिक दर्शन" },
      sanskrit: "महर्षि कणाद (परमाणुवाद)",
      desc: { en: "Atomic physics, 9 Dravyas & 7 Padarthas", hi: "पदार्थ विज्ञान एवं परमाणु सिद्धांत" },
      badge: "Kanada",
      type: "Darshana",
    },
    {
      id: "darshana-mimamsa",
      title: { en: "Purva Mimamsa", hi: "पूर्व मीमांसा" },
      sanskrit: "महर्षि जैमिनि (द्वादश लक्षणी)",
      desc: { en: "Vedic hermeneutics, Dharma & sacred rites", hi: "धर्म-जिज्ञासा एवं कर्म-मीमांसा" },
      badge: "Jaimini",
      type: "Darshana",
    },
    {
      id: "darshana-vedanta",
      title: { en: "Vedanta Darshana", hi: "वेदान्त दर्शन (प्रस्थानत्रयी)" },
      sanskrit: "ब्रह्मसूत्र, उपनिषद एवं गीता",
      desc: { en: "Ultimate non-dual reality & liberation", hi: "अद्वैत एवं तत्त्वज्ञान" },
      badge: "Prasthanatrayi",
      type: "Darshana",
    },
  ],

  "itihasa-purana": [
    {
      id: "ramayana",
      title: { en: "Srimad Valmiki Ramayana", hi: "श्रीमद् वाल्मीकि रामायण" },
      sanskrit: "७ काण्ड · ५०० सर्ग · २४,००० श्लोक",
      desc: { en: "Bala, Ayodhya, Sundara, Yuddha Kandas", hi: "मर्यादा पुरुषोत्तम श्रीराम का पावन चरित्र" },
      badge: "7 Kandas",
      type: "Itihasa",
    },
    {
      id: "mahabharata",
      title: { en: "Mahabharata & Gita", hi: "महाभारत एवं श्रीमद्भगवद्गीता" },
      sanskrit: "१८ पर्व · पंचम वेद",
      desc: { en: "Kurukshetra, Gita 2.47, Shanti Parva", hi: "कर्मण्येवाधिकारस्ते एवं राजधर्म" },
      badge: "18 Parvas",
      type: "Itihasa",
    },
    {
      id: "purana",
      title: { en: "The 18 Mahapuranas", hi: "१८ महापुराण संग्रह" },
      sanskrit: "विष्णु, भागवत, शिव, मार्कण्डेय...",
      desc: { en: "Cosmic lore, genealogies & devotions", hi: "सनातन संस्कृति का महाविश्वकोश" },
      badge: "18 Texts",
      type: "Purana",
    },
    {
      id: "devata-avatara-tattva",
      title: { en: "Sacred Deities & Avataras", hi: "ईश्वर, त्रिदेव एवं अवतार तत्त्व" },
      sanskrit: "त्रिदेव, त्रिदेवी, दशावतार एवं पंचायतन",
      desc: { en: "Brahma, Vishnu, Shiva, 10 Avatars & 33 Devas", hi: "सृष्टि-पालन-संहार, दशावतार व ३३ देव" },
      badge: "Trimurti",
      type: "Devata",
    },
  ],

  "dharma-jeevan": [
    {
      id: "shodasha-samskara",
      title: { en: "The 16 Samskaras", hi: "षोडश संस्कार (१६ संस्कार)" },
      sanskrit: "गर्भाधान, उपनयन, विवाह से अन्त्येष्टि",
      desc: { en: "Sacred rites of passage & ceremonies", hi: "संस्कार विधि, सामग्री एवं मंत्र" },
      badge: "16 Rites",
      type: "Samskara",
    },
    {
      id: "ashrama-dharma",
      title: { en: "Chaturashrama", hi: "चार आश्रम व्यवस्था" },
      sanskrit: "ब्रह्मचर्य, गृहस्थ, वानप्रस्थ, संन्यास",
      desc: { en: "Life's 4 stages for holistic fulfillment", hi: "जीवन के चार सोपान एवं धर्म" },
      badge: "4 Stages",
      type: "Ashrama",
    },
  ],

  "puja-anushthana": [
    {
      id: "puja-vidhi",
      title: { en: "Shodashopachara Puja", hi: "षोडशोपचार देव पूजा" },
      sanskrit: "१६-चरण वैदिक पूजन विधि",
      desc: { en: "Sankalpa, Avahana, 16 Upacharas, Arati", hi: "ईश्वर की सगुण षोडशोपचार उपासना" },
      badge: "16 Steps",
      type: "Puja",
    },
    {
      id: "yagya-homa",
      title: { en: "Vedic Yajna & Homa", hi: "महायज्ञ एवं हवन परंपरा" },
      sanskrit: "अग्निहोत्र, गणपति, महारुद्र हवन",
      desc: { en: "Sacred fire offerings & atmosphere cleansing", hi: "हविष्य एवं अग्नि देव आराधना" },
      badge: "Fire Rites",
      type: "Yajna",
    },
    {
      id: "stotra-mantra",
      title: { en: "Stotras & Mahamantras", hi: "दिव्य स्तोत्र एवं महामंत्र" },
      sanskrit: "महामृत्युंजय, गायत्री मंत्र आदि",
      desc: { en: "Vedic chants with Rishi, Devata, Chandas", hi: "आरोग्य, शांति एवं सुरक्षा कवच" },
      badge: "Mantras",
      type: "Mantra",
    },
  ],
};

const LibraryMegaMenu = ({ onClose, onOpenTreeView }) => {
  const { isHindi } = useLibraryLanguage();
  const navigate = useNavigate();

  // Active hovered Knowledge Area on the Left (Default: 01. Vedic Knowledge)
  const [activeAreaId, setActiveAreaId] = useState("vedic-knowledge");

  const currentArea =
    VEDA_HIERARCHY_TREE.find((c) => c.id === activeAreaId) || VEDA_HIERARCHY_TREE[0];

  const typesList = KNOWLEDGE_AREA_TYPES[activeAreaId] || [];

  const handleNavigate = (nodeId) => {
    onClose();
    navigate(nodeId ? `/library?node=${nodeId}` : "/library");
  };

  return (
    <div className="absolute right-[-100px] sm:right-[-40px] top-full z-50 pt-2.5 w-[760px] max-w-[calc(100vw-24px)] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="overflow-hidden rounded-3xl border-2 border-[#e6d0a7] bg-[#fffdfa] shadow-[0_20px_60px_rgba(70,45,15,0.22)] ring-1 ring-black/5">
        {/* Luxury Sacred Top Header */}
        <div className="flex items-center justify-between border-b border-[#eee1ca] bg-gradient-to-r from-[#faf4e6] via-[#fff9ee] to-[#faf4e6] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c88918] text-white shadow-xs">
              <Scroll size={14} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[13px] font-bold tracking-[0.16em] text-[#2b241d] uppercase">
                  VEDA LIBRARY
                </span>
                <span className="text-[#c88918]">✦</span>
                <span className="font-serif text-[12px] font-medium text-[#8c6724]">
                  सनातन ज्ञानकोष
                </span>
              </div>
              <p className="text-[10.5px] text-[#7d7062]">
                {isHindi
                  ? "ज्ञान क्षेत्र पर कर्सर ले जाएँ और सीधे ग्रंथ/शाखा पृष्ठ पर पहुँचें"
                  : "Hover a Knowledge Area on the left to see its types, then click to open directly"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenTreeView) onOpenTreeView();
              else navigate("/library?view=tree");
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#ebd2a0] bg-[#fffcf5] px-3 py-1 font-mono text-[11px] font-bold text-[#986411] transition hover:bg-[#c88918] hover:text-white shadow-2xs"
          >
            <Network size={12} />
            <span>{isHindi ? "वृक्ष व्यू खोलें" : "Open Tree"}</span>
          </button>
        </div>

        {/* 2-STAGE CASCADING LAYOUT:
            Left: 1. Knowledge Areas (Hover/Select)
            Right: Types & Granthas (Direct Click opens Page) */}
        <div className="grid grid-cols-12 min-h-[350px] bg-white divide-x divide-[#f0e4cf]">
          {/* ============================================================ */}
          {/* STAGE 1 (Left 42%): 1. Knowledge Areas                       */}
          {/* ============================================================ */}
          <div className="col-span-12 md:col-span-5 p-3 space-y-1 bg-[#fffdfa]">
            <div className="px-2.5 py-1 mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#986411]">
                1. Knowledge Areas
              </span>
              <span className="text-[10px] text-[#a08e7d]">
                {isHindi ? "५ मुख्य क्षेत्र" : "5 Areas"}
              </span>
            </div>

            {VEDA_HIERARCHY_TREE.map((cat) => {
              const Icon = getCategoryIcon(cat.id);
              const isSelected = activeAreaId === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setActiveAreaId(cat.id)}
                  onClick={() => handleNavigate(cat.id)}
                  className={`group w-full text-left rounded-2xl p-2.5 transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#faedd8] text-[#2b241d] font-semibold shadow-xs border border-[#ebd2a0]"
                      : "text-[#544638] hover:bg-[#fbf7ee] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
                        isSelected
                          ? "bg-[#c88918] text-white shadow-2xs"
                          : "bg-[#f4e6ca] text-[#8e651e] group-hover:bg-[#ebd9bc]"
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-[13px] font-bold truncate group-hover:text-[#c88918]">
                        {isHindi ? cat.shortTitle?.hi : cat.shortTitle?.en}
                      </p>
                      <p className="font-serif text-[11px] text-[#8a7258] truncate">
                        {cat.sanskrit}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={14}
                    className={`shrink-0 transition-transform ${
                      isSelected ? "text-[#c88918] translate-x-1" : "text-[#c9b7ac]"
                    }`}
                  />
                </div>
              );
            })}

            {/* Direct Link to Whole Library */}
            <div className="pt-2 px-1">
              <button
                type="button"
                onClick={() => handleNavigate(null)}
                className="w-full rounded-xl border border-dashed border-[#dfcca3] bg-[#fffdf9] py-2 text-center text-[11.5px] font-semibold text-[#8a6e43] hover:border-[#c88918] hover:text-[#c88918] transition cursor-pointer"
              >
                {isHindi ? "सम्पूर्ण पुस्तकालय सूची देखें →" : "View Entire Repository →"}
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* STAGE 2 (Right 58%): Types / Granthas of Hovered Area         */}
          {/* ============================================================ */}
          <div className="col-span-12 md:col-span-7 p-4 bg-[#fffefc] flex flex-col justify-between">
            <div>
              {/* Header for Types */}
              <div className="flex items-center justify-between border-b border-[#f0e4cf] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#986411]">
                    {isHindi ? "२. उपलब्ध प्रकार एवं ग्रंथ" : "2. Available Types & Granthas"}
                  </span>
                  <span className="text-[#c88918]">•</span>
                  <span className="font-serif text-[12px] font-semibold text-[#2b241d]">
                    {isHindi ? currentArea.title?.hi : currentArea.title?.en}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavigate(currentArea.id)}
                  className="text-[11px] font-bold text-[#c88918] hover:underline cursor-pointer"
                >
                  {isHindi ? "यह पूरा क्षेत्र खोलें →" : "Open Section →"}
                </button>
              </div>

              {/* Grid of Direct Types / Scriptures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#ebd6b0]">
                {typesList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className="group cursor-pointer rounded-xl border border-[#ebdcc4] bg-[#fffdfa] p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#c88918] hover:bg-[#fffcf5] hover:shadow-[0_4px_16px_rgba(200,137,24,0.1)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="rounded-md bg-[#f6ecd7] px-1.5 py-0.2 text-[9.5px] font-mono font-bold text-[#986411] border border-[#ebd2a0]">
                          {item.badge}
                        </span>
                        <ArrowRight
                          size={12}
                          className="text-[#bba99c] transition group-hover:translate-x-0.5 group-hover:text-[#c88918]"
                        />
                      </div>

                      <h4 className="font-serif text-[13px] font-bold text-[#2b241d] group-hover:text-[#c88918] transition-colors line-clamp-1">
                        {isHindi ? item.title.hi : item.title.en}
                      </h4>

                      <p className="font-serif text-[10.5px] text-[#8c6724] line-clamp-1">
                        {item.sanskrit}
                      </p>

                      <p className="mt-1 text-[10.5px] text-[#71614f] line-clamp-1 leading-relaxed">
                        {isHindi ? item.desc.hi : item.desc.en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Direct CTA */}
            <div className="mt-3 pt-2.5 border-t border-[#f0e4cf] flex items-center justify-between">
              <span className="text-[11px] text-[#867563]">
                {isHindi ? "क्लिक करते ही सीधा पृष्ठ खुलेगा" : "Clicking opens scripture directly"}
              </span>

              <button
                type="button"
                onClick={() => handleNavigate(currentArea.id)}
                className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#c88918] hover:text-[#986411] transition cursor-pointer"
              >
                <span>{isHindi ? "विस्तार से पढ़ें" : "Explore Detail"}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryMegaMenu;
