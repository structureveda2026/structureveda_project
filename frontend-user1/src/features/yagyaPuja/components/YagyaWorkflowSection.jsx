import {
  Compass,
  Calendar,
  MapPin,
  FileHeart,
  Cog,
  Flame,
  CheckCircle,
} from "lucide-react";

const YagyaWorkflowSection = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Yagya",
      description: "Select the Yagya according to your purpose.",
      icon: Compass,
    },
    {
      step: "02",
      title: "Select Duration",
      description: "Choose from available 3 / 5 / 7 / 9 / 11-day configurations.",
      icon: Calendar,
    },
    {
      step: "03",
      title: "Choose Date & Location",
      description: "Select an available start date and applicable location.",
      icon: MapPin,
    },
    {
      step: "04",
      title: "Share Sankalpa",
      description: "Provide Name, Gotra, Nakshatra, Rashi, Family Members, Purpose & Special Sankalpa.",
      icon: FileHeart,
    },
    {
      step: "05",
      title: "We Prepare",
      description: "Veda Structure coordinates Pandits, Samagri, Schedule & Ritual Requirements.",
      icon: Cog,
    },
    {
      step: "06",
      title: "Yagya Begins",
      description: "The ritual is performed according to the configured multi-day schedule.",
      icon: Flame,
    },
    {
      step: "07",
      title: "Completion",
      description: "Final ritual / Purnahuti and applicable completion arrangements.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            HOW YAGYA BOOKING WORKS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            From Sankalpa to Completion
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            A transparent 7-stage progression designed for extensive multi-day Vedic ritual coordination.
          </p>
        </div>

        {/* 7 Steps Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-5 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[18px] font-bold text-[#c77722]">
                      {item.step}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="mt-4 font-serif text-[16.5px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#685c4f]">
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

export default YagyaWorkflowSection;
