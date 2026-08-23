import { Sparkles, UserRound, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export const defaultJourneySteps = [
  {
    step: "01",
    stage: "Stage 01 • Formulation",
    title: "Kundali Deconstruction",
    subtitle: "Birth Chart & Planetary Audit",
    description:
      "Rigorous examination of your Janam Kundali (Lagna chart), Navamsha (D-9), planetary strengths (Shadbala), and active yogas.",
    takeaway: "Deep mapping of innate karmic strengths & life tendencies.",
    Icon: Sparkles,
  },
  {
    step: "02",
    stage: "Stage 02 • Dialogue",
    title: "Root-Cause Exploration",
    subtitle: "Context & Situation Analysis",
    description:
      "Open discussion of your specific queries across career, relationship doubts, marriage delays, financial stagnation, or health.",
    takeaway: "Pinpointing why obstacles or transitions are occurring now.",
    Icon: UserRound,
  },
  {
    step: "03",
    stage: "Stage 03 • Timing",
    title: "Timing & Kaal Chakra",
    subtitle: "Dasha & Transit Forecasting",
    description:
      "Precise alignment of your Vimshottari Mahadasha / Antardasha and major planetary transits (Jupiter, Saturn, Rahu-Ketu Gochar).",
    takeaway: "Clear timelines for upcoming favorable shifts & decisions.",
    Icon: Clock,
  },
  {
    step: "04",
    stage: "Stage 04 • Alignment",
    title: "Vedic Remedies & Upaya",
    subtitle: "Actionable Resolution Blueprint",
    description:
      "Prescribed authentic Vedic remedies, specific mantra japa, gemstone recommendations, and lifestyle alignments rooted in Kashi traditions.",
    takeaway: "Practical spiritual blueprint to neutralize doshas.",
    Icon: ShieldCheck,
  },
];

const AstrologerJourney = ({
  eyebrow = "Consultation Journey & Outcomes",
  heading = "What You Experience in",
  highlightedHeading = "Every Session",
  description = "A structured, compassionate 4-stage Vedic immersion designed to give you clarity, confidence, and actionable life direction.",
  steps = defaultJourneySteps,
  bannerTitle = "Interactive 1-on-1 Consultation",
  bannerDescription = "Dedicated live audio/video discussion with time for your specific follow-up questions.",
  buttonText = "Book Your Session",
  onBookConsultation,
}) => {
  return (
    <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8]/80 via-[#fffdf9] to-[#f8edd8]/60 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[#eab12c]/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d4872b]/70" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              {eyebrow}
            </p>
            <span className="h-px w-8 bg-[#d4872b]/70" />
          </div>

          <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
            {heading}{" "}
            {highlightedHeading && (
              <span className="text-[#c77722]">{highlightedHeading}</span>
            )}
          </h2>

          {description && (
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              {description}
            </p>
          )}
        </div>

        {/* 4-Step Process Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((item) => {
            const StepIcon = item.Icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border-2 border-[#ead8b8] bg-white p-6 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4872b] hover:shadow-[0_18px_40px_rgba(212,135,43,0.15)] sm:p-7"
              >
                {/* Top Row: Number & Icon */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center rounded-full bg-[#f8edd8] px-3.5 py-1 font-serif text-[15px] font-bold text-[#b36c1e] transition-colors duration-300 group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                      {item.step}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6cca0] bg-[#fffaf0] text-[#d4872b] shadow-[0_3px_12px_rgba(212,135,43,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#eab12c] group-hover:text-[#2b241d]">
                      <StepIcon size={20} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Stage Eyebrow */}
                  <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#c77722]">
                    {item.stage}
                  </p>

                  {/* Title & Subtitle */}
                  <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
                    {item.title}
                  </h3>
                  <p className="text-[12px] font-medium text-[#8c7e6c]">
                    {item.subtitle}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Takeaway Outcome Chip */}
                <div className="mt-6 rounded-2xl border border-[#f0e2cd] bg-[#fbf6ec]/80 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#b36c1e]">
                    Key Outcome:
                  </p>
                  <p className="mt-1 text-[12px] font-medium leading-snug text-[#4a3f33]">
                    {item.takeaway}
                  </p>
                </div>

                {/* Bottom Gold Line Accent */}
                <span className="absolute bottom-0 left-6 h-[3px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-20" />
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Callout Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[24px] border-2 border-[#d6b8a0] bg-gradient-to-r from-[#fffaf0] via-[#fbf2e1] to-[#fffaf0] p-6 shadow-[0_12px_32px_rgba(43,36,29,0.08)] sm:flex-row sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eab12c] text-[#2b241d] shadow-[0_4px_16px_rgba(234,177,44,0.3)]">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="font-serif text-[20px] font-semibold text-[#2b241d]">
                {bannerTitle}
              </h4>
              <p className="mt-0.5 text-[13.5px] text-[#685c4f]">
                {bannerDescription}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBookConsultation}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[13.5px] font-bold text-[#2b241d] shadow-[0_8px_20px_rgba(234,177,44,0.22)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_12px_28px_rgba(234,177,44,0.3)]"
          >
            <span>{buttonText}</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AstrologerJourney;
