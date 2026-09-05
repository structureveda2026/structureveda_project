import { Sparkles, Scroll, Users, Flame, CalendarCheck, CheckCircle2, Gift } from "lucide-react";

const JapaProcessSection = () => {
  const processSteps = [
    {
      num: "01",
      title: "Sankalpa",
      desc: "Your personal or family intention is recorded.",
      icon: Sparkles,
    },
    {
      num: "02",
      title: "Mantra Selection",
      desc: "The selected Mantra and Japa configuration are confirmed.",
      icon: Scroll,
    },
    {
      num: "03",
      title: "Japa Preparation",
      desc: "Pandits and applicable ritual arrangements are coordinated.",
      icon: Users,
    },
    {
      num: "04",
      title: "Chanting Begins",
      desc: "The prescribed Mantra is recited according to the selected Japa count and schedule.",
      icon: Flame,
    },
    {
      num: "05",
      title: "Daily Progress",
      desc: "Where applicable, progress is recorded according to the configured schedule.",
      icon: CalendarCheck,
    },
    {
      num: "06",
      title: "Completion",
      desc: "The selected Japa count is completed according to the service configuration.",
      icon: CheckCircle2,
    },
    {
      num: "07",
      title: "Completion Information",
      desc: "Applicable update, Prasad and documentation arrangements.",
      icon: Gift,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            STEP-BY-STEP RIGOR
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            From Sankalpa to Completion
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Every step of your Mantra Japa is coordinated with classical discipline, transparent planning, and dedicated Acharya supervision.
          </p>
        </div>

        {/* 7 Process Steps */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === processSteps.length - 1;

            return (
              <div
                key={step.num}
                className={`relative flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffdfa] p-6 shadow-[0_4px_16px_rgba(80,50,20,0.03)] transition hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.09)] ${
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
                  {idx === 6 ? "Where applicable as included" : "Standard Procedure"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JapaProcessSection;
