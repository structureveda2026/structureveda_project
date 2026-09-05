import { BookOpen, Calendar, Sparkles, CheckCircle2, ShieldCheck, CreditCard, Flame, Gift } from "lucide-react";

const PathWorkflowSection = () => {
  const steps = [
    {
      num: "01",
      title: "Choose Your Path",
      desc: "Select the scripture, Stotra or recitation.",
      icon: BookOpen,
    },
    {
      num: "02",
      title: "Select Your Arrangement",
      desc: "Choose available duration, days and format.",
      icon: Calendar,
    },
    {
      num: "03",
      title: "Share Your Sankalpa",
      desc: "Provide the required personal and family details.",
      icon: Sparkles,
    },
    {
      num: "04",
      title: "Check Availability",
      desc: "The future system checks Pandit and schedule availability.",
      icon: CheckCircle2,
    },
    {
      num: "05",
      title: "Review Your Plan",
      desc: "See duration, Pandit requirement, inclusions and price.",
      icon: ShieldCheck,
    },
    {
      num: "06",
      title: "Confirm Booking",
      desc: "Complete payment and confirm your Path.",
      icon: CreditCard,
    },
    {
      num: "07",
      title: "Recitation Begins",
      desc: "The selected Path is performed according to the configured schedule.",
      icon: Flame,
    },
    {
      num: "08",
      title: "Completion",
      desc: "Applicable completion and Prasad arrangements are completed.",
      icon: Gift,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SYSTEMATIC STEPS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            From Scripture to Completion
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            An intuitive 8-step journey bringing mathematical rigor, authentic scholar coordination, and sacred sanctity to your scripture recitation.
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

export default PathWorkflowSection;
