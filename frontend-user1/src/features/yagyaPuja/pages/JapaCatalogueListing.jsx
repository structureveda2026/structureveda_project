import { useState, useMemo, useEffect } from "react";
import { JAPA_CATALOGUE_LIST, JAPA_PURPOSE_CATEGORIES } from "../data/japaCatalogueData";
import JapaListingHero from "../components/JapaListingHero";
import JapaConceptSection from "../components/JapaConceptSection";
import JapaPurposeSection from "../components/JapaPurposeSection";
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
import { Sparkles, Search, SlidersHorizontal, X } from "lucide-react";

export const JAPA_COUNT_FILTER_OPTIONS = [
  { label: "All Counts", value: "All" },
  { label: "11,000 Japa", value: 11000 },
  { label: "21,000 Japa", value: 21000 },
  { label: "51,000 Japa", value: 51000 },
  { label: "1,25,000 Japa", value: 125000 },
];

export const JAPA_SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const JapaCatalogueListing = () => {
  // Set SEO Title
  useEffect(() => {
    document.title = "Vedic Mantra Japa & Chanting Services | Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [selectedPurpose, setSelectedPurpose] = useState("All");
  const [selectedCount, setSelectedCount] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("featured");

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPurpose !== "All") count++;
    if (selectedCount !== "All") count++;
    if (selectedMode !== "All") count++;
    if (isFeaturedOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedPurpose, selectedCount, selectedMode, isFeaturedOnly, searchQuery]);

  const handleResetFilters = () => {
    setSelectedPurpose("All");
    setSelectedCount("All");
    setSelectedMode("All");
    setIsFeaturedOnly(false);
    setSearchQuery("");
    setSelectedSort("featured");
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

  // Filtered and Sorted Japa Services
  const filteredJapas = useMemo(() => {
    return JAPA_CATALOGUE_LIST.filter((japa) => {
      // Must be active
      if (!japa.active) return false;

      // Purpose Filter
      if (selectedPurpose !== "All") {
        const matchesCat = japa.purposeCategory === selectedPurpose;
        const matchesList = (japa.purposeCategories || []).includes(selectedPurpose);
        if (!matchesCat && !matchesList) return false;
      }

      // Count Filter (Check individual service availableCounts array!)
      if (selectedCount !== "All") {
        const countNum = Number(selectedCount);
        const supportsCount = (japa.availableCounts || []).includes(countNum);
        if (!supportsCount) return false;
      }

      // Mode / Location Filter
      if (selectedMode === "kashi" && !japa.kashiAvailable) return false;
      if (selectedMode === "remote" && !japa.remoteAvailable) return false;

      // Featured Filter
      if (isFeaturedOnly && !japa.featured) return false;

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (japa.name || "").toLowerCase().includes(q);
        const matchesDesc = (japa.description || "").toLowerCase().includes(q);
        const matchesMantra = (japa.mantra || "").toLowerCase().includes(q);
        const matchesPurpose = (japa.purpose || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesMantra && !matchesPurpose) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === "price-asc") {
        return (a.startingPrice || 0) - (b.startingPrice || 0);
      }
      if (selectedSort === "price-desc") {
        return (b.startingPrice || 0) - (a.startingPrice || 0);
      }
      if (selectedSort === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      // default: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedPurpose, selectedCount, selectedMode, isFeaturedOnly, searchQuery, selectedSort]);

  return (
    <div className="min-h-screen bg-[#faf4e6] text-[#2b241d]">
      {/* 1. HERO */}
      <JapaListingHero onExploreClick={scrollToCatalogue} />

      {/* 2. WHAT IS MANTRA JAPA? */}
      <JapaConceptSection />

      {/* 3. WHY JAPA? (6 Purpose Cards) */}
      <JapaPurposeSection
        selectedPurpose={selectedPurpose}
        onSelectPurpose={(p) => {
          setSelectedPurpose(p);
          scrollToCatalogue();
        }}
      />

      {/* 4. EXPLORE MANTRA JAPA (Primary Catalogue) */}
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
            <div className="grid gap-4 md:grid-cols-12 md:items-center">
              {/* Search Bar */}
              <div className="relative md:col-span-5">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Mantra, deity, or intention..."
                  className="w-full rounded-full border border-[#d6b8a0] bg-white py-2.5 pl-10 pr-4 text-[13.5px] text-[#2b241d] placeholder-[#8c7e6c] transition focus:border-[#c77722] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c] hover:text-[#2b241d] cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Purpose Category Select */}
              <div className="md:col-span-3">
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-4 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  <option value="All">All Purposes</option>
                  {JAPA_PURPOSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Japa Count Filter (Strictly matches service availableCounts) */}
              <div className="md:col-span-2">
                <select
                  value={selectedCount}
                  onChange={(e) => setSelectedCount(e.target.value)}
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
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
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
                    onClick={() => setSelectedMode(m)}
                    className={`rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                      selectedMode === m
                        ? "bg-[#2b241d] text-[#f7ecd5]"
                        : "bg-white text-[#5c4e3f] hover:bg-[#f2e2cb]"
                    }`}
                  >
                    {m === "All" ? "All Modes" : m === "kashi" ? "Kashi Shrines" : "Remote Japa"}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setIsFeaturedOnly(!isFeaturedOnly)}
                  className={`ml-1 rounded-full px-3 py-1 font-medium transition cursor-pointer ${
                    isFeaturedOnly
                      ? "bg-[#c77722] text-white"
                      : "bg-white text-[#5c4e3f] hover:bg-[#f2e2cb]"
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

          {/* Catalogue Services Grid */}
          <div className="mt-10">
            {filteredJapas.length > 0 ? (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredJapas.map((japa) => (
                  <JapaServiceCard key={japa.id} service={japa} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-[#e6d3ba] bg-[#fffaf1] py-16 text-center">
                <Sparkles size={28} className="mx-auto text-[#c77722]" />
                <h3 className="mt-3 font-serif text-[20px] font-bold text-[#2b241d]">
                  No Japa Services Match Your Filters
                </h3>
                <p className="mt-1 text-[13.5px] text-[#78644e]">
                  Try adjusting your count benchmark, purpose selection, or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 rounded-full bg-[#b56e20] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#8f5211]"
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
        selectedCountFilter={selectedCount === "All" ? null : Number(selectedCount)}
        onSelectCountFilter={(count) => {
          setSelectedCount(count);
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
          setSelectedMode(mode);
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
