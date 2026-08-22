import { Sparkles, ArrowRight } from "lucide-react";

const AstrologerHero = ({
  eyebrow = "Vedic Astrology • Kashi / Varanasi",
  astrologerPrefix = "Astrologer",
  astrologerName = "Vishal Bhardwaj",
  quote = "Understand Your Kundali. Find Clarity in Life.",
  description = "Personalized Vedic Astrology consultation rooted in ancient Kashi traditions. Gain actionable guidance on career, relationships, marriage timing, wealth yogas, and practical Vedic remedies.",
  price = "₹1,100",
  sessionText = "30-Min Audio / Video Session",
  portrait,
  portraitAlt = "Astrologer Vishal Bhardwaj",
  zodiacWheel,
  onBookConsultation,
  onExploreGuidance,
}) => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f8edd8]
        px-5
        py-14

        sm:px-8
        sm:py-18

        lg:px-12
        lg:py-20
      "
    >
      {/* =========================================================
          BACKGROUND ASTROLOGY ART
      ========================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Astrology background */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#f8edd8]
            via-[#f8edd8]/95
            to-[#f8edd8]/35
          "
        />

        {/* Bottom soft fade */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-24
            bg-gradient-to-t
            from-[#f8edd8]
            to-transparent
          "
        />
      </div>

      {/* =========================================================
          HERO CONTENT
      ========================================================== */}
      <div
        className="
          relative
          z-10
          mx-auto
          grid
          max-w-[1280px]
          gap-12
          px-0

          lg:grid-cols-2
          lg:items-center
          lg:gap-14
        "
      >
        {/* =======================================================
            LEFT CONTENT
        ======================================================== */}
        <div
          className="
            space-y-7
            animate-[hero-fade-up_0.8s_ease-out_both]
          "
        >
          {/* Eyebrow */}
          <div className="space-y-3">
            {eyebrow && (
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#d4872b]/30
                  bg-[#fffaf0]/80
                  px-3.5
                  py-1
                  shadow-sm
                  backdrop-blur-sm
                "
              >
                <Sparkles size={13} className="text-[#c77722]" />

                <span
                  className="
                    text-[10.5px]
                    font-bold
                    uppercase
                    tracking-[0.28em]
                    text-[#b36c1e]
                  "
                >
                  {eyebrow}
                </span>
              </div>
            )}

            {/* Main Heading */}
            <h1
              className="
                font-serif
                text-[42px]
                font-semibold
                leading-[1.06]
                tracking-[-0.025em]
                text-[#2b241d]

                sm:text-[54px]
                lg:text-[62px]
              "
            >
              {astrologerPrefix && (
                <>
                  {astrologerPrefix}
                  <br className="hidden sm:inline" />
                </>
              )}
              <span className="text-[#c77722]">{astrologerName}</span>
            </h1>

            {/* Quote */}
            {quote && (
              <p
                className="
                  font-serif
                  text-[21px]
                  italic
                  leading-[1.3]
                  tracking-[-0.01em]
                  text-[#5e5143]

                  sm:text-[25px]
                "
              >
                "{quote}"
              </p>
            )}
          </div>

          {/* =====================================================
              DESCRIPTION + PRICE
          ====================================================== */}
          <div className="max-w-[580px] space-y-5">
            {description && (
              <p
                className="
                  text-[15px]
                  leading-relaxed
                  text-[#685c4f]

                  sm:text-[16px]
                "
              >
                {description}
              </p>
            )}

            {/* Pricing */}
            {price && (
              <div
                className="
                  inline-flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  rounded-2xl
                  border
                  border-[#e6cca0]
                  bg-[#fffaf0]/90
                  px-5
                  py-3
                  shadow-[0_8px_20px_rgba(212,135,43,0.08)]
                  backdrop-blur-sm
                "
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="
                      text-[12px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-[#a8742b]
                    "
                  >
                    Starting
                  </span>

                  <span
                    className="
                      font-serif
                      text-[28px]
                      font-bold
                      text-[#2b241d]
                    "
                  >
                    {price}
                  </span>
                </div>

                {sessionText && (
                  <>
                    <span className="h-4 w-px bg-[#d6b8a0]" />

                    <span
                      className="
                        text-[13px]
                        font-medium
                        text-[#75695c]
                      "
                    >
                      {sessionText}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* =====================================================
              CTA BUTTONS
          ====================================================== */}
          <div
            className="
              flex
              flex-col
              gap-3.5
              pt-2

              sm:flex-row
              sm:items-center
              sm:gap-4
            "
          >
            {/* Primary CTA */}
            <button
              type="button"
              onClick={onBookConsultation}
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2.5
                rounded-full
                bg-gradient-to-r
                from-[#eab12c]
                via-[#f0bb3b]
                to-[#dca522]
                px-8
                py-4
                text-[14px]
                font-bold
                tracking-wide
                text-[#2b241d]
                shadow-[0_10px_28px_rgba(234,177,44,0.28)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_16px_36px_rgba(234,177,44,0.36)]
              "
            >
              BOOK CONSULTATION
              <ArrowRight
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

            {/* Secondary CTA */}
            <button
              type="button"
              onClick={onExploreGuidance}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                border-2
                border-[#d6b8a0]
                bg-white/80
                px-7
                py-3.5
                text-[14px]
                font-bold
                text-[#2b241d]
                backdrop-blur-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#eab12c]
                hover:bg-[#fffaf0]
              "
            >
              EXPLORE GUIDANCE
            </button>
          </div>
        </div>

        {/* =========================================================
            RIGHT SIDE: CELESTIAL WHEEL + ASTROLOGER PORTRAIT
        ========================================================== */}
        <div
          className="
            relative
            flex
            items-center
            justify-center

            lg:justify-center
          "
        >
          {/* =======================================================
              MAIN CELESTIAL COMPOSITION
          ======================================================== */}
          <div
            className="
              relative
              flex
              h-[460px]
              w-full
              max-w-[460px]
              items-center
              justify-center

              sm:h-[520px]
              sm:max-w-[520px]

              lg:h-[600px]
              lg:max-w-[600px]
            "
          >
            {/* =====================================================
                SOFT GOLDEN AURA
            ====================================================== */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[330px]
                w-[330px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-gradient-to-tr
                from-[#eab12c]/[0.20]
                via-[#d4872b]/[0.10]
                to-transparent
                blur-[75px]

                sm:h-[390px]
                sm:w-[390px]

                lg:h-[470px]
                lg:w-[470px]
              "
            />

            {/* =====================================================
                OUTER CELESTIAL RING
            ====================================================== */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[350px]
                w-[350px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-[#d4872b]/[0.14]

                sm:h-[430px]
                sm:w-[430px]

                lg:h-[500px]
                lg:w-[500px]
              "
            />

            {/* =====================================================
                SECOND CELESTIAL RING
            ====================================================== */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                h-[395px]
                w-[395px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-[#eab12c]/[0.10]

                sm:h-[475px]
                sm:w-[475px]

                lg:h-[540px]
                lg:w-[540px]
              "
            />

            {/* =====================================================
                ZODIAC WHEEL (ONLY THIS ELEMENT ROTATES)
            ====================================================== */}
            {zodiacWheel && (
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  z-10
                  -translate-x-1/2
                  -translate-y-1/2
                  select-none
                "
              >
                <img
                  src={zodiacWheel}
                  alt=""
                  aria-hidden="true"
                  className="
                    h-[350px]
                    w-[350px]
                    max-w-none

                    opacity-[0.34]

                    drop-shadow-[0_8px_25px_rgba(212,135,43,0.10)]

                    animate-[zodiac-spin_60s_linear_infinite]

                    sm:h-[430px]
                    sm:w-[430px]

                    lg:h-[500px]
                    lg:w-[500px]
                  "
                  style={{
                    willChange: "transform",
                    transformOrigin: "center center",
                  }}
                />
              </div>
            )}

            {/* =====================================================
                INNER GOLDEN LIGHT
            ====================================================== */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-[48%]
                z-[15]
                h-[190px]
                w-[190px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-[#eab12c]/[0.055]
                blur-[65px]

                sm:h-[230px]
                sm:w-[230px]

                lg:h-[280px]
                lg:w-[280px]
              "
            />

            {/* =====================================================
                PORTRAIT (LARGE + BOTTOM ALIGNED)
            ====================================================== */}
            {portrait && (
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  z-20
                  flex
                  h-full
                  items-end
                  justify-center
                  overflow-visible
                "
              >
                <img
                  src={portrait}
                  alt={portraitAlt}
                  className="
                    relative
                    z-20
                    h-auto
                    w-auto
                    max-w-none
                    select-none
                    object-contain

                    drop-shadow-[0_20px_35px_rgba(43,36,29,0.26)]

                    animate-[hero-portrait-in_1s_ease-out_both]

                    max-h-[430px]

                    sm:max-h-[500px]

                    lg:max-h-[590px]
                  "
                />
              </div>
            )}

            {/* =====================================================
                VERY SOFT GROUNDING SHADOW
            ====================================================== */}
            <div
              className="
                pointer-events-none
                absolute
                bottom-[1%]
                left-1/2
                z-[15]
                h-7
                w-[210px]
                -translate-x-1/2
                rounded-full
                bg-[#8b5a25]/[0.14]
                blur-[22px]

                sm:w-[270px]

                lg:w-[330px]
              "
            />
          </div>
        </div>
      </div>

      {/* =========================================================
          CSS ANIMATIONS
      ========================================================== */}
      <style>{`
        /* =========================================
           ZODIAC ROTATION
        ========================================= */
        @keyframes zodiac-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =========================================
           BACKGROUND DRIFT
        ========================================= */
        @keyframes veda-drift {
          0%,
          100% {
            transform:
              scale(1.06)
              translate3d(0, 0, 0)
              rotate(0deg);
          }

          50% {
            transform:
              scale(1.10)
              translate3d(-10px, 6px, 0)
              rotate(0.3deg);
          }
        }

        /* =========================================
           HERO CONTENT ENTRY
        ========================================= */
        @keyframes hero-fade-up {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =========================================
           PORTRAIT ENTRY
        ========================================= */
        @keyframes hero-portrait-in {
          from {
            opacity: 0;
            transform: translateY(35px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* =========================================
           REDUCED MOTION
        ========================================= */
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[zodiac-spin_60s_linear_infinite\\],
          .animate-\\[veda-drift_70s_ease-in-out_infinite\\],
          .animate-\\[hero-fade-up_0\\.8s_ease-out_both\\],
          .animate-\\[hero-portrait-in_1s_ease-out_both\\] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AstrologerHero;
