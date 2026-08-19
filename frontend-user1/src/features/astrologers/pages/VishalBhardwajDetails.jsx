import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Briefcase,
  TrendingUp,
  Home as HomeIcon,
  ChevronDown,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Zap,
  Star,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import marriageImage from "../../../assets/images/guidance-marriage.png";
import careerImage from "../../../assets/images/guidance-career.png";
import familyImage from "../../../assets/images/guidance-family.png";
import businessImage from "../../../assets/images/guidance-business.png";
import financeImage from "../../../assets/images/guidance-finance.png";
import remediesImage from "../../../assets/images/guidance-remedies.png";
import vishalImage from "../../../assets/images/e-3.jpg";
// import vedaAstroBackgroundImage from "../../../assets/images/vishal-vedic-astrology-bg1.png";
import vedaAstroBackgroundImage from "../../../assets/images/vishal-vedic-astrology-bg1.png";
import GuidanceExplorer from "../components/GuidanceExplorer";

const VishalBhardwajDetails = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleBookConsultation = () => {
    navigate("/astrologers/vishal-bhardwaj/book-consultation");
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Consultation कितने समय की है?",
      answer: "30 minutes.",
    },
    {
      question: "Consultation online होगी?",
      answer: "हाँ, online audio/video consultation.",
    },
    {
      question: "क्या मुझे अपनी Kundali पहले से बनवानी होगी?",
      answer:
        "नहीं, यदि आपके पास birth details हैं तो आवश्यक chart analysis consultation के दौरान किया जा सकता है।",
    },
    {
      question: "क्या मैं multiple questions पूछ सकता हूँ?",
      answer:
        "हाँ, लेकिन consultation का समय सीमित होने के कारण पहले अपने सबसे महत्वपूर्ण questions को प्राथमिकता देना बेहतर है।",
    },
    {
      question: "क्या consultation confidential है?",
      answer:
        "हाँ, आपकी personal और birth information को confidential रखा जाता है।",
    },
    {
      question: "क्या remedies भी बताई जाएंगी?",
      answer:
        "यदि आपकी consultation के संदर्भ में आवश्यक हो, तो suitable Vedic remedies बताए जा सकते हैं।",
    },
    {
      question: "क्या consultation के बाद Puja/Rudrabhishek करवाना जरूरी है?",
      answer:
        "नहीं। किसी भी remedy को आपकी specific situation और आवश्यकता के अनुसार समझाया जाना चाहिए।",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* ========================================
          HERO SECTION
      ======================================== */}
      <section className="relative isolate overflow-hidden border-b border-[#ead8b8] bg-[#f8edd8]">
        {/* =========================================================
      VEDIC ASTROLOGY BACKGROUND
      Large decorative artwork behind the hero
  ========================================================== */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <img
            src={vedaAstroBackgroundImage}
            alt=""
            aria-hidden="true"
            className="
        absolute
        right-[-18%]
        top-[-8%]
        h-[125%]
        w-[85%]
        max-w-none
        object-cover
        object-right
        opacity-[0.13]
        mix-blend-multiply
        animate-[veda-drift_70s_ease-in-out_infinite]
        lg:right-[-12%]
        lg:w-[78%]
        lg:opacity-[0.14]
      "
          />

          {/* Warm glow around the astrology artwork */}
          <div
            className="
        absolute
        right-[5%]
        top-[12%]
        h-[600px]
        w-[600px]
        rounded-full
        bg-[#d4872b]/[0.07]
        blur-[110px]
      "
          />

          {/* Left-side readability gradient */}
          <div
            className="
        absolute
        inset-0
        bg-gradient-to-r
        from-[#f8edd8]
        via-[#f8edd8]/95
        to-[#f8edd8]/30
      "
          />

          {/* Soft bottom fade */}
          <div
            className="
        absolute
        inset-x-0
        bottom-0
        h-32
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
      max-w-[1240px]
      gap-12
      px-5
      py-20
      sm:px-8
      lg:grid-cols-2
      lg:items-center
      lg:gap-16
      lg:px-12
      lg:py-28
    "
        >
          {/* =======================================================
        LEFT CONTENT
    ======================================================== */}
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
                VEDIC ASTROLOGY • KASHI / VARANASI
              </p>

              <h1
                className="
            max-w-[700px]
            font-serif
            text-[44px]
            leading-[1.05]
            tracking-[-0.02em]
            text-[#2b241d]
            sm:text-[56px]
            lg:text-[64px]
          "
              >
                Astrologer Vishal Bhardwaj
              </h1>

              <p
                className="
            max-w-[560px]
            font-serif
            text-[22px]
            leading-[1.3]
            tracking-[-0.01em]
            text-[#75695c]
            sm:text-[26px]
          "
              >
                "Understand Your Kundali.
                <br />
                Find Clarity in Life."
              </p>
            </div>

            <div className="max-w-[620px] space-y-4">
              <p className="text-[16px] leading-8 text-[#75695c]">
                Personalized Vedic Astrology consultation based on your birth
                chart. Guidance on career, relationships, timing and life
                decisions.
              </p>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-[32px] font-semibold text-[#2b241d]">
                  Starting ₹1,100
                </span>

                <span className="text-[14px] text-[#a39581]">
                  30-minute consultation
                </span>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={handleBookConsultation}
                className="
            group
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#eab12c]
            px-8
            py-3.5
            text-[14px]
            font-semibold
            text-[#2b241d]
            shadow-[0_10px_25px_rgba(234,177,44,0.18)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-[#dca522]
            hover:shadow-[0_15px_35px_rgba(234,177,44,0.25)]
          "
              >
                BOOK CONSULTATION
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-full
            border-2
            border-[#d6b8a0]
            bg-white/80
            px-8
            py-3.5
            text-[14px]
            font-semibold
            text-[#2b241d]
            backdrop-blur-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-[#eab12c]
            hover:bg-[#fffaf0]
          "
              >
                EXPLORE CONSULTATION
              </button>
            </div>
          </div>

          {/* =======================================================
        RIGHT IMAGE
    ======================================================== */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Warm atmospheric glow */}
            <div
              className="
          absolute
          right-0
          top-1/2
          h-[420px]
          w-[420px]
          -translate-y-1/2
          rounded-full
          bg-[#d4872b]/[0.10]
          blur-[90px]
        "
            />

            {/* Portrait */}
            <div
              className="
          relative
          z-10
          w-full
          max-w-[360px]
          animate-[portrait-float_5s_ease-in-out_infinite]
        "
            >
              <div
                className="
            relative
            overflow-hidden
            rounded-[28px]
            border-2
            border-[#d6b8a0]
            bg-[#e8c99e]
            shadow-[0_25px_60px_rgba(43,36,29,0.14)]
          "
              >
                <img
                  src={vishalImage}
                  alt="Vishal Bhardwaj - Vedic Astrologer"
                  className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              hover:scale-[1.03]
            "
                />

                {/* Warm image overlay */}
                <div
                  className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#2b241d]/[0.08]
              via-transparent
              to-[#fffaf0]/[0.08]
            "
                />

                {/* Corner decoration */}
                <div className="absolute left-6 top-6 h-10 w-10 border-l-2 border-t-2 border-[#d4872b]" />

                <div className="absolute bottom-6 left-6 h-10 w-10 border-b-2 border-l-2 border-[#d4872b]" />

                <div className="absolute right-6 top-6 h-10 w-10 border-r-2 border-t-2 border-[#d4872b]" />
              </div>

              {/* Experience badge */}
              <div
                className="
            absolute
            bottom-5
            right-[-12px]
            rounded-2xl
            border-2
            border-[#eab12c]
            bg-[#fffaf0]/95
            px-5
            py-3
            shadow-[0_10px_30px_rgba(43,36,29,0.12)]
            backdrop-blur-sm
          "
              >
                <p className="text-[13px] font-semibold text-[#2b241d]">
                  10+ Years
                </p>

                <p className="text-[11px] text-[#75695c]">Experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
      ANIMATIONS
  ========================================================== */}
        <style>{`
    @keyframes veda-drift {
      0%,
      100% {
        transform: scale(1.08) translate3d(0, 0, 0) rotate(0deg);
      }

      50% {
        transform: scale(1.12) translate3d(-12px, 8px, 0) rotate(0.4deg);
      }
    }

    @keyframes portrait-float {
      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-5px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-\\[veda-drift_70s_ease-in-out_infinite\\],
      .animate-\\[portrait-float_5s_ease-in-out_infinite\\] {
        animation: none !important;
      }
    }

    @media (max-width: 1023px) {
      @keyframes veda-drift {
        0%,
        100% {
          transform: scale(1.02);
        }

        50% {
          transform: scale(1.04);
        }
      }
    }
  `}</style>
      </section>

      {/* ========================================
    TRUST BAR
======================================== */}
      <section
        className="
    relative
    overflow-hidden
    border-y
    border-[#ead8b8]/60
    bg-white
  "
      >
        {/* ========================================
      BACKGROUND DECORATIONS
  ======================================== */}

        {/* Very subtle center glow */}
        <div
          className="
      pointer-events-none
      absolute
      left-1/2
      top-1/2
      h-[400px]
      w-[400px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-[#eab12c]/[0.025]
      blur-[110px]
    "
        />

        {/* Left subtle glow */}
        <div
          className="
      pointer-events-none
      absolute
      -left-32
      top-1/2
      h-[240px]
      w-[240px]
      -translate-y-1/2
      rounded-full
      bg-[#d4872b]/[0.025]
      blur-[90px]
    "
        />

        {/* Right subtle glow */}
        <div
          className="
      pointer-events-none
      absolute
      -right-32
      top-1/2
      h-[240px]
      w-[240px]
      -translate-y-1/2
      rounded-full
      bg-[#eab12c]/[0.025]
      blur-[90px]
    "
        />

        {/* ========================================
      MOVING TRACK
  ======================================== */}
        <div className="relative overflow-hidden py-8 sm:py-10">
          <div
            className="
        flex
        w-max
        animate-[veda-marquee_38s_linear_infinite]
        hover:[animation-play-state:paused]
        motion-reduce:animate-none
      "
          >
            {/* ========================================
          FIRST SET
      ======================================== */}
            <div className="flex items-center">
              {[
                {
                  label: "Vedic Astrology",
                  description: "Ancient wisdom",
                  Icon: Sparkles,
                },
                {
                  label: "Personalized Guidance",
                  description: "Based on your birth chart",
                  Icon: UserRound,
                },
                {
                  label: "Confidential",
                  description: "Private & secure",
                  Icon: ShieldCheck,
                },
                {
                  label: "Kashi / Varanasi",
                  description: "Rooted in tradition",
                  Icon: MapPin,
                },
              ].map(({ label, description, Icon }, index) => (
                <div key={`${label}-${index}`} className="flex items-center">
                  {/* ========================================
                TRUST CARD
            ======================================== */}
                  <div
                    className="
                group
                relative
                mx-4
                flex
                min-w-[210px]
                cursor-default
                flex-col
                items-center
                justify-center
                rounded-[28px]
                border
                border-[#e6c98d]
                bg-[#fff3d6]
                px-7
                py-5
                text-center
                shadow-[0_8px_25px_rgba(180,125,30,0.07)]
                transition-all
                duration-500
                hover:-translate-y-1.5
                hover:border-[#eab12c]
                hover:bg-[#ffedc2]
                hover:shadow-[0_18px_40px_rgba(180,125,30,0.16)]
                sm:mx-5
                sm:min-w-[225px]
              "
                  >
                    {/* Top decorative accent */}
                    <span
                      className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-2
                  h-1
                  w-1
                  -translate-x-1/2
                  rounded-full
                  bg-[#d4872b]/40
                  transition-all
                  duration-500
                  group-hover:w-5
                  group-hover:bg-[#eab12c]
                "
                    />

                    {/* ========================================
                  ICON
              ======================================== */}
                    <div
                      className="
                  mb-3
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#e6c98d]
                  bg-[#fffaf0]
                  text-[#d4872b]
                  shadow-[0_4px_15px_rgba(180,125,30,0.08)]
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:border-[#eab12c]
                  group-hover:bg-[#eab12c]
                  group-hover:text-[#2b241d]
                  group-hover:shadow-[0_8px_25px_rgba(234,177,44,0.28)]
                "
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.7}
                        className="transition-transform duration-500"
                      />
                    </div>

                    {/* ========================================
                  LABEL
              ======================================== */}
                    <p
                      className="
                  text-[13px]
                  font-semibold
                  tracking-[0.01em]
                  text-[#2b241d]
                  transition-colors
                  duration-300
                  group-hover:text-[#a86616]
                "
                    >
                      {label}
                    </p>

                    {/* ========================================
                  DESCRIPTION
              ======================================== */}
                    <p
                      className="
                  mt-1
                  max-h-0
                  overflow-hidden
                  text-[11px]
                  leading-5
                  text-[#806f5b]
                  opacity-0
                  transition-all
                  duration-500
                  group-hover:max-h-8
                  group-hover:opacity-100
                "
                    >
                      {description}
                    </p>

                    {/* ========================================
                  BOTTOM GOLD ACCENT
              ======================================== */}
                    <span
                      className="
                  absolute
                  bottom-2
                  left-1/2
                  h-[2px]
                  w-0
                  -translate-x-1/2
                  rounded-full
                  bg-[#eab12c]
                  transition-all
                  duration-500
                  group-hover:w-10
                "
                    />
                  </div>

                  {/* ========================================
                ASTROLOGY SEPARATOR
            ======================================== */}
                  {index < 3 && (
                    <div
                      className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  text-[#d4872b]/55
                "
                    >
                      <span
                        className="
                    text-[11px]
                    transition-all
                    duration-300
                    hover:scale-125
                    hover:text-[#eab12c]
                  "
                      >
                        ✦
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ========================================
          DUPLICATE SET
          Seamless marquee animation
      ======================================== */}
            <div className="flex items-center" aria-hidden="true">
              {[
                {
                  label: "Vedic Astrology",
                  description: "Ancient wisdom",
                  Icon: Sparkles,
                },
                {
                  label: "Personalized Guidance",
                  description: "Based on your birth chart",
                  Icon: UserRound,
                },
                {
                  label: "Confidential",
                  description: "Private & secure",
                  Icon: ShieldCheck,
                },
                {
                  label: "Kashi / Varanasi",
                  description: "Rooted in tradition",
                  Icon: MapPin,
                },
              ].map(({ label, description, Icon }, index) => (
                <div
                  key={`${label}-duplicate-${index}`}
                  className="flex items-center"
                >
                  {/* ========================================
                TRUST CARD
            ======================================== */}
                  <div
                    className="
                group
                relative
                mx-4
                flex
                min-w-[210px]
                cursor-default
                flex-col
                items-center
                justify-center
                rounded-[28px]
                border
                border-[#e6c98d]
                bg-[#fff3d6]
                px-7
                py-5
                text-center
                shadow-[0_8px_25px_rgba(180,125,30,0.07)]
                transition-all
                duration-500
                hover:-translate-y-1.5
                hover:border-[#eab12c]
                hover:bg-[#ffedc2]
                hover:shadow-[0_18px_40px_rgba(180,125,30,0.16)]
                sm:mx-5
                sm:min-w-[225px]
              "
                  >
                    {/* Top decorative accent */}
                    <span
                      className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-2
                  h-1
                  w-1
                  -translate-x-1/2
                  rounded-full
                  bg-[#d4872b]/40
                  transition-all
                  duration-500
                  group-hover:w-5
                  group-hover:bg-[#eab12c]
                "
                    />

                    {/* Icon */}
                    <div
                      className="
                  mb-3
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#e6c98d]
                  bg-[#fffaf0]
                  text-[#d4872b]
                  shadow-[0_4px_15px_rgba(180,125,30,0.08)]
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:border-[#eab12c]
                  group-hover:bg-[#eab12c]
                  group-hover:text-[#2b241d]
                  group-hover:shadow-[0_8px_25px_rgba(234,177,44,0.28)]
                "
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.7}
                        className="transition-transform duration-500"
                      />
                    </div>

                    {/* Label */}
                    <p
                      className="
                  text-[13px]
                  font-semibold
                  tracking-[0.01em]
                  text-[#2b241d]
                  transition-colors
                  duration-300
                  group-hover:text-[#a86616]
                "
                    >
                      {label}
                    </p>

                    {/* Description */}
                    <p
                      className="
                  mt-1
                  max-h-0
                  overflow-hidden
                  text-[11px]
                  leading-5
                  text-[#806f5b]
                  opacity-0
                  transition-all
                  duration-500
                  group-hover:max-h-8
                  group-hover:opacity-100
                "
                    >
                      {description}
                    </p>

                    {/* Bottom gold accent */}
                    <span
                      className="
                  absolute
                  bottom-2
                  left-1/2
                  h-[2px]
                  w-0
                  -translate-x-1/2
                  rounded-full
                  bg-[#eab12c]
                  transition-all
                  duration-500
                  group-hover:w-10
                "
                    />
                  </div>

                  {/* Separator */}
                  {index < 3 && (
                    <div
                      className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  text-[#d4872b]/55
                "
                    >
                      <span
                        className="
                    text-[11px]
                    transition-all
                    duration-300
                    hover:scale-125
                    hover:text-[#eab12c]
                  "
                      >
                        ✦
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================
      MARQUEE ANIMATION
  ======================================== */}
        <style>{`
    @keyframes veda-marquee {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(-50%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .motion-reduce\\:animate-none {
        animation: none !important;
      }
    }
  `}</style>
      </section>

      {/* ========================================
    WHAT DO YOU NEED GUIDANCE ABOUT?
======================================== */}
      <section
        className="
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
        mb-14
        max-w-[720px]
        text-center
        animate-[vedaFadeUp_800ms_ease-out_both]
      "
          >
            {/* Eyebrow */}
            <div
              className="
          mb-5
          flex
          items-center
          justify-center
          gap-3
        "
            >
              <span
                className="
            h-px
            w-7
            origin-right
            animate-[vedaLine_900ms_ease-out_200ms_both]
            bg-[#d4872b]
          "
              />

              <p
                className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.34em]
            text-[#c77722]
          "
              >
                Consultation Areas
              </p>

              <span
                className="
            h-px
            w-7
            origin-left
            animate-[vedaLine_900ms_ease-out_200ms_both]
            bg-[#d4872b]
          "
              />
            </div>

            {/* Main heading */}
            <h2
              className="
          font-serif
          text-[38px]
          font-medium
          leading-[1.08]
          tracking-[-0.035em]
          text-[#2b241d]
          sm:text-[48px]
          lg:text-[54px]
        "
            >
              What Would You Like
              <br />
              <span className="text-[#d4872b]">Clarity About?</span>
            </h2>

            {/* Short description */}
            <p
              className="
          mx-auto
          mt-5
          max-w-[510px]
          text-[14px]
          leading-6
          text-[#75695c]
          sm:text-[15px]
        "
            >
              Choose an area of life to explore personalized Vedic guidance and
              important timings.
            </p>
          </div>

          {/* ========================================
        INTERACTIVE EXPLORER
    ======================================== */}
          <div
            className="
        animate-[vedaFadeUp_900ms_ease-out_250ms_both]
      "
          >
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
        mt-10
        flex
        flex-wrap
        items-center
        justify-center
        gap-x-4
        gap-y-2
        opacity-80
        animate-[vedaFadeIn_1000ms_ease-out_600ms_both]
      "
          >
            <span
              className="
          text-[10px]
          font-medium
          tracking-[0.02em]
          text-[#806f5b]
        "
            >
              Personalized guidance
            </span>

            <span className="text-[9px] text-[#d4872b]">✦</span>

            <span
              className="
          text-[10px]
          font-medium
          tracking-[0.02em]
          text-[#806f5b]
        "
            >
              Based on your birth chart
            </span>

            <span className="text-[9px] text-[#d4872b]">✦</span>

            <span
              className="
          text-[10px]
          font-medium
          tracking-[0.02em]
          text-[#806f5b]
        "
            >
              Private & confidential
            </span>
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

      {/* ========================================
          WHY VISHAL BHARDWAJ?
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-white px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
              WHY CHOOSE
            </p>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
              Why Vishal Bhardwaj?
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Vedic Approach",
                description:
                  "Traditional Vedic astrology principles and Kundali-based analysis.",
              },
              {
                number: "02",
                title: "Personalized Analysis",
                description:
                  "Every Kundali is different, so the guidance is personalized.",
              },
              {
                number: "03",
                title: "Timing Matters",
                description:
                  "Understand important periods through Dasha, Gochar and planetary influences.",
              },
              {
                number: "04",
                title: "Practical Guidance",
                description:
                  "Guidance to understand the situation and identify suitable remedies.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="group rounded-2xl border-2 border-[#d6b8a0] bg-white p-8 transition-all hover:-translate-y-2 hover:border-[#d4872b] hover:shadow-[0_16px_40px_rgba(212,135,43,0.12)]"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f8edd8] font-serif text-[18px] font-bold text-[#d4872b]">
                  {item.number}
                </div>
                <h3 className="text-[17px] font-semibold text-[#2b241d]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-7 text-[#75695c]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          CONSULTATION PACKAGES
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
              PRICING
            </p>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
              Consultation Packages
            </h2>
            <p className="mt-4 text-[16px] text-[#75695c]">
              Choose the consultation package that works for you
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                price: "₹1,100",
                duration: "30 minutes",
                label: "Consultation",
              },
              {
                price: "₹2,100",
                duration: "1 hour",
                label: "Personal Consultation",
              },
              {
                price: "₹5,100",
                duration: "1.5 hours",
                label: "Premium Consultation",
              },
              {
                price: "₹11,000",
                duration: "3 hours",
                label: "Extended Consultation",
              },
              {
                price: "₹21,000",
                duration: "Full Session",
                label: "Comprehensive Consultation",
              },
            ].map((pkg, index) => {
              const isHighlighted = index === 0;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border-2 p-7 transition-all hover:-translate-y-2 ${
                    isHighlighted
                      ? "border-[#d4872b] bg-[#f8edd8] shadow-[0_16px_40px_rgba(212,135,43,0.15)]"
                      : "border-[#ead8b8] bg-white hover:border-[#d4872b] hover:shadow-[0_16px_40px_rgba(212,135,43,0.12)]"
                  }`}
                >
                  {isHighlighted && (
                    <span className="inline-block rounded-full bg-[#d4872b] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                      Popular
                    </span>
                  )}

                  <p className="mt-4 text-[13px] uppercase tracking-[0.16em] text-[#a39581]">
                    {pkg.label}
                  </p>

                  <p
                    className={`mt-3 font-serif text-[36px] font-semibold ${isHighlighted ? "text-[#2b241d]" : "text-[#2b241d]"}`}
                  >
                    {pkg.price}
                  </p>

                  <p className="mt-2 text-[13px] text-[#75695c]">
                    {pkg.duration}
                  </p>

                  <button
                    onClick={handleBookConsultation}
                    className={`mt-6 w-full rounded-full px-5 py-3 text-[14px] font-semibold transition-all ${
                      isHighlighted
                        ? "bg-[#d4872b] text-white hover:bg-[#c27322]"
                        : "border-2 border-[#d4872b] text-[#d4872b] hover:bg-[#d4872b] hover:text-white"
                    }`}
                  >
                    BOOK NOW
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          WHAT YOU GET
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
              PROCESS
            </p>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
              What You Get
            </h2>
            <p className="mt-4 text-[16px] text-[#75695c]">
              A clear 4-step consultation process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Kundali Analysis",
                description:
                  "Detailed analysis of your birth chart based on your birth details.",
              },
              {
                number: "02",
                title: "Understand Your Situation",
                description:
                  "Discuss your current circumstances and planetary influences.",
              },
              {
                number: "03",
                title: "Timing & Possibilities",
                description:
                  "Understand important periods through Dasha and Gochar.",
              },
              {
                number: "04",
                title: "Guidance & Remedies",
                description:
                  "Receive practical guidance and suitable Vedic remedies.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-2xl border-2 border-[#d6b8a0] bg-white p-7">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eab12c] font-serif text-[18px] font-bold text-[#2b241d]">
                    {step.number}
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#2b241d]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-6 text-[#75695c]">
                    {step.description}
                  </p>
                </div>

                {/* Connector line (hidden on mobile) */}
                {index < 3 && (
                  <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-[#d6b8a0] md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          ABOUT VISHAL BHARDWAJ
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image */}
            <div className="flex justify-center">
              <div className="w-full max-w-[340px]">
                <div className="relative overflow-hidden rounded-[24px] border-2 border-[#d6b8a0] shadow-[0_20px_50px_rgba(43,36,29,0.1)]">
                  <img
                    src={vishalImage}
                    alt="Vishal Bhardwaj"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
                  ABOUT
                </p>
                <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d]">
                  About Vishal Bhardwaj
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-8 text-[#75695c]">
                <p>
                  <strong className="font-semibold text-[#2b241d]">
                    Vishal Bhardwaj
                  </strong>{" "}
                  is a dedicated Vedic astrologer from{" "}
                  <strong className="font-semibold text-[#2b241d]">
                    Kashi (Varanasi)
                  </strong>
                  , offering personalized Kundali-based consultations with over{" "}
                  <strong className="font-semibold text-[#2b241d]">
                    10 years of experience
                  </strong>
                  .
                </p>

                <p>
                  He provides practical guidance on career, marriage,
                  relationships, finance, family, and life decisions. His
                  approach focuses on understanding planetary positions, timing,
                  and remedies rooted in traditional Vedic wisdom.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <MapPin size={20} className="shrink-0 text-[#d4872b]" />
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#a39581]">
                      Location
                    </p>
                    <p className="text-[15px] font-semibold text-[#2b241d]">
                      Kashi / Varanasi
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock size={20} className="shrink-0 text-[#d4872b]" />
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#a39581]">
                      Experience
                    </p>
                    <p className="text-[15px] font-semibold text-[#2b241d]">
                      10+ Years in Vedic Astrology
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Users size={20} className="shrink-0 text-[#d4872b]" />
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#a39581]">
                      Specialization
                    </p>
                    <p className="text-[15px] font-semibold text-[#2b241d]">
                      Vedic Astrology & Kundali Analysis
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookConsultation}
                className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-semibold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.18)] transition-all hover:-translate-y-1 hover:bg-[#dca522]"
              >
                BOOK CONSULTATION
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          KASHI / VARANASI SECTION
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
            SPIRITUAL HERITAGE
          </p>

          <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
            Kashi / Varanasi
          </h2>

          <p className="mt-6 text-[17px] leading-8 text-[#75695c]">
            Vishal Bhardwaj is based in Kashi — a land deeply connected with the
            living traditions of Sanatan Dharma and Vedic wisdom. Kashi's
            spiritual resonance has been a center of learning and enlightenment
            for millennia, making it the perfect place for Vedic Astrology
            consultation.
          </p>

          <p className="mt-4 text-[15px] leading-7 text-[#75695c]">
            The spiritual energy of Kashi embodies the principles of clarity,
            transformation, and understanding — values that guide every
            consultation.
          </p>

          <button
            onClick={handleBookConsultation}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-semibold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.18)] transition-all hover:-translate-y-1 hover:bg-[#dca522]"
          >
            CONNECT WITH VISHAL
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* ========================================
          REVIEWS / TESTIMONIALS
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
              EXPERIENCES
            </p>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
              Client Experiences
            </h2>
          </div>

          <div className="rounded-2xl border-2 border-[#ead8b8] bg-white px-8 py-12 text-center sm:px-12">
            <Sparkles size={40} className="mx-auto text-[#d4872b] opacity-40" />
            <p className="mt-6 text-[16px] text-[#75695c]">
              Client testimonials will be shared here as consultations progress.
            </p>
            <p className="mt-2 text-[14px] text-[#a39581]">
              Building trust through authentic experiences
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          HOW BOOKING WORKS
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
              BOOKING FLOW
            </p>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
              How Booking Works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                number: "01",
                title: "Choose Consultation",
                description:
                  "Select the consultation package that suits your needs.",
              },
              {
                number: "02",
                title: "Provide Details",
                description:
                  "Share your birth details and what you need guidance about.",
              },
              {
                number: "03",
                title: "Complete Booking",
                description:
                  "Complete the booking and secure your consultation slot.",
              },
              {
                number: "04",
                title: "Consultation Call",
                description:
                  "Connect with Vishal for your personalized session.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-2xl border-2 border-[#d6b8a0] bg-white p-7">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eab12c] font-serif text-[18px] font-bold text-[#2b241d]">
                    {step.number}
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#2b241d]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-6 text-[#75695c]">
                    {step.description}
                  </p>
                </div>

                {/* Connector line (hidden on mobile) */}
                {index < 3 && (
                  <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-[#d6b8a0] md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FAQ SECTION
      ======================================== */}
      <section
        id="faq"
        className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-24 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-[840px]">
          <div className="mb-16 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#d4872b]">
              QUESTIONS
            </p>
            <h2 className="mt-4 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border-2 border-[#ead8b8] bg-white transition-all hover:border-[#d4872b]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-[#fffdf9]"
                >
                  <span className="pr-4 text-[15px] font-semibold text-[#2b241d]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#d4872b] transition-transform duration-200 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="border-t border-[#ead8b8] p-6">
                    <p className="text-[14px] leading-7 text-[#75695c]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FINAL CTA
      ======================================== */}
      <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px]">
            Ready to Find Clarity?
          </h2>

          <p className="mt-6 text-[18px] leading-8 text-[#75695c]">
            Book a personal consultation with Astrologer Vishal Bhardwaj today.
            Understand your Kundali and find direction in life's important
            decisions.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="font-serif text-[28px] font-semibold text-[#2b241d]">
                Starting ₹1,100
              </span>
              <span className="text-[14px] text-[#a39581]">
                30-minute session
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <button
                type="button"
                onClick={handleBookConsultation}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-semibold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.18)] transition-all hover:-translate-y-1 hover:bg-[#dca522]"
              >
                BOOK CONSULTATION
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-8 py-3.5 text-[14px] font-semibold text-[#2b241d] transition-all hover:border-[#eab12c] hover:bg-[#fffdf9]"
              >
                EXPLORE OPTIONS
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VishalBhardwajDetails;
