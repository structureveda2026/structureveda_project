import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Sun,
  Compass,
  GraduationCap,
  Home,
  Flame,
  ArrowRight,
} from "lucide-react";
import { PUJA_LIST } from "../data/pujaData";

/**
 * Presentation configuration for the 8 manager-approved purpose categories.
 * Contains concise, client-provided copy and elegant icons for an editorial directory.
 */
const PURPOSE_CONFIG = [
  {
    id: "protection",
    title: "Protection",
    filterKey: "Protection",
    description: "Negative influences, protection & spiritual strength",
    icon: ShieldCheck,
  },
  {
    id: "marriage",
    title: "Marriage & Relationships",
    filterKey: "Marriage",
    description: "Harmony, marriage & relationship blessings",
    icon: Heart,
  },
  {
    id: "prosperity",
    title: "Prosperity",
    filterKey: "Prosperity",
    description: "Wealth, abundance & financial growth",
    icon: Sparkles,
  },
  {
    id: "health",
    title: "Health & Longevity",
    filterKey: "Health",
    description: "Well-being, longevity & healing prayers",
    icon: Sun,
  },
  {
    id: "peace",
    title: "Peace & Mental Well-being",
    filterKey: "Peace",
    description: "Inner peace and spiritual balance",
    icon: Compass,
  },
  {
    id: "education",
    title: "Education & Knowledge",
    filterKey: "Education",
    description: "Focus, learning & wisdom",
    icon: GraduationCap,
  },
  {
    id: "family",
    title: "Family & Home",
    filterKey: "Family",
    description: "Family harmony and household well-being",
    icon: Home,
  },
  {
    id: "spiritual-growth",
    title: "Spiritual Growth",
    filterKey: "Spiritual Growth",
    description: "Sadhana, devotion and spiritual discipline",
    icon: Flame,
  },
];

const PujaByPurpose = ({ selectedPurpose, onSelectPurpose }) => {
  // Dynamically calculate upcoming event counts for each category from PUJA_LIST
  const eventCountMap = useMemo(() => {
    const now = Date.now();
    const map = {};

    PURPOSE_CONFIG.forEach((cat) => {
      const count = PUJA_LIST.filter(
        (p) =>
          (!p.startDateTime || new Date(p.startDateTime).getTime() > now) &&
          (p.purposeCategory === cat.filterKey ||
            (Array.isArray(p.purposeCategories) && p.purposeCategories.includes(cat.filterKey)))
      ).length;
      map[cat.filterKey] = count;
    });

    return map;
  }, []);

  const handlePurposeClick = (filterKey) => {
    if (onSelectPurpose) {
      onSelectPurpose(filterKey);
    }
    const targetElement = document.getElementById("upcoming-ceremonies");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="puja-by-purpose"
      aria-label="Puja by Purpose Category Directory"
      className="mt-14 mb-12 sm:mt-18 sm:mb-16 border-t border-[#ebdcc4] pt-12 sm:pt-16"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12 items-start">
        
        {/* ── Left Side: Section Intro (4 cols on desktop) ── */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span>PUJA BY PURPOSE</span>
          </div>
          <h2 className="font-serif text-[26px] font-bold leading-tight text-[#2b241d] sm:text-[30px] lg:text-[32px]">
            Choose a Puja Based on Your Purpose
          </h2>
          <p className="text-[14px] leading-relaxed text-[#6b5d4e]">
            Find sacred ceremonies aligned with your intention.
          </p>
        </div>

        {/* ── Right Side: 8-Item Purpose Directory (8 cols on desktop, 2-col grid) ── */}
        <div className="lg:col-span-8 xl:col-span-8">
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5">
            {PURPOSE_CONFIG.map((category) => {
              const Icon = category.icon;
              const count = eventCountMap[category.filterKey] || 0;
              const hasUpcomingEvents = count > 0;
              const isSelected = selectedPurpose === category.filterKey;

              if (hasUpcomingEvents) {
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handlePurposeClick(category.filterKey)}
                    aria-label={`Explore upcoming ceremonies for ${category.title}`}
                    className={`group flex items-start justify-between rounded-[14px] border p-3.5 sm:p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] ${
                      isSelected
                        ? "border-l-3 border-l-[#c77722] border-[#ebdcc4] bg-[#fff6e5] shadow-2xs"
                        : "border-l-3 border-l-transparent border-[#ebdcc4] bg-[#fffdfa] hover:bg-[#fff9ee] hover:border-l-[#eab12c] hover:border-[#d6b8a0]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                          isSelected
                            ? "bg-[#c77722] text-[#fffdfa]"
                            : "bg-[#fbf5e8] text-[#c77722] group-hover:bg-[#f5e8d0]"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="pr-1">
                        <h3
                          className={`font-serif text-[15.5px] font-bold leading-snug transition-colors ${
                            isSelected
                              ? "text-[#8e4f0d]"
                              : "text-[#2b241d] group-hover:text-[#c77722]"
                          }`}
                        >
                          {category.title}
                        </h3>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-[#685c4f]">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="pl-2 pt-1 text-[#b36c1e] transition-transform duration-200 group-hover:translate-x-1 shrink-0">
                      <ArrowRight size={14} />
                    </div>
                  </button>
                );
              }

              return (
                <Link
                  key={category.id}
                  to="/yagya-puja/puja"
                  aria-label={`Explore available pujas for ${category.title} in catalogue`}
                  className={`group flex items-start justify-between rounded-[14px] border p-3.5 sm:p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] ${
                    isSelected
                      ? "border-l-3 border-l-[#c77722] border-[#ebdcc4] bg-[#fff6e5] shadow-2xs"
                      : "border-l-3 border-l-transparent border-[#ebdcc4] bg-[#fffdfa] hover:bg-[#fff9ee] hover:border-l-[#eab12c] hover:border-[#d6b8a0]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isSelected
                          ? "bg-[#c77722] text-[#fffdfa]"
                          : "bg-[#fbf5e8] text-[#c77722] group-hover:bg-[#f5e8d0]"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="pr-1">
                      <h3
                        className={`font-serif text-[15.5px] font-bold leading-snug transition-colors ${
                          isSelected
                            ? "text-[#8e4f0d]"
                            : "text-[#2b241d] group-hover:text-[#c77722]"
                        }`}
                      >
                        {category.title}
                      </h3>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-[#685c4f]">
                        {category.description}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#b36c1e] group-hover:underline">
                        Explore Pujas
                      </span>
                    </div>
                  </div>

                  <div className="pl-2 pt-1 text-[#b36c1e] transition-transform duration-200 group-hover:translate-x-1 shrink-0">
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PujaByPurpose;

