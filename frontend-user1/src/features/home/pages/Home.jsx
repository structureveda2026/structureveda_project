import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Globe2,
  Heart,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Truck,
  Scroll,
  Network,
  Compass,
  CheckCircle2,
  Flame,
  Search,
  Award,
  Sun,
  ChevronRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import templeHeroBg from "../../../assets/images/sacred-vedic-temple-hero-bg.jpg";
import sacredPujaHeroImg from "../../../assets/images/upcoming_puja_hero.jpg";
import sacredAartiVideo from "../../../assets/videos/sacred-aarti-hero.webm";
import prasadamSectionImage from "../../../assets/images/prasadam-section.jpg";
import catSpiritualProductsImg from "../../../assets/images/cat-spiritual-products.jpg";
import catTemplePrasadamImg from "../../../assets/images/cat-temple-prasadam.jpg";
import catVedicCoursesImg from "../../../assets/images/cat-vedic-courses.jpg";
import catConsultExpertImg from "../../../assets/images/cat-consult-expert.jpg";
import catAstrologyKundliImg from "../../../assets/images/cat-astrology-kundli.jpg";
import catPujaYagyaImg from "../../../assets/images/cat-puja-yagya.jpg";
import rudrakshaImage from "../../../assets/images/p-rudraksha.jpg";
import yantraImage from "../../../assets/images/p-yantra.jpg";
import samagriImage from "../../../assets/images/p-samagri.jpg";
import malaImage from "../../../assets/images/p-mala.jpg";
import braceletImage from "../../../assets/images/p-bracelet.jpg";
import prasadamImage from "../../../assets/images/p-prasadam.jpg";
import astrologyCourseImage from "../../../assets/images/c-astrology.jpg";
import gitaCourseImage from "../../../assets/images/c-gita.jpg";
import meditationCourseImage from "../../../assets/images/c-meditation.jpg";
import basicsCourseImage from "../../../assets/images/c-basics.jpg";
import mantraCourseImage from "../../../assets/images/c-mantra.jpg";
import vastuCourseImage from "../../../assets/images/c-vastu.jpg";
import rahulExpertImage from "../../../assets/images/e-1.jpg";
import meeraExpertImage from "../../../assets/images/e-2.jpg";
import ananyaExpertImage from "../../../assets/images/e-4.jpg";
import PujaCard from "../../puja/components/PujaCard";
import { getFeaturedPujas } from "../../puja/data/pujaData";
import upcomingPujaService from "../../../services/upcomingPujaService";

