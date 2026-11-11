import React from "react";
import { Link } from "react-router-dom";
import { Flame, ArrowRight, ChevronRight, ShieldCheck, MapPin } from "lucide-react";
import homaHeroImg from "../../../assets/images/homa/homa-hero-morning-sanctum.jpg";

export default function HomaListingHero({ onExploreClick }) {
  const handleScrollToCategories = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const el = document.getElementById("homa-categories-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#D8C7B0]/60 bg-[#1C120C] text-[#FFFDF9] min-h-[620px] sm:min-h-[640px] lg:min-h-[680px] xl:min-h-[700px] flex items-center">
      {/* =========================================================
          AUTHENTIC SUNLIT TEMPLE SANCTUM BACKGROUND IMAGE
      ========================================================== */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[position:82%_center] sm:bg-[position:78%_center] md:bg-[position:75%_center] lg:bg-[position:85%_center] xl:bg-[position:88%_center] transition-all duration-700"
        style={{
          backgroundImage: `url(${homaHeroImg})`,
        }}
        role="img"
        aria-label="Traditional Vedic Homa and Havan fire ceremony in temple sanctum"
      />

      {/* =========================================================
          REFINED MULTI-DIRECTIONAL WARM GRADIENT OVERLAYS
      ========================================================== */}
      {/* Horizontal gradient: Rich dark earthy brown on left for text readability, transitioning cleanly to preserve bright natural daylight and Agni Kund on the right */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1C120C]/95 via-[#231710]/85 via-45% md:via-[#261810]/75 md:via-55% lg:via-[#261810]/65 lg:via-50% to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Vertical subtle gradient for soft top and bottom blending without dark murkiness */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#1C120C]/60 via-transparent via-25% to-[#1C120C]/70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Muted warm temple gold ambient glow near the fire */}
      <div
        className="pointer-events-none absolute right-[8%] top-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-[#C59B27]/10 blur-[120px]"
        aria-hidden="true"
      />

      {/* =========================================================
          HERO TEXT & EDITORIAL CONTENT (LEFT-ALIGNED)
      ========================================================== */}
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="max-w-[620px] text-left">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-5 sm:mb-6 flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[#D4C8B8]"
          >
            <Link to="/" className="transition-colors hover:text-[#C59B27]">
              Home
            </Link>
            <ChevronRight size={13} className="text-[#A39280]" />
            <Link to="/yagya-puja" className="transition-colors hover:text-[#C59B27]">
              Yagya &amp; Puja
            </Link>
            <ChevronRight size={13} className="text-[#A39280]" />
            <span className="font-semibold text-[#FFFDF9]">Vedic Homa &amp; Havan</span>
          </nav>

          {/* Eyebrow Label Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B27]/35 bg-[#2A1B10]/80 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs">
            <Flame size={13} className="text-[#C59B27] shrink-0" />
            <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#E0B84C]">
              VEDIC HOMA • HAVAN • AGNI
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mt-4 sm:mt-5 font-serif text-[36px] sm:text-[46px] md:text-[52px] lg:text-[58px] xl:text-[62px] font-bold leading-[1.1] tracking-[-0.02em] text-[#FFFDF9] drop-shadow-xs">
            Vedic Homa &amp; Havan
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-3.5 font-serif text-[17.5px] sm:text-[20px] lg:text-[22px] font-medium leading-relaxed text-[#D8B45E]">
            Sacred Fire Ceremonies, Rooted in Vedic Tradition
          </p>

          {/* Description */}
          <p className="mt-3 max-w-[560px] text-[14px] sm:text-[15px] leading-relaxed text-[#E6DDD3] drop-shadow-2xs">
            Experience traditional Vedic fire rituals performed with prescribed mantras, sacred offerings and personalized Sankalpa. Choose a ceremony conducted in the sacred Kashi Kshetra or participate remotely.
          </p>

          {/* Action CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={handleScrollToCategories}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9E6524] to-[#B87B2E] hover:brightness-105 px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(158,101,36,0.35)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Homa Ceremonies</span>
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <Link
              to="/yagya-puja/homa/all"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EAD8B8]/35 bg-[#24170E]/55 backdrop-blur-xs px-6 py-3.5 text-[14px] font-medium text-[#FFFDF9] shadow-2xs transition-all duration-300 hover:border-[#EAD8B8]/70 hover:bg-[#24170E]/80 hover:text-white hover:-translate-y-0.5"
            >
              <span>Browse All Categories</span>
            </Link>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[12px] sm:text-[12.5px] text-[#E0D2C1]">
            <div className="flex items-center gap-2 font-medium">
              <Flame size={14} className="text-[#C59B27] shrink-0" />
              <span>Sacred Fire Rituals</span>
            </div>
            <span className="hidden sm:inline text-white/30 select-none">·</span>
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck size={14} className="text-[#C59B27] shrink-0" />
              <span>Initiated Vedic Purohits</span>
            </div>
            <span className="hidden sm:inline text-white/30 select-none">·</span>
            <div className="flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-[#C59B27] shrink-0" />
              <span>Kashi &amp; Remote Participation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
