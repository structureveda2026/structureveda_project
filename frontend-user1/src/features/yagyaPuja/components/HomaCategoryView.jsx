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
  Calendar,
  Coins,
  Home,
  Heart,
  Search,
  X,
} from "lucide-react";

import {
  getCategoryVisuals,
  getHomaCategoryConfig,
} from "../data/homaCategoryConfig.js";
import HomaServiceCard from "./HomaServiceCard";

// Icon resolution helper for dynamic category cards
const ICON_MAP = {
  Compass,
  Sparkles,
  Flame,
  ScrollText,
  ShieldCheck,
  Coins,
  Home,
  Heart,
  CheckCircle2,
};

function resolveIcon(iconName, defaultIcon = Sparkles) {
  if (!iconName) return defaultIcon;
  return ICON_MAP[iconName] || defaultIcon;
}

/**
 * Universal HomaCategoryView Component
 * Dynamic 5-Section Editorial Experience applied across ALL Homa categories:
 * - Section 1: Dynamic Category Hero
 * - Section 2: About Category (2-Column Editorial with 3 info cards)
 * - Section 3: Adaptive Service Showcase (1 service = horizontal, 2 services = 2-col, 3+ = grid)
 * - Section 4: Ceremony Details & Verified Inclusions
 * - Section 5: Category FAQs & Final Conversion CTA
 */
