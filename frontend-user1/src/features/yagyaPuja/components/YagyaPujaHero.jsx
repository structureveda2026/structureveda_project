import { Sparkles, MapPin, ShieldCheck, ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "../../../assets/images/yagya_hero.png";

const YagyaPujaHero = () => {
  const handleScrollToCategories = () => {
    const el = document.getElementById("service-categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      {/* Ambient Warm Golden Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#eab12c]/12 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-[#d4872b]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* =========================================================
              LEFT COLUMN: SACRED ARTWORK WITH AMBIENT GLOW
          ========================================================== */}
          <div className="order-1 flex items-center justify-center lg:order-1 lg:col-span-5">
            <div className="relative flex w-full max-w-[360px] items-center justify-center sm:max-w-[420px] lg:max-w-[460px]">
              <div className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-[#eab12c]/25 via-[#f5cf73]/20 to-transparent blur-3xl" />
              <img
                src={heroImg}
                alt="Sacred Vedic Yagya & Puja Services"
                className="relative z-10 max-h-[340px] w-full object-contain drop-shadow-[0_18px_36px_rgba(43,36,29,0.15)] transition-transform duration-700 hover:scale-[1.02] sm:max-h-[400px] lg:max-h-[460px]"
                loading="eager"
              />
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: EDITORIAL HIERARCHY & ACTIONS
          ========================================================== */}
          <div className="order-2 text-center lg:order-2 lg:col-span-7 lg:text-left">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0]/95 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(43,36,29,0.04)] backdrop-blur-xs">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36c1e] sm:text-[11px]">
                Authentic Vedic Traditions • Kashi & Beyond
              </span>
            </div>

            {/* Large Editorial Heading */}
            <h1 className="mt-4 font-serif text-[34px] font-medium leading-[1.12] tracking-[-0.02em] text-[#2b241d] sm:text-[44px] lg:text-[50px] xl:text-[56px]">
              Sacred <span className="text-[#c77722]">Yagya & Puja</span> Ecosystem
            </h1>

            {/* Supporting Description */}
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#5e5143] sm:text-[16px] lg:mx-0">
              Participate in time-honored Vedic rituals conducted by traditionally qualified priests. From personalized gotra sankalpas to sacred fire yagyas and holy Ganga tirthas, experience rituals organized with transparency and devotion.
            </p>

            {/* Key Information Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <MapPin size={13} className="text-[#d4872b]" />
                <span>Kashi & Holy Ghats</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <Flame size={13} className="text-[#d4872b]" />
                <span>Traditional Vedic Vidhi</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <ShieldCheck size={13} className="text-[#d4872b]" />
                <span>Pure Gotra Sankalpa</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4 lg:justify-start">
              <button
                type="button"
                onClick={handleScrollToCategories}
                className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_6px_20px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_8px_25px_rgba(234,177,44,0.4)] sm:w-auto"
              >
                <span>Explore Our Rituals</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <Link
                to="/yagya-puja/kashi"
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white/90 px-6 py-3 text-[14px] font-semibold text-[#2b241d] shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] sm:w-auto"
              >
                <span>Explore Puja in Kashi</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YagyaPujaHero;
