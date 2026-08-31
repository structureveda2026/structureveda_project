import { Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const PujaCard = ({ puja }) => {
  if (!puja) return null;

  return (
    <Link
      to={`/puja/${puja.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#e6caa0] bg-[#fffdf9] shadow-[0_10px_30px_rgba(80,60,30,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d4872b] hover:shadow-[0_20px_45px_rgba(212,135,43,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4872b] cursor-pointer"
    >
      {/* Top Image Frame */}
      <div className="relative h-[220px] w-full overflow-hidden bg-[#241a12]">
        <img
          src={puja.image}
          alt={puja.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Soft Gradient Scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c130b]/80 via-[#1c130b]/20 to-transparent" />

        {/* Top Floating Badge */}
        {puja.badge && (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1f160e]/85 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-sm">
              <Sparkles size={11} className="text-[#eab12c]" />
              {puja.badge}
            </span>
          </div>
        )}

        {/* Location Pill on bottom right of image */}
        <div className="absolute bottom-3 right-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-[#f0e3ce] backdrop-blur-sm">
            <MapPin size={12} className="text-[#eab12c]" />
            {puja.location}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          {/* Date Tag */}
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#b36c1e]">
            <Calendar size={13} className="text-[#d4872b]" />
            <span>{puja.formattedDate}</span>
          </div>

          {/* Puja Name */}
          <h3 className="mt-2.5 font-serif text-[22px] font-bold leading-snug text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
            {puja.name}
          </h3>

          {/* Purpose Line */}
          <p className="mt-3 text-[13px] font-medium text-[#685c4f]">
            {puja.purpose}
          </p>
        </div>

        {/* Bottom Price & CTA Row */}
        <div className="mt-6 flex items-center justify-between border-t border-[#f0e2cd] pt-4">
          <div>
            <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-[#8c7e6c]">
              From
            </span>
            <span className="font-serif text-[22px] font-bold text-[#2b241d]">
              {puja.formattedPrice}
            </span>
          </div>

          <span
            className="group/btn inline-flex items-center gap-1.5 rounded-full bg-[#eab12c] px-5 py-2.5 text-[12.5px] font-bold text-[#2b241d] shadow-[0_4px_14px_rgba(234,177,44,0.25)] transition-all duration-300 group-hover:bg-[#dda018] group-hover:shadow-[0_6px_20px_rgba(234,177,44,0.35)]"
          >
            <span>View Puja</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>

      {/* Bottom Gold Accent Line */}
      <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-[#eab12c] via-[#ffdf88] to-transparent transition-all duration-500 group-hover:w-full" />
    </Link>
  );
};

export default PujaCard;
