import { Clock, Info, Check } from "lucide-react";

const PujaDurationSection = ({ selectedDuration, onSelectDuration }) => {
  const durations = [
    {
      hours: "2 HOURS",
      title: "Essential Vidhi",
      subtitle: "For selected Puja services.",
      description:
        "Prescribed for standard household invocations, daily Gotra Sankalp archana, and focused single-deity Vedic rituals.",
      filterVal: "2 Hours",
    },
    {
      hours: "3 HOURS",
      title: "Detailed Shastric Vidhi",
      subtitle: "For selected detailed ritual arrangements.",
      description:
        "Accommodates comprehensive panchamrit abhishekam, extended Vedic Suktam avartans, and dedicated havan offerings.",
      filterVal: "3 Hours",
    },
    {
      hours: "5 HOURS",
      title: "Extended Mahapuja Vidhi",
      subtitle: "For selected extended Puja procedures.",
      description:
        "Designed for intricate Navagraha shanti, multi-priest anushthan, elaborate mandalas, and complete purnahuti vidhi.",
      filterVal: "5 Hours",
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            RITUAL DURATION & RIGOR
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Choose Your Puja Duration
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Available duration depends on the selected Puja and its prescribed ritual requirements.
          </p>
        </div>

        {/* Duration Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {durations.map((item) => {
            const isSelected = selectedDuration === item.filterVal;

            return (
              <div
                key={item.hours}
                className={`relative flex flex-col justify-between rounded-[22px] border p-7 transition-all duration-300 ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffdfa] shadow-[0_10px_28px_rgba(199,119,34,0.12)] ring-2 ring-[#c77722]/20"
                    : "border-[#ebdcc4] bg-[#fffdfa] shadow-2xs hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8edd8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                      <Clock size={12} className="text-[#c77722]" />
                      {item.hours}
                    </span>
                    {isSelected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eab12c] text-[#1c1308]">
                        <Check size={14} />
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-serif text-[22px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-[#b36c1e]">
                    {item.subtitle}
                  </p>

                  <p className="mt-3.5 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#f0e2cd] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectDuration) {
                        onSelectDuration(isSelected ? "All Durations" : item.filterVal);
                      }
                      const el = document.getElementById("puja-catalogue");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full rounded-full border border-[#d6b8a0] bg-white py-2.5 text-[12.5px] font-semibold text-[#2b241d] transition-colors hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] cursor-pointer"
                  >
                    {isSelected ? "Clear Duration Filter" : `Filter by ${item.hours}`}
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
            <strong>Prescribed Vidhi Notice:</strong> Duration options belong to individual Puja service configurations.
            When you view a specific Puja detail page, only the ritual durations authentically recognized for that sacred ceremony will be available.
          </span>
        </div>
      </div>
    </section>
  );
};

export default PujaDurationSection;
