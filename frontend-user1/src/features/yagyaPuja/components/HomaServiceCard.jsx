import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Flame,
  MapPin,
  Sparkles,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";

import cardYagyaFireImg from "../../../assets/images/library/cards/card-yagya-fire.jpg";
import {
  getHomaFallbackImage,
  isUnresolvableAsset,
} from "../../../services/homaCatalogueService";

/**
 * Standardized HomaServiceCard Component
 * Single reusable component supporting two standardized presentation modes:
 * - Mode A ("horizontal"): Large horizontal split-card for single-service categories
 * - Mode B ("grid"): Responsive card for multi-service categories (2-column on desktop)
 *
 * Provides identical typography, #EAD8B8 borders, gold pills, starting Dakshina,
 * and dual CTAs ("View Ceremony" + "Book Ceremony") across all categories.
 */
const HomaServiceCard = ({
  service,
  mode = "grid",
  customImage = null,
}) => {
  const [imgError, setImgError] = useState(false);

  if (!service) return null;

  // Visual resolution with graceful fallbacks
  const fallbackImg =
    (service.slug ? getHomaFallbackImage(service.slug) : null) || cardYagyaFireImg;
  const isBrokenPath = isUnresolvableAsset(service.image);
  const imgSrc =
    !imgError && customImage
      ? customImage
      : !imgError && service.image && !isBrokenPath
      ? service.image
      : fallbackImg;

  // Ceremony specifications
  const slug = service.slug || "";
  const name = service.name || "Vedic Fire Ceremony";
  const homaType = service.homaType || "Vedic Fire Ceremony";
  const dailyHours = service.dailyHours || "3 – 4 Hours Daily";
  const description = service.shortDescription || service.description || "";

  const havanCounts =
    Array.isArray(service.availableHavanCounts) &&
    service.availableHavanCounts.length > 0
      ? service.availableHavanCounts
      : [1, 3, 5];

  const durationDays =
    Array.isArray(service.availableDays) && service.availableDays.length > 0
      ? service.availableDays
      : [1, 2];

  const minPandits = service.minimumPandits || 2;
  const maxPandits =
    service.maximumPandits || service.recommendedPandits || 7;
  const skills = service.requiredSkills || "Initiated Vedic Acharyas";
  const prasad =
    service.prasad ||
    "Sanctified Homa Bhasma, blessed Raksha Sutra, and energized Prasad token";

  const formattedPrice =
    service.formattedPrice ||
    (service.startingPrice
      ? `₹${Number(service.startingPrice).toLocaleString("en-IN")}`
      : "₹9,500");

  const featured = Boolean(service.featured);
  const kashiAvailable = service.kashiAvailable !== false;
  const remoteAvailable = service.remoteAvailable !== false;

  /* ═════════════════════════════════════════════════════════════
     MODE A: HORIZONTAL SPLIT CARD (Single-service categories)
  ══════════════════════════════════════════════════════════════ */
  if (mode === "horizontal") {
    return (
      <div className="overflow-hidden rounded-[24px] border border-[#EAD8B8] bg-[#FFFDF9] shadow-md transition-all duration-300 hover:border-[#B7791F] hover:shadow-[0_16px_36px_rgba(183,121,31,0.12)]">
        <div className="grid lg:grid-cols-12">
          {/* Left Column (5 cols): Ritual Showcase Visual */}
          <div className="relative min-h-[260px] sm:min-h-[320px] lg:col-span-5 lg:min-h-full overflow-hidden bg-[#241A12]">
            <img
              src={imgSrc}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />

            {/* Floating Featured Badge */}
            {featured && (
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1F160E]/85 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#F5CE6F] backdrop-blur-md shadow-xs">
                  <Sparkles size={11} className="text-[#EAB12C]" />
                  Featured Homa
                </span>
              </div>
            )}

            {/* Floating Location Badges */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
              {kashiAvailable && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-[#F0E3CE] backdrop-blur-xs">
                  <MapPin size={11} className="text-[#EAB12C]" />
                  Kashi Kshetra
                </span>
              )}
              {remoteAvailable && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-[#D9CFC1] backdrop-blur-xs">
                  Remote Live Stream
                </span>
              )}
            </div>
          </div>

          {/* Right Column (7 cols): Specifications & CTAs */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div>
              {/* Category & Cadence Row */}
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#B7791F]">
                <span>{homaType}</span>
                <span className="text-[#D8C7B5]">•</span>
                <div className="flex items-center gap-1 text-[#766D60]">
                  <Clock size={12} className="text-[#C77722]" />
                  <span>{dailyHours}</span>
                </div>
              </div>

              {/* Ceremony Heading */}
              <h3 className="mt-2 font-serif text-[24px] font-bold text-[#29231B] sm:text-[28px]">
                {name}
              </h3>

              {/* Description */}
              <p className="mt-3 text-[14px] leading-relaxed text-[#685C4F] sm:text-[15px]">
                {description}
              </p>

              {/* Specifications Grid */}
              <div className="mt-6 grid gap-4 rounded-[18px] border border-[#EAD8B8] bg-[#FAF6EE] p-4.5 sm:grid-cols-2">
                {/* Supported Havans */}
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                    Supported Havan Counts:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {havanCounts.map((cnt) => (
                      <span
                        key={cnt}
                        className="inline-flex items-center gap-1 rounded-md border border-[#EAD8B8] bg-[#FFFDF9] px-2.5 py-1 text-[11.5px] font-semibold text-[#B7791F]"
                      >
                        <Flame size={11} className="text-[#C77722]" />
                        {cnt} {cnt === 1 ? "Havan" : "Havans"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Durations */}
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                    Available Durations:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {durationDays.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded-md border border-[#EAD8B8] bg-[#FFFDF9] px-2.5 py-1 text-[11.5px] font-semibold text-[#5C4E3F]"
                      >
                        <Calendar size={11} className="text-[#C77722]" />
                        {d} {d === 1 ? "Day" : "Days"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pandit Credentials */}
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                    Pandit Requirements:
                  </span>
                  <p className="mt-1 text-[12.5px] font-medium text-[#29231B]">
                    {minPandits} to {maxPandits} Initiated Purohits
                  </p>
                  <p className="text-[11px] text-[#766D60]">{skills}</p>
                </div>

                {/* Prasad Details */}
                <div>
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#A39682]">
                    Consecrated Prasad:
                  </span>
                  <p className="mt-1 text-[12px] font-medium text-[#29231B] line-clamp-2">
                    {prasad}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Dual Conversion CTA Row */}
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-[#EAD8B8] pt-6 sm:flex-row sm:items-center">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7966]">
                  Starting Dakshina
                </span>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-serif text-[28px] font-bold text-[#B7791F]">
                    {formattedPrice}
                  </span>
                  <span className="text-[11.5px] text-[#766D60]">
                    All-inclusive Vidhi
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Link
                  to={`/yagya-puja/homa/${service.slug}`}
                  className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-[#B7791F] bg-[#FFFDF9] px-5 py-3 text-[13px] font-bold text-[#B7791F] shadow-2xs transition hover:bg-[#FAF0DC]"
                >
                  <span>View Ceremony</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to={`/yagya-puja/homa/${slug}/book`}
                  className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:brightness-110"
                >
                  <span>Book Ceremony</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════════
     MODE C: RELATED SERVICE CARD (Detail page related ceremonies)
  ══════════════════════════════════════════════════════════════ */
  if (mode === "related") {
    return (
      <Link
        to={`/yagya-puja/homa/${service.slug}`}
        className="group flex flex-col justify-between overflow-hidden rounded-[22px] border border-[#EAD8B8] bg-[#FFFDF9] shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#B7791F] hover:shadow-[0_12px_28px_rgba(183,121,31,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7791F]"
      >
        <div>
          {/* Top Image Frame */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241A12]">
            <img
              src={imgSrc}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Small Category Label Pill */}
            <div className="absolute left-3.5 top-3.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#1F160E]/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F5CE6F] backdrop-blur-md">
                <Flame size={10} className="text-[#EAB12C]" />
                {homaType}
              </span>
            </div>

            {/* Location Pill */}
            <div className="absolute bottom-3 right-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[10.5px] font-medium text-[#F0E3CE] backdrop-blur-xs">
                <MapPin size={10} className="text-[#EAB12C]" />
                {kashiAvailable && remoteAvailable ? "Kashi & Remote" : kashiAvailable ? "Kashi" : "Remote"}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6">
            <h3 className="font-serif text-[18px] sm:text-[19px] font-bold text-[#29231B] transition-colors duration-200 group-hover:text-[#B7791F]">
              {name}
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-[#685C4F] line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Footer: Starting Dakshina & Single Full-Width CTA */}
        <div className="border-t border-[#F2E6D5] bg-[#FAF6EE] p-5">
          <div className="mb-3.5 flex items-baseline justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7966]">
              Starting Dakshina
            </span>
            <span className="font-serif text-[19px] font-bold text-[#B7791F]">
              {formattedPrice}
            </span>
          </div>

          {/* Single full-width CTA */}
          <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#B7791F] bg-[#FFFDF9] py-2.5 text-[12.5px] font-bold text-[#B7791F] shadow-2xs transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#B7791F] group-hover:to-[#C77722] group-hover:text-white group-hover:border-transparent group-hover:shadow-md">
            <span>Explore Ceremony</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  /* ═════════════════════════════════════════════════════════════
     MODE B: RESPONSIVE GRID CARD (Multi-service categories)
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#EAD8B8] bg-[#FFFDF9] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B7791F] hover:shadow-[0_12px_28px_rgba(183,121,31,0.12)]">
      <div>
        {/* Top Image Frame */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241A12]">
          <img
            src={imgSrc}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Featured Badge */}
          {featured && (
            <div className="absolute left-3.5 top-3.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#1F160E]/85 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F5CE6F] backdrop-blur-md">
                <Sparkles size={10} className="text-[#EAB12C]" />
                Featured
              </span>
            </div>
          )}

          {/* Location Badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-[10.5px] font-medium text-[#F0E3CE] backdrop-blur-xs">
              <MapPin size={10} className="text-[#EAB12C]" />
              {kashiAvailable && remoteAvailable
                ? "Kashi & Remote"
                : kashiAvailable
                ? "Kashi"
                : "Remote"}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-[11.5px] font-semibold text-[#B7791F]">
            <span>{homaType}</span>
            <span className="text-[#D8C7B5]">•</span>
            <div className="flex items-center gap-1 text-[#766D60]">
              <Clock size={11} className="text-[#C77722]" />
              <span>{dailyHours}</span>
            </div>
          </div>

          {/* Service Name */}
          <Link to={`/yagya-puja/homa/${slug}`} className="block group">
            <h3 className="mt-2 font-serif text-[20px] font-bold text-[#29231B] transition-colors duration-200 group-hover:text-[#B7791F]">
              {name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="mt-2 text-[13px] leading-relaxed text-[#685C4F] line-clamp-3">
            {description}
          </p>

          {/* Supported Havans */}
          <div className="mt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A39682]">
              Supported Havans:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {havanCounts.map((cnt) => (
                <span
                  key={cnt}
                  className="inline-flex items-center gap-1 rounded-md border border-[#EAD8B8] bg-[#FAF6EE] px-2 py-0.5 text-[11px] font-semibold text-[#B7791F]"
                >
                  <Flame size={10} className="text-[#C77722]" />
                  {cnt} {cnt === 1 ? "Havan" : "Havans"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Starting Dakshina & Dual CTAs */}
      <div className="border-t border-[#EAD8B8] bg-[#FAF6EE] p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7966]">
            Starting Dakshina
          </span>
          <p className="font-serif text-[20px] font-bold text-[#B7791F]">
            {formattedPrice}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/yagya-puja/homa/${service.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#B7791F] bg-white px-3.5 py-2 text-[12px] font-bold text-[#B7791F] shadow-2xs transition hover:bg-[#FAF0DC]"
          >
            <span>View Ceremony</span>
          </Link>
          <Link
            to={`/yagya-puja/homa/${slug}/book`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#B7791F] to-[#C77722] px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white shadow-xs transition hover:brightness-110"
          >
            <span>Book Ceremony</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomaServiceCard;
