import { useState, useMemo } from "react";
import { ArrowRight, Search, Sparkles, BookOpen, Layers, X, Compass } from "lucide-react";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import { getNodeCardImage, getFirstLeafNode } from "../data/vedaHierarchyData";

// Helpful, non-technical explanations for traditional Vedic divisions
export const getTermExplanation = (term, isHindi) => {
  if (!term) return null;
  const t = term.toLowerCase();
  if (t.includes("mandala")) return isHindi ? "मण्डल · वेद का प्रमुख पुस्तक खंड" : "Mandala · Major Sacred Book";
  if (t.includes("sukta")) return isHindi ? "सूक्त · पवित्र स्तुति प्रार्थना / ऋचा-समूह" : "Sukta · Hymn / Sacred Prayer";
  if (t.includes("mantra")) return isHindi ? "मंत्र · पावन वैदिक ऋचा / ध्वनि" : "Mantra · Sacred Verse / Chant";
  if (t.includes("kanda")) return isHindi ? "काण्ड · महाग्रंथ का मुख्य सोपान / भाग" : "Kanda · Major Epic Section / Book";
  if (t.includes("prakarana")) return isHindi ? "प्रकरण · मुख्य विषयगत प्रसंग / कथा भाग" : "Prakarana · Thematic Episode / Section";
  if (t.includes("sarga")) return isHindi ? "सर्ग · महाकाव्य का अध्याय" : "Sarga · Chapter / Canto";
  if (t.includes("parva")) return isHindi ? "पर्व · महाभारत का महाग्रंथ खंड" : "Parva · Epic Book / Major Section";
  if (t.includes("adhyaya")) return isHindi ? "अध्याय · पाठ / प्रसंग" : "Adhyaya · Chapter / Lesson";
  if (t.includes("shloka")) return isHindi ? "श्लोक · पवित्र पद्य / छंद" : "Shloka · Sacred Verse / Couplet";
  if (t.includes("sutra")) return isHindi ? "सूत्र · संक्षिप्त दार्शनिक ज्ञान-सूत्र" : "Sutra · Aphorism / Core Teaching";
  if (t.includes("anuvaka")) return isHindi ? "अनुवाक · पाठ-प्रभाग / उप-अध्याय" : "Anuvaka · Recitation Section / Sub-Chapter";
  if (t.includes("skandha")) return isHindi ? "स्कन्ध · महापुराण का मुख्य खंड" : "Skandha · Major Canto / Book";
  if (t.includes("shakha")) return isHindi ? "शाखा · वैदिक अध्ययन परंपरा" : "Shakha · Vedic Recension / Branch";
  if (t.includes("pada")) return isHindi ? "पाद · चरण / विषयगत पावन भाग" : "Pada · Quarter / Thematic Part";
  if (t.includes("samskara")) return isHindi ? "संस्कार · षोडश पावन जीवन-विधि" : "Samskara · Sacred Life Rite";
  if (t.includes("upachara")) return isHindi ? "उपचार · पूजा-विधि क्रम" : "Upachara · Devotional Ritual Step";
  if (t.includes("samhita")) return isHindi ? "संहिता · मूल मंत्र-संग्रह" : "Samhita · Canonical Hymn Collection";
  if (t.includes("brahmana")) return isHindi ? "ब्राह्मण · यज्ञ-विधि एवं अर्थ व्याख्या" : "Brahmana · Ritual Meaning & Exegesis";
  if (t.includes("aranyaka")) return isHindi ? "आरण्यक · वानप्रस्थ अरण्य चिंतन" : "Aranyaka · Forest Meditations";
  if (t.includes("upanishad")) return isHindi ? "उपनिषद् · वेदांत आत्मविद्या / ब्रह्मज्ञान" : "Upanishad · Vedantic Wisdom Philosophy";
  if (t.includes("vedanga")) return isHindi ? "वेदांग · वेद का षडंग सहायक शास्त्र" : "Vedanga · Auxiliary Vedic Science";
  if (t.includes("purana")) return isHindi ? "महापुराण · पुरातन आख्यान एवं इतिहास" : "Purana · Sacred Epic Chronicle";
  if (t.includes("itihasa")) return isHindi ? "इतिहास · पावन महाकाव्य परंपरा" : "Itihasa · Sacred Epic History";
  return null;
};

