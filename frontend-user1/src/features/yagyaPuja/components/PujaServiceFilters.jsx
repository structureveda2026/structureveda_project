import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, X, Search, Check, Filter } from "lucide-react";

export const PURPOSES = [
  "All Purposes",
  "Health & Wellbeing",
  "Marriage & Relationships",
  "Prosperity & Wealth",
  "Career & Success",
  "Protection & Peace",
  "Family & Home",
  "ग्रह / ज्योतिष आधारित",
];

export const DURATIONS = [
  "All Durations",
  "2 Hours",
  "3 Hours",
  "5 Hours",
];

export const SORT_OPTIONS = [
  { label: "Featured First", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];


const PujaServiceFilters = ({
  selectedPurpose,
  setSelectedPurpose,
  selectedDuration,
  setSelectedDuration,
  isFeaturedOnly,
  setIsFeaturedOnly,
  searchQuery,
  setSearchQuery,
  selectedSort,
  setSelectedSort,
  activeFilterCount,
  onResetFilters,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <div className="mb-10 space-y-4">
      {/* Search and Quick Filters Row */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-[420px]">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7c6b]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by deity, tradition, or purpose..."
            className="h-[44px] w-full rounded-full border border-[#e5d8c0] bg-white pl-11 pr-4 text-[13.5px] text-[#2b241d] shadow-2xs outline-none transition placeholder:text-[#a89d91] hover:border-[#c77722]/50 focus:border-[#c77722] focus:ring-2 focus:ring-[#c77722]/10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7c6b] hover:text-[#2b241d]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Featured Pill Button */}
          <button
            type="button"
            onClick={() => setIsFeaturedOnly(!isFeaturedOnly)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all ${
              isFeaturedOnly
                ? "border-[#c77722] bg-[#eab12c] text-[#1c1308] shadow-xs"
                : "border-[#e5d8c0] bg-white text-[#5c4f42] hover:border-[#c77722]"
            }`}
          >
            {isFeaturedOnly && <Check size={13} />}
            <span>Featured Services</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-full border border-[#e5d8c0] bg-white px-3.5 py-1.5 shadow-2xs">
            <ArrowUpDown size={14} className="text-[#8a7c6b]" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent text-[12.5px] font-medium text-[#2b241d] outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-full border border-[#e5d8c0] bg-white px-4 py-2 text-[13px] font-semibold text-[#2b241d] shadow-2xs hover:border-[#c77722] lg:hidden"
          >
            <Filter size={14} className="text-[#c77722]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eab12c] text-[10.5px] font-bold text-[#1c1308]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Detailed Filters */}
      <div className="hidden rounded-[22px] border border-[#ead8b8] bg-[#fffdf9] p-4 shadow-[0_4px_16px_rgba(80,60,30,0.04)] lg:block">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#b36c1e]">
              <SlidersHorizontal size={14} />
              Filter By:
            </span>

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

            {/* Duration Select */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="rounded-full border border-[#d6b8a0] bg-[#fffaf0] px-4 py-2 text-[13px] font-medium text-[#2b241d] outline-none transition focus:border-[#d4872b]"
            >
              {DURATIONS.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Link */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#c77722] hover:underline"
            >
              <X size={13} />
              Reset All Filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="ml-auto flex h-full w-full max-w-[340px] flex-col bg-[#fffaf0] p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-[#ebdcc4] pb-4">
              <h3 className="font-serif text-[18px] font-bold text-[#2b241d]">
                Filter Puja Services
              </h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-full p-1.5 text-[#5c4f42] hover:bg-[#f4e8d1]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto py-5">
              <div>
                <label className="mb-1.5 block text-[12px] font-bold uppercase text-[#b36c1e]">
                  Purpose & Intention
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => setSelectedPurpose(e.target.value)}
                  className="w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none"
                >
                  {PURPOSES.map((pur) => (
                    <option key={pur} value={pur}>
                      {pur}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-bold uppercase text-[#b36c1e]">
                  Duration
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full rounded-xl border border-[#d6b8a0] bg-white p-3 text-[13.5px] text-[#2b241d] outline-none"
                >
                  {DURATIONS.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 rounded-xl border border-[#ebdcc4] bg-white p-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeaturedOnly}
                    onChange={(e) => setIsFeaturedOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-[#d6b8a0] text-[#c77722] focus:ring-[#c77722]"
                  />
                  <span className="text-[13.5px] font-medium text-[#2b241d]">
                    Show Featured Services Only
                  </span>
                </label>
              </div>
            </div>

            <div className="border-t border-[#ebdcc4] pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 rounded-full border border-[#d6b8a0] py-3 text-[13px] font-semibold text-[#2b241d]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 rounded-full bg-[#eab12c] py-3 text-[13px] font-bold text-[#1c1308]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PujaServiceFilters;
