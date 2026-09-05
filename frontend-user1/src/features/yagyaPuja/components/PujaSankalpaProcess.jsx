import { Sparkles, Compass, Flame, ShieldCheck, CheckCircle2 } from "lucide-react";

const PujaSankalpaProcess = () => {
  const processSteps = [
    {
      label: "Sankalpa",
      sanskrit: "संकल्प",
      title: "Defined Intention",
      description: "Every ceremony begins with your specific personal, family, spiritual, or situational intention.",
      icon: Compass,
    },
    {
      label: "Mantra",
      sanskrit: "मन्त्र",
      title: "Sacred Acoustic Vidhi",
      description: "Prescribed Vedic hymns and acoustic syllables dedicated to the presiding deity.",
      icon: Sparkles,
    },
    {
      label: "Vidhi",
      sanskrit: "विधि",
      title: "Shastric Procedure",
      description: "Authentic sequence of avahan, panchamrit abhishekam, archana, and holy offerings.",
      icon: Flame,
    },
    {
      label: "Puja",
      sanskrit: "पूजा",
      title: "Devotional Performance",
      description: "Conducted with traditional reverence by qualified Vedic priests at consecrated shrines or Kashi ghats.",
      icon: ShieldCheck,
    },
    {
      label: "Completion",
      sanskrit: "पूर्णाहुति",
      title: "Ritual Conclusion",
      description: "Closing prayers, ritual dedication, and applicable completion coordination.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            VEDIC INTENTION & RITUAL CADENCE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Every Puja Begins With a Sankalpa
          </h2>
          <p className="mx-auto mt-3 max-w-[720px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            A Puja is performed with a defined intention — a <strong>Sankalpa</strong>. Whether your intention is personal,
            family-oriented, spiritual, or connected with a specific life circumstance, Veda Structure thoughtfully brings
            together the complete sacred progression:
          </p>
        </div>

        {/* Visual Process Timeline */}
        <div className="mt-12">
          {/* Desktop Stepper */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="relative flex flex-col justify-between rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
                >
                  {/* Step Sequence Badge */}
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8edd8] text-[12px] font-bold text-[#b36c1e]">
                      0{idx + 1}
                    </span>
                    <span className="font-serif text-[13px] font-semibold text-[#8a6a32]">
                      {step.sanskrit}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="mt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8edd8]/70 text-[#c77722]">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-3.5 font-serif text-[19px] font-bold text-[#2b241d]">
                      {step.label}
                    </h3>
                    <p className="text-[12px] font-medium text-[#a06828]">
                      {step.title}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                      {step.description}
                    </p>
                  </div>

                  {/* Connection indicator */}
                  {idx < processSteps.length - 1 && (
                    <div className="mt-4 hidden lg:block border-t border-dashed border-[#d8c5a8] pt-2 text-right text-[11px] font-semibold text-[#b36c1e]">
                      Next Step →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PujaSankalpaProcess;
