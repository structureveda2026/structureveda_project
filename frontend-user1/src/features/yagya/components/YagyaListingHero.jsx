import { Sparkles, Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import zodiacWheel from "../../../assets/images/wheel.png";

const YagyaListingHero = () => {
  const handleScrollToYagyas = () => {
    const el = document.getElementById("yagya-list") || document.getElementById("yagya-filters");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: 480, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      {/* Ambient Warm Golden Aura Glow */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#eab12c]/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-[#d4872b]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* =========================================================
              LEFT COLUMN: SACRED HOMA EMBLEM / MANDALA
          ========================================================== */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div className="relative flex h-[260px] w-[260px] items-center justify-center sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]">
              {/* Subtle Ambient Radial Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-[#eab12c]/20 via-[#f5cf73]/15 to-transparent blur-2xl" />

              {/* Extremely Low-Opacity Sacred Geometry / Mandala Wheel */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img
                  src={zodiacWheel}
                  alt=""
                  className="h-full w-full object-contain opacity-[0.16] animate-[spin_160s_linear_infinite]"
                />
              </div>

              {/* Subtle Concentric Sacred Rings */}
              <div className="pointer-events-none absolute h-[85%] w-[85%] rounded-full border border-[#d4872b]/25" />
              <div className="pointer-events-none absolute h-[98%] w-[98%] rounded-full border border-[#eab12c]/15 border-dashed" />

              {/* Sacred Homa Agni Emblem */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#e6cca0]/80 bg-gradient-to-b from-white/90 to-[#fdf8f0]/90 shadow-[0_10px_30px_rgba(43,36,29,0.08)] backdrop-blur-sm sm:h-36 sm:w-36">
                  <div className="flex flex-col items-center justify-center text-[#c77722]">
                    <Flame size={44} className="text-[#d4872b] sm:h-14 sm:w-14" />
                  </div>
                </div>

                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#9c6225]">
                  ✦ Consecrated Vedic Homa ✦
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: EDITORIAL BANNER CONTENT
          ========================================================== */}
          <div className="space-y-4 text-center sm:space-y-5 lg:col-span-7 lg:text-left">
            {/* Eyebrow */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4872b]/35 bg-[#fffaf0] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e] shadow-2xs">
                <Sparkles size={12} className="text-[#c77722]" />
                Kashi Vishwanath • Vedic Yagya Shala
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-[32px] font-bold leading-[1.12] tracking-[-0.02em] text-[#2b241d] sm:text-[42px] lg:text-[48px]">
              Vedic Yagyas in Sacred Kashi
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-[640px] text-[14.5px] leading-relaxed text-[#5e5143] sm:text-[16px] lg:mx-0">
              Experience the divine transformative power of authentic Vedic fire ceremonies performed on the holy banks of River Ganga in Varanasi. Chanted by senior Acharyas to burn karmic afflictions and invoke enduring prosperity, health, and spiritual victory.
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-[13px] font-medium text-[#4a3d31] lg:justify-start">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#d4872b]" />
                <span>100% Pure Vedic Vidhi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#d4872b]" />
                <span>Personalized Name & Gotra Sankalp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#d4872b]" />
                <span>Holy Homa Bhasma & Prasad Delivery</span>
              </div>
            </div>

            {/* Explore Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleScrollToYagyas}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.32)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_28px_rgba(234,177,44,0.42)] hover:-translate-y-0.5"
              >
                <span>Browse All Sacred Yagyas ↓</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default YagyaListingHero;
