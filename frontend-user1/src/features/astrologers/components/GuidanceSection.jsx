import GuidanceExplorer from "./GuidanceExplorer";

const GuidanceSection = ({
  marriageImage,
  careerImage,
  familyImage,
  businessImage,
  financeImage,
  remediesImage,
}) => {
  return (
    <section
      id="guidance-section"
      className="
        reveal-on-scroll
        scroll-mt-20
        sm:scroll-mt-24
        relative
        overflow-hidden
        border-b
        border-[#ead8b8]
        bg-[#f8edd8]
        px-5
        py-20
        sm:px-8
        sm:py-24
        lg:px-12
        lg:py-28
      "
    >
      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}
      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-10
          h-[520px]
          w-[520px]
          animate-[vedaGlow_9s_ease-in-out_infinite]
          rounded-full
          bg-[#eab12c]/[0.055]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-48
          bottom-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-[#d4872b]/[0.025]
          blur-[110px]
        "
      />

      {/* Very subtle center light */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[42%]
          h-[300px]
          w-[300px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/40
          blur-[100px]
        "
      />

      <div className="relative mx-auto max-w-[1240px]">
        {/* ========================================
            SECTION HEADER
        ======================================== */}
        <div
          className="
            mx-auto
            mb-12
            max-w-[760px]
            text-center
            animate-[vedaFadeUp_800ms_ease-out_both]
            sm:mb-16
          "
        >
          {/* Eyebrow */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d4872b]/70" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              Consultation Areas
            </p>
            <span className="h-px w-8 bg-[#d4872b]/70" />
          </div>

          {/* Main heading */}
          <h2
            className="
              font-serif
              text-[36px]
              font-semibold
              leading-[1.1]
              tracking-[-0.025em]
              text-[#2b241d]
              sm:text-[46px]
              lg:text-[52px]
            "
          >
            What Would You Like{" "}
            <span className="text-[#c77722]">Clarity About?</span>
          </h2>

          {/* Short description */}
          <p
            className="
              mx-auto
              mt-4
              max-w-[560px]
              text-[15px]
              leading-relaxed
              text-[#6e6255]
              sm:text-[16px]
            "
          >
            Choose a specific area of life to explore personalized Vedic
            analysis, planetary timings, and practical remedies.
          </p>
        </div>

        {/* ========================================
            INTERACTIVE EXPLORER
        ======================================== */}
        <div className="animate-[vedaFadeUp_900ms_ease-out_250ms_both]">
          <GuidanceExplorer
            marriageImage={marriageImage}
            careerImage={careerImage}
            familyImage={familyImage}
            businessImage={businessImage}
            financeImage={financeImage}
            remediesImage={remediesImage}
          />
        </div>

        {/* ========================================
            BOTTOM TRUST MICRO-LINE
        ======================================== */}
        <div
          className="
            mt-12
            flex
            flex-wrap
            items-center
            justify-center
            gap-x-5
            gap-y-2.5
            animate-[vedaFadeIn_1000ms_ease-out_600ms_both]
          "
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4872b]" />
            <span className="text-[12px] font-semibold text-[#5e5245]">
              Personalized Guidance
            </span>
          </div>

          <span className="text-[10px] text-[#d4872b]/60">✦</span>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4872b]" />
            <span className="text-[12px] font-semibold text-[#5e5245]">
              Kundali & Dasha Timing
            </span>
          </div>

          <span className="text-[10px] text-[#d4872b]/60">✦</span>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4872b]" />
            <span className="text-[12px] font-semibold text-[#5e5245]">
              100% Private & Confidential
            </span>
          </div>
        </div>
      </div>

      {/* ========================================
          ANIMATIONS
      ======================================== */}
      <style>{`
        @keyframes vedaFadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes vedaFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes vedaLine {
          from {
            opacity: 0;
            transform: scaleX(0);
          }

          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes vedaGlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.7;
          }

          50% {
            transform: translate3d(-25px, 20px, 0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GuidanceSection;
