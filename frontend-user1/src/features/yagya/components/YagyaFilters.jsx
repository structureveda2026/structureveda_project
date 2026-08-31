import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import { YAGYA_CATEGORIES } from "../data/yagyaData";

const YagyaFilters = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedSort,
  setSelectedSort,
  activeFilterCount,
  onResetFilters,
}) => {
  return (
    <div id="yagya-filters" className="mb-8 space-y-4">
      {/* Search & Top Controls */}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7e6c]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Yagya (e.g. Mrityunjaya, Navagraha, Lakshmi)..."
            className="w-full rounded-full border border-[#ead8b8] bg-[#fffdf9] py-2.5 pl-10 pr-9 text-[13.5px] text-[#2b241d] placeholder:text-[#8c7e6c] shadow-2xs outline-none transition focus:border-[#d4872b] focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7e6c] hover:text-[#2b241d]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdf9] px-3.5 py-2 text-[12.5px] font-semibold text-[#4a3d31] shadow-2xs">
            <ArrowUpDown size={14} className="text-[#d4872b]" />
            <span>Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent font-bold text-[#2b241d] outline-none cursor-pointer"
            >
              <option value="featured">Featured / Most Revered</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="price-asc">Participation: Low to High</option>
              <option value="price-desc">Participation: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar (Horizontal scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {YAGYA_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-bold transition-all ${
                isSelected
                  ? "bg-[#2b241d] text-[#fbf4e8] shadow-sm"
                  : "border border-[#ead8b8] bg-[#fffdf9] text-[#5e5143] hover:border-[#d4872b] hover:bg-[#fffaf0] hover:text-[#2b241d]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default YagyaFilters;
