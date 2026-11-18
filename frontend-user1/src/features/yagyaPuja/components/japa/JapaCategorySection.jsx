import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import JapaCategoryCard from "../JapaCategoryCard";

/**
 * JapaCategorySection Component (Category Discovery Section)
 * Dedicated category showcase following the Yagya Category Discovery pattern:
 * - Preview of configured number of categories (default 6 of 7)
 * - 3-column responsive grid of JapaCategoryCards
 * - Counter bar displaying preview count
 * - View All Japa Categories CTA linking to the full categories directory (/yagya-puja/japa/categories)
 */
const JapaCategorySection = ({
  categories = [],
  loading = false,
  limit = 6,
  showViewAll = true,
}) => {
  const displayedCategories = limit ? categories.slice(0, limit) : categories;
  const hasMore = limit ? categories.length > limit : false;

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section
      id="japa-categories-showcase"
      className="relative border-b border-[#ead8bc] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-18 lg:px-12"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* ── Section Header ── */}
        <div className="mb-10 text-center lg:mb-12">
          <div className="inline-flex items-center gap-2 border-b border-[#b77920]/40 pb-1.5">
            <Sparkles size={11} className="text-[#b77920]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#8a561c]">
              Sacred Traditions
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[28px] font-bold text-[#30251c] sm:text-[34px] lg:text-[38px]">
            Explore by <span className="text-[#b77920]">Japa Category</span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-[640px] text-[14.5px] leading-relaxed text-[#5c4d3c]">
            Discover consecrated Mantra Japa traditions arranged by deity, spiritual intention, and Shastric purpose.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-4 flex items-center justify-center gap-3 text-[#b77920]/70"
          >
            <span className="h-px w-10 bg-[#b77920]/35 sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#b77920]/35 sm:w-14" />
          </div>
        </div>

        {/* ── Counter Bar ── */}
        <div className="mb-6 flex items-center justify-between text-[13px] text-[#75695c]">
          <span>
            Showing{" "}
            <strong className="font-bold text-[15px] text-[#30251c]">
              {loading ? "..." : displayedCategories.length}
            </strong>{" "}
            {hasMore && (
              <>
                of{" "}
                <strong className="font-bold text-[15px] text-[#30251c]">
                  {categories.length}
                </strong>{" "}
              </>
            )}
            Consecrated Japa Categories
            {hasMore && (
              <span className="ml-2 font-medium text-[#8c7e6e]">
                (Previewing first {limit})
              </span>
            )}
          </span>
        </div>

        {/* ── Categories Grid ── */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex flex-col overflow-hidden rounded-[20px] border border-[#ead8bc] bg-[#fffdfa] animate-pulse"
              >
                <div className="w-full aspect-[16/10] bg-[#ead8bc]/50" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-[#ead8bc]/70" />
                  <div className="h-3.5 w-full rounded bg-[#ead8bc]/40" />
                  <div className="h-3.5 w-4/5 rounded bg-[#ead8bc]/40" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedCategories.map((cat) => (
                <JapaCategoryCard key={cat.id || cat.slug} category={cat} />
              ))}
            </div>

            {/* ── View All Japa Categories CTA (Shown when categories exceed limit) ── */}
            {showViewAll && hasMore && (
              <div className="mt-12 text-center border-t border-[#ead8bc] pt-8">
                <Link
                  to="/yagya-puja/japa/categories"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#b77920] bg-[#fffdfa] px-8 py-3.5 text-[13.5px] font-bold text-[#8a561c] shadow-xs transition-all duration-200 hover:border-[#b77920] hover:bg-[#b77920] hover:text-white hover:shadow-[0_4px_16px_rgba(183,121,32,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b77920]"
                >
                  <span>View All Japa Categories</span>
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

export default JapaCategorySection;