export default function HomaCategoryView({
  category,
  services = [],
  servicesLoading = false,
  categoryLoading = false,
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [cardImgErrors, setCardImgErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  const categorySlug = category?.slug || "";
  const visuals = getCategoryVisuals(categorySlug);
  const config = getHomaCategoryConfig(categorySlug);

  const CategoryIcon = resolveIcon(config.iconName, Flame);

  // Representative primary service for single-service showcases & inclusions
  const primaryService = services[0] || null;

  // Safe service parameters resolution
  const startingDakshina =
    primaryService?.formattedPrice ||
    (primaryService?.startingPrice
      ? `₹${Number(primaryService.startingPrice).toLocaleString("en-IN")}`
      : "₹9,500");

  const havanCounts =
    Array.isArray(primaryService?.availableHavanCounts) &&
    primaryService.availableHavanCounts.length > 0
      ? primaryService.availableHavanCounts
      : [1, 3, 5];

  const durationDays =
    Array.isArray(primaryService?.availableDays) &&
    primaryService.availableDays.length > 0
      ? primaryService.availableDays
      : [1, 2];

  const samagriList =
    Array.isArray(primaryService?.samagri) && primaryService.samagri.length > 0
      ? primaryService.samagri
      : [
          { name: "Havan Samagri", status: "Included" },
          { name: "Pure Cow Ghrita", status: "Included" },
          { name: "Sacred Botanical Samidha", status: "Included" },
          { name: "Navadhanya Grains", status: "Included" },
          { name: "Pushpa & Malas", status: "Included" },
          { name: "Kashi Bhasma Consecration", status: "Included" },
        ];

  // Filtering for categories with multiple services (e.g. Shiva & Rudra)
  const filteredServices = services
    .filter((svc) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        svc.name?.toLowerCase().includes(q) ||
        svc.shortDescription?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return (Number(a.startingPrice) || 0) - (Number(b.startingPrice) || 0);
      }
      if (sortBy === "price-desc") {
        return (Number(b.startingPrice) || 0) - (Number(a.startingPrice) || 0);
      }
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return 0; // featured default
    });

  const renderHeading = (name) => {
    if (!name) return "Vedic Homa";
    const parts = name.split(/(Homa)/i);
    return parts.map((part, i) =>
      part.toLowerCase() === "homa" ? (
        <span key={i} className="text-[#F5CE6F]">{part}</span>
      ) : (
        part
      )
    );
  };

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
            {categoryLoading ? "Loading..." : category?.name || "Category"}
          </span>
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: DYNAMIC CATEGORY HERO
      ══════════════════════════════════════════════════════════════ */}
      <header className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] overflow-hidden bg-[#1C120C] text-white flex items-center">
        {/* Full-width Category Hero Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src={visuals.hero}
            alt={category?.name || "Vedic Homa Category"}
            className="h-full w-full object-cover object-[80%_center] lg:object-[85%_center]"
          />
          {/* Multi-directional gradients preserving flame radiance while supporting left text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C120C]/95 via-[#231710]/85 via-45% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C120C]/90 via-transparent to-[#1C120C]/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="max-w-[720px]">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F5CE6F]/30 bg-black/50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#F5CE6F] backdrop-blur-md shadow-xs">
              <CategoryIcon size={13} className="text-[#EAB12C]" />
              <span>{config.eyebrow}</span>
            </div>

            {/* H1 Heading */}
            <h1 className="mt-4 font-serif text-[34px] font-bold leading-[1.15] tracking-tight text-[#FFFDF9] sm:text-[46px] lg:text-[54px]">
              {categoryLoading ? (
                <span className="inline-block h-12 w-64 animate-pulse rounded-lg bg-white/20" />
              ) : (
                renderHeading(category?.name)
              )}
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-[14px] font-medium tracking-wide uppercase text-[#E0B84C] sm:text-[15px]">
              {config.subtitle}
            </p>

            {/* Description */}
            <p className="mt-4 text-[15px] leading-relaxed text-[#E6DDD3] sm:text-[16.5px]">
              {category?.description || config.aboutDescription}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#category-services"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-6 py-3.5 text-[13.5px] font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5CE6F]"
              >
                <span>Explore Ceremony</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="#about-category"
                className="inline-flex items-center gap-2 rounded-xl border border-[#EAD8B8]/35 bg-[#24170E]/60 px-6 py-3.5 text-[13.5px] font-semibold text-[#F0E3CE] backdrop-blur-xs transition hover:border-[#F5CE6F]/60 hover:bg-[#24170E]/80 hover:text-white"
              >
                <span>Learn About the Ritual</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/15 pt-5 text-[12px] text-[#D8C7B5]">
              {config.trustIndicators.map((indicator, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-white/20">•</span>}
                  <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-[#EAB12C]" />
                    <span>{indicator}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: ABOUT CATEGORY (TWO-COLUMN EDITORIAL)
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="about-category"
        className="scroll-mt-12 border-b border-[#EAD8B8] bg-[#FAF6EE] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Column: Dedicated Visual */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-[24px] border border-[#EAD8B8] bg-[#241A12] shadow-md">
                <img
                  src={visuals.about}
                  alt={`${category?.name || "Vedic Homa"} Altar and Sacred Setup`}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11.5px] font-semibold text-[#F5CE6F] backdrop-blur-md">
                    <Sparkles size={12} className="text-[#EAB12C]" />
                    Consecrated Vedic Agni Sthapana &amp; Vidhi
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Explanation & 3 Info Cards */}
            <div className="lg:col-span-7">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F]">
                SACRED TRADITION
              </p>
              <h2 className="mt-2 font-serif text-[28px] font-bold leading-snug text-[#29231B] sm:text-[34px] lg:text-[38px]">
                {config.aboutTitle}
              </h2>
              <p className="mt-3.5 text-[14.5px] leading-relaxed text-[#685C4F] sm:text-[15.5px]">
                {config.aboutDescription}
              </p>

              {/* 3 Compact Information Cards */}
              <div className="mt-7 grid gap-3.5 sm:grid-cols-3">
                {config.aboutCards.map((card, idx) => {
                  const CardIcon = resolveIcon(card.iconName, Sparkles);
                  return (
                    <div
                      key={idx}
                      className="rounded-[18px] border border-[#EAD8B8] bg-[#FFFDF9] p-4 shadow-2xs transition-all hover:border-[#B7791F]/70"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FAF0DC] text-[#B7791F]">
                        <CardIcon size={18} />
                      </div>
                      <h3 className="mt-3 font-serif text-[15px] font-bold text-[#29231B]">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-[#766D60]">
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: ADAPTIVE SERVICE LISTING
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="category-services"
        className="scroll-mt-12 border-b border-[#EAD8B8] bg-[#FFFDF9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-4 border-b border-[#EAD8B8] pb-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B7791F]">
                <Sparkles size={12} className="text-[#C77722]" />
                <span>Available Consecrated Ceremonies</span>
              </div>
              <h2 className="mt-1 font-serif text-[28px] font-bold text-[#29231B] sm:text-[34px]">
                {category?.name || "Homa"} Rituals
              </h2>
            </div>
            <div className="text-[13px] text-[#786A5B]">
              Showing{" "}
              <strong className="text-[15px] font-bold text-[#29231B]">
                {servicesLoading ? "..." : services.length}
              </strong>{" "}
              Consecrated {services.length === 1 ? "Ceremony" : "Ceremonies"}
            </div>
          </div>

          {/* Multiple Services Filter Toolbar (Only when > 1 service exists) */}
          {services.length > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#EAD8B8] bg-[#FAF6EE] p-4 shadow-2xs">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7966]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${category?.name || "Homa"} services...`}
                  className="w-full rounded-full border border-[#D6B8A0] bg-white py-2 pl-9 pr-8 text-[13px] text-[#29231B] placeholder-[#8A7966] focus:border-[#B7791F] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7966] hover:text-[#29231B]"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-[#766D60]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-[#D6B8A0] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#29231B] focus:border-[#B7791F] focus:outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          )}

          {/* ── CASE A: ZERO SERVICES ── */}
          {!servicesLoading && services.length === 0 && (
            <div className="mt-8 rounded-[24px] border border-[#EAD8B8] bg-[#FAF6EE] p-12 text-center">
              <p className="font-serif text-[20px] font-bold text-[#29231B]">
                No ceremonies currently scheduled in this category.
              </p>
              <p className="mt-2 text-[14px] text-[#685C4F]">
                We are curating authentic Shastric services for this tradition. Explore our complete catalogue in the meantime.
              </p>
              <Link
                to="/yagya-puja/homa"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-white"
              >
                <span>Browse All Homa &amp; Havan</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* ── CASE B: EXACTLY ONE SERVICE (HORIZONTAL SHOWCASE) ── */}
          {!servicesLoading && services.length === 1 && (
            <div className="mt-8">
              <HomaServiceCard
                service={primaryService}
                mode="horizontal"
                customImage={visuals.showcase}
              />
            </div>
          )}

          {/* ── CASE C: TWO OR MORE SERVICES (RESPONSIVE GRID) ── */}
          {!servicesLoading && services.length >= 2 && (
            <div
              className={`mt-8 grid gap-6 lg:gap-8 ${
                filteredServices.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredServices.map((svc) => (
                <HomaServiceCard
                  key={svc.id || svc.slug}
                  service={svc}
                  mode="grid"
                  customImage={!cardImgErrors[svc.slug] && svc.image ? svc.image : visuals.showcase}
                />
              ))}
            </div>
          )}
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
              Every ceremony is performed with certified Desi Cow Ghrita, botanical Samidha woods, and consecrated ingredients assembled fresh in the sacred Kshetra of Kashi.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Samagri Visual & Key Specifications */}
            <div className="lg:col-span-5 space-y-6">
              <div className="overflow-hidden rounded-[22px] border border-[#EAD8B8] bg-[#241A12] shadow-sm">
                <img
                  src={visuals.samagri}
                  alt={`${category?.name || "Homa"} Sacred Samagri and Woods`}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div className="p-4 bg-[#FFFDF9] border-t border-[#EAD8B8]">
                  <p className="text-[12px] font-semibold text-[#8A7966] uppercase tracking-wider">
                    Sacred Material Integrity
                  </p>
                  <p className="mt-1 text-[13px] text-[#29231B]">
                    Pure botanical Samidhas and certified Cow Ghrita prepared strictly under Shastric supervision.
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
                    Conducted by initiated Vedic scholars proficient in Samhita swaras and Agnihotra vidhi.
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
                    Sanctified Homa Bhasma, energized Raksha Sutra, and sacred Akshat delivered post-Purnahuti.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Verified Samagri Inclusions Table */}
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
                    const itemStatus =
                      typeof item === "string" ? "Included" : item.status || "Included";
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

                {/* Shastric Discipline Footer */}
                <div className="mt-6 rounded-xl border border-[#EAD8B8] bg-[#FAF6EE] p-4 text-[12px] text-[#766D60] leading-relaxed">
                  <strong className="text-[#29231B]">Shastric Discipline:</strong> All materials are sourced fresh in Kashi according to traditional botanical and Vedic calendars, ensuring uncompromising sanctity for Agni Ahutis.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 5: CATEGORY FAQs AND FINAL CONVERSION CTA
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="category-faqs"
        className="scroll-mt-12 bg-[#FFFDF9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* FAQ Section Header */}
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F]">
              COMMON INQUIRIES
            </p>
            <h2 className="mt-2 font-serif text-[28px] font-bold text-[#29231B] sm:text-[34px] lg:text-[38px]">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-3 max-w-[580px] text-[14.5px] leading-relaxed text-[#685C4F]">
              Essential guidance on rituals, Havan counts, remote participation, and Prasad dispatch.
            </p>
          </div>

          {/* 2-Column Responsive FAQ Accordion */}
          <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:items-start">
            {/* Left Column */}
            <div className="space-y-4">
              {config.faqs.slice(0, Math.ceil(config.faqs.length / 2)).map((faq, idx) => {
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

            {/* Right Column */}
            <div className="space-y-4">
              {config.faqs.slice(Math.ceil(config.faqs.length / 2)).map((faq, relIdx) => {
                const actualIdx = relIdx + Math.ceil(config.faqs.length / 2);
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
                <CategoryIcon size={13} className="text-[#E89B4F]" />
                <span>{config.finalCta.eyebrow}</span>
              </div>

              <h2 className="mt-5 font-serif text-[30px] font-bold text-[#FAF4E6] sm:text-[42px] leading-tight">
                {config.finalCta.heading}
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-[14.5px] font-light leading-relaxed text-[#D1C5B6] sm:text-[16.5px]">
                {config.finalCta.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={
                    primaryService
                      ? `/yagya-puja/homa/${primaryService.slug}/book`
                      : "/yagya-puja/homa"
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-8 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:brightness-110"
                >
                  <span>{config.finalCta.buttonText || "Book Ceremony"}</span>
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
                  <span>Service-Specific Havan Counts</span>
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

