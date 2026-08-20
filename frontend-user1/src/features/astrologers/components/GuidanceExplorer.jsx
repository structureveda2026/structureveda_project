import {
  ArrowRight,
  Briefcase,
  Heart,
  Home,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

const GuidanceExplorer = ({
  marriageImage,
  careerImage,
  familyImage,
  businessImage,
  financeImage,
  remediesImage,
}) => {
  const areas = [
    {
      id: "marriage",
      number: "01",
      title: "Marriage & Relationships",
      shortTitle: "Marriage & Love",
      description:
        "Understand compatibility, relationship dynamics, timing of marriage, and remedies for harmony in partnership.",
      icon: Heart,
      image: marriageImage,
      accent: "Compatibility • Timing • Partnerships",
    },
    {
      id: "career",
      number: "02",
      title: "Career & Profession",
      shortTitle: "Career & Growth",
      description:
        "Gain strategic clarity on job transitions, promotions, business decisions, and auspicious timing for growth.",
      icon: Briefcase,
      image: careerImage,
      accent: "Growth • Opportunities • Decisions",
    },
    {
      id: "family",
      number: "03",
      title: "Family & Home Life",
      shortTitle: "Family & Peace",
      description:
        "Address domestic challenges, ancestral influences, and planetary placements affecting peace at home.",
      icon: Home,
      image: familyImage,
      accent: "Harmony • Peace • Understanding",
    },
    {
      id: "business",
      number: "04",
      title: "Business & Ventures",
      shortTitle: "Business Timing",
      description:
        "Identify high-potential phases, partnership compatibility, and planetary periods to minimize financial risks.",
      icon: TrendingUp,
      image: businessImage,
      accent: "Expansion • Timing • Success",
    },
    {
      id: "finance",
      number: "05",
      title: "Wealth & Finance",
      shortTitle: "Wealth & Prosperity",
      description:
        "Discover wealth yogas, manage financial turbulence, and identify optimal periods for investments.",
      icon: WalletCards,
      image: financeImage,
      accent: "Stability • Investments • Prosperity",
    },
    {
      id: "remedies",
      number: "06",
      title: "Vedic Remedies & Guidance",
      shortTitle: "Remedies & Balance",
      description:
        "Authentic planetary remedies, mantra recommendations, and spiritual rituals aligned specifically with your Kundali.",
      icon: Sparkles,
      image: remediesImage,
      accent: "Mantra • Puja • Planetary Balance",
    },
  ];

  const [activeArea, setActiveArea] = useState(null);

  return (
    <div className="relative">
      {/* =====================================================
          GUIDANCE CARDS GRID (Images always visible)
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {areas.map((area) => {
          const Icon = area.icon;
          const isActive = activeArea === area.id;

          return (
            <div
              key={area.id}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setActiveArea(area.id)}
              onMouseLeave={() => setActiveArea(null)}
              onFocus={() => setActiveArea(area.id)}
              onBlur={() => setActiveArea(null)}
              onClick={() => setActiveArea(area.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveArea(area.id);
                }
              }}
              className={`
                group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[24px] border
                p-6 text-left transition-all duration-500 sm:min-h-[360px] sm:p-7 cursor-pointer
                ${
                  isActive
                    ? "border-[#eab12c] shadow-[0_22px_50px_rgba(180,125,30,0.22)] -translate-y-1.5"
                    : "border-[#d8c39e]/70 shadow-[0_12px_32px_rgba(43,36,29,0.08)] hover:-translate-y-1.5 hover:border-[#eab12c] hover:shadow-[0_20px_45px_rgba(212,135,43,0.18)]"
                }
              `}
            >
              {/* =================================================
                  BACKGROUND IMAGE (Always Visible)
              ================================================== */}
              <div className="absolute inset-0 -z-20 overflow-hidden bg-[#1f1711]">
                <img
                  src={area.image}
                  alt={area.title}
                  className="h-full w-full object-cover object-center opacity-70 transition-transform duration-700 ease-out group-hover:scale-108 group-hover:opacity-80"
                />
              </div>

              {/* =================================================
                  MULTI-LAYER GRADIENT OVERLAY FOR HIGH READABILITY
              ================================================== */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#16100b] via-[#1c140df0]/90 to-[#22170f70]/60 transition-colors duration-500 group-hover:via-[#1c140df0]/85" />

              {/* Warm Golden Sheen Accent */}
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#eab12c]/15 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

              {/* =================================================
                  TOP BAR (Badge + Icon)
              ================================================== */}
              <div className="flex items-start justify-between">
                {/* Number Chip */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eab12c]/40 bg-[#251b13]/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#f3cb65] backdrop-blur-md transition-colors duration-300 group-hover:border-[#eab12c] group-hover:bg-[#2e2015]">
                  <span>{area.number}</span>
                  <span className="text-[8px] text-[#eab12c]/60">✦</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#dfc599]">
                    Area
                  </span>
                </span>

                {/* Circular Icon Chip */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eab12c]/40 bg-[#271d15]/80 text-[#eab12c] shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-[#eab12c] group-hover:bg-[#eab12c] group-hover:text-[#18110b] group-hover:shadow-[0_6px_22px_rgba(234,177,44,0.35)]">
                  <Icon size={19} strokeWidth={1.8} />
                </div>
              </div>

              {/* =================================================
                  MAIN CONTENT (Category, Title, Description)
              ================================================== */}
              <div className="mt-8 flex flex-col justify-end sm:mt-10">
                {/* Accent Subtitle / Pill */}
                <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#eab12c]">
                  {area.accent}
                </p>

                {/* Card Title */}
                <h3 className="font-serif text-[24px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#fffaf0] transition-colors duration-300 group-hover:text-[#ffdf88] sm:text-[27px]">
                  {area.title}
                </h3>

                {/* Card Description */}
                <p className="mt-2.5 text-[13.5px] font-normal leading-[1.65] text-[#d4c5b1] transition-colors duration-300 group-hover:text-[#ece1d2]">
                  {area.description}
                </p>

                {/* Bottom Interactive CTA Row */}
                <div className="mt-5 flex items-center justify-between border-t border-[#eab12c]/20 pt-4">
                  <span className="text-[12px] font-semibold tracking-wide text-[#f5ce6f] transition-colors duration-300 group-hover:text-white">
                    Explore Guidance
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eab12c]/20 text-[#f5ce6f] transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#eab12c] group-hover:text-[#18110b]">
                    <ArrowRight size={15} strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Bottom Gold Line Highlight */}
              <span
                className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#eab12c] via-[#ffdf88] to-transparent transition-all duration-500 ${
                  isActive
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuidanceExplorer;
