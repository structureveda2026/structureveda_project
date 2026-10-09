import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import { JAPA_CATALOGUE_LIST, JAPA_PURPOSE_CATEGORIES } from "../data/japaCatalogueData";
import japaCatalogueService, {
  mapApiJapaServiceToUi,
} from "../../../services/japaCatalogueService";
import JapaListingHero from "../components/JapaListingHero";
import JapaConceptSection from "../components/JapaConceptSection";
import JapaPurposeSection from "../components/JapaPurposeSection";
import JapaCategoryDiscovery from "../components/JapaCategoryDiscovery";
import JapaServiceCard from "../components/JapaServiceCard";
import JapaCountSection from "../components/JapaCountSection";
import JapaScheduleSection from "../components/JapaScheduleSection";
import JapaPanditTeamSection from "../components/JapaPanditTeamSection";
import JapaProcessSection from "../components/JapaProcessSection";
import JapaConfigurationPreview from "../components/JapaConfigurationPreview";
import JapaKashiSection from "../components/JapaKashiSection";
import JapaArrangementModes from "../components/JapaArrangementModes";
import JapaSamagriSection from "../components/JapaSamagriSection";
import JapaPopularSection from "../components/JapaPopularSection";
import JapaCustomSection from "../components/JapaCustomSection";
import JapaWhyVedaStructure from "../components/JapaWhyVedaStructure";
import JapaWorkflowSection from "../components/JapaWorkflowSection";
import JapaFaqSection from "../components/JapaFaqSection";
import JapaFinalCta from "../components/JapaFinalCta";
import { Sparkles, Search, X, RefreshCw, FolderX } from "lucide-react";

const JAPA_COUNT_FILTER_OPTIONS = [
  { label: "All Counts", value: "All" },
  { label: "11,000 Japa", value: 11000 },
  { label: "21,000 Japa", value: 21000 },
  { label: "51,000 Japa", value: 51000 },
  { label: "1,25,000 Japa", value: 125000 },
];

