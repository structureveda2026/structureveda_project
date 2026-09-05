import { Sparkles, ArrowRight, ChevronRight, MessageSquareQuote } from "lucide-react";
import { Link } from "react-router-dom";
import defaultPujaHeroImage from "../../../assets/images/puja_hero1.png";

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
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      {/* Ambient Warm Golden Background Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#eab12c]/12 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[#d4872b]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[1320px]">
        {/* Contextual Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[12px] font-medium text-[#7a6d5f]">
          <Link to="/" className="transition-colors hover:text-[#c77722]">
            Home
          </Link>
          <ChevronRight size={13} className="text-[#a89d91]" />
          <Link to="/yagya-puja" className="transition-colors hover:text-[#c77722]">
            Yagya & Puja
          </Link>
          <ChevronRight size={13} className="text-[#a89d91]" />
          <span className="font-semibold text-[#2b241d]">Puja Services</span>
        </nav>

        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* LEFT COLUMN: ARTWORK */}
          <div className="order-1 flex items-center justify-center lg:order-1 lg:col-span-5">
            <div className="relative flex w-full max-w-[360px] items-center justify-center sm:max-w-[420px] lg:max-w-[460px]">
              <div className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-[#eab12c]/20 via-[#f5cf73]/15 to-transparent blur-3xl" />
              <img
                src={defaultPujaHeroImage}
                alt="Vedic Puja, Performed With Purpose"
                className="relative z-10 max-h-[320px] w-full object-contain drop-shadow-[0_16px_32px_rgba(43,36,29,0.12)] transition-transform duration-700 hover:scale-[1.02] sm:max-h-[380px] lg:max-h-[440px]"
                loading="eager"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: EDITORIAL CONTENT & ACTIONS */}
          <div className="order-2 text-center lg:order-2 lg:col-span-7 lg:text-left">
            {/* Client Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0]/95 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(43,36,29,0.04)] backdrop-blur-xs">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e] sm:text-[11px]">
                VEDIC PUJA • SANKALPA • VIDHI
              </span>
            </div>

            {/* Client H1 */}
            <h1 className="mt-3.5 font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.02em] text-[#2b241d] sm:text-[42px] lg:text-[48px] xl:text-[52px]">
              Vedic Puja, Performed With Purpose
            </h1>

            {/* Client Subtitle */}
            <p className="mx-auto mt-3 max-w-[620px] font-serif text-[16.5px] font-medium leading-relaxed text-[#473a2e] sm:text-[18px] lg:mx-0">
              Traditional Vedic Pujas thoughtfully arranged around your Sankalpa, selected ritual, date and requirements.
            </p>

            {/* Client Supporting Text */}
            <p className="mx-auto mt-2.5 max-w-[600px] text-[14px] leading-relaxed text-[#6b5c4e] sm:text-[14.5px] lg:mx-0">
              From personal and family rituals to specific spiritual purposes, choose a Puja according to your requirement and let Veda Structure coordinate the ritual arrangements.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
              <button
                type="button"
                onClick={handleScrollToCatalogue}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.32)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_28px_rgba(234,177,44,0.42)] cursor-pointer"
              >
                <span>Explore Pujas</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <Link
                to="/astrologers"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6b8a0] bg-white/95 px-6 py-3 text-[13.5px] font-semibold text-[#2b241d] shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722]"
              >
                <MessageSquareQuote size={15} className="text-[#c77722]" />
                <span>Talk to a Vedic Expert</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PujaServiceListingHero;

