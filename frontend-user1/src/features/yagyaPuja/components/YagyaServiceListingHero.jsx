import { Sparkles, ArrowRight, ChevronRight, MessageSquareQuote, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import yagyaHeroImg from "../../../assets/images/yagya_hero.png";

const YagyaServiceListingHero = ({ onExploreClick }) => {
  const handleScrollToCatalogue = () => {
    if (onExploreClick) {
      onExploreClick();
      return;
    }
    const el = document.getElementById("yagya-catalogue");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      {/* Ambient Warm Golden & Agni Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#eab12c]/14 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-[#d4872b]/12 blur-[120px]" />

      <div className="relative mx-auto max-w-[1320px]">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-[12px] font-medium text-[#7a6d5f]">
          <Link to="/" className="transition-colors hover:text-[#c77722]">
            Home
          </Link>
          <ChevronRight size={13} className="text-[#a89d91]" />
          <Link to="/yagya-puja" className="transition-colors hover:text-[#c77722]">
            Yagya & Puja
          </Link>
          <ChevronRight size={13} className="text-[#a89d91]" />
          <span className="font-semibold text-[#2b241d]">Vedic Yagya Services</span>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* LEFT COLUMN: SACRED AGNI ARTWORK */}
          <div className="order-1 flex items-center justify-center lg:order-1 lg:col-span-5">
            <div className="relative flex w-full max-w-[360px] items-center justify-center sm:max-w-[420px] lg:max-w-[460px]">
              <div className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-[#eab12c]/25 via-[#f5cf73]/20 to-transparent blur-3xl" />
              <img
                src={yagyaHeroImg}
                alt="Vedic Yagya, Performed With Sankalpa"
                className="relative z-10 max-h-[340px] w-full object-contain drop-shadow-[0_18px_36px_rgba(43,36,29,0.15)] transition-transform duration-700 hover:scale-[1.02] sm:max-h-[400px] lg:max-h-[460px]"
                loading="eager"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: EDITORIAL COPY & CTAS */}
          <div className="order-2 text-center lg:order-2 lg:col-span-7 lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0]/95 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(43,36,29,0.04)] backdrop-blur-xs">
              <Flame size={13} className="text-[#c77722]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e] sm:text-[11px]">
                VEDIC YAGYA • SANKALPA • MANTRA • AGNI
              </span>
            </div>

            {/* H1 */}
            <h1 className="mt-4 font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.02em] text-[#2b241d] sm:text-[42px] lg:text-[48px] xl:text-[52px]">
              Vedic Yagya, Performed With Sankalpa
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-3.5 max-w-[620px] font-serif text-[16.5px] font-medium leading-relaxed text-[#473a2e] sm:text-[18px] lg:mx-0">
              Structured multi-day Vedic Yagya performed with prescribed Mantra, Vidhi, offerings and coordinated ritual arrangements.
            </p>

            {/* Supporting Text */}
            <p className="mx-auto mt-2.5 max-w-[600px] text-[14px] leading-relaxed text-[#6b5c4e] sm:text-[14.5px] lg:mx-0">
              Choose a Yagya according to your spiritual purpose, select the available duration and let Veda Structure coordinate the Pandit team, Samagri, schedule and ritual arrangements.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 lg:justify-start">
              <button
                type="button"
                onClick={handleScrollToCatalogue}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.32)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_28px_rgba(234,177,44,0.42)] cursor-pointer"
              >
                <span>Explore Yagya</span>
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <Link
                to="/astrologers"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d6b8a0] bg-white/95 px-6 py-3 text-[13.5px] font-semibold text-[#2b241d] shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722]"
              >
                <MessageSquareQuote size={15} className="text-[#c77722]" />
                <span>Not Sure Which Yagya?</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YagyaServiceListingHero;
