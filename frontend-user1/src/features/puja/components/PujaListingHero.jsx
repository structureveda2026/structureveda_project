import { Sparkles, ArrowRight, ChevronRight, MapPin, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroBgImg from "../../../assets/images/upcoming_puja_hero.jpg";

/**
 * Full-bleed image hero for the Upcoming Puja page (/puja/upcoming).
 * Background photograph spans the entire section; a tighter, softer
 * left-side scrim keeps the copy readable while leaving the ritual
 * photography (including the priest on the right) fully visible.
 */
const PujaListingHero = ({ onExploreClick }) => {
  const handleScrollToExplore = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const spotlightEl = document.getElementById("next-upcoming-puja");
    const listEl = document.getElementById("upcoming-ceremonies");
    const fallbackEl = document.getElementById("puja-list");
    const target = spotlightEl || listEl || fallbackEl;

    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: 450, behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[420px] overflow-hidden border-b border-[#ebdcc4] bg-[#1c1209] lg:min-h-[520px]">
      {/* =========================================================
          FULL-BLEED BACKGROUND PHOTOGRAPH
      ========================================================== */}
      <div className="absolute inset-0">
        <img
          src={heroBgImg}
          alt="Authentic Vedic ritual ceremony and sacred fire on the Ganga Ghats in Kashi, Varanasi"
          className="h-full w-full object-cover object-[68%_center]"
          loading="eager"
        />
        {/* Tighter, softer scrim — only the left ~55% is washed, right side (priest/fire) stays crisp */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#fbf6ec] from-0% via-[#fbf6ec]/75 via-35% to-transparent to-60% sm:to-55%"
        />
        {/* Gentle bottom vignette everywhere, for text/button legibility if content ever grows */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#140c06]/25 to-transparent"
        />
      </div>

      {/* =========================================================
          FOREGROUND CONTENT — LEFT-ALIGNED EDITORIAL COPY
      ========================================================== */}
      <div className="relative z-10 mx-auto flex h-full min-h-[420px] max-w-[1400px] items-center lg:min-h-[520px]">
        <div className="flex w-full flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:max-w-[600px] lg:px-8 lg:py-16 xl:max-w-[640px] xl:px-10">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-[11px] font-medium text-[#7d6f5f]">
            <Link to="/" className="transition-colors hover:text-[#2b241d]">
              Home
            </Link>
            <ChevronRight size={11} className="text-[#bba891]" />
            <span className="font-semibold text-[#b36c1e]">Upcoming Puja</span>
          </nav>

          {/* Eyebrow — now a soft pill so it holds its own against the photo */}
          <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#e7cfa8] bg-white/60 px-3 py-1 backdrop-blur-[2px]">
            <span className="text-[10px] text-[#c77722]">✦</span>
            <span className="font-sans text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#8e4f0d] sm:text-[11px]">
              Yagya &amp; Puja in Kashi
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-[#241d15] drop-shadow-sm sm:text-[38px] lg:text-[42px] xl:text-[46px]">
            Authentic Vedic Rituals,
            <br />
            <span className="text-[#b36c1e]">Performed with Purpose</span>
          </h1>

          {/* Supporting Description */}
          <p className="mt-3 max-w-[460px] text-[14px] leading-relaxed text-[#4a3d30] drop-shadow-sm sm:text-[15px]">
            Traditional Puja, Homa, Japa and Path performed through Veda Structure in Kashi — with online booking and personalized Sankalp.
          </p>

          {/* Dual CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleScrollToExplore}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-[#eab12c] px-6 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_6px_16px_-4px_rgba(234,177,44,0.55)] transition-all duration-200 hover:bg-[#dda018] hover:shadow-[0_8px_20px_-4px_rgba(234,177,44,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
            >
              <span>Explore Rituals</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>

            <Link
              to="/yagya-puja/puja"
              className="inline-flex items-center justify-center gap-1.5 rounded-[8px] border border-[#d6b8a0] bg-white/85 px-6 py-3 text-[13.5px] font-semibold text-[#2b241d] shadow-sm backdrop-blur-[2px] transition-all duration-200 hover:border-[#b36c1e] hover:bg-white hover:text-[#b36c1e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
            >
              <span>Book a Puja</span>
              <ChevronRight size={14} className="text-[#a89886]" />
            </Link>
          </div>

          {/* Trust Row */}
          <div className="mt-7 border-t border-[#d6b8a0]/60 pt-4">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-medium text-[#3d3225]">
              <div className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="shrink-0 text-[#c77722]" />
                <span>Sacred Kashi</span>
              </div>
              <span aria-hidden="true" className="hidden text-[#c9b394] sm:inline">•</span>

              <div className="inline-flex items-center gap-1.5">
                <Award size={13} className="shrink-0 text-[#c77722]" />
                <span>Vedic Acharyas</span>
              </div>
              <span aria-hidden="true" className="hidden text-[#c9b394] sm:inline">•</span>

              <div className="inline-flex items-center gap-1.5">
                <Sparkles size={13} className="shrink-0 text-[#c77722]" />
                <span>Personalized Sankalp</span>
              </div>
              <span aria-hidden="true" className="hidden text-[#c9b394] sm:inline">•</span>

              <div className="inline-flex items-center gap-1.5">
                <Globe size={13} className="shrink-0 text-[#c77722]" />
                <span>Online &amp; Offline</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PujaListingHero;