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
import plannerImg from "../../../../assets/images/japa-anushthan-planner.jpg";
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
 * Section 03: Final Split Vedic Japa Anushthan Planner (Option 2 - Split Vedic Experience)
 * 
 * Composition:
 * - LEFT (approx 40%): Authentic Vedic Devotional Photography with restrained dark overlay & core capability highlights.
 * - RIGHT (approx 60%): Spacious, accessible interactive ceremony planner with 3-col ceremony selector,
 *   service-specific count options, 4-col subtle plan breakdown, and authoritative booking CTA.
 * 
 * Preserves backend pricing engine, available count restrictions, duration calculation, and Purohit squad rules.
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

  return (
    <section
      id="anushthan-planner"
      className={`relative border-b border-[#ead8bc] bg-[#fdfaf5] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 ${className}`}
    >
      <div className="mx-auto max-w-[1340px]">
        {/* Unified 2-Column Split Container (~40% Left Image, ~60% Right Planner) */}
        <div className="overflow-hidden rounded-[32px] border border-[#ead8bc] bg-[#fffdfa] shadow-[0_20px_50px_rgba(48,37,28,0.06)] grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
          
          {/* ══════════════════════════════════════════════════════════════
              LEFT PANEL: VEDIC DEVOTIONAL IMAGE (Approx 40% Desktop)
             ══════════════════════════════════════════════════════════════ */}
          <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-full lg:col-span-5 flex flex-col justify-between overflow-hidden bg-[#181009] p-7 sm:p-9 lg:p-10">
            {/* Authentic Japa Sanctum Devotional Photography */}
            <img
              src={plannerImg}
              alt="Sacred Vedic Mantra Japa Anushthan Altar"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "/images/japa/japa-anushthan-planner.jpg";
              }}
            />

            {/* Controlled Depth Vignette Overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#140c06]/95 via-[#140c06]/45 to-transparent"
            />

            {/* Subtle Ambient Radial Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-12 top-1/3 h-56 w-56 rounded-full bg-[#eab12c]/15 blur-[65px]"
            />

            {/* Top Sanctum Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#f5ce6f]/40 bg-[#1b1208]/85 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-xs">
                <Sparkles size={11} className="text-[#f5ce6f]" />
                <span>Vedic Anushthan Vidhi</span>
              </div>
              <span className="rounded-full border border-[#f5ce6f]/25 bg-[#1b1208]/80 px-2.5 py-0.5 text-[10.5px] font-medium text-[#d9c9b5] backdrop-blur-md">
                108-Bead Rosary
              </span>
            </div>

            {/* Compact Dark Translucent Bottom Information Panel */}
            <div className="relative z-10 mt-auto pt-16">
              <div className="rounded-2xl border border-[#f5ce6f]/25 bg-[#170e06]/85 p-5 sm:p-6 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-2 text-[#f5ce6f]">
                  <BookOpen size={15} />
                  <span className="text-[11.5px] font-bold uppercase tracking-widest text-[#f5ce6f]">
                    Sacred Chanting Discipline
                  </span>
                </div>

                <h3 className="mt-2 font-serif text-[20px] sm:text-[22px] font-bold leading-snug text-[#fffdfa]">
                  Authentic Mantra Japa
                </h3>

                <p className="mt-2 text-[13px] leading-relaxed text-[#ede1d1]">
                  Disciplined recitation performed by qualified Vedic Purohits with proper Sankalpa, prescribed counts and traditional procedures.
                </p>

                {/* Capability Highlights */}
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-[#fce8c8]">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#2d1f11]/90 px-2.5 py-1 border border-[#f5ce6f]/20">
                    <Check size={11} className="text-[#f5ce6f]" /> Scriptural Method
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#2d1f11]/90 px-2.5 py-1 border border-[#f5ce6f]/20">
                    <Check size={11} className="text-[#f5ce6f]" /> Qualified Purohits
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#2d1f11]/90 px-2.5 py-1 border border-[#f5ce6f]/20">
                    <Check size={11} className="text-[#f5ce6f]" /> Kashi Kshetra
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#2d1f11]/90 px-2.5 py-1 border border-[#f5ce6f]/20">
                    <Check size={11} className="text-[#f5ce6f]" /> Remote Sankalpa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT PANEL: INTERACTIVE JAPA PLANNER (Approx 60% Desktop)
             ══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 lg:col-span-7 bg-[#fffcf7]">
            <div>
              {/* Planner Heading */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b77920]/30 bg-[#fbf5eb] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
                <Calculator size={12} className="text-[#b77920]" />
                <span>INTERACTIVE ANUSHTHAN PLANNER</span>
              </div>

              <h2 className="mt-3 font-serif text-[28px] sm:text-[34px] lg:text-[36px] font-bold tracking-tight text-[#30251c]">
                Calculate Your Sacred Japa Plan
              </h2>

              <p className="mt-2 text-[14.5px] leading-relaxed text-[#6b5845]">
                Choose your Mantra Japa and prescribed recitation count. Review the applicable duration, Purohit requirements and authoritative Dakshina before continuing.
              </p>

              {/* ── STEP 1: CHOOSE MANTRA JAPA CEREMONY ── */}
              <div className="mt-8 pt-6 border-t border-[#f0e3ce]">
                <div className="flex items-center justify-between">
                  <label className="text-[12.5px] font-bold uppercase tracking-wider text-[#30251c]">
                    Step 1: Choose Mantra Japa Ceremony
                  </label>
                  <span className="text-[11.5px] font-medium text-[#8a725b]">
                    {services.length} Consecrated Ceremonies
                  </span>
                </div>

                {/* 3-Column Responsive Grid on Desktop */}
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[260px] overflow-y-auto pr-1.5">
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
                        className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#b77920] bg-[#fbf5eb] ring-2 ring-[#b77920]/80 shadow-xs"
                            : "border-[#ead8bc] bg-white hover:border-[#b77920]/60 hover:bg-[#faf6f0]"
                        }`}
                      >
                        {/* Ceremony Thumbnail */}
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#f5ecd9] border border-[#ead8bc]">
                          <img
                            src={svcImg}
                            alt={svc.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/japa/p-mala.jpg";
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold text-[#30251c] truncate">
                            {svc.name}
                          </span>
                          <span className="block text-[11px] text-[#8a725b] truncate">
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

              {/* ── STEP 2: SELECT ANUSHTHAN COUNT ── */}
              <div className="mt-8 pt-6 border-t border-[#f0e3ce]">
                <div className="flex items-center justify-between">
                  <label className="text-[12.5px] font-bold uppercase tracking-wider text-[#30251c]">
                    Step 2: Select Recitation Count
                  </label>
                  <span className="text-[11.5px] font-medium text-[#8a725b]">
                    Prescribed for {currentService.name}
                  </span>
                </div>

                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {availableCounts.map((cnt) => {
                    const isCountActive = cnt === activeCount;
                    return (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setSelectedCount(cnt)}
                        className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all cursor-pointer ${
                          isCountActive
                            ? "border-[#b77920] bg-[#fbf5eb] ring-2 ring-[#b77920]/80 shadow-xs"
                            : "border-[#ead8bc] bg-white hover:border-[#b77920]/60 hover:bg-[#faf6f0]"
                        }`}
                      >
                        <div className="text-left">
                          <span className="block text-[13.5px] font-bold text-[#30251c]">
                            {formatCount(cnt)}
                          </span>
                          <span className="block text-[10.5px] text-[#8a725b]">
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

              {/* ── STEP 3: YOUR JAPA PLAN SUMMARY ── */}
              <div className="mt-8 pt-6 border-t border-[#f0e3ce]">
                <label className="text-[12.5px] font-bold uppercase tracking-wider text-[#30251c]">
                  Step 3: Authoritative Breakdown & Inclusions
                </label>

                {/* 4 Balanced Information Columns with Subtle Dividers */}
                <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#ead8bc] rounded-2xl border border-[#ead8bc] bg-[#faf6f0] p-4 sm:p-5">
                  {/* Metric 1: Duration */}
                  <div className="p-3 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                      <Clock size={13} className="text-[#b77920]" />
                      <span>Duration</span>
                    </div>
                    <div className="mt-1.5 font-serif text-[18px] font-bold text-[#30251c]">
                      {estimatedDuration}
                    </div>
                    <span className="block text-[11px] text-[#8a725b] mt-0.5">{dailyHours}</span>
                  </div>

                  {/* Metric 2: Purohit Squad */}
                  <div className="p-3 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                      <Users size={13} className="text-[#b77920]" />
                      <span>Purohit Squad</span>
                    </div>
                    <div className="mt-1.5 font-serif text-[18px] font-bold text-[#30251c]">
                      {recommendedPandits} Vedic Priests
                    </div>
                    <span className="block text-[11px] text-[#8a725b] mt-0.5">Min. {minimumPandits} Scholars</span>
                  </div>

                  {/* Metric 3: Recitation Count */}
                  <div className="p-3 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                      <Hash size={13} className="text-[#b77920]" />
                      <span>Recitations</span>
                    </div>
                    <div className="mt-1.5 font-serif text-[18px] font-bold text-[#30251c]">
                      {activeCount.toLocaleString("en-IN")}
                    </div>
                    <span className="block text-[11px] text-[#8a725b] mt-0.5">Consecrated Tally</span>
                  </div>

                  {/* Metric 4: Authoritative Dakshina */}
                  <div className="p-3 text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-[#8a561c]">
                      <Sparkles size={13} className="text-[#b77920]" />
                      <span>Dakshina</span>
                    </div>
                    <div className="mt-1.5 font-serif text-[18px] font-bold text-[#30251c]">
                      ₹{Number(displayPrice).toLocaleString("en-IN")}
                    </div>
                    <span className="block text-[11px] text-[#8a725b] mt-0.5">Authoritative Base</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── FOOTER ACTION: BOOKING CTA ── */}
            <div className="mt-8 pt-6 border-t border-[#f0e3ce] flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-2 text-[12.5px] text-[#6b5845]">
                <ShieldCheck size={17} className="text-[#b77920] shrink-0" />
                <span>
                  Strict daily tally metrics: {dailyCapacity} Japa per Purohit daily under senior Acharya supervision.
                </span>
              </div>

              {!selectedSlug || !activeCount || !matchedVariant ? (
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
