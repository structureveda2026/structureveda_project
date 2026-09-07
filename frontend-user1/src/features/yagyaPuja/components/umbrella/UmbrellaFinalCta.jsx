import { Sparkles, ArrowRight, MessageSquareQuote } from "lucide-react";
import { Link } from "react-router-dom";
import heroBgImg from "../../../../assets/images/puja/puja-kashi.webp.png";

/**
 * SECTION 14: FINAL CTA
 * Full-width atmospheric invitation to begin a personal Sankalp or consult a Vedic advisor.
 */
const UmbrellaFinalCta = () => {
  return (
    <section className="relative overflow-hidden bg-[#24170d] py-20 px-5 sm:px-8 sm:py-24 lg:px-12 text-center text-[#faf4e8]">
      {/* Background Image with Atmospheric Dark-Warm Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#160d06]/95 via-[#1c1209]/85 to-[#160d06]/90"
      />

      <div className="relative z-10 mx-auto max-w-[840px]">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#eab12c]/40 bg-[#160d06]/75 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#f5ce6f] backdrop-blur-xs">
          <Sparkles size={12} className="text-[#eab12c]" />
          <span>BEGIN YOUR SANKALP IN KASHI</span>
        </div>

        {/* Heading */}
        <h2 className="mt-4 font-serif text-[34px] font-bold leading-tight text-[#faf4e8] sm:text-[42px] lg:text-[48px]">
          Choose Your Ritual
        </h2>

        {/* Supporting Text */}
        <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#eedcc5]/90 sm:text-[16.5px]">
          Choose your ritual or speak with our Vedic team for guidance on auspicious dates, prescribed Shastric procedures, and family Gotra coordination.
        </p>

        {/* Action CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/yagya-puja/puja"
            className="group inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_20px_rgba(234,177,44,0.35)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_25px_rgba(234,177,44,0.45)]"
          >
            <span>Explore Rituals</span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            to="/astrologers"
            className="inline-flex items-center gap-2 rounded-full border border-[#eed7b6]/40 bg-[#1a1109]/70 px-7 py-3.5 text-[13.5px] font-semibold text-[#f8ede0] shadow-2xs backdrop-blur-xs transition-all duration-300 hover:border-[#eab12c] hover:bg-[#2a1b0d]"
          >
            <MessageSquareQuote size={15} className="text-[#eab12c]" />
            <span>Talk to a Vedic Advisor</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UmbrellaFinalCta;
