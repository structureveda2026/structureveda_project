import { Plane, Compass, Flame, CheckCircle, ArrowRight, Sun, MapPin } from "lucide-react";

const YagyaKashiMultiDayPlanning = () => {
  const stayTimeline = [
    { label: "ARRIVAL", desc: "Arrival in Kashi, settling into accommodation", icon: Plane },
    { label: "SANKALPA", desc: "Formal temple darshan & Gotra Sankalpa preparation", icon: Compass },
    { label: "YAGYA DAY 1", desc: "Altar sanctification & Agni invocation", icon: Flame },
    { label: "MID-DAYS", desc: "Continuous daily 5-hour mantra japa & havan", icon: Sun },
    { label: "FINAL DAY", desc: "Grand Purnahuti, Vasordhara & blessings", icon: Flame },
    { label: "COMPLETION", desc: "Prasad collection, sacred Ganga snaan & departure", icon: CheckCircle },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            PILGRIMAGE & STAY HARMONIZATION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Plan Your Kashi Yagya Around Your Stay
          </h2>
          <p className="mx-auto mt-3 max-w-[700px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Harmonize your multi-day ritual schedule with your visit to Varanasi.
          </p>
        </div>

        {/* Visual Stay Progression Timeline */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {stayTimeline.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="relative flex flex-col justify-between rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-5 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                    <Icon size={19} />
                  </div>
                  <span className="mt-4 block font-serif text-[15px] font-bold text-[#2b241d]">
                    {item.label}
                  </span>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#685c4f]">
                    {item.desc}
                  </p>
                </div>
                {idx < stayTimeline.length - 1 && (
                  <div className="mt-4 hidden lg:block border-t border-dashed border-[#d8c5a8] pt-1 text-right text-[11px] font-bold text-[#b36c1e]">
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Future Planning Considerations Callout */}
        <div className="mt-10 rounded-[20px] border border-[#ebdcc4] bg-[#fbf5e9] p-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-medium text-[#7d6f5f]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-[#c77722]" /> Accommodation Planning
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Compass size={14} className="text-[#c77722]" /> Kashi Darshan Coordination
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Plane size={14} className="text-[#c77722]" /> Travel Logistics
            </span>
          </div>
          <p className="mt-2 text-[12px] text-[#8c7d6d]">
            Planning considerations for traveling devotees. (Independent spiritual coordination; external travel/hospitality services are not mandatory booking components).
          </p>
        </div>
      </div>
    </section>
  );
};

export default YagyaKashiMultiDayPlanning;
