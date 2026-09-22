import { useState, useMemo, useEffect } from "react";
import pujaCatalogueService from "../../../services/pujaCatalogueService";
import PujaServiceListingHero from "../components/PujaServiceListingHero";
import PujaSankalpaProcess from "../components/PujaSankalpaProcess";
import PujaPurposeDiscovery from "../components/PujaPurposeDiscovery";
import PujaServiceCard from "../components/PujaServiceCard";
import PujaServiceFilters from "../components/PujaServiceFilters";
import PujaDurationSection from "../components/PujaDurationSection";
import PujaInclusionsSection from "../components/PujaInclusionsSection";
import PujaWorkflowSection from "../components/PujaWorkflowSection";
import PujaArrangementModes from "../components/PujaArrangementModes";
import PujaKashiSection from "../components/PujaKashiSection";
import PujaPopularSection from "../components/PujaPopularSection";
import PujaConfigurationPreview from "../components/PujaConfigurationPreview";
import PujaWhyVedaStructure from "../components/PujaWhyVedaStructure";
import PujaBeforeYouBook from "../components/PujaBeforeYouBook";
import PujaFaqSection from "../components/PujaFaqSection";
import PujaFinalCta from "../components/PujaFinalCta";
import { Sparkles, RefreshCw } from "lucide-react";

