import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";

const LOCATIONS = ["All Locations", "Kashi (Varanasi)", "Pitambara Peeth", "Dashashwamedh Ghat"];
const DEITIES = ["All Deities", "Lord Shiva", "Navagraha Devas", "Goddess Mahalakshmi", "Goddess Baglamukhi", "Maa Ganga"];
const PURPOSES = ["All Purposes", "Peace & Protection", "Spiritual Elevation", "Planetary & Career", "Wealth & Prosperity", "Protection"];
const SORT_OPTIONS = [
  { label: "Date: Upcoming First", value: "date-asc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const PujaFilters = ({
  selectedLocation,
  setSelectedLocation,
  selectedDeity,
  setSelectedDeity,
  selectedPurpose,
  setSelectedPurpose,
  selectedSort,
  setSelectedSort,
  activeFilterCount,
  onResetFilters,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);

  return (
    <div className="mb-10 space-y-4">
      {/* Desktop Filters (Horizontal Bar) */}
      <div className="hidden rounded-[22px] border border-[#ead8b8] bg-[#fffdf9] p-4 shadow-[0_6px_20px_rgba(80,60,30,0.04)] lg:block">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wider text-[#b36c1e]">
              <SlidersHorizontal size={14} />
              Filter By:
            </span>

            {/* Location Select */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-4 py-2 text-[13px] font-medium text-[#2b241d] outline-none transition focus:border-[#d4872b]"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Deity Select */}
            <select
              value={selectedDeity}
              onChange={(e) => setSelectedDeity(e.target.value)}
              className="rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-4 py-2 text-[13px] font-medium text-[#2b241d] outline-none transition focus:border-[#d4872b]"
            >
              {DEITIES.map((deity) => (
                <option key={deity} value={deity}>
                  {deity}
                </option>
              ))}
            </select>

            {/* Purpose Select */}
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-4 py-2 text-[13px] font-medium text-[#2b241d] outline-none transition focus:border-[#d4872b]"
            >
              {PURPOSES.map((pur) => (
                <option key={pur} value={pur}>
                  {pur}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#c77722] hover:underline"
              >
                <X size={13} />
                Reset Filters ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[12.5px] font-medium text-[#75695c]">
              <ArrowUpDown size={14} />
              Sort:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-3.5 py-2 text-[13px] font-semibold text-[#2b241d] outline-none transition focus:border-[#d4872b]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Controls Row: [ Filter ] [ Sort ] */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#d6b8a0] bg-[#fffdf9] py-3 text-[13px] font-bold text-[#2b241d] shadow-sm"
        >
          <SlidersHorizontal size={15} className="text-[#c77722]" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eab12c] text-[10px] font-bold text-[#1c1308]">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsMobileSortOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#d6b8a0] bg-[#fffdf9] py-3 text-[13px] font-bold text-[#2b241d] shadow-sm"
        >
          <ArrowUpDown size={15} className="text-[#c77722]" />
          <span>Sort</span>
        </button>
      </div>

      {/* Mobile Filter Modal / Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="w-full rounded-t-[28px] border-t border-[#ead8b8] bg-[#fffaf0] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-[#ead8b8] pb-4">
              <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                Filter Sacred Pujas
              </h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#f8edd8] text-[#2b241d]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 py-5 max-h-[60vh] overflow-y-auto">
              {/* Location */}
              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d]"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deity */}
              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  Deity
                </label>
                <select
                  value={selectedDeity}
                  onChange={(e) => setSelectedDeity(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d]"
                >
                  {DEITIES.map((deity) => (
                    <option key={deity} value={deity}>
                      {deity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-[11.5px] font-bold uppercase tracking-wider text-[#b36c1e]">
                  Purpose
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[14px] text-[#2b241d]"
                >
                  {PURPOSES.map((pur) => (
                    <option key={pur} value={pur}>
                      {pur}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#ead8b8]">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-1/3 rounded-full border border-[#d6b8a0] py-3 text-[13px] font-bold text-[#75695c]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-2/3 rounded-full bg-[#eab12c] py-3 text-[13px] font-bold text-[#1c1308] shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Modal */}
      {isMobileSortOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="w-full rounded-t-[28px] border-t border-[#ead8b8] bg-[#fffaf0] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-[#ead8b8] pb-4">
              <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                Sort By
              </h3>
              <button
                type="button"
                onClick={() => setIsMobileSortOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-[#f8edd8] text-[#2b241d]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 py-4">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelectedSort(opt.value);
                    setIsMobileSortOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl p-3.5 text-left text-[14px] font-medium transition ${
                    selectedSort === opt.value
                      ? "bg-[#f8edd8] font-bold text-[#c77722]"
                      : "text-[#2b241d] hover:bg-white"
                  }`}
                >
                  <span>{opt.label}</span>
                  {selectedSort === opt.value && <Check size={16} className="text-[#c77722]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PujaFilters;
