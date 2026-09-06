import { Sparkles, ArrowRight, MessageSquareQuote, ShieldCheck, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import pujaFinalCtaImg from "../../../assets/images/puja/puja-final-cta.webp.png";

const PujaFinalCta = ({ onExploreClick }) => {
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
    <section className="relative overflow-hidden bg-[#18110b] px-5 py-18 text-center sm:px-8 sm:py-24 lg:px-12">
      {/* Background Image with Deep Warm Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={pujaFinalCtaImg}
          alt="Consecrated sacred Agni and Puja offerings"
          className="h-full w-full object-cover object-center opacity-30"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18110b] via-[#18110b]/80 to-[#18110b]/90" />
      </div>

      {/* Ambient Warm Golden Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full bg-[#d4872b]/15 blur-[140px] z-0" />

      <div className="relative z-10 mx-auto max-w-[840px]">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 shadow-2xs backdrop-blur-md">
          <Sparkles size={13} className="text-[#eab12c]" />
          <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#f5d070]">
            BEGIN YOUR SANKALPA
          </span>
        </div>

        {/* H2 */}
        <h2 className="mt-4 font-serif text-[34px] font-semibold leading-tight text-[#fdf8f0] sm:text-[44px] lg:text-[50px]">
          Choose Your Puja
        </h2>

        {/* Supporting Text */}
        <p className="mx-auto mt-4 max-w-[620px] font-serif text-[16px] leading-relaxed text-[#decab3] sm:text-[18px]">
          Select a traditional Puja, configure your requirements and begin your sacred ritual arrangement with Veda Structure.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleScrollToCatalogue}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_22px_rgba(234,177,44,0.38)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_28px_rgba(234,177,44,0.5)] cursor-pointer"
          >
            <span>Explore Vedic Pujas</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <Link
            to="/astrologers"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-[13.5px] font-semibold text-[#fbf5eb] backdrop-blur-md transition-all duration-300 hover:border-[#eab12c] hover:bg-white/15 hover:text-[#eab12c]"
          >
            <MessageSquareQuote size={15} className="text-[#eab12c]" />
            <span>Talk to a Vedic Expert</span>
          </Link>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-[12px] text-[#a89582]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eab12c]" />
            <span>Sanatana Shastric Vidhi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eab12c]" />
            <span>Dedicated Gotra Sankalpa</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eab12c]" />
            <span>Kashi & Remote Availability</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PujaFinalCta;
