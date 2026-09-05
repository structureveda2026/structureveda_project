import { useState, useMemo, useEffect } from "react";
import { PATH_CATALOGUE_LIST, PATH_PURPOSE_CATEGORIES, RECITATION_FORMATS } from "../data/pathCatalogueData";
import PathListingHero from "../components/PathListingHero";
import PathConceptSection from "../components/PathConceptSection";
import PathPurposeSection from "../components/PathPurposeSection";
import PathServiceCard from "../components/PathServiceCard";
import PathPopularSection from "../components/PathPopularSection";
import PathFormatSection from "../components/PathFormatSection";
import PathCustomSection from "../components/PathCustomSection";
import PathPanditTeamSection from "../components/PathPanditTeamSection";
import PathChapterStructureSection from "../components/PathChapterStructureSection";
import PathConfigurationPreview from "../components/PathConfigurationPreview";
import PathSankalpaSection from "../components/PathSankalpaSection";
import PathKashiSection from "../components/PathKashiSection";
import PathArrangementModes from "../components/PathArrangementModes";
import PathInclusionsSection from "../components/PathInclusionsSection";
import PathWorkflowSection from "../components/PathWorkflowSection";
import PathWhyVedaStructure from "../components/PathWhyVedaStructure";
import PathFaqSection from "../components/PathFaqSection";
import PathFinalCta from "../components/PathFinalCta";
import { Sparkles, Search, X } from "lucide-react";

