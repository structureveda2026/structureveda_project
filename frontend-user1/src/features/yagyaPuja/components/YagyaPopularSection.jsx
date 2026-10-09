import { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import yagyaCatalogueService from "../../../services/yagyaCatalogueService";
import { getFeaturedYagyaServices } from "../data/yagyaCatalogueData";
import YagyaServiceCard from "./YagyaServiceCard";

/**
 * YagyaPopularSection Component
 * Displays a curated service preview of maximum 6 Yagya services using the canonical YagyaServiceCard.
 * Retains "View All Yagya" navigating to /yagya-puja/yagya.
 */
const YagyaPopularSection = () => {
  const [popularServices, setPopularServices] = useState(() => {
    return getFeaturedYagyaServices().slice(0, 6);
  });

  useEffect(() => {
    let isMounted = true;

    yagyaCatalogueService
      .getYagyaServices({ isFeatured: true, limit: 6 })
      .then((res) => {
        if (isMounted && res?.services?.length > 0) {
          setPopularServices(res.services.slice(0, 6));
        }
      })
      .catch((err) => {
        console.error("Could not load featured yagya preview:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (popularServices.length === 0) return null;

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffdfa] px-3.5 py-1.5 shadow-2xs">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                REVERED SACRED ANUSHTHANS
              </span>
            </div>
            <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
              Popular Yagya
            </h2>
            <p className="mt-2 max-w-[600px] text-[14.5px] leading-relaxed text-[#685c4f]">
              Frequently requested multi-day Vedic Yagyas arranged with complete Shastric vidhi, Agni ahutis, and Gotra Sankalpa.
            </p>
          </div>

          <Link
            to="/yagya-puja/yagya"
            onClick={() => {
              const el = document.getElementById("yagya-catalogue");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#b36c1e] hover:text-[#2b241d] cursor-pointer"
          >
            <span>View All Yagya</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured Cards Grid (Maximum 6 services) */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7 items-stretch">
          {popularServices.slice(0, 6).map((service) => (
            <YagyaServiceCard key={`popular-yagya-${service.id || service.slug}`} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default YagyaPopularSection;
