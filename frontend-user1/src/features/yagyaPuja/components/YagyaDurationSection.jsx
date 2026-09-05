import { Clock, Info, Check, Calendar } from "lucide-react";

const YagyaDurationSection = ({ selectedDuration, onSelectDuration }) => {
  const durationOptions = [
    {
      days: 3,
      title: "3 DAYS",
      dailyHours: "5 Hours / Day",
      subtitle: "For focused intention Yagyas",
      description: "Includes initial altar sthapana, 3 consecutive days of disciplined Japa, daily havan ahutis, and Purnahuti.",
    },
    {
      days: 5,
      title: "5 DAYS",
      dailyHours: "5 Hours / Day",
      subtitle: "For standard Vedic anushthans",
      description: "Structured for comprehensive planetary mitigation, Sri Suktam or Ganapatya multi-priest chanting with extensive havan.",
    },
    {
      days: 7,
      title: "7 DAYS",
      dailyHours: "5 Hours / Day",
      subtitle: "For major family or spiritual vows",
      description: "Full Saptaha ritual with multiple Ahuti sessions, deep mantra japa commitments, and complete Shastric vidhi.",
    },
    {
      days: 9,
      title: "9 DAYS",
      dailyHours: "5 Hours / Day",
      subtitle: "Navaratri & Shakta anushthans",
      description: "Continuous 9-day holy observance traditionally suited for Durga Chandi and high-volume ahuti ceremonies.",
    },
    {
      days: 11,
      title: "11 DAYS",
      dailyHours: "5 Hours / Day",
      subtitle: "Maha Rudra & extended Yagyas",
      description: "Highest level traditional Vedic observance with full team of trained Purohits and extensive daily havan offerings.",
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            MULTI-DAY DURATION & DAILY RIGOR
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Choose Your Yagya Duration
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Available duration depends on the selected Yagya and its prescribed ritual configuration.
          </p>
        </div>

        {/* 5 Duration Cards Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {durationOptions.map((item) => {
            const isSelected = selectedDuration === item.days;

            return (
              <div
                key={item.days}
                className={`relative flex flex-col justify-between rounded-[22px] border p-6 transition-all duration-300 ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffdfa] shadow-[0_10px_28px_rgba(199,119,34,0.12)] ring-2 ring-[#c77722]/20"
                    : "border-[#ebdcc4] bg-[#fffdfa] shadow-2xs hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f8edd8] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                      <Calendar size={12} className="text-[#c77722]" />
                      {item.title}
                    </span>
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eab12c] text-[#1c1308]">
                        <Check size={14} />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-[#2b241d]">
                    <Clock size={13} className="text-[#d4872b]" />
                    <span>{item.dailyHours}</span>
                  </div>

                  <p className="mt-2 text-[12px] font-semibold text-[#b36c1e]">
                    {item.subtitle}
                  </p>

                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#685c4f]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#f0e2cd] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectDuration) {
                        onSelectDuration(isSelected ? "All" : item.days);
                      }
                      const el = document.getElementById("yagya-catalogue");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full rounded-full border border-[#d6b8a0] bg-white py-2 text-[12px] font-semibold text-[#2b241d] transition-colors hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] cursor-pointer"
                  >
                    {isSelected ? "Clear Filter" : `Filter ${item.title}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Business Rule Notice */}
        <div className="mt-8 flex items-start gap-2.5 rounded-[16px] border border-[#ebdcc4] bg-[#fbf6ec] p-4 text-[13px] text-[#756653]">
          <Info size={16} className="mt-0.5 shrink-0 text-[#b36c1e]" />
          <span>
            <strong>Service-Specific Configuration Rule:</strong> Available durations belong to each individual Yagya's prescribed vidhi.
            For example, Maha Mrityunjaya supports 3, 5, 7, 9, or 11 days, whereas Ganapati Yagya is prescribed for 3 or 5 days.
            When viewing a Yagya detail page, only authentically available durations will be presented.
          </span>
        </div>
      </div>
    </section>
  );
};

export default YagyaDurationSection;
