import { useState, useMemo } from "react";
import { YAGYA_LIST } from "../data/yagyaData";
import YagyaListingHero from "../components/YagyaListingHero";
import YagyaFilters from "../components/YagyaFilters";
import YagyaCard from "../components/YagyaCard";

const YagyaListing = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("featured");

  // Calculate active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All Categories") count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory("All Categories");
    setSearchQuery("");
    setSelectedSort("featured");
  };

  // Filter & Sort Yagyas
  const filteredYagyas = useMemo(() => {
    return YAGYA_LIST.filter((yagya) => {
      // Category filter
      if (
        selectedCategory !== "All Categories" &&
        yagya.category !== selectedCategory
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = (yagya.name || "").toLowerCase().includes(q);
        const matchDesc = (yagya.shortDescription || "").toLowerCase().includes(q);
        const matchDeity = (yagya.deity || "").toLowerCase().includes(q);
        const matchCat = (yagya.category || "").toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchDeity && !matchCat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (selectedSort === "price-asc") {
        return a.startingPrice - b.startingPrice;
      }
      if (selectedSort === "price-desc") {
        return b.startingPrice - a.startingPrice;
      }
      // "featured" default
      return 0;
    });
  }, [selectedCategory, searchQuery, selectedSort]);

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24">
      {/* =========================================================
          1. HEADER / CINEMATIC HERO SECTION
      ========================================================== */}
      <YagyaListingHero />

      {/* =========================================================
          2. MAIN CONTENT AREA (FILTERS & 4-COLUMN YAGYA GRID)
      ========================================================== */}
      <div
        id="yagya-list"
        className="mx-auto max-w-[1440px] px-4 pt-10 sm:px-6 lg:px-8 xl:px-10"
      >
        {/* Filter Controls */}
        <YagyaFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        {/* Results Counter Bar */}
        <div className="mb-6 flex items-center justify-between text-[13px] text-[#75695c]">
          <span>
            Showing <strong className="text-[#2b241d]">{filteredYagyas.length}</strong> Sacred Vedic Yagyas
          </span>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[12px] font-semibold text-[#c77722] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Yagya 4-Cards Grid on Desktop */}
        {filteredYagyas.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6.5">
            {filteredYagyas.map((yagya) => (
              <YagyaCard key={yagya.id} yagya={yagya} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center">
            <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
              No matching Yagyas found
            </h3>
            <p className="mt-2 text-[14px] text-[#75695c]">
              Try adjusting your category or search keywords to discover more sacred fire ceremonies.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 rounded-full bg-[#eab12c] px-6 py-2.5 text-[13px] font-bold text-[#1c1308]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YagyaListing;
