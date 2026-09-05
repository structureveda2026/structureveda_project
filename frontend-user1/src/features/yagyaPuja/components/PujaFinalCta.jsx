import { Sparkles, ArrowRight, MessageSquareQuote } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section className="relative overflow-hidden bg-[#1b1510] px-5 py-16 text-center sm:px-8 sm:py-24 lg:px-12">
      {/* Background Ambient Warmth */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4872b]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-[800px]">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 shadow-2xs backdrop-blur-xs">
          <Sparkles size={13} className="text-[#eab12c]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f5d070]">
            BEGIN YOUR SANKALPA
          </span>
        </div>

        {/* H2 */}
        <h2 className="mt-4 font-serif text-[32px] font-medium leading-tight text-[#fdf8f0] sm:text-[42px] lg:text-[48px]">
          Choose Your Puja
        </h2>

        {/* Supporting Text */}
        <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#d4c5b5] sm:text-[16px]">
          Select a traditional Puja, configure your requirements and begin your Sankalpa with Veda Structure.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleScrollToCatalogue}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_20px_rgba(234,177,44,0.35)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_25px_rgba(234,177,44,0.45)] cursor-pointer"
          >
            <span>Explore Pujas</span>
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <Link
            to="/astrologers"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-[13.5px] font-semibold text-[#fbf5eb] backdrop-blur-xs transition-all duration-300 hover:border-[#eab12c] hover:bg-white/15 hover:text-[#eab12c]"
          >
            <MessageSquareQuote size={15} className="text-[#eab12c]" />
            <span>Talk to a Vedic Expert</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PujaFinalCta;
