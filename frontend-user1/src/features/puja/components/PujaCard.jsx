import { Calendar, MapPin, Sparkles, ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import defaultPujaImg from "../../../assets/images/puja-kashi.jpg";

const PujaCard = ({ puja }) => {
  if (!puja) return null;

  return (
    <Link
      to={`/puja/${puja.slug}`}
      className="veda-hover-lift group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#edd7ab] bg-veda-gold-surface shadow-[0_10px_30px_rgba(80,60,30,0.06)] transition-all duration-500 hover:border-amber-400 hover:shadow-[0_20px_45px_rgba(212,135,43,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
    >
      {/* Top Image Frame */}
      <div className="relative h-[230px] w-full overflow-hidden bg-[#241a12]">
        <img
          src={puja.image}
          alt={puja.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultPujaImg;
          }}
        />
        {/* Soft Gradient Scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c130b]/85 via-[#1c130b]/25 to-transparent" />

        {/* Top Floating Badge */}
        {puja.badge && (
          <div className="absolute left-3.5 top-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fef08a] backdrop-blur-md shadow-md">
              <Flame size={11} className="text-[#f5b335] animate-pulse" />
              {puja.badge}
            </span>
          </div>
        )}

        {/* Location Pill on bottom right of image */}
        <div className="absolute bottom-3 right-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-[11px] font-medium text-[#faedd8] backdrop-blur-md shadow-sm">
            <MapPin size={12} className="text-[#f5b335]" />
            {puja.location}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          {/* Date Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[#fbf0db] border border-[#ebd5a7] px-2.5 py-0.5 text-[11.5px] font-bold text-[#b36c1e]">
            <Calendar size={12} className="text-[#d96716]" />
            <span>{puja.formattedDate}</span>
          </div>

          {/* Puja Name */}
          <h3 className="mt-3 font-serif text-[22px] font-bold leading-snug text-[#241a12] transition-colors duration-300 group-hover:text-[#b36a18] line-clamp-2">
            {puja.name}
          </h3>

          {/* Purpose Line */}
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#75695c]">
            {puja.purpose}
          </p>
        </div>

        {/* Bottom Price & CTA Row */}
        <div className="mt-6 flex items-center justify-between border-t border-[#f0dfbe]/80 pt-4">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9a8d7d]">
              Sankalpa Seva
            </span>
            <span className="font-serif text-[23px] font-bold text-[#1f160e]">
              {puja.formattedPrice}
            </span>
          </div>

          <span
            className="group/btn inline-flex items-center gap-2 rounded-full bg-veda-gold-gradient px-5 py-2.5 text-[12px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(217,148,38,0.28)] border border-[#ffea9f]/70 transition-all duration-300 group-hover:shadow-[0_6px_22px_rgba(217,148,38,0.45)] group-hover:scale-105"
          >
            <span>Book Puja</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>

      {/* Bottom Gold Accent Line */}
      <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-amber-400 via-[#ffd56b] to-transparent transition-all duration-500 group-hover:w-full" />
    </Link>
  );
};

export default PujaCard;
