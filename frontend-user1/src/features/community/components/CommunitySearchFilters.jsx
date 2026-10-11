import { Search, X, MapPin, Sparkles, ArrowUpDown, RotateCcw } from "lucide-react";
import {
  PROFESSIONAL_TYPES,
  EXPERTISE_CATEGORIES,
  REGIONS_LIST,
  SORT_OPTIONS,
} from "../data/communityMockData";

const CommunitySearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedExpertise,
  onExpertiseChange,
  selectedLocation,
  onLocationChange,
  sortBy,
  onSortChange,
  totalResults,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 sm:p-6 shadow-[0_4px_20px_rgba(43,36,29,0.04)] transition-all">
      {/* Top Bar: Search Input & Role Segmented Control */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#b35d14]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Pandit/Astrologer name, lineage, ritual, or holy city..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-[#dfcdb5] bg-[#fffdfa] text-sm text-[#2b241d] placeholder:text-[#9e8b78] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/30 focus:border-[#b35d14] transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c745e] hover:text-[#2b241d] p-1 rounded-full hover:bg-stone-100 transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#fbf6ec] border border-[#ebdcc2] overflow-x-auto no-scrollbar shrink-0">
          {PROFESSIONAL_TYPES.map((type) => {
            const isActive = selectedType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onTypeChange(type.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#9b4e10] text-white shadow-xs"
                    : "text-[#6b5542] hover:text-[#2b241d] hover:bg-white/60"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Row: Grouped Dropdowns (Expertise, Location, Sort) + Active Filter Indicator */}
      <div className="mt-4 pt-4 border-t border-[#f0e4cf] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Expertise Dropdown */}
          <div className="relative inline-flex items-center">
            <span className="absolute left-3 pointer-events-none text-[#b35d14]">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <select
              value={selectedExpertise}
              onChange={(e) => onExpertiseChange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl border border-[#dfcdb5] bg-[#fffdfa] hover:bg-white text-xs font-medium text-[#2b241d] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/20 focus:border-[#b35d14] cursor-pointer shadow-2xs transition"
            >
              <option value="All">All Expertise & Rituals</option>
              {EXPERTISE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="relative inline-flex items-center">
            <span className="absolute left-3 pointer-events-none text-[#b35d14]">
              <MapPin className="w-3.5 h-3.5" />
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl border border-[#dfcdb5] bg-[#fffdfa] hover:bg-white text-xs font-medium text-[#2b241d] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/20 focus:border-[#b35d14] cursor-pointer shadow-2xs transition"
            >
              <option value="All">All Sacred Locations</option>
              {REGIONS_LIST.filter((r) => r !== "All").map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-flex items-center">
            <span className="absolute left-3 pointer-events-none text-[#b35d14]">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-xl border border-[#dfcdb5] bg-[#fffdfa] hover:bg-white text-xs font-medium text-[#2b241d] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/20 focus:border-[#b35d14] cursor-pointer shadow-2xs transition"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter & Clear Action */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-[#6e5947] pt-2 md:pt-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fbf6ec] border border-[#ebdcc2]">
            <span className="font-semibold text-[#2b241d]">{totalResults}</span>
            <span>{totalResults === 1 ? "expert found" : "experts found"}</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9b4e10] hover:text-[#7a3b09] bg-[#fff8ed] hover:bg-[#faebd7] border border-[#d6be9a] transition shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySearchFilters;
