import { useState, useMemo, useEffect } from "react";
import yagyaCatalogueService from "../../../services/yagyaCatalogueService";
import { YAGYA_CATALOGUE_LIST, YAGYA_PURPOSE_CATEGORIES } from "../data/yagyaCatalogueData";
import YagyaServiceListingHero from "../components/YagyaServiceListingHero";
import YagyaConceptSection from "../components/YagyaConceptSection";
import YagyaPurposeSection from "../components/YagyaPurposeSection";
import YagyaServiceCard from "../components/YagyaServiceCard";
import YagyaDurationSection from "../components/YagyaDurationSection";
import YagyaDailyTimelineSection from "../components/YagyaDailyTimelineSection";
import YagyaPanditTeamSection from "../components/YagyaPanditTeamSection";
import YagyaSamagriSection from "../components/YagyaSamagriSection";
import YagyaConfigurationPreview from "../components/YagyaConfigurationPreview";
import YagyaWorkflowSection from "../components/YagyaWorkflowSection";
import YagyaKashiSection from "../components/YagyaKashiSection";
import YagyaKashiMultiDayPlanning from "../components/YagyaKashiMultiDayPlanning";
import YagyaArrangementModes from "../components/YagyaArrangementModes";
import YagyaWhyVedaStructure from "../components/YagyaWhyVedaStructure";
import YagyaPopularSection from "../components/YagyaPopularSection";
import YagyaFaqSection from "../components/YagyaFaqSection";
import YagyaFinalCta from "../components/YagyaFinalCta";
import { Sparkles, Search, SlidersHorizontal, X } from "lucide-react";

const DURATION_FILTER_OPTIONS = [
  { label: "All Durations", value: "All" },
  { label: "3 Days", value: 3 },
  { label: "5 Days", value: 5 },
  { label: "7 Days", value: 7 },
  { label: "9 Days", value: 9 },
  { label: "11 Days", value: 11 },
];

const SORT_FILTER_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const YagyaCatalogueListing = () => {
  // Set SEO Title
  useEffect(() => {
    document.title = "Vedic Yagya Services in Kashi | Multi-Day Yagya | Veda Structure";
  }, []);

  const [backendServices, setBackendServices] = useState(null);
  const [backendPurposes, setBackendPurposes] = useState([]);

  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("featured");

  // Fetch active Yagya services and purposes from backend API on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchCatalogue() {
      try {
        const [servicesRes, purposesRes] = await Promise.allSettled([
          yagyaCatalogueService.getYagyaServices({ limit: 50 }),
          yagyaCatalogueService.getYagyaPurposes(),
        ]);

        if (!isMounted) return;

        if (servicesRes.status === "fulfilled" && servicesRes.value?.services?.length > 0) {
          setBackendServices(servicesRes.value.services);
        }

        if (purposesRes.status === "fulfilled" && Array.isArray(purposesRes.value) && purposesRes.value.length > 0) {
          setBackendPurposes(purposesRes.value);
        }
      } catch (err) {
        console.error("Yagya API loading fallback:", err);
      }
    }

    fetchCatalogue();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPurpose !== "All Purposes") count++;
    if (selectedDuration !== "All") count++;
    if (selectedMode !== "All") count++;
    if (isFeaturedOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedPurpose, selectedDuration, selectedMode, isFeaturedOnly, searchQuery]);

  const handleResetFilters = () => {
    setSelectedPurpose("All Purposes");
    setSelectedDuration("All");
    setSelectedMode("All");
    setIsFeaturedOnly(false);
    setSearchQuery("");
    setSelectedSort("featured");
  };

  const currentSourceList = backendServices && backendServices.length > 0 ? backendServices : YAGYA_CATALOGUE_LIST;

  const filteredYagyas = useMemo(() => {
    return currentSourceList.filter((yagya) => {
      // Must be active (treat true or undefined as active; only drop if explicitly false)
      if (yagya.isActive === false) return false;

      // Purpose filter (All Purposes / all / empty means NO filtering)
      if (selectedPurpose && selectedPurpose !== "All Purposes" && selectedPurpose !== "all") {
        const selNorm = selectedPurpose.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const catNorm = (yagya.purposeCategory || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const keyNorm = (yagya.purposeKey || yagya.purposeCategoryId || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const detailNameNorm = (yagya.purposeDetails?.name || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const detailSlugNorm = (yagya.purposeDetails?.slug || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
        const textNorm = (yagya.purpose || yagya.purposeSummary || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

        const matches =
          (catNorm && (catNorm === selNorm || catNorm.includes(selNorm) || selNorm.includes(catNorm))) ||
          (keyNorm && (keyNorm === selNorm || keyNorm.includes(selNorm) || selNorm.includes(keyNorm))) ||
          (detailNameNorm && (detailNameNorm === selNorm || detailNameNorm.includes(selNorm) || selNorm.includes(detailNameNorm))) ||
          (detailSlugNorm && (detailSlugNorm === selNorm || detailSlugNorm.includes(selNorm) || selNorm.includes(detailSlugNorm))) ||
          (textNorm && (textNorm.includes(selNorm) || selNorm.includes(textNorm)));

        if (!matches) {
          return false;
        }
      }

      // Duration filter (3, 5, 7, 9, 11) - "All" / "all" / "" means NO filtering
      if (selectedDuration && selectedDuration !== "All" && selectedDuration !== "all") {
        const daysNum = parseInt(selectedDuration, 10);
        if (!isNaN(daysNum)) {
          const serviceDurs = Array.isArray(yagya.availableDurations)
            ? yagya.availableDurations.map(Number)
            : [];
          if (!serviceDurs.includes(daysNum)) {
            return false;
          }
        }
      }

      // Mode filter (remote, individual, couple, family)
      if (selectedMode && selectedMode !== "All" && selectedMode !== "all") {
        const modeNorm = selectedMode.trim().toLowerCase();
        if (modeNorm === "remote") {
          if (!yagya.isRemoteAvailable && yagya.rawAvailableMode !== "remote" && yagya.rawAvailableMode !== "hybrid") {
            return false;
          }
        } else if (modeNorm === "family") {
          const matchFamily =
            yagya.purposeKey === "family-sankalpa" ||
            yagya.purposeCategoryId === "family-sankalpa" ||
            (yagya.purpose || yagya.purposeSummary || "").toLowerCase().includes("family") ||
            (yagya.description || yagya.shortDescription || "").toLowerCase().includes("family");
          if (!matchFamily) return false;
        } else if (modeNorm === "individual") {
          const matchInd =
            yagya.purposeKey === "spiritual-sankalpa" ||
            yagya.purposeCategoryId === "spiritual-sankalpa" ||
            (yagya.purpose || yagya.purposeSummary || "").toLowerCase().includes("vitality") ||
            (yagya.purpose || yagya.purposeSummary || "").toLowerCase().includes("courage") ||
            (yagya.purpose || yagya.purposeSummary || "").toLowerCase().includes("spiritual");
          if (!matchInd) return false;
        }
      }

      // Featured filter
      if (isFeaturedOnly && !yagya.isFeatured) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = (yagya.name || "").toLowerCase().includes(q);
        const matchDesc = (yagya.shortDescription || yagya.description || "").toLowerCase().includes(q);
        const matchPurpose = (yagya.purpose || yagya.purposeSummary || "").toLowerCase().includes(q);
        const matchDeity = (yagya.deity || "").toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchPurpose && !matchDeity) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = Number(a.startingPrice) || 0;
      const priceB = Number(b.startingPrice) || 0;
      if (selectedSort === "price-asc") {
        return priceA - priceB;
      }
      if (selectedSort === "price-desc") {
        return priceB - priceA;
      }
      if (selectedSort === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      // "featured" default
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [currentSourceList, selectedPurpose, selectedDuration, selectedMode, isFeaturedOnly, searchQuery, selectedSort]);

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* 1. HERO SECTION */}
      <YagyaServiceListingHero />

      {/* 2. WHAT IS A YAGYA? */}
      <YagyaConceptSection />

      {/* 3. WHY CHOOSE A MULTI-DAY YAGYA? (PURPOSE CARDS) */}
      <YagyaPurposeSection
        selectedPurpose={selectedPurpose}
        onSelectPurpose={(purposeTitle) => {
          setSelectedPurpose(purposeTitle);
        }}
      />

      {/* 4. EXPLORE VEDIC YAGYA (PRIMARY CATALOGUE DISCOVERY) */}
      <section id="yagya-catalogue" className="border-b border-[#ebdcc4] bg-[#fffaf0] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1400px]">
          {/* Section Header */}
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              PRIMARY CATALOGUE
            </p>
            <h2 className="mt-2.5 font-serif text-[30px] font-semibold text-[#2b241d] sm:text-[38px] lg:text-[42px]">
              Explore Vedic Yagya
            </h2>
            <p className="mx-auto mt-2.5 max-w-[640px] text-[15px] leading-relaxed text-[#685c4f]">
              Choose a Yagya according to your Sankalpa and ritual requirement.
            </p>
          </div>

          {/* Filters Row */}
          <div className="mt-10 mb-8 space-y-4">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-[420px]">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7c6b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by deity, mantra, or intention..."
                  className="h-[44px] w-full rounded-full border border-[#e5d8c0] bg-white pl-11 pr-4 text-[13.5px] text-[#2b241d] shadow-2xs outline-none transition placeholder:text-[#a89d91] hover:border-[#c77722]/50 focus:border-[#c77722] focus:ring-2 focus:ring-[#c77722]/10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#8a7c6b] hover:bg-[#f4e8d1]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Quick Purpose Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedPurpose("All Purposes")}
                  className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer whitespace-nowrap ${
                    selectedPurpose === "All Purposes"
                      ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                      : "border border-[#e5d8c0] bg-white text-[#5c4f42] hover:border-[#c77722]"
                  }`}
                >
                  All Purposes
                </button>
                {(backendPurposes.length > 0 ? backendPurposes : YAGYA_PURPOSE_CATEGORIES).slice(0, 3).map((cat) => {
                  const title = cat.title || cat.name;
                  return (
                    <button
                      key={cat.id || cat.slug}
                      type="button"
                      onClick={() => setSelectedPurpose(title)}
                      className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer whitespace-nowrap ${
                        selectedPurpose === title
                          ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                          : "border border-[#e5d8c0] bg-white text-[#5c4f42] hover:border-[#c77722]"
                      }`}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>

              {/* Sort Selector */}
              <div>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="h-[44px] rounded-full border border-[#e5d8c0] bg-white px-4 text-[13px] font-medium text-[#2b241d] outline-none transition focus:border-[#c77722]"
                >
                  {SORT_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration Selector Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f0e3ce]">
              <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#b36c1e]">
                <SlidersHorizontal size={13} />
                Duration:
              </span>
              {DURATION_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setSelectedDuration(opt.value)}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium transition cursor-pointer ${
                    selectedDuration === opt.value
                      ? "bg-[#2b241d] text-[#f7ecd5] shadow-xs"
                      : "border border-[#d6b8a0] bg-[#fffaf0] text-[#5c4f42] hover:border-[#c77722]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="ml-auto text-[12px] font-semibold text-[#c77722] hover:underline cursor-pointer"
                >
                  Clear all filters ({activeFilterCount})
                </button>
              )}
            </div>
          </div>

          {/* Counter */}
          <div className="mb-6 flex items-center justify-between text-[13.5px] text-[#75695c]">
            <span>
              Showing <strong className="text-[#2b241d]">{filteredYagyas.length}</strong> Multi-Day Vedic Yagya Ceremonies
            </span>
          </div>

          {/* Cards Grid */}
          {filteredYagyas.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7 items-stretch">
              {filteredYagyas.map((yagya) => (
                <YagyaServiceCard key={yagya.id || yagya.slug} service={yagya} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                <Sparkles size={24} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                No matching Yagyas found
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                We could not locate ceremonies matching your selected filters. Try broadening your criteria.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. CHOOSE YOUR YAGYA DURATION */}
      <YagyaDurationSection
        selectedDuration={selectedDuration}
        onSelectDuration={(dur) => setSelectedDuration(dur)}
      />

      {/* 6. WHAT HAPPENS DURING A MULTI-DAY YAGYA? */}
      <YagyaDailyTimelineSection />

      {/* 7. PANDIT TEAM */}
      <YagyaPanditTeamSection />

      {/* 8. SAMAGRI */}
      <YagyaSamagriSection />

      {/* 9. YOUR YAGYA — CONFIGURATION PREVIEW */}
      <YagyaConfigurationPreview />

      {/* 10. HOW YAGYA BOOKING WORKS */}
      <YagyaWorkflowSection />

      {/* 11. YAGYA IN KASHI */}
      <YagyaKashiSection
        onFilterRemote={() => {
          setSelectedMode("remote");
        }}
      />

      {/* 12. KASHI + MULTI-DAY PLANNING */}
      <YagyaKashiMultiDayPlanning />

      {/* 13. YAGYA FOR INDIVIDUALS & FAMILIES */}
      <YagyaArrangementModes
        onFilterMode={(modeId) => {
          setSelectedMode(modeId);
        }}
      />

      {/* 14. WHY VEDA STRUCTURE? */}
      <YagyaWhyVedaStructure />

      {/* 15. POPULAR YAGYAS */}
      <YagyaPopularSection />

      {/* 17. FAQ */}
      <YagyaFaqSection />

      {/* 18. FINAL CTA */}
      <YagyaFinalCta />
    </div>
  );
};

export default YagyaCatalogueListing;
