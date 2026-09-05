import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICE_CATEGORIES } from "../data/yagyaPujaData";

const ServiceCategoryCards = () => {
  return (
    <section id="service-categories" className="scroll-mt-24 bg-[#faf5eb] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4e8d1] px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            <Sparkles size={12} />
            <span>Service Spectrum</span>
          </div>

          <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
            Six Pillars of Sacred Rituals
          </h2>

          <p className="mx-auto mt-3 max-w-[680px] text-[15px] leading-relaxed text-[#685c4f]">
            Discover the ideal format for your spiritual intentions, family milestones, and traditional Vedic celebrations.
          </p>
        </div>

        {/* 6 Category Grid Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="group relative flex flex-col overflow-hidden rounded-[22px] border border-[#ebdcc4] bg-white shadow-[0_4px_20px_rgba(43,36,29,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722]/50 hover:shadow-[0_14px_36px_rgba(199,119,34,0.12)]"
            >
              {/* Card Image Thumbnail */}
              <div className="relative h-[200px] w-full overflow-hidden bg-[#f4e8d1]">
                <img
                  src={category.image}
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Tag Badge */}
                <span className="absolute bottom-3 left-4 rounded-full bg-[#fffaf0]/95 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#b36c1e] shadow-xs backdrop-blur-xs">
                  {category.tag}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-[11.5px] font-bold uppercase tracking-widest text-[#b36c1e]">
                    {category.subtitle}
                  </p>

                  <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                    {category.title}
                  </h3>

                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {category.description}
                  </p>
                </div>

                {/* Card CTA Link */}
                <div className="mt-6 border-t border-[#f2e6d5] pt-4">
                  <Link
                    to={category.route}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-[#fffaf0] px-4 py-2.5 text-[13px] font-semibold text-[#2b241d] border border-[#ebdcc4] transition-all duration-300 group-hover:border-[#c77722] group-hover:bg-[#eab12c] group-hover:text-[#1c1308]"
                  >
                    <span>Explore {category.title}</span>
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
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

export default ServiceCategoryCards;
