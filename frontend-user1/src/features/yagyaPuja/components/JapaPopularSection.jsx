import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { JAPA_CATALOGUE_LIST } from "../data/japaCatalogueData";
import JapaServiceCard from "./JapaServiceCard";

const JapaPopularSection = () => {
  // Only data-driven featured and active services
  const popularJapas = JAPA_CATALOGUE_LIST.filter(
    (j) => j.featured === true && j.active === true
  ).slice(0, 3);

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
              <Sparkles size={13} className="text-[#c77722]" />
              <span>REVERED RECITATIONS</span>
            </div>
            <h2 className="mt-2 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Popular Mantra Japa
            </h2>
            <p className="mt-2 max-w-[620px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
              Frequently chosen traditional anushthans performed with Sankalpa, verified counts, and dedicated Vedic scholars.
            </p>
          </div>

          <a
            href="#japa-catalogue-heading"
            className="inline-flex items-center gap-2 rounded-full border border-[#c4a179] bg-[#fffaf1] px-5 py-2.5 text-[13px] font-semibold text-[#4e3c28] transition hover:border-[#a0631c] hover:bg-white"
          >
            <span>View All Japa Services</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Popular Cards Grid */}
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {popularJapas.map((service) => (
            <JapaServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JapaPopularSection;
