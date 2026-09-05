import { Sparkles, Package, Flame, Scroll, CheckCircle2, ShieldCheck, Gift } from "lucide-react";

const HomaProcessTimeline = () => {
  const steps = [
    {
      num: "01",
      title: "Sankalpa",
      desc: "Sacred consecration pronouncing Gotra, Name, and personal prayer intention.",
      icon: Sparkles,
    },
    {
      num: "02",
      title: "Preparation",
      desc: "Arranging Havan Kund, sacred Samidha wood, pure cow ghee, and herbal offerings.",
      icon: Package,
    },
    {
      num: "03",
      title: "Agni",
      desc: "Kindling the sacred fire with Arani / camphor invocation into the Havan Kund.",
      icon: Flame,
    },
    {
      num: "04",
      title: "Mantra & Ahuti",
      desc: "Chanting preliminary Vedic hymns and offering primary Navagraha and Lokapala ahutis.",
      icon: Scroll,
    },
    {
      num: "05",
      title: "Main Homa",
      desc: "Systematic Ahuti offerings of the presiding deity's Moola mantra into the blaze.",
      icon: Flame,
    },
    {
      num: "06",
      title: "Purnahuti",
      desc: "Supreme culminating offering with consecrated coconut, ghee, and sacred slokas.",
      icon: CheckCircle2,
    },
    {
      num: "07",
      title: "Completion",
      desc: "Aarti, tilak with sacred Homa Bhasma (vibhuti), and concluding Acharya blessings.",
      icon: Gift,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SACRED RITUAL PHASES
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            From Sankalpa to Purnahuti
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            An authentic 7-stage Vedic progression preserving Shastric sequence from the opening vow to the final sacred fire oblation.
          </p>
        </div>

        {/* 7 Steps Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={step.num}
                className={`relative flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffaf2] p-6 shadow-[0_4px_16px_rgba(80,50,20,0.03)] transition hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.09)] ${
                  isLast ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[18px] font-bold text-[#b36c1e]">
                      {step.num}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4e6d1] text-[#9c5a17]">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 border-t border-[#f0e1cb] pt-2 text-[11px] font-medium text-[#8c7a68]">
                  {idx === 6 ? "Closing Vidhi & Prasad" : "Sequential Vidhi"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomaProcessTimeline;
