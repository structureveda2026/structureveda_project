import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import pathCatalogueService from "../services/pathCatalogueService";
import PathCategoryCard from "./PathCategoryCard";

/**
 * PathCategoryDiscovery Component
 * Dynamic category showcase consuming GET /api/path-categories via pathCatalogueService.
 * Renders dynamic active category cards for customer Vedic recitation & scripture exploration.
 * Supports limit prop for previews and standardized View All Path CTA button.
 */
const PathCategoryDiscovery = ({ limit, showViewAll = true }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    pathCatalogueService
      .getPathCategories(retryTrigger > 0)
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
          );
          setCategories(sorted);
          setError(null);
        }
        if (isMounted) setLoading(false);
      })
      .catch((err) => {
        console.error("Could not load Path categories:", err);
        if (isMounted) {
          setError(err?.message || "Failed to load Path categories");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [retryTrigger]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryTrigger((prev) => prev + 1);
  };

  const displayedCategories = limit ? categories.slice(0, limit) : categories;
  const hasMore = limit ? categories.length > limit : false;

  if (!loading && !error && categories.length === 0) {
    return null;
  }

  return (
    <section
      id="path-categories-showcase"
      aria-labelledby="path-categories-heading"
      className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-18 lg:px-12"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* ── Section Header ── */}
        <div className="mb-10 text-center lg:mb-12">
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} aria-hidden="true" className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Sacred Scripture Traditions
            </span>
          </div>

          <h2
            id="path-categories-heading"
            className="mt-3 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[34px] lg:text-[38px]"
          >
            Explore by <span className="text-[#c77722]">Path Category</span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-[640px] text-[14.5px] leading-relaxed text-[#5c4e3f]">
            Discover sacred Vedic recitations, scriptural Parayans, and Stotra paths arranged by tradition, scripture, and divine sankalpa.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-4 flex items-center justify-center gap-3 text-[#c77722]/70"
          >
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
          </div>
        </div>

        {/* ── Counter Bar / Status ── */}
        {!error && (
          <div className="mb-6 flex items-center justify-between text-[13px] text-[#75695c]">
            <span>
              Showing{" "}
              <strong className="font-bold text-[15px] text-[#2b241d]">
                {loading ? "..." : displayedCategories.length}
              </strong>{" "}
              {hasMore && (
                <>
                  of{" "}
                  <strong className="font-bold text-[15px] text-[#2b241d]">
                    {categories.length}
                  </strong>{" "}
                </>
              )}
              Sacred Path Categories
              {hasMore && (
                <span className="ml-2 font-medium text-[#8c7e6e]">
                  (Previewing first {limit})
                </span>
              )}
            </span>
          </div>
        )}

        {/* ── Error State with Retry ── */}
        {error && (
          <div className="mx-auto my-8 max-w-md rounded-2xl border border-[#e8d5be] bg-[#fffaf2] p-6 text-center">
            <p className="text-[14px] font-medium text-[#7a3b2e]">
              Unable to load Path categories at this moment.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#c77722] bg-white px-4 py-2 text-[13px] font-semibold text-[#b36c1e] shadow-2xs transition hover:bg-[#fff7ed] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
            >
              <RefreshCw size={14} aria-hidden="true" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* ── Categories Grid ── */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex flex-col overflow-hidden rounded-[20px] border border-[#e8d9bc] bg-[#fffdfa] animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-[#ebdcc4]/60" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-[#ebdcc4]/70" />
                  <div className="h-3.5 w-full rounded bg-[#ebdcc4]/40" />
                  <div className="h-3.5 w-4/5 rounded bg-[#ebdcc4]/40" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* categories.map dynamically renders active category cards */}
                {displayedCategories.map((cat) => (
                  <PathCategoryCard key={cat.id || cat.slug} category={cat} />
                ))}
              </div>

              {/* ── View All Path CTA (Shown when categories exceed limit) ── */}
              {showViewAll && hasMore && (
                <div className="mt-12 text-center border-t border-[#ebdcc4] pt-8">
                  <Link
                    to="/yagya-puja/path/all"
                    className="group inline-flex items-center gap-2 rounded-full border border-[#c77722] bg-[#fffdfa] px-8 py-3.5 text-[13.5px] font-bold text-[#b36c1e] shadow-2xs transition-all duration-200 hover:border-[#eab12c] hover:bg-[#eab12c] hover:text-[#1c1308] hover:shadow-[0_4px_14px_rgba(234,177,44,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                  >
                    <span>View All Path</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
};

export default PathCategoryDiscovery;