const JAPA_SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const JapaCatalogueListing = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Set SEO Title
  useEffect(() => {
    document.title = "Vedic Mantra Japa & Chanting Services | Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter state synchronized with URL search params and route params
  const currentCategory = categorySlug || searchParams.get("category") || "All";
  const currentPurpose = searchParams.get("purpose") || "All";
  const currentCount = searchParams.get("count") || "All";
  const currentMode = searchParams.get("mode") || "All";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sortBy") || "featured";
  const isFeaturedOnly = searchParams.get("featured") === "true";

  // Local Search Input state for responsive typing
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [prevSearch, setPrevSearch] = useState(currentSearch);
  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch);
    setSearchInput(currentSearch);
  }

  // Dynamic API state
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [purposes, setPurposes] = useState(JAPA_PURPOSE_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Load category pills dynamically on mount
  useEffect(() => {
    let isCancelled = false;
    japaCatalogueService
      .getJapaCategories()
      .then((data) => {
        if (!isCancelled && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load Japa categories:", err);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  // Load purpose categories on mount
  useEffect(() => {
    let isCancelled = false;
    japaCatalogueService
      .getJapaPurposes()
      .then((data) => {
        if (!isCancelled && Array.isArray(data) && data.length > 0) {
          setPurposes(data);
        }
      })
      .catch(() => {
        // Keeps default JAPA_PURPOSE_CATEGORIES
      });
    return () => {
      isCancelled = true;
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
          v === "All Categories" ||
          v === "All Purposes" ||
          (k === "sortBy" && v === "featured") ||
          (k === "featured" && !v)
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

  const handleCategorySelect = (slug) => {
    if (categorySlug) {
      if (slug === "All" || slug === "All Categories") {
        navigate("/yagya-puja/japa");
      } else {
        navigate(`/yagya-puja/japa/category/${slug}`);
      }
    } else {
      updateParams({ category: slug });
    }
  };

  // Fetch Japa services from authoritative API with query filters, with fallback on error
  useEffect(() => {
    let isCancelled = false;

    const filterParams = {
      search: currentSearch.trim(),
      category: currentCategory !== "All" && currentCategory !== "All Categories" ? currentCategory : undefined,
      purpose: currentPurpose !== "All" && currentPurpose !== "All Purposes" ? currentPurpose : undefined,
      count: currentCount !== "All" && currentCount !== "All Counts" ? currentCount : undefined,
      mode: currentMode !== "All" && currentMode !== "All Modes" ? currentMode : undefined,
      isFeatured: isFeaturedOnly,
      sortBy: currentSort,
      limit: 50,
    };

    const timer = setTimeout(async () => {
      try {
        const response = await japaCatalogueService.getJapaServices(filterParams);
        if (!isCancelled) {
          if (response && response.success && Array.isArray(response.services)) {
            setServices(response.services);
            setIsFallback(false);
          } else {
            throw new Error("Invalid API response format");
          }
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Japa catalogue API failed, engaging static fallback:", err?.message || err);

          // Apply faithful local filtering to static JAPA_CATALOGUE_LIST
          const localFallback = JAPA_CATALOGUE_LIST.filter((japa) => {
            if (!japa.active) return false;

            if (currentCategory !== "All" && currentCategory !== "All Categories") {
              const matchesCatSlug = japa.category?.slug === currentCategory;
              const matchesCatId = japa.categoryId && categories.find((c) => c.slug === currentCategory)?.id === japa.categoryId;
              if (!matchesCatSlug && !matchesCatId) return false;
            }

            if (currentPurpose !== "All" && currentPurpose !== "All Purposes") {
              const matchesCat = japa.purposeCategory === currentPurpose;
              const matchesList = (japa.purposeCategories || []).includes(currentPurpose);
              if (!matchesCat && !matchesList) return false;
            }

            if (currentCount !== "All" && currentCount !== "All Counts") {
              const countNum = Number(currentCount);
              if (!(japa.availableCounts || []).includes(countNum)) return false;
            }

            if (currentMode === "kashi" && !japa.kashiAvailable) return false;
            if (currentMode === "remote" && !japa.remoteAvailable) return false;

            if (isFeaturedOnly && !japa.featured) return false;

            if (currentSearch.trim() !== "") {
              const q = currentSearch.toLowerCase().trim();
              const matchesName = (japa.name || "").toLowerCase().includes(q);
              const matchesDesc = (japa.description || "").toLowerCase().includes(q);
              const matchesMantra = (japa.mantra || "").toLowerCase().includes(q);
              const matchesPurpose = (japa.purpose || "").toLowerCase().includes(q);
              if (!matchesName && !matchesDesc && !matchesMantra && !matchesPurpose) {
                return false;
              }
            }

            return true;
          })
            .sort((a, b) => {
              if (currentSort === "price-asc") {
                return (a.startingPrice || 0) - (b.startingPrice || 0);
              }
              if (currentSort === "price-desc") {
                return (b.startingPrice || 0) - (a.startingPrice || 0);
              }
              if (currentSort === "name-asc") {
                return a.name.localeCompare(b.name);
              }
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return 0;
            })
            .map(mapApiJapaServiceToUi);

          setServices(localFallback);
          setIsFallback(true);
          setLoading(false);
        }
      }
    }, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    currentCategory,
    currentPurpose,
    currentCount,
    currentMode,
    isFeaturedOnly,
    currentSearch,
    currentSort,
    retryTrigger,
    categories,
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentCategory !== "All" && currentCategory !== "All Categories") count++;
    if (currentPurpose !== "All" && currentPurpose !== "All Purposes") count++;
    if (currentCount !== "All" && currentCount !== "All Counts") count++;
    if (currentMode !== "All" && currentMode !== "All Modes") count++;
    if (isFeaturedOnly) count++;
    if (currentSearch.trim() !== "") count++;
    return count;
  }, [currentCategory, currentPurpose, currentCount, currentMode, isFeaturedOnly, currentSearch]);

  const handleResetFilters = () => {
    setLoading(true);
    setSearchInput("");
    if (categorySlug) {
      navigate("/yagya-puja/japa");
    } else {
      setSearchParams(new URLSearchParams(), { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  const scrollToCatalogue = () => {
    const el = document.getElementById("japa-catalogue-heading");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCustomSection = () => {
    const el = document.getElementById("custom-japa-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf4e6] text-[#2b241d]">
      {/* 1. HERO */}
      <JapaListingHero onExploreClick={scrollToCatalogue} />

      {/* 2. WHAT IS MANTRA JAPA? */}
      <JapaConceptSection />

      {/* 3. WHY JAPA? (6 Purpose Cards) */}
      <JapaPurposeSection
        selectedPurpose={currentPurpose}
        onSelectPurpose={(p) => {
          updateParams({ purpose: p });
          scrollToCatalogue();
        }}
      />

      {/* 4. DYNAMIC JAPA CATEGORY DISCOVERY SECTION */}
      <JapaCategoryDiscovery />

      {/* 5. EXPLORE MANTRA JAPA (Primary Catalogue) */}
      <section
        id="japa-catalogue-heading"
        className="scroll-mt-16 border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-[1280px]">
          {/* Section Header */}
          <div className="mx-auto max-w-[760px] text-center">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              <Sparkles size={13} className="text-[#c77722]" />
              <span>DISCOVERY & RECITATION</span>
            </div>
            <h2 className="mt-2 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Explore Mantra Japa
            </h2>
            <p className="mx-auto mt-2.5 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
              Choose a Mantra and prescribed Japa count according to your requirement.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-10 rounded-[24px] border border-[#e6d3ba] bg-[#fffaf1] p-5 shadow-xs">
            {/* Category Filter Pills (Dynamic from API) */}
            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => handleCategorySelect("All")}
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
                    onClick={() => handleCategorySelect(cat.slug)}
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

            <div className="grid gap-4 md:grid-cols-12 md:items-center">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative md:col-span-5">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c]"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onBlur={() => {
                    if (searchInput !== currentSearch) {
                      updateParams({ search: searchInput.trim() });
                    }
                  }}
                  placeholder="Search by Mantra, deity, or intention..."
                  className="w-full rounded-full border border-[#d6b8a0] bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#2b241d] placeholder-[#8c7e6c] transition focus:border-[#c77722] focus:outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({ search: "" });
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c] hover:text-[#2b241d] cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </form>

              {/* Purpose Category Select */}
              <div className="md:col-span-3">
                <select
                  value={currentPurpose}
                  onChange={(e) => updateParams({ purpose: e.target.value })}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-4 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  <option value="All">All Purposes</option>
                  {purposes.map((cat) => (
                    <option key={cat.id || cat.slug} value={cat.id || cat.slug}>
                      {cat.title || cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Japa Count Filter (Strictly matches service availableCounts) */}
              <div className="md:col-span-2">
                <select
                  value={currentCount}
                  onChange={(e) => updateParams({ count: e.target.value })}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-3 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  {JAPA_COUNT_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="md:col-span-2">
                <select
                  value={currentSort}
                  onChange={(e) => updateParams({ sortBy: e.target.value })}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-3 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  {JAPA_SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Pills Row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#ebdcc4] pt-3 text-[12px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#8a725b]">Mode:</span>
                {["All", "kashi", "remote"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateParams({ mode: m })}
                    className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                      currentMode === m
                        ? "bg-[#2b241d] text-[#f7ecd5]"
                        : "bg-white text-[#5c4e3f] hover:bg-[#f2e2cb]"
                    }`}
                  >
                    {m === "All" ? "All Modes" : m === "kashi" ? "Kashi Shrines" : "Remote Japa"}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => updateParams({ featured: !isFeaturedOnly })}
                  className={`ml-1 rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                    isFeaturedOnly
                      ? "bg-[#c77722] text-white"
                      : "bg-white text-[#5c4f42] hover:bg-[#f2e2cb]"
                  }`}
                >
                  Featured Only
                </button>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 font-bold text-[#b36c1e] hover:underline cursor-pointer"
                >
                  <X size={13} />
                  <span>Reset All Filters ({activeFilterCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-8 mb-6 flex flex-col gap-2 text-[13.5px] text-[#75695c] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              <strong className="text-[#2b241d]">
                {loading ? "..." : services.length}
              </strong>{" "}
              Consecrated Japa Services
              {currentCategory !== "All" && currentCategory !== "All Categories" && (
                <span className="ml-2 font-medium text-[#b36c1e]">
                  in {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                </span>
              )}
            </span>
          </div>

          {/* Fallback Archive Notice (only if API failed) */}
          {isFallback && !loading && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-[12.5px] text-amber-800 flex items-center justify-between">
              <span>Displaying offline Vedic Japa archive. Traditional recitation parameters remain fully verified.</span>
              <button
                type="button"
                onClick={() => setRetryTrigger((r) => r + 1)}
                className="inline-flex items-center gap-1.5 font-bold text-[#c77722] hover:underline cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>Retry Live API</span>
              </button>
            </div>
          )}

          {/* Catalogue Services Grid */}
          <div className="mt-10">
            {loading ? (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((japa) => (
                  <JapaServiceCard key={japa.id} service={japa} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-[#e6d3ba] bg-[#fffaf1] py-16 text-center">
                <FolderX size={28} className="mx-auto text-[#c77722]" />
                <h3 className="mt-3 font-serif text-[20px] font-bold text-[#2b241d]">
                  No Japa Services Match Your Filters
                </h3>
                <p className="mt-1 text-[13.5px] text-[#78644e]">
                  Try adjusting your category selection, count benchmark, purpose, or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 rounded-full bg-[#b56e20] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#8f5211] cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. CHOOSE YOUR JAPA COUNT (Critical Section) */}
      <JapaCountSection
        selectedCountFilter={currentCount === "All" ? null : Number(currentCount)}
        onSelectCountFilter={(count) => {
          updateParams({ count });
          scrollToCatalogue();
        }}
      />

      {/* 6. JAPA COMPLETION SCHEDULE */}
      <JapaScheduleSection />

      {/* 7. PANDIT / CHANTING TEAM */}
      <JapaPanditTeamSection />

      {/* 8. JAPA PROCESS (7 Steps) */}
      <JapaProcessSection />

      {/* 9. YOUR JAPA PLAN (Configuration Preview) */}
      <JapaConfigurationPreview />

      {/* 10. JAPA IN KASHI (Visiting vs Remote) */}
      <JapaKashiSection
        onSelectMode={(mode) => {
          updateParams({ mode });
          scrollToCatalogue();
        }}
      />

      {/* 11. JAPA FOR INDIVIDUAL & FAMILY */}
      <JapaArrangementModes />

      {/* 12. JAPA SAMAGRI & RITUAL ARRANGEMENTS */}
      <JapaSamagriSection />

      {/* 13. POPULAR JAPA */}
      <JapaPopularSection />

      {/* 14. CUSTOM JAPA (Required) */}
      <div id="custom-japa-section">
        <JapaCustomSection />
      </div>

      {/* 15. WHY VEDA STRUCTURE? */}
      <JapaWhyVedaStructure />

      {/* 16. HOW BOOKING WORKS */}
      <JapaWorkflowSection />

      {/* 17. FAQ */}
      <JapaFaqSection />

      {/* 18. FINAL CTA */}
      <JapaFinalCta
        onExploreClick={scrollToCatalogue}
        onRequestCustomClick={scrollToCustomSection}
      />
    </div>
  );
};

export default JapaCatalogueListing;
