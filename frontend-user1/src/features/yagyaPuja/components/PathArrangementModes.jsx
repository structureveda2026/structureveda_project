import { User, Users, Globe, Shield } from "lucide-react";

const PathArrangementModes = () => {
  const modes = [
    {
      title: "Individual",
      subtitle: "Personal Sankalpa",
      desc: "Sacred recitation undertaken for individual contemplation, spiritual study, or focused personal vow.",
      hindiNote: "Personal Sankalpa ke liye.",
      icon: User,
    },
    {
      title: "Family",
      subtitle: "Kula Sankalpa",
      desc: "Family members can be included in the opening prayers with their individual Gotras, Rashis, and names.",
      hindiNote: "Family members can be included where supported.",
      icon: Users,
    },
    {
      title: "Group / Community",
      subtitle: "Samuha Recitation",
      desc: "Where applicable, larger collective or community arrangements may be organized for major festivals.",
      hindiNote: "Where applicable, larger group arrangements may be available.",
      icon: Shield,
    },
    {
      title: "Remote Devotee",
      subtitle: "Remote Coordination",
      desc: "Selected recitation services may be arranged remotely where supported, without requiring travel to Kashi.",
      hindiNote: "Selected recitation services may be arranged remotely where supported.",
      icon: Globe,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            DEVOTIONAL FRAMEWORK
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Path for Your Sankalpa
          </h2>
          <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Whether for solitary contemplation, household protection, or larger auspicious gatherings, select the devotional scope appropriate for your requirement.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.title}
                className="flex flex-col justify-between rounded-[22px] border border-[#e6d3ba] bg-[#fffaf1] p-6 shadow-[0_4px_16px_rgba(80,50,20,0.03)] transition duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.09)]"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4e6d1] text-[#9c5a17]">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-4 font-serif text-[20px] font-bold text-[#2b241d]">
                    {mode.title}
                  </h3>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#a8641b]">
                    {mode.subtitle}
                  </span>

                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {mode.desc}
                  </p>
                </div>

                <div className="mt-5 rounded-xl border border-[#ebd8c1] bg-[#fbf5eb] p-2.5 text-[12px] italic text-[#705e4d]">
                  "{mode.hindiNote}"
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PathArrangementModes;
