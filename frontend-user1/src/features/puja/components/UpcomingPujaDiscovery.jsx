import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

/**
 * Category navigation destinations according to manager specification:
 * Clicking any category navigates directly to that category's landing page.
 * "All" remains on /puja/upcoming and resets filters.
 */
const CATEGORY_NAV_ITEMS = [
  { label: "All", path: "/puja/upcoming", isAll: true },
  { label: "Puja", path: "/yagya-puja/puja", isAll: false },
  { label: "Yagya", path: "/yagya-puja/yagya", isAll: false },
  { label: "Homa / Havan", path: "/yagya-puja/homa", isAll: false },
  { label: "Japa / Path", path: "/yagya-puja/japa", isAll: false },
  { label: "Special Kashi Puja", path: "/yagya-puja/kashi", isAll: false },
];

const PURPOSES = [
  "All",
  "Protection",
  "Health",
  "Prosperity",
  "Marriage",
  "Peace",
  "Spiritual Growth",
  "Family",
];

const UpcomingPujaDiscovery = ({
  selectedPurpose,
  onSelectPurpose,
  onResetFilters,
  totalResults,
}) => {
  const isFilterActive = selectedPurpose !== "All";

  return (
    <section aria-label="Upcoming Puja Discovery & Filters" className="mb-10 space-y-6">
      
      {/* ── Section Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            Discovery & Filtering
          </span>
          <h2 className="font-serif text-[26px] font-bold text-[#2b241d] sm:text-[30px]">
            Upcoming Puja
          </h2>
        </div>

        {/* Clear Filters Button (Active when in-page purpose filter is set) */}
        {isFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#ebdcc4] bg-[#fffdfa] px-3.5 py-1.5 text-[12px] font-semibold text-[#c77722] shadow-2xs transition-colors hover:border-[#c77722] hover:bg-[#fffaf0] sm:self-auto"
          >
            <X size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* ── Discovery & Filters Container ── */}
      <div className="rounded-[24px] border border-[#ebdcc4] bg-[#fffdfa] p-5 shadow-[0_6px_22px_rgba(43,36,29,0.04)] sm:p-6 space-y-5">
        
        {/* =========================================================
            1. CATEGORY NAVIGATION BAR (Direct Links to Category Pages)
        ========================================================== */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#75695c]">
              Category
            </span>
          </div>

          {/* Horizontally scrollable navigation pills on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_NAV_ITEMS.map((cat) => {
              if (cat.isAll) {
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={onResetFilters}
                    aria-current="page"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eab12c] px-4 py-2 text-[13px] font-bold text-[#1c1308] shadow-[0_3px_12px_rgba(234,177,44,0.3)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={cat.label}
                  to={cat.path}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#ebdcc4] bg-[#fffaf0] px-4 py-2 text-[13px] font-semibold text-[#5c4e3f] transition-all duration-200 hover:border-[#c77722] hover:bg-[#fffdfa] hover:text-[#2b241d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                >
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            2. PURPOSE IN-PAGE FILTER ROW
        ========================================================== */}
        <div className="border-t border-[#f0e2cd]/80 pt-4">
          <div className="mb-2.5 flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#75695c]">
            <Sparkles size={13} className="text-[#c77722]" />
            <span>Filter by Purpose</span>
          </div>

          {/* Horizontally scrollable filter pills on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {PURPOSES.map((purpose) => {
              const isSelected = selectedPurpose === purpose;
              return (
                <button
                  key={purpose}
                  type="button"
                  onClick={() => onSelectPurpose(purpose)}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4872b] ${
                    isSelected
                      ? "bg-[#2b241d] text-[#f5ce6f] shadow-xs"
                      : "border border-[#ebdcc4] bg-[#fffaf0] text-[#685c4f] hover:border-[#c77722] hover:bg-[#fffdfa] hover:text-[#2b241d]"
                  }`}
                >
                  <span>{purpose}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Active Filters Summary Bar ── */}
      <div className="flex items-center justify-between text-[13px] text-[#75695c]">
        <div>
          Showing <strong className="text-[#2b241d]">{totalResults}</strong> upcoming sacred ceremonies
          {selectedPurpose !== "All" && (
            <span className="ml-1 text-[#b36c1e] font-semibold">for {selectedPurpose}</span>
          )}
        </div>
        {isFilterActive && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[12px] font-semibold text-[#c77722] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

    </section>
  );
};

export default UpcomingPujaDiscovery;
