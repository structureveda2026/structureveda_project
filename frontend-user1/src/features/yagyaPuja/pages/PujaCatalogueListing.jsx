import { useState, useMemo } from "react";
import { PUJA_CATALOGUE_LIST } from "../data/pujaCatalogueData";
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
import { Sparkles } from "lucide-react";

const PujaCatalogueListing = () => {
  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("featured");

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPurpose !== "All Purposes") count++;
    if (selectedDuration !== "All Durations") count++;
    if (selectedMode !== "All Modes") count++;
    if (isFeaturedOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedPurpose, selectedDuration, selectedMode, isFeaturedOnly, searchQuery]);

  const handleResetFilters = () => {
    setSelectedPurpose("All Purposes");
    setSelectedDuration("All Durations");
    setSelectedMode("All Modes");
    setIsFeaturedOnly(false);
    setSearchQuery("");
    setSelectedSort("featured");
  };

  const filteredServices = useMemo(() => {
    return PUJA_CATALOGUE_LIST.filter((service) => {
      // Purpose filter
      if (selectedPurpose !== "All Purposes") {
        const matchesCategory = service.purposeCategory === selectedPurpose;
        const matchesPurposeText = (service.purpose || "").toLowerCase().includes(selectedPurpose.toLowerCase());
        if (!matchesCategory && !matchesPurposeText) {
          return false;
        }
      }

      // Duration filter
      if (selectedDuration !== "All Durations") {
        const durNum = parseInt(selectedDuration, 10);
        const hasMatchingHour = (service.durationHours || []).includes(durNum);
        const hasMatchingString = (service.availableDurations || []).some((d) =>
          d.toLowerCase().includes(selectedDuration.toLowerCase())
        ) || (service.duration || "").toLowerCase().includes(selectedDuration.toLowerCase());

        if (!hasMatchingHour && !hasMatchingString) {
          return false;
        }
      }

      // Mode filter (Remote, Family, Individual)
      if (selectedMode !== "All Modes") {
        if (selectedMode === "remote") {
          const isRemoteCapable = (service.availableMode || "").toLowerCase().includes("remote");
          if (!isRemoteCapable) return false;
        } else if (selectedMode === "family") {
          const isFamilyCapable =
            service.purposeCategory === "Family & Home" ||
            (service.purpose || "").toLowerCase().includes("family") ||
            (service.shortDescription || "").toLowerCase().includes("family");
          if (!isFamilyCapable) return false;
        } else if (selectedMode === "individual") {
          const isIndividualCapable =
            (service.availableMode || "").toLowerCase().includes("in-person") ||
            (service.purpose || "").toLowerCase().includes("peace") ||
            (service.purpose || "").toLowerCase().includes("spiritual");
          if (!isIndividualCapable) return false;
        }
      }

      // Featured filter
      if (isFeaturedOnly && !service.isFeatured) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = (service.name || "").toLowerCase().includes(q);
        const matchDeity = (service.deity || "").toLowerCase().includes(q);
        const matchPurpose = (service.purpose || "").toLowerCase().includes(q);
        const matchDesc = (service.shortDescription || "").toLowerCase().includes(q);
        if (!matchName && !matchDeity && !matchPurpose && !matchDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === "price-asc") {
        return a.startingPrice - b.startingPrice;
      }
      if (selectedSort === "price-desc") {
        return b.startingPrice - a.startingPrice;
      }
      if (selectedSort === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      // "featured" default
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedPurpose, selectedDuration, selectedMode, isFeaturedOnly, searchQuery, selectedSort]);

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
              isFeaturedOnly={isFeaturedOnly}
              setIsFeaturedOnly={setIsFeaturedOnly}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSort={selectedSort}
              setSelectedSort={setSelectedSort}
              activeFilterCount={activeFilterCount}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* ── Counter Bar ── */}
          <div className="mb-7 flex items-center justify-between text-[13px] text-[#75695c]">
            <span>
              Showing{" "}
              <strong className="font-bold text-[#2b241d] text-[15px]">
                {filteredServices.length}
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

          {/* ── Service Cards Grid ── */}
          {filteredServices.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
              {filteredServices.map((service) => (
                <PujaServiceCard key={service.id} service={service} />
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
        onSelectPurpose={(purposeName) => {
          setSelectedPurpose(purposeName);
        }}
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
          setSelectedMode(modeType);
        }}
      />

      {/* 9. PUJA IN KASHI */}
      <PujaKashiSection
        onFilterRemote={() => {
          setSelectedMode("remote");
        }}
      />

      {/* 10. POPULAR PUJAS (featured = true AND active = true) */}
      <PujaPopularSection />

      {/* 11. YOUR PUJA — LIVE CONFIGURATION PREVIEW */}
      <PujaConfigurationPreview />

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
