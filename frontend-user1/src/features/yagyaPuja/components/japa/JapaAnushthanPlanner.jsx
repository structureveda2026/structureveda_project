import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calculator,
  Sparkles,
  Clock,
  Users,
  Hash,
  ArrowRight,
  ShieldCheck,
  Check,
  BookOpen,
} from "lucide-react";
import plannerBannerImg from "../../../../assets/images/japa-planner-banner.jpg";
import { resolveJapaImage } from "../../../../services/japaCatalogueService";

const formatCount = (count) => {
  const num = Number(count);
  if (num >= 100000) return `${(num / 100000).toLocaleString("en-IN")} Lakh Japa`;
  if (num >= 1000) return `${(num / 1000).toLocaleString("en-IN")}K Japa`;
  return `${num.toLocaleString("en-IN")} Japa`;
};

const getCountTierDescription = (count) => {
  const num = Number(count);
  if (num >= 100000) return "Purascharana Vidhi";
  if (num >= 50000) return "Maha Anushthan";
  if (num >= 20000) return "Madhyama Anushthan";
  return "Laghu Anushthan";
};

/**
 * Section 03: Top Image + Full-Width Interactive Japa Anushthan Planner
 * 
 * Layout:
 * - TOP: Wide, panoramic devotional image banner (100% width across the container).
 * - BELOW IMAGE: Full-width spacious interactive planner (Introduction, 4-Step Indicator,
 *   3-col Service Grid, 4-col Count Selector, 4-col Summary Panel, and Booking CTA).
 * 
 * Preserves backend pricing engine, service-specific count availability, duration logic, and Purohit rules.
 */