export const PATH_SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const PathCatalogueListing = () => {
  // Set SEO Title
  useEffect(() => {
    document.title = "Vedic Path & Scripture Recitation Services | Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [selectedPurpose, setSelectedPurpose] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [isFeaturedOnly, setIsFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("featured");

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPurpose !== "All") count++;
    if (selectedFormat !== "All") count++;
    if (selectedMode !== "All") count++;
    if (isFeaturedOnly) count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedPurpose, selectedFormat, selectedMode, isFeaturedOnly, searchQuery]);

  const handleResetFilters = () => {
    setSelectedPurpose("All");
    setSelectedFormat("All");
    setSelectedMode("All");
    setIsFeaturedOnly(false);
    setSearchQuery("");
    setSelectedSort("featured");
  };

  const scrollToCatalogue = () => {
    const el = document.getElementById("path-catalogue-heading");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCustomSection = () => {
    const el = document.getElementById("custom-path-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered and Sorted Path Services
  const filteredPaths = useMemo(() => {
    return PATH_CATALOGUE_LIST.filter((path) => {
      if (!path.active) return false;

      // Purpose Filter
      if (selectedPurpose !== "All") {
        const matchesCat = path.purposeCategory === selectedPurpose;
        const matchesList = (path.purposeCategories || []).includes(selectedPurpose);
        if (!matchesCat && !matchesList) return false;
      }

      // Format Filter (Strictly matches service availableFormats array!)
      if (selectedFormat !== "All") {
        const supportsFormat = (path.availableFormats || []).includes(selectedFormat);
        if (!supportsFormat) return false;
      }

      // Mode / Location Filter
      if (selectedMode === "kashi" && !path.kashiAvailable) return false;
      if (selectedMode === "remote" && !path.remoteAvailable) return false;

      // Featured Filter
      if (isFeaturedOnly && !path.featured) return false;

      // Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (path.name || "").toLowerCase().includes(q);
        const matchesDesc = (path.description || "").toLowerCase().includes(q);
        const matchesScripture = (path.scripture || "").toLowerCase().includes(q);
        const matchesPurpose = (path.purpose || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesScripture && !matchesPurpose) {
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
  }, [selectedPurpose, selectedFormat, selectedMode, isFeaturedOnly, searchQuery, selectedSort]);

  return (
    <div className="min-h-screen bg-[#faf4e6] text-[#2b241d]">
      {/* 1. HERO */}
      <PathListingHero
        onExploreClick={scrollToCatalogue}
        onRequestCustomClick={scrollToCustomSection}
      />

      {/* 2. WHAT IS PATH / RECITATION? */}
      <PathConceptSection />

      {/* 3. EXPLORE SACRED PATH & RECITATION (Primary Catalogue) */}
      <section
        id="path-catalogue-heading"
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
              Explore Sacred Path & Recitation
            </h2>
            <p className="mx-auto mt-2.5 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
              Choose from available traditional texts, Stotras and recitation services.
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
                  placeholder="Search by scripture, Stotra, or intention..."
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
                  {PATH_PURPOSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recitation Format Filter (Strictly matches service availableFormats) */}
              <div className="md:col-span-2">
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full rounded-full border border-[#d6b8a0] bg-white px-3 py-2.5 text-[13px] font-medium text-[#2b241d] transition focus:border-[#c77722] focus:outline-none"
                >
                  <option value="All">All Formats</option>
                  {RECITATION_FORMATS.map((fmt) => (
                    <option key={fmt.id} value={fmt.id}>
                      {fmt.label}
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
                  {PATH_SORT_OPTIONS.map((opt) => (
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
                    {m === "All" ? "All Modes" : m === "kashi" ? "Kashi Shrines" : "Remote Recitation"}
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
            {filteredPaths.length > 0 ? (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPaths.map((path) => (
                  <PathServiceCard key={path.id} service={path} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-[#e6d3ba] bg-[#fffaf1] py-16 text-center">
                <Sparkles size={28} className="mx-auto text-[#c77722]" />
                <h3 className="mt-3 font-serif text-[20px] font-bold text-[#2b241d]">
                  No Scripture Recitations Match Your Filters
                </h3>
                <p className="mt-1 text-[13.5px] text-[#78644e]">
                  Try adjusting your format selection, purpose category, or search keywords.
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

      {/* 4. PATH BY PURPOSE */}
      <PathPurposeSection
        selectedPurpose={selectedPurpose}
        onSelectPurpose={(p) => {
          setSelectedPurpose(p);
          scrollToCatalogue();
        }}
      />

      {/* 5. POPULAR PATHS */}
      <PathPopularSection />

      {/* 6. CHOOSE YOUR RECITATION FORMAT (Critical Core Business Rule) */}
      <PathFormatSection
        selectedFormatFilter={selectedFormat === "All" ? null : selectedFormat}
        onSelectFormatFilter={(fmt) => {
          setSelectedFormat(fmt);
          scrollToCatalogue();
        }}
      />

      {/* 7. CUSTOM PATH (Required) */}
      <div id="custom-path-section">
        <PathCustomSection />
      </div>

      {/* 8. PANDIT REQUIREMENT */}
      <PathPanditTeamSection />

      {/* 9. CHAPTERS / TEXT STRUCTURE */}
      <PathChapterStructureSection />

      {/* 10. YOUR PATH PLAN (Configuration Preview) */}
      <PathConfigurationPreview />

      {/* 11. SANKALPA */}
      <PathSankalpaSection />

      {/* 12. PATH IN KASHI */}
      <PathKashiSection
        onSelectMode={(mode) => {
          setSelectedMode(mode);
          scrollToCatalogue();
        }}
      />

      {/* 13. PATH FOR INDIVIDUAL & FAMILY */}
      <PathArrangementModes />

      {/* 14. WHAT CAN BE ARRANGED? */}
      <PathInclusionsSection />

      {/* 15. HOW IT WORKS */}
      <PathWorkflowSection />

      {/* 16. WHY VEDA STRUCTURE? */}
      <PathWhyVedaStructure />

      {/* 17. FAQ */}
      <PathFaqSection />

      {/* 18. FINAL CTA */}
      <PathFinalCta
        onExploreClick={scrollToCatalogue}
        onRequestCustomClick={scrollToCustomSection}
      />
    </div>
  );
};

export default PathCatalogueListing;