// Returns clear visual architecture guide for the current scripture
const getScriptureArchitectureFlow = (node, isHindi) => {
  const id = (node.id || "").toLowerCase();
  const parentId = (node.parentId || "").toLowerCase();
  if (id.includes("ramayana") || parentId.includes("ramayana")) {
    return isHindi
      ? "वाल्मीकि रामायण संरचना: ७ काण्ड (प्रमुख सोपान) → प्रकरण (कथा प्रसंग) → सर्ग (अध्याय) → श्लोक (पद्य)"
      : "Valmiki Ramayana Hierarchy: 7 Kandas (Major Books) → Prakaranas (Episodes) → Sargas (Chapters) → Shlokas (Verses)";
  }
  if (id.includes("mahabharata") || parentId.includes("mahabharata")) {
    return isHindi
      ? "महाभारत संरचना: १८ महापर्व (प्रमुख खंड) → उपपर्व / अध्याय → श्लोक (पद्य)"
      : "Mahabharata Hierarchy: 18 Parvas (Epic Books) → Sub-Parvas / Adhyayas (Chapters) → Shlokas (Verses)";
  }
  if (id.includes("rigveda") || parentId.includes("rigveda")) {
    return isHindi
      ? "ऋग्वेद संरचना: संहिता → १० मण्डल (प्रमुख पुस्तकें) → १०२८ सूक्त (प्रार्थनाएँ) → १०,५५२ मंत्र (ऋचाएँ)"
      : "Rigveda Hierarchy: Samhita → 10 Mandalas (Books) → 1,028 Suktas (Hymns) → 10,552 Mantras (Verses)";
  }
  if (id.includes("yajurveda") || parentId.includes("yajurveda")) {
    return isHindi
      ? "यजुर्वेद संरचना: शुक्ल/कृष्ण शाखाएँ → संहिता / ब्राह्मण → अध्याय → विहित मंत्र"
      : "Yajurveda Hierarchy: Shukla & Krishna Shakhas → Samhita / Brahmana → Adhyayas → Prescribed Mantras";
  }
  if (id.includes("samaveda") || parentId.includes("samaveda")) {
    return isHindi
      ? "सामवेद संरचना: आर्चिक (छन्द-संग्रह) → गान (साम-स्वर) → प्रपाठक → साम-मंत्र"
      : "Samaveda Hierarchy: Archika (Verses) → Gana (Melodies) → Prapathakas → Saman Verses";
  }
  if (id.includes("atharva") || parentId.includes("atharva")) {
    return isHindi
      ? "अथर्ववेद संरचना: २० काण्ड (प्रमुख भाग) → ७३० सूक्त (प्रार्थनाएँ) → ५,९७७ मंत्र"
      : "Atharvaveda Hierarchy: 20 Kandas (Books) → 730 Suktas (Hymns) → 5,977 Sacred Mantras";
  }
  if (id.includes("gita") || parentId.includes("gita")) {
    return isHindi
      ? "श्रीमद्भगवद्गीता: भीष्मपर्व (महाभारत) → १८ योग-अध्याय → ७०० पवित्र श्लोक"
      : "Bhagavad Gita: Bhishma Parva → 18 Yoga Chapters (Adhyayas) → 700 Sacred Shlokas";
  }
  if (id.includes("purana") || parentId.includes("purana")) {
    return isHindi
      ? "अष्टादश महापुराण: १८ महापुराण → स्कन्ध / संहिता → अध्याय → पावन श्लोक"
      : "18 Mahapuranas: 18 Canonical Puranas → Skandhas / Samhitas → Adhyayas → Shlokas";
  }
  if (id.includes("vedanga") || id.includes("jyotisha")) {
    return isHindi
      ? "षडंग वेदांग: शिक्षा, कल्प, व्याकरण, निरुक्त, छन्द, ज्योतिष → शास्त्र सूत्र"
      : "6 Vedangas: Shiksha, Kalpa, Vyakarana, Nirukta, Chandas, Jyotisha → Shastra Sutras";
  }
  if (id.includes("sutra") || id.includes("darshana") || id.includes("shastra")) {
    return isHindi
      ? "षड्दर्शन एवं शास्त्र संरचना: दार्शनिक पद्धति → पाद / अध्याय → संक्षिप्त सूत्र"
      : "Darshana & Shastra Hierarchy: Philosophical System → Padas / Adhyayas → Concise Sutras";
  }
  if (id.includes("puja") || id.includes("yagya") || id.includes("samskara")) {
    return isHindi
      ? "अनुष्ठान एवं संस्कार संरचना: वैदिक परंपरा → संस्कार / पूजा विधि → चरण एवं विहित मंत्र"
      : "Ritual & Samskara Hierarchy: Sacred Tradition → Ceremony Vidhi → Steps & Prescribed Mantras";
  }
  return null;
};

