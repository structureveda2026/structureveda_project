import React from "react";
import { Search, X, ArrowUpDown, LayoutGrid, List, Sparkles } from "lucide-react";
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
    <div className="bg-white rounded-xl border border-cream-200/90 shadow-2xs p-2.5 sm:p-3 space-y-2">
      {/* Search, Status, Sort & View Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by article title, excerpt, slug, or author..."
            className="w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm bg-cream-50/40 border border-cream-200 rounded-lg focus:bg-white focus:ring-1.5 focus:ring-saffron-500/30 focus:border-saffron-500 transition-all placeholder:text-charcoal-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 p-0.5 rounded hover:bg-cream-100 transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center bg-cream-100/70 p-0.5 rounded-lg text-xs font-medium border border-cream-200/50">
            {statusOptions.map((st) => {
              const active = selectedStatus === st.value;
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => onStatusChange(st.value)}
                  className={`px-2 py-1 rounded-md transition-all text-xs whitespace-nowrap ${
                    active
                      ? "bg-white text-saffron-700 shadow-2xs font-bold"
                      : "text-charcoal-600 hover:text-charcoal-900"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <ArrowUpDown className="w-3 h-3 text-charcoal-400 absolute left-2.5 pointer-events-none" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split("-");
                onSortChange(f, o as "ASC" | "DESC");
              }}
              className="pl-7 pr-6 py-1 text-xs font-medium border border-cream-200 rounded-lg bg-white text-charcoal-700 focus:ring-1.5 focus:ring-saffron-500/30 focus:border-saffron-500 transition shadow-2xs cursor-pointer appearance-none"
            >
              <option value="createdAt-DESC">Newest First</option>
              <option value="createdAt-ASC">Oldest First</option>
              <option value="viewsCount-DESC">Most Viewed</option>
              <option value="title-ASC">Title: A-Z</option>
              <option value="title-DESC">Title: Z-A</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex items-center bg-cream-100/70 p-0.5 rounded-lg border border-cream-200/50 text-charcoal-600">
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                title="Table View"
                className={`p-1 rounded-md transition ${
                  viewMode === "table"
                    ? "bg-white text-saffron-700 shadow-2xs font-bold"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Cards Grid View"
                className={`p-1 rounded-md transition ${
                  viewMode === "grid"
                    ? "bg-white text-saffron-700 shadow-2xs font-bold"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reset Filters */}
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2 py-1 text-xs font-medium text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-md transition border border-dashed border-cream-300"
              title="Reset filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="pt-1.5 border-t border-cream-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-saffron-500" />
          Categories:
        </span>

        <button
          type="button"
          onClick={() => onCategoryChange("All")}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
            selectedCategory === "All"
              ? "bg-saffron-600 text-white shadow-2xs font-bold"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                isSelected
                  ? "bg-saffron-600 text-white shadow-2xs font-bold"
                  : "bg-cream-50 text-charcoal-600 hover:bg-cream-100 border border-cream-200/60"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
