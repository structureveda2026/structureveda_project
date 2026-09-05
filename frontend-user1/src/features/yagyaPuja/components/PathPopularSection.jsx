import { Sparkles, ArrowRight } from "lucide-react";
import { PATH_CATALOGUE_LIST } from "../data/pathCatalogueData";
import PathServiceCard from "./PathServiceCard";

const PathPopularSection = () => {
  // Data-driven featured and active paths
  const popularPaths = PATH_CATALOGUE_LIST.filter(
    (p) => p.featured === true && p.active === true
  );

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              <Sparkles size={13} className="text-[#c77722]" />
              <span>REVERED SCRIPTURES</span>
            </div>
            <h2 className="mt-2 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Popular Path & Recitation
            </h2>
            <p className="mt-2 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
              Frequently requested Vedic Granth recitations and traditional Stotras, chanted with authentic meter and dedicated Pandit teams.
            </p>
          </div>

          <a
            href="#path-catalogue-heading"
            className="inline-flex items-center gap-2 rounded-full border border-[#c4a179] bg-[#fffaf1] px-5 py-2.5 text-[13px] font-semibold text-[#4e3c28] transition hover:border-[#a0631c] hover:bg-white"
          >
            <span>View All Recitations</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Popular Cards Grid (6 cards) */}
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {popularPaths.map((service) => (
            <PathServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PathPopularSection;
