import { Sparkles, MapPin, ShieldCheck, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import pujaRudrabhishekImg from "../../../../assets/images/puja-rudrabhishek.jpg";
import { PUJA_CATALOGUE_LIST } from "../../data/pujaCatalogueData";

/**
 * SECTION 9: FEATURED KASHI RITUAL
 * High-profile featured ceremony banner derived truthfully from catalogued Puja services.
 */
const UmbrellaFeaturedKashiRitual = () => {
  // Truthfully reference the consecrated Rudrabhishek from catalogue
  const featured = PUJA_CATALOGUE_LIST.find((p) => p.slug === "rudrabhishek-puja") || PUJA_CATALOGUE_LIST[0];

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* Banner Container */}
        <div className="relative overflow-hidden rounded-[24px] border border-[#ead8b8] bg-[#fbf5e8] shadow-[0_4px_24px_rgba(60,40,15,0.06)]">
          <div className="grid items-center lg:grid-cols-12">

            {/* Left Image Showcase */}
            <div className="relative h-[280px] sm:h-[340px] lg:col-span-5 lg:h-[400px] overflow-hidden bg-[#1c1209]">
              <img
                src={featured?.image || pujaRudrabhishekImg}
                alt="Mahashivratri Special Rudrabhishek in Kashi"
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 rounded-full border border-[#eab12c]/40 bg-[#160d06]/75 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5ce6f] backdrop-blur-xs">
                Featured Vedic Observance
              </div>
            </div>

            {/* Right Editorial Copy & Booking Action */}
            <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
              <div className="inline-flex items-center gap-2 text-[#b36c1e]">
                <Sparkles size={13} className="text-[#c77722]" />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#8e4f0d]">
                  SPECIAL PUJA IN KASHI
                </span>
              </div>

              <h3 className="mt-2 font-serif text-[28px] font-bold leading-tight text-[#2b241d] sm:text-[34px] lg:text-[38px]">
                Mahashivratri Special Rudrabhishek
              </h3>

              <p className="mt-3 text-[14.5px] leading-relaxed text-[#65584a] sm:text-[15.5px]">
                Consecrated Shukla Yajurveda Sri Rudram abhishekam dedicated to Lord Shiva on the sacred ghats of Varanasi. Includes personalized family Gotra Sankalp, 11 holy dravyas, and energized prasadam dispatch.
              </p>

              {/* Badges */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-[12px] font-medium text-[#5c4e3f]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffaf0] px-3 py-1">
                  <MapPin size={13} className="text-[#b36c1e]" />
                  <span>Kashi Sanctum</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffaf0] px-3 py-1">
                  <ShieldCheck size={13} className="text-[#b36c1e]" />
                  <span>Special Sankalp</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffaf0] px-3 py-1">
                  <Clock size={13} className="text-[#b36c1e]" />
                  <span>{featured?.duration || "2 - 3 Hours"}</span>
                </span>
              </div>

              {/* Price & Primary CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-[#ead8b8]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#827464] block font-medium">
                    Starting Offering
                  </span>
                  <span className="font-serif text-[26px] font-bold text-[#2b241d]">
                    {featured?.formattedPrice || "From ₹1,100"}
                  </span>
                </div>

                <Link
                  to={`/yagya-puja/puja/${featured?.slug || "rudrabhishek-puja"}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_4px_18px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_24px_rgba(234,177,44,0.4)] active:scale-[0.98]"
                >
                  <span>Book Now</span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default UmbrellaFeaturedKashiRitual;
