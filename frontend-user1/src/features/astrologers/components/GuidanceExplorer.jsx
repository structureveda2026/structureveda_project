import {
  ArrowRight,
  Briefcase,
  Heart,
  Home,
  Sparkles,
  Stars,
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
      title: "Marriage",
      shortTitle: "Love & Relationships",
      description:
        "Understand compatibility, relationship patterns and important timings for marriage.",
      icon: Heart,
      image: marriageImage,
      accent: "Compatibility • Timing • Relationships",
    },
    {
      id: "career",
      title: "Career",
      shortTitle: "Career & Direction",
      description:
        "Gain clarity around professional growth, opportunities, decisions and important career phases.",
      icon: Briefcase,
      image: careerImage,
      accent: "Growth • Opportunities • Timing",
    },
    {
      id: "family",
      title: "Family",
      shortTitle: "Family & Harmony",
      description:
        "Explore family relationships, harmony and planetary influences affecting your home life.",
      icon: Home,
      image: familyImage,
      accent: "Harmony • Bonds • Understanding",
    },
    {
      id: "business",
      title: "Business",
      shortTitle: "Business & Growth",
      description:
        "Understand business timing, opportunities and periods that may influence important decisions.",
      icon: TrendingUp,
      image: businessImage,
      accent: "Business • Timing • Growth",
    },
    {
      id: "finance",
      title: "Finance",
      shortTitle: "Money & Prosperity",
      description:
        "Explore financial patterns, opportunities and periods associated with prosperity and stability.",
      icon: WalletCards,
      image: financeImage,
      accent: "Wealth • Stability • Prosperity",
    },
    {
      id: "remedies",
      title: "Remedies",
      shortTitle: "Vedic Remedies",
      description:
        "Discover traditional Vedic remedies and practices aligned with your astrological chart.",
      icon: Sparkles,
      image: remediesImage,
      accent: "Remedies • Guidance • Balance",
    },
  ];

  const [activeArea, setActiveArea] = useState(null);

  return (
    <div className="relative">
      {/* =====================================================
          INTRODUCTION
      ====================================================== */}
      <div className="mx-auto mb-10 max-w-[680px] text-center">
        <div
          className="
            mx-auto
            mb-4
            flex
            items-center
            justify-center
            gap-3
          "
        >
          <span className="h-px w-7 bg-[#d4872b]/70" />

          <div
            className="
              flex
              items-center
              gap-2
              text-[#d4872b]
            "
          >
            <Stars size={13} strokeWidth={1.6} />

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.28em]
              "
            >
              Explore Your Path
            </span>
          </div>

          <span className="h-px w-7 bg-[#d4872b]/70" />
        </div>

        <h3
          className="
            font-serif
            text-[25px]
            leading-[1.15]
            tracking-[-0.015em]
            text-[#2b241d]
            sm:text-[29px]
          "
        >
          Choose an area of life
          <span className="text-[#d4872b]"> you want clarity in.</span>
        </h3>

        <p
          className="
            mx-auto
            mt-3
            max-w-[570px]
            text-[13px]
            leading-6
            text-[#75695c]
            sm:text-[14px]
          "
        >
          Explore personalized Vedic guidance for relationships, career, family,
          business, finances and more.
        </p>
      </div>

      {/* =====================================================
          CONSULTATION CARDS
      ====================================================== */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          lg:gap-5
        "
      >
        {areas.map((area, index) => {
          const Icon = area.icon;
          const isActive = activeArea?.id === area.id;

          return (
            <button
              key={area.id}
              type="button"
              onMouseEnter={() => setActiveArea(area)}
              onFocus={() => setActiveArea(area)}
              onClick={() => setActiveArea(area)}
              className={`
                group
                relative
                min-h-[285px]
                overflow-hidden
                rounded-[26px]
                border
                p-6
                text-left
                transition-all
                duration-500
                sm:min-h-[300px]
                sm:p-7

                ${
                  isActive
                    ? `
                      border-[#d4872b]
                      shadow-[0_22px_50px_rgba(180,125,30,0.16)]
                    `
                    : `
                      border-[#ead8b8]
                      shadow-[0_10px_30px_rgba(80,60,30,0.055)]
                      hover:-translate-y-1
                      hover:border-[#d4872b]/70
                      hover:shadow-[0_20px_45px_rgba(180,125,30,0.13)]
                    `
                }
              `}
            >
              {/* =================================================
                  IMAGE BACKGROUND
              ================================================== */}
              <img
                src={area.image}
                alt=""
                aria-hidden="true"
                className={`
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-all
                  duration-700

                  ${
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-[1.06] opacity-0 group-hover:scale-100 group-hover:opacity-100"
                  }
                `}
              />

              {/* =================================================
                  IMAGE OVERLAY
              ================================================== */}
              <div
                className={`
                  absolute
                  inset-0
                  transition-opacity
                  duration-700

                  ${
                    isActive
                      ? "bg-gradient-to-br from-[#2b241d]/80 via-[#2b241d]/55 to-[#8d571f]/55 opacity-100"
                      : "bg-gradient-to-br from-[#2b241d]/85 via-[#2b241d]/60 to-[#8d571f]/60 opacity-0 group-hover:opacity-100"
                  }
                `}
              />

              {/* =================================================
                  GOLD WASH
              ================================================== */}
              <div
                className={`
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-[#eab12c]/15
                  via-transparent
                  to-[#d4872b]/10
                  transition-opacity
                  duration-700

                  ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }
                `}
              />

              {/* =================================================
                  DECORATIVE ASTROLOGY RING
              ================================================== */}
              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-[190px]
                  w-[190px]
                  rounded-full
                  border
                  border-[#eab12c]/20
                  transition-all
                  duration-700

                  ${
                    isActive
                      ? "scale-100 rotate-0 opacity-100"
                      : "scale-90 -rotate-12 opacity-0 group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100"
                  }
                `}
              />

              <div
                className={`
                  pointer-events-none
                  absolute
                  -right-5
                  -top-5
                  h-[125px]
                  w-[125px]
                  rounded-full
                  border
                  border-white/10
                  transition-opacity
                  duration-700

                  ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }
                `}
              />

              {/* =================================================
                  CONTENT
              ================================================== */}
              <div className="relative z-10 flex h-full flex-col">
                {/* Top row */}
                <div className="flex items-start justify-between">
                  {/* Number */}
                  <span
                    className={`
                      text-[10px]
                      font-bold
                      tracking-[0.18em]
                      transition-colors
                      duration-500

                      ${
                        isActive
                          ? "text-[#f6c85f]"
                          : "text-[#b5a28a] group-hover:text-[#f6c85f]"
                      }
                    `}
                  >
                    0{index + 1}
                  </span>

                  {/* Icon */}
                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      transition-all
                      duration-500

                      ${
                        isActive
                          ? `
                            bg-[#eab12c]
                            text-[#2b241d]
                            shadow-[0_10px_28px_rgba(234,177,44,0.30)]
                          `
                          : `
                            border
                            border-[#e6c98d]
                            bg-[#fffaf0]
                            text-[#d4872b]
                            group-hover:scale-110
                            group-hover:border-[#eab12c]
                            group-hover:bg-[#eab12c]
                            group-hover:text-[#2b241d]
                            group-hover:shadow-[0_10px_25px_rgba(234,177,44,0.25)]
                          `
                      }
                    `}
                  >
                    <Icon size={20} strokeWidth={1.6} />
                  </div>
                </div>

                {/* Main content */}
                <div className="mt-auto">
                  {/* Category */}
                  <p
                    className={`
                      mb-2
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.22em]
                      transition-colors
                      duration-500

                      ${
                        isActive
                          ? "text-[#f6c85f]"
                          : "text-[#d4872b] group-hover:text-[#f6c85f]"
                      }
                    `}
                  >
                    {area.accent}
                  </p>

                  {/* Title */}
                  <h3
                    className={`
                      font-serif
                      text-[27px]
                      leading-[1.05]
                      tracking-[-0.015em]
                      transition-colors
                      duration-500

                      ${
                        isActive
                          ? "text-white"
                          : "text-[#2b241d] group-hover:text-white"
                      }
                    `}
                  >
                    {area.shortTitle}
                  </h3>

                  {/* Description */}
                  <p
                    className={`
                      mt-3
                      max-w-[370px]
                      text-[12px]
                      leading-6
                      transition-colors
                      duration-500

                      ${
                        isActive
                          ? "text-white/75"
                          : "text-[#75695c] group-hover:text-white/75"
                      }
                    `}
                  >
                    {area.description}
                  </p>

                  {/* Bottom CTA */}
                  <div
                    className={`
                      mt-5
                      flex
                      items-center
                      justify-between
                    `}
                  >
                    <span
                      className={`
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.13em]
                        transition-colors
                        duration-500

                        ${
                          isActive
                            ? "text-white"
                            : "text-[#2b241d] group-hover:text-white"
                        }
                      `}
                    >
                      Explore {area.title}
                    </span>

                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-500

                        ${
                          isActive
                            ? `
                              bg-[#eab12c]
                              text-[#2b241d]
                              shadow-[0_8px_20px_rgba(234,177,44,0.25)]
                            `
                            : `
                              border
                              border-[#e6c98d]
                              bg-[#fffaf0]
                              text-[#d4872b]
                              group-hover:translate-x-1
                              group-hover:border-[#eab12c]
                              group-hover:bg-[#eab12c]
                              group-hover:text-[#2b241d]
                            `
                        }
                      `}
                    >
                      <ArrowRight size={15} strokeWidth={1.8} />
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ACTIVE BOTTOM LINE
              ================================================== */}
              <span
                className={`
                  absolute
                  bottom-0
                  left-6
                  h-[3px]
                  rounded-full
                  bg-[#eab12c]
                  transition-all
                  duration-500

                  ${
                    isActive
                      ? "w-16 opacity-100"
                      : "w-0 opacity-0 group-hover:w-12 group-hover:opacity-100"
                  }
                `}
              />
            </button>
          );
        })}
      </div>

      {/* =====================================================
          BOTTOM MICRO TRUST LINE
      ====================================================== */}
      <div
        className="
          mt-8
          flex
          flex-wrap
          items-center
          justify-center
          gap-x-5
          gap-y-2
          text-center
        "
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
          <span className="text-[10px] font-medium text-[#806f5b]">
            Personalized Guidance
          </span>
        </div>

        <span className="text-[#d4872b]/40">✦</span>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
          <span className="text-[10px] font-medium text-[#806f5b]">
            Based on Your Birth Chart
          </span>
        </div>

        <span className="text-[#d4872b]/40">✦</span>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
          <span className="text-[10px] font-medium text-[#806f5b]">
            Private & Confidential
          </span>
        </div>
      </div>

      {/* =====================================================
          ACCESSIBILITY / MOTION
      ====================================================== */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GuidanceExplorer;
