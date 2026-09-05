import {
  Compass,
  Sliders,
  FileHeart,
  Cog,
  Flame,
  CheckCircle,
} from "lucide-react";

const PujaWorkflowSection = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Puja",
      description: "Select the ritual according to your purpose.",
      icon: Compass,
    },
    {
      step: "02",
      title: "Configure",
      description: "Choose available duration, date, location and applicable options.",
      icon: Sliders,
    },
    {
      step: "03",
      title: "Share Your Sankalpa",
      description: "Provide your name, Gotra and other required ritual details.",
      icon: FileHeart,
    },
    {
      step: "04",
      title: "We Prepare",
      description: "Veda Structure coordinates Pandits, Samagri and schedule.",
      icon: Cog,
    },
    {
      step: "05",
      title: "Puja Is Performed",
      description: "The Puja is performed according to the selected ritual configuration.",
      icon: Flame,
    },
    {
      step: "06",
      title: "Completion",
      description: "Receive applicable completion information and Prasad arrangements.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            HOW PUJA BOOKING WORKS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            From Sankalpa to Completion
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            A clear and structured 6-step journey ensuring your Vedic ritual is conducted with authenticity and care.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-[22px] border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[20px] font-bold text-[#c77722]">
                      {item.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="mt-4 font-serif text-[19px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {item.description}
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

export default PujaWorkflowSection;
