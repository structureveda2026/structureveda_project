import { Users, BookOpen, Clock, Calendar, ShieldCheck, ArrowRight, Settings } from "lucide-react";

const JapaPanditTeamSection = () => {
  const parameters = [
    {
      title: "Daily Capacity per Pandit",
      key: "japaCapacityPerPanditPerDay",
      desc: "Measured chanting speed ensuring unhurried, clear Sanskrit intonation.",
      icon: Clock,
    },
    {
      title: "Priest Squad Bounds",
      key: "minimumPandits / maximumPandits",
      desc: "Minimum and maximum scholars permissible for ritual sanctity.",
      icon: Users,
    },
    {
      title: "Required Shastric Skill",
      key: "requiredSkill / Veda Shakha",
      desc: "Authentic Shakha lineage trained specifically for the chosen mantra.",
      icon: BookOpen,
    },
    {
      title: "Allowed Completion Window",
      key: "allowedCompletionWindow",
      desc: "Allowable calendar days balancing daily hours with fatigue limits.",
      icon: Calendar,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[820px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SCHOLAR COORDINATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            The Required Chanting Team Is Calculated for Your Japa
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            The required number of Pandits depends on the selected Mantra, Japa count, prescribed chanting requirements and available daily capacity.
          </p>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="mx-auto mt-10 max-w-[1000px] rounded-2xl border border-[#e8d5bb] bg-[#fbf5eb] p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[12px] font-bold text-[#6d4c1b]">
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Selected Mantra</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Japa Count</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Daily Capacity</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#c77722] px-3 py-1.5 text-white shadow-xs">Pandit Requirement</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Schedule</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Availability</span>
          </div>
        </div>

        {/* 4 Architectural Configuration Parameters */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {parameters.map((param) => {
            const Icon = param.icon;
            return (
              <div
                key={param.title}
                className="flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffaf2] p-5 shadow-[0_4px_16px_rgba(80,50,20,0.03)]"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2e2cb] text-[#a8641b]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-3.5 font-serif text-[17px] font-bold text-[#2b241d]">
                    {param.title}
                  </h3>
                  <code className="mt-1 block text-[11px] font-medium text-[#a8641b]">
                    {param.key}
                  </code>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                    {param.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shastric Integrity Note */}
        <div className="mx-auto mt-10 max-w-[820px] rounded-2xl border border-[#d8b584] bg-[#fffaf0] p-4 text-center text-[13px] text-[#705c48]">
          <p>
            <strong>Preserving Recitation Sanctity:</strong> Vedic chanting is never accelerated to cut days. If 1,25,000 recitations are undertaken over 11 days, the squad size is proportionally scaled up with certified Vedic scholars rather than compromising pronunciation precision.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JapaPanditTeamSection;
