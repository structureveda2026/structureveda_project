import { MapPin, Sparkles, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const PujaServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <Link
      to={`/yagya-puja/puja/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-[#e8d9bc] bg-[#fffdfa] shadow-[0_4px_18px_rgba(60,40,15,0.07)] transition-all duration-300 hover:border-[#c77722]/70 hover:shadow-[0_12px_36px_rgba(199,119,34,0.13)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722] cursor-pointer"
    >
      {/* ── Image ── */}
      <div className="relative w-full overflow-hidden bg-[#1f1510]" style={{ aspectRatio: "4/3" }}>
        <img
          src={service.image}
          alt={service.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Ambient scrim — gradient only at bottom */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a120b]/75 via-[#1a120b]/10 to-transparent" />

        {/* Featured badge — top left, smaller & refined */}
        {service.isFeatured && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#eab12c]/30 bg-[#1c130b]/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f5ce6f] backdrop-blur-sm shadow-sm">
              <Sparkles size={9} className="text-[#eab12c]" />
              Featured
            </span>
          </div>
        )}

        {/* Location badge — bottom right, slim */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10.5px] font-medium text-[#f0e4cc] backdrop-blur-sm border border-white/10">
            <MapPin size={9} className="text-[#eab12c]" />
            {service.locationType || "Kashi & Sacred Dhams"}
          </span>
        </div>
      </div>

      {/* ── Card Content ── */}
      <div className="flex flex-1 flex-col justify-between px-5 py-5 sm:px-6 sm:py-5">
        <div>
          {/* Deity + Duration row */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            <span className="rounded-full bg-[#f8edd8] px-2.5 py-0.5 text-[#8a561c] border border-[#eed7b6]">
              {service.deity}
            </span>
            <span className="text-[#d2baa0]">·</span>
            <span className="flex items-center gap-1 text-[#6e6052]">
              <Clock size={11} className="text-[#c77722]" />
              {service.duration || (service.availableDurations ? service.availableDurations.join(", ") : "2–3 Hours")}
            </span>
          </div>

          {/* Service name */}
          <h3 className="mt-3 font-serif text-[19px] font-bold leading-snug text-[#2b241d] transition-colors duration-300 group-hover:text-[#b36c1e] sm:text-[20px]">
            {service.name}
          </h3>

          {/* Short description */}
          <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.65] text-[#685c4f]">
            {service.shortDescription || service.purpose}
          </p>

          {/* Mode line */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#7d674b]">
            <ShieldCheck size={12} className="shrink-0 text-[#b36c1e]" />
            <span>{service.availableMode || "In-Person or Remote Sankalpa"}</span>
          </div>
        </div>

        {/* ── Price + CTA ── */}
        <div className="mt-5 flex items-end justify-between border-t border-[#f0e2cd] pt-4">
          {/* Price block */}
          <div>
            <span className="block text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#9c8e7e]">
              Starting From
            </span>
            <span className="mt-0.5 block font-serif text-[22px] font-bold leading-none text-[#2b241d]">
              {service.formattedPrice}
            </span>
          </div>

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c77722] px-4 py-2 text-[12px] font-bold text-[#b36c1e] transition-all duration-300 group-hover:bg-[#eab12c] group-hover:border-[#eab12c] group-hover:text-[#1c1308] group-hover:shadow-[0_4px_14px_rgba(234,177,44,0.30)]">
            <span>View Puja</span>
            <ArrowRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>

      {/* Bottom gold accent bar */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#eab12c] via-[#f5ce6f] to-transparent transition-all duration-500 group-hover:w-full"
      />
    </Link>
  );
};

export default PujaServiceCard;
