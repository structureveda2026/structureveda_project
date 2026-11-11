import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Sparkles,
  Flame,
  ScrollText,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  ChevronRight as BreadcrumbChevron,
  PackageCheck,
  Flower2,
  Calendar,
} from "lucide-react";

import navagrahaHeroSacredFireImg from "../../../../assets/images/homa/navagraha-hero-sacred-fire.jpg";
import navagrahaRitualShowcaseImg from "../../../../assets/images/homa/navagraha-ritual-showcase.jpg";
import navagrahaSacredSamagriImg from "../../../../assets/images/homa/navagraha-sacred-samagri.jpg";
import navagrahaMandalaYantraImg from "../../../../assets/images/homa/navagraha-mandala-yantra.jpg";
import cardYagyaFireImg from "../../../../assets/images/library/cards/card-yagya-fire.jpg";

const NAVAGRAHA_FAQS = [
  {
    q: "Why are nine distinct sacred woods (Samidhas) used in Navagraha Homa?",
    a: "In Vedic Shastras, each celestial deity corresponds to a specific botanical Samidha—such as Arka for Surya, Palasha for Chandra, Khadira for Mangala, Apamarga for Budha, Ashvattha for Guru, Audumbara for Shukra, Shami for Shani, Durva for Rahu, and Kusha for Ketu. Offering these prescribed woods into consecrated Agni attracts harmonic planetary vibrations.",
  },
  {
    q: "Can I participate in the Navagraha Homa remotely?",
    a: "Yes. Devotees unable to visit Kashi (Varanasi) in person can participate remotely via a private, high-definition live video stream. Your Gotra, Nakshatra, and Rashi Sankalpa will be recited verbatim before the sacred fire, and energized Prasad will be safely dispatched to your residence.",
  },
  {
    q: "Which astrological details are required for the Sankalpa?",
    a: "To ensure precise cosmic resonance, you will provide the primary Yajman's full name, Gotra, Janma Nakshatra, and Rashi. If your Gotra is unknown, our Acharyas invoke the universal Kashyapa Gotra in accordance with traditional Vedic injunctions.",
  },
  {
    q: "How do I choose between 1, 3, or 5 Havan sessions?",
    a: "A 1-Havan ceremony is completed in a single 3–4 hour morning session, ideal for general planetary peace and birthday blessings. A 3-Havan ceremony extends Ahutis across multiple Sandhyas or 2 days for significant dasha transitions. A 5-Havan anushthan is a grand ritual recommended for pacifying deep doshas or during Sade Sati peaks.",
  },
  {
    q: "Can immediate family members be included in the Sankalpa?",
    a: "Yes. You can add up to 5 family members (spouse, children, parents) during the booking process. Their names and birth stars will be formally joined into the unified family Sankalpa during the Agni invocation.",
  },
  {
    q: "What consecrated Prasad will I receive after the ceremony?",
    a: "Following the Purnahuti, you will receive sanctified Agni Bhasma (sacred Homa ash), a blessed Navagraha coin token, consecrated Akshat (blessed unbroken rice), and energized Raksha Sutra threads dispatched by express post.",
  },
  {
    q: "How many Pandits perform the Navagraha Homa?",
    a: "A standard 1-day single Havan is conducted by 2 initiated Vedic scholars. For 3 or 5 Havan configurations, the Acharya team scales from 3 up to 9 initiated priests specializing in the Navagraha Samhita and Beeja Mantra traditions.",
  },
];

/**
 * NavagrahaCategoryView Component
 * Premium 5-Section Editorial Experience for /yagya-puja/homa/category/navagraha-planetary-homa
 */
