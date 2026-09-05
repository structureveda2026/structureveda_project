import { User, Users, Globe, ArrowRight } from "lucide-react";

const PujaArrangementModes = ({ onFilterMode }) => {
  const modes = [
    {
      type: "individual",
      title: "Individual Puja",
      tagline: "Perform a Puja with your personal Sankalpa.",
      description:
        "Dedicated ritual focused on your personal spiritual goals, health, birthday, or life milestone with single-devotee Gotra Sankalpa.",
      cta: "Explore Individual Pujas",
      icon: User,
    },
    {
      type: "family",
      title: "Family Puja",
      tagline: "Include family members within the Sankalpa and ritual arrangement.",
      description:
        "Comprehensive family rituals invoking Kuldevi/Kuldevta, Griha Shanti, and lineage wellbeing with all family member Gotra names.",
      cta: "Explore Family Pujas",
      icon: Users,
    },
    {
      type: "remote",
      title: "Remote Puja",
      tagline: "Selected Pujas can be arranged for devotees who cannot be physically present.",
      description:
        "Priests in Kashi chant your Gotra Sankalp on holy Ganga ghats or shrines, with video updates and energized prasad sent to your doorstep.",
      cta: "Explore Remote Pujas",
      icon: Globe,
    },
  ];

  const handleCtaClick = (modeType) => {
    if (onFilterMode) onFilterMode(modeType);
    const el = document.getElementById("puja-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            ARRANGEMENT MODES
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Puja For You, Your Family or From Anywhere
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Tailor your ritual arrangement according to who participates and your physical presence.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.title}
                className="group flex flex-col justify-between rounded-[22px] border border-[#ebdcc4] bg-[#fffdfa] p-7 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_10px_28px_rgba(199,119,34,0.10)]"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722] transition-colors group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 font-serif text-[22px] font-bold text-[#2b241d]">
                    {mode.title}
                  </h3>

                  <p className="mt-1.5 text-[13.5px] font-semibold text-[#b36c1e]">
                    {mode.tagline}
                  </p>

                  <p className="mt-3 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-7 pt-4 border-t border-[#f0e2cd]">
                  <button
                    type="button"
                    onClick={() => handleCtaClick(mode.type)}
                    className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d6b8a0] bg-white py-3 text-[13px] font-bold text-[#2b241d] transition-all duration-300 hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] cursor-pointer"
                  >
                    <span>{mode.cta}</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PujaArrangementModes;
