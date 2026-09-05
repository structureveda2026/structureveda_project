import { Users, Flame, Clock, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

const HomaPanditTeamSection = () => {
  const parameters = [
    {
      title: "Havan Ahuti Capacity",
      key: "havanCapacityPerPandit",
      desc: "Measured Ahuti cadence per priest ensuring deliberate, reverent Sanskrit recitation without rush.",
      icon: Clock,
    },
    {
      title: "Priest Squad Bounds",
      key: "minimumPandits / maximumPandits",
      desc: "Minimum and recommended initiated scholars needed for simultaneous chanting, ghee offering, and samidha maintenance.",
      icon: Users,
    },
    {
      title: "Required Shastric Skill",
      key: "requiredSkills / Shakha",
      desc: "Specific expertise (e.g. Shakta Chandi Vidhi, Krishna Yajurveda Rudra Homa, or Rigvedic Samhita).",
      icon: Flame,
    },
    {
      title: "Daily Hours & Window",
      key: "dailyHours / availableDays",
      desc: "Ritual hours scheduled to avoid scholar fatigue and preserve absolute purity of the sacred fire.",
      icon: Calendar,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[820px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SCHOLAR ALLOCATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            The Pandit Team Is Determined by Your Homa Configuration
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Different fire sacrifices require distinct numbers of reciters, Hotas (offering priests), and supervising Acharyas. The required team is calculated dynamically based on the selected Homa and Ahuti targets.
          </p>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="mx-auto mt-10 max-w-[1020px] rounded-2xl border border-[#e8d5bb] bg-[#fffdfa] p-4 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[12px] font-bold text-[#6d4c1b]">
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Homa Type</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Number of Havan</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Number of Days</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Ritual Configuration</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#c77722] px-3 py-1.5 text-white">Pandit Requirement</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Availability</span>
          </div>
        </div>

        {/* 4 Architectural Configuration Parameters */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {parameters.map((param) => {
            const Icon = param.icon;
            return (
              <div
                key={param.title}
                className="flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffdfa] p-5 shadow-[0_4px_16px_rgba(80,50,20,0.03)]"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e6d1] text-[#9c5a17]">
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
            <strong>No Universal Fixed Ratio:</strong> The system does not assume a simplistic formula like 1 Havan = 1 Pandit. A 5-Havan Chandi sacrifice requires multiple priests for simultaneous Saptashati recitation and oblation handling, whereas a Ganapati Homa is typically conducted by 2 dedicated priests.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomaPanditTeamSection;
