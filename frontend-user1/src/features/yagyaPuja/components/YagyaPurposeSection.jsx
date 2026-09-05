import { Sparkles, Heart, Flame, Calendar, Compass, Sun, ArrowRight } from "lucide-react";
import { YAGYA_PURPOSE_CATEGORIES } from "../data/yagyaCatalogueData";

const ICON_MAP = {
  Sparkles: Sparkles,
  Heart: Heart,
  Flame: Flame,
  Calendar: Calendar,
  Compass: Compass,
  Sun: Sun,
};

const YagyaPurposeSection = ({ selectedPurpose, onSelectPurpose }) => {
  const handlePurposeClick = (title) => {
    if (onSelectPurpose) {
      onSelectPurpose(title);
    }
    const el = document.getElementById("yagya-catalogue");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            INTENTION & SCOPE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            When a Structured Yagya Is Required
          </h2>
          <p className="mx-auto mt-3.5 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Multi-day Yagyas are arranged when a spiritual intention or ritual observance requires dedicated multi-day commitment.
          </p>
        </div>

        {/* 6 Structured Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {YAGYA_PURPOSE_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || Sparkles;
            const isSelected = selectedPurpose === cat.title;

            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => handlePurposeClick(cat.title)}
                className={`group flex flex-col justify-between rounded-[22px] border p-7 text-left transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fffdfa] shadow-[0_10px_28px_rgba(199,119,34,0.12)] ring-2 ring-[#c77722]/20"
                    : "border-[#ebdcc4] bg-[#fffdfa] shadow-2xs hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-[#eab12c] text-[#1c1308]"
                          : "bg-[#f8edd8] text-[#c77722] group-hover:bg-[#eab12c] group-hover:text-[#1c1308]"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    {isSelected && (
                      <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10.5px] font-bold text-[#b36c1e]">
                        Selected
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-serif text-[20px] font-bold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                    {cat.title}
                  </h3>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-[12.5px] font-bold text-[#b36c1e] transition-colors group-hover:text-[#2b241d]">
                  <span>Explore Yagyas</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default YagyaPurposeSection;
