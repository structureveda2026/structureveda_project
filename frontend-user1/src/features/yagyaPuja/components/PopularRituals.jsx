import { Clock, MapPin, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { POPULAR_RITUALS_PREVIEW } from "../data/yagyaPujaData";

const PopularRituals = () => {
  return (
    <section className="border-t border-[#ebdcc4] bg-[#fbf6ee] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header with Title & View All Link */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e8d1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              <Star size={12} fill="#b36c1e" />
              <span>Featured Traditions</span>
            </div>

            <h2 className="mt-3 font-serif text-[30px] font-semibold text-[#2b241d] sm:text-[38px]">
              Popular Vedic Rituals
            </h2>

            <p className="mt-2 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f]">
              Frequently scheduled ceremonies by devotees across India and worldwide, organized with complete traditional vidhi.
            </p>
          </div>

          <Link
            to="/yagya-puja/puja"
            className="group inline-flex items-center gap-2 rounded-full border border-[#ebdcc4] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs transition-all hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722]"
          >
            <span>View All Rituals</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Popular Rituals Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_RITUALS_PREVIEW.map((ritual) => (
            <div
              key={ritual.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#ebdcc4] bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722]/60 hover:shadow-[0_12px_32px_rgba(199,119,34,0.12)]"
            >
              {/* Image Container */}
              <div className="relative h-[170px] w-full overflow-hidden bg-[#f4e8d1]">
                <img
                  src={ritual.image}
                  alt={ritual.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#1c1308]/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#eab12c] backdrop-blur-xs">
                  {ritual.category}
                </span>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center gap-3 text-[11.5px] text-[#8a7c6b]">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-[#c77722]" />
                      {ritual.duration}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="text-[#c77722]" />
                      {ritual.location}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-serif text-[17px] font-semibold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                    {ritual.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#685c4f]">
                    {ritual.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-[#f2e6d5] pt-3.5">
                  <Link
                    to={ritual.route}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#b36c1e] transition-colors group-hover:text-[#2b241d]"
                  >
                    <span>View Category</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRituals;
