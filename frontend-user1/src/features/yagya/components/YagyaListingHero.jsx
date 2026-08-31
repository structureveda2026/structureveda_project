import { Sparkles, ShieldCheck, CheckCircle2, ArrowDown } from "lucide-react";
import yagyaHero from "../../../assets/images/yagya_hero.png";

const YagyaListingHero = () => {
  const handleScrollToYagyas = () => {
    const el =
      document.getElementById("yagya-list") ||
      document.getElementById("yagya-filters");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: 480, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      {/* Ambient Warm Golden Background Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#eab12c]/12 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[#d4872b]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          
          {/* =========================================================
              LEFT COLUMN: TRANSPARENT SACRED YAGYA ARTWORK
              Desktop -> Left (5 cols, ~42%)
              Mobile  -> Top (Order 1)
          ========================================================== */}
          <div className="order-1 flex items-center justify-center lg:order-1 lg:col-span-5">
            <div className="relative flex w-full max-w-[360px] items-center justify-center sm:max-w-[420px] lg:max-w-[460px]">
              {/* Extremely soft, diffuse ambient gold glow directly behind artwork */}
              <div className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-[#eab12c]/20 via-[#f5cf73]/15 to-transparent blur-3xl" />

              {/* Pure Transparent Yagya Artwork */}
              <img
                src={yagyaHero}
                alt="Sacred Vedic Yagyas in Kashi"
                className="relative z-10 max-h-[320px] w-full object-contain drop-shadow-[0_16px_32px_rgba(43,36,29,0.12)] transition-transform duration-700 hover:scale-[1.02] sm:max-h-[380px] lg:max-h-[440px]"
                loading="eager"
              />
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: EDITORIAL HIERARCHY & CTA
              Desktop -> Right (7 cols)
              Mobile  -> Below Artwork (Order 2)
          ========================================================== */}
          <div className="order-2 text-center lg:order-2 lg:col-span-7 lg:text-left">
            
            {/* 1. Refined Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0]/95 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(43,36,29,0.04)] backdrop-blur-xs">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36c1e] sm:text-[11px]">
                Kashi Vishwanath • Vedic Yagya Shala
              </span>
            </div>

            {/* 2. Main Serif Heading */}
            <h1 className="mt-3.5 font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.02em] text-[#2b241d] sm:text-[42px] lg:text-[48px] xl:text-[52px]">
              Vedic Yagyas in{" "}
              <span className="text-[#c77722]">Sacred Kashi</span>
            </h1>

            {/* 3. Short Supporting Description */}
            <p className="mx-auto mt-3 max-w-[580px] text-[14.5px] leading-relaxed text-[#5e5143] sm:text-[15.5px] lg:mx-0">
              Experience the divine transformative power of authentic Vedic fire ceremonies performed on the holy banks of River Ganga in Varanasi. Chanted by senior Acharyas to burn karmic afflictions and invoke enduring prosperity, health, and spiritual victory.
            </p>

            {/* 4. Compact Trust / Authenticity Strip */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3.5 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <ShieldCheck size={14} className="text-[#d4872b]" />
                <span>100% Pure Vedic Vidhi</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3.5 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <CheckCircle2 size={14} className="text-[#d4872b]" />
                <span>Personalized Name & Gotra Sankalp</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3.5 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <Sparkles size={14} className="text-[#d4872b]" />
                <span>Holy Homa Bhasma & Prasad Delivery</span>
              </div>
            </div>

            {/* 5. Primary Explore CTA Button */}
            <div className="mt-7 flex items-center justify-center lg:justify-start">
              <button
                type="button"
                onClick={handleScrollToYagyas}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[13.5px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.32)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_28px_rgba(234,177,44,0.42)] hover:-translate-y-0.5"
              >
                <span>Browse All Sacred Yagyas</span>
                <ArrowDown
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default YagyaListingHero;