const AnimatedCounter = ({ target, suffix = "", duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const startCounting = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      let startTimestamp = null;
      let frameId;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Smooth decelerating cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(ease * target));

        if (progress < 1) {
          frameId = window.requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };

      frameId = window.requestAnimationFrame(step);
    };

    const currentElem = countRef.current;
    if (!currentElem) {
      startCounting();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(currentElem);

    return () => {
      observer.disconnect();
    };
  }, [target, duration]);

  return (
    <span ref={countRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

const categories = [
  {
    title: "Spiritual Products",
    sanskritTitle: "पवित्र आध्यात्मिक सामग्री",
    description: "Energized Rudrakshas, sacred yantras, authentic japa malas, and complete puja samagri.",
    icon: Leaf,
    image: catSpiritualProductsImg,
    path: "/shop",
    badge: "100% Energized",
    features: ["Lab-Tested Rudraksha", "Sacred Brass Yantras", "Pure Puja Samagri"],
  },
  {
    title: "Temple Prasadam",
    sanskritTitle: "महाप्रसाद व चरणामृत",
    description: "Blessed temple offerings and sacred charnamrit directly from holy dhams, delivered to your doorstep.",
    icon: PackageCheck,
    image: catTemplePrasadamImg,
    path: "/prasadam",
    badge: "Holy Dhams",
    features: ["Airtight Sanctified Pack", "Direct Temple Source", "Fast Global Dispatch"],
  },
  {
    title: "Vedic Courses",
    sanskritTitle: "वैदिक ज्ञान एवं शिक्षण",
    description: "Learn Bhagavad Gita, Vedic Astrology, Sanskrit Mantras, and Vastu from verified Gurukul acharyas.",
    icon: BookOpen,
    image: catVedicCoursesImg,
    path: "/courses",
    badge: "Gurukul Wisdom",
    features: ["Lifetime Access", "Authentic Sanskrit Vidhi", "Certified Learning"],
  },
  {
    title: "Consult an Expert",
    sanskritTitle: "अनुभवी विद्वान परामर्श",
    description: "1-on-1 private guidance with senior Vedic scholars for life remedies, spiritual counseling & sadhana.",
    icon: UserRound,
    image: catConsultExpertImg,
    path: "/experts",
    badge: "1-on-1 Private",
    features: ["Verified Gurukul Lineage", "Private Video/Audio Calls", "Personalized Remedies"],
  },
  {
    title: "Astrology & Kundli",
    sanskritTitle: "ज्योतिष एवं ग्रह शांति",
    description: "Accurate birth chart analysis, Dasha predictions, Muhurat calculation, and gemstone recommendations.",
    icon: Sparkles,
    image: catAstrologyKundliImg,
    path: "/experts",
    badge: "Vedic Jyotish",
    features: ["In-Depth Kundli Reading", "Planetary Dasha Analysis", "Gotra & Matchmaking"],
  },
  {
    title: "Book a Puja / Yagya",
    sanskritTitle: "पवित्र पूजा व महायज्ञ",
    description: "Sacred Vedic rituals and individual Gotra Sankalpa performed live with doorstep holy prasadam dispatch.",
    icon: Flame,
    image: catPujaYagyaImg,
    path: "/puja/upcoming",
    badge: "Live Sankalpa",
    features: ["Individual Gotra Sankalpa", "Live Video Recording", "Sanctified Certificate"],
  },
];

const products = [
  {
    category: "RUDRAKSHA",
    name: "Energized 5 Mukhi Rudraksha",
    description: "Hand-picked Nepal bead, energized with Vedic mantras.",
    price: "₹1,899",
    mrp: "₹2,599",
    discount: "27% OFF",
    rating: "4.8",
    reviews: "214",
    image: rudrakshaImage,
  },
  {
    category: "YANTRA",
    name: "Shree Vedic Yantra Plate",
    description: "Brass yantra engraved with precise sacred geometry.",
    price: "₹2,499",
    mrp: "₹3,299",
    discount: "24% OFF",
    rating: "4.7",
    reviews: "138",
    image: yantraImage,
  },
  {
    category: "PUJA KITS",
    name: "Complete Puja Samagri Kit",
    description: "Everything needed for a full home puja, neatly packed.",
    price: "₹1,299",
    mrp: "₹1,799",
    discount: "28% OFF",
    rating: "4.6",
    reviews: "302",
    image: samagriImage,
  },
  {
    category: "MALAS",
    name: "Sacred Tulsi Japa Mala",
    description: "108 hand-knotted tulsi beads with cotton tassel.",
    price: "₹999",
    mrp: "₹1,399",
    discount: "27% OFF",
    rating: "4.8",
    reviews: "411",
    image: malaImage,
  },
  {
    category: "BRACELETS",
    name: "Spiritual Healing Bracelet",
    description: "Amethyst and citrine with gold-tone spacers.",
    price: "₹1,499",
    mrp: "₹1,899",
    discount: "21% OFF",
    rating: "4.5",
    reviews: "176",
    image: braceletImage,
  },
  {
    category: "PRASADAM",
    name: "Temple Prasadam Box",
    description: "Fresh temple prasadam, sealed and shipped worldwide.",
    price: "₹799",
    mrp: "₹999",
    discount: "20% OFF",
    rating: "4.9",
    reviews: "285",
    image: prasadamImage,
  },
];

const courses = [
  {
    level: "Beginner",
    title: "Introduction to Vedic Astrology",
    instructor: "Acharya Rahul Sharma",
    duration: "8h 20m",
    lessons: "24 lessons",
    price: "₹2,999",
    mrp: "₹4,999",
    discount: "40% off",
    rating: "4.8",
    reviews: "1,240",
    image: astrologyCourseImage,
  },
  {
    level: "Beginner",
    title: "Bhagavad Gita for Everyday Life",
    instructor: "Smt. Meera Iyer",
    duration: "6h 45m",
    lessons: "18 lessons",
    price: "₹1,999",
    mrp: "₹2,999",
    discount: "33% off",
    rating: "4.9",
    reviews: "2,104",
    image: gitaCourseImage,
  },
  {
    level: "Beginner",
    title: "Meditation & Inner Wellness",
    instructor: "Yogacharya Devendra",
    duration: "5h 10m",
    lessons: "20 lessons",
    price: "₹1,499",
    mrp: "₹2,499",
    discount: "40% off",
    rating: "4.7",
    reviews: "1,876",
    image: meditationCourseImage,
  },
  {
    level: "Beginner",
    title: "Foundations of Vedic Wisdom",
    instructor: "Acharya Vivek Sharma",
    duration: "4h 30m",
    lessons: "16 lessons",
    price: "₹1,299",
    mrp: "₹1,999",
    discount: "35% off",
    rating: "4.7",
    reviews: "968",
    image: basicsCourseImage,
  },
  {
    level: "Intermediate",
    title: "Sacred Mantra Practice",
    instructor: "Pandit Keshav Joshi",
    duration: "5h 40m",
    lessons: "21 lessons",
    price: "₹1,799",
    mrp: "₹2,699",
    discount: "33% off",
    rating: "4.8",
    reviews: "1,126",
    image: mantraCourseImage,
  },
  {
    level: "Beginner",
    title: "Introduction to Vastu Shastra",
    instructor: "Dr. Ananya Rao",
    duration: "6h 15m",
    lessons: "22 lessons",
    price: "₹2,199",
    mrp: "₹3,299",
    discount: "33% off",
    rating: "4.7",
    reviews: "814",
    image: vastuCourseImage,
  },
];

const experts = [
  {
    name: "Acharya Rahul Sharma",
    expertise: "Vedic Astrology & Kundli",
    experience: "15+ years experience",
    rating: "4.9",
    reviews: "1,820",
    languages: "Hindi, English, Sanskrit",
    price: "₹999",
    image: rahulExpertImage,
  },
  {
    name: "Smt. Meera Iyer",
    expertise: "Spiritual Counselling & Scripture",
    experience: "12+ years experience",
    rating: "4.8",
    reviews: "940",
    languages: "English, Tamil, Hindi",
    price: "₹799",
    image: meeraExpertImage,
  },
  {
    name: "Pandit Keshav Joshi",
    expertise: "Puja, Rituals & Mantra Vidhi",
    experience: "28+ years experience",
    rating: "4.9",
    reviews: "2,310",
    languages: "Hindi, Sanskrit, Marathi",
    price: "₹1,299",
    image: meeraExpertImage,
  },
  {
    name: "Dr. Ananya Rao",
    expertise: "Vastu & Space Consultation",
    experience: "9+ years experience",
    rating: "4.7",
    reviews: "610",
    languages: "English, Kannada, Hindi",
    price: "₹1,499",
    image: ananyaExpertImage,
  },
];

const quickNavLinks = [
  { label: "Book a Puja", path: "/puja/upcoming", icon: Flame, color: "from-amber-500 to-orange-600" },
  { label: "Vedic Products", path: "/shop", icon: Leaf, color: "from-emerald-500 to-teal-600" },
  { label: "Temple Prasadam", path: "/prasadam", icon: PackageCheck, color: "from-amber-600 to-yellow-600" },
  { label: "Vedic Courses", path: "/courses", icon: BookOpen, color: "from-blue-500 to-indigo-600" },
  { label: "Expert Astrologers", path: "/experts", icon: Sparkles, color: "from-purple-500 to-pink-600" },
  { label: "Veda Library", path: "https://veda-library-five.vercel.app/library", isExternal: true, icon: Scroll, color: "from-amber-600 to-amber-800" },
];

const Home = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [featuredPujas, setFeaturedPujas] = useState(() => getFeaturedPujas());

  useEffect(() => {
    let isMounted = true;
    upcomingPujaService
      .getUpcomingPujas()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const featured = data.filter((p) => p.isFeatured || p.featured);
          setFeaturedPujas(featured.length > 0 ? featured : data);
        }
      })
      .catch((err) => {
        console.warn(
          "Could not load dynamic pujas for Home page, using default:",
          err
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="bg-[#fffdfa] text-[#241c15] selection:bg-amber-400/30 selection:text-amber-950 font-sans">
      {/* =====================================================
          MAJESTIC TEMPLE SANCTUARY HERO (Full-Width Divine Sanctuary)
      ====================================================== */}
      <section className="relative overflow-hidden border-b border-amber-900/20 bg-[#120c06] py-10 sm:py-14 lg:py-16 text-center">
        {/* Full-bleed Majestic Kashi Temple Ghat Sunrise Background */}
        <div
          className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
          aria-hidden="true"
        >
          <img
            src={templeHeroBg}
            alt="Ancient Sacred Vedic Temple Ghat Sunrise"
            className="h-full w-full object-cover object-[center_35%] filter brightness-[0.75] contrast-[1.15] scale-105 transition-transform duration-1000"
          />

          {/* Luxury Scrim & Sacred Lighting Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120c06] via-[#120c06]/80 to-black/65" />
          <div className="absolute inset-0 bg-radial at-center from-amber-500/15 via-transparent to-black/75" />

          {/* Ambient Warm Golden Solar Ray Glows */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#fcd34d]/25 via-[#f59e0b]/15 to-transparent blur-3xl animate-veda-aura" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#120c06] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
          {/* Dual Language Sanctuary Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/90 bg-white/95 px-4 py-1.5 shadow-[0_6px_22px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#d97706] animate-pulse" />
            <span className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.22em] text-[#8a4204]">
              Sanatan Dharma Sanctuary
            </span>
            <span className="text-[#d97706]">✦</span>
            <span className="font-serif text-[12.5px] sm:text-[13px] font-bold text-[#b45309]">
              सनातन वैदिक परंपरा
            </span>
          </div>

          {/* Main Grand Headline */}
          <h1 className="mt-4 font-serif text-[32px] sm:text-[44px] lg:text-[54px] font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)]">
            Ancient Wisdom.{" "}
            <span className="bg-gradient-to-r from-[#ffe18d] via-[#f7ce68] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(245,179,53,0.45)]">
              Modern Access.
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-[680px] text-[14px] sm:text-[15.5px] leading-relaxed text-[#f7eedf] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-normal">
            Discover authentic sacred products, spiritual courses, live temple pujas,
            and personalized guidance from verified Vedic experts — all in one calm sanctuary.
          </p>

          {/* Floating Sacred Shloka Ribbon */}
          <div className="mx-auto mt-5 max-w-[620px] rounded-2xl border-2 border-[#ebd09b] bg-white/95 p-3.5 sm:p-4 shadow-[0_14px_38px_rgba(0,0,0,0.32)] backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:shadow-[0_18px_44px_rgba(217,148,38,0.25)] hover:bg-white">
            <p className="font-serif text-[16px] sm:text-[19px] font-bold text-[#7a3b02] tracking-wide leading-snug drop-shadow-2xs">
              <span className="inline-block text-[#d97706] text-[13px] sm:text-[15px] mr-2 select-none">
                ✦
              </span>
              सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
              <span className="inline-block text-[#d97706] text-[13px] sm:text-[15px] ml-2 select-none">
                ✦
              </span>
            </p>
            <p className="mt-1 font-serif text-[12px] sm:text-[13px] font-medium text-[#5e4125] italic">
              “May all beings be happy, healthy, and blessed with peace.”
            </p>
          </div>

          {/* Action CTA Buttons */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3.5">
            <Link
              to="/shop"
              className="veda-shimmer-wrap group inline-flex items-center gap-2.5 rounded-full bg-veda-gold-gradient px-7 py-3.5 text-[13.5px] sm:text-[14px] font-bold text-[#1a1106] shadow-[0_10px_30px_rgba(217,148,38,0.4)] border border-[#ffea9f]/80 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(217,148,38,0.6)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Explore Products</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/book-consultation"
              className="inline-flex items-center rounded-full border border-amber-300/50 bg-white/10 px-7 py-3.5 text-[13.5px] sm:text-[14px] font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-amber-300 hover:bg-white hover:text-[#1a1106] hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Book a Consultation
            </Link>
          </div>

          {/* 4 Royal Sanctuary Trust Stats / Pillars with Smooth Counting Animation */}
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-amber-300/30 pt-6 max-w-[900px] mx-auto">
            {[
              { target: 40, suffix: "+", label: "Countries Served" },
              { target: 120, suffix: "+", label: "Verified Acharyas" },
              { target: 50, suffix: "k+", label: "Blessings Delivered" },
              { target: 100, suffix: "%", label: "Vedic Authenticity" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className="veda-hover-lift group relative overflow-hidden rounded-2xl border-2 border-[#ebd09b] bg-white/95 p-3.5 sm:p-4 shadow-[0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:shadow-[0_18px_40px_rgba(217,148,38,0.32)] hover:bg-white hover:-translate-y-1"
              >
                {/* Subtle Amber Glow on Hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-300/20 via-orange-200/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <p className="relative font-serif text-[28px] sm:text-[34px] font-black tracking-tight text-[#874204] drop-shadow-2xs">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                    duration={1600 + idx * 250}
                  />
                </p>
                <p className="relative mt-0.5 text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#422c19]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK SANCTUARY ACCESS BAR (Standalone Luxury Section)
      ====================================================== */}
      <section className="relative bg-gradient-to-b from-[#fffcf7] via-[#fbf5e8] to-[#fffdfa] py-6 sm:py-7 px-4 sm:px-6 lg:px-8 border-b border-[#ebd7b2] shadow-xs">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-4 sm:mb-5 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-white/90 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#b36a18] shadow-2xs">
              <Sparkles size={11} className="text-[#d96716]" />
              <span>Quick Sanctuary Access</span>
              <span>✦</span>
              <span className="font-serif font-bold">त्वरित सेवा चयन</span>
              <Sparkles size={11} className="text-[#d96716]" />
            </div>
          </div>

          {/* 6 Royal Interactive Service Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3.5">
            {quickNavLinks.map((nav) => {
              const NavIcon = nav.icon;
              const cardContent = (
                <>
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${nav.color} text-white shadow-md transition-transform duration-300 group-hover:scale-105`}>
                    <NavIcon size={18} strokeWidth={2} />
                  </div>
                  <span className="mt-2.5 font-serif text-[13.5px] sm:text-[14.5px] font-bold text-[#241c15] group-hover:text-[#b36a18] transition-colors leading-snug">
                    {nav.label}
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#8c7a67] group-hover:text-[#d96716]">
                    <span>Explore</span>
                    <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </>
              );

              return nav.isExternal ? (
                <a
                  key={nav.label}
                  href={nav.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="veda-hover-lift group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl border border-[#edd7ab] bg-white shadow-[0_4px_16px_rgba(90,65,25,0.04)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_12px_30px_rgba(217,148,38,0.18)]"
                >
                  {cardContent}
                </a>
              ) : (
                <Link
                  key={nav.label}
                  to={nav.path}
                  className="veda-hover-lift group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl border border-[#edd7ab] bg-white shadow-[0_4px_16px_rgba(90,65,25,0.04)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_12px_30px_rgba(217,148,38,0.18)]"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          ROYAL CATEGORIES SHOWCASE (Where would you like to begin?)
      ====================================================== */}
      <section className="relative bg-gradient-to-b from-[#fffdfa] via-[#fbf6ea] to-[#fffdfa] px-6 py-10 sm:py-12 lg:py-14 lg:px-8 overflow-hidden border-b border-[#ebd7b2]">
        {/* Subtle Ambient Golden Aura */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="mb-8 sm:mb-10 text-center">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/90 px-3.5 py-1 backdrop-blur-md shadow-xs">
              <Sparkles size={11} className="text-[#d96716]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36a18]">
                Where would you like to begin?
              </span>
              <span className="text-amber-400">✦</span>
              <span className="font-serif font-bold text-[#945305]">पावन वैदिक संकलन</span>
              <Sparkles size={11} className="text-[#d96716]" />
            </div>

            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
              Everything sacred, in one calm place
            </h2>

            <p className="mt-2 mx-auto max-w-[660px] text-[13.5px] sm:text-[14.5px] text-[#75695c] leading-relaxed">
              Explore energized spiritual items, holy temple prasadam, certified courses, and authenticated Gurukul experts.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className="veda-hover-lift group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-[#edd7ab] bg-gradient-to-b from-white via-[#fffdf9] to-[#faf2de] shadow-[0_8px_24px_rgba(90,65,25,0.06)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(217,148,38,0.22)]"
                >
                  <div>
                    {/* Visual Image Header */}
                    <div className="relative h-[190px] w-full overflow-hidden bg-gradient-to-b from-[#f9ebce] to-[#f4deb0]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Gradient Scrim */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

                      {/* Top Badges over image */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="font-serif text-[11px] font-bold text-[#fef9c3] bg-black/65 backdrop-blur-md border border-amber-300/40 rounded-full px-3 py-0.5 shadow-sm">
                          {item.sanskritTitle}
                        </span>
                        <span className="text-[9.5px] font-bold text-[#1a1106] bg-gradient-to-r from-[#ffe18d] via-[#f7ce68] to-[#f59e0b] rounded-full px-2.5 py-0.5 shadow-sm uppercase tracking-wider">
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-5.5">
                      {/* Title & Description */}
                      <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#241a12] transition-colors duration-300 group-hover:text-[#b36a18]">
                        {item.title}
                      </h3>

                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#75695c]">
                        {item.description}
                      </p>

                      {/* Features Micro-List */}
                      <div className="my-3 space-y-1.5 border-t border-[#ebd9b8]/60 pt-2.5">
                        {item.features?.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-[11px] font-medium text-[#5a4835]">
                            <CheckCircle2 size={12} className="text-[#d96716] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="flex items-center justify-between p-5 pt-2 border-t border-[#ebd9b8]/40 mt-1">
                    <span className="text-[11.5px] font-bold text-[#b36a18] group-hover:text-[#d96716] transition-colors">
                      Explore Category
                    </span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#fdf5e7] border border-[#edd7ab] text-[#75695c] transition-all duration-300 group-hover:bg-veda-gold-gradient group-hover:border-amber-400 group-hover:text-amber-950 group-hover:translate-x-1 shadow-2xs">
                      <ArrowRight size={12} strokeWidth={2.2} />
                    </span>
                  </div>

                  {/* Bottom Golden Line Accent */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-amber-400 via-[#ffd56b] to-amber-500 transition-all duration-500 group-hover:w-full" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          UPCOMING SACRED PUJAS
      ====================================================== */}
      <section className="relative border-t border-[#ead8b8] bg-gradient-to-b from-[#fcf6ed] to-[#fffdfa] px-6 py-10 sm:py-12 lg:py-14 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8 sm:mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8ce9b]/70 bg-[#fbf0dc]/80 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
                <Sparkles size={11} className="text-[#d4872b]" />
                UPCOMING PUJA
              </div>

              <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
                Sacred Rituals. Authentic Tradition.
              </h2>

              <p className="mt-1.5 max-w-[650px] text-[13.5px] sm:text-[14px] leading-relaxed text-[#75695c]">
                Participate in sacred Vedic rituals performed in Kashi and other
                sacred places.
              </p>
            </div>

            <Link
              to="/puja/upcoming"
              className="veda-shimmer-wrap group inline-flex items-center gap-2 self-start rounded-full bg-veda-gold-gradient px-6 py-3 text-[12.5px] font-bold text-[#1c1308] shadow-[0_8px_25px_rgba(217,148,38,0.28)] border border-[#ffea9f]/60 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(217,148,38,0.42)] hover:-translate-y-0.5 sm:self-auto"
            >
              <span>View All Upcoming Puja</span>
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPujas.slice(0, 3).map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED SPIRITUAL PRODUCTS
      ====================================================== */}
      <section className="relative border-y border-[#eadfc9] bg-[#fffdfa] px-6 py-10 sm:py-12 lg:py-14 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8 sm:mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8ce9b]/70 bg-[#fbf3e4]/80 px-3 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
                <Sparkles size={11} className="text-[#ef6c1f]" />
                Handpicked
              </div>

              <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
                Featured Spiritual Products
              </h2>

              <p className="mt-1.5 max-w-[650px] text-[13.5px] leading-relaxed text-[#75695c]">
                Energized, certified and packed with care, chosen by our trusted
                temple partners.
              </p>
            </div>

            <Link
              to="/shop"
              className="veda-glass-pill group inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-[12px] font-bold text-[#3e3428] transition-all duration-300 hover:border-[#d99426] hover:bg-white hover:text-[#b36a18] hover:shadow-[0_8px_20px_rgba(217,148,38,0.12)] hover:-translate-y-0.5 sm:self-auto"
            >
              View All Products
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="veda-hover-lift group overflow-hidden rounded-[20px] border border-[#edd7ab] bg-veda-gold-surface shadow-[0_6px_20px_rgba(90,65,25,0.05)]"
              >
                <div className="relative h-[260px] overflow-hidden bg-gradient-to-b from-[#f9ebce] to-[#f4deb0]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#20150a]/25 via-transparent to-transparent" />

                  <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#e65100] to-[#f27e1f] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_rgba(230,81,0,0.35)] backdrop-blur-sm">
                    {product.discount}
                  </span>

                  <button
                    type="button"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 border border-white/80 text-[#75695c] shadow-[0_4px_14px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-200 hover:text-[#d94a10] hover:scale-110 active:scale-95 cursor-pointer"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={15} />
                  </button>
                </div>

                <div className="p-5">
                  <span className="inline-block text-[8px] font-bold uppercase tracking-[0.28em] text-[#d46714] bg-[#fbf0db] border border-[#ebd5a7] rounded-md px-2 py-0.5">
                    {product.category}
                  </span>

                  <h3 className="mt-2 font-serif text-[18px] font-bold text-[#241a12] transition-colors group-hover:text-[#b36a18] line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#75695c]">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={11}
                        fill="#eab12c"
                        className="text-[#eab12c]"
                      />
                    ))}

                    <span className="ml-1.5 text-[10px] font-medium text-[#75695c]">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#f0dfbe]/70 pt-3.5">
                    <div>
                      <span className="font-serif text-[19px] font-bold text-[#1f160e]">
                        {product.price}
                      </span>

                      <span className="ml-1.5 text-[10.5px] font-medium text-[#9a8d7d] line-through">
                        {product.mrp}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="rounded-full bg-veda-gold-gradient px-4.5 py-1.5 text-[11px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(217,148,38,0.28)] border border-[#ffea9f]/60 transition-all duration-200 hover:shadow-[0_6px_20px_rgba(217,148,38,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRASADAM DOORSTEP DELIVERY
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f9efe0] via-[#f5e7d0] to-[#fbf4e8] px-6 py-10 sm:py-12 lg:py-14 lg:px-8 border-b border-[#ebd7b2]">
        <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl animate-veda-aura" />

        <div className="relative mx-auto grid max-w-[1100px] items-center gap-8 sm:gap-10 lg:grid-cols-2">
          {/* Framed Image */}
          <div className="relative p-2 rounded-[28px] bg-gradient-to-b from-[#f7e4bf] via-[#f2dcad] to-[#e8cb8d] border border-[#dfc89d] shadow-[0_20px_50px_rgba(80,50,15,0.12)]">
            <div className="overflow-hidden rounded-[22px]">
              <img
                src={prasadamSectionImage}
                alt="Prasadam prepared for delivery"
                className="h-[340px] sm:h-[370px] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div>
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#e8ce9b]/70 bg-white/70 px-3 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f] backdrop-blur-md">
              <Sparkles size={11} className="text-[#ef6c1f]" />
              Prasadam Delivery
            </div>

            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
              Receive Blessings at Your Doorstep
            </h2>

            <p className="mt-2.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#75695c]">
              Order authentic prasadam and energized items delivered to your
              home, wherever you are.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                [Globe2, "Worldwide Delivery"],
                [Leaf, "Authentic Prasadam"],
                [PackageCheck, "Secure Packaging"],
                [ShieldCheck, "Trusted Service"],
              ].map(([Icon, text]) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-full border border-[#ebd6ab] bg-white/85 backdrop-blur-md px-4 py-2.5 shadow-[0_3px_12px_rgba(90,65,25,0.04)] transition-all duration-300 hover:border-[#d99426] hover:bg-white hover:shadow-[0_6px_20px_rgba(217,148,38,0.12)]"
                >
                  <span className="grid h-6.5 w-6.5 shrink-0 place-items-center rounded-full bg-[#fcedd7] text-[#d96716]">
                    <Icon size={13} />
                  </span>
                  <span className="text-[11px] font-semibold text-[#2c2219]">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/prasadam"
              className="veda-shimmer-wrap group mt-6 inline-flex items-center gap-2 rounded-full bg-veda-gold-gradient px-7 py-3 text-[12.5px] font-bold text-[#1c1308] shadow-[0_10px_28px_rgba(217,148,38,0.28)] border border-[#ffea9f]/60 transition-all duration-300 hover:shadow-[0_14px_34px_rgba(217,148,38,0.42)] hover:-translate-y-0.5"
            >
              Explore Prasadam
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          SPIRITUAL COURSES
      ====================================================== */}
      <section className="relative bg-[#fffdfa] px-6 py-10 sm:py-12 lg:py-14 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8 sm:mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8ce9b]/70 bg-[#fbf3e4]/80 px-3 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
                <Sparkles size={11} className="text-[#ef6c1f]" />
                Courses
              </div>

              <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
                Learn Ancient Wisdom
              </h2>

              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#75695c]">
                Structured, unhurried courses taught by practitioners.
              </p>
            </div>

            <Link
              to="/courses"
              className="veda-glass-pill group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold text-[#3e3428] transition-all duration-300 hover:border-[#d99426] hover:bg-white hover:text-[#b36a18] hover:shadow-[0_8px_20px_rgba(217,148,38,0.12)] hover:-translate-y-0.5"
            >
              Explore All Courses
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className="veda-hover-lift group overflow-hidden rounded-[20px] border border-[#edd7ab] bg-veda-gold-surface shadow-[0_6px_20px_rgba(90,65,25,0.05)]"
              >
                <div className="relative h-[200px] overflow-hidden bg-gradient-to-b from-[#f9ebce] to-[#f4deb0]">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#1b1208]/75 backdrop-blur-md border border-white/20 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f8de96] shadow-sm">
                    {course.level}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-[18px] font-bold leading-tight text-[#241a12] transition-colors group-hover:text-[#b36a18] line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-[11.5px] font-medium text-[#75695c]">
                    by {course.instructor}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-[9.5px] text-[#75695c]">
                    <span className="rounded-full bg-[#fbf4e5] border border-[#ebd9b7] px-2 py-0.5 font-semibold">
                      {course.duration}
                    </span>
                    <span className="rounded-full bg-[#fbf4e5] border border-[#ebd9b7] px-2 py-0.5 font-semibold">
                      {course.lessons}
                    </span>
                    <span className="rounded-full bg-[#fbf4e5] border border-[#ebd9b7] px-2 py-0.5 font-semibold">
                      {course.level}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={11}
                        fill="#eab12c"
                        className="text-[#eab12c]"
                      />
                    ))}

                    <span className="ml-1 text-[10px] font-medium text-[#75695c]">
                      {course.rating} ({course.reviews})
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#f0dfbe]/70 pt-3.5">
                    <div>
                      <span className="font-serif text-[19px] font-bold text-[#1f160e]">
                        {course.price}
                      </span>

                      <span className="ml-1.5 text-[10.5px] font-medium text-[#9a8d7d] line-through">
                        {course.mrp}
                      </span>
                    </div>

                    <Link
                      to="/courses"
                      className="rounded-full border border-[#dfc99e] bg-[#fffbf2] px-4 py-1.5 text-[10px] font-bold text-[#3d3228] transition-all duration-300 hover:border-[#d99426] hover:bg-[#d99426] hover:text-white hover:shadow-[0_4px_14px_rgba(217,148,38,0.3)]"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERT CONSULTATIONS
      ====================================================== */}
      <section className="relative border-y border-[#eadfc9] bg-[#fffdfa] px-6 py-10 sm:py-12 lg:py-14 lg:px-8">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 sm:mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8ce9b]/70 bg-[#fbf3e4]/80 px-3 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
                <Sparkles size={11} className="text-[#ef6c1f]" />
                Consultations
              </div>

              <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
                Guidance From Trusted Experts
              </h2>

              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#75695c]">
                Verified astrologers, pandits and counsellors.
              </p>
            </div>

            <Link
              to="/experts"
              className="veda-glass-pill rounded-full px-5 py-2.5 text-[11.5px] font-bold text-[#3e3428] transition-all duration-300 hover:border-[#d99426] hover:bg-white hover:text-[#b36a18] hover:shadow-[0_8px_20px_rgba(217,148,38,0.12)]"
            >
              View All Experts
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {experts.map((expert) => (
              <article
                key={expert.name}
                className="veda-hover-lift rounded-[20px] border border-[#edd7ab] bg-veda-gold-surface p-5 sm:p-5.5 shadow-[0_6px_20px_rgba(90,65,25,0.05)]"
              >
                <div className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-[#d99426] via-[#f7d988] to-[#e47e20] shadow-[0_4px_14px_rgba(217,148,38,0.25)]">
                    <div className="h-full w-full overflow-hidden rounded-full bg-[#f8e7c2]">
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-[18px] font-bold text-[#241a12]">
                      {expert.name}
                    </h3>

                    <p className="mt-0.5 text-[11.5px] font-semibold text-[#cf6315]">
                      {expert.expertise}
                    </p>

                    <p className="mt-0.5 text-[10.5px] font-medium text-[#75695c]">
                      {expert.experience}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={11}
                      fill="#eab12c"
                      className="text-[#eab12c]"
                    />
                  ))}

                  <span className="ml-1 text-[10px] font-medium text-[#75695c]">
                    {expert.rating} ({expert.reviews})
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] text-[#75695c]">
                  <span>{expert.languages}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#c96214]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available today
                  </span>
                </div>

                <div className="my-3.5 h-px bg-gradient-to-r from-transparent via-[#eadfc9] to-transparent" />

                <div className="flex items-center justify-between">
                  <p className="font-serif text-[18px] font-bold text-[#1f160e]">
                    {expert.price}
                    <span className="ml-1 text-[10px] font-normal text-[#75695c]">
                      / consultation
                    </span>
                  </p>

                  <Link
                    to="/book-consultation"
                    className="rounded-full bg-veda-gold-gradient px-4.5 py-2 text-[10.5px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(217,148,38,0.25)] border border-[#ffea9f]/60 transition-all duration-200 hover:shadow-[0_6px_20px_rgba(217,148,38,0.4)] hover:scale-105 active:scale-95"
                  >
                    Book Consultation
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS (Four Simple Steps - Interactive Stepper Journey)
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf9f2] via-[#f7ebcf]/70 to-[#faf2dc] px-6 py-10 sm:py-12 lg:py-14 lg:px-8 border-b border-[#ebd7b2]">
        {/* Subtle Ambient Golden Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-amber-400/15 blur-3xl animate-veda-aura" />

        <div className="relative mx-auto max-w-[1280px]">
          {/* Section Header */}
          <div className="mb-8 sm:mb-10 text-center">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/90 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36a18] shadow-xs backdrop-blur-md">
              <Sparkles size={11} className="text-[#d96716]" />
              <span>How It Works</span>
              <span className="text-amber-400">✦</span>
              <span className="font-serif font-bold text-[#945305]">सरल कार्यप्रणाली</span>
              <Sparkles size={11} className="text-[#d96716]" />
            </div>

            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
              Four Simple Steps to Sacred Guidance
            </h2>

            <p className="mt-2 mx-auto max-w-[680px] text-[13.5px] sm:text-[14.5px] text-[#75695c] leading-relaxed">
              From heartfelt intention to authentic temple blessings — experience a seamless, trusted Vedic journey.
            </p>

            {/* Stepper Progress Ribbon Tracker (Tablet & Desktop) */}
            <div className="mt-8 hidden md:block">
              <div className="relative mx-auto max-w-[920px]">
                {/* Connecting Track Line */}
                <div className="absolute top-1/2 left-8 right-8 h-[2.5px] -translate-y-1/2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200" />
                <div className="absolute top-1/2 left-8 right-8 h-[2.5px] -translate-y-1/2 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 opacity-60 blur-xs" />

                {/* 4 Interactive Milestone Nodes */}
                <div className="relative flex justify-between">
                  {[
                    { num: "01", label: "सेवा चयन", en: "Choose Service" },
                    { num: "02", label: "विशेषज्ञ चयन", en: "Select Expert / Item" },
                    { num: "03", label: "संकल्प व बुकिंग", en: "Book & Sankalpa" },
                    { num: "04", label: "आशीर्वाद प्राप्ति", en: "Receive Guidance" },
                  ].map((item, idx) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className={`group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-left transition-all duration-300 cursor-pointer ${
                        activeStep === idx
                          ? "bg-gradient-to-r from-amber-500 via-amber-600 to-[#b85d0d] text-white shadow-[0_4px_16px_rgba(217,119,6,0.35)] ring-3 ring-amber-200"
                          : "bg-white/95 text-[#6e5842] border border-[#ebd7b2] hover:bg-amber-50/80 hover:border-amber-400 shadow-xs"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-serif text-[11px] font-bold transition-all ${
                          activeStep === idx
                            ? "bg-white text-[#945305] shadow-xs"
                            : "bg-amber-100/80 text-[#b36a18] group-hover:bg-amber-400 group-hover:text-amber-950"
                        }`}
                      >
                        {item.num}
                      </span>
                      <div className="leading-tight">
                        <p className={`text-[10px] font-bold ${activeStep === idx ? "text-amber-100" : "text-[#b36a18]"}`}>
                          {item.label}
                        </p>
                        <p className={`text-[11px] font-semibold ${activeStep === idx ? "text-white" : "text-[#2e2318]"}`}>
                          {item.en}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Cards Grid */}
          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                devanagariNum: "१",
                sanskritNum: "चरण ०१",
                sanskritLabel: "सेवा चयन",
                icon: Search,
                title: "Choose a Service",
                description:
                  "Explore spiritual products, temple pujas, sacred prasadam, or personalized astrology consultations.",
                highlights: [
                  "Authentic Puja Kits & Samagri",
                  "Veda Library & Sacred Courses",
                  "Holy Temple Prasadam",
                ],
                actionText: "Explore Services",
                actionLink: "/shop",
              },
              {
                number: "02",
                devanagariNum: "२",
                sanskritNum: "चरण ०२",
                sanskritLabel: "विशेषज्ञ एवं सामग्री",
                icon: UserRound,
                title: "Select Expert or Item",
                description:
                  "Compare verified acharyas, review ratings, sacred lineages, and customize energized items.",
                highlights: [
                  "100% Verified Vedic Acharyas",
                  "Gotra & Nakshatra Matching",
                  "Certified Energized Rudrakshas",
                ],
                actionText: "Meet Acharyas",
                actionLink: "/experts",
              },
              {
                number: "03",
                devanagariNum: "३",
                sanskritNum: "चरण ०३",
                sanskritLabel: "संकल्प व बुकिंग",
                icon: ShieldCheck,
                title: "Book or Purchase",
                description:
                  "Seamless and 100% secure checkout with Gotra Sankalpa details via UPI, cards, or net banking.",
                highlights: [
                  "Individual Gotra Sankalpa",
                  "Encrypted Secure Checkout",
                  "Instant Booking Confirmation",
                ],
                actionText: "Book a Puja",
                actionLink: "/puja/upcoming",
              },
              {
                number: "04",
                devanagariNum: "४",
                sanskritNum: "चरण ०४",
                sanskritLabel: "आशीर्वाद प्राप्ति",
                icon: Award,
                title: "Receive Guidance",
                description:
                  "Doorstep sacred prasadam delivery, video session recordings, and official Vedic certificates.",
                highlights: [
                  "Doorstep Holy Prasadam",
                  "Live Puja Link & Video",
                  "Sanctified Ritual Certificate",
                ],
                actionText: "Track Blessing",
                actionLink: "/prasadam",
              },
            ].map((step, idx) => {
              const StepIcon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`veda-hover-lift group relative flex flex-col justify-between rounded-[22px] border p-5 sm:p-5.5 shadow-[0_8px_24px_rgba(90,65,25,0.06)] transition-all duration-500 cursor-pointer ${
                    isSelected
                      ? "border-amber-400 bg-gradient-to-b from-[#fffdf8] via-[#fffbf2] to-[#faedd0] ring-3 ring-amber-300/60 shadow-[0_16px_36px_rgba(217,148,38,0.22)] -translate-y-1"
                      : "border-[#edd7ab] bg-gradient-to-b from-white via-[#fffdf9] to-[#faf2de] hover:border-amber-400 hover:shadow-[0_14px_30px_rgba(217,148,38,0.16)]"
                  }`}
                >
                  {/* Clipped Inner Layer for Watermark & Glows */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
                    {/* Watermark Devanagari Numeral in Background */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -top-2 select-none font-serif text-[84px] font-black text-amber-950/[0.04] transition-transform duration-500 group-hover:scale-110 group-hover:text-amber-900/[0.08]"
                    >
                      {step.devanagariNum}
                    </span>

                    {/* Bottom Golden Line Accent on Hover / Active */}
                    <span
                      className={`absolute bottom-0 left-0 h-[3.5px] bg-gradient-to-r from-amber-400 via-[#ffd56b] to-amber-500 transition-all duration-500 ${
                        isSelected ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </div>

                  {/* Prominent Visible Directional Arrow Connector (Desktop lg+) */}
                  {idx < 3 && (
                    <div className="pointer-events-none absolute -right-[20px] top-1/2 z-30 hidden -translate-y-1/2 lg:flex items-center justify-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ffe28a] via-[#e5a028] to-[#b35d05] text-[#1c0d02] shadow-[0_4px_14px_rgba(217,148,38,0.55)] ring-3 ring-[#fffdfa] border border-[#ffeaa2] transition-all duration-300 group-hover:scale-110 group-hover:translate-x-0.5 group-hover:shadow-[0_6px_20px_rgba(217,148,38,0.75)]">
                        <ChevronRight
                          size={18}
                          strokeWidth={3}
                          className="text-[#1c0d02] transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Top Step Numeral & Sanskrit Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-[32px] sm:text-[36px] font-black leading-none text-veda-gold-metallic drop-shadow-xs transition-transform duration-300 group-hover:scale-105">
                          {step.number}
                        </span>
                        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#a8743b]">
                          Step
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="font-serif text-[10.5px] font-bold text-[#b36a18] bg-[#fbf0db] border border-[#ebd5a7] rounded-full px-2 py-0.5 shadow-2xs">
                          {step.sanskritNum}
                        </span>
                        <span className="mt-0.5 text-[9px] font-semibold text-[#8f7962]">
                          {step.sanskritLabel}
                        </span>
                      </div>
                    </div>

                    {/* Step Icon Medallion & Title */}
                    <div className="my-3.5 flex items-center gap-3">
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-all duration-300 group-hover:scale-105 ${
                          isSelected
                            ? "bg-veda-gold-gradient border-amber-400 text-amber-950 shadow-[0_4px_14px_rgba(217,148,38,0.35)] ring-2 ring-amber-300"
                            : "bg-gradient-to-br from-[#fef5e4] via-[#fbedcc] to-[#f7ddad] border-[#edd5a8] text-[#cf6915] shadow-inner group-hover:bg-veda-gold-gradient group-hover:text-amber-950"
                        }`}
                      >
                        <StepIcon size={20} strokeWidth={2.2} />
                      </div>

                      <div>
                        <h3 className="font-serif text-[17px] sm:text-[18px] font-bold leading-tight text-[#241a12] transition-colors duration-300 group-hover:text-[#b36a18]">
                          {step.title}
                        </h3>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-700/80">
                          {`Step ${step.number} of 04`}
                        </span>
                      </div>
                    </div>

                    <p className="text-[12px] leading-relaxed text-[#75695c]">
                      {step.description}
                    </p>

                    {/* Step Highlights / Checklist Pills */}
                    <div className="my-3 space-y-1.5">
                      {step.highlights.map((highlight, hIdx) => (
                        <div
                          key={hIdx}
                          className="flex items-center gap-2 rounded-lg bg-[#faf2e1]/70 border border-[#ecd9b8]/80 px-2 py-1 text-[11px] font-medium text-[#5a4835] transition-colors group-hover:bg-[#fbf4e6]"
                        >
                          <CheckCircle2 size={12} className="text-[#d96716] shrink-0" />
                          <span className="truncate">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Link */}
                  <div className="relative z-10 pt-1.5">
                    <Link
                      to={step.actionLink}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#b36a18] transition-all duration-300 hover:text-[#d96716] hover:gap-2"
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight size={12} strokeWidth={2.2} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Sacred Vedic Assurance Bar */}
          <div className="mt-8 rounded-2xl border border-[#eedbb9] bg-gradient-to-r from-[#fffdf8] via-[#fffbf2] to-[#faf3e3] p-4 sm:p-5 shadow-[0_6px_20px_rgba(90,65,25,0.04)]">
            <div className="grid gap-3.5 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#eedbb9]">
              <div className="flex items-center gap-3 px-2.5 py-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-[#b36a18] border border-amber-200 shadow-2xs font-serif font-bold text-[16px]">
                  🕉️
                </div>
                <div>
                  <h4 className="font-serif text-[14px] font-bold text-[#241a12]">
                    100% Vedic Authenticity
                  </h4>
                  <p className="text-[11px] text-[#75695c]">
                    Strict adherence to Shastras & authentic Samagri
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2.5 py-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-[#b36a18] border border-amber-200 shadow-2xs font-serif font-bold text-[16px]">
                  📿
                </div>
                <div>
                  <h4 className="font-serif text-[14px] font-bold text-[#241a12]">
                    Certified Vedic Acharyas
                  </h4>
                  <p className="text-[11px] text-[#75695c]">
                    Direct consultation with verified Gurukul pandits
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2.5 py-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-[#b36a18] border border-amber-200 shadow-2xs font-serif font-bold text-[16px]">
                  ⚡
                </div>
                <div>
                  <h4 className="font-serif text-[14px] font-bold text-[#241a12]">
                    Doorstep Consecrated Prasadam
                  </h4>
                  <p className="text-[11px] text-[#75695c]">
                    Hygienically packed with holy temple charnamrit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE VEDA STRUCTURE (Royal Vedic Trust Pillars)
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fffdfa] via-[#fbf5e7] to-[#fffdfa] px-6 py-10 sm:py-12 lg:py-14 lg:px-8 border-b border-[#ebd7b2]">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[800px] rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="mb-8 sm:mb-10 text-center">
            <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-white/90 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36a18] shadow-xs backdrop-blur-md">
              <Sparkles size={11} className="text-[#d96716]" />
              <span>Why Veda Structure</span>
              <span className="text-amber-400">✦</span>
              <span className="font-serif font-bold text-[#945305]">विशिष्टता एवं विश्वसनीयता</span>
              <Sparkles size={11} className="text-[#d96716]" />
            </div>

            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
              Why Choose Veda Structure?
            </h2>

            <p className="mt-2 mx-auto max-w-[620px] text-[13.5px] sm:text-[14.5px] text-[#75695c] leading-relaxed">
              Uncompromising Vedic authenticity, verified Gurukul lineage, and sacred care at every step.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Leaf,
                sanskritBadge: "शुद्ध व प्राण-प्रतिष्ठित",
                title: "100% Authentic Items",
                description:
                  "Lab-tested Nepali Rudrakshas, sacred brass yantras, and unadulterated pure puja samagri.",
                highlights: ["Lab Certified Rudrakshas", "Sanctified with Mantras", "No Synthetic Additives"],
              },
              {
                icon: UserRound,
                sanskritBadge: "प्रमाणित वैदिक विद्वान",
                title: "Verified Acharyas",
                description:
                  "Connect with authenticated Gurukul scholars, senior astrologers, and spiritual counsellors.",
                highlights: ["15+ Yrs Average Experience", "Traditional Lineage (Parampara)", "Personalized Gotra Vidhi"],
              },
              {
                icon: ShieldCheck,
                sanskritBadge: "सुरक्षित व गोपनीय",
                title: "100% Secure Sankalpa",
                description:
                  "Bank-grade encrypted checkout with individual Gotra Sankalpa recorded specifically for you.",
                highlights: ["Individual Gotra Uccharan", "Encrypted Payments (UPI/Cards)", "Instant Digital Proof"],
              },
              {
                icon: Globe2,
                sanskritBadge: "वैश्विक पवित्र वितरण",
                title: "Worldwide Delivery",
                description:
                  "Direct from holy temple altars to your doorstep across 40+ countries in sealed sacred boxes.",
                highlights: ["Airtight Sanctified Boxes", "Holy Charnamrit Included", "Real-Time Tracking"],
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="veda-hover-lift group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-[#edd7ab] bg-gradient-to-b from-white via-[#fffdf9] to-[#faf2de] p-5 sm:p-6 shadow-[0_8px_24px_rgba(90,65,25,0.05)] transition-all duration-300 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(217,148,38,0.18)]"
                >
                  <div>
                    {/* Top Sanskrit Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-serif text-[10.5px] font-bold text-[#b36a18] bg-[#fbf0db] border border-[#ebd5a7] rounded-full px-2.5 py-0.5 shadow-2xs">
                        {pillar.sanskritBadge}
                      </span>
                      <Sparkles size={12} className="text-[#d96716] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Icon Medallion */}
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#fef5e4] via-[#fbedcc] to-[#f7ddad] border border-[#edd5a8] shadow-inner text-[#cf6915] transition-all duration-300 group-hover:bg-veda-gold-gradient group-hover:text-amber-950 group-hover:scale-105">
                      <Icon size={20} strokeWidth={2} />
                    </div>

                    <h3 className="mt-3.5 font-serif text-[18px] sm:text-[19px] font-bold text-[#241a12] transition-colors group-hover:text-[#b36a18]">
                      {pillar.title}
                    </h3>

                    <p className="mt-1.5 text-[12px] leading-relaxed text-[#75695c]">
                      {pillar.description}
                    </p>

                    {/* Micro Highlights */}
                    <div className="mt-3.5 space-y-1.5 border-t border-[#ebd9b8]/60 pt-2.5">
                      {pillar.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-[11px] font-medium text-[#5a4835]">
                          <CheckCircle2 size={12} className="text-[#d96716] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Golden Line Accent */}
                  <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-amber-400 via-[#ffd56b] to-amber-500 transition-all duration-500 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          DEVOTEE TESTIMONIALS
      ====================================================== */}
      <section className="relative border-t border-[#eadfc9] bg-[#fffdfa] px-6 py-10 sm:py-12 lg:py-14 lg:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-8 sm:mb-10 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e8ce9b]/70 bg-[#fbf3e4]/80 px-3 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
              <Sparkles size={11} className="text-[#ef6c1f]" />
              Community
            </div>

            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
              Trusted by families worldwide
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                quote:
                  "The prasadam reached Dubai in four days, sealed and fresh. My mother cried when she opened the box.",
                name: "Ananya M.",
                location: "Dubai",
              },
              {
                quote:
                  "My consultation with Acharya Rahul was refreshingly honest. No fear, no upselling, just clear guidance.",
                name: "Rohan S.",
                location: "Mumbai",
              },
            ].map((testimonial) => (
              <article
                key={testimonial.name}
                className="veda-hover-lift relative rounded-[22px] border border-[#e8d2a6] bg-veda-gold-surface p-6 sm:p-7 shadow-[0_8px_24px_rgba(90,65,25,0.06)]"
              >
                <p className="font-serif text-[36px] leading-none text-veda-gold-metallic">
                  “
                </p>

                <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed italic text-[#4f4336]">
                  {testimonial.quote}
                </p>

                <div className="mt-4.5 border-t border-[#eadfc9]/70 pt-3.5">
                  <p className="text-[13px] font-bold text-[#241a12]">
                    {testimonial.name}
                  </p>

                  <p className="mt-0.5 text-[10.5px] font-medium text-[#75695c]">
                    {testimonial.location}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 flex justify-center">
            <div className="flex items-center gap-2.5 rounded-full border border-[#ebd6ab] bg-white/85 backdrop-blur-md px-5 py-2.5 shadow-[0_4px_18px_rgba(180,120,40,0.08)]">
              <span className="grid h-5.5 w-5.5 place-items-center rounded-full bg-[#fcedd7] text-[#d96716]">
                <Truck size={13} />
              </span>
              <span className="text-[11px] font-semibold text-[#54473b]">
                Free shipping on orders above ₹1,999
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          GRAND SANCTUARY FINAL CTA
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8edd8] to-[#f4e4ca] px-6 py-10 sm:py-12 lg:py-14 lg:px-8 border-t border-[#ead8b8]">
        <div className="relative mx-auto max-w-[920px] overflow-hidden rounded-[28px] border-2 border-[#dfc495] bg-veda-cta-gradient px-6 py-10 sm:px-12 sm:py-12 text-center shadow-[0_24px_55px_rgba(100,65,20,0.12)]">
          {/* Radial Sacred Ambient Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-0 h-64 w-96 rounded-full bg-gradient-to-b from-[#f5ce6f]/25 to-transparent blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e8ce9b]/70 bg-white/80 px-3.5 py-1 shadow-sm backdrop-blur-md">
              <Sparkles size={11} className="text-[#ef6c1f]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ef6c1f]">
                Begin your journey
              </p>
            </div>

            <h2 className="mt-3 font-serif text-[26px] font-bold leading-tight text-[#241c15] sm:text-[32px] lg:text-[36px]">
              Wisdom is closer than you think.
            </h2>

            <p className="mx-auto mt-2.5 max-w-[620px] text-[13.5px] sm:text-[14px] leading-relaxed text-[#75695c]">
              Explore authentic spiritual products, learn from trusted teachers,
              or connect with an expert for personal guidance.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="veda-shimmer-wrap group inline-flex items-center gap-2 rounded-full bg-veda-gold-gradient px-7 py-3.5 text-[12.5px] sm:text-[13px] font-bold text-[#1c1308] shadow-[0_10px_28px_rgba(217,148,38,0.3)] border border-[#ffea9f]/60 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(217,148,38,0.45)] hover:-translate-y-0.5"
              >
                <span>Explore Veda</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/book-consultation"
                className="veda-glass-pill rounded-full px-7 py-3.5 text-[12.5px] sm:text-[13px] font-bold text-[#3e3428] transition-all duration-300 hover:border-[#d99426] hover:bg-white hover:text-[#b36a18] hover:shadow-[0_10px_24px_rgba(180,125,40,0.12)] hover:-translate-y-0.5"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
