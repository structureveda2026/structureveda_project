import { Search } from "lucide-react";
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
}: BlogFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by article title, content excerpt, or author..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-cream-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm border border-cream-200 rounded-xl bg-white text-charcoal-700 focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="flex items-center bg-cream-100 p-1 rounded-xl text-xs font-medium">
            {["All", "Published", "Draft", "Archived"].map((st) => (
              <button
                key={st}
                onClick={() => onStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedStatus === st
                    ? "bg-white text-saffron-700 shadow-xs font-semibold"
                    : "text-charcoal-500 hover:text-charcoal-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [f, o] = e.target.value.split("-");
              onSortChange(f, o as "ASC" | "DESC");
            }}
            className="px-3 py-2 text-xs sm:text-sm border border-cream-200 rounded-xl bg-white text-charcoal-700 focus:ring-2 focus:ring-saffron-500 focus:outline-hidden"
          >
            <option value="createdAt-DESC">Newest First</option>
            <option value="createdAt-ASC">Oldest First</option>
            <option value="viewsCount-DESC">Most Viewed</option>
            <option value="title-ASC">Title A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
