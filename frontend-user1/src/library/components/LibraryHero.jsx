import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import { useLibraryLanguage } from "../context/useLibraryLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

const LibraryHero = ({ searchQuery, setSearchQuery }) => {
  const { isHindi, t } = useLibraryLanguage();

  return (
    <section className="relative overflow-hidden border-b border-[#ebdcc0] bg-gradient-to-b from-[#fff7e8] via-[#fffbf3] to-[#fffaf0] py-10 sm:py-14">
      {/* Subtle Vedic Sacred Background Patterns */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] select-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vedic-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="14" fill="none" stroke="#8c6a2f" strokeWidth="1.2" />
              <circle cx="30" cy="30" r="4" fill="#8c6a2f" />
              <path d="M30 6 L30 54 M6 30 L54 30" stroke="#8c6a2f" strokeWidth="0.8" strokeDasharray="2,2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vedic-pattern)" />
        </svg>
      </div>

      {/* Decorative Golden Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-[#f8d795]/35 blur-3xl" />
      <div className="pointer-events-none absolute right-4 top-10 h-48 w-48 rounded-full bg-[#faedd4]/50 blur-2xl" />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Top Bar: Centered Sacred Badge + Top-Right Language Switcher (strictly within Library page) */}
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="hidden sm:block sm:w-[150px]" /> {/* Spacer for centering the middle pill on desktop */}

          <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-[#ebd2a0] bg-[#fff5df] px-4 py-1.5 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-[#c88918] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9b6811]">
              {t("sacredKnowledgePortal")}
            </span>
            <span className="text-[#c88918]">✦</span>
            <span className="text-[12px] font-serif text-[#7a571f]">सनातन ज्ञानकोष</span>
          </div>

          <div className="flex items-center justify-center sm:justify-end sm:w-[150px]">
            <LanguageSwitcher variant="default" className="shadow-xs" />
          </div>
        </div>

        {/* Hero Main Titles */}
        <div className="mt-8 text-center sm:mt-10">
          <h1 className="font-serif text-[36px] leading-[1.12] tracking-tight text-[#2b241d] sm:text-[52px] lg:text-[60px]">
            {isHindi ? (
              <>
                वेद पुस्तकालय <span className="text-[#c88918]">·</span> शाश्वत ज्ञानगंगा
              </>
            ) : (
              <>
                The Vedic Library <span className="text-[#c88918]">·</span> Eternal Wisdom
              </>
            )}
          </h1>

          <p className="mx-auto mt-4 max-w-[780px] text-[15px] leading-relaxed text-[#685c4e] sm:text-[17px]">
            {t("heroDesc")}
          </p>

          {/* Sacred Sanskrit Verse Banner */}
          <div className="mx-auto mt-7 max-w-[680px] rounded-2xl border border-[#ecd5a8] bg-[#fffcf6]/90 p-4 shadow-[0_4px_20px_rgba(200,137,24,0.08)] backdrop-blur-sm sm:p-5">
            <p className="font-serif text-[19px] font-semibold text-[#8f590b] sm:text-[22px]">
              {t("quoteSanskrit")}
            </p>
            <p className="mt-1.5 text-[13px] italic text-[#6d6052] sm:text-[14px]">
              {t("quoteTranslation")}
            </p>
          </div>
        </div>

        {/* Ultra-Luxury Minimalist Search Bar */}
        <div className="mx-auto mt-9 max-w-[740px] sm:mt-11">
          <div className="group relative flex items-center rounded-full bg-white p-2 sm:p-2.5 shadow-[0_12px_40px_rgba(30,22,12,0.06),0_2px_8px_rgba(30,22,12,0.04)] ring-1 ring-black/[0.07] transition-all duration-300 hover:shadow-[0_18px_48px_rgba(30,22,12,0.1)] focus-within:ring-2 focus-within:ring-[#8c672b] focus-within:shadow-[0_20px_50px_rgba(140,103,43,0.14)]">
            {/* Elegant Muted Icon Container */}
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-[#f6f2ea] text-[#6d5b48] transition-all duration-300 group-focus-within:bg-[#2b241d] group-focus-within:text-[#f3dfb9]">
              <Search size={18} strokeWidth={2.2} />
            </div>

            {/* Input Element */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchQuery("");
              }}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent px-3 sm:px-4 text-[15px] sm:text-[16px] text-[#241c14] placeholder:text-[#a39483] placeholder:font-normal outline-none"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f1ebe1] text-[#716150] transition hover:bg-[#2b241d] hover:text-white"
                title={t("clearSearch")}
              >
                <X size={13} />
              </button>
            )}

            {/* Sleek Action Pill Button */}
            <div className="shrink-0 pr-1">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#2b241d] px-4 sm:px-5 py-2 sm:py-2.5 text-[12px] sm:text-[12.5px] font-semibold text-[#f8ebd5] transition-all duration-200 hover:bg-[#1a140f] hover:shadow-xs active:scale-95"
              >
                <span>{isHindi ? "खोजें" : "Search"}</span>
                <ArrowRight size={13} className="text-[#d8a852]" />
              </button>
            </div>
          </div>

          {/* Quick Filter / Suggested Search Chips (Clean & Borderless) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[12px]">
            <span className="flex items-center gap-1.5 font-medium text-[#7d6c59] mr-1 text-[11.5px]">
              <Sparkles size={12} className="text-[#b37a1e]" />
              <span>{isHindi ? "त्वरित खोज:" : "Trending Topics:"}</span>
            </span>
            {[
              { en: "Rigveda", hi: "ऋग्वेद" },
              { en: "Upanishad", hi: "उपनिषद" },
              { en: "Yoga", hi: "योग" },
              { en: "Ramayana", hi: "रामायण" },
              { en: "Samskara", hi: "संस्कार" },
              { en: "Yagya", hi: "यज्ञ" },
            ].map((chip) => {
              const label = isHindi ? chip.hi : chip.en;
              const isActive =
                searchQuery.toLowerCase() === chip.en.toLowerCase() ||
                searchQuery.toLowerCase() === chip.hi.toLowerCase();
              return (
                <button
                  key={chip.en}
                  type="button"
                  onClick={() => setSearchQuery(isActive ? "" : isHindi ? chip.hi : chip.en)}
                  className={`cursor-pointer rounded-full px-3.5 py-1 text-[11.5px] font-medium transition-all ${
                    isActive
                      ? "bg-[#2b241d] text-[#faeed9] shadow-xs"
                      : "bg-[#f1ebe0]/70 text-[#5a4a39] hover:bg-[#e7dece] hover:text-[#2b241d]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryHero;
