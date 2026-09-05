import { Calendar, CheckCircle2 } from "lucide-react";

const YagyaDailyTimelineSection = () => {
  const scheduleStages = [
    {
      dayLabel: "DAY 01",
      title: "Consecration & Initial Offerings",
      points: [
        "Sankalpa: Seeker Name, Gotra & Purpose invocation",
        "Purification / Initial Altar Ritual",
        "Mantra: Initial Japa commitments",
        "Agni Establishment in ceremonial havan kund",
        "First sacred Ahuti oblations",
      ],
    },
    {
      dayLabel: "DAY 02",
      title: "Deepening Ritual Cadence",
      points: [
        "Morning Swasti Vachan & Kalash Pujan",
        "Prescribed Mantra chanting by Vedic team",
        "Yagya Vidhi with specialized herbs & Cow Ghee",
        "Ahuti: Continuous dedicated oblations",
        "Continuation of disciplined ritual flow",
      ],
    },
    {
      dayLabel: "DAY 03+",
      title: "Mid-Anushthan Continuity",
      points: [
        "Intensive acoustic Mantra avartans",
        "Ahuti offerings with sacred samagri & Bilva/Lotus",
        "Prescribed Shastric Vidhi progression",
        "Completion Stage preparations",
        "Mid-ritual Aarti & Tarpana",
      ],
    },
    {
      dayLabel: "FINAL DAY",
      title: "Purnahuti & Completion",
      points: [
        "Grand Completion Ritual",
        "Maha Purnahuti with coconut and holy silk wrap",
        "Vasordhara: Continuous unbroken ghee stream",
        "Sankalpa Completion & Priestly blessings",
        "Prasad / Completion Arrangements coordination",
      ],
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            DAILY SCHEDULE ARCHITECTURE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Structured Ritual, Day by Day
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Each day follows a disciplined schedule designed to systematically build acoustic and spiritual resonance.
          </p>
        </div>

        {/* 4 Schedule Columns */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {scheduleStages.map((stage) => (
            <div
              key={stage.dayLabel}
              className="flex flex-col justify-between rounded-[22px] border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#f0e3ce] pb-3">
                  <span className="font-serif text-[18px] font-bold text-[#c77722]">
                    {stage.dayLabel}
                  </span>
                  <Calendar size={16} className="text-[#a89d91]" />
                </div>

                <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
                  {stage.title}
                </h3>

                <ul className="mt-4 space-y-2.5 text-[13px] text-[#685c4f]">
                  {stage.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#b36c1e]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-[680px] text-center text-[12.5px] text-[#8a7c6b]">
          * Generic explanatory sequence. In accordance with Veda Structure architecture, each specific Yagya service maintains its own tailored Shastric schedule.
        </p>
      </div>
    </section>
  );
};

export default YagyaDailyTimelineSection;
