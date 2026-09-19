import { useState, useMemo } from "react";
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  BookOpen,
  Scroll,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import LanguageSwitcher from "./LanguageSwitcher";
import { searchHierarchy } from "../data/vedaHierarchyData";
import templeHeroBg from "../../assets/images/veda_library_hero_temple.jpg";

const LibraryHero = ({ searchQuery, setSearchQuery, onSelectNode }) => {
  const { isHindi } = useLibraryLanguage();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Live suggestions from hierarchy
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    return searchHierarchy(searchQuery).slice(0, 7);
  }, [searchQuery]);

  const handleSelectSuggestion = (node) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    if (onSelectNode) {
      onSelectNode(node.id);
    } else {
      navigate(`/library?node=${node.id}`);
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#ebdcc0] bg-[#1a140e] py-12 sm:py-16 lg:py-20">
      {/* =========================================================
          FULL-BLEED SACRED TEMPLE ARCHITECTURE BACKGROUND
          - Radiant golden sunrise over ancient carved stone temples & river ghats
          - Direct, beautiful, vibrant view of the sacred mandir
          - No heavy black overlay box; open, natural, and divine
      ========================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Full-bleed Majestic Temple Sunrise Image */}
        <img
          src={templeHeroBg}
          alt="Ancient Sacred Vedic Temple Architecture at Golden Sunrise"
          className="h-full w-full object-cover object-[center_35%] filter brightness-[0.98] contrast-[1.04]"
        />

        {/* Soft natural bottom gradient for smooth transition into page content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-[#161009]/80" />

        {/* Subtle ambient warm golden solar rays */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-[#f8d795]/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Open, unboxed sanctuary layout — mandir is 100% visible and unhindered */}
        <div className="relative mx-auto max-w-[1080px]">
          {/* Top Row: Sacred Knowledge badge + Language Switcher */}
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="hidden sm:block sm:w-[150px]" />

            {/* Sacred Knowledge Repository ✦ सनातन ज्ञानकोष */}
            <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-amber-300/30 bg-black/20 backdrop-blur-[2px] px-4 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
              <span className="flex h-2 w-2 rounded-full bg-[#f5b335] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fde047]">
                Sacred Knowledge Repository
              </span>
              <span className="text-[#f5b335]">✦</span>
              <span className="font-serif text-[12.5px] font-medium text-[#fef3c7]">
                सनातन ज्ञानकोष
              </span>
            </div>

            {/* English / हिन्दी Toggle */}
            <div className="flex items-center  justify-center sm:justify-end sm:w-[150px]">
              <LanguageSwitcher
                variant="default"
                className="shadow-sm bg-black/10  border border-amber-300/30 text-white rounded-full px-1 hover:bg-black/25 transition"
              />
            </div>
          </div>

          {/* Hero Main Titles */}
          <div className="mt-8 text-center sm:mt-10">
            <h1 className="font-serif text-[34px] leading-[1.12] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] sm:text-[48px] lg:text-[58px] font-bold">
              {isHindi ? (
                <>
                  वेद पुस्तकालय{" "}
                  <span className="text-[#f5b335] drop-shadow-[0_2px_10px_rgba(245,179,53,0.5)]">
                    ·
                  </span>{" "}
                  शाश्वत ज्ञानगंगा
                </>
              ) : (
                <>
                  The Vedic Library{" "}
                  <span className="text-[#f5b335] drop-shadow-[0_2px_10px_rgba(245,179,53,0.5)]">
                    ·
                  </span>{" "}
                  Eternal Wisdom
                </>
              )}
            </h1>

            <p className="mx-auto mt-4 max-w-[820px] text-[15.5px] leading-relaxed text-[#fdf8ee] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-[17px] font-normal">
              Explore the authentic architecture of Vedic literature — from the
              four primordial Vedas and six Vedangas to philosophical Darshanas,
              epic Itihasas, daily Dharma, and sacred Yagya rituals.
            </p>

            {/* Sacred Sanskrit Verse: Floating Sacred Shloka Ribbon */}
            <div className="mx-auto mt-6 max-w-[700px] rounded-2xl border border-amber-300/25 bg-black/5  p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-amber-300/40 hover:bg-black/20">
              <p className="font-serif text-[21px] sm:text-[25px] font-bold text-[#fef9c3] tracking-wide leading-snug drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]">
                <span className="inline-block text-[#f5b335] text-[18px] sm:text-[22px] drop-shadow-[0_0_8px_rgba(245,179,53,0.7)] mr-2 select-none">
                  ✦
                </span>
                आ नो भद्राः क्रतवो यन्तु विश्वतः
                <span className="inline-block text-[#f5b335] text-[18px] sm:text-[22px] drop-shadow-[0_0_8px_rgba(245,179,53,0.7)] ml-2 select-none">
                  ✦
                </span>
              </p>
              <p className="mt-1.5 font-serif text-[14.5px] sm:text-[15.5px] font-medium leading-relaxed text-[#fdf8ee] drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                {isHindi ? (
                  <>
                    <span>“हमारे पास सब ओर से कल्याणकारी विचार आएँ।”</span>
                    <span className="ml-2 inline-block font-sans text-[13px] sm:text-[14px] font-semibold tracking-wider text-[#fde047]">
                      — ऋग्वेद १.८९.१
                    </span>
                  </>
                ) : (
                  <>
                    <span className="italic">
                      “Let noble thoughts come to us from every side.”
                    </span>
                    <span className="ml-2 inline-block not-italic font-sans text-[13px] sm:text-[14px] font-semibold tracking-wider text-[#fde047]">
                      — Rigveda 1.89.1
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Ultra-Luxury Search Bar with Live Hierarchy Dropdown */}
          <div className="relative mx-auto mt-8 max-w-[720px] sm:mt-10">
            <div className="group relative flex items-center rounded-full bg-white/95 p-2 sm:p-2.5 shadow-[0_16px_45px_rgba(0,0,0,0.3)] ring-2 ring-amber-400/50 backdrop-blur-md transition-all duration-300 hover:ring-amber-400 focus-within:ring-2 focus-within:ring-amber-500">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f2ea] text-[#6d5b48] transition-all duration-300 group-focus-within:bg-[#2b241d] group-focus-within:text-[#f3dfb9]">
                <Search size={18} strokeWidth={2.2} />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => setIsSearchFocused(false), 250);
                }}
                placeholder={
                  isHindi
                    ? "ऋग्वेद, गायत्री मंत्र, योग सूत्र, रामायण, १६ संस्कार खोजें..."
                    : "Search Rigveda, Gayatri Mantra, Yoga Sutra, Ramayana, 16 Samskaras..."
                }
                className="w-full bg-transparent px-3 sm:px-4 text-[14px] sm:text-[15.5px] text-[#241c14] placeholder:text-[#8a7968] placeholder:font-normal outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#9c8b7b] hover:bg-[#f0e7d8] hover:text-[#241c14] transition cursor-pointer mr-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && (
              suggestions.length > 0 ? (
                <div className="absolute left-0 right-0 top-full mt-2 z-40 overflow-hidden rounded-2xl border border-[#ebd2a0] bg-white text-[#2b241d] shadow-[0_20px_50px_rgba(0,0,0,0.35)] animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="p-2 divide-y divide-[#f4ede2]">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        onMouseDown={() => handleSelectSuggestion(item)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[#faf4e6] cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fbf5e7] text-[#c88918] shrink-0 font-serif text-[12px] font-bold border border-[#edd7af]">
                            ॐ
                          </div>
                          <div>
                            <p className="font-serif text-[14px] font-semibold text-[#2b241d]">
                              {isHindi ? item.title?.hi : item.title?.en}
                            </p>
                            <p className="text-[11px] text-[#867563]">
                              {item.sanskrit || item.levelLabel?.en} •{" "}
                              {item.tagline?.en || item.desc?.en?.slice(0, 60)}...
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-[#c88918] shrink-0 ml-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim().length >= 2 ? (
                <div className="absolute left-0 right-0 top-full mt-2 z-40 overflow-hidden rounded-2xl border border-[#ebd2a0] bg-white text-[#2b241d] shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-5 text-center">
                  <p className="text-[13.5px] font-medium text-[#7d6f5f]">
                    {isHindi
                      ? `"${searchQuery}" के लिए कोई ग्रंथ या मंत्र नहीं मिला।`
                      : `No scriptures or verses found matching "${searchQuery}".`}
                  </p>
                  <p className="mt-2 text-[11.5px] text-[#9c8b7b]">
                    {isHindi
                      ? "सुझाव: नीचे दिए गए लोकप्रिय विषयों पर क्लिक करें:"
                      : "Quick suggestions: click any topic to search:"}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {["Rigveda", "Ramayana", "Gayatri Mantra", "Gita", "Upanishad"].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={() => setSearchQuery(suggestion)}
                        className="rounded-full border border-[#ebd2a0] bg-[#faf5ec] px-3 py-1 text-[11px] font-semibold text-[#8b5e15] hover:bg-[#c88918] hover:text-white transition cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryHero;
