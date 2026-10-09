import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import japaCatalogueService from "../../../services/japaCatalogueService";
import JapaCategoryCard from "./JapaCategoryCard";

/**
 * JapaCategoryDiscovery Component
 * Dynamic category showcase consuming GET /api/japa-categories via japaCatalogueService.
 * Renders dynamic active category cards for customer ritual exploration.
 * Supports limit prop for previews and standardized View All Japa CTA button.
 */
const JapaCategoryDiscovery = ({ limit, showViewAll = true }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    japaCatalogueService
      .getJapaCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          const sorted = [...data].sort(
            (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
          );
          setCategories(sorted);
        }
        if (isMounted) setLoading(false);
      })
      .catch((err) => {
        console.error("Could not load Japa categories:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedCategories = limit ? categories.slice(0, limit) : categories;
  const hasMore = limit ? categories.length > limit : false;

  if (!loading && categories.length === 0) {
    return null;
  }

  return (
    <section
      id="japa-categories-showcase"
      aria-labelledby="japa-categories-heading"
      className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-18 lg:px-12"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* ── Section Header ── */}
        <div className="mb-10 text-center lg:mb-12">
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Sacred Traditions
            </span>
          </div>

          <h2
            id="japa-categories-heading"
            className="mt-3 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[34px] lg:text-[38px]"
          >
            Explore by <span className="text-[#c77722]">Japa Category</span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-[640px] text-[14.5px] leading-relaxed text-[#5c4e3f]">
            Discover consecrated Vedic mantra japa recitations and anushthans arranged by deity tradition, sacred chandas, and Shastric purpose.
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

        {/* ── Counter Bar ── */}
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
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* categories.map dynamically renders active category cards */}
              {displayedCategories.map((cat) => (
                <JapaCategoryCard key={cat.id || cat.slug} category={cat} />
              ))}
            </div>

            {/* ── Standardized View All Japa CTA ── */}
            {showViewAll && (
              <div className="mt-12 text-center border-t border-[#ebdcc4] pt-8">
                <Link
                  to="/yagya-puja/japa"
                  onClick={() => {
                    const el = document.getElementById("japa-catalogue-heading");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-2 rounded-full border border-[#c77722] bg-[#fffdfa] px-8 py-3.5 text-[13.5px] font-bold text-[#b36c1e] shadow-2xs transition-all duration-200 hover:border-[#eab12c] hover:bg-[#eab12c] hover:text-[#1c1308] hover:shadow-[0_4px_14px_rgba(234,177,44,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                >
                  <span>View All Japa</span>
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

export default JapaCategoryDiscovery;
