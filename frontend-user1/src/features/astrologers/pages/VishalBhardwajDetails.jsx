import { useState, useEffect } from "react";
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
  Award,
  CheckCircle2,
  Languages,
  BookOpen,
  Quote,
  Calendar,
  FileText,
  CreditCard,
  Video,
  HelpCircle,
  Check,
} from "lucide-react";
import marriageImage from "../../../assets/images/guidance-marriage.png";
import careerImage from "../../../assets/images/guidance-career.png";
import familyImage from "../../../assets/images/guidance-family.png";
import businessImage from "../../../assets/images/guidance-business.png";
import financeImage from "../../../assets/images/guidance-finance.png";
import remediesImage from "../../../assets/images/guidance-remedies.png";
import zodiacWheelImage from "../../../assets/images/wheel.png";
import vishalTransparentPortrait from "../../../assets/images/vishal_png.png";
import vishalImage from "../../../assets/images/vishal.png";
import vishalBlueImage from "../../../assets/images/vishal vhadrawaj.png";
import astrologyCover from "../../../assets/images/c-astrology.jpg";
import gitaCover from "../../../assets/images/c-gita.jpg";
import mantraCover from "../../../assets/images/c-mantra.jpg";
import meditationCover from "../../../assets/images/c-meditation.jpg";
import kashiHeritageImage from "../../../assets/images/prasadam-section.jpg";
import vedaAstroBackgroundImage from "../../../assets/images/vishal-vedic-astrology-bg1.png";
import GuidanceExplorer from "../components/GuidanceExplorer";
import AstrologerHero from "../components/AstrologerHero";
import TrustBar from "../components/TrustBar";

