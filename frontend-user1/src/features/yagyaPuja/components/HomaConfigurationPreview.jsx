import { useState } from "react";
import { Sparkles, Flame, Calendar, Clock, MapPin, Users, Package, Gift, ArrowRight, Info, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { HOMA_CATALOGUE_LIST } from "../data/homaCatalogueData";

const HomaConfigurationPreview = () => {
  const defaultHoma = HOMA_CATALOGUE_LIST[0]; // Maha Mrityunjaya Homa
  const [selectedSlug, setSelectedSlug] = useState(defaultHoma.slug);

  const activeHoma =
    HOMA_CATALOGUE_LIST.find((h) => h.slug === selectedSlug) || defaultHoma;

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            TRANSPARENT ARCHITECTURE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            See Your Homa Plan Before You Book
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Preview how your fire ritual dimensions, Ahuti targets, and priest allocations unite into a transparent, disciplined plan.
          </p>
        </div>

        {/* Quick Homa Switcher */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {HOMA_CATALOGUE_LIST.slice(0, 4).map((homa) => (
            <button
              key={homa.slug}
              type="button"
              onClick={() => setSelectedSlug(homa.slug)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition cursor-pointer ${
                selectedSlug === homa.slug
                  ? "bg-[#2b241d] text-[#fbf5eb] shadow-xs"
                  : "border border-[#d6b8a0] bg-white text-[#5c4e3f] hover:border-[#c77722]"
              }`}
            >
              {homa.name}
            </button>
          ))}
        </div>

        {/* Premium Preview Card */}
        <div className="mx-auto mt-10 max-w-[780px] overflow-hidden rounded-[28px] border border-[#d8c3a1] bg-[#fffdfa] shadow-[0_12px_36px_rgba(80,60,30,0.08)]">
          {/* Card Header */}
          <div className="border-b border-[#ebdcc4] bg-gradient-to-r from-[#fbf4e8] via-[#f7ecd5] to-[#f4e2bf] px-6 py-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#c77722]" />
                <span className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#8a571c]">
                  YOUR HOMA PLAN
                </span>
              </div>
              <span className="rounded-full bg-[#2b241d] px-3 py-0.5 text-[11px] font-semibold text-[#f7ecd5]">
                Architecture Preview
              </span>
            </div>
            <h3 className="mt-2 font-serif text-[24px] font-bold text-[#2b241d] sm:text-[28px]">
              {activeHoma.name}
            </h3>
            <p className="text-[13px] text-[#6b5d4e]">
              Deity Tradition: <strong>{activeHoma.homaType}</strong>
            </p>
          </div>

          {/* Configuration Grid */}
          <div className="grid gap-px bg-[#ebdcc4] sm:grid-cols-2">
            {/* Havan Count & Duration */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Flame size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Havan Count & Duration
                </span>
                <span className="mt-1 block font-serif text-[18px] font-bold text-[#2b241d]">
                  5 Havan • 2 Days
                </span>
                <span className="text-[12px] text-[#786959]">
                  Multi-Session Fire Offering
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
                <span className="mt-1 block font-serif text-[18px] font-bold text-[#a8641b]">
                  As Required
                </span>
                <span className="text-[12px] text-[#786959]">
                  {activeHoma.minimumPandits} – {activeHoma.recommendedPandits} Initiated Scholars
                </span>
              </div>
            </div>

            {/* Daily Ritual */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Clock size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Daily Ritual Target
                </span>
                <span className="mt-1 block font-serif text-[18px] font-bold text-[#2b241d]">
                  As Configured
                </span>
                <span className="text-[12px] text-[#786959]">
                  {activeHoma.dailyHours} • Structured Ahutis
                </span>
              </div>
            </div>

            {/* Location & Sankalpa */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Location & Sankalpa
                </span>
                <span className="mt-1 block text-[15px] font-semibold text-[#2b241d]">
                  Kashi • Sankalpa Included
                </span>
                <span className="text-[12px] text-[#786959]">
                  Personal & Family Gotra Recitation
                </span>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Calendar size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Start Date (Sample Preview)
                </span>
                <span className="mt-1 block font-serif text-[17px] font-semibold text-[#2b241d]">
                  12 September 2026
                </span>
                <span className="text-[11.5px] text-[#8a7a6b]">
                  Illustrative commencement date
                </span>
              </div>
            </div>

            {/* Expected Completion */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Completion Date (Sample Preview)
                </span>
                <span className="mt-1 block font-serif text-[17px] font-semibold text-[#2b241d]">
                  13 September 2026
                </span>
                <span className="text-[11.5px] text-[#8a7a6b]">
                  Illustrative Purnahuti date
                </span>
              </div>
            </div>

            {/* Samagri */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Package size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Samagri & Materials
                </span>
                <span className="mt-1 block text-[14px] font-semibold text-[#2b241d]">
                  Included
                </span>
                <span className="text-[11.5px] text-[#8a7a6b]">
                  Havan Samagri, Ghrita, Samidha & Herbs
                </span>
              </div>
            </div>

            {/* Prasad */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Gift size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Prasad Arrangements
                </span>
                <span className="mt-1 block text-[14px] font-semibold text-[#2b241d]">
                  Optional
                </span>
                <span className="text-[11.5px] text-[#8a7a6b]">
                  Sacred Homa Bhasma & Raksha Sutra
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Availability Preview Strip */}
          <div className="border-t border-[#ebdcc4] bg-[#fbf5eb] p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#faedd9] px-2.5 py-0.5 text-[10.5px] font-bold uppercase text-[#8a571c]">
                    Availability: Illustrative Preview
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Illustrative Starting Price
                </div>
                <div className="font-serif text-[28px] font-bold text-[#2b241d]">
                  ₹{activeHoma.startingPrice?.toLocaleString("en-IN") || "XX,XXX"}
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Link
                  to={`/yagya-puja/homa/${activeHoma.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2b241d] px-6 py-3 text-[13.5px] font-semibold text-[#f7ecd5] transition duration-300 hover:bg-[#a8641b] hover:text-white"
                >
                  <span>Continue Booking</span>
                  <ArrowRight size={14} />
                </Link>
                <span className="text-[11px] text-[#8a7c6e]">
                  (Conceptual Architecture Preview)
                </span>
              </div>
            </div>

            {/* Architecture Pipeline Explanation */}
            <div className="mt-5 rounded-xl border border-[#ebd8c1] bg-[#faf0dc] p-3 text-[11.5px] text-[#6d5c4b]">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold text-[#8a571c]">
                <span>Homa</span>
                <span>+</span>
                <span>Havan Count</span>
                <span>+</span>
                <span>Days</span>
                <span>+</span>
                <span>Location</span>
                <span>+</span>
                <span>Pandit Rules</span>
                <span>+</span>
                <span>Samagri</span>
                <span>→</span>
                <span className="rounded-sm bg-[#c77722] px-1.5 py-0.5 text-white">Price & Availability Engine</span>
                <span>→</span>
                <span>Final Homa Plan</span>
              </div>
            </div>

            {/* Architecture Disclaimer Banner */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#e2cca8] bg-[#faf0dc] p-3.5 text-[12px] leading-relaxed text-[#755c3f]">
              <Info size={15} className="mt-0.5 shrink-0 text-[#b36c1e]" />
              <p>
                <strong>Architecture Preview Note:</strong> Illustrative architecture preview. Live dates, Pandit availability, completion schedules and calculated pricing will be generated by the future booking engine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomaConfigurationPreview;
