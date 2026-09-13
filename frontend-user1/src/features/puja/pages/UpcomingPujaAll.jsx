import { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ChevronRight, ArrowLeft } from "lucide-react";
import { PUJA_LIST } from "../data/pujaData";
import UpcomingPujaCard from "../components/UpcomingPujaCard";
import heroBgImg from "../../../assets/images/upcoming_puja_hero.jpg";

/**
 * All Upcoming Pujas Dedicated Page (/puja/upcoming/all)
 * Displays an image-led horizontal hero banner and the complete chronological
 * directory of all scheduled Vedic ceremonies.
 */
const UpcomingPujaAll = () => {
  // Always scroll to top when opening this dedicated page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Chronologically sort all upcoming pujas strictly by startDateTime (with fallback to date)
  const allUpcomingPujas = useMemo(() => {
    return [...PUJA_LIST].sort((a, b) => {
      const timeA = a.startDateTime ? new Date(a.startDateTime).getTime() : new Date(a.date).getTime();
      const timeB = b.startDateTime ? new Date(b.startDateTime).getTime() : new Date(b.date).getTime();
      return timeA - timeB;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24 text-[#2b241d]">
      <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 xl:px-10">
        
        {/* ── Breadcrumb Navigation (Positioned Above Hero) ── */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-[#7d6f5f]">
          <Link to="/" className="transition-colors hover:text-[#2b241d]">
            Home
          </Link>
          <ChevronRight size={12} className="text-[#bba891]" />
          <Link to="/puja/upcoming" className="transition-colors hover:text-[#2b241d]">
            Upcoming Puja
          </Link>
          <ChevronRight size={12} className="text-[#bba891]" />
          <span className="font-semibold text-[#b36c1e]">All Upcoming Ceremonies</span>
        </nav>

        {/* ── Image-Led Hero Banner ── */}
        <header
          className="group relative mb-10 min-h-[300px] sm:min-h-[320px] lg:min-h-[340px] overflow-hidden rounded-[24px] sm:rounded-[28px] border border-[#ebdcc4]/40 bg-[#1c1209] shadow-[0_8px_30px_rgba(20,12,6,0.12)]"
        >
          {/* Authentic Background Ritual Imagery */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroBgImg}
              alt="Sacred Vedic ritual ceremony in Kashi"
              className="h-full w-full object-cover object-[72%_center] transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
              loading="eager"
            />
            {/* Scrim Overlay: Deep warm dark brown on left for text contrast, revealing ritual scene on the right */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#180e06]/95 via-[#1a1007]/85 to-[#1a1007]/40 sm:to-transparent sm:to-75%"
            />
            {/* Subtle bottom vignette */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#140c06]/60 to-transparent"
            />
          </div>

          {/* Hero Foreground Content */}
          <div className="relative z-10 flex min-h-[300px] sm:min-h-[320px] lg:min-h-[340px] flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12">
            
            {/* Top Row: Eyebrow + Secondary Back Action */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5ce6f]">
                <Sparkles size={12} className="text-[#eab12c]" />
                <span>UPCOMING CEREMONIES</span>
              </div>

              <Link
                to="/puja/upcoming"
                aria-label="Back to Upcoming Puja page"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-[12px] font-medium text-[#eedcc5] backdrop-blur-[4px] transition-all duration-200 hover:border-[#eab12c] hover:bg-black/40 hover:text-white"
              >
                <ArrowLeft size={13} />
                <span>Back to Upcoming Puja</span>
              </Link>
            </div>

            {/* Middle: Editorial Title & Subtext (Left-Aligned) */}
            <div className="my-auto py-4 max-w-[660px] space-y-2">
              <h1 className="font-serif text-[28px] font-bold leading-tight text-[#faf4e8] sm:text-[34px] lg:text-[38px] tracking-tight">
                All Upcoming Pujas
              </h1>
              <p className="text-[14px] leading-relaxed text-[#eedcc5]/90 sm:text-[15px]">
                Explore all scheduled Vedic ceremonies and reserve your Sankalp.
              </p>
            </div>

            {/* Bottom: Dynamic Ceremony Count Metadata */}
            <div className="flex items-center gap-2 text-[12.5px] font-semibold text-[#f5ce6f]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#eab12c]" />
              <span>{allUpcomingPujas.length} Scheduled Ceremonies</span>
            </div>

          </div>
        </header>

        {/* ── All Upcoming Ceremonies Grid (Desktop: 3-col, Tablet: 2-col, Mobile: 1-col) ── */}
        {allUpcomingPujas.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
            {allUpcomingPujas.map((puja) => (
              <UpcomingPujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#ebdcc4] bg-[#fffdfa] p-12 text-center shadow-xs">
            <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
              No upcoming ceremonies currently scheduled
            </h3>
            <p className="mt-2 text-[14px] text-[#75695c]">
              Please check back soon for newly consecrated Vedic rituals.
            </p>
            <Link
              to="/puja/upcoming"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.3)] transition-all hover:bg-[#dda018]"
            >
              Return to Upcoming Puja
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingPujaAll;
