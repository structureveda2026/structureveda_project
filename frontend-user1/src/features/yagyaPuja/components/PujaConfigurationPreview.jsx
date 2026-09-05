import { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, Users, Package, Gift, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { PUJA_CATALOGUE_LIST } from "../data/pujaCatalogueData";

const PujaConfigurationPreview = () => {
  // Demo configuration preview model (architecture ready for future backend values)
  const defaultService = PUJA_CATALOGUE_LIST[1] || PUJA_CATALOGUE_LIST[0]; // Maha Mrityunjaya Puja
  const [selectedSlug, setSelectedSlug] = useState(defaultService.slug);

  const activeService = PUJA_CATALOGUE_LIST.find((s) => s.slug === selectedSlug) || defaultService;

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            TRANSPARENT CONFIGURATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            See Your Puja Plan Before You Book
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Preview how your Puja arrangement parameters come together into a clear, structured plan prior to confirmation.
          </p>
        </div>

        {/* Configuration Selector Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {PUJA_CATALOGUE_LIST.slice(0, 4).map((service) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => setSelectedSlug(service.slug)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition cursor-pointer ${
                selectedSlug === service.slug
                  ? "bg-[#2b241d] text-[#fbf5eb] shadow-xs"
                  : "border border-[#d6b8a0] bg-white text-[#5c4e3f] hover:border-[#c77722]"
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>

        {/* Premium Preview Card */}
        <div className="mx-auto mt-10 max-w-[760px] overflow-hidden rounded-[28px] border border-[#d8c3a1] bg-[#fffdfa] shadow-[0_12px_36px_rgba(80,60,30,0.08)]">
          {/* Top Card Header */}
          <div className="border-b border-[#ebdcc4] bg-gradient-to-r from-[#fbf4e8] via-[#f7ecd5] to-[#f4e2bf] px-6 py-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#c77722]" />
                <span className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#8a571c]">
                  YOUR PUJA PLAN
                </span>
              </div>
              <span className="rounded-full bg-[#2b241d] px-3 py-0.5 text-[11px] font-semibold text-[#f7ecd5]">
                Architecture Preview
              </span>
            </div>
            <h3 className="mt-2 font-serif text-[24px] font-bold text-[#2b241d] sm:text-[28px]">
              {activeService.name}
            </h3>
            <p className="text-[13px] text-[#6b5d4e]">
              Presiding Deity: <strong>{activeService.deity}</strong>
            </p>
          </div>

          {/* Grid of Planned Parameters */}
          <div className="grid gap-px bg-[#ebdcc4] sm:grid-cols-2">
            {/* Duration */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Clock size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Duration
                </span>
                <span className="text-[14.5px] font-semibold text-[#2b241d]">
                  {activeService.duration || "3 Hours"}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Calendar size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Date
                </span>
                <span className="text-[14.5px] font-semibold text-[#2b241d]">
                  12 September 2026
                </span>
              </div>
            </div>

            {/* Time Slot */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Clock size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Time
                </span>
                <span className="text-[14.5px] font-semibold text-[#2b241d]">
                  Available Slot
                </span>
              </div>
            </div>

            {/* Pandit Team */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Users size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Pandit Team
                </span>
                <span className="text-[14.5px] font-semibold text-[#2b241d]">
                  As Required
                </span>
              </div>
            </div>

            {/* Samagri */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Package size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Samagri
                </span>
                <span className="text-[14.5px] font-semibold text-[#2b241d]">
                  Included
                </span>
              </div>
            </div>

            {/* Prasad */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Gift size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Prasad
                </span>
                <span className="text-[14.5px] font-semibold text-[#2b241d]">
                  Optional
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5 sm:col-span-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Location
                </span>
                <span className="text-[14.5px] font-semibold text-[#2b241d]">
                  Kashi / Remote
                </span>
              </div>
            </div>
          </div>

          {/* Total & Action Footer */}
          <div className="border-t border-[#ebdcc4] bg-[#fbf5e9] p-6 sm:p-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Starting From
                </span>
                <span className="font-serif text-[28px] font-bold text-[#2b241d]">
                  {activeService.formattedPrice}
                </span>
              </div>

              <Link
                to={`/yagya-puja/puja/${activeService.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#eab12c] px-8 py-3.5 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.32)] transition hover:bg-[#dda018]"
              >
                <span>Continue Booking</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-[#7d6f5f]">
              <Info size={13} className="text-[#b36c1e]" />
              <span>UI / architecture preview. Exact options and live calendar slots will appear during future configuration step.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PujaConfigurationPreview;
