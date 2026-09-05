import { User, Users, HeartHandshake, Globe, ArrowRight } from "lucide-react";

const YagyaArrangementModes = ({ onFilterMode }) => {
  const modes = [
    {
      id: "individual",
      title: "Individual",
      tagline: "Personal Sankalpa ke liye.",
      description: "Dedicated to personal spiritual evolution, health resolution, or specific life milestones with individual Gotra prayer.",
      cta: "Explore Individual Yagya",
      icon: User,
    },
    {
      id: "couple",
      title: "Couple",
      tagline: "Couple Sankalpa aur applicable ritual configuration.",
      description: "Arranged jointly for husband and wife to cultivate mutual harmony, family prosperity, and spiritual alignment.",
      cta: "Explore Couple Yagya",
      icon: HeartHandshake,
    },
    {
      id: "family",
      title: "Family",
      tagline: "Family members can be included in the Sankalpa where supported.",
      description: "Multi-generational prayers dedicating merit to children, parents, and ancestors with comprehensive family gotras.",
      cta: "Explore Family Yagya",
      icon: Users,
    },
    {
      id: "remote",
      title: "Remote Devotees",
      tagline: "Where the service supports it, arrangements may be made without physical presence.",
      description: "Experienced Kashi priests chant your Gotra Sankalp on holy riverbanks with daily video updates and dispatched prasad.",
      cta: "Explore Remote Yagya",
      icon: Globe,
    },
  ];

  const handleCtaClick = (modeId) => {
    if (onFilterMode) {
      onFilterMode(modeId);
    }
    const el = document.getElementById("yagya-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            TAILORED PARTICIPATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Yagya Can Be Arranged Around Your Sankalpa
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Select the participant configuration that best aligns with your dedicated devotional purpose.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                className="flex flex-col justify-between rounded-[22px] border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_10px_28px_rgba(199,119,34,0.10)]"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-4 font-serif text-[20px] font-bold text-[#2b241d]">
                    {mode.title}
                  </h3>

                  <p className="mt-1.5 text-[13px] font-semibold text-[#b36c1e]">
                    {mode.tagline}
                  </p>

                  <p className="mt-2.5 text-[13px] leading-relaxed text-[#685c4f]">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#f0e2cd] pt-4">
                  <button
                    type="button"
                    onClick={() => handleCtaClick(mode.id)}
                    className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#d6b8a0] bg-white py-2.5 text-[12.5px] font-bold text-[#2b241d] transition-all duration-300 hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] cursor-pointer"
                  >
                    <span>{mode.cta}</span>
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
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

export default YagyaArrangementModes;
