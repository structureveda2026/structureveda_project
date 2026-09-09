import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { getFeaturedUpcomingPuja } from "../data/pujaData";

const BENEFITS = [
  "Traditional Vedic Vidhi",
  "Experienced Acharyas",
  "Sankalp in your Name",
  "Puja Prasad",
  "Digital Confirmation",
];

const FeaturedUpcomingPuja = ({ excludeId = null }) => {
  // Dynamically resolve the flagship or earliest upcoming featured ceremony
  const event = getFeaturedUpcomingPuja(excludeId);

  // Return nothing if no suitable featured event is scheduled
  if (!event) return null;

  const isBookable =
    event.bookingStatus !== "Booking Closed" && event.bookingStatus !== "Coming Soon";

  return (
    <section
      id="featured-puja"
      aria-label="Featured Upcoming Puja"
      className="mt-14 mb-8 sm:mt-16 sm:mb-12"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-[#ebdcc4] bg-[#fbf5e8] p-6 shadow-[0_12px_40px_rgba(43,36,29,0.06)] sm:p-8 lg:p-12">
        
        {/* Soft Ambient Golden Atmospheric Glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#eab12c]/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[#d4872b]/10 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-14">
          
          {/* =========================================================
              LEFT COLUMN: LARGE AUTHENTIC RITUAL PHOTOGRAPH (5 cols)
          ========================================================== */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto overflow-hidden rounded-[24px] border border-[#ebdcc4] bg-[#241a12] shadow-[0_16px_36px_rgba(43,36,29,0.12)]">
              <img
                src={event.image}
                alt={event.name}
                className="h-[300px] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03] sm:h-[380px] lg:h-[440px]"
                loading="lazy"
              />
              {/* Subtle edge vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a120b]/75 via-transparent to-black/20" />

              {/* Top Floating Badge */}
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-bold text-[#f5ce6f] shadow-xs backdrop-blur-md">
                  <Flame size={12} className="text-[#eab12c]" />
                  <span>{event.occasion || "Flagship Ceremony"}</span>
                </span>
              </div>

              {/* Bottom Location Pill */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[12px] font-medium text-[#f5eedf] backdrop-blur-md">
                  <MapPin size={13} className="text-[#eab12c] shrink-0" />
                  <span className="truncate">{event.temple || event.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: EDITORIAL CONTENT, BENEFITS & CTA (7 cols)
          ========================================================== */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ebdcc4] bg-[#fffdfa] px-3.5 py-1.5 shadow-2xs">
              <Sparkles size={12} className="text-[#c77722]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#b36c1e] sm:text-[11px]">
                FEATURED PUJA
              </span>
            </div>

            {/* 2. Event Title */}
            <div>
              <h3 className="font-serif text-[28px] font-bold leading-[1.18] text-[#2b241d] sm:text-[34px] lg:text-[38px]">
                {event.name}
              </h3>
              <p className="mt-1.5 font-serif text-[17px] font-medium text-[#c77722] sm:text-[19px]">
                A Sacred Offering in Kashi
              </p>
            </div>

            {/* 3. Supporting Tagline / Description */}
            <p className="max-w-[620px] text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15px]">
              {event.description || event.tagline}
            </p>

            {/* 4. Metadata: Date, Location, Purpose */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-[13px] font-medium text-[#6b5d4e]">
              <div className="inline-flex items-center gap-1.5 font-semibold text-[#b36c1e]">
                <Calendar size={14} className="text-[#c77722]" />
                <span>{event.formattedDate}</span>
              </div>
              <span className="text-[#d9c9b4]">•</span>
              <div className="inline-flex items-center gap-1.5">
                <MapPin size={14} className="text-[#c77722]" />
                <span>{event.location}</span>
              </div>
              <span className="text-[#d9c9b4]">•</span>
              <div className="inline-flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#d4872b]" />
                <span>{event.purpose}</span>
              </div>
            </div>

            {/* 5. Benefits List (5 Pillars) */}
            <div className="border-t border-[#ebdcc4] pt-5">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a7a68] mb-3">
                Ceremony Highlights
              </span>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="inline-flex items-center gap-2 text-[13px] font-medium text-[#423629]">
                    <CheckCircle2 size={15} className="text-[#c77722] shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Pricing & Action CTA */}
            <div className="flex flex-col gap-4 border-t border-[#ebdcc4] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8a7a68]">
                  Starting From
                </span>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-serif text-[26px] font-bold text-[#2b241d] sm:text-[28px]">
                    {event.formattedPrice}
                  </span>
                  <span className="text-[12px] font-medium text-[#786b5c]">
                    (Incl. Samagri & Sankalp)
                  </span>
                </div>
              </div>

              <div>
                {isBookable ? (
                  <Link
                    to={`/puja/${event.slug}`}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_22px_rgba(234,177,44,0.4)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                  >
                    <span>Book Puja</span>
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ) : (
                  <Link
                    to={`/puja/${event.slug}`}
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#c77722] bg-[#fffdfa] px-7 py-3.5 text-[13.5px] font-bold text-[#9d5b12] shadow-2xs transition-all duration-200 hover:bg-[#fbf4e8] hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                  >
                    <span>View Puja Details</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedUpcomingPuja;