const VishalBhardwajDetails = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [packageModes, setPackageModes] = useState({
    essential: "normal",
    complete: "normal",
    premium: "normal",
  });

  const togglePackageMode = (pkgId, mode) => {
    setPackageModes((prev) => ({ ...prev, [pkgId]: mode }));
  };

  useEffect(() => {
    // 1. Scroll listener for floating consultation bar
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. IntersectionObserver for smooth scroll reveals
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px",
    });

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleBookConsultation = () => {
    navigate("/astrologers/vishal-bhardwaj/book-consultation");
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How long is each consultation session?",
      answer:
        "Sessions range from 30 minutes (Essential Clarity) to 60 minutes (Complete Kundali Analysis), 90 minutes (Deep-Dive), and extended 3-hour family consultations. You can select your preferred duration during booking.",
    },
    {
      question: "How is the consultation conducted online?",
      answer:
        "Consultations take place via private 1-on-1 Audio or Video calls over a secure link. You can join conveniently from your phone, laptop, or tablet from anywhere in the world.",
    },
    {
      question: "Do I need a pre-made Kundali before the session?",
      answer:
        "No, you only need your exact date of birth, time of birth, and place of birth. Astrologer Vishal Bhardwaj casts and computes your precise Janam Kundali, Navamsha (D-9), and planetary strengths directly.",
    },
    {
      question: "Can I ask multiple questions during the session?",
      answer:
        "Yes, every consultation includes dedicated time for your personal questions. For multiple life domains (e.g. career + marriage + finance), we recommend the 60-minute or 90-minute package for adequate depth.",
    },
    {
      question: "Is my personal data and consultation confidential?",
      answer:
        "Absolutely. 100% privacy and confidentiality are guaranteed. Your birth details, personal circumstances, and conversation remain strictly private between you and Astrologer Vishal.",
    },
    {
      question: "Will suitable Vedic remedies be provided?",
      answer:
        "Yes. If astrological afflictions or unfavorable planetary periods are identified, Vishal provides authentic, practical Vedic remedies — including mantra sadhana, karma alignments, and gemstone guidance rooted in Sanatan traditions.",
    },
    {
      question: "In which languages is the consultation available?",
      answer:
        "Consultations are conducted fluently in both Hindi and English, according to your preference and comfort.",
    },
    {
      question: "Can I reschedule my appointment if something urgent comes up?",
      answer:
        "Yes, you can easily reschedule your consultation slot prior to the session time through our support team or booking confirmation page.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf0]">      {/* ========================================
          VISHAL BHARDWAJ HERO SECTION (Reusable)
      ======================================== */}
      <AstrologerHero
        eyebrow="Vedic Astrology • Kashi / Varanasi"
        astrologerPrefix="Astrologer"
        astrologerName="Vishal Bhardwaj"
        quote="Understand Your Kundali. Find Clarity in Life."
        description="Personalized Vedic Astrology consultation rooted in ancient Kashi traditions. Gain actionable guidance on career, relationships, marriage timing, wealth yogas, and practical Vedic remedies."
        price="₹1,100"
        sessionText="30-Min Audio / Video Session"
        portrait={vishalTransparentPortrait}
        portraitAlt="Astrologer Vishal Bhardwaj"
        zodiacWheel={zodiacWheelImage}
        onBookConsultation={handleBookConsultation}
        onExploreGuidance={() => {
          const el = document.getElementById("guidance-section");
          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
            });
          } else {
            window.scrollBy({
              top: 600,
              behavior: "smooth",
            });
          }
        }}
      />
      {/* ========================================
          TRUST BAR (Infinite Marquee)
      ======================================== */}
      <TrustBar />

      {/* ========================================
    WHAT DO YOU NEED GUIDANCE ABOUT?
======================================== */}
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

      {/* ========================================
          WHY VISHAL BHARDWAJ?
      ======================================== */}
      <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-white via-[#fffdf9] to-[#f8edd8]/40 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Subtle Background Glows */}
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-[450px] w-[450px] rounded-full bg-[#d4872b]/[0.04] blur-[110px]" />

        <div className="relative mx-auto max-w-[1240px]">
          {/* Section Header */}
          <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#d4872b]/70" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                Why Choose Vishal Bhardwaj
              </p>
              <span className="h-px w-8 bg-[#d4872b]/70" />
            </div>

            <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
              Rooted in Kashi’s Sacred Tradition.{" "}
              <span className="text-[#c77722]">
                Driven by Astrological Precision.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              Vedic Astrology is a sacred tool of self-discovery and life
              alignment. Experience grounded, compassionate counsel free from
              superstition, tailored to your exact birth chart.
            </p>
          </div>

          {/* Main 2-Column Content Grid */}
          <div className="grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-14 xl:grid-cols-[460px_1fr]">
            {/* LEFT: Astrologer Portrait & Authority Showcase */}
            <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
              {/* Outer Decorative Card */}
              <div className="relative overflow-hidden rounded-[28px] border-2 border-[#d6b8a0] bg-gradient-to-b from-[#fbf3e4] to-[#f4e4c7] p-6 shadow-[0_20px_50px_rgba(43,36,29,0.12)]">
                {/* Image Frame */}
                <div className="relative mx-auto aspect-[4/4.5] w-full overflow-hidden rounded-[22px] border border-[#d4872b]/40 shadow-[0_10px_30px_rgba(43,36,29,0.15)]">
                  <img
                    src={vishalBlueImage}
                    alt="Astrologer Vishal Bhardwaj"
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle Gradient Scrim */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b140e]/85 via-transparent to-transparent" />

                  {/* Corner Ornaments */}
                  <div className="absolute left-3.5 top-3.5 h-6 w-6 border-l-2 border-t-2 border-[#eab12c]" />
                  <div className="absolute right-3.5 top-3.5 h-6 w-6 border-r-2 border-t-2 border-[#eab12c]" />

                  {/* Overlay Name & Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f5ce6f]">
                      Kashi Vishwanath Parampara
                    </p>
                    <h3 className="font-serif text-[24px] font-semibold text-[#fffaf0]">
                      Vishal Bhardwaj
                    </h3>
                    <p className="text-[12px] text-[#dfd4c5]">
                      Vedic Astrologer & Kundali Specialist
                    </p>
                  </div>
                </div>

                {/* Authority Highlights Row */}
                <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 text-center backdrop-blur-sm">
                  <div>
                    <p className="font-serif text-[20px] font-bold text-[#2b241d]">
                      10+ Yrs
                    </p>
                    <p className="text-[10.5px] font-medium text-[#75695c]">
                      Experience
                    </p>
                  </div>
                  <div className="border-x border-[#ead8b8]">
                    <p className="font-serif text-[20px] font-bold text-[#c77722]">
                      4.9 ★
                    </p>
                    <p className="text-[10.5px] font-medium text-[#75695c]">
                      Rating
                    </p>
                  </div>
                  <div>
                    <p className="font-serif text-[20px] font-bold text-[#2b241d]">
                      1,500+
                    </p>
                    <p className="text-[10.5px] font-medium text-[#75695c]">
                      Consultations
                    </p>
                  </div>
                </div>

                {/* Ethos Quote */}
                <div className="mt-5 rounded-2xl border border-[#e6cca0]/80 bg-[#fffaf0] p-4 text-center">
                  <p className="font-serif text-[14.5px] italic leading-relaxed text-[#5e5143]">
                    "Jyotish is not about fear; it is the divine science of time
                    that brings clarity and empowers right action."
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={handleBookConsultation}
                  className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#eab12c] py-3.5 text-[13.5px] font-bold text-[#2b241d] shadow-[0_8px_20px_rgba(234,177,44,0.22)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_12px_28px_rgba(234,177,44,0.3)]"
                >
                  <span>Book Consultation With Vishal</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>

            {/* RIGHT: 4 Core Advantages Grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Authentic Vedic Principles",
                  subtitle: "Classical Jyotish Analysis",
                  description:
                    "Strictly adhering to classical Parashari and Jaimini Vedic methods, analyzing Janam Kundali, Navamsha (D-9), and planetary strengths.",
                  Icon: Sparkles,
                  points: [
                    "Birth Chart (Lagna & Rashi)",
                    "Divisional Charts (D-9, D-10)",
                    "Planetary Strengths (Shadbala)",
                  ],
                },
                {
                  number: "02",
                  title: "Personalized Life Guidance",
                  subtitle: "Tailored to Your Destiny",
                  description:
                    "No generic horoscopes. Every reading is deeply tailored to your specific questions, life stage, and unique planetary placements.",
                  Icon: UserRound,
                  points: [
                    "Career & Financial Yogas",
                    "Marriage & Relationship Timing",
                    "Foreign Travel & Relocation",
                  ],
                },
                {
                  number: "03",
                  title: "Precise Timing of Events",
                  subtitle: "Dasha & Gochar Synchronization",
                  description:
                    "Understanding when favorable or challenging planetary periods occur through Mahadasha, Antardasha, and current planetary transits.",
                  Icon: Clock,
                  points: [
                    "Vimshottari Dasha Analysis",
                    "Planetary Transit (Gochar) Impact",
                    "Sade Sati & Rahu-Ketu Periods",
                  ],
                },
                {
                  number: "04",
                  title: "Practical & Pure Remedies",
                  subtitle: "Sanatan Spiritual Balance",
                  description:
                    "Sensible, non-superstitious remedies focused on mantra chanting, targeted lifestyle alignments, authentic gemstones, and spiritual pujas.",
                  Icon: ShieldCheck,
                  points: [
                    "Mantra Japa & Sooktam",
                    "Auspicious Gemstone Guidance",
                    "Daan & Karma Alignment",
                  ],
                },
              ].map((card) => {
                const CardIcon = card.Icon;
                return (
                  <div
                    key={card.number}
                    className="group relative flex flex-col justify-between rounded-[24px] border-2 border-[#ead8b8] bg-white p-6 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d4872b] hover:shadow-[0_18px_40px_rgba(212,135,43,0.14)] sm:p-7"
                  >
                    {/* Top Row: Number + Icon */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center justify-center rounded-full bg-[#f8edd8] px-3 py-1 font-serif text-[14px] font-bold text-[#b36c1e]">
                          {card.number}
                        </span>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6cca0] bg-[#fffaf0] text-[#d4872b] shadow-[0_3px_12px_rgba(212,135,43,0.1)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#eab12c] group-hover:text-[#2b241d]">
                          <CardIcon size={20} strokeWidth={1.8} />
                        </div>
                      </div>

                      {/* Headings */}
                      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c77722]">
                        {card.subtitle}
                      </p>
                      <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#685c4f]">
                        {card.description}
                      </p>
                    </div>

                    {/* Key Bullet Checklist */}
                    <div className="mt-5 border-t border-[#f0e4cf] pt-4">
                      <ul className="space-y-1.5">
                        {card.points.map((pt, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-[12px] font-medium text-[#5c4f42]"
                          >
                            <CheckCircle2
                              size={13}
                              className="shrink-0 text-[#d4872b]"
                            />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Accent Line */}
                    <span className="absolute bottom-0 left-6 h-[2.5px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-16" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CHOOSE YOUR EXPERT CONSULTATION
      ======================================== */}
      <section
        id="packages"
        className="reveal-on-scroll scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />

        <div className="relative mx-auto max-w-[1280px]">
          {/* Section Header (Matching Screenshot) */}
          <div className="mx-auto mb-14 max-w-[850px] text-center sm:mb-16">
            <h2 className="font-serif text-[38px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[48px] lg:text-[54px]">
              Choose Your{" "}
              <span className="text-[#d4872b]">Expert Consultation</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[650px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              Trusted astrologers with proven experience, ready to guide you
              with clarity and practical solutions
            </p>
          </div>

          {/* 3-Column Consultation Cards (Matching Screenshot Layout) */}
          <div className="grid items-stretch gap-8 lg:grid-cols-3">
            {[
              {
                id: "essential",
                badge: null,
                title: "Elite Certified Astrologers",
                subtitle:
                  "Selected From The Top 5% For Accuracy, Expertise & Trust.",
                image: vishalBlueImage,
                isPopular: false,
                knownFor: [
                  "Personalized remedies for career, finance, marriage, and health",
                  "Easy-to-follow solutions for daily life",
                  "Clear and honest guidance without fear tactics",
                  "Key poojas organized and performed with spiritual precision",
                ],
                consultationDetails: [
                  "Duration: 30 minutes",
                  "Schedule your session immediately",
                  "Couple consultation available at checkout",
                ],
                normalPrice: "₹1,100",
                urgentPrice: "₹1,500",
              },
              {
                id: "complete",
                badge: "Most Popular",
                title: "Astrologer Vishal Bhardwaj",
                subtitle:
                  "10+ Years Of Experience | 1,500+ Clients Consulted | Expert In Palmistry & Kundli Reading",
                image: vishalImage,
                isPopular: true,
                knownFor: [
                  "Giving clear actionable guidance that you can implement immediately",
                  "Offering simple and effective remedies based on your unique birth chart",
                  "Providing detailed predictions trusted by thousands",
                  "Specialising in career relationship and health advice",
                  "Guidance and support for getting specific pooja done when required",
                ],
                consultationDetails: [
                  "Duration: 60-minute session (Comprehensive)",
                  "Immediate slot availability & priority booking",
                  "Couple Consultation option available at checkout",
                ],
                normalPrice: "₹2,100",
                urgentPrice: "₹2,500",
              },
              {
                id: "premium",
                badge: null,
                title: "Premium Astrologers",
                subtitle:
                  "Premium Astrologers Hand-Picked From The Top 1% Of India's Most Trusted Astrologers",
                image: vishalBlueImage,
                isPopular: false,
                knownFor: [
                  "Kundli-based timelines for life events",
                  "Practical remedies for career love marriage and business",
                  "Major poojas and rituals performed with spiritual precision",
                  "Comprehensive 3-year Dasha roadmap & transit alignments",
                ],
                consultationDetails: [
                  "Duration: 90-minute session",
                  "Schedule immediately with priority queue",
                  "Couple consultation available at checkout",
                ],
                normalPrice: "₹5,100",
                urgentPrice: "₹5,500",
              },
            ].map((pkg) => {
              const currentMode = packageModes[pkg.id] || "normal";
              const displayPrice =
                currentMode === "urgent" ? pkg.urgentPrice : pkg.normalPrice;

              return (
                <div
                  key={pkg.id}
                  className={`group relative flex flex-col justify-between rounded-[22px] border-2 transition-all duration-300 ${pkg.isPopular
                    ? "border-[#d4872b] bg-gradient-to-b from-[#fffaf0] via-[#fffbf3] to-[#fbf4e6] shadow-[0_16px_45px_rgba(212,135,43,0.18)] ring-2 ring-[#eab12c]/40"
                    : "border-[#d4872b]/60 bg-gradient-to-b from-[#fffdfa] via-[#fffbf2] to-[#fbf4e6] shadow-[0_10px_30px_rgba(80,60,30,0.08)] hover:border-[#d4872b] hover:shadow-[0_16px_40px_rgba(212,135,43,0.14)]"
                    }`}
                >
                  {/* Top Most Popular Ribbon Banner */}
                  {pkg.isPopular && (
                    <div className="rounded-t-[18px] bg-gradient-to-r from-[#eab12c] via-[#f5ce6f] to-[#eab12c] py-2 text-center text-[13px] font-bold tracking-wide text-[#1c1308] shadow-sm">
                      Most Popular
                    </div>
                  )}

                  {/* Card Main Content */}
                  <div
                    className={`flex flex-1 flex-col p-6 sm:p-7 ${pkg.isPopular ? "pt-5" : "pt-7"}`}
                  >
                    {/* Top Astrologer Portrait (Matching Screenshot) */}
                    <div className="flex justify-center">
                      <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full border-2 border-[#eab12c] bg-[#fffaf0] shadow-[0_6px_20px_rgba(43,36,29,0.12)]">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mt-5 text-center">
                      <h3 className="font-serif text-[23px] font-bold text-[#2b241d]">
                        {pkg.title}
                      </h3>
                      <p className="mx-auto mt-2 max-w-[300px] text-[12.5px] font-medium leading-relaxed text-[#685c4f]">
                        {pkg.subtitle}
                      </p>
                    </div>

                    {/* Diamond Divider 1 */}
                    <div className="my-5 flex items-center justify-center gap-2 text-[#d4872b]">
                      <span className="h-px w-10 bg-[#d4872b]/40" />
                      <span className="text-[11px]">✦</span>
                      <span className="h-px w-10 bg-[#d4872b]/40" />
                    </div>

                    {/* KNOWN FOR: Section */}
                    <div>
                      <p className="font-serif text-[14.5px] font-bold tracking-[0.08em] text-[#b36c1e]">
                        KNOWN FOR:
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {pkg.knownFor.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[13px] leading-snug text-[#4a3d31]"
                          >
                            <span className="font-bold text-[#2b241d]">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CONSULTATION DETAILS: Section */}
                    <div className="mt-6">
                      <p className="font-serif text-[14.5px] font-bold tracking-[0.08em] text-[#b36c1e]">
                        CONSULTATION DETAILS:
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {pkg.consultationDetails.map((detail, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-[13px] leading-snug text-[#4a3d31]"
                          >
                            <span className="text-[#d4872b]">🎯</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Diamond Divider 2 */}
                    <div className="my-5 flex items-center justify-center gap-2 text-[#d4872b]">
                      <span className="h-px w-10 bg-[#d4872b]/40" />
                      <span className="text-[11px]">✦</span>
                      <span className="h-px w-10 bg-[#d4872b]/40" />
                    </div>

                    {/* MODE: Toggle (Normal vs Urgent) */}
                    <div className="mt-auto flex items-center justify-between border-t border-[#f0e2cd]/70 pt-4">
                      <span className="font-serif text-[14.5px] font-bold tracking-wide text-[#2b241d]">
                        MODE:
                      </span>
                      <div className="flex items-center gap-1 rounded-full border border-[#d6b8a0] bg-[#f8edd8] p-1">
                        <button
                          type="button"
                          onClick={() => togglePackageMode(pkg.id, "normal")}
                          className={`rounded-full px-3.5 py-1 text-[12px] font-bold transition-all ${currentMode === "normal"
                            ? "bg-[#3d2c1d] text-[#fffaf0] shadow-sm"
                            : "text-[#685c4f] hover:text-[#2b241d]"
                            }`}
                        >
                          Normal
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePackageMode(pkg.id, "urgent")}
                          className={`rounded-full px-3.5 py-1 text-[12px] font-bold transition-all ${currentMode === "urgent"
                            ? "bg-[#d4872b] text-[#1c1308] shadow-sm"
                            : "text-[#685c4f] hover:text-[#2b241d]"
                            }`}
                        >
                          Urgent
                        </button>
                      </div>
                    </div>

                    {/* Bottom Price & Consult Now Row */}
                    <div className="mt-5 flex items-center justify-between border-t-2 border-[#ead8b8] pt-4">
                      <div>
                        <p className="text-[11.5px] font-semibold text-[#75695c]">
                          Price : (Incl GST)
                        </p>
                        <p className="font-serif text-[25px] font-bold tracking-tight text-[#2b241d]">
                          {displayPrice}/-
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleBookConsultation}
                        className="rounded-xl bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dfa420] px-6 py-3 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.3)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_6px_22px_rgba(234,177,44,0.4)]"
                      >
                        Consult Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reassurance Micro-Trust Bar */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-[#ead8b8] bg-[#f8edd8]/60 px-6 py-4 text-center">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#d4872b]" />
              <span className="text-[12px] font-semibold text-[#5a4d40]">
                100% Confidential Consultation
              </span>
            </div>
            <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
            <div className="flex items-center gap-2">
              <UserRound size={16} className="text-[#d4872b]" />
              <span className="text-[12px] font-semibold text-[#5a4d40]">
                Direct 1-on-1 with Astrologer Vishal
              </span>
            </div>
            <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#d4872b]" />
              <span className="text-[12px] font-semibold text-[#5a4d40]">
                Flexible Slot Scheduling & Rescheduling
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          WHAT YOU GET (CONSULTATION JOURNEY)
      ======================================== */}
      <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8]/80 via-[#fffdf9] to-[#f8edd8]/60 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Background Decorative Glow */}
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[#eab12c]/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-[1240px]">
          {/* Section Header */}
          <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#d4872b]/70" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                Consultation Journey & Outcomes
              </p>
              <span className="h-px w-8 bg-[#d4872b]/70" />
            </div>

            <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
              What You Experience in{" "}
              <span className="text-[#c77722]">Every Session</span>
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              A structured, compassionate 4-stage Vedic immersion designed to
              give you clarity, confidence, and actionable life direction.
            </p>
          </div>

          {/* 4-Step Process Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {[
              {
                step: "01",
                stage: "Stage 01 • Formulation",
                title: "Kundali Deconstruction",
                subtitle: "Birth Chart & Planetary Audit",
                description:
                  "Rigorous examination of your Janam Kundali (Lagna chart), Navamsha (D-9), planetary strengths (Shadbala), and active yogas.",
                takeaway:
                  "Deep mapping of innate karmic strengths & life tendencies.",
                Icon: Sparkles,
              },
              {
                step: "02",
                stage: "Stage 02 • Dialogue",
                title: "Root-Cause Exploration",
                subtitle: "Context & Situation Analysis",
                description:
                  "Open discussion of your specific queries across career, relationship doubts, marriage delays, financial stagnation, or health.",
                takeaway:
                  "Pinpointing why obstacles or transitions are occurring now.",
                Icon: UserRound,
              },
              {
                step: "03",
                stage: "Stage 03 • Timing",
                title: "Timing & Kaal Chakra",
                subtitle: "Dasha & Transit Forecasting",
                description:
                  "Precise alignment of your Vimshottari Mahadasha / Antardasha and major planetary transits (Jupiter, Saturn, Rahu-Ketu Gochar).",
                takeaway:
                  "Clear timelines for upcoming favorable shifts & decisions.",
                Icon: Clock,
              },
              {
                step: "04",
                stage: "Stage 04 • Alignment",
                title: "Vedic Remedies & Upaya",
                subtitle: "Actionable Resolution Blueprint",
                description:
                  "Prescribed authentic Vedic remedies, specific mantra japa, gemstone recommendations, and lifestyle alignments rooted in Kashi traditions.",
                takeaway: "Practical spiritual blueprint to neutralize doshas.",
                Icon: ShieldCheck,
              },
            ].map((item, index) => {
              const StepIcon = item.Icon;
              return (
                <div
                  key={item.step}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border-2 border-[#ead8b8] bg-white p-6 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4872b] hover:shadow-[0_18px_40px_rgba(212,135,43,0.15)] sm:p-7"
                >
                  {/* Top Row: Number & Icon */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#f8edd8] px-3.5 py-1 font-serif text-[15px] font-bold text-[#b36c1e] transition-colors duration-300 group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                        {item.step}
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6cca0] bg-[#fffaf0] text-[#d4872b] shadow-[0_3px_12px_rgba(212,135,43,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#eab12c] group-hover:text-[#2b241d]">
                        <StepIcon size={20} strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Stage Eyebrow */}
                    <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#c77722]">
                      {item.stage}
                    </p>

                    {/* Title & Subtitle */}
                    <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
                      {item.title}
                    </h3>
                    <p className="text-[12px] font-medium text-[#8c7e6c]">
                      {item.subtitle}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-[13.5px] leading-relaxed text-[#685c4f]">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Takeaway Outcome Chip */}
                  <div className="mt-6 rounded-2xl border border-[#f0e2cd] bg-[#fbf6ec]/80 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#b36c1e]">
                      Key Outcome:
                    </p>
                    <p className="mt-1 text-[12px] font-medium leading-snug text-[#4a3f33]">
                      {item.takeaway}
                    </p>
                  </div>

                  {/* Bottom Gold Line Accent */}
                  <span className="absolute bottom-0 left-6 h-[3px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-20" />
                </div>
              );
            })}
          </div>

          {/* Bottom Interactive Callout Banner */}
          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[24px] border-2 border-[#d6b8a0] bg-gradient-to-r from-[#fffaf0] via-[#fbf2e1] to-[#fffaf0] p-6 shadow-[0_12px_32px_rgba(43,36,29,0.08)] sm:flex-row sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eab12c] text-[#2b241d] shadow-[0_4px_16px_rgba(234,177,44,0.3)]">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="font-serif text-[20px] font-semibold text-[#2b241d]">
                  Interactive 1-on-1 Consultation
                </h4>
                <p className="mt-0.5 text-[13.5px] text-[#685c4f]">
                  Dedicated live audio/video discussion with time for your
                  specific follow-up questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookConsultation}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[13.5px] font-bold text-[#2b241d] shadow-[0_8px_20px_rgba(234,177,44,0.22)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_12px_28px_rgba(234,177,44,0.3)]"
            >
              <span>Book Your Session</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================
          ABOUT VISHAL BHARDWAJ
      ======================================== */}
      <section
        id="profile"
        className="reveal-on-scroll scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        {/* Ambient Warm Glow */}
        <div className="pointer-events-none absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[#d4872b]/[0.05] blur-[130px]" />
        <div className="pointer-events-none absolute -left-32 bottom-10 h-[450px] w-[450px] rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-16 xl:grid-cols-[460px_1fr]">
            {/* LEFT: Astrologer Portrait & Verified Credentials */}
            <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
              {/* Outer Decorative Card */}
              <div className="relative overflow-hidden rounded-[30px] border-2 border-[#d6b8a0] bg-gradient-to-b from-[#fbf3e4] via-[#f9ecda] to-[#f4e4c7] p-6 shadow-[0_25px_60px_rgba(43,36,29,0.14)]">
                {/* Framed Image */}
                <div className="relative mx-auto aspect-[4/4.8] w-full overflow-hidden rounded-[24px] border border-[#d4872b]/40 shadow-[0_12px_35px_rgba(43,36,29,0.16)]">
                  <img
                    src={vishalImage}
                    alt="Astrologer Vishal Bhardwaj"
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle Gradient Scrim */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18110b]/85 via-transparent to-transparent" />

                  {/* Traditional Corner Accents */}
                  <div className="absolute left-3.5 top-3.5 h-6 w-6 border-l-2 border-t-2 border-[#eab12c]" />
                  <div className="absolute right-3.5 top-3.5 h-6 w-6 border-r-2 border-t-2 border-[#eab12c]" />

                  {/* Name Tag on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block rounded-full bg-[#eab12c] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1c1308]">
                      Verified Jyotish Guide
                    </span>
                    <h3 className="mt-1.5 font-serif text-[24px] font-semibold text-[#fffaf0]">
                      Vishal Bhardwaj
                    </h3>
                    <p className="text-[12px] text-[#ded3c4]">
                      Kashi (Varanasi), India
                    </p>
                  </div>
                </div>

                {/* 4-Box Credentials Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                      <Clock size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                        Experience
                      </p>
                      <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                        10+ Years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                      <MapPin size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                        Holy Seat
                      </p>
                      <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                        Kashi / Varanasi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                      <Languages size={17} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                        Languages
                      </p>
                      <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                        Hindi, English
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                      <Star size={17} fill="#c77722" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                        Seekers
                      </p>
                      <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                        1,500+ Guided
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Editorial Narrative & Guiding Principles */}
            <div className="space-y-7">
              {/* Header */}
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#d4872b]/70" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                    Spiritual Lineage & Philosophy
                  </p>
                </div>

                <h2 className="font-serif text-[36px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#2b241d] sm:text-[44px] lg:text-[48px]">
                  Rooted in Kashi Tradition.{" "}
                  <span className="text-[#c77722]">
                    Guiding With Astrological Clarity.
                  </span>
                </h2>
              </div>

              {/* Biography Narrative */}
              <div className="space-y-4 text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
                <p>
                  <strong className="font-semibold text-[#2b241d]">
                    Vishal Bhardwaj
                  </strong>{" "}
                  is a seasoned Vedic Astrologer based in the sacred city of{" "}
                  <strong className="font-semibold text-[#2b241d]">
                    Kashi (Varanasi)
                  </strong>
                  , dedicating over a decade to the deep study and practical
                  application of classical Parashari Jyotish.
                </p>
                <p>
                  His consultations bridge ancient Sanatan wisdom with modern
                  life complexities — helping individuals navigate career
                  milestones, marriage timings, financial decisions, and
                  spiritual growth without fear or superstition.
                </p>
              </div>

              {/* 3 Core Guiding Pillars */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    title: "Fear-Free & Compassionate Guidance",
                    desc: "Astrology is treated as a guiding light (Jyoti), not fatalism. Every session empowers you to take conscious action.",
                  },
                  {
                    title: "Timing & Dasha Synchronization",
                    desc: "Precise calculation of planetary periods (Vimshottari Dasha) and transits (Gochar) to align choices with cosmic timing.",
                  },
                  {
                    title: "Pure & Actionable Vedic Remedies",
                    desc: "Straightforward remedial measures centered on mantra sadhana, genuine gemstones, and karma alignment.",
                  },
                ].map((pillar, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 rounded-2xl border border-[#f0e2cd] bg-white/70 p-4 transition-all duration-300 hover:border-[#d4872b] hover:bg-white hover:shadow-[0_6px_20px_rgba(212,135,43,0.08)]"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                      <CheckCircle2 size={15} />
                    </div>
                    <div>
                      <h4 className="font-serif text-[17px] font-semibold text-[#2b241d]">
                        {pillar.title}
                      </h4>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-[#75695c]">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3.5 pt-3 sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={handleBookConsultation}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.25)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_14px_32px_rgba(234,177,44,0.35)]"
                >
                  <span>Book Consultation With Vishal</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("packages");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-7 py-3 text-[14px] font-bold text-[#2b241d] transition-all duration-300 hover:border-[#eab12c] hover:bg-[#fffaf0]"
                >
                  View Packages & Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          KASHI / VARANASI SECTION (SPIRITUAL HERITAGE)
      ======================================== */}
      <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8]/80 via-[#fffdf9] to-[#f8edd8]/50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute -left-28 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[#eab12c]/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Atmospheric Spiritual Heritage Artwork */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[30px] border-2 border-[#d6b8a0] bg-gradient-to-b from-[#fbf3e4] to-[#f4e4c7] p-5 shadow-[0_20px_50px_rgba(43,36,29,0.12)]">
                <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-[22px] border border-[#d4872b]/40 shadow-[0_10px_30px_rgba(43,36,29,0.14)]">
                  <img
                    src={kashiHeritageImage}
                    alt="Spiritual Heritage of Kashi"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b120a]/85 via-[#1b120a]/30 to-transparent" />

                  {/* Corner Ornaments */}
                  <div className="absolute left-3.5 top-3.5 h-6 w-6 border-l-2 border-t-2 border-[#eab12c]" />
                  <div className="absolute right-3.5 top-3.5 h-6 w-6 border-r-2 border-t-2 border-[#eab12c]" />

                  {/* Overlay Tag */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="inline-block rounded-full bg-[#eab12c] px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#1c1308]">
                      Avimukta Kshetra • Holy Varanasi
                    </span>
                    <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#fffaf0]">
                      The Living Seat of Sanatan Wisdom
                    </h3>
                  </div>
                </div>

                {/* 3 Heritage Highlights */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl border border-[#e6cca0] bg-white/80 p-3">
                    <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                      5,000+ Yrs
                    </p>
                    <p className="text-[10px] font-medium text-[#75695c]">
                      Living Tradition
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#e6cca0] bg-white/80 p-3">
                    <p className="font-serif text-[16px] font-bold text-[#c77722]">
                      84 Ghats
                    </p>
                    <p className="text-[10px] font-medium text-[#75695c]">
                      Sacred Energy
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#e6cca0] bg-white/80 p-3">
                    <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                      Jyotish
                    </p>
                    <p className="text-[10px] font-medium text-[#75695c]">
                      Classical Roots
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Narrative */}
            <div className="order-1 space-y-6 lg:order-2">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#d4872b]/70" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                    Spiritual Heritage & Origin
                  </p>
                </div>

                <h2 className="font-serif text-[36px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#2b241d] sm:text-[44px] lg:text-[48px]">
                  Guided From the Heart of{" "}
                  <span className="text-[#c77722]">Sacred Kashi</span>
                </h2>
              </div>

              <div className="space-y-4 text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
                <p>
                  Astrologer Vishal Bhardwaj practices from{" "}
                  <strong className="font-semibold text-[#2b241d]">
                    Kashi (Varanasi)
                  </strong>{" "}
                  — the timeless spiritual capital of Bharat and a cradle of
                  Vedic astronomical and astrological scholarship for millennia.
                </p>
                <p>
                  The spiritual resonance of Kashi embodies deep clarity, karmic
                  purification, and inner alignment. Every consultation reflects
                  this sacred atmosphere: grounded in authentic Shastras, free
                  from sensationalism, and dedicated to your highest well-being.
                </p>
              </div>

              {/* Bullet Highlights */}
              <div className="space-y-2.5 pt-1">
                {[
                  "Traditional Parashari Jyotish calculated with sacred Kashi Panchang precision.",
                  "Authentic remedial rituals, mantra recommendations, and spiritual clarity.",
                  "Direct connection with an astrologer immersed daily in Kashi's spiritual discipline.",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-[13.5px] text-[#554739]"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#d4872b]"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleBookConsultation}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.25)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_14px_32px_rgba(234,177,44,0.35)]"
                >
                  <span>Connect With Astrologer Vishal</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          REVIEWS / CLIENT EXPERIENCES
      ======================================== */}
      <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute right-1/3 top-10 h-[450px] w-[450px] rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />

        <div className="relative mx-auto max-w-[1240px]">
          {/* Section Header */}
          <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#d4872b]/70" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                Voices of Seekers
              </p>
              <span className="h-px w-8 bg-[#d4872b]/70" />
            </div>

            <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
              Client Experiences & Guidance Stories
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              Authentic reflections from individuals who sought astrological
              clarity on career, relationships, timing, and life decisions.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Rohit Sharma",
                city: "Bangalore, India",
                session: "Career & Financial Dasha Timing",
                quote:
                  "Vishal Ji accurately identified the exact timeline when my job transition would manifest. His guidance on navigating my Saturn transit gave me immense peace of mind and direction.",
                rating: 5,
                initials: "RS",
              },
              {
                name: "Ananya Mukherjee",
                city: "Delhi NCR, India",
                session: "Kundali Milan & Marriage Timing",
                quote:
                  "Very practical and grounded consultation. No fear-mongering about Manglik dosha — he explained the remedies in simple terms. The clarity we received was truly remarkable.",
                rating: 5,
                initials: "AM",
              },
              {
                name: "Vikramaditya Patel",
                city: "London / Mumbai",
                session: "Business Venture & Foreign Muhurat",
                quote:
                  "Astrologer Vishal's analysis of my D-10 chart and planetary Mahadasha was spot-on. His suggested auspicious timings for launching our new venture worked out exceptionally well.",
                rating: 5,
                initials: "VP",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="group relative flex flex-col justify-between rounded-[26px] border-2 border-[#ead8b8] bg-white p-7 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4872b] hover:shadow-[0_20px_45px_rgba(212,135,43,0.14)]"
              >
                <div>
                  {/* Rating Stars & Topic Pill */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#eab12c]">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} size={16} fill="#eab12c" />
                      ))}
                    </div>

                    <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#b36c1e]">
                      Verified Seeker
                    </span>
                  </div>

                  {/* Consultation Topic */}
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#c77722]">
                    {review.session}
                  </p>

                  {/* Quote Body */}
                  <div className="relative mt-3">
                    <Quote size={24} className="mb-2 text-[#d4872b]/25" />
                    <p className="text-[14px] leading-relaxed text-[#554739]">
                      "{review.quote}"
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="mt-6 flex items-center gap-3.5 border-t border-[#f0e2cd] pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eab12c] font-serif text-[14px] font-bold text-[#2b241d] shadow-[0_3px_10px_rgba(234,177,44,0.25)]">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="font-serif text-[16px] font-semibold text-[#2b241d]">
                      {review.name}
                    </h4>
                    <p className="text-[12px] text-[#8c7e6c]">{review.city}</p>
                  </div>
                </div>

                {/* Bottom Gold Accent */}
                <span className="absolute bottom-0 left-6 h-[2.5px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-16" />
              </div>
            ))}
          </div>

          {/* Rating Summary Banner */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-[#ead8b8] bg-[#f8edd8]/70 px-6 py-4 text-center">
            <div className="flex items-center gap-2">
              <Star size={18} fill="#c77722" className="text-[#c77722]" />
              <span className="font-serif text-[17px] font-bold text-[#2b241d]">
                4.9 / 5.0 Average Rating
              </span>
            </div>
            <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
            <span className="text-[13px] font-medium text-[#5a4d40]">
              Over 1,500+ Seekers Guided Across India & Worldwide
            </span>
          </div>
        </div>
      </section>

      {/* ========================================
          HOW BOOKING WORKS (4-STEP PROCESS)
      ======================================== */}
      <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8]/70 via-[#fffdf9] to-[#f8edd8]/50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="relative mx-auto max-w-[1240px]">
          {/* Section Header */}
          <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#d4872b]/70" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                Simple & Seamless Process
              </p>
              <span className="h-px w-8 bg-[#d4872b]/70" />
            </div>

            <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
              How Your Consultation Booking Works
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              Book your private consultation in 4 effortless steps with instant
              slot confirmation.
            </p>
          </div>

          {/* 4 Process Step Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Select Package",
                subtitle: "Choose Duration & Focus",
                description:
                  "Pick the consultation tier that fits your needs — from 30-min Essential Clarity to 60-min Complete Guidance.",
                Icon: Calendar,
              },
              {
                step: "02",
                title: "Provide Birth Details",
                subtitle: "Accurate Kundali Casting",
                description:
                  "Enter your Date, exact Time, and Place of Birth along with your specific questions and preferred language.",
                Icon: FileText,
              },
              {
                step: "03",
                title: "Pick Slot & Confirm",
                subtitle: "Secure & Instant Booking",
                description:
                  "Choose an available date and time slot that suits your schedule and complete secure online payment.",
                Icon: CreditCard,
              },
              {
                step: "04",
                title: "Live 1-on-1 Session",
                subtitle: "Private Audio / Video Call",
                description:
                  "Join the secure consultation link at your scheduled time to connect directly with Astrologer Vishal Bhardwaj.",
                Icon: Video,
              },
            ].map((step, idx) => {
              const StepIcon = step.Icon;
              return (
                <div
                  key={step.step}
                  className="group relative flex flex-col justify-between rounded-[26px] border-2 border-[#ead8b8] bg-white p-6 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4872b] hover:shadow-[0_18px_40px_rgba(212,135,43,0.15)] sm:p-7"
                >
                  <div>
                    {/* Top Row: Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#f8edd8] px-3.5 py-1 font-serif text-[15px] font-bold text-[#b36c1e] transition-colors duration-300 group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                        Step {step.step}
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6cca0] bg-[#fffaf0] text-[#d4872b] shadow-[0_3px_12px_rgba(212,135,43,0.08)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#eab12c] group-hover:text-[#2b241d]">
                        <StepIcon size={20} strokeWidth={1.8} />
                      </div>
                    </div>

                    <p className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#c77722]">
                      {step.subtitle}
                    </p>

                    <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-[13.5px] leading-relaxed text-[#685c4f]">
                      {step.description}
                    </p>
                  </div>

                  {/* Step Sequence Indicator */}
                  <div className="mt-6 flex items-center gap-2 border-t border-[#f0e4cf] pt-3 text-[11.5px] font-semibold text-[#8c7e6c]">
                    <CheckCircle2 size={14} className="text-[#d4872b]" />
                    <span>Instant Confirmation</span>
                  </div>

                  {/* Bottom Gold Line */}
                  <span className="absolute bottom-0 left-6 h-[3px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-16" />
                </div>
              );
            })}
          </div>

          {/* Action CTA Button */}
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleBookConsultation}
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#eab12c] px-9 py-4 text-[14px] font-bold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.25)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_14px_32px_rgba(234,177,44,0.35)]"
            >
              <span>Start Your Booking Now</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================
          FAQ SECTION (INTERACTIVE ACCORDION)
      ======================================== */}
      <section
        id="faq"
        className="reveal-on-scroll scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        <div className="pointer-events-none absolute -left-28 top-1/4 h-[450px] w-[450px] rounded-full bg-[#d4872b]/[0.04] blur-[120px]" />

        <div className="relative mx-auto max-w-[860px]">
          {/* Section Header */}
          <div className="mb-14 text-center sm:mb-16">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#d4872b]/70" />
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                Clarity & Assurance
              </p>
              <span className="h-px w-8 bg-[#d4872b]/70" />
            </div>

            <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[48px]">
              Frequently Asked Questions
            </h2>

            <p className="mx-auto mt-4 max-w-[600px] text-[15px] leading-relaxed text-[#685c4f]">
              Everything you need to know about the consultation format, chart
              analysis, privacy, and Vedic remedies.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-[22px] border-2 transition-all duration-300 ${isOpen
                    ? "border-[#d4872b] bg-white shadow-[0_10px_30px_rgba(212,135,43,0.12)]"
                    : "border-[#ead8b8] bg-white/90 hover:border-[#d4872b]/70 hover:bg-white"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors"
                  >
                    <span className="flex items-center gap-3.5 pr-4 text-[15.5px] font-semibold text-[#2b241d]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] font-serif text-[12px] font-bold text-[#b36c1e]">
                        {index + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen
                        ? "bg-[#eab12c] text-[#2b241d] rotate-180"
                        : "bg-[#f8edd8] text-[#b36c1e]"
                        }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#f0e2cd] bg-[#fffdf9] p-6 pt-5">
                      <p className="text-[14.5px] leading-relaxed text-[#685c4f]">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Additional Help Prompt */}
          <div className="mt-10 rounded-2xl border border-[#ead8b8] bg-[#f8edd8]/60 p-5 text-center">
            <p className="text-[13.5px] text-[#685c4f]">
              Have a specific question not listed here?{" "}
              <button
                type="button"
                onClick={handleBookConsultation}
                className="font-bold text-[#b36c1e] underline underline-offset-4 hover:text-[#2b241d]"
              >
                Connect directly with our consultation support
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          FINAL CTA SECTION
      ======================================== */}
      <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8] via-[#fbf2e1] to-[#f4e4c7] px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
        {/* Ambient Backlight */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eab12c]/[0.1] blur-[140px]" />

        <div className="relative mx-auto max-w-[900px] text-center">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d4872b]/70" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              Begin Your Astrological Journey
            </p>
            <span className="h-px w-8 bg-[#d4872b]/70" />
          </div>

          <h2 className="font-serif text-[38px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#2b241d] sm:text-[48px] lg:text-[54px]">
            Ready to Gain{" "}
            <span className="text-[#c77722]">Clarity & Direction</span> in Life?
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-relaxed text-[#685c4f] sm:text-[17px]">
            Understand your Janam Kundali, upcoming Dasha cycles, and the right
            timing for your decisions with Astrologer Vishal Bhardwaj.
          </p>

          {/* Pricing & Duration Chip */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#e6cca0] bg-white/90 px-6 py-2.5 shadow-[0_6px_20px_rgba(43,36,29,0.06)] backdrop-blur-sm">
            <span className="font-serif text-[22px] font-bold text-[#2b241d]">
              Starting ₹1,100
            </span>
            <span className="h-3.5 w-px bg-[#d6b8a0]" />
            <span className="text-[12.5px] font-medium text-[#75695c]">
              30-Min Audio / Video Session
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleBookConsultation}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-9 py-4 text-[14.5px] font-bold text-[#2b241d] shadow-[0_12px_28px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_16px_36px_rgba(234,177,44,0.4)]"
            >
              <span>Book Your Consultation Now</span>
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("packages");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-8 py-3.5 text-[14.5px] font-bold text-[#2b241d] transition-all duration-300 hover:border-[#eab12c] hover:bg-[#fffaf0]"
            >
              View Packages & Rates
            </button>
          </div>

          {/* Bottom Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] font-medium text-[#685c4f]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#d4872b]" />
              100% Private & Confidential
            </span>
            <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
            <span className="flex items-center gap-1.5">
              <UserRound size={15} className="text-[#d4872b]" />
              Direct 1-on-1 with Astrologer Vishal
            </span>
            <span className="hidden text-[#d4872b]/50 sm:inline">✦</span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-[#d4872b]" />
              Flexible Rescheduling
            </span>
          </div>
        </div>
      </section>

      {/* ========================================
          FLOATING STICKY CONSULTATION BAR
          Appears smoothly after scrolling down
      ======================================== */}
      <div
        className={`fixed bottom-4 left-1/2 z-50 w-[92%] max-w-[620px] -translate-x-1/2 transition-all duration-500 ease-out sm:bottom-6 ${showStickyBar
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-16 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between gap-3 rounded-full border border-[#eab12c]/50 bg-[#1e150ee6] p-2.5 pl-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.38)] backdrop-blur-lg">
          {/* Left: Avatar + Details */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#eab12c]/70 shadow-sm">
              <img
                src={vishalImage}
                alt="Vishal Bhardwaj"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-serif text-[15px] font-semibold text-[#fffaf0]">
                  Vishal Bhardwaj
                </p>
                <span className="hidden rounded bg-[#eab12c]/20 px-1.5 py-0.5 text-[9.5px] font-bold text-[#f5ce6f] sm:inline">
                  4.9 ★
                </span>
              </div>
              <p className="truncate text-[11px] text-[#c7b9a5]">
                Vedic Astrology • Starting{" "}
                <strong className="text-[#eab12c]">₹1,100</strong>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleBookConsultation}
              className="group flex items-center gap-1.5 rounded-full bg-[#eab12c] px-4 py-2 text-[12.5px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dfa420] sm:px-5 sm:py-2.5 sm:text-[13px]"
            >
              <span>Book Now</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VishalBhardwajDetails;
