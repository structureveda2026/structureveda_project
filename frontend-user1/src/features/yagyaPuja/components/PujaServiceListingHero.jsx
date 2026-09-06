import { Sparkles, ArrowRight, ChevronRight, MessageSquareQuote, ShieldCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroBgImg from "../../../assets/images/puja/puja-kashi.webp.png";

const PujaServiceListingHero = ({ onExploreClick }) => {
  const handleScrollToCatalogue = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const el = document.getElementById("puja-catalogue");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-[620px] items-center overflow-hidden border-b border-[#ebdcc4] px-5 py-12 sm:min-h-[660px] sm:px-8 sm:py-16 lg:min-h-[700px] lg:px-12 lg:py-20">
      {/* ── Layer 1: Full-Bleed Atmospheric Kashi / Priest Background Image ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center sm:bg-[center_right_15%] lg:bg-[center_right_10%]"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />

      {/* ── Layer 2: Localized Soft Directional Readability Overlay ── */}
      {/* Left side is calm parchment canvas; Right side is transparent so Kashi/priest scene remains vibrant & rich */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fffaf0]/92 via-[#fffaf0]/82 via-[36%] via-[#fffaf0]/32 via-[56%] to-transparent to-[76%] max-lg:bg-gradient-to-b max-lg:from-[#fffaf0]/95 max-lg:via-[#fffaf0]/85 max-lg:to-[#fffaf0]/40"
      />

      {/* ── Layer 3: Subtle Warm Golden Atmospheric Glow (Restrained) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#eab12c]/6 blur-[130px]"
      />

      {/* ── Main Editorial Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px]">

        {/* Contextual Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-[12.5px] font-medium text-[#5c4e3f] sm:mb-10">
          <Link to="/" className="transition-colors hover:text-[#b36c1e]">
            Home
          </Link>
          <ChevronRight size={13} className="text-[#b36c1e]" />
          <Link to="/yagya-puja" className="transition-colors hover:text-[#b36c1e]">
            Yagya & Puja
          </Link>
          <ChevronRight size={13} className="text-[#b36c1e]" />
          <span className="font-semibold text-[#2b241d]">Puja Services</span>
        </nav>

        {/* Left Editorial Content Area (48-52% width, leaving the right side open for Kashi visual) */}
        <div className="max-w-[620px] lg:max-w-[640px]">

          {/* Editorial Eyebrow with Fine Gold Divider Accent */}
          <div className="inline-flex items-center gap-2 text-[#b36c1e]">
            <span className="text-[12px] text-[#c77722]">✦</span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e4f0d]">
              VEDIC PUJA • SANKALPA • VIDHI
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-[#c77722]/35 sm:w-16" />
          </div>

          {/* Main Editorial Heading with Controlled 2-Line Rhythm & Antique Gold Accent */}
          <h1 className="mt-3.5 max-w-[540px] font-serif text-[36px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[40px] lg:text-[50px] xl:text-[54px]">
            <span className="text-[#2b241d]">Vedic Puja,</span>
            <br className="hidden sm:inline" />
            <span className="text-[#b36c1e]"> Performed With </span>
            <span className="text-[#2b241d]">Purpose</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 max-w-[580px] font-serif text-[17px] font-medium leading-relaxed text-[#45372a] sm:text-[18.5px]">
            Traditional Vedic rituals, thoughtfully arranged around your Sankalpa.
          </p>

          {/* Supporting Description */}
          <p className="mt-3 max-w-[560px] font-sans text-[14px] leading-relaxed text-[#65584a] sm:text-[15px]">
            Choose a Puja according to your purpose, preferred arrangement and requirements. Veda Structure helps coordinate the ritual, Acharyas and applicable Samagri.
          </p>

          {/* Refined Lightweight Trust Points Row */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-[12.5px] font-medium text-[#473a2e] sm:gap-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#b36c1e]" />
              <span>Prescribed Shastric Vidhi</span>
            </div>
            <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Award size={15} className="text-[#b36c1e]" />
              <span>Learned Vedic Acharyas</span>
            </div>
            <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles size={15} className="text-[#b36c1e]" />
              <span>Personal Sankalpa</span>
            </div>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <button
              type="button"
              onClick={handleScrollToCatalogue}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_24px_rgba(234,177,44,0.4)] active:scale-[0.98]"
            >
              <span>Explore Vedic Pujas</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <Link
              to="/astrologers"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dcc5a7] bg-[#fffaf0]/85 px-6 py-3.5 text-[13.5px] font-semibold text-[#2b241d] shadow-2xs transition-all duration-300 hover:border-[#b36c1e] hover:bg-[#fffdfa] hover:text-[#b36c1e]"
            >
              <MessageSquareQuote size={15} className="text-[#b36c1e]" />
              <span>Talk to a Vedic Expert</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PujaServiceListingHero;