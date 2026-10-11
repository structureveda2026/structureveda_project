import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import yagyaCatalogueService from "../../../services/yagyaCatalogueService";
import YagyaServiceListingHero from "../components/YagyaServiceListingHero";
import YagyaConceptSection from "../components/YagyaConceptSection";
import YagyaPurposeSection from "../components/YagyaPurposeSection";
import YagyaCategoryDiscovery from "../components/YagyaCategoryDiscovery";
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
import {
  Search,
  SlidersHorizontal,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FolderX,
} from "lucide-react";

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

const PAGE_SIZE = 6;

const YagyaCatalogueListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams();

  // Set SEO Title
  useEffect(() => {
    document.title = "Vedic Yagya Services in Kashi | Multi-Day Yagya | Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter & Pagination state synchronized with URL search params
  const currentCategory = categorySlug || searchParams.get("category") || "All";
  const currentPurpose = searchParams.get("purpose") || "All Purposes";
  const currentDuration = searchParams.get("duration") || "All";
  const currentMode = searchParams.get("mode") || "All";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sortBy") || "featured";
  const currentPage = parseInt(searchParams.get("page"), 10) || 1;

  // Local Search Input state for responsive typing
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Data states
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Auxiliary data: Categories
  const [categories, setCategories] = useState([]);

  // Load Categories for filter pills
  useEffect(() => {
    let isMounted = true;
    yagyaCatalogueService
      .getYagyaCategories()
      .then((catData) => {
        if (isMounted && Array.isArray(catData)) {
          setCategories(catData);
        }
      })
      .catch((err) => {
        console.error("Failed to load category filter pills:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to update query params
  const updateParams = useCallback(
    (newParams) => {
      setLoading(true);
      const merged = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([k, v]) => {
        if (
          v === null ||
          v === undefined ||
          v === "" ||
          v === "All" ||
          v === "All Purposes" ||
          (k === "page" && v === 1) ||
          (k === "sortBy" && v === "featured")
        ) {
          merged.delete(k);
        } else {
          merged.set(k, String(v));
        }
      });
      setSearchParams(merged, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Fetch Services from API based on active query params
  useEffect(() => {
    let isMounted = true;

    const filterObj = {
      page: currentPage,
      limit: PAGE_SIZE,
      sortBy: currentSort,
    };

    if (currentSearch.trim()) filterObj.search = currentSearch.trim();
    if (currentCategory && currentCategory !== "All" && currentCategory !== "All Categories") {
      filterObj.category = currentCategory;
    }
    if (currentPurpose && currentPurpose !== "All Purposes") {
      filterObj.purpose = currentPurpose;
    }
    if (currentDuration && currentDuration !== "All") {
      filterObj.duration = currentDuration;
    }
    if (currentMode && currentMode !== "All") {
      filterObj.mode = currentMode;
    }

    yagyaCatalogueService
      .getYagyaServices(filterObj)
      .then((res) => {
        if (!isMounted) return;
        setServices(res.services || []);
        setTotalServices(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Yagya API catalogue fetch error:", err);
        setError(
          "Unable to load Vedic Yagya ceremonies. Please check your connection and try again."
        );
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    currentPage,
    currentSearch,
    currentCategory,
    currentPurpose,
    currentDuration,
    currentMode,
    currentSort,
    retryTrigger,
  ]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentCategory !== "All" && currentCategory !== "All Categories") count++;
    if (currentPurpose !== "All Purposes") count++;
    if (currentDuration !== "All") count++;
    if (currentMode !== "All") count++;
    if (currentSearch.trim() !== "") count++;
    return count;
  }, [currentCategory, currentPurpose, currentDuration, currentMode, currentSearch]);

  const handleResetFilters = () => {
    setLoading(true);
    setSearchInput("");
    const cleared = new URLSearchParams();
    setSearchParams(cleared, { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    updateParams({ page: newPage });
    const el = document.getElementById("yagya-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* 1. HERO SECTION */}
      <YagyaServiceListingHero />

      {/* 2. WHAT IS A YAGYA? */}
      <YagyaConceptSection />

      {/* 3. WHY CHOOSE A MULTI-DAY YAGYA? (PURPOSE CARDS) */}
      <YagyaPurposeSection
        selectedPurpose={currentPurpose}
        onSelectPurpose={(purposeTitle) => {
          updateParams({ purpose: purposeTitle, page: 1 });
          const el = document.getElementById("yagya-catalogue");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 4. DYNAMIC CATEGORY DISCOVERY SECTION */}
      <YagyaCategoryDiscovery limit={6} showViewAll={true} />

      {/* 5. EXPLORE VEDIC YAGYA (API-FIRST PRIMARY CATALOGUE WITH SERVER PAGINATION) */}
      <section
        id="yagya-catalogue"
        className="border-b border-[#ebdcc4] bg-[#fffaf0] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 xl:px-10"
      >
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
              Choose a multi-day Yagya according to your Sankalpa and ritual requirement.
            </p>
          </div>

          {/* Filters Row */}
          <div className="mt-10 mb-8 space-y-4">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-[420px]">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7c6b]"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onBlur={() => {
                    if (searchInput !== currentSearch) {
                      updateParams({ search: searchInput.trim(), page: 1 });
                    }
                  }}
                  placeholder="Search by deity, mantra, or intention..."
                  className="h-[44px] w-full rounded-full border border-[#e5d8c0] bg-white pl-11 pr-10 text-[13.5px] text-[#2b241d] shadow-2xs outline-none transition placeholder:text-[#a89d91] hover:border-[#c77722]/50 focus:border-[#c77722] focus:ring-2 focus:ring-[#c77722]/10"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({ search: "", page: 1 });
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#8a7c6b] hover:bg-[#f4e8d1]"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Category Filter Pills (Dynamic from API) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => updateParams({ category: "All", page: 1 })}
                  className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer whitespace-nowrap ${
                    currentCategory === "All" || currentCategory === "All Categories"
                      ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                      : "border border-[#e5d8c0] bg-white text-[#5c4f42] hover:border-[#c77722]"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => {
                  const isSelected = currentCategory === cat.slug;
                  return (
                    <button
                      key={cat.id || cat.slug}
                      type="button"
                      onClick={() => updateParams({ category: cat.slug, page: 1 })}
                      className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                          : "border border-[#e5d8c0] bg-white text-[#5c4f42] hover:border-[#c77722]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Sort Selector */}
              <div>
                <select
                  value={currentSort}
                  onChange={(e) => updateParams({ sortBy: e.target.value, page: 1 })}
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
                  onClick={() => updateParams({ duration: opt.value, page: 1 })}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium transition cursor-pointer ${
                    String(currentDuration) === String(opt.value)
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

          {/* Results Counter & Pagination Info */}
          <div className="mb-6 flex flex-col gap-2 text-[13.5px] text-[#75695c] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              <strong className="text-[#2b241d]">
                {loading
                  ? "..."
                  : totalServices > 0
                  ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                      currentPage * PAGE_SIZE,
                      totalServices
                    )}`
                  : "0"}
              </strong>{" "}
              of <strong className="text-[#2b241d]">{totalServices}</strong> Multi-Day Vedic Yagya Ceremonies
              {currentCategory !== "All" && currentCategory !== "All Categories" && (
                <span className="ml-2 font-medium text-[#b36c1e]">
                  in {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                </span>
              )}
            </span>

            {totalPages > 1 && (
              <span className="text-[12.5px] font-medium text-[#8a7c6b]">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {/* Catalogue Body States */}
          {loading ? (
            /* Loading Skeleton */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex flex-col overflow-hidden rounded-[24px] border border-[#e6caa0]/60 bg-[#fffdfa] animate-pulse"
                >
                  <div className="h-[230px] w-full bg-[#ebdcc4]/60" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 w-1/3 rounded bg-[#ebdcc4]/60" />
                    <div className="h-6 w-3/4 rounded bg-[#ebdcc4]/80" />
                    <div className="h-4 w-full rounded bg-[#ebdcc4]/40" />
                    <div className="h-4 w-4/5 rounded bg-[#ebdcc4]/40" />
                    <div className="pt-4 border-t border-[#f0e2cd] flex justify-between items-center">
                      <div className="h-6 w-20 rounded bg-[#ebdcc4]/60" />
                      <div className="h-9 w-28 rounded-full bg-[#ebdcc4]/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fceddd] text-[#c77722]">
                <FolderX size={26} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                Unable to Load Yagya Catalogue
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                {error}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setRetryTrigger((r) => r + 1);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-xs hover:bg-[#dda018] cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-full border border-[#ebdcc4] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4f42] hover:border-[#c77722] cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : services.length > 0 ? (
            /* Services Grid */
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7 items-stretch">
                {services.map((yagya) => (
                  <YagyaServiceCard key={yagya.id || yagya.slug} service={yagya} />
                ))}
              </div>

              {/* Server-Side Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#ebdcc4] pt-8 sm:flex-row">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e5d8c0] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4f42] shadow-2xs transition hover:border-[#c77722] disabled:opacity-40 disabled:hover:border-[#e5d8c0] cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        onClick={() => handlePageChange(pg)}
                        className={`h-9 w-9 rounded-full text-[13px] font-bold transition cursor-pointer ${
                          pg === currentPage
                            ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                            : "border border-[#e5d8c0] bg-white text-[#5c4f42] hover:border-[#c77722]"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#e5d8c0] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#5c4f42] shadow-2xs transition hover:border-[#c77722] disabled:opacity-40 disabled:hover:border-[#e5d8c0] cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fbf5e8] text-[#c77722]">
                <FolderX size={26} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                No Yagya Ceremonies Found
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                We could not find any Vedic Yagya matching your selected filters. Try broadening your criteria or reset filters to browse the complete catalogue.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-xs hover:bg-[#dda018] cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. DURATION DETAILS */}
      <YagyaDurationSection />

      {/* 7. DAILY TIMELINE */}
      <YagyaDailyTimelineSection />

      {/* 8. PANDIT TEAM */}
      <YagyaPanditTeamSection />

      {/* 9. SAMAGRI */}
      <YagyaSamagriSection />

      {/* 10. CONFIGURATION PREVIEW */}
      <YagyaConfigurationPreview />

      {/* 11. WORKFLOW */}
      <YagyaWorkflowSection />

      {/* 12. KASHI SECTION */}
      <YagyaKashiSection />

      {/* 13. KASHI MULTI-DAY PLANNING */}
      <YagyaKashiMultiDayPlanning />

      {/* 14. ARRANGEMENT MODES */}
      <YagyaArrangementModes />

      {/* 15. WHY VEDA STRUCTURE */}
      <YagyaWhyVedaStructure />

      {/* 16. POPULAR YAGYA (MAX 6 PREVIEW CARDS) */}
      <YagyaPopularSection />

      {/* 17. FAQ */}
      <YagyaFaqSection />

      {/* 18. FINAL CTA */}
      <YagyaFinalCta />
    </div>
  );
};

export default YagyaCatalogueListing;
