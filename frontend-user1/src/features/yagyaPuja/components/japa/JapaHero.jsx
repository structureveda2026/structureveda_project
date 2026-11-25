import { Search, Sparkles, ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";
import heroBgImg from "../../../../assets/images/japa-hero-bg.jpg";

/**
 * Section 01: Premium Full-Width Background Japa Hero
 * Replaces separate two-column card with an authentic, panoramic Vedic sanctuary background.
 * Features left-aligned typography, controlled warm-gradient overlay, connected live search,
 * and dual conversion CTAs.
 */
const JapaHero = ({
  searchQuery = "",
  setSearchQuery,
  onSearchSubmit,
  onExploreClick,
  onExpertClick,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <section className="group relative w-full overflow-hidden border-b border-[#ead8bc] bg-[#140c06]">
      {/* ── FULL-WIDTH BACKGROUND IMAGE ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImg}
          alt="Sacred Vedic Mantra Japa Sanctum"
          className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
          loading="eager"
        />

        {/* Controlled Left-to-Right Warm Scrim Gradient for Readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#170e06]/95 via-[#170e06]/85 to-[rgba(23,14,6,0.45)] sm:from-[#170e06]/95 sm:via-[#170e06]/80 sm:to-[rgba(23,14,6,0.35)]"
        />

        {/* Top & Bottom Subtle Depth Vignettes */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#140c06] to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#140c06]/70 to-transparent"
        />

        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#eab12c]/10 blur-[130px]"
        />
      </div>

      {/* ── FOREGROUND CONTENT (Left-Aligned, Full Height) ── */}
      <div className="relative z-10 mx-auto flex min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] w-full max-w-[1280px] flex-col justify-center px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-22">
        <div className="max-w-[700px] text-left">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f5ce6f]/35 bg-[#1f150b]/85 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5ce6f] shadow-xs backdrop-blur-md">
            <Sparkles size={12} className="text-[#f5ce6f]" />
            <span>VEDIC JAPA • MANTRA • SANKALPA</span>
          </div>

          {/* Headline */}
          <h1 className="mt-4 font-serif text-[34px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.14] tracking-tight text-[#fffdfa]">
            Begin Your Sacred <span className="text-[#f5ce6f]">Mantra Japa</span> With Sankalpa
          </h1>

          {/* Supporting Text */}
          <p className="mt-4 max-w-[620px] text-[15px] sm:text-[16.5px] leading-relaxed text-[#ede1d1]">
            Discover traditional Mantra Japa services performed with structured Anushthan counts,
            dedicated Pandit arrangements and personalized Sankalpa.
          </p>

          {/* Live Search Bar */}
          <form onSubmit={handleSubmit} className="mt-7 max-w-[580px]">
            <div className="relative flex items-center rounded-2xl border border-[#f5ce6f]/30 bg-[#1e140a]/90 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all focus-within:border-[#f5ce6f] focus-within:shadow-[0_12px_28px_rgba(245,206,111,0.20)]">
              <div className="pl-3.5 text-[#d4c5b2]">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="Search Mantra Japa (e.g. Mahamrityunjaya, Gayatri, Navagraha)..."
                className="w-full bg-transparent px-3 py-2 text-[14px] text-[#fffdfa] placeholder-[#b8a794] focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#b77920] px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-[#8f5211] hover:shadow-[0_4px_14px_rgba(183,121,32,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5ce6f] cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 rounded-full bg-[#b77920] px-7 py-3.5 text-[13.5px] font-bold text-white shadow-[0_4px_16px_rgba(183,121,32,0.30)] transition-all hover:bg-[#8f5211] hover:shadow-[0_8px_24px_rgba(183,121,32,0.40)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5ce6f] cursor-pointer"
            >
              <span>Explore Japa Catalogue</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={onExpertClick}
              className="inline-flex items-center gap-2 rounded-full border border-[#f5ce6f]/40 bg-[#1e140a]/80 px-6 py-3.5 text-[13.5px] font-bold text-[#fce8c8] backdrop-blur-md transition-all hover:border-[#f5ce6f] hover:bg-[#2c1d0e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5ce6f] cursor-pointer"
            >
              <MessageSquare size={14} className="text-[#f5ce6f]" />
              <span>Talk to a Vedic Expert</span>
            </button>
          </div>

          {/* Compact Verified Highlights */}
          <div className="mt-8 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-[13px] font-medium text-[#d9c9b5]">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#f5ce6f] shrink-0" />
              <span>Anushthan Counts (11k - 1.25L)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#f5ce6f] shrink-0" />
              <span>Synchronized Purohit Team</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#f5ce6f] shrink-0" />
              <span>Personalized Gotra Sankalpa</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JapaHero;
