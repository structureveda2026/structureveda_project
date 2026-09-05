import { BookOpen, Calendar, Clock, CheckCircle2, ArrowRight, Info } from "lucide-react";

const PathChapterStructureSection = () => {
  const exampleDays = [
    {
      day: "DAY 01",
      title: "Opening & Prathama Adhyayas",
      chapters: "Adhyaya 1 to 4 • Opening Nyasa & Dhyanam",
      duration: "Approx. 3.5 Hours",
      status: "Initial Sankalpa Consecration",
    },
    {
      day: "DAY 02",
      title: "Madhyama Charita & Madhyama Adhyayas",
      chapters: "Adhyaya 5 to 9 • Continuous Recitation Cadence",
      duration: "Approx. 3.5 Hours",
      status: "Core Granth Flow",
    },
    {
      day: "DAY 03",
      title: "Uttama Adhyayas & Completion Recitation",
      chapters: "Adhyaya 10 to 13 • Phalasruti, Aarti & Purnahuti",
      duration: "Approx. 3.5 Hours",
      status: "Final Purnahuti Completion",
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SYSTEMATIC RECITATIONS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Structured Recitation Plan
          </h2>
          <p className="mx-auto mt-3 max-w-[660px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Scriptures are partitioned into logical Adhyayas, Sargas, or Charitas, allowing multi-day anushthans to maintain reverence, rhythm, and clarity.
          </p>
        </div>

        {/* Architecture Pipeline Flow */}
        <div className="mx-auto mt-10 max-w-[900px] rounded-2xl border border-[#e4d1b8] bg-[#fffdfa] p-4 text-center">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[12px] font-bold text-[#6d4c1b]">
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Selected Path</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Chapters / Sections</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#c77722] px-3 py-1.5 text-white">Daily Target</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Number of Days</span>
            <ArrowRight size={14} className="text-[#c77722]" />
            <span className="rounded-lg bg-[#fbf3e4] px-3 py-1.5">Completion</span>
          </div>
        </div>

        {/* Visual 3-Day Explanatory Template Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {exampleDays.map((item, idx) => (
            <div
              key={item.day}
              className="relative flex flex-col justify-between rounded-[22px] border border-[#e4d1b8] bg-[#fffdfa] p-6 shadow-[0_6px_20px_rgba(80,50,20,0.04)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#faedd9] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                    {item.day}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4e4cd] text-[#9c5a17]">
                    <BookOpen size={15} />
                  </div>
                </div>

                <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
                  {item.title}
                </h3>

                <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                  {item.chapters}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#8a571c]">
                  <Clock size={13} className="text-[#c77722]" />
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#ebdcc4] pt-3 text-[11.5px] font-medium text-[#7d674b]">
                {item.status}
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Note */}
        <div className="mx-auto mt-8 max-w-[840px] flex items-start gap-2.5 rounded-xl border border-[#d8b584] bg-[#fffaf0] p-4 text-[12.5px] text-[#705c48]">
          <Info size={16} className="mt-0.5 shrink-0 text-[#c77722]" />
          <div>
            <strong>Generic Explanatory Template:</strong> The 3-day timeline shown above is an illustrative model. In accordance with Veda Structure architecture, each individual Path service defines its own `totalChapters`, `totalSections`, and `dailySchedule` (e.g. Sunderkand in 1 session vs Ramcharitmanas across 9 days).
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathChapterStructureSection;
