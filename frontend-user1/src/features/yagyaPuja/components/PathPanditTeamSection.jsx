import { Users, BookOpen, Clock, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

const PathPanditTeamSection = () => {
  const parameters = [
    {
      title: "Daily Recitation Capacity",
      key: "dailyRecitationCapacity",
      desc: "Measured pacing ensuring proper Sanskrit Swara, Chandas, and pause norms without rushing.",
      icon: Clock,
    },
    {
      title: "Reciter Squad Bounds",
      key: "minimumPandits / maximumPandits",
      desc: "Minimum and recommended initiated scholars needed for relay continuous chanting.",
      icon: Users,
    },
    {
      title: "Required Shastric Skill",
      key: "requiredSkills / Sampradaya",
      desc: "Specific expertise (e.g. Shakta Saptashati, Ramcharitmanas Samiti, or Yajurvedic Ghana Pathis).",
      icon: BookOpen,
    },
    {
      title: "Target Completion Window",
      key: "allowedDays / minimumDays",
      desc: "Allowable calendar days balancing daily recitation hours with scholar endurance.",
      icon: Calendar,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[820px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SCHOLAR ALLOCATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            The Required Recitation Team Depends on the Path
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Different scriptures and recitations may require different levels of preparation, duration and Pandit participation. The required team is determined according to the selected Path and its configuration.
          </p>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="mx-auto mt-10 max-w-[1020px] rounded-2xl border border-[#e8d5bb] bg-[#fbf5eb] p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[12px] font-bold text-[#6d4c1b]">
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Selected Path</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Text / Chapters</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Recitation Duration</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Daily Capacity</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#c77722] px-3 py-1.5 text-white shadow-xs">Pandit Requirement</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-white px-3 py-1.5 shadow-xs">Schedule</span>
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
            <strong>No Hardcoded Universal Ratio:</strong> Unlike generic portals that apply a blanket rule (such as 1 Pandit per service), Veda Structure's architecture treats scholar allocation as a function of the text's chapter density, rhythm, and recitation fatigue boundaries.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PathPanditTeamSection;
