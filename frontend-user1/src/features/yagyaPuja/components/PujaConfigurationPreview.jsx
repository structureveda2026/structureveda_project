import { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, Users, Package, Gift, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { PUJA_CATALOGUE_LIST } from "../data/pujaCatalogueData";

const PujaConfigurationPreview = () => {
  // Demo configuration preview model (architecture ready for future backend values)
  const defaultService = PUJA_CATALOGUE_LIST[1] || PUJA_CATALOGUE_LIST[0]; // Maha Mrityunjaya Puja
  const [selectedSlug, setSelectedSlug] = useState(defaultService.slug);

  const activeService = PUJA_CATALOGUE_LIST.find((s) => s.slug === selectedSlug) || defaultService;

  const parameterTiles = [
    {
      label: "Duration",
      value: activeService.duration || (activeService.availableDurations ? activeService.availableDurations[0] : "3 Hours"),
      icon: Clock,
    },
    {
      label: "Date",
      value: "12 September 2026",
      icon: Calendar,
    },
    {
      label: "Time",
      value: "Available Slot",
      icon: Clock,
    },
    {
      label: "Pandit Team",
      value: "As Required",
      icon: Users,
    },
    {
      label: "Samagri",
      value: "Included",
      icon: Package,
    },
    {
      label: "Prasad",
      value: "Optional",
      icon: Gift,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">

        {/* ── Section Header ── */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            TRANSPARENT CONFIGURATION
          </p>

          <h2 className="mt-2.5 font-serif text-[28px] font-semibold leading-[1.15] sm:text-[36px] lg:text-[40px]">
            <span className="text-[#2b241d]">
              See Your Puja Plan
            </span>
            <span className="text-[#c77722]">
              {" "}Before You Book
            </span>
          </h2>

          <div className="mx-auto mt-3 h-[2px] w-12 bg-[#c77722]/50" />

          <p className="mx-auto mt-4 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Preview how your Puja arrangement parameters come together into a clear,
            structured plan prior to confirmation.
          </p>
        </div>

        {/* ── Refined Service Selector ── */}
        <div className="mt-9 flex items-center justify-center">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-[16px] border border-[#e4d4bd] bg-[#f8efe2]/60 p-1.5 sm:rounded-full">
            {PUJA_CATALOGUE_LIST.slice(0, 4).map((service) => {
              const isSelected = selectedSlug === service.slug;
              return (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => setSelectedSlug(service.slug)}
                  className={`rounded-full px-4 py-2 text-[12.5px] font-semibold transition-all duration-250 cursor-pointer ${isSelected
                    ? "bg-[#eab12c] text-[#1c1308] shadow-xs"
                    : "text-[#5c4e3f] hover:bg-[#ebdcc4]/45 hover:text-[#2b241d]"
                    }`}
                >
                  {service.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Premium Split-Card Configuration Preview ── */}
        <div className="mx-auto mt-10 max-w-[1060px] overflow-hidden rounded-[26px] border border-[#d8c3a1] bg-[#fffdfa] shadow-[0_16px_40px_rgba(80,60,30,0.07)]">
          <div className="grid lg:grid-cols-12 items-stretch">

            {/* LEFT: Sacred Ritual Visual Panel (42% width) */}
            <div className="relative h-[320px] w-full overflow-hidden bg-[#22170f] sm:h-[380px] lg:col-span-5 lg:h-auto">
              <img
                src={activeService.image}
                alt={activeService.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Ambient bottom-weighted dark gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140c06]/92 via-[#140c06]/35 via-45% to-transparent" />

              {/* Subtle Lower Image Caption */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6">
                <span className="inline-flex items-center rounded-full border border-[#eab12c]/30 bg-[#160d06]/75 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#f5ce6f] backdrop-blur-xs">
                  Sacred Ritual
                </span>
                <h4 className="mt-1.5 font-serif text-[22px] font-bold leading-tight text-[#faf4e8] sm:text-[24px]">
                  {activeService.name}
                </h4>
                <p className="mt-1 text-[12.5px] text-[#eedcc5]/90">
                  {activeService.deity} • {activeService.purpose || "Dedicated Vidhi"}
                </p>
              </div>
            </div>

            {/* RIGHT: Configuration Parameter Details (58% width) */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
              <div>
                {/* Plan Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f0e2cd] pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#c77722]" />
                    <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#8a571c]">
                      Your Puja Plan
                    </span>
                  </div>
                  <span className="rounded-full bg-[#2b241d] px-3 py-0.5 text-[10.5px] font-semibold tracking-wide text-[#f7ecd5]">
                    Architecture Preview
                  </span>
                </div>

                <div className="mt-3.5">
                  <h3 className="font-serif text-[23px] font-bold leading-snug text-[#2b241d] sm:text-[26px]">
                    {activeService.name}
                  </h3>
                  <p className="mt-0.5 text-[13px] text-[#6b5d4e]">
                    Presiding Deity: <strong className="font-semibold text-[#2b241d]">{activeService.deity}</strong>
                  </p>
                </div>

                {/* ── Independent Parameter Tiles Grid ── */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {parameterTiles.map((tile) => {
                    const Icon = tile.icon;
                    return (
                      <div
                        key={tile.label}
                        className="flex items-start gap-3 rounded-[14px] border border-[#ebdcc4] bg-[#fbf5e9]/60 p-3.5 sm:p-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4e7d1] text-[#b36c1e]">
                          <Icon size={16} />
                        </div>
                        <div>
                          <span className="block font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#8c7e6c]">
                            {tile.label}
                          </span>
                          <span className="mt-0.5 block text-[13.5px] font-semibold text-[#2b241d]">
                            {tile.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Location Tile (Full Width Across Columns) */}
                  <div className="flex items-start gap-3 rounded-[14px] border border-[#ebdcc4] bg-[#fbf5e9]/60 p-3.5 sm:col-span-2 sm:p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f4e7d1] text-[#b36c1e]">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <span className="block font-sans text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#8c7e6c]">
                        Location
                      </span>
                      <span className="mt-0.5 block text-[13.5px] font-semibold text-[#2b241d]">
                        {activeService.locationType || "Kashi / Remote"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Full-Width Card Footer: Total Price & CTA ── */}
          <div className="border-t border-[#ebdcc4] bg-[#fbf5e9] p-6 sm:px-8 sm:py-7">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="block font-sans text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#8c7e6c]">
                  Starting From
                </span>
                <span className="mt-0.5 block font-serif text-[28px] font-bold text-[#2b241d]">
                  {activeService.formattedPrice}
                </span>
              </div>

              <Link
                to={`/yagya-puja/puja/${activeService.slug}`}
                className="group inline-flex items-center gap-2 rounded-[14px] bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_16px_rgba(234,177,44,0.28)] transition-all duration-300 hover:bg-[#dda018]"
              >
                <span>Continue Booking</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-[#7d6f5f]">
              <Info size={13} className="shrink-0 text-[#b36c1e]" />
              <span>UI / architecture preview. Exact options and live calendar slots will appear during future configuration step.</span>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PujaConfigurationPreview;
