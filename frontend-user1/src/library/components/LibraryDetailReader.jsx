import { useState, useMemo, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  Share2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Scroll,
  Feather,
  Sun,
  Flame,
  ChevronLeft,
  ChevronRight,
  Search,
  Grid,
  List,
  X,
  Layers,
} from "lucide-react";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import { getAdjacentLeafNodes, getAllLeafNodes } from "../data/vedaHierarchyData";

const LibraryDetailReader = ({ node, path = [], onSelectNode }) => {
  const { isHindi } = useLibraryLanguage();
  const [copied, setCopied] = useState(false);
  const [activeMeaningTab, setActiveMeaningTab] = useState(isHindi ? "hi" : "en");
  const [numberFilter, setNumberFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const beadStripRef = useRef(null);

  if (!node) return null;

  const content = node.content || {};

  // Compute sequential previous/next and the full list of leaves for number selector
  const adjacent = useMemo(() => {
    return getAdjacentLeafNodes(node.id);
  }, [node.id]);

  const { prev, next, currentIndex, total, leaves = [] } = adjacent;

  // Auto scroll the horizontal bead strip to the active verse
  useEffect(() => {
    if (beadStripRef.current) {
      const activeEl = beadStripRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [node.id]);

  const handleCopyText = () => {
    let textToCopy = "";
    if (content.sanskrit) textToCopy += `${content.sanskrit}\n\n`;
    if (content.transliteration) textToCopy += `${content.transliteration}\n\n`;
    if (content.meaningHi) textToCopy += `हिन्दी भावार्थ: ${content.meaningHi}\n\n`;
    if (content.meaningEn) textToCopy += `English Translation: ${content.meaningEn}\n\n`;
    if (content.overview) textToCopy += `Overview: ${content.overview}\n\n`;

    navigator.clipboard.writeText(textToCopy.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigateVerse = (targetId) => {
    if (!targetId || !onSelectNode) return;
    onSelectNode(targetId);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // Filter leaves for the quick number search
  const indexedLeaves = useMemo(() => {
    return leaves.map((leaf, i) => ({ leaf, index: i + 1 }));
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    if (!numberFilter.trim()) return indexedLeaves;
    const q = numberFilter.toLowerCase().trim();
    return indexedLeaves.filter(({ leaf, index }) => {
      const matchIndex = String(index) === q || String(index).includes(q);
      const matchTitle =
        leaf.title?.en?.toLowerCase().includes(q) ||
        leaf.title?.hi?.toLowerCase().includes(q) ||
        leaf.shortTitle?.en?.toLowerCase().includes(q) ||
        leaf.shortTitle?.hi?.toLowerCase().includes(q) ||
        leaf.sanskrit?.toLowerCase().includes(q);
      return matchIndex || matchTitle;
    });
  }, [indexedLeaves, numberFilter]);

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8">
      {/* ============================================================== */}
      {/* MAIN LEFT/CENTER DEVOTIONAL READING ARTICLE                   */}
      {/* ============================================================== */}
      <article className="flex-1 min-w-0 w-full rounded-3xl border-2 border-[#ebd8b8] bg-[#fffdfa] p-6 sm:p-10 shadow-[0_12px_40px_rgba(90,65,25,0.06)]">
        {/* Top Meta Bar: Back to Parent, Level Tag, Mobile Number Jump Toggle & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdcc4] pb-5 mb-6">
          <div className="flex items-center gap-2.5 flex-wrap">
            {path.length > 1 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ebd2a0] bg-[#fffcf5] px-3.5 py-1.5 text-[11.5px] font-semibold text-[#8b5e15]">
                <BookOpen size={12} className="text-[#c88918]" />
                <span>{isHindi ? path[path.length - 2].shortTitle?.hi || path[path.length - 2].title?.hi : path[path.length - 2].shortTitle?.en || path[path.length - 2].title?.en}</span>
              </span>
            )}

            <span className="rounded-full bg-[#f6ecd7] px-3.5 py-1.5 text-[11px] font-mono font-bold tracking-wider text-[#986411] border border-[#ebd2a0] uppercase">
              {isHindi ? node.levelLabel?.hi || "पवित्र ऋचा" : node.levelLabel?.en || "Sacred Verse"}
            </span>

            <span className="text-[#c88918] hidden sm:inline">•</span>

            <span className="font-serif text-[13px] font-semibold text-[#665442] hidden sm:inline">
              {node.sanskrit || node.title?.hi}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Button to Toggle Verse Numbers Grid Drawer */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden cursor-pointer inline-flex items-center gap-1.5 min-h-[44px] rounded-xl border border-[#c88918] bg-[#fff8eb] px-3.5 py-2 text-[12px] font-bold text-[#8f5d0a] hover:bg-[#c88918] hover:text-white transition shadow-2xs"
              title="सभी क्रमांक देखें"
            >
              <Grid size={14} />
              <span>{isHindi ? `क्रमांक 1-${total}` : `Verses 1-${total}`}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="cursor-pointer inline-flex items-center gap-1.5 min-h-[44px] rounded-xl border border-[#e2cca4] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#68533e] transition hover:border-[#c88918] hover:text-[#c88918] shadow-2xs"
              title="Copy verse and meanings"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-600" />
                  <span className="text-green-700">{isHindi ? "कॉपी हुआ" : "Copied"}</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>{isHindi ? "कॉपी" : "Copy"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="cursor-pointer inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-[#e2cca4] bg-white text-[#68533e] transition hover:border-[#c88918] hover:text-[#c88918] shadow-2xs"
              title="Share verse link"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* HORIZONTAL QUICK SCROLL BEAD STRIP (All Verses 1 to N)          */}
        {/* ============================================================== */}
        <div className="mb-6 rounded-2xl border border-[#ecd8b8] bg-[#fbf6ea]/90 p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-2 px-1 text-[11px] font-bold text-[#8d6722]">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#c88918]" />
              <span>{isHindi ? "मंत्र क्रमांक चयन (Direct Verse Jump)" : "Direct Verse Jump Strip"}</span>
            </div>
            <span className="font-mono text-[#986411]">
              {currentIndex > 0 ? currentIndex : 1} / {total}
            </span>
          </div>

          <div
            ref={beadStripRef}
            className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin scrollbar-thumb-[#ebd6b0] scroll-smooth"
          >
            {indexedLeaves.map(({ leaf, index }) => {
              const isActive = leaf.id === node.id;
              return (
                <button
                  key={leaf.id}
                  type="button"
                  data-active={isActive ? "true" : "false"}
                  onClick={() => handleNavigateVerse(leaf.id)}
                  title={isHindi ? `${index}. ${leaf.title?.hi || leaf.shortTitle?.hi}` : `${index}. ${leaf.title?.en || leaf.shortTitle?.en}`}
                  className={`cursor-pointer shrink-0 flex h-8 min-w-[34px] px-2 items-center justify-center rounded-lg text-[12px] font-mono font-bold transition-all ${
                    isActive
                      ? "bg-[#c88918] text-white shadow-md ring-2 ring-[#e8cca0] scale-105"
                      : "border border-[#e5cdab] bg-white text-[#685542] hover:border-[#c88918] hover:bg-[#faedd4] hover:text-[#2b241d]"
                  }`}
                >
                  {index < 10 ? `0${index}` : index}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SRIMANDIR-STYLE TOP SEQUENTIAL NAVIGATION BAR (Prev / Next)     */}
        {/* ============================================================== */}
        <div className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-[#ebd8b8] bg-[#fbf5e7]/80 p-3 sm:p-4">
          {/* Previous Mantra Button */}
          {prev ? (
            <button
              type="button"
              onClick={() => handleNavigateVerse(prev.id)}
              className="group cursor-pointer flex items-center gap-2 rounded-xl border border-[#ebd2a0] bg-white px-3 sm:px-4 py-2 text-left transition-all hover:bg-[#c88918] hover:text-white shadow-2xs"
              title={isHindi ? prev.title?.hi : prev.title?.en}
            >
              <ChevronLeft size={16} className="shrink-0 transition-transform group-hover:-translate-x-1" />
              <div className="hidden sm:block text-left">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#986411] group-hover:text-white/90">
                  {isHindi ? "पिछला मंत्र" : "Previous Verse"}
                </span>
                <span className="block font-serif text-[12px] font-semibold text-[#2b241d] group-hover:text-white truncate max-w-[130px] md:max-w-[200px]">
                  {isHindi ? prev.shortTitle?.hi || prev.title?.hi : prev.shortTitle?.en || prev.title?.en}
                </span>
              </div>
              <span className="sm:hidden font-serif text-[12px] font-bold text-[#8c5e15]">
                {isHindi ? "पिछला" : "Prev"}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-[#ebd2a0]/40 bg-[#faf6ed]/40 px-3 sm:px-4 py-2 text-[12px] text-[#b09e8c] cursor-not-allowed opacity-60">
              <ChevronLeft size={16} />
              <span className="text-[11px] font-medium">{isHindi ? "आरंभिक मंत्र" : "First Verse"}</span>
            </div>
          )}

          {/* Center Progress Counter */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11.5px] font-mono font-bold text-[#986411] border border-[#ebd2a0] shadow-2xs">
              <Sparkles size={12} className="text-[#c88918]" />
              <span>
                {isHindi
                  ? `मंत्र ${currentIndex > 0 ? currentIndex : 1} / ${total > 0 ? total : 1}`
                  : `Verse ${currentIndex > 0 ? currentIndex : 1} of ${total > 0 ? total : 1}`}
              </span>
            </span>
          </div>

          {/* Next Mantra Button */}
          {next ? (
            <button
              type="button"
              onClick={() => handleNavigateVerse(next.id)}
              className="group cursor-pointer flex items-center justify-end gap-2 rounded-xl border border-[#ebd2a0] bg-white px-3 sm:px-4 py-2 text-right transition-all hover:bg-[#c88918] hover:text-white shadow-2xs"
              title={isHindi ? next.title?.hi : next.title?.en}
            >
              <div className="hidden sm:block text-right">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-[#986411] group-hover:text-white/90">
                  {isHindi ? "अगला मंत्र" : "Next Verse"}
                </span>
                <span className="block font-serif text-[12px] font-semibold text-[#2b241d] group-hover:text-white truncate max-w-[130px] md:max-w-[200px]">
                  {isHindi ? next.shortTitle?.hi || next.title?.hi : next.shortTitle?.en || next.title?.en}
                </span>
              </div>
              <span className="sm:hidden font-serif text-[12px] font-bold text-[#8c5e15]">
                {isHindi ? "अगला" : "Next"}
              </span>
              <ChevronRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-[#ebd2a0]/40 bg-[#faf6ed]/40 px-3 sm:px-4 py-2 text-[12px] text-[#b09e8c] cursor-not-allowed opacity-60">
              <span className="text-[11px] font-medium">{isHindi ? "अंतिम मंत्र" : "Last Verse"}</span>
              <ChevronRight size={16} />
            </div>
          )}
        </div>

        {/* Main Scripture Heading */}
        <div className="text-center max-w-[780px] mx-auto mb-8">
          <h1 className="font-serif text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-[#2b241d] leading-tight">
            {isHindi ? node.title?.hi : node.title?.en}
          </h1>
          {node.tagline && (
            <p className="mt-2 text-[14px] sm:text-[15px] font-medium text-[#c88918]">
              {isHindi ? node.tagline?.hi : node.tagline?.en}
            </p>
          )}
        </div>

        {/* ============================================================== */}
        {/* SACRED SANSKRIT DEVANAGARI ALTAR (Sri Mandir Large Typography)  */}
        {/* ============================================================== */}
        {content.sanskrit && (
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#e6d0a7] bg-gradient-to-b from-[#fbf5e7] via-[#fffdf9] to-[#faf3e3] p-4 sm:p-8 lg:p-10 shadow-sm text-center mb-6 sm:mb-8">
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-36 w-72 rounded-full bg-[#f8d795]/30 blur-2xl" />

            <p className="relative font-serif text-[20px] sm:text-[28px] lg:text-[34px] leading-[1.7] sm:leading-[1.8] tracking-normal text-[#7d4808] whitespace-pre-line font-medium select-text drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] break-words">
              {content.sanskrit}
            </p>

            {content.padapatha && (
              <div className="mt-5 pt-4 border-t border-[#ebdcc4]/80 text-[12.5px] sm:text-[14px] text-[#866948] font-serif break-words">
                <span className="font-bold text-[#b07817] uppercase tracking-wider text-[11px] block mb-1">
                  {isHindi ? "पदपाठ (Padapatha)" : "Padapatha Analysis"}
                </span>
                {content.padapatha}
              </div>
            )}
          </div>
        )}

        {/* Roman Transliteration (IAST) */}
        {content.transliteration && (
          <div className="mb-6 sm:mb-8 rounded-2xl border border-[#ebdcc4] bg-[#faf6ed]/70 p-3.5 sm:p-5 text-center">
            <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#9b6811] block mb-1">
              Roman Transliteration (IAST)
            </span>
            <p className="font-mono text-[13px] sm:text-[15px] text-[#544637] leading-relaxed italic whitespace-pre-line break-words">
              {content.transliteration}
            </p>
          </div>
        )}

        {/* Vedic Canonical Metadata (2x2 grid on mobile) */}
        {content.metadata && (
          <div className="mb-6 sm:mb-8 rounded-2xl border border-[#ebdcc4] bg-[#fffdf9] p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 text-[11px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#986411]">
              <Feather size={14} />
              <span>{isHindi ? "वैदिक विहित उपाधियाँ एवं लक्षण" : "Vedic Canonical Metadata"}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {content.metadata.rishi && (
                <div className="rounded-xl border border-[#ebdcc4] bg-[#fbf5e7] p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#9b6811] block">
                    {isHindi ? "ऋषि (Seer)" : "Rishi (Seer)"}
                  </span>
                  <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[#2b241d] mt-0.5 block truncate">
                    {content.metadata.rishi}
                  </span>
                </div>
              )}

              {content.metadata.devata && (
                <div className="rounded-xl border border-[#ebdcc4] bg-[#fbf5e7] p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#9b6811] block">
                    {isHindi ? "देवता (Divinity)" : "Devata (Deity)"}
                  </span>
                  <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[#2b241d] mt-0.5 block truncate">
                    {content.metadata.devata}
                  </span>
                </div>
              )}

              {content.metadata.chandas && (
                <div className="rounded-xl border border-[#ebdcc4] bg-[#fbf5e7] p-2.5 sm:p-3">
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#9b6811] block">
                    {isHindi ? "छन्द (Metre)" : "Chandas (Metre)"}
                  </span>
                  <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[#2b241d] mt-0.5 block truncate">
                    {content.metadata.chandas}
                  </span>
                </div>
              )}

              {content.metadata.source && (
                <div className="rounded-xl border border-[#ebdcc4] bg-[#fbf5e7] p-2.5 sm:p-3 col-span-2 sm:col-span-1">
                  <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#9b6811] block">
                    {isHindi ? "मूल स्रोत (Source)" : "Scriptural Source"}
                  </span>
                  <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#2b241d] mt-0.5 block truncate" title={content.metadata.source}>
                    {content.metadata.source}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* EXEGESIS / MEANING (Hindi & English Tabs)                      */}
        {/* ============================================================== */}
        {(content.meaningHi || content.meaningEn) && (
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-[#ebdcc4] pb-2 mb-4">
              <h3 className="font-serif text-[18px] font-bold text-[#2b241d] flex items-center gap-2">
                <Scroll size={16} className="text-[#c88918]" />
                <span>{isHindi ? "प्रामाणिक अर्थ एवं व्याख्या" : "Authoritative Exegesis & Meaning"}</span>
              </h3>

              {/* Language Switch Tabs */}
              <div className="inline-flex rounded-lg border border-[#e2cca4] bg-[#faf3e3] p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveMeaningTab("hi")}
                  className={`cursor-pointer px-3 py-1 rounded-md transition ${
                    activeMeaningTab === "hi"
                      ? "bg-[#c88918] text-white shadow-xs"
                      : "text-[#6d5b48] hover:text-[#2b241d]"
                  }`}
                >
                  हिन्दी भावार्थ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMeaningTab("en")}
                  className={`cursor-pointer px-3 py-1 rounded-md transition ${
                    activeMeaningTab === "en"
                      ? "bg-[#c88918] text-white shadow-xs"
                      : "text-[#6d5b48] hover:text-[#2b241d]"
                  }`}
                >
                  English Translation
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ebdcc4] bg-[#fffdfa] p-6 text-[15px] sm:text-[16px] leading-relaxed text-[#3a3025]">
              {activeMeaningTab === "hi" && (
                <p className="font-serif leading-[1.8] text-[#2b241d]">
                  {content.meaningHi || "इस मंत्र का हिन्दी भावार्थ शीघ्र अद्यतित किया जाएगा।"}
                </p>
              )}

              {activeMeaningTab === "en" && (
                <p className="leading-relaxed text-[#3f3529]">
                  {content.meaningEn || "English translation for this sacred revelation will be appended shortly."}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Special: Samskara / Puja Procedure & Steps */}
        {content.procedure && (
          <div className="mb-8 rounded-2xl border border-[#ebdcc4] bg-[#fffbf4] p-6">
            <h3 className="font-serif text-[18px] font-bold text-[#2b241d] mb-4 flex items-center gap-2">
              <Flame size={17} className="text-[#c88918]" />
              <span>{isHindi ? "पारंपरिक वैदिक विधि एवं अनुष्ठान क्रम" : "Traditional Vedic Procedure & Vidhi"}</span>
            </h3>

            <ol className="space-y-3">
              {content.procedure.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c88918] font-mono text-[11px] font-bold text-white mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[14px] sm:text-[15px] text-[#4b3d2f] leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Special: Required Sacred Samagri / Materials */}
        {content.materials && (
          <div className="mb-8 rounded-2xl border border-[#ebdcc4] bg-[#fffdfa] p-6">
            <h3 className="font-serif text-[16px] font-bold text-[#2b241d] mb-3 flex items-center gap-2">
              <Sun size={15} className="text-[#c88918]" />
              <span>{isHindi ? "आवश्यक पवित्र सामग्री (Samagri)" : "Prescribed Sacred Samagri / Materials"}</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {content.materials.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-lg border border-[#ebd2a0] bg-[#fbf5e7] px-3 py-1 text-[12px] font-medium text-[#7d4808]"
                >
                  • {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Special: Significance Note */}
        {content.significance && (
          <div className="rounded-2xl border border-[#ebd2a0] bg-gradient-to-r from-[#fbf4e5] to-[#fffcf7] p-5 sm:p-6 mb-8">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#986411] mb-2">
              <Sparkles size={14} />
              <span>{isHindi ? "आध्यात्मिक एवं दार्शनिक महत्त्व" : "Metaphysical & Spiritual Significance"}</span>
            </div>
            <p className="text-[14px] leading-relaxed text-[#5a4a39]">
              {content.significance}
            </p>
          </div>
        )}

        {/* ============================================================== */}
        {/* SRIMANDIR-STYLE BOTTOM SEQUENTIAL BAR (Prev / Next at end)     */}
        {/* ============================================================== */}
        <div className="my-8 flex items-center justify-between gap-3 rounded-2xl border border-[#ebd8b8] bg-gradient-to-r from-[#fbf5e7] via-[#fffdf9] to-[#faf3e3] p-4 sm:p-5 shadow-xs">
          {prev ? (
            <button
              type="button"
              onClick={() => handleNavigateVerse(prev.id)}
              className="group cursor-pointer flex items-center gap-2 rounded-xl border border-[#ebd2a0] bg-white px-4 py-2.5 text-left transition-all hover:bg-[#c88918] hover:text-white shadow-2xs"
              title={isHindi ? prev.title?.hi : prev.title?.en}
            >
              <ChevronLeft size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
              <div>
                <span className="block text-[10.5px] uppercase font-bold tracking-wider text-[#986411] group-hover:text-white/90">
                  {isHindi ? "← पिछला मंत्र" : "← Previous Verse"}
                </span>
                <span className="block font-serif text-[13px] font-semibold text-[#2b241d] group-hover:text-white truncate max-w-[130px] md:max-w-[200px]">
                  {isHindi ? prev.shortTitle?.hi || prev.title?.hi : prev.shortTitle?.en || prev.title?.en}
                </span>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-[#ebd2a0]/40 bg-[#faf6ed]/40 px-4 py-2.5 text-[12px] text-[#b09e8c] cursor-not-allowed opacity-60">
              <ChevronLeft size={18} />
              <span className="text-[11px] font-medium">{isHindi ? "आरंभिक मंत्र" : "First Verse"}</span>
            </div>
          )}

          <div className="text-center hidden sm:block">
            <span className="block font-serif text-[12px] text-[#867563]">
              {isHindi ? "स्वाध्याय क्रम" : "Recitation Order"}
            </span>
            <span className="font-mono text-[12px] font-bold text-[#c88918]">
              {currentIndex > 0 ? currentIndex : 1} / {total > 0 ? total : 1}
            </span>
          </div>

          {next ? (
            <button
              type="button"
              onClick={() => handleNavigateVerse(next.id)}
              className="group cursor-pointer flex items-center justify-end gap-2 rounded-xl border border-[#ebd2a0] bg-white px-4 py-2.5 text-right transition-all hover:bg-[#c88918] hover:text-white shadow-2xs"
              title={isHindi ? next.title?.hi : next.title?.en}
            >
              <div className="text-right">
                <span className="block text-[10.5px] uppercase font-bold tracking-wider text-[#986411] group-hover:text-white/90">
                  {isHindi ? "अगला मंत्र →" : "Next Verse →"}
                </span>
                <span className="block font-serif text-[13px] font-semibold text-[#2b241d] group-hover:text-white truncate max-w-[130px] md:max-w-[200px]">
                  {isHindi ? next.shortTitle?.hi || next.title?.hi : next.shortTitle?.en || next.title?.en}
                </span>
              </div>
              <ChevronRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-[#ebd2a0]/40 bg-[#faf6ed]/40 px-4 py-2.5 text-[12px] text-[#b09e8c] cursor-not-allowed opacity-60">
              <span className="text-[11px] font-medium">{isHindi ? "अंतिम मंत्र" : "Last Verse"}</span>
              <ChevronRight size={18} />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SRIMANDIR-STYLE RECOMMENDED SACRED MANTRAS                      */}
        {/* ============================================================== */}
        <div className="mt-12 pt-8 border-t border-[#ebdcc4]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[#c88918]" />
              <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#2b241d]">
                {isHindi ? "संबंधित वैदिक ग्रंथ एवं महामंत्र" : "Related Scriptures & Sacred Mantras"}
              </h3>
            </div>
            <span className="text-[12px] text-[#867563]">
              {isHindi ? "अनुशंसित स्वाध्याय" : "Recommended Study"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: "rigveda-3-62-10",
                title: { en: "Maha Gayatri Mantra", hi: "महा गायत्री मंत्र" },
                sanskrit: "ऋग्वेद ३.६२.१०",
                desc: { en: "Savitr divine light meditation", hi: "सविता देव की पावन स्तुति" },
              },
              {
                id: "mahamrityunjaya-mantra",
                title: { en: "Maha Mrityunjaya Mantra", hi: "महामृत्युंजय मंत्र" },
                sanskrit: "ऋग्वेद ७.५९.१२",
                desc: { en: "Healing, longevity & immortality", hi: "आरोग्य, दीर्घायु एवं मोक्ष" },
              },
              {
                id: "gita-2-47",
                title: { en: "Bhagavad Gita 2.47", hi: "भगवद्गीता २.४७" },
                sanskrit: "कर्मण्येवाधिकारस्ते",
                desc: { en: "Selfless action without attachment", hi: "निष्काम कर्मयोग का सार" },
              },
            ]
              .filter((item) => item.id !== node.id)
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigateVerse(item.id)}
                  className="group cursor-pointer rounded-2xl border border-[#ebdcc4] bg-[#fffdf9] p-4 transition-all hover:-translate-y-1 hover:border-[#c88918] hover:shadow-[0_8px_20px_rgba(200,137,24,0.1)] flex flex-col justify-between"
                >
                  <div>
                    <span className="rounded-md bg-[#f6ecd7] px-2 py-0.5 text-[9.5px] font-mono font-bold text-[#986411] border border-[#ebd2a0]">
                      {item.sanskrit}
                    </span>
                    <h4 className="font-serif text-[15px] font-bold text-[#2b241d] group-hover:text-[#c88918] transition-colors mt-2">
                      {isHindi ? item.title.hi : item.title.en}
                    </h4>
                    <p className="text-[11.5px] text-[#71614f] mt-1 line-clamp-2">
                      {isHindi ? item.desc.hi : item.desc.en}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#ebdcc4]/60 flex items-center justify-between text-[11px] font-bold text-[#c88918]">
                    <span>{isHindi ? "मंत्र पढ़ें" : "Read Mantra"}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </article>

      {/* ============================================================== */}
      {/* DESKTOP RIGHT-SIDE STICKY NUMBER QUICK-SELECTOR PANEL           */}
      {/* ============================================================== */}
      <aside className="hidden lg:block w-[280px] xl:w-[320px] shrink-0 sticky top-24 self-start">
        <div className="rounded-3xl border-2 border-[#ebd8b8] bg-[#fffdfa] p-5 shadow-[0_12px_40px_rgba(90,65,25,0.06)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ebdcc4] pb-3 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c88918] text-white shadow-xs">
                <Sparkles size={14} />
              </div>
              <div>
                <h3 className="font-serif text-[14px] font-bold text-[#2b241d]">
                  {isHindi ? "मंत्र एवं श्लोक क्रमांक" : "Verse Number Index"}
                </h3>
                <p className="text-[11px] text-[#7d6f5f]">
                  {isHindi ? `कुल ${total} मंत्र (1 - ${total})` : `Total ${total} Verses (1 - ${total})`}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Filter Search */}
          <div className="relative mb-3">
            <input
              type="text"
              value={numberFilter}
              onChange={(e) => setNumberFilter(e.target.value)}
              placeholder={isHindi ? "क्रमांक या नाम से खोजें..." : "Filter verse # or title..."}
              className="w-full rounded-xl border border-[#ebd8b8] bg-[#fffdf9] py-1.5 pl-8 pr-3 text-[12px] text-[#2b241d] placeholder:text-[#9e8f7f] outline-none focus:border-[#c88918] focus:ring-1 focus:ring-[#c88918]"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-[#9e8f7f]" />
          </div>

          {/* View Mode Toggle: Grid of Numbers vs List */}
          <div className="flex items-center justify-between mb-3 text-[11px] font-bold">
            <div className="inline-flex rounded-lg border border-[#e2cca4] bg-[#faf3e3] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`cursor-pointer px-2.5 py-1 rounded-md transition ${
                  viewMode === "grid"
                    ? "bg-[#c88918] text-white shadow-xs"
                    : "text-[#6d5b48] hover:text-[#2b241d]"
                }`}
              >
                {isHindi ? "ग्रिड" : "Grid"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`cursor-pointer px-2.5 py-1 rounded-md transition ${
                  viewMode === "list"
                    ? "bg-[#c88918] text-white shadow-xs"
                    : "text-[#6d5b48] hover:text-[#2b241d]"
                }`}
              >
                {isHindi ? "सूची" : "List"}
              </button>
            </div>

            <span className="font-mono text-[11px] text-[#986411]">
              #{currentIndex > 0 ? currentIndex : 1}
            </span>
          </div>

          {/* Numbers Display (Zero State / Grid / List) */}
          {filteredLeaves.length === 0 ? (
            <div className="py-8 text-center px-2">
              <p className="text-[12px] text-[#867563]">
                {isHindi ? `"${numberFilter}" के लिए कोई मंत्र नहीं मिला` : `No verse found for "${numberFilter}"`}
              </p>
              <button
                type="button"
                onClick={() => setNumberFilter("")}
                className="mt-2 text-[11.5px] font-bold text-[#c88918] hover:underline cursor-pointer"
              >
                {isHindi ? "फ़िल्टर साफ़ करें" : "Clear Filter"}
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#ebd6b0]">
              <div className="grid grid-cols-5 gap-1.5">
                {filteredLeaves.map(({ leaf, index }) => {
                  const isActive = leaf.id === node.id;
                  return (
                    <button
                      key={leaf.id}
                      type="button"
                      onClick={() => handleNavigateVerse(leaf.id)}
                      title={isHindi ? `${index}. ${leaf.title?.hi || leaf.shortTitle?.hi}` : `${index}. ${leaf.title?.en || leaf.shortTitle?.en}`}
                      className={`cursor-pointer flex h-9 w-full items-center justify-center rounded-lg text-[12px] font-mono font-bold transition-all ${
                        isActive
                          ? "bg-[#c88918] text-white shadow-md ring-2 ring-[#ebd2a0] scale-105"
                          : "border border-[#ebd8b8] bg-[#fffcf5] text-[#6d5b48] hover:border-[#c88918] hover:bg-[#faedd4] hover:text-[#2b241d]"
                      }`}
                    >
                      {index < 10 ? `0${index}` : index}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List Mode: Number + Title */
            <div className="max-h-[360px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-[#ebd6b0]">
              {filteredLeaves.map(({ leaf, index }) => {
                const isActive = leaf.id === node.id;
                return (
                  <div
                    key={leaf.id}
                    onClick={() => handleNavigateVerse(leaf.id)}
                    className={`cursor-pointer flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isActive
                        ? "border-[#c88918] bg-[#fdf5e6] shadow-xs"
                        : "border-[#f0e3ce] bg-white hover:border-[#c88918] hover:bg-[#faf4e8]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-mono font-bold ${
                          isActive ? "bg-[#c88918] text-white" : "bg-[#f4e7d0] text-[#8e651e]"
                        }`}
                      >
                        {index}
                      </span>
                      <span
                        className={`truncate text-[11.5px] ${
                          isActive ? "font-bold text-[#7d4808]" : "text-[#4a3f33]"
                        }`}
                      >
                        {isHindi ? leaf.shortTitle?.hi || leaf.title?.hi : leaf.shortTitle?.en || leaf.title?.en}
                      </span>
                    </div>
                    <ChevronRight size={12} className="text-[#a4917e] shrink-0" />
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-3.5 pt-2.5 border-t border-[#ebdcc4] flex items-center justify-between text-[11px] text-[#8a7a6a]">
            <span>{isHindi ? "किसी भी क्रमांक पर क्लिक करें" : "Click number to jump"}</span>
            <span className="font-serif text-[#c88918] font-bold">ॐ</span>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE ALL VERSES NUMBER MODAL / BOTTOM SHEET                  */}
      {/* ============================================================== */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className="relative flex max-h-[85vh] w-full max-w-[500px] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[#ebd8b8] bg-[#fffdfa] shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ebdcc4] bg-[#faf3e3] px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#c88918]" />
                <h3 className="font-serif text-[16px] font-bold text-[#2b241d]">
                  {isHindi ? `सभी मंत्र क्रमांक (1 से ${total})` : `All Verses (1 to ${total})`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="cursor-pointer flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#6d5b48] hover:bg-[#faedd4] transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Search */}
            <div className="p-4 border-b border-[#ebdcc4] bg-[#fffdfa]">
              <div className="relative">
                <input
                  type="text"
                  value={numberFilter}
                  onChange={(e) => setNumberFilter(e.target.value)}
                  placeholder={isHindi ? "क्रमांक या नाम से खोजें..." : "Filter verse # or title..."}
                  className="w-full rounded-xl border border-[#ebd8b8] bg-white py-2.5 pl-9 pr-3 text-[16px] sm:text-[13px] text-[#2b241d] placeholder:text-[#9e8f7f] outline-none focus:border-[#c88918] focus:ring-1 focus:ring-[#c88918]"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-[#9e8f7f]" />
              </div>
            </div>

            {/* Modal Numbers Grid */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[50vh] scrollbar-thin scrollbar-thumb-[#ebd6b0]">
              {filteredLeaves.length === 0 ? (
                <div className="py-8 text-center px-2">
                  <p className="text-[13px] text-[#867563]">
                    {isHindi ? `"${numberFilter}" के लिए कोई मंत्र नहीं मिला` : `No verse found for "${numberFilter}"`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setNumberFilter("")}
                    className="mt-2.5 inline-flex items-center rounded-full bg-[#c88918] px-4 py-1.5 text-[12px] font-bold text-white shadow-xs cursor-pointer"
                  >
                    {isHindi ? "फ़िल्टर साफ़ करें" : "Clear Filter"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {filteredLeaves.map(({ leaf, index }) => {
                    const isActive = leaf.id === node.id;
                    return (
                      <button
                        key={leaf.id}
                        type="button"
                        onClick={() => handleNavigateVerse(leaf.id)}
                        className={`cursor-pointer flex h-11 w-full items-center justify-center rounded-xl text-[13px] font-mono font-bold transition-all ${
                          isActive
                            ? "bg-[#c88918] text-white shadow-md ring-2 ring-[#ebd2a0] scale-105"
                            : "border border-[#ebd8b8] bg-[#fffcf5] text-[#6d5b48] hover:border-[#c88918] hover:bg-[#faedd4] hover:text-[#2b241d]"
                        }`}
                      >
                        {index < 10 ? `0${index}` : index}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#ebdcc4] bg-[#faf3e3] p-3 text-center text-[12px] text-[#7d6f5f]">
              <span>
                {isHindi ? `वर्तमान मंत्र: #${currentIndex > 0 ? currentIndex : 1}` : `Current Verse: #${currentIndex > 0 ? currentIndex : 1}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryDetailReader;
