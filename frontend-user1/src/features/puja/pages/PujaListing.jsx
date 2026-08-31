import { useState, useMemo } from "react";
import { PUJA_LIST } from "../data/pujaData";
import PujaCard from "../components/PujaCard";
import PujaFilters from "../components/PujaFilters";
import PujaListingHero from "../components/PujaListingHero";

const PujaListing = () => {
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedDeity, setSelectedDeity] = useState("All Deities");
  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes");
  const [selectedSort, setSelectedSort] = useState("date-asc");

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedLocation !== "All Locations") count++;
    if (selectedDeity !== "All Deities") count++;
    if (selectedPurpose !== "All Purposes") count++;
    return count;
  }, [selectedLocation, selectedDeity, selectedPurpose]);

  const handleResetFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedDeity("All Deities");
    setSelectedPurpose("All Purposes");
    setSelectedSort("date-asc");
  };

  // Filter and sort items
  const filteredPujas = useMemo(() => {
    return PUJA_LIST.filter((puja) => {
      if (selectedLocation !== "All Locations" && puja.location !== selectedLocation) {
        return false;
      }
      if (selectedDeity !== "All Deities" && puja.deity !== selectedDeity) {
        return false;
      }
      if (selectedPurpose !== "All Purposes" && puja.purposeCategory !== selectedPurpose) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === "price-asc") {
        return a.startingPrice - b.startingPrice;
      }
      if (selectedSort === "price-desc") {
        return b.startingPrice - a.startingPrice;
      }
      // date-asc
      return new Date(a.date) - new Date(b.date);
    });
  }, [selectedLocation, selectedDeity, selectedPurpose, selectedSort]);

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24">
      {/* =========================================================
          PAGE HEADER / CINEMATIC HERO BANNER WITH PUJA BG IMAGE
      ========================================================== */}
      <PujaListingHero />

      {/* =========================================================
          MAIN CONTENT AREA (FILTERS & CARDS GRID)
      ========================================================== */}
      <div id="puja-list" className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-8 xl:px-10">
        {/* Filters Bar */}
        <PujaFilters
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedDeity={selectedDeity}
          setSelectedDeity={setSelectedDeity}
          selectedPurpose={selectedPurpose}
          setSelectedPurpose={setSelectedPurpose}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
        />

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-[13px] text-[#75695c]">
          <span>
            Showing <strong className="text-[#2b241d]">{filteredPujas.length}</strong> upcoming sacred rituals
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

        {/* Pujas Grid */}
        {filteredPujas.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
            {filteredPujas.map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#ead8b8] bg-[#fffdf9] p-12 text-center">
            <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
              No matching rituals found
            </h3>
            <p className="mt-2 text-[14px] text-[#75695c]">
              Try adjusting your filter criteria to discover more upcoming Vedic ceremonies.
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

export default PujaListing;