export default function NavagrahaCategoryView({
  category,
  service,
  servicesLoading,
  categoryLoading,
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [featuredImgError, setFeaturedImgError] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  // Safe service data resolution
  const startingDakshina = service?.formattedPrice || (service?.startingPrice ? `₹${Number(service.startingPrice).toLocaleString("en-IN")}` : "₹9,500");
  const havanCounts = Array.isArray(service?.availableHavanCounts) && service.availableHavanCounts.length > 0
    ? service.availableHavanCounts
    : [1, 3, 5];
  const durationDays = Array.isArray(service?.availableDays) && service.availableDays.length > 0
    ? service.availableDays
    : [1, 2];
  const samagriList = Array.isArray(service?.samagri) && service.samagri.length > 0
    ? service.samagri
    : [
        { name: "Havan Samagri", status: "Included" },
        { name: "Pure Cow Ghrita", status: "Included" },
        { name: "9 Planetary Sacred Woods", status: "Included" },
        { name: "Navadhanya (9 Grains)", status: "Included" },
        { name: "9 Colored Cloths", status: "Included" },
        { name: "Special Offerings (Planetary Herbs)", status: "Included" },
        { name: "Flowers", status: "Included" },
        { name: "Navagraha Yantra Archana", status: "Optional" },
      ];

  const featuredImageSrc = !featuredImgError
    ? navagrahaRitualShowcaseImg
    : cardYagyaFireImg;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#29231B]">
      {/* ── BREADCRUMB NAVIGATION ── */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#EAD8B8] bg-[#FAF6EE] px-5 py-3.5 sm:px-8 lg:px-12"
      >
        <div className="mx-auto flex max-w-[1280px] items-center gap-2 text-[12.5px] text-[#786A5B]">
          <Link
            to="/"
            className="transition hover:text-[#B7791F] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B7791F]"
          >
            Home
          </Link>
          <BreadcrumbChevron size={12} className="text-[#A89988]" />
          <Link
            to="/yagya-puja"
            className="transition hover:text-[#B7791F] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B7791F]"
          >
            Yagya &amp; Puja
          </Link>
          <BreadcrumbChevron size={12} className="text-[#A89988]" />
          <Link
            to="/yagya-puja/homa"
            className="transition hover:text-[#B7791F] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B7791F]"
          >
            Homa / Havan
          </Link>
          <BreadcrumbChevron size={12} className="text-[#A89988]" />
          <span
            aria-current="page"
            className="font-semibold text-[#B7791F] truncate max-w-[220px] sm:max-w-none"
          >
            Navagraha Planetary Homa
          </span>
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: NAVAGRAHA CATEGORY HERO
      ══════════════════════════════════════════════════════════════ */}
      <header className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] overflow-hidden bg-[#1C120C] text-white flex items-center">
        {/* Full-width High-Resolution Hero Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={navagrahaHeroSacredFireImg}
            alt="Navagraha Planetary Homa Sacred Fire Ceremony"
            className="h-full w-full object-cover object-[80%_center] lg:object-[85%_center]"
          />
          {/* Subtle multi-directional gradients preserving daylight on Kund while darkening left text space */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C120C]/95 via-[#231710]/85 via-45% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C120C]/90 via-transparent to-[#1C120C]/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="max-w-[720px]">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5CE6F]/30 bg-black/50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#F5CE6F] backdrop-blur-md shadow-xs">
              <Compass size={13} className="text-[#EAB12C]" />
              <span>VEDIC GRAHA SHANTI • 9 CELESTIAL DEITIES</span>
            </div>

            {/* H1 Heading */}
            <h1 className="mt-4 font-serif text-[34px] font-bold leading-[1.15] tracking-tight text-[#FFFDF9] sm:text-[46px] lg:text-[54px]">
              Navagraha Planetary <span className="text-[#F5CE6F]">Homa</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-[14px] font-medium tracking-wide uppercase text-[#E0B84C] sm:text-[15px]">
              Sacred Fire Oblations with 9 Prescribed Botanical Samidhas
            </p>

            {/* Concise Description */}
            <p className="mt-4 text-[15px] leading-relaxed text-[#E6DDD3] sm:text-[16.5px]">
              Consecrated Vedic fire oblations offering nine distinct botanical Samidhas to harmonize the nine celestial spheres, pacify planetary doshas, and restore cosmic balance in Kashi or remotely.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#featured-ritual"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-6 py-3.5 text-[13.5px] font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5CE6F]"
              >
                <span>Explore Ceremony</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="#about-navagraha"
                className="inline-flex items-center gap-2 rounded-xl border border-[#EAD8B8]/35 bg-[#24170E]/60 px-6 py-3.5 text-[13.5px] font-semibold text-[#F0E3CE] backdrop-blur-xs transition hover:border-[#F5CE6F]/60 hover:bg-[#24170E]/80 hover:text-white"
              >
                <span>Learn About the Ritual</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/15 pt-5 text-[12px] text-[#D8C7B5]">
              <div className="flex items-center gap-1.5">
                <Flame size={13} className="text-[#EAB12C]" />
                <span>9 Shastric Botanical Woods</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1.5">
                <Users size={13} className="text-[#EAB12C]" />
                <span>Initiated Vedic Purohits</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[#EAB12C]" />
                <span>Kashi Sanctum &amp; Remote</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: ABOUT NAVAGRAHA HOMA (TWO-COLUMN EDITORIAL)
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="about-navagraha"
        className="scroll-mt-12 border-b border-[#EAD8B8] bg-[#FAF6EE] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Column: Dedicated Navagraha Ritual Visual */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[24px] border border-[#EAD8B8] bg-[#241A12] shadow-md">
                <img
                  src={navagrahaMandalaYantraImg}
                  alt="Navagraha Planetary Altar Setup with Sacred Lamps and Mandala"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11.5px] font-semibold text-[#F5CE6F] backdrop-blur-md">
                    <Sparkles size={12} className="text-[#EAB12C]" />
                    Consecrated Planetary Mandala &amp; Agni Sthapana
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Explanation & 3 Info Cards */}
            <div className="lg:col-span-7">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F]">
                SACRED CELESTIAL SACRIFICE
              </p>
              <h2 className="mt-2 font-serif text-[28px] font-bold leading-snug text-[#29231B] sm:text-[34px] lg:text-[38px]">
                The Vedic Science of Navagraha Shanti
              </h2>
              <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#685C4F] sm:text-[15.5px]">
                In Vedic cosmology, human life is intimately interwoven with the nine cosmic energy centers (Navagrahas). When planetary alignments create disharmony or during significant dasha periods, traditional fire oblations into consecrated Agni pacify adverse influences and invoke divine grace.
              </p>

              {/* 3 Compact Information Cards */}
              <div className="mt-7 grid gap-3.5 sm:grid-cols-3">
                {/* Card 1: Nine Celestial Deities */}
                <div className="rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] p-4 shadow-2xs transition-all hover:border-[#B7791F]/70">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#B7791F]">
                    <Compass size={18} />
                  </div>
                  <h3 className="mt-3 font-serif text-[15px] font-bold text-[#29231B]">
                    Nine Celestial Deities
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#766D60]">
                    Invoking Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, and Ketu through prescribed Beeja mantras and Samhita hymns.
                  </p>
                </div>

                {/* Card 2: Sacred Botanical Offerings */}
                <div className="rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] p-4 shadow-2xs transition-all hover:border-[#B7791F]/70">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#B7791F]">
                    <Flame size={18} />
                  </div>
                  <h3 className="mt-3 font-serif text-[15px] font-bold text-[#29231B]">
                    Sacred Botanical Woods
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#766D60]">
                    Offering nine specific botanical woods (Arka, Palasha, Khadira, Apamarga, Ashvattha, Audumbara, Shami, Durva, Kusha) matched to each planetary vibration.
                  </p>
                </div>

                {/* Card 3: Traditional Sankalpa */}
                <div className="rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] p-4 shadow-2xs transition-all hover:border-[#B7791F]/70">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#B7791F]">
                    <ScrollText size={18} />
                  </div>
                  <h3 className="mt-3 font-serif text-[15px] font-bold text-[#29231B]">
                    Yajman Sankalpa Vidhi
                  </h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[#766D60]">
                    Conducted with personalized Gotra, Nakshatra, and Rashi Sankalpa, preliminary Ganapati Pujan, Navagraha Sthapana, Ahuti cadence, and Purnahuti.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: FEATURED NAVAGRAHA HOMA SERVICE (HORIZONTAL CARD)
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="featured-ritual"
        className="scroll-mt-12 border-b border-[#EAD8B8] bg-[#FFFDF9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* Section Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#EAD8B8] pb-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B7791F]">
                <Sparkles size={12} className="text-[#C77722]" />
                <span>Featured Planetary Service</span>
              </div>
              <h2 className="mt-1 font-serif text-[28px] font-bold text-[#29231B] sm:text-[34px]">
                Navagraha Homa Ceremony
              </h2>
            </div>
            <div className="text-[13px] text-[#786A5B]">
              Showing <strong className="text-[15px] font-bold text-[#29231B]">1</strong> Consecrated Planetary Homa
            </div>
          </div>

          {/* Premium Horizontal Featured Service Card */}
          <div className="mt-8 overflow-hidden rounded-[24px] border border-[#EAD8B8] bg-[#FFFDF9] shadow-md transition-all duration-300 hover:border-[#B7791F] hover:shadow-[0_16px_36px_rgba(183,121,31,0.12)]">
            <div className="grid lg:grid-cols-12">
              {/* Left Column (5 cols): Ritual Showcase Visual */}
              <div className="relative min-h-[260px] sm:min-h-[320px] lg:col-span-5 lg:min-h-full overflow-hidden bg-[#241A12]">
                <img
                  src={featuredImageSrc}
                  alt="Navagraha Homa Sacred Ritual"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={() => setFeaturedImgError(true)}
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />

                {/* Floating Badges */}
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1F160E]/85 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#F5CE6F] backdrop-blur-md shadow-xs">
                    <Sparkles size={11} className="text-[#EAB12C]" />
                    Featured Homa
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-[#F0E3CE] backdrop-blur-xs">
                    <MapPin size={11} className="text-[#EAB12C]" />
                    Kashi Kshetra
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-[#D9CFC1] backdrop-blur-xs">
                    Remote Live Stream
                  </span>
                </div>
              </div>

              {/* Right Column (7 cols): Comprehensive Ritual Specifications & CTAs */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                <div>
                  {/* Category & Cadence Row */}
                  <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#B7791F]">
                    <span>{service?.homaType || "Vedic Planetary Homa"}</span>
                    <span className="text-[#D8C7B5]">•</span>
                    <div className="flex items-center gap-1 text-[#766D60]">
                      <Clock size={12} className="text-[#C77722]" />
                      <span>{service?.dailyHours || "3 – 4 Hours Daily"}</span>
                    </div>
                  </div>

                  {/* Heading */}
                  <h3 className="mt-2 font-serif text-[24px] font-bold text-[#29231B] sm:text-[28px]">
                    {service?.name || "Navagraha Homa"}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-[14px] leading-relaxed text-[#685C4F] sm:text-[15px]">
                    {service?.description ||
                      "The Navagraha Homa utilizes specific sacred woods (such as Arka for Sun, Palasha for Moon, Khadira for Mars) and Beeja mantras to balance astrological planetary periods (Dashas) and foster serenity."}
                  </p>

                  {/* Specifications Grid */}
                  <div className="mt-6 grid gap-4 rounded-[18px] border border-[#EAD8B8] bg-[#FAF6EE] p-4.5 sm:grid-cols-2">
                    {/* Supported Havans */}
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                        Supported Havan Counts:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {havanCounts.map((cnt) => (
                          <span
                            key={cnt}
                            className="inline-flex items-center gap-1 rounded-md border border-[#EAD8B8] bg-[#FFFDF9] px-2.5 py-1 text-[11.5px] font-semibold text-[#B7791F]"
                          >
                            <Flame size={11} className="text-[#C77722]" />
                            {cnt} {cnt === 1 ? "Havan" : "Havans"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Available Durations */}
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                        Available Durations:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {durationDays.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center gap-1 rounded-md border border-[#EAD8B8] bg-[#FFFDF9] px-2.5 py-1 text-[11.5px] font-semibold text-[#5C4E3F]"
                          >
                            <Calendar size={11} className="text-[#C77722]" />
                            {d} {d === 1 ? "Day" : "Days"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pandit Credentials */}
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                        Pandit Requirements:
                      </span>
                      <p className="mt-1 text-[12.5px] font-medium text-[#29231B]">
                        {service?.minimumPandits || 2} to {service?.maximumPandits || 9} Initiated Purohits
                      </p>
                      <p className="text-[11px] text-[#766D60]">
                        {service?.requiredSkills || "Navagraha Samhita & Beeja Mantra Priests"}
                      </p>
                    </div>

                    {/* Prasad Details */}
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                        Consecrated Prasad:
                      </span>
                      <p className="mt-1 text-[12px] font-medium text-[#29231B] line-clamp-2">
                        {service?.prasad || "Blessed Navagraha coin, sacred Homa ash, and consecrated Akshat"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing & Conversion CTA Row */}
                <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-[#EAD8B8] pt-6 sm:flex-row sm:items-center">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7966]">
                      Starting Dakshina
                    </span>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className="font-serif text-[28px] font-bold text-[#B7791F]">
                        {startingDakshina}
                      </span>
                      <span className="text-[11.5px] text-[#766D60]">All-inclusive Vidhi</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <Link
                      to="/yagya-puja/homa/navagraha-homa"
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-[#B7791F] bg-[#FFFDF9] px-5 py-3 text-[13px] font-bold text-[#B7791F] shadow-2xs transition hover:bg-[#FAF0DC]"
                    >
                      <span>View Ceremony</span>
                      <ArrowRight size={14} />
                    </Link>

                    <Link
                      to="/yagya-puja/homa/navagraha-homa/book"
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:brightness-110"
                    >
                      <span>Book Ceremony</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 4: CEREMONY DETAILS AND SACRED INCLUSIONS
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="ceremony-details"
        className="scroll-mt-12 border-b border-[#EAD8B8] bg-[#FAF6EE] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* Section Header */}
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F]">
              AUTHENTIC RITUAL SPECIFICATIONS
            </p>
            <h2 className="mt-2 font-serif text-[28px] font-bold text-[#29231B] sm:text-[34px] lg:text-[38px]">
              Ceremony Details &amp; Sacred Inclusions
            </h2>
            <p className="mx-auto mt-3 max-w-[620px] text-[14.5px] leading-relaxed text-[#685C4F]">
              Every Navagraha Homa is conducted with pure botanical Samidhas, certified Cow Ghrita, and traditional planetary grains according to the Rigvedic and Yajurvedic Grihya Sutras.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Samagri Visual & Key Specifications */}
            <div className="lg:col-span-5 space-y-6">
              <div className="overflow-hidden rounded-[22px] border border-[#EAD8B8] bg-[#241A12] shadow-sm">
                <img
                  src={navagrahaSacredSamagriImg}
                  alt="Authentic Navagraha Homa Sacred Samagri and Woods"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="p-4 bg-[#FFFDF9] border-t border-[#EAD8B8]">
                  <p className="text-[12px] font-semibold text-[#8A7966] uppercase tracking-wider">
                    Sacred Material Integrity
                  </p>
                  <p className="mt-1 text-[13px] text-[#29231B]">
                    Pure botanical Samidhas, Navadhanya (9 grains), and Cow Ghrita assembled fresh in Kashi.
                  </p>
                </div>
              </div>

              {/* 2 Micro Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] p-4 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#B7791F]">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#29231B]">
                    Initiated Acharyas
                  </h4>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[#766D60]">
                    Conducted strictly by scholars proficient in Navagraha Suktas and Beeja Mantra swaras.
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] p-4 shadow-2xs">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#B7791F]">
                    <PackageCheck size={16} />
                  </div>
                  <h4 className="mt-2.5 font-serif text-[14px] font-bold text-[#29231B]">
                    Dispatched Prasad
                  </h4>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[#766D60]">
                    Sanctified Homa Bhasma, energized coin, and Akshat delivered post-Purnahuti.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Verified Samagri Inclusions Table / List */}
            <div className="lg:col-span-7">
              <div className="rounded-[22px] border border-[#EAD8B8] bg-[#FFFDF9] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EAD8B8] pb-4">
                  <h3 className="font-serif text-[18px] font-bold text-[#29231B]">
                    Itemized Sacred Samagri
                  </h3>
                  <span className="text-[11.5px] font-medium text-[#766D60]">
                    Verified Shastric Preparation
                  </span>
                </div>

                <div className="mt-4 divide-y divide-[#F2E8D8]">
                  {samagriList.map((item, idx) => {
                    const itemName = typeof item === "string" ? item : item.name;
                    const itemStatus = typeof item === "string" ? "Included" : item.status || "Included";
                    const isOptional = itemStatus.toLowerCase().includes("optional");

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-3.5 text-[13.5px]"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2
                            size={16}
                            className={isOptional ? "text-[#C77722]" : "text-[#2E7D32]"}
                          />
                          <span className="font-medium text-[#29231B]">{itemName}</span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                            isOptional
                              ? "border border-[#EAD8B8] bg-[#FAF0DC] text-[#A05C12]"
                              : "border border-[#C8E6C9] bg-[#E8F5E9] text-[#2E7D32]"
                          }`}
                        >
                          {itemStatus}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Shastric Clarification Footer */}
                <div className="mt-6 rounded-xl border border-[#EAD8B8] bg-[#FAF6EE] p-4 text-[12px] text-[#766D60] leading-relaxed">
                  <strong className="text-[#29231B]">Shastric Discipline:</strong> All sacred materials are gathered according to the traditional botanical calendar. Ghee is sourced exclusively from indigenous Desi cows, ensuring purity for the sacrificial flame.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 5: NAVAGRAHA FAQs AND FINAL CONVERSION CTA
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="navagraha-faqs"
        className="scroll-mt-12 bg-[#FFFDF9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* FAQ Section Header */}
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F]">
              COMMON QUESTIONS
            </p>
            <h2 className="mt-2 font-serif text-[28px] font-bold text-[#29231B] sm:text-[34px] lg:text-[38px]">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-3 max-w-[580px] text-[14.5px] leading-relaxed text-[#685C4F]">
              Clarifications on planetary oblations, remote participation, birth details, and ceremony execution.
            </p>
          </div>

          {/* 2-Column Responsive FAQ Accordion */}
          <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:items-start">
            {/* Left Column (First 4 FAQs) */}
            <div className="space-y-4">
              {NAVAGRAHA_FAQS.slice(0, 4).map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] shadow-2xs transition-all duration-200 hover:border-[#B7791F]/70"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[#FAF6EE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7791F] cursor-pointer"
                    >
                      <span className="font-serif text-[15px] font-bold text-[#29231B] sm:text-[16px]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={17}
                        className={`shrink-0 text-[#B7791F] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#F2E8D8] px-5 pb-5 pt-3 text-[13.5px] leading-relaxed text-[#685C4F]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column (Remaining 3 FAQs) */}
            <div className="space-y-4">
              {NAVAGRAHA_FAQS.slice(4).map((faq, relIdx) => {
                const actualIdx = relIdx + 4;
                const isOpen = openFaqIndex === actualIdx;
                return (
                  <div
                    key={actualIdx}
                    className="overflow-hidden rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] shadow-2xs transition-all duration-200 hover:border-[#B7791F]/70"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(actualIdx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[#FAF6EE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7791F] cursor-pointer"
                    >
                      <span className="font-serif text-[15px] font-bold text-[#29231B] sm:text-[16px]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={17}
                        className={`shrink-0 text-[#B7791F] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#F2E8D8] px-5 pb-5 pt-3 text-[13.5px] leading-relaxed text-[#685C4F]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── FINAL CONVERSION CTA BANNER ── */}
          <div className="mt-16 overflow-hidden rounded-[26px] bg-[#241910] text-white shadow-xl relative">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#B7791F]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C77722]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 py-14 sm:px-10 sm:py-16 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#554030] bg-[#352517] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#E89B4F]">
                <Compass size={13} className="text-[#E89B4F]" />
                <span>HARMONIZE YOUR COSMIC SPHERES</span>
              </div>

              <h2 className="mt-5 font-serif text-[30px] font-bold text-[#FAF4E6] sm:text-[42px] leading-tight">
                Arrange Your Consecrated Navagraha Homa
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-[14.5px] font-light leading-relaxed text-[#D1C5B6] sm:text-[16.5px]">
                Select your Havan cadence, formulate your sacred Sankalpa, and receive blessings from the nine celestial deities through authentic Vedic fire rituals.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/yagya-puja/homa/navagraha-homa/book"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:brightness-110"
                >
                  <span>Book Navagraha Homa</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/yagya-puja/homa"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#574332] bg-[#302115] px-7 py-3.5 text-[13px] font-semibold text-[#EEDAC3] transition hover:bg-[#3E2B1C] hover:text-white"
                >
                  <span>Explore All Homa Categories</span>
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap justify-center items-center gap-6 border-t border-[#3A2C22] pt-6 text-[12px] text-[#A39382]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B7791F]" />
                  <span>Shastric Agnihotra Discipline</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B7791F]" />
                  <span>Service-Specific Havan Counts (1, 3, 5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B7791F]" />
                  <span>Kashi &amp; Remote Live Sankalpa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

