import { Sparkles } from "lucide-react";

// Authentic local icon assets
import trisulIcon from "../../../assets/images/Pujas-by-Occasion/trisul.png";
import shaktiIcon from "../../../assets/images/Pujas-by-Occasion/shakti.png";
import lampIcon from "../../../assets/images/Pujas-by-Occasion/lamp.png";
import sunIcon from "../../../assets/images/Pujas-by-Occasion/sun.png";
import moonIcon from "../../../assets/images/Pujas-by-Occasion/moon.png";
import japaMalaIcon from "../../../assets/images/Pujas-by-Occasion/japa-mala.png";
import templeIcon from "../../../assets/images/Pujas-by-Occasion/temple.png";
import chakrasIcon from "../../../assets/images/Pujas-by-Occasion/chakras.png";

/**
 * The 8 client-approved purpose categories mapped to authentic local icons and filter keys.
 */
const PURPOSE_CONFIG = [
  {
    id: "protection",
    title: "Protection",
    filterKey: "Protection",
    icon: trisulIcon,
  },
  {
    id: "marriage",
    title: "Marriage & Relationships",
    filterKey: "Marriage",
    icon: shaktiIcon,
  },
  {
    id: "prosperity",
    title: "Prosperity",
    filterKey: "Prosperity",
    icon: lampIcon,
  },
  {
    id: "health",
    title: "Health & Longevity",
    filterKey: "Health",
    icon: sunIcon,
  },
  {
    id: "peace",
    title: "Peace & Mental Well-being",
    filterKey: "Peace",
    icon: moonIcon,
  },
  {
    id: "education",
    title: "Education & Knowledge",
    filterKey: "Education",
    icon: japaMalaIcon,
  },
  {
    id: "family",
    title: "Family & Home",
    filterKey: "Family",
    icon: templeIcon,
  },
  {
    id: "spiritual-growth",
    title: "Spiritual Growth",
    filterKey: "Spiritual Growth",
    icon: chakrasIcon,
  },
];

/**
 * Compact, editorial Purpose Directory Panel designed to sit alongside
 * Puja Calendar and Selected Ceremony in a unified 3-column row.
 */
const PujaByPurpose = ({ selectedPurpose, onSelectPurpose }) => {
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
    <div className="flex flex-col justify-between rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-4 sm:p-5 shadow-2xs h-full">
      <div>
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[#ebdcc4] pb-3 mb-3.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span>Puja by Purpose</span>
          </div>
          {selectedPurpose && selectedPurpose !== "All" && (
            <button
              type="button"
              onClick={() => handlePurposeClick("All")}
              className="text-[11px] font-semibold text-[#c77722] hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        <div className="mb-3.5">
          <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-[#2b241d] leading-snug">
            Choose a Puja by Purpose
          </h3>
          <p className="mt-0.5 text-[12px] text-[#75695c]">
            Select an intention to filter scheduled ceremonies.
          </p>
        </div>

        {/* 2-Column Compact Directory Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          {PURPOSE_CONFIG.map((category) => {
            const isSelected = selectedPurpose === category.filterKey;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handlePurposeClick(category.filterKey)}
                aria-label={`Filter by ${category.title}`}
                className={`group flex items-center gap-2.5 rounded-[12px] border p-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] cursor-pointer ${
                  isSelected
                    ? "border-[#c77722] bg-[#fff6e5] shadow-xs"
                    : "border-[#ebdcc4] bg-[#fffdfa] hover:border-[#c77722] hover:bg-[#fff9ee] hover:shadow-2xs"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-1 transition-colors ${
                    isSelected ? "bg-[#f5e2bf]" : "bg-[#fbf5e8] group-hover:bg-[#f5e8d0]"
                  }`}
                >
                  <img
                    src={category.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-[18px] w-[18px] object-contain transition-transform duration-200 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <span
                  className={`font-serif text-[12px] sm:text-[12.5px] font-bold leading-tight transition-colors line-clamp-2 ${
                    isSelected ? "text-[#8e4f0d]" : "text-[#2b241d] group-hover:text-[#c77722]"
                  }`}
                >
                  {category.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Subtle Note */}
      <div className="mt-4 border-t border-[#ebdcc4] pt-3 text-[11.5px] text-[#75695c] flex items-center gap-1.5">
        <Sparkles size={12} className="text-[#c77722] shrink-0" />
        <span>Click any purpose to filter ceremonies</span>
      </div>
    </div>
  );
};

export default PujaByPurpose;
