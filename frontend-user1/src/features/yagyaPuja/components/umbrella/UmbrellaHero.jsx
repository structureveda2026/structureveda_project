import { Sparkles, ArrowRight, ShieldCheck, MapPin, Calendar, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import heroBgImg from "../../../../assets/images/puja/puja-kashi.webp.png";

/**
 * SECTION 2: HERO
 * Full-bleed Kashi ritual atmospheric backdrop with localized editorial left wash.
 */
const UmbrellaHero = () => {
  const handleScrollToCategories = () => {
    const el = document.getElementById("ritual-categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex min-h-[620px] items-center overflow-hidden border-b border-[#ebdcc4] px-5 py-14 sm:min-h-[660px] sm:px-8 sm:py-18 lg:min-h-[700px] lg:px-12 lg:py-22">
      {/* ── Layer 1: Full-Bleed Kashi Ritual Background Photograph ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center sm:bg-[center_right_15%] lg:bg-[center_right_10%]"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />

      {/* ── Layer 2: Localized Soft Readability Gradient Overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fffaf0]/94 via-[#fffaf0]/84 via-[38%] via-[#fffaf0]/30 via-[58%] to-transparent to-[78%] max-lg:bg-gradient-to-b max-lg:from-[#fffaf0]/96 max-lg:via-[#fffaf0]/88 max-lg:to-[#fffaf0]/40"
      />

      {/* ── Layer 3: Subtle Warm Golden Atmospheric Ambient Glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#eab12c]/6 blur-[130px]"
      />

      {/* ── Main Editorial Content (Left ~48-52%) ── */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px]">
        <div className="max-w-[620px] lg:max-w-[650px]">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[#b36c1e]">
            <span className="text-[12px] text-[#c77722]">✦</span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#8e4f0d]">
              VEDIC YAGYA &amp; PUJA IN KASHI
            </span>
            <span aria-hidden="true" className="h-px w-12 bg-[#c77722]/35 sm:w-16" />
          </div>

          {/* Heading */}
          <h1 className="mt-3.5 max-w-[580px] font-serif text-[36px] font-semibold leading-[1.08] tracking-[-0.02em] text-[#2b241d] sm:text-[44px] lg:text-[50px] xl:text-[54px]">
            Authentic Vedic Puja &amp; Yagya, <span className="text-[#b36c1e]">Performed with Purpose</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 max-w-[580px] font-serif text-[16.5px] font-medium leading-relaxed text-[#45372a] sm:text-[18px]">
            Experience traditional Vedic rituals performed by experienced Vedic Acharyas in the sacred land of Kashi — with online booking, personalized sankalp and transparent service.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
            <Link
              to="/yagya-puja/puja"
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_24px_rgba(234,177,44,0.4)] active:scale-[0.98]"
            >
              <span>Book Your Puja</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={handleScrollToCategories}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#dcc5a7] bg-[#fffaf0]/85 px-6 py-3.5 text-[13.5px] font-semibold text-[#2b241d] shadow-2xs transition-all duration-300 hover:border-[#b36c1e] hover:bg-[#fffdfa] hover:text-[#b36c1e]"
            >
              <span>Explore Puja &amp; Yagya</span>
            </button>
          </div>

          {/* Trust Line (4 Items) */}
          <div className="mt-7 flex flex-wrap items-center gap-y-2 gap-x-4 text-[12px] font-medium text-[#5c4e3f] sm:text-[12.5px]">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-[#b36c1e] shrink-0" />
              <span>Performed in Kashi</span>
            </div>
            <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#b36c1e] shrink-0" />
              <span>Personalized Sankalp</span>
            </div>
            <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#b36c1e] shrink-0" />
              <span>Online Booking Available</span>
            </div>
            <span aria-hidden="true" className="hidden text-[#d5c3aa] sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Camera size={14} className="text-[#b36c1e] shrink-0" />
              <span>Puja Photos &amp; Updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UmbrellaHero;
