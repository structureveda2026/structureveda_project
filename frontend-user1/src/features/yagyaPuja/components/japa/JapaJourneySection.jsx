import { ScrollText, Volume2, Flame, Gift, ArrowRight } from "lucide-react";

/**
 * Section 07: The Four-Step Vedic Journey
 * Replaces duplicate 7-step process and 8-step workflow sections
 * with one clean, elegant 4-milestone Vedic progression.
 */
const JapaJourneySection = () => {
  const steps = [
    {
      num: "01",
      title: "Sankalpa Pronouncement",
      subtitle: "Day 1 Morning",
      desc: "Your name, Gotra, Nakshatra, and personal prayer are ritually pronounced by the head Purohit to establish spiritual ownership of the Anushthan.",
      icon: ScrollText,
    },
    {
      num: "02",
      title: "Synchronized Chanting",
      subtitle: "Daily Anushthan",
      desc: "Initiated scholars chant your prescribed daily count in unison with classical Chandas cadence, tracking tally counts using sacred rosaries.",
      icon: Volume2,
    },
    {
      num: "03",
      title: "Purnahuti & Havan",
      subtitle: "Final Conclusion",
      desc: "The Japa concludes with sacred Agni offerings (Ahutis) and Purnahuti, sealing the accumulated mantra vibrations as per Vedic tradition.",
      icon: Flame,
    },
    {
      num: "04",
      title: "Completion & Prasad",
      subtitle: "Dispatch & Blessing",
      desc: "The energized Japa Mala, sacred Raksha Sutra thread, and sanctum-touched Prasad are safely packaged and dispatched to your doorstep.",
      icon: Gift,
    },
  ];

  return (
    <section className="border-b border-[#ead8bc] bg-[#fffcf6] py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8bc] bg-[#fbf6ed] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
            <ScrollText size={12} className="text-[#b77920]" />
            <span>The Sacred Path</span>
          </div>
          <h2 className="mt-3 font-serif text-[28px] sm:text-[34px] font-bold text-[#30251c]">
            How Your Japa Is Performed
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#6b5845]">
            A transparent four-milestone lifecycle ensuring rigorous Vedic authenticity from initial Sankalpa to final Prasad delivery.
          </p>
        </div>

        {/* 4 Steps Timeline / Card Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-[22px] border border-[#ead8bc] bg-[#fffdfa] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#b77920] hover:shadow-[0_12px_24px_rgba(183,121,32,0.10)]"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[28px] font-bold text-[#e0cfbe] transition-colors group-hover:text-[#b77920]">
                      {st.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf2e4] text-[#b77920] transition-colors group-hover:bg-[#b77920] group-hover:text-white">
                      <Icon size={18} />
                    </div>
                  </div>

                  <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-[#8a725b]">
                    {st.subtitle}
                  </span>
                  <h3 className="mt-1 font-serif text-[18px] font-bold text-[#30251c]">
                    {st.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#5c4d3c]">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-5 border-t border-[#f0e3ce] pt-3 flex items-center justify-between text-[11px] font-semibold text-[#8a561c]">
                  <span>Step {st.num} of 04</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JapaJourneySection;

