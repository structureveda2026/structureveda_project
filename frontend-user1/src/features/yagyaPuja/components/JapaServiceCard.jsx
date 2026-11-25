import { useState, useEffect } from "react";
import { MapPin, Sparkles, ArrowRight, Clock, Users, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { getJapaFallbackImage } from "../../../services/japaCatalogueService";

const formatCount = (count) => {
  if (count >= 100000) return `${(count / 100000).toLocaleString("en-IN")} Lakh`;
  if (count >= 1000) return `${(count / 1000).toLocaleString("en-IN")}K`;
  return count.toLocaleString("en-IN");
};

const JapaServiceCard = ({ service }) => {
  if (!service) return null;

  const fallbackImg = getJapaFallbackImage(service.slug);
  const [imgSrc, setImgSrc] = useState(service.image || fallbackImg);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(service.image || fallbackImg);
    setHasError(false);
  }, [service.image, service.slug, fallbackImg]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackImg);
    }
  };

  const startingPrice = Number(service.startingPrice) || 18000;

  return (
    <Link
      to={`/yagya-puja/japa/${service.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8bc] bg-[#fffcf6] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#b77920] hover:bg-[#fffdfa] hover:shadow-[0_12px_28px_rgba(183,121,32,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b77920] cursor-pointer"
    >
      {/* Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5ecd9]">
        <img
          src={imgSrc}
          alt={service.name}
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241a12]/75 via-[#241a12]/15 to-transparent" />

        {/* Featured Pill */}
        {service.featured && (
          <div className="absolute left-3.5 top-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f5ce6f]/30 bg-[#2b1f14]/85 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-xs">
              <Sparkles size={11} className="text-[#eab12c]" />
              Featured Japa
            </span>
          </div>
        )}

        {/* Location / Remote Indicator */}
        <div className="absolute bottom-3 right-3.5 flex items-center gap-1.5">
          {service.kashiAvailable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1e150d]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#f5ead7] backdrop-blur-xs">
              <MapPin size={11} className="text-[#eab12c]" />
              Kashi Kshetra
            </span>
          )}
          {service.remoteAvailable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1e150d]/80 px-2.5 py-0.5 text-[11px] font-medium text-[#e8dfd3] backdrop-blur-xs">
              Remote
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Daily Hours / Window */}
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#8a561c]">
            <div className="flex items-center gap-1">
              <Clock size={12} className="text-[#b77920]" />
              <span>{service.dailyHours || "4 Hours Daily"}</span>
            </div>
            <span>•</span>
            <span className="text-[#75695c]">{service.completionWindow || "Vedic Schedule"}</span>
          </div>

          {/* Japa Service Name */}
          <h3 className="mt-2 font-serif text-[19px] sm:text-[20px] font-bold leading-snug text-[#30251c] transition-colors duration-300 group-hover:text-[#b77920]">
            {service.name}
          </h3>

          {/* Mantra Excerpt Inset */}
          {service.mantra && (
            <div className="mt-2.5 rounded-xl border border-[#ebd8bc] bg-[#faf3e8] px-3 py-1.5">
              <p className="font-serif text-[12px] italic text-[#634928] line-clamp-1">
                {service.mantra}
              </p>
            </div>
          )}

          {/* Description */}
          <p className="mt-2.5 text-[13px] leading-relaxed text-[#5c4d3c] line-clamp-2">
            {service.shortDescription || service.description}
          </p>

          {/* Service-Specific Available Counts Pills */}
          <div className="mt-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a725b]">
              Available Anushthan Counts:
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {(service.availableCounts || [11000, 21000, 51000]).map((cnt) => (
                <span
                  key={cnt}
                  className="inline-flex items-center gap-1 rounded-md border border-[#ead8bc] bg-[#f8f1e6] px-2 py-0.5 text-[11px] font-semibold text-[#6d4c1b]"
                >
                  <Hash size={10} className="text-[#b77920]" />
                  {formatCount(cnt)}
                </span>
              ))}
            </div>
          </div>

          {/* Pandit Requirement Summary */}
          {service.recommendedPandits && (
            <div className="mt-3 flex items-center gap-1.5 text-[11.5px] font-medium text-[#7d674b]">
              <Users size={12} className="text-[#b77920]" />
              <span>Purohits: {service.minimumPandits || 2} to {service.recommendedPandits} Vedic Scholars</span>
            </div>
          )}
        </div>

        {/* Footer: Starting Price & CTA */}
        <div className="mt-5 flex items-end justify-between border-t border-[#ead8bc] pt-4">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8c7e6c]">
              Dakshina From
            </span>
            <div className="text-[18px] sm:text-[19px] font-bold text-[#30251c]">
              ₹{startingPrice.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e7d3] px-3.5 py-1.5 text-[12px] font-bold text-[#7a4814] transition-all duration-300 group-hover:bg-[#b77920] group-hover:text-white">
            <span>View Japa</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JapaServiceCard;
