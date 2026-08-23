import { ArrowRight, ShieldCheck, UserRound, Clock } from "lucide-react";

const AstrologerFinalCta = ({
  eyebrow = "Begin Your Astrological Journey",
  heading = "Ready to Gain",
  highlightedHeading = "Clarity & Direction",
  headingSuffix = "in Life?",
  description,
  astrologerName = "Vishal Bhardwaj",
  price = "Starting ₹1,100",
  sessionDuration = "30-Min Audio / Video Session",
  buttonText = "Book Your Consultation Now",
  viewPackagesText = "View Packages & Rates",
  directConsultationText,
  onBookConsultation,
  onViewPackages,
}) => {
  const firstName = astrologerName.split(" ")[0] || astrologerName;
  const directText = directConsultationText || `Direct 1-on-1 with Astrologer ${firstName}`;
  const defaultDesc = `Understand your Janam Kundali, upcoming Dasha cycles, and the right timing for your decisions with Astrologer ${astrologerName}.`;

  const handleScrollToPackages = () => {
    if (onViewPackages) {
      onViewPackages();
    } else {
      const el = document.getElementById("packages");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8] via-[#fbf2e1] to-[#f4e4c7] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
      {/* Ambient Backlight */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eab12c]/[0.1] blur-[140px]" />

      <div className="relative mx-auto max-w-[900px] text-center">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#d4872b]/70" />
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            {eyebrow}
          </p>
          <span className="h-px w-8 bg-[#d4872b]/70" />
        </div>

        <h2 className="font-serif text-[38px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#2b241d] sm:text-[48px] lg:text-[54px]">
          {heading}{" "}
          {highlightedHeading && (
            <span className="text-[#c77722]">{highlightedHeading}</span>
          )}{" "}
          {headingSuffix}
        </h2>

        <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-relaxed text-[#685c4f] sm:text-[17px]">
          {description || defaultDesc}
        </p>

        {/* Pricing & Duration Chip */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#e6cca0] bg-white/90 px-6 py-2.5 shadow-[0_6px_20px_rgba(43,36,29,0.06)] backdrop-blur-sm">
          <span className="font-serif text-[22px] font-bold text-[#2b241d]">
            {price}
          </span>
          <span className="h-3.5 w-px bg-[#d6b8a0]" />
          <span className="text-[12.5px] font-medium text-[#75695c]">
            {sessionDuration}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onBookConsultation}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-9 py-4 text-[14.5px] font-bold text-[#2b241d] shadow-[0_12px_28px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_16px_36px_rgba(234,177,44,0.4)]"
          >
            <span>{buttonText}</span>
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <button
            type="button"
            onClick={handleScrollToPackages}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-8 py-3.5 text-[14.5px] font-bold text-[#2b241d] transition-all duration-300 hover:border-[#eab12c] hover:bg-[#fffaf0]"
          >
            {viewPackagesText}
          </button>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] font-medium text-[#685c4f]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-[#d4872b]" />
            100% Private & Confidential
          </span>
          <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
          <span className="flex items-center gap-1.5">
            <UserRound size={15} className="text-[#d4872b]" />
            {directText}
          </span>
          <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
          <span className="flex items-center gap-1.5">
            <Clock size={15} className="text-[#d4872b]" />
            Flexible Rescheduling
          </span>
        </div>
      </div>
    </section>
  );
};

export default AstrologerFinalCta;
