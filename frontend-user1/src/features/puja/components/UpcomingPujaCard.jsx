import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Status badge styling mapper adhering strictly to Veda Structure guidelines.
 * Uses reliable dark-tinted backing surfaces to guarantee high contrast
 * and legibility over diverse ceremony photography.
 */
const getStatusBadge = (status) => {
  switch (status) {
    case "Filling Fast":
      return {
        bg: "bg-[#241709]/92 border-amber-500/40 text-[#fcd34d]",
        dot: "bg-amber-400",
        label: "Filling Fast",
        isBookable: true,
      };
    case "Almost Full":
      return {
        bg: "bg-[#251014]/92 border-rose-500/40 text-[#fda4af]",
        dot: "bg-rose-400",
        label: "Almost Full",
        isBookable: true,
      };
    case "Booking Closed":
      return {
        bg: "bg-[#1c1917]/92 border-stone-600/40 text-[#d6d3d1]",
        dot: "bg-stone-400",
        label: "Booking Closed",
        isBookable: false,
      };
    case "Coming Soon":
      return {
        bg: "bg-[#1f190e]/92 border-[#d4a359]/40 text-[#f5d590]",
        dot: "bg-[#eab12c]",
        label: "Coming Soon",
        isBookable: false,
      };
    case "Booking Open":
    default:
      return {
        bg: "bg-[#111f15]/92 border-emerald-500/40 text-[#6ee7b7]",
        dot: "bg-emerald-400",
        label: "Booking Open",
        isBookable: true,
      };
  }
};

/**
 * Clean Upcoming Puja Event Card.
 * The entire card is a single accessible Link leading to /puja/:slug.
 * Displays strictly:
 * 1. Puja image
 * 2. High-contrast booking status
 * 3. Puja name
 * 4. Date
 * 5. Location
 * 6. Purpose
 * 7. Primary booking action affordance
 */
const UpcomingPujaCard = ({ puja }) => {
  if (!puja) return null;

  const statusConfig = getStatusBadge(puja.bookingStatus);

  return (
    <Link
      to={`/puja/${puja.slug}`}
      aria-label={`View details and book Sankalp for ${puja.name}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#ebdcc4] bg-[#fffdfa] text-inherit no-underline shadow-[0_8px_24px_rgba(43,36,29,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4872b] hover:shadow-[0_16px_36px_rgba(212,135,43,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] focus-visible:ring-offset-2"
    >
      {/* =========================================================
          1. TOP IMAGE AREA & 2. BOOKING STATUS
      ========================================================== */}
      <div className="relative h-[220px] w-full overflow-hidden bg-[#241a12]">
        <img
          src={puja.image}
          alt={puja.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Soft dark vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

        {/* Dynamic High-Contrast Booking Status Badge */}
        <div className="absolute left-4 top-4 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${statusConfig.bg}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusConfig.dot} ${statusConfig.isBookable ? "animate-pulse" : ""}`}
              aria-hidden="true"
            />
            <span>{statusConfig.label}</span>
          </span>
        </div>
      </div>

      {/* =========================================================
          CARD CONTENT BODY (DATE, LOCATION, NAME, PURPOSE)
      ========================================================== */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          {/* 4. Date & 5. Location */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-[#75695c]">
            <div className="inline-flex items-center gap-1.5 font-semibold text-[#b36c1e]">
              <Calendar size={13} className="text-[#c77722] shrink-0" />
              <span>{puja.formattedDate}</span>
            </div>
            <span className="text-[#d9c9b4]" aria-hidden="true">•</span>
            <div className="inline-flex items-center gap-1 text-[#5c4e3f]">
              <MapPin size={12} className="text-[#c77722] shrink-0" />
              <span className="truncate max-w-[180px]">{puja.location}</span>
            </div>
          </div>

          {/* 3. Puja / Event Name */}
          <h3 className="font-serif text-[20px] font-bold leading-snug text-[#2b241d] transition-colors duration-200 group-hover:text-[#c77722] line-clamp-2">
            {puja.name}
          </h3>

          {/* 6. Purpose */}
          <p className="text-[13px] font-medium text-[#685c4f] line-clamp-1">
            {puja.purpose}
          </p>
        </div>

        {/* =========================================================
            7. PRIMARY ACTION CTA AFFORDANCE (PARENT LINK HANDLES CLICK)
        ========================================================== */}
        <div className="mt-6 border-t border-[#f0e2cd] pt-4">
          {statusConfig.isBookable ? (
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#eab12c] py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition-all duration-200 group-hover:bg-[#dda018] group-hover:shadow-[0_6px_20px_rgba(234,177,44,0.35)]">
              <span>Book Your Sankalp</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          ) : puja.bookingStatus === "Coming Soon" ? (
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#c77722] bg-[#fffdfa] py-3 text-[13.5px] font-bold text-[#9d5b12] shadow-2xs transition-colors duration-200 group-hover:bg-[#fbf4e8]">
              <span>View Details</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          ) : (
            <span className="inline-flex w-full items-center justify-center rounded-full bg-stone-200 py-3 text-[13.5px] font-bold text-stone-500">
              Booking Closed
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default UpcomingPujaCard;

