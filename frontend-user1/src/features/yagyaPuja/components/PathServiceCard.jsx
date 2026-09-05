import { MapPin, Sparkles, ArrowRight, Clock, BookOpen, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const formatBadge = (fmt) => {
  if (fmt === "single_session") return "Single Session";
  if (fmt === "same_day") return "Same-Day";
  if (fmt === "multi_day") return "Multi-Day";
  if (fmt === "custom_request") return "Custom";
  return fmt;
};

const PathServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <Link
      to={`/yagya-puja/path/${service.slug}`}
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
              Featured Recitation
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
          {/* Scripture & Path Type Row */}
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#8a561c]">
            <span className="text-[#b36c1e]">{service.pathType}</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#75695c]">
              <Clock size={12} className="text-[#d4872b]" />
              <span>{service.estimatedRecitationHours} Hours Est.</span>
            </div>
          </div>

          {/* Path Name */}
          <h3 className="mt-2 font-serif text-[21px] font-bold leading-snug text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
            {service.name}
          </h3>

          {/* Scripture Source Inset */}
          <p className="mt-1.5 text-[12.5px] font-medium text-[#8c6b41]">
            Granth: <span className="font-semibold text-[#5c4424]">{service.scripture}</span>
          </p>

          {/* Short Description */}
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f] line-clamp-2">
            {service.shortDescription || service.description}
          </p>

          {/* Supported Formats Pills */}
          <div className="mt-4">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8a725b]">
              Available Formats:
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(service.availableFormats || []).map((fmt) => (
                <span
                  key={fmt}
                  className="inline-flex items-center gap-1 rounded-md border border-[#e2cca8] bg-[#f9f1e1] px-2 py-0.5 text-[11px] font-semibold text-[#6d4c1b]"
                >
                  <Calendar size={10} className="text-[#b36c1e]" />
                  {formatBadge(fmt)}
                </span>
              ))}
            </div>
          </div>

          {/* Chapter Structure Summary */}
          {service.chapterStructure && (
            <div className="mt-3.5 flex items-center gap-1.5 text-[12px] font-medium text-[#7d674b]">
              <BookOpen size={13} className="text-[#c77722]" />
              <span className="line-clamp-1">{service.chapterStructure}</span>
            </div>
          )}

          {/* Pandit Requirement Hint */}
          {service.recommendedPandits && (
            <div className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-[#7d674b]">
              <Users size={13} className="text-[#c77722]" />
              <span>Assigned Team: {service.minimumPandits} – {service.recommendedPandits} Vedic Scholars</span>
            </div>
          )}
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
            <span>View Path</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PathServiceCard;
