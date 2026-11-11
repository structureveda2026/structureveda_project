import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import homaCatalogueService from "../../../services/homaCatalogueService";
import HomaCategoryCard from "./HomaCategoryCard";

/**
 * HomaCategoryDiscovery Component
 * Dynamic category showcase consuming GET /api/homa-categories via homaCatalogueService.
 * Follows the Category-First discovery model (max 6 cards).
 * Navigates to /yagya-puja/homa/category/:categorySlug.
 */
const HomaCategoryDiscovery = ({ limit = 6, showViewAll = true }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    homaCatalogueService
      .getHomaCategories()
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
        console.error("Could not load Homa categories:", err);
        if (isMounted) {
          setError(err?.message || "Failed to load Homa categories");
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
      id="homa-categories-showcase"
      aria-labelledby="homa-categories-heading"
      className="relative border-b border-[#EAD8B8] bg-[#FFFDF9] px-5 py-14 sm:px-8 sm:py-18 lg:px-12"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* ── Section Header ── */}
        <div className="mb-10 text-center lg:mb-12">
          <div className="inline-flex items-center gap-2 border-b border-[#B7791F]/40 pb-1.5">
            <Sparkles size={11} className="text-[#B7791F]" />
            <span className="font-sans text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#B7791F]">
              Sacred Traditions
            </span>
          </div>

          <h2
            id="homa-categories-heading"
            className="mt-3 font-serif text-[28px] font-semibold text-[#29231B] sm:text-[34px] lg:text-[38px]"
          >
            Explore by <span className="text-[#B7791F]">Homa Category</span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-[640px] text-[14.5px] leading-relaxed text-[#766D60]">
            Discover consecrated Vedic Homa fire rituals arranged by deity tradition, sacred mantras, and Shastric fire sacrament.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-4 flex items-center justify-center gap-3 text-[#B7791F]/60"
          >
            <span className="h-px w-10 bg-[#EAD8B8] sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#EAD8B8] sm:w-14" />
          </div>
        </div>

        {/* ── Counter Bar / Status ── */}
        {!error && !loading && (
          <div className="mb-6 flex items-center justify-between text-[13px] text-[#766D60]">
            <span>
              Showing{" "}
              <strong className="font-bold text-[14px] text-[#29231B]">
                {displayedCategories.length}
              </strong>{" "}
              {hasMore && (
                <>
                  of{" "}
                  <strong className="font-bold text-[14px] text-[#29231B]">
                    {categories.length}
                  </strong>{" "}
                </>
              )}
              Homa Categories
              {hasMore && (
                <span className="ml-2 font-medium text-[#A39682]">
                  (Previewing first {limit})
                </span>
              )}
            </span>
          </div>
        )}

        {/* ── Error State with Retry ── */}
        {error && (
          <div className="mx-auto my-8 max-w-md rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-6 text-center">
            <p className="text-[14px] font-medium text-[#8A3A2B]">
              Unable to load Homa categories at this moment.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#B7791F] bg-white px-4 py-2 text-[13px] font-semibold text-[#B7791F] shadow-2xs transition hover:bg-[#FFFAF0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7791F] cursor-pointer"
            >
              <RefreshCw size={14} />
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
                className="flex flex-col overflow-hidden rounded-[20px] border border-[#EAD8B8] bg-[#FFFDF9] animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-[#F4EBDC]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-[#EAD8B8]/70" />
                  <div className="h-3.5 w-full rounded bg-[#EAD8B8]/40" />
                  <div className="h-3.5 w-4/5 rounded bg-[#EAD8B8]/40" />
                </div>
              </div>
            ))}
          </div>
        ) : !error && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedCategories.map((cat) => (
                <HomaCategoryCard key={cat.id || cat.slug} category={cat} />
              ))}
            </div>

            {/* ── View All Categories CTA ── */}
            {showViewAll && (
              <div className="mt-12 text-center border-t border-[#EAD8B8] pt-8">
                <Link
                  to="/yagya-puja/homa/all"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#B7791F] bg-[#FFFDF9] px-8 py-3.5 text-[13.5px] font-bold text-[#B7791F] shadow-2xs transition-all duration-200 hover:border-[#B7791F] hover:bg-[#B7791F] hover:text-white hover:shadow-[0_4px_14px_rgba(183,121,31,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7791F]"
                >
                  <span>View All Homa Categories</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default HomaCategoryDiscovery;
