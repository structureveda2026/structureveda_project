import { ArrowRight, Clock, Sparkles, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { PUJA_CATALOGUE_LIST } from "../../data/pujaCatalogueData";
import { YAGYA_CATALOGUE_LIST } from "../../data/yagyaCatalogueData";

/**
 * SECTION 5: POPULAR PUJA + POPULAR YAGYA
 * Paired editorial catalogue showcases derived directly from real project data.
 */
const UmbrellaPopularServices = () => {
  // Derive popular pujas (first 4 items with isFeatured or active)
  const popularPujas = PUJA_CATALOGUE_LIST.slice(0, 4);

  // Derive popular yagyas (first 4 items)
  const popularYagyas = YAGYA_CATALOGUE_LIST.slice(0, 4);

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* Section Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              COMMONLY BOOKED SERVICES
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Most Prescribed <span className="text-[#c77722]">Vedic Ceremonies</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[680px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f]">
            Structured Shastric ceremonies most frequently performed in Kashi and holy shrines for spiritual resolution, protection, and family wellbeing.
          </p>
        </div>

        {/* Two Connected Showcases: Left = Popular Puja | Right = Popular Yagya */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">

          {/* =========================================================
              LEFT COLUMN: POPULAR PUJA
          ========================================================== */}
          <div className="rounded-[24px] border border-[#ead8b8] bg-[#fbf5e8]/60 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#ead8b8] pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  DEVOTIONAL RITUALS
                </span>
                <h3 className="font-serif text-[24px] font-bold text-[#2b241d]">
                  Popular Puja
                </h3>
              </div>

              <Link
                to="/yagya-puja/puja"
                className="inline-flex items-center gap-1 text-[13px] font-bold text-[#b36c1e] hover:text-[#8e4f0d] transition-colors"
              >
                <span>View All Puja</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* List of 4 Compact Puja Items */}
            <div className="mt-6 space-y-4">
              {popularPujas.map((item) => (
                <Link
                  key={item.id}
                  to={`/yagya-puja/puja/${item.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-[#ead8b8]/80 bg-[#fffdfa] p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c77722] hover:shadow-sm sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-full sm:w-24 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#b36c1e]">
                      <span>{item.deity}</span>
                      <span className="text-[#ebdcc4]">•</span>
                      <span className="flex items-center gap-1 text-[#65584a]">
                        <Clock size={12} />
                        <span>{item.duration}</span>
                      </span>
                    </div>

                    <h4 className="mt-1 truncate font-serif text-[17px] font-bold text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                      {item.name}
                    </h4>

                    <p className="mt-1 line-clamp-1 text-[12.5px] text-[#685c4f]">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0e2cd]">
                    <span className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {item.formattedPrice || `₹${item.startingPrice}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#b36c1e] group-hover:translate-x-0.5 transition-transform">
                      <span>Details</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: POPULAR YAGYA
          ========================================================== */}
          <div className="rounded-[24px] border border-[#ead8b8] bg-[#fbf5e8]/60 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#ead8b8] pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                  SACRED FIRE CEREMONIES
                </span>
                <h3 className="font-serif text-[24px] font-bold text-[#2b241d]">
                  Popular Yagya
                </h3>
              </div>

              <Link
                to="/yagya-puja/yagya"
                className="inline-flex items-center gap-1 text-[13px] font-bold text-[#b36c1e] hover:text-[#8e4f0d] transition-colors"
              >
                <span>View All Yagya</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* List of 4 Compact Yagya Items */}
            <div className="mt-6 space-y-4">
              {popularYagyas.map((item) => (
                <Link
                  key={item.id}
                  to={`/yagya-puja/yagya/${item.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-[#ead8b8]/80 bg-[#fffdfa] p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c77722] hover:shadow-sm sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-full sm:w-24 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-[#b36c1e]">
                      <span>{item.purposeCategory || "Vedic Anushthan"}</span>
                      <span className="text-[#ebdcc4]">•</span>
                      <span className="flex items-center gap-1 text-[#65584a]">
                        <Clock size={12} />
                        <span>{item.duration || "Multi-Day"}</span>
                      </span>
                    </div>

                    <h4 className="mt-1 truncate font-serif text-[17px] font-bold text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                      {item.name}
                    </h4>

                    <p className="mt-1 line-clamp-1 text-[12.5px] text-[#685c4f]">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center justify-between sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0e2cd]">
                    <span className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {item.formattedPrice || `₹${item.startingPrice}`}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#b36c1e] group-hover:translate-x-0.5 transition-transform">
                      <span>Details</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UmbrellaPopularServices;
