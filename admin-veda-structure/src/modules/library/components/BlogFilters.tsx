import { Search, X, SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Sparkles } from "lucide-react";
import { BLOG_CATEGORIES } from "../constants/blog.constants";

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSortChange: (field: string, order: "ASC" | "DESC") => void;
  viewMode?: "grid" | "table";
  onViewModeChange?: (mode: "grid" | "table") => void;
}

export default function BlogFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
  viewMode = "table",
  onViewModeChange,
}: BlogFiltersProps) {
  const isFiltered =
    Boolean(searchQuery) ||
    selectedCategory !== "All" ||
    selectedStatus !== "All";

  const handleResetFilters = () => {
    onSearchChange("");
    onCategoryChange("All");
    onStatusChange("All");
  };

  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Published", value: "Published" },
    { label: "Draft", value: "Draft" },
    { label: "Scheduled", value: "Scheduled" },
    { label: "Archived", value: "Archived" },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-cream-200/90 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top Search, Sort and Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar with clear icon */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by article title, excerpt, slug, or author..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-cream-50/50 border border-cream-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 transition-all placeholder:text-charcoal-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 p-0.5 rounded-md hover:bg-cream-100 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side controls: Status pills, Sort & View toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Pills */}
          <div className="flex items-center bg-cream-100/80 p-1 rounded-xl text-xs font-semibold border border-cream-200/60 overflow-x-auto">
            {statusOptions.map((st) => {
              const active = selectedStatus === st.value;
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => onStatusChange(st.value)}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs whitespace-nowrap ${
                    active
                      ? "bg-white text-saffron-700 shadow-2xs font-bold border border-cream-200/50"
                      : "text-charcoal-600 hover:text-charcoal-900"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 pointer-events-none" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split("-");
                onSortChange(f, o as "ASC" | "DESC");
              }}
              className="pl-8 pr-8 py-2 text-xs sm:text-sm font-medium border border-cream-200 rounded-xl bg-white text-charcoal-700 focus:ring-2 focus:ring-saffron-500/30 focus:border-saffron-500 transition shadow-2xs cursor-pointer appearance-none"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="createdAt-ASC">Oldest First</option>
              <option value="viewsCount-DESC">Most Viewed</option>
              <option value="title-ASC">Title: A to Z</option>
              <option value="title-DESC">Title: Z to A</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          {onViewModeChange && (
            <div className="flex items-center bg-cream-100/80 p-1 rounded-xl border border-cream-200/60 text-charcoal-600">
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                title="Table View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-white text-saffron-700 shadow-2xs font-bold"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Cards Grid View"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-white text-saffron-700 shadow-2xs font-bold"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Reset Filters CTA if active */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 text-xs font-semibold text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-dashed border-cream-300"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs Scroll Bar */}
      <div className="pt-2 border-t border-cream-100">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-saffron-500" />
            Categories:
          </span>

          <button
            type="button"
            onClick={() => onCategoryChange("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === "All"
                ? "bg-saffron-600 text-white shadow-xs font-bold"
                : "bg-cream-50 text-charcoal-600 hover:bg-cream-100 border border-cream-200/60"
            }`}
          >
            All Categories
          </button>

          {BLOG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                  isSelected
                    ? "bg-saffron-600 text-white shadow-xs font-bold"
                    : "bg-cream-50 text-charcoal-600 hover:bg-cream-100 border border-cream-200/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