const JapaAnushthanPlanner = ({ services = [], initialSearch = "", className = "" }) => {
  const [selectedSlug, setSelectedSlug] = useState(
    services[0]?.slug || "maha-mrityunjaya-japa"
  );

  // Synchronize when initialSearch changes or matches a service
  useEffect(() => {
    if (initialSearch && initialSearch.trim() !== "" && services.length > 0) {
      const q = initialSearch.toLowerCase().trim();
      const matched = services.find(
        (s) =>
          (s.name || "").toLowerCase().includes(q) ||
          (s.slug || "").toLowerCase().includes(q) ||
          (s.deity || "").toLowerCase().includes(q) ||
          (s.mantra || "").toLowerCase().includes(q)
      );
      if (matched && matched.slug) {
        setSelectedSlug(matched.slug);
        if (Array.isArray(matched.availableCounts) && matched.availableCounts.length > 0) {
          setSelectedCount(matched.availableCounts[0]);
        }
      }
    }
  }, [initialSearch, services]);

  const currentService = useMemo(() => {
    return (
      services.find((s) => s.slug === selectedSlug) ||
      services[0] ||
      null
    );
  }, [services, selectedSlug]);

  const availableCounts = useMemo(() => {
    if (!currentService || !Array.isArray(currentService.availableCounts) || currentService.availableCounts.length === 0) {
      return [11000, 21000, 51000];
    }
    return currentService.availableCounts;
  }, [currentService]);

  const [selectedCount, setSelectedCount] = useState(availableCounts[0] || 11000);

  // Validate that selected count is strictly supported by current service; fallback if not
  const activeCount = useMemo(() => {
    if (availableCounts.includes(Number(selectedCount))) {
      return Number(selectedCount);
    }
    return availableCounts[0] || 11000;
  }, [availableCounts, selectedCount]);

  // Match authoritative variant from service dataset
  const matchedVariant = useMemo(() => {
    if (!currentService || !Array.isArray(currentService.variants)) return null;
    return (
      currentService.variants.find((v) => Number(v.count) === activeCount) ||
      currentService.variants[0] ||
      null
    );
  }, [currentService, activeCount]);

  if (!currentService) return null;

  // Authoritative metrics directly from service/variant records
  const displayPrice = matchedVariant?.startingPrice || currentService.startingPrice || 18000;
  const estimatedDuration = matchedVariant?.estimatedDuration || currentService.completionWindow || "3-4 Days";
  const recommendedPandits = matchedVariant?.recommendedPandits || currentService.recommendedPandits || 3;
  const minimumPandits = matchedVariant?.minimumPandits || currentService.minimumPandits || 2;
  const dailyHours = currentService.dailyHours || "4 Hours Daily";
  const dailyCapacity = currentService.dailyCapacityPerPandit || 2000;

  const isBookingDisabled = !selectedSlug || !activeCount || !matchedVariant;

  return (
    <section
      id="anushthan-planner"
      className={`relative border-b border-[#ead8bc] bg-[#fdfaf5] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${className}`}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Unified Container: Top Image Banner + Full-Width Planner Below */}
        <div className="overflow-hidden rounded-[32px] border border-[#ead8bc] bg-[#fffdfa] shadow-[0_20px_50px_rgba(48,37,28,0.06)]">
          
          {/* ══════════════════════════════════════════════════════════════
              1. TOP: FULL-WIDTH PANORAMIC IMAGE BANNER (100% Width)
             ══════════════════════════════════════════════════════════════ */}
          <div className="relative w-full aspect-[16/6] min-h-[220px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] max-h-[420px] overflow-hidden bg-[#181009]">
            {/* Panoramic Devotional Image */}
            <img
              src={plannerBannerImg}
              alt="Sacred Vedic Japa Anushthan Sanctum"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.02]"
              onError={(e) => {
                e.currentTarget.src = "/images/japa/japa-planner-banner.jpg";
              }}
            />

            {/* Subtle Gradient Overlay for Depth and Contrast */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#140c06]/85 via-[#140c06]/25 to-transparent"
            />

            {/* Top Badge over Banner */}
            <div className="absolute top-4 left-5 sm:top-6 sm:left-8 z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#f5ce6f]/40 bg-[#1b1208]/85 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-xs">
                <Sparkles size={11} className="text-[#f5ce6f]" />
                <span>Vedic Anushthan Vidhi • Sacred Chanting Tradition</span>
              </div>
            </div>

            {/* Bottom Bar over Banner */}
            <div className="absolute bottom-4 left-5 sm:bottom-6 sm:left-8 right-5 sm:right-8 z-10 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2">
                <BookOpen size={17} className="text-[#f5ce6f]" />
                <span className="font-serif text-[16px] sm:text-[19px] font-bold tracking-wide text-[#fffdfa] drop-shadow-sm">
                  Authentic Mantra Japa &amp; Purascharana
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[12px] font-medium text-[#fce8c8] drop-shadow-sm">
                <span className="flex items-center gap-1"><Check size={13} className="text-[#f5ce6f]" /> Scriptural Method</span>
                <span className="flex items-center gap-1"><Check size={13} className="text-[#f5ce6f]" /> Qualified Purohits</span>
                <span className="flex items-center gap-1"><Check size={13} className="text-[#f5ce6f]" /> Kashi Kshetra</span>
                <span className="flex items-center gap-1"><Check size={13} className="text-[#f5ce6f]" /> Remote Sankalpa</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              2. BELOW IMAGE: FULL-WIDTH INTERACTIVE PLANNER
             ══════════════════════════════════════════════════════════════ */}
          <div className="p-6 sm:p-10 lg:p-14 bg-[#fffcf7]">
            
            {/* ── Planner Introduction (Centered) ── */}
            <div className="text-center max-w-[820px] mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b77920]/30 bg-[#fbf5eb] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
                <Calculator size={12} className="text-[#b77920]" />
                <span>INTERACTIVE ANUSHTHAN PLANNER</span>
              </div>

              <h2 className="mt-3 font-serif text-[28px] sm:text-[34px] lg:text-[38px] font-bold tracking-tight text-[#30251c]">
                Calculate Your Sacred Japa Plan
              </h2>

              <p className="mt-2.5 text-[15px] sm:text-[16px] leading-relaxed text-[#6b5845]">
                Choose your Mantra Japa and prescribed recitation count. Review the applicable duration, Purohit requirements and authoritative Dakshina before continuing.
              </p>
            </div>

            {/* ── Step Progress Indicator (Horizontal 4-Step Track) ── */}
            <div className="mt-8 max-w-[900px] mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-2 rounded-2xl bg-[#f8f1e6]/70 border border-[#ead8bc]/80">
                {/* Step 1 */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#b77920]/40 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b77920] text-white text-[11px] font-bold">
                    ✓
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-[#b77920] tracking-wider">Step 1</span>
                    <span className="block text-[12px] font-bold text-[#30251c] truncate">Select Mantra</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#b77920]/40 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b77920] text-white text-[11px] font-bold">
                    2
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-[#b77920] tracking-wider">Step 2</span>
                    <span className="block text-[12px] font-bold text-[#30251c] truncate">Select Count</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#ead8bc] shadow-2xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ead8bc] text-[#735e4b] text-[11px] font-bold">
                    3
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-[#8a725b] tracking-wider">Step 3</span>
                    <span className="block text-[12px] font-bold text-[#5c4a39] truncate">Review Plan</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-[#ead8bc] shadow-2xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ead8bc] text-[#735e4b] text-[11px] font-bold">
                    4
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase font-bold text-[#8a725b] tracking-wider">Step 4</span>
                    <span className="block text-[12px] font-bold text-[#5c4a39] truncate">Continue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── STEP 1: CHOOSE MANTRA JAPA CEREMONY (Full Width, 3 Columns on Desktop) ── */}
            <div className="mt-10 pt-8 border-t border-[#f0e3ce]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <label className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#30251c]">
                  Step 1: Choose Mantra Japa Ceremony
                </label>
                <span className="text-[12px] font-medium text-[#8a725b] bg-[#fbf5eb] px-3 py-1 rounded-full border border-[#ead8bc]">
                  {services.length} Consecrated Ceremonies Available
                </span>
              </div>

              {/* Spacious 3-Column Grid on Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {services.map((svc) => {
                  const isSelected = svc.slug === selectedSlug;
                  const svcImg = resolveJapaImage(svc);
                  return (
                    <button
                      key={svc.slug || svc.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlug(svc.slug);
                        if (Array.isArray(svc.availableCounts) && svc.availableCounts.length > 0) {
                          setSelectedCount(svc.availableCounts[0]);
                        }
                      }}
                      className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all cursor-pointer min-h-[76px] ${
                        isSelected
                          ? "border-[#b77920] bg-[#fbf5eb] ring-2 ring-[#b77920]/80 shadow-sm"
                          : "border-[#ead8bc] bg-white hover:border-[#b77920]/60 hover:bg-[#faf6f0] shadow-2xs"
                      }`}
                    >
                      {/* Ceremony Thumbnail */}
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f5ecd9] border border-[#ead8bc]">
                        <img
                          src={svcImg}
                          alt={svc.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/japa/p-mala.jpg";
                          }}
                        />
                      </div>

                      {/* Full Readable Service Name and Tradition */}
                      <div className="min-w-0 flex-1">
                        <span className="block text-[14px] sm:text-[14.5px] font-bold text-[#30251c] leading-snug">
                          {svc.name}
                        </span>
                        <span className="block text-[12px] text-[#8a725b] mt-0.5">
                          {svc.deity || svc.category?.name || "Vedic Tradition"}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b77920] text-white">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── STEP 2: SELECT RECITATION COUNT (Full Width, 4 Columns on Desktop) ── */}
            <div className="mt-10 pt-8 border-t border-[#f0e3ce]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <label className="text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#30251c]">
                  Step 2: Select Recitation Count
                </label>
                <span className="text-[12px] font-medium text-[#8a725b]">
                  Prescribed Shastric options for <strong className="text-[#30251c]">{currentService.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availableCounts.map((cnt) => {
                  const isCountActive = cnt === activeCount;
                  return (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setSelectedCount(cnt)}
                      className={`flex items-center justify-between rounded-2xl border p-4 transition-all cursor-pointer ${
                        isCountActive
                          ? "border-[#b77920] bg-[#fbf5eb] ring-2 ring-[#b77920]/80 shadow-sm"
                          : "border-[#ead8bc] bg-white hover:border-[#b77920]/60 hover:bg-[#faf6f0] shadow-2xs"
                      }`}
                    >
                      <div className="text-left">
                        <span className="block text-[14.5px] font-bold text-[#30251c]">
                          {formatCount(cnt)}
                        </span>
                        <span className="block text-[11.5px] text-[#8a725b] mt-0.5">
                          {getCountTierDescription(cnt)}
                        </span>
                      </div>
                      {isCountActive && (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b77920] text-white">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── STEP 3: YOUR JAPA PLAN SUMMARY (Full Width, 4 Even Columns) ── */}
            <div className="mt-10 pt-8 border-t border-[#f0e3ce]">
              <label className="block text-[13px] sm:text-[14px] font-bold uppercase tracking-wider text-[#30251c] mb-4">
                Step 3: Authoritative Breakdown & Inclusions
              </label>

              {/* 4 Balanced Information Columns with Subtle Dividers */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x divide-[#ead8bc] rounded-2xl border border-[#ead8bc] bg-[#faf6f0] p-5 sm:p-7 shadow-xs">
                {/* Metric 1: Duration */}
                <div className="p-3 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                    <Clock size={14} className="text-[#b77920]" />
                    <span>Duration</span>
                  </div>
                  <div className="mt-2 font-serif text-[20px] sm:text-[22px] font-bold text-[#30251c]">
                    {estimatedDuration}
                  </div>
                  <span className="block text-[11.5px] text-[#8a725b] mt-0.5">{dailyHours}</span>
                </div>

                {/* Metric 2: Purohit Squad */}
                <div className="p-3 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                    <Users size={14} className="text-[#b77920]" />
                    <span>Purohit Squad</span>
                  </div>
                  <div className="mt-2 font-serif text-[20px] sm:text-[22px] font-bold text-[#30251c]">
                    {recommendedPandits} Vedic Priests
                  </div>
                  <span className="block text-[11.5px] text-[#8a725b] mt-0.5">Min. {minimumPandits} Scholars</span>
                </div>

                {/* Metric 3: Recitation Count */}
                <div className="p-3 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                    <Hash size={14} className="text-[#b77920]" />
                    <span>Recitations</span>
                  </div>
                  <div className="mt-2 font-serif text-[20px] sm:text-[22px] font-bold text-[#30251c]">
                    {activeCount.toLocaleString("en-IN")}
                  </div>
                  <span className="block text-[11.5px] text-[#8a725b] mt-0.5">Consecrated Tally</span>
                </div>

                {/* Metric 4: Authoritative Dakshina */}
                <div className="p-3 text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                    <Sparkles size={14} className="text-[#b77920]" />
                    <span>Dakshina</span>
                  </div>
                  <div className="mt-2 font-serif text-[20px] sm:text-[22px] font-bold text-[#30251c]">
                    ₹{Number(displayPrice).toLocaleString("en-IN")}
                  </div>
                  <span className="block text-[11.5px] text-[#8a725b] mt-0.5">Authoritative Base</span>
                </div>
              </div>
            </div>

            {/* ── FOOTER ACTION: BOOKING CTA ── */}
            <div className="mt-10 pt-8 border-t border-[#f0e3ce] flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-2.5 text-[13px] text-[#6b5845]">
                <ShieldCheck size={18} className="text-[#b77920] shrink-0" />
                <span>
                  Strict daily tally metrics: {dailyCapacity} Japa per Purohit daily under senior Acharya supervision.
                </span>
              </div>

              {isBookingDisabled ? (
                <button
                  type="button"
                  disabled
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#ead8bc] px-9 py-4 text-[14.5px] font-bold text-[#8a725b] cursor-not-allowed"
                >
                  <span>Book This Japa →</span>
                  <ArrowRight size={15} />
                </button>
              ) : (
                <Link
                  to={`/yagya-puja/japa/${selectedSlug}/book?count=${activeCount}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#b77920] px-9 py-4 text-[14.5px] font-bold text-white shadow-md transition-all hover:bg-[#8f5211] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b77920] active:scale-[0.99] cursor-pointer"
                >
                  <span>Book This Japa →</span>
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default JapaAnushthanPlanner;
