import { Calendar, HeartHandshake, Flame, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

/**
 * Upcoming Puja How It Works
 * Explains the 4-step process from choosing a ceremony to receiving sanctified confirmation.
 * Implements an editorial process timeline with numbered nodes.
 */
const UpcomingPujaHowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Puja",
      description:
        "Browse upcoming Vedic ceremonies by scheduled date, sacred occasion, or your family's personal intention.",
      icon: Calendar,
    },
    {
      number: "02",
      title: "Make Your Sankalp",
      description:
        "Provide your Name, Gotra, and prayer intention for individualized invocation during the sacred rituals.",
      icon: HeartHandshake,
    },
    {
      number: "03",
      title: "Vedic Ritual",
      description:
        "Learned Purohits conduct the ceremony in Kashi with traditional Vidhi, sacred mantras, and pure offerings.",
      icon: Flame,
    },
    {
      number: "04",
      title: "Receive Confirmation",
      description:
        "Receive booking confirmation, post-ritual video updates, and sanctified Prasadam delivered to your address.",
      icon: CheckCircle2,
    },
  ];

  const handleScrollToCeremonies = () => {
    const el = document.getElementById("upcoming-ceremonies");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="upcoming-puja-how-it-works"
      aria-label="How Upcoming Puja Participation Works"
      className="mt-16 mb-8 sm:mt-20 sm:mb-12"
    >
      <div className="rounded-[28px] border border-[#ebdcc4] bg-[#fffdfa] p-6 sm:p-10 lg:p-12 shadow-[0_6px_24px_rgba(43,36,29,0.04)]">
        {/* ── Section Header ── */}
        <div className="mb-12 text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span>HOW IT WORKS</span>
          </div>

          <h2 className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px] lg:text-[38px]">
            Your Path to Sacred Participation
          </h2>

          <p className="mx-auto max-w-[700px] text-[14.5px] leading-relaxed text-[#685c4f]">
            Participating in an upcoming ceremony is simple, transparent, and grounded in authentic
            Shastric traditions.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-4 flex items-center justify-center gap-2.5 text-[#c77722]/50"
          >
            <span className="h-px w-8 bg-[#c77722]/30 sm:w-12" />
            <span className="text-[11px]">✦</span>
            <span className="h-px w-8 bg-[#c77722]/30 sm:w-12" />
          </div>
        </div>

        {/* ── Editorial Horizontal Timeline (Desktop: 4 columns connected, Mobile: stacked) ── */}
        <div className="relative">
          {/* Connecting Track Line behind numbered circles (Desktop only) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-[27px] left-[10%] right-[10%] h-[2px] bg-[#ebdcc4] z-0"
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group flex flex-col items-center text-center sm:items-start sm:text-left lg:items-center lg:text-center"
                >
                  {/* Numbered Node with Icon */}
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#ebdcc4] bg-[#fffdfa] text-[#b36c1e] shadow-2xs transition-all duration-300 group-hover:border-[#c77722] group-hover:bg-[#eab12c] group-hover:text-[#1c1308] group-hover:scale-105">
                    <span className="font-serif text-[17px] font-bold">{step.number}</span>
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#fdf6e9] border border-[#ebdcc4] text-[#c77722] shadow-2xs group-hover:border-[#1c1308] group-hover:bg-[#1c1308] group-hover:text-[#f5ce6f]"
                    >
                      <Icon size={11} />
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3 className="mt-5 font-serif text-[19px] font-bold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Subtitle Callout & Explore Trigger ── */}
        <div className="mt-12 text-center border-t border-[#ebdcc4]/70 pt-8">
          <button
            type="button"
            onClick={handleScrollToCeremonies}
            className="inline-flex items-center gap-2 rounded-full border border-[#ebdcc4] bg-[#fffaf0] px-7 py-3 text-[13.5px] font-bold text-[#2b241d] shadow-2xs transition-all duration-200 hover:border-[#c77722] hover:bg-[#fffdfa] hover:text-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] cursor-pointer"
          >
            <span>Explore Upcoming Ceremonies</span>
            <ArrowRight size={14} className="text-[#c77722]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingPujaHowItWorks;
