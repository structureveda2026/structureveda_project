import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";

const YagyaCard = ({ yagya }) => {
  if (!yagya) return null;

  return (
    <Link
      to={`/yagya/${yagya.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border-2 border-[#e6cca0]/80 bg-[#fffdfa] p-3.5 sm:p-4 shadow-[0_10px_30px_rgba(43,36,29,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4872b] hover:shadow-[0_20px_40px_rgba(212,135,43,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4872b]"
    >
      {/* Top Media & Content Area */}
      <div>
        {/* Yagya Image Frame */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-[#241a12]">
          <img
            src={yagya.image}
            alt={yagya.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Subtle Bottom Gradient Scrim */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/75 via-transparent to-transparent" />

          {/* Floating Badge (Top Left) */}
          {yagya.badge && (
            <div className="absolute left-3 top-3 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1c130b]/85 px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-xs">
                <Sparkles size={11} className="text-[#eab12c]" />
                {yagya.badge}
              </span>
            </div>
          )}

          {/* Location Pill (Bottom Left) */}
          <div className="absolute bottom-3 left-3 z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-medium text-[#f0e3ce] backdrop-blur-xs shadow-xs">
              <MapPin size={12} className="shrink-0 text-[#eab12c]" />
              <span className="truncate">{yagya.location || "Kashi"}</span>
            </span>
          </div>
        </div>

        {/* Text Details Area */}
        <div className="mt-3.5 space-y-1.5">
          {/* Eyebrow Category */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              {yagya.eyebrow || "VEDIC HOMA • KASHI"}
            </span>
          </div>

          {/* Yagya Name */}
          <h3 className="font-serif text-[17.5px] font-bold leading-snug tracking-[-0.01em] text-[#2b241d] transition-colors group-hover:text-[#b36c1e] sm:text-[19px]">
            {yagya.name}
          </h3>

          {/* Short Description */}
          <p className="line-clamp-2 text-[12.5px] leading-relaxed text-[#5e5143] sm:text-[13px]">
            {yagya.shortDescription || yagya.description}
          </p>
        </div>
      </div>

      {/* Bottom CTA Area (Anchored to bottom, NO PRICE displayed as requested) */}
      <div className="mt-4 border-t border-[#f0e2cd] pt-3.5">
        <div className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#eab12c] via-[#f0bb3b] to-[#dca522] py-2.5 text-[13px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.22)] transition-all duration-300 group-hover:brightness-105">
          <span>Book Now</span>
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
};

export default YagyaCard;
