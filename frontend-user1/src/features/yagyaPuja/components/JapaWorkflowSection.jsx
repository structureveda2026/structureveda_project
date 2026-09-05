import { Scroll, Hash, Sparkles, MapPin, Calculator, ShieldCheck, Flame, CheckCircle2 } from "lucide-react";

const JapaWorkflowSection = () => {
  const steps = [
    {
      num: "01",
      title: "Choose Your Mantra",
      desc: "Select the available Japa service.",
      icon: Scroll,
    },
    {
      num: "02",
      title: "Choose Japa Count",
      desc: "11,000 / 21,000 / 51,000 / 1,25,000 or applicable options.",
      icon: Hash,
    },
    {
      num: "03",
      title: "Share Sankalpa",
      desc: "Provide required personal and family details.",
      icon: Sparkles,
    },
    {
      num: "04",
      title: "Select Date & Location",
      desc: "Choose available scheduling options.",
      icon: MapPin,
    },
    {
      num: "05",
      title: "System Calculates",
      desc: "Pandit requirement, daily target, completion date and price.",
      icon: Calculator,
    },
    {
      num: "06",
      title: "Confirm Booking",
      desc: "Review the complete Japa plan.",
      icon: ShieldCheck,
    },
    {
      num: "07",
      title: "Japa Begins",
      desc: "The chanting is performed according to the selected configuration.",
      icon: Flame,
    },
    {
      num: "08",
      title: "Completion",
      desc: "The selected Japa count is completed and applicable completion arrangements are made.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SYSTEMATIC JOURNEY
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            From Mantra to Completion
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            An intuitive 8-step journey bringing clarity, mathematical rigor, and sacred sanctity to your Japa anushthan.
          </p>
        </div>

        {/* 8 Steps Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffdfa] p-5 shadow-[0_4px_16px_rgba(80,50,20,0.03)] transition hover:border-[#c77722]"
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

                  <h3 className="mt-3.5 font-serif text-[17px] font-bold text-[#2b241d]">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#685c4f]">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JapaWorkflowSection;
