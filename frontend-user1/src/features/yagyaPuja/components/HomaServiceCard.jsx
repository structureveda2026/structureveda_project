import { MapPin, Sparkles, ArrowRight, Clock, Flame, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const HomaServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <Link
      to={`/yagya-puja/homa/${service.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#e6caa0] bg-[#fffdf9] shadow-[0_8px_25px_rgba(80,60,30,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d4872b] hover:shadow-[0_18px_40px_rgba(212,135,43,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4872b] cursor-pointer"
    >
      {/* Top Image Frame */}
      <div className="relative h-[220px] w-full overflow-hidden bg-[#241a12]">
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c130b]/85 via-[#1c130b]/25 to-transparent" />

        {/* Featured Badge */}
        {service.featured && (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1f160e]/85 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-xs">
              <Sparkles size={11} className="text-[#eab12c]" />
              Featured Homa
            </span>
          </div>
        )}

        {/* Location & Remote Pill */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
          {service.kashiAvailable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-[#f0e3ce] backdrop-blur-xs">
              <MapPin size={11} className="text-[#eab12c]" />
              Kashi
            </span>
          )}
          {service.remoteAvailable && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-[#d9cfc1] backdrop-blur-xs">
              Remote
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          {/* Metadata Row: Type & Duration */}
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#8a561c]">
            <span className="text-[#b36c1e]">{service.homaType}</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#75695c]">
              <Clock size={12} className="text-[#d4872b]" />
              <span>Duration: As Configured</span>
            </div>
          </div>

          {/* Homa Name */}
          <h3 className="mt-2 font-serif text-[21px] font-bold leading-snug text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
            {service.name}
          </h3>

          {/* Short Description */}
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f] line-clamp-2">
            {service.shortDescription || service.description}
          </p>

          {/* Available Havan Options Pills */}
          <div className="mt-4">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8a725b]">
              Available Havan Options:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(service.availableHavanCounts || []).map((cnt) => (
                <span
                  key={cnt}
                  className="inline-flex items-center gap-1 rounded-md border border-[#e2cca8] bg-[#f9f1e1] px-2 py-0.5 text-[11px] font-semibold text-[#6d4c1b]"
                >
                  <Flame size={10} className="text-[#b36c1e]" />
                  {cnt === "custom" ? "Custom" : `${cnt} Havan`}
                </span>
              ))}
            </div>
          </div>

          {/* Days & Pandit Requirement */}
          <div className="mt-3.5 flex flex-wrap items-center gap-3 text-[12px] font-medium text-[#7d674b]">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-[#c77722]" />
              <span>{service.availableDays?.join(", ")} Day(s)</span>
            </div>
            {service.recommendedPandits && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-[#c77722]" />
                  <span>{service.minimumPandits}–{service.recommendedPandits} Pandits</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer: Starting Price & CTA */}
        <div className="mt-6 flex items-end justify-between border-t border-[#ebdcc4] pt-4">
          <div>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-[#8c7e6c]">
              From
            </span>
            <div className="text-[19px] font-bold text-[#2b241d]">
              ₹{service.startingPrice?.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e7d3] px-4 py-2 text-[12.5px] font-bold text-[#7a4814] transition-colors duration-300 group-hover:bg-[#c77722] group-hover:text-white">
            <span>View Homa</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomaServiceCard;