// Recursively checks if a child or any of its nested descendants match the search term
const matchesChildOrDescendant = (item, q) => {
  if (!q) return true;
  const matchSelf =
    item.title?.en?.toLowerCase().includes(q) ||
    item.title?.hi?.toLowerCase().includes(q) ||
    item.shortTitle?.en?.toLowerCase().includes(q) ||
    item.shortTitle?.hi?.toLowerCase().includes(q) ||
    item.sanskrit?.toLowerCase().includes(q) ||
    item.tagline?.en?.toLowerCase().includes(q) ||
    item.tagline?.hi?.toLowerCase().includes(q) ||
    item.desc?.en?.toLowerCase().includes(q) ||
    item.desc?.hi?.toLowerCase().includes(q) ||
    item.badge?.toLowerCase().includes(q);
  if (matchSelf) return true;

  if (item.children && item.children.length > 0) {
    return item.children.some((sub) => matchesChildOrDescendant(sub, q));
  }
  return false;
};

const LibraryNodeExplorer = ({ node, onSelectChild }) => {
  const { isHindi } = useLibraryLanguage();
  const [filterQuery, setFilterQuery] = useState("");

  if (!node) return null;

  const children = node.children || [];

  // Deep search matching both direct children and nested chapters / verses
  const filteredChildren = useMemo(() => {
    if (!filterQuery.trim()) return children;
    const q = filterQuery.toLowerCase().trim();
    return children.filter((child) => matchesChildOrDescendant(child, q));
  }, [children, filterQuery]);

  const architectureGuide = getScriptureArchitectureFlow(node, isHindi);
  const currentTermDesc = getTermExplanation(node.levelLabel?.en || node.type, isHindi);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ============================================================== */}
      {/* SACRED VEDIC HEADER PANEL                                      */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#ebd8b8] bg-gradient-to-br from-[#fffcf7] via-[#fffdfa] to-[#fbf5e7] p-4 sm:p-7 lg:p-8 shadow-sm">
        {/* Subtle Vedic Ambient Glow Accents */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#f8d795]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#faecd6]/30 blur-3xl" />

        <div className="relative z-10">
          {/* Metadata Badges & Category Pill */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faecd6] px-3 sm:px-3.5 py-1 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#986411] border border-[#ebd2a0] shadow-2xs">
              <BookOpen size={12} className="text-[#c88918]" />
              {isHindi ? node.levelLabel?.hi || "पवित्र ग्रंथ" : node.levelLabel?.en || "Sacred Scripture"}
            </span>

            {currentTermDesc && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] sm:text-[11.5px] font-semibold text-[#8b5e15] border border-[#ebd8b8] shadow-2xs">
                <Compass size={11} className="text-[#c88918]" />
                {currentTermDesc}
              </span>
            )}

            {node.badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] sm:text-[12px] font-semibold text-[#7d5d36] border border-[#ebd8b8] shadow-2xs">
                <Sparkles size={11} className="text-[#c88918]" />
                {node.badge}
              </span>
            )}

            {children.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f6eee3] px-3 py-1 text-[11px] sm:text-[12px] font-medium text-[#7d5d36] border border-[#ebdcc4]">
                <Layers size={11} className="text-[#986411]" />
                {children.length} {isHindi ? (node.childLevelName?.hi || "प्रभाग") : (node.childLevelName?.en || "Sections")}
              </span>
            )}
          </div>

          {/* Prominent Sanskrit Calligraphy */}
          {node.sanskrit && (
            <p className="font-serif text-[20px] sm:text-[26px] lg:text-[30px] font-bold tracking-wide text-[#b45309] leading-snug mb-1 break-words">
              {node.sanskrit}
            </p>
          )}

          {/* Main Title */}
          <h1 className="font-serif text-[24px] sm:text-[32px] lg:text-[38px] font-bold text-[#2b241d] tracking-tight leading-snug break-words">
            {isHindi ? node.title?.hi : node.title?.en}
          </h1>

          {/* Tagline */}
          {node.tagline && (
            <p className="mt-1 font-medium text-[#c88918] text-[13.5px] sm:text-[15.5px] leading-relaxed">
              {isHindi ? node.tagline?.hi : node.tagline?.en}
            </p>
          )}

          {/* Description */}
          {node.desc && (
            <p className="mt-2.5 text-[13px] sm:text-[14.5px] leading-relaxed text-[#685848] max-w-[920px]">
              {isHindi ? node.desc?.hi : node.desc?.en}
            </p>
          )}

          {/* Progressive Disclosure Guide: Clear Architecture Ribbon */}
          {architectureGuide && (
            <div className="mt-4 rounded-xl border border-[#ebd8b8] bg-[#fbf5e7]/80 px-3.5 py-2 text-[11.5px] sm:text-[12.5px] text-[#7d4808] flex items-center gap-2">
              <span className="shrink-0 text-[#c88918] font-bold">✦</span>
              <span className="font-medium">{architectureGuide}</span>
            </div>
          )}

          {/* In-Section Search / Filter Bar */}
          {children.length > 2 && (
            <div className="relative mt-5 max-w-[480px]">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={
                  isHindi
                    ? `${node.shortTitle?.hi || "इस प्रभाग"} में खोजें (जैसे सर्ग, श्लोक या नाम)...`
                    : `Filter in ${node.shortTitle?.en || "this section"} (e.g. Sarga, verse, or title)...`
                }
                className="w-full rounded-2xl border border-[#ebd8b8] bg-white py-2.5 pl-10 pr-11 text-[16px] sm:text-[13.5px] text-[#2b241d] placeholder:text-[#9e8f7f] outline-none focus:border-[#c88918] focus:ring-2 focus:ring-[#c88918]/20 shadow-2xs transition-all"
              />
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#9e8f7f]" />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full text-[#9e8f7f] hover:bg-[#f3e7d3] hover:text-[#2b241d] transition-colors"
                  aria-label="Clear filter"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Sub-Sections / Chapters / Sargas / Verses */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#c88918]" />
            <h2 className="font-serif text-[18px] sm:text-[21px] font-bold text-[#2b241d]">
              {filterQuery ? (
                filteredChildren.length > 0 ? (
                  isHindi
                    ? `खोज परिणाम: ${filteredChildren.length} प्रभाग उपलब्ध`
                    : `Search Results: ${filteredChildren.length} Sections Found`
                ) : (
                  isHindi ? "खोज परिणाम" : "Search Results"
                )
              ) : node.badge ? (
                isHindi
                  ? `${node.shortTitle?.hi || node.title?.hi} — ${node.badge}`
                  : `${node.shortTitle?.en || node.title?.en} — ${node.badge}`
              ) : children.length > 0 ? (
                isHindi
                  ? `उपलब्ध प्रभाग एवं रचनाएँ (${children.length})`
                  : `Available Chapters & Sections (${children.length})`
              ) : (
                isHindi ? "उपलब्ध प्रभाग एवं रचनाएँ" : "Available Chapters & Sections"
              )}
            </h2>
          </div>

          {filteredChildren.length > 0 && (
            <span className="text-[12px] text-[#867563] hidden sm:inline">
              {isHindi
                ? "प्रभाग खोलने के लिए कार्ड पर क्लिक करें अथवा सीधे पढ़ना प्रारंभ करें"
                : "Click card to explore chapters or start reading directly"}
            </span>
          )}
        </div>

        {filteredChildren.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredChildren.map((child) => {
              const hasSub = child.children && child.children.length > 0;
              const isLeaf = child.type === "leaf";
              const firstLeaf = isLeaf ? child : getFirstLeafNode(child);
              const cardImg = getNodeCardImage(node, child);
              const termDesc = getTermExplanation(
                child.levelLabel?.en || child.childLevelName?.en || child.type,
                isHindi
              );

              // ==============================================================
              // LEAF CARD: SACRED ILLUMINATED POTHI FOLIO CARD
              // ==============================================================
              if (isLeaf) {
                return (
                  <div
                    key={child.id}
                    onClick={() => onSelectChild(child.id)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-[#ebd8b8] bg-gradient-to-br from-[#fffefc] via-[#fffdfa] to-[#faf4e6] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c88918] hover:shadow-[0_12px_32px_rgba(200,137,24,0.14)] flex flex-col justify-between"
                  >
                    <div>
                      {/* Pothi Folio Header */}
                      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#ebdcc4]/70">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#c88918] px-2.5 py-0.5 text-[10.5px] font-bold text-white uppercase tracking-wider shadow-2xs">
                          <BookOpen size={11} />
                          {isHindi ? child.levelLabel?.hi || "पवित्र ऋचा" : child.levelLabel?.en || "Sacred Verse"}
                        </span>
                        {child.badge && (
                          <span className="rounded-md bg-[#f4e7d0] px-2 py-0.5 text-[10px] font-bold text-[#8a5d14] border border-[#ebd2a0]">
                            {child.badge}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-[15px] sm:text-[16.5px] font-bold text-[#2b241d] group-hover:text-[#c88918] transition-colors leading-snug">
                        {isHindi ? child.title?.hi : child.title?.en}
                      </h3>

                      {/* Sacred Sanskrit Verse Calligraphy */}
                      {child.content?.sanskrit && (
                        <div className="mt-3 rounded-xl border border-[#ebdcc4] bg-[#fffaf0] p-3 text-center shadow-2xs">
                          <p className="font-serif text-[13.5px] sm:text-[14.5px] font-bold text-[#986411] leading-relaxed select-text whitespace-pre-line">
                            {child.content.sanskrit}
                          </p>
                        </div>
                      )}

                      {/* Meaning Essence */}
                      {(child.content?.meaningHi || child.content?.meaningEn) && (
                        <p className="mt-2.5 text-[11.5px] sm:text-[12px] text-[#71614f] line-clamp-2 leading-relaxed">
                          {isHindi
                            ? child.content.meaningHi || child.content.meaningEn
                            : child.content.meaningEn || child.content.meaningHi}
                        </p>
                      )}
                    </div>

                    {/* Folio Footer Action */}
                    <div className="mt-4 pt-3 border-t border-[#ebdcc4]/60 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#867563]">
                        {isHindi ? "विस्तृत भावार्थ एवं पाठ" : "Recitation & Meaning"}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#c88918] group-hover:text-[#986411] transition-colors">
                        <span>{isHindi ? "पाठ पढ़ें" : "Read & Recite"}</span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbf5e7] text-[#9b6811] transition-all group-hover:translate-x-1 group-hover:bg-[#c88918] group-hover:text-white">
                          <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // ==============================================================
              // CONTAINER CARD: CHAPTER / CANTO / PRAKARANA EXPLORER
              // ==============================================================
              return (
                <div
                  key={child.id}
                  onClick={() => onSelectChild(child.id)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-[#ebdcc4] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#c88918] hover:shadow-[0_8px_24px_rgba(200,137,24,0.12)] flex flex-col justify-between"
                >
                  {/* Card Thumbnail Image Banner (Clear 16:9 Aspect Ratio) */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[#ebdcc4] bg-[#fbf5e7]">
                    <img
                      src={cardImg}
                      alt={child.title?.en}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 filter brightness-[0.93]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 flex-wrap max-w-[75%]">
                      <span className="rounded-md bg-[#c88918] px-2 py-0.5 text-[9.5px] font-bold text-white uppercase tracking-wider shadow-2xs">
                        {isHindi ? child.levelLabel?.hi || "अध्याय" : child.levelLabel?.en || "Chapter"}
                      </span>
                      {termDesc && (
                        <span className="rounded-md bg-black/65 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-medium text-[#faedd8]">
                          {termDesc.includes("·") ? termDesc.split("·")[1].trim() : termDesc}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {child.badge ? (
                        <span className="rounded-md bg-black/65 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-medium text-[#faedd8]">
                          {child.badge}
                        </span>
                      ) : hasSub ? (
                        <span className="rounded-md bg-black/65 backdrop-blur-xs px-2 py-0.5 text-[9.5px] font-medium text-[#faedd8]">
                          {child.children.length}{" "}
                          {isHindi ? child.childLevelName?.hi || "अध्याय" : child.childLevelName?.en || "Chapters"}
                        </span>
                      ) : null}
                    </div>

                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="font-serif text-[13.5px] sm:text-[14px] font-bold text-white drop-shadow-sm truncate">
                        {child.sanskrit}
                      </p>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-[15px] sm:text-[16px] font-bold text-[#2b241d] transition-colors group-hover:text-[#c88918] line-clamp-2 leading-snug">
                        {isHindi ? child.title?.hi : child.title?.en}
                      </h3>

                      {child.tagline && (
                        <p className="mt-1 text-[11.5px] text-[#71614f] line-clamp-2 leading-snug">
                          {isHindi ? child.tagline?.hi : child.tagline?.en}
                        </p>
                      )}

                      {child.desc && !child.tagline && (
                        <p className="mt-1 text-[11.5px] text-[#71614f] line-clamp-2 leading-snug">
                          {isHindi ? child.desc?.hi : child.desc?.en}
                        </p>
                      )}
                    </div>

                    {/* Dual Action Footer: Direct Reading Quick-Button + Explore Section Button */}
                    <div className="mt-3 pt-2.5 border-t border-[#ebdcc4]/60 flex items-center justify-between gap-2">
                      {firstLeaf && firstLeaf.id !== child.id ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectChild(firstLeaf.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#ebd2a0] bg-[#faf5ec] px-2.5 py-1 text-[11px] font-semibold text-[#8b5e15] hover:bg-[#c88918] hover:text-white transition cursor-pointer"
                          title={isHindi ? "सीधे प्रथम श्लोक/मंत्र से पढ़ना प्रारंभ करें" : "Read from verse 1 directly"}
                        >
                          <Sparkles size={11} className="text-[#c88918]" />
                          <span>{isHindi ? "प्रारंभ से पढ़ें ✦" : "Read Verse 1 ✦"}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-medium text-[#867563]">
                          {isHindi ? "मूल पाठ" : "Canonical Text"}
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#c88918] group-hover:text-[#986411] transition-colors ml-auto">
                        <span>{isHindi ? "प्रभाग देखें" : "Explore Section"}</span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fbf5e7] text-[#9b6811] transition-all group-hover:translate-x-1 group-hover:bg-[#c88918] group-hover:text-white">
                          <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : filterQuery ? (
          /* Search Empty State */
          <div className="rounded-3xl border border-[#ebd8b8] bg-white p-8 sm:p-12 text-center shadow-xs max-w-[600px] mx-auto">
            <Search size={36} className="mx-auto text-[#c88918] mb-3 opacity-60" />
            <h3 className="font-serif text-[17px] sm:text-[19px] font-bold text-[#2b241d]">
              {isHindi ? `"${filterQuery}" के लिए कोई प्रभाग नहीं मिला` : `No sections found for "${filterQuery}"`}
            </h3>
            <p className="mt-1.5 text-[13px] text-[#71614f] max-w-[420px] mx-auto leading-relaxed">
              {isHindi
                ? "कृपया कोई अन्य नाम, संख्या या शब्द लिखकर देखें, या सभी प्रभाग देखने के लिए खोज साफ़ करें।"
                : "Try searching with a different name or number, or clear the search to view all available sections."}
            </p>
            <button
              type="button"
              onClick={() => setFilterQuery("")}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#c88918] px-5 py-2.5 text-[12.5px] font-bold text-white shadow-xs hover:bg-[#b07817] transition cursor-pointer"
            >
              {isHindi ? "सभी प्रभाग देखें (Clear Search)" : "Show All Sections"}
            </button>
          </div>
        ) : (
          /* Content Coming Soon Empty State */
          <div className="rounded-3xl border border-[#ebd8b8] bg-white p-8 sm:p-12 text-center shadow-xs max-w-[600px] mx-auto">
            <BookOpen size={36} className="mx-auto text-[#c88918] mb-3 opacity-60" />
            <h3 className="font-serif text-[17px] sm:text-[19px] font-bold text-[#2b241d]">
              {isHindi ? "इस प्रभाग की सामग्री संकलित की जा रही है" : "Content Coming Soon for this Section"}
            </h3>
            <p className="mt-1.5 text-[13px] text-[#71614f] max-w-[440px] mx-auto leading-relaxed">
              {isHindi
                ? "इस पावन ग्रंथ के श्लोक एवं प्रामाणिक व्याख्याएँ पारंपरिक पांडुलिपियों से संकलित की जा रही हैं। कृपया अन्य उपलब्ध शाखाओं का अध्ययन करें।"
                : "Verses and authentic commentaries for this sacred text are currently being transcribed from traditional manuscripts. Please explore the other available sections."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryNodeExplorer;
