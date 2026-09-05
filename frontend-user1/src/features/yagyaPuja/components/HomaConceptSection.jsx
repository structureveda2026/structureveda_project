import { Sparkles, Flame, Scroll, CheckCircle2, ArrowRight } from "lucide-react";

const HomaConceptSection = () => {
  const steps = [
    {
      num: "01",
      title: "Sankalpa",
      desc: "Sacred consecration formulating the personal, family, or spiritual vow.",
      icon: Sparkles,
    },
    {
      num: "02",
      title: "Agni",
      desc: "Kindling the consecrated fire in the Havan Kund with sacred Samidha.",
      icon: Flame,
    },
    {
      num: "03",
      title: "Mantra",
      desc: "Chanting prescribed Vedic hymns and Beeja mantras by initiated Pandits.",
      icon: Scroll,
    },
    {
      num: "04",
      title: "Ahuti",
      desc: "Consecrated offerings of pure cow ghee, sacred herbs, and grains into the flames.",
      icon: Flame,
    },
    {
      num: "05",
      title: "Purnahuti",
      desc: "Final supreme offering completing the fire sacrifice with Aarti and blessings.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[820px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            VEDIC FOUNDATIONS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            The Sacred Fire at the Heart of the Ritual
          </h2>
          <div className="mt-4 space-y-2 text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            <p>
              Homa, commonly referred to as Havan, is a Vedic fire ritual in which prescribed offerings are made into Agni along with Mantra and Sankalpa.
            </p>
            <p>
              Procedure, offerings, Mantra and requirements depend on the selected Homa.
            </p>
          </div>
        </div>

        {/* 5-Step Visual Process Progression */}
        <div className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative flex flex-col justify-between rounded-[20px] border border-[#e8d5bc] bg-[#fffbf4] p-6 shadow-[0_4px_16px_rgba(80,50,20,0.04)] transition duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
                >
                  <div>
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#a8641b]">
                        STEP {step.num}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6ecdc] text-[#a8641b]">
                        <Icon size={16} />
                      </div>
                    </div>

                    <h3 className="mt-4 font-serif text-[19px] font-bold text-[#2b241d]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#6d5e4f]">
                      {step.desc}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#d4872b]">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shastric Procedural Note */}
        <div className="mx-auto mt-10 max-w-[820px] rounded-2xl border border-[#e4d1b8] bg-[#fbf5eb] p-4 text-center text-[13px] text-[#6d5c4b]">
          <p>
            <strong>Agni as the Divine Messenger:</strong> In the Rigveda, Agni is revered as *Havya-vahana*—the sacred bearer of oblations to the celestial realm. Each Ahuti is offered with precise Swaha intonation according to traditional Vidhi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomaConceptSection;
