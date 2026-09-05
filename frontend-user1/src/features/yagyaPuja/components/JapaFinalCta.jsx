import { Sparkles, ArrowRight, MessageSquareCheck } from "lucide-react";
import { Link } from "react-router-dom";

const JapaFinalCta = ({ onExploreClick, onRequestCustomClick }) => {
  return (
    <section className="relative overflow-hidden bg-[#1f1710] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full bg-[#c77722]/15 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-20 h-[380px] w-[380px] rounded-full bg-[#eab12c]/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[920px] text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f5ce6f]/30 bg-[#2d2217] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#f5ce6f]">
          <Sparkles size={12} className="text-[#eab12c]" />
          <span>BEGIN YOUR SANKALPA</span>
        </div>

        {/* Heading */}
        <h2 className="mt-5 font-serif text-[32px] font-bold leading-tight text-[#fdf6ec] sm:text-[44px] lg:text-[48px]">
          Begin Your Mantra Japa
        </h2>

        {/* Text */}
        <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#c7b8a7] sm:text-[16.5px]">
          Choose your Mantra, select the available Japa count and arrange your chanting with Veda Structure.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onExploreClick}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#c77722] to-[#e08e2b] px-8 py-4 text-[14.5px] font-bold text-[#fffdfa] shadow-[0_10px_25px_rgba(199,119,34,0.35)] transition duration-300 hover:brightness-110 hover:shadow-[0_14px_30px_rgba(199,119,34,0.45)] cursor-pointer"
          >
            <span>Explore Japa</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onRequestCustomClick}
            className="inline-flex items-center gap-2 rounded-full border border-[#7d6751] bg-[#2d2217]/80 px-7 py-4 text-[14.5px] font-semibold text-[#ebdcc4] transition duration-300 hover:border-[#d4872b] hover:bg-[#382b1d] hover:text-white cursor-pointer"
          >
            <MessageSquareCheck size={16} className="text-[#d4872b]" />
            <span>Request Custom Japa</span>
          </button>
        </div>

        {/* Assurance Note */}
        <p className="mt-7 text-[12px] text-[#9c8976]">
          Transparent counts • Dedicated initiated Vedic scholars • Sankalpa by Gotra & Name
        </p>
      </div>
    </section>
  );
};

export default JapaFinalCta;