const PujaCatalogueListing = () => {
  const [services, setServices] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState("featured");

  // Debounce search input for responsive server-side querying
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load active Puja purpose categories on mount
  useEffect(() => {
    let isMounted = true;
    pujaCatalogueService
      .getPujaPurposes()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setPurposes(data);
        }
      })
      .catch((err) => {
        console.error("Could not load Puja purposes:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Resolve purpose slug (supports either slug or display name)
  const resolvedPurposeSlug = useMemo(() => {
    if (!selectedPurpose || selectedPurpose === "All Purposes") return undefined;
    const found = (purposes || []).find(
      (p) =>
        p.slug === selectedPurpose ||
        p.name.toLowerCase() === selectedPurpose.toLowerCase()
    );
    return found ? found.slug : selectedPurpose;
  }, [selectedPurpose, purposes]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPurpose !== "All Purposes") count++;
    if (selectedDuration !== "All Durations") count++;
    if (selectedMode !== "All Modes") count++;
    if (isFeaturedOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedPurpose, selectedDuration, selectedMode, isFeaturedOnly, searchQuery]);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleResetFilters = () => {
    setSelectedPurpose("All Purposes");
    setSelectedDuration("All Durations");
    setSelectedMode("All Modes");
    setIsFeaturedOnly(false);
    setSearchQuery("");
    setSelectedSort("featured");
    setLoading(true);
  };

  // Fetch services dynamically from public API on filter / search / sort changes
  useEffect(() => {
    let isMounted = true;

    pujaCatalogueService
      .getPujaServices({
        search: debouncedSearch,
        purpose: resolvedPurposeSlug,
        duration: selectedDuration,
        mode: selectedMode,
        isFeatured: isFeaturedOnly,
        sortBy: selectedSort,
      })
      .then((res) => {
        if (isMounted) {
          setServices(res.services || []);
          setTotalCount(res.total ?? (res.services ? res.services.length : 0));
          setLoading(false);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error fetching puja services:", err);
          setError("Unable to load Vedic Puja services. Please check your connection and try again.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, resolvedPurposeSlug, selectedDuration, selectedMode, isFeaturedOnly, selectedSort, reloadTrigger]);

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* 1. HERO SECTION */}
      <PujaServiceListingHero />

      {/* 2. EVERY PUJA BEGINS WITH A SANKALPA */}
      <PujaSankalpaProcess />

      {/* 3. EXPLORE VEDIC PUJAS (PRIMARY CATALOGUE SECTION) */}
      <section id="puja-catalogue" className="border-b border-[#ebdcc4] bg-[#fdf8ef] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-[1400px]">

          {/* ── Section Header ── */}
          <div className="mb-12 text-center lg:mb-14">

            {/* Eyebrow label */}
            <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
              <Sparkles size={11} className="text-[#c77722]" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
                Primary Catalogue
              </span>
            </div>

            {/* Two-color heading */}
            <h2 className="mt-5 font-serif leading-[1.15]">
              <span className="block text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[42px]">
                Explore Vedic
              </span>
              <span className="block text-[36px] font-bold text-[#c77722] sm:text-[44px] lg:text-[50px]">
                Pujas
                <span
                  aria-hidden="true"
                  className="mx-auto mt-1 block h-[2px] w-14 rounded-full bg-[#c77722]/50 sm:w-16"
                />
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-[600px] text-[14.5px] leading-[1.75] text-[#5c4e3f] sm:text-[15.5px]">
              Choose a Puja according to your purpose and devotional intention.
            </p>

            {/* Decorative divider */}
            <div aria-hidden="true" className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/70">
              <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
              <span className="text-[13px]">✦</span>
              <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
            </div>
          </div>

          {/* ── Filter Area ── */}
          <div className="mb-8 rounded-2xl border border-[#e8d9bc] bg-[#fffdf8] px-5 py-4 shadow-[0_2px_12px_rgba(80,55,20,0.05)] sm:px-6 sm:py-5">
            <PujaServiceFilters
              selectedPurpose={selectedPurpose}
              setSelectedPurpose={setSelectedPurpose}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
              isFeaturedOnly={isFeaturedOnly}
              setIsFeaturedOnly={setIsFeaturedOnly}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              activeFilterCount={activeFilterCount}
              onResetFilters={handleResetFilters}
              purposes={purposes}
            />
          </div>

          {/* ── Counter Bar ── */}
          <div className="mb-7 flex items-center justify-between text-[13px] text-[#75695c]">
            <span>
              Showing{" "}
              <strong className="font-bold text-[#2b241d] text-[15px]">
                {loading ? "..." : totalCount}
              </strong>{" "}
              Sacred Vedic Puja Services
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[12.5px] font-semibold text-[#c77722] hover:underline cursor-pointer"
              >
                Clear all filters ({activeFilterCount})
              </button>
            )}
          </div>

          {/* ── Service Cards Grid / States ── */}
          {loading ? (
            /* Loading Skeleton Grid */
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="flex flex-col overflow-hidden rounded-[20px] border border-[#e8d9bc] bg-[#fffdfa] animate-pulse shadow-xs"
                >
                  <div className="w-full bg-[#ebdcc4]/60" style={{ aspectRatio: "4/3" }} />
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-20 rounded-full bg-[#ebdcc4]/70" />
                        <div className="h-4 w-24 rounded-full bg-[#ebdcc4]/50" />
                      </div>
                      <div className="h-6 w-3/4 rounded-md bg-[#ebdcc4]/70" />
                      <div className="h-3.5 w-full rounded bg-[#ebdcc4]/40" />
                      <div className="h-3.5 w-4/5 rounded bg-[#ebdcc4]/40" />
                    </div>
                    <div className="pt-4 border-t border-[#f0e2cd] flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="h-3 w-16 rounded bg-[#ebdcc4]/50" />
                        <div className="h-5 w-20 rounded bg-[#ebdcc4]/70" />
                      </div>
                      <div className="h-8 w-24 rounded-full bg-[#ebdcc4]/70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="rounded-[28px] border border-[#f0c8a8] bg-[#fffbf7] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fce8dc] text-[#c74422]">
                <RefreshCw size={24} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                Failed to load Puja services
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                {error}
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setReloadTrigger((prev) => prev + 1);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition hover:bg-[#dda018] cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Try Again</span>
              </button>
            </div>
          ) : services.length > 0 ? (
            /* Active Service Cards Grid */
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {services.map((service) => (
                <PujaServiceCard key={service.id || service.slug} service={service} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                <Sparkles size={24} />
              </div>
              <h3 className="mt-4 font-serif text-[22px] font-bold text-[#2b241d]">
                No matching Puja services found
              </h3>
              <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-[#75695c]">
                We could not find any services matching your current criteria. Try adjusting your filters or search keywords.
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

      {/* 4. PUJA BY PURPOSE (7 CLIENT-SPECIFIED CATEGORIES) */}
      <PujaPurposeDiscovery
        selectedPurpose={selectedPurpose}
        onSelectPurpose={(purposeIdentifier) => {
          setSelectedPurpose(purposeIdentifier);
        }}
        purposes={purposes}
      />

      {/* 5. PUJA DURATION */}
      <PujaDurationSection
        selectedDuration={selectedDuration}
        onSelectDuration={(dur) => setSelectedDuration(dur)}
      />

      {/* 6. WHAT IS INCLUDED? */}
      <PujaInclusionsSection />

      {/* 7. HOW PUJA BOOKING WORKS */}
      <PujaWorkflowSection />

      {/* 8. PERSONAL / FAMILY / REMOTE */}
      <PujaArrangementModes
        onFilterMode={(modeType) => {
          if (modeType === "remote") setSelectedMode("remote");
          else if (modeType === "individual" || modeType === "in_person") setSelectedMode("in_person");
          else if (modeType === "family" || modeType === "hybrid") setSelectedMode("hybrid");
          else setSelectedMode(modeType);
        }}
      />

      {/* 9. PUJA IN KASHI */}
      <PujaKashiSection
        onFilterRemote={() => {
          setSelectedMode("remote");
        }}
      />

      {/* 10. POPULAR PUJAS (Derived from active API services) */}
      <PujaPopularSection services={services} />

      {/* 11. YOUR PUJA — LIVE CONFIGURATION PREVIEW */}
      <PujaConfigurationPreview services={services} />

      {/* 12. WHY VEDA STRUCTURE? */}
      <PujaWhyVedaStructure />

      {/* 13. BEFORE YOU BOOK */}
      <PujaBeforeYouBook />

      {/* 14. FAQ ACCORDION */}
      <PujaFaqSection />

      {/* 15. FINAL CTA BANNER */}
      <PujaFinalCta />
    </div>
  );
};

export default PujaCatalogueListing;
