import { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, Users, Package, Gift, ArrowRight, Info, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PATH_CATALOGUE_LIST } from "../data/pathCatalogueData";

const PathConfigurationPreview = () => {
  const defaultPath = PATH_CATALOGUE_LIST[1]; // Durga Saptashati Path
  const [selectedSlug, setSelectedSlug] = useState(defaultPath.slug);

  const activePath =
    PATH_CATALOGUE_LIST.find((p) => p.slug === selectedSlug) || defaultPath;

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            TRANSPARENT ARCHITECTURE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            See Your Path Plan Before You Book
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Preview how your selected scripture, format choice, chapter targets, and scholar allocations harmonize into a disciplined recitation plan.
          </p>
        </div>

        {/* Quick Path Switcher */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {PATH_CATALOGUE_LIST.slice(0, 4).map((path) => (
            <button
              key={path.slug}
              type="button"
              onClick={() => setSelectedSlug(path.slug)}
              className={`rounded-full px-4 py-1.5 text-[12.5px] font-medium transition cursor-pointer ${
                selectedSlug === path.slug
                  ? "bg-[#2b241d] text-[#fbf5eb] shadow-xs"
                  : "border border-[#d6b8a0] bg-white text-[#5c4e3f] hover:border-[#c77722]"
              }`}
            >
              {path.name}
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
                  YOUR PATH PLAN
                </span>
              </div>
              <span className="rounded-full bg-[#2b241d] px-3 py-0.5 text-[11px] font-semibold text-[#f7ecd5]">
                Architecture Preview
              </span>
            </div>
            <h3 className="mt-2 font-serif text-[24px] font-bold text-[#2b241d] sm:text-[28px]">
              {activePath.name}
            </h3>
            <p className="text-[13px] text-[#6b5d4e]">
              Scripture: <strong>{activePath.scripture}</strong>
            </p>
          </div>

          {/* Configuration Grid */}
          <div className="grid gap-px bg-[#ebdcc4] sm:grid-cols-2">
            {/* Format & Duration */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <BookOpen size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Format & Duration
                </span>
                <span className="mt-1 block font-serif text-[18px] font-bold text-[#2b241d]">
                  Multi-Day • 3 Days
                </span>
                <span className="text-[12px] text-[#786959]">
                  Structured Chapter Divisions
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
                  {activePath.minimumPandits} – {activePath.recommendedPandits} Initiated Scholars
                </span>
              </div>
            </div>

            {/* Daily Recitation */}
            <div className="flex items-start gap-3 bg-[#fffdfa] p-5">
              <Clock size={18} className="mt-0.5 shrink-0 text-[#c77722]" />
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8c7e6c]">
                  Daily Recitation Target
                </span>
                <span className="mt-1 block font-serif text-[18px] font-bold text-[#2b241d]">
                  As Configured
                </span>
                <span className="text-[12px] text-[#786959]">
                  {activePath.dailyRecitationTarget || "Structured Daily Chapters"}
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
                  Individual & Family Gotra Consecration
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
                  Expected Completion (Sample Preview)
                </span>
                <span className="mt-1 block font-serif text-[17px] font-semibold text-[#2b241d]">
                  14 September 2026
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
                  As Applicable
                </span>
                <span className="text-[11.5px] text-[#8a7a6b]">
                  Granth, Ghee Lamp, Roli & Archana Items
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
                  Blessed Kumkum & Raksha Sutra (Where Supported)
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
                  ₹{activePath.startingPrice?.toLocaleString("en-IN") || "XX,XXX"}
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Link
                  to={`/yagya-puja/path/${activePath.slug}`}
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

            {/* Architecture Disclaimer Banner */}
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#e2cca8] bg-[#faf0dc] p-3.5 text-[12px] leading-relaxed text-[#755c3f]">
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

export default PathConfigurationPreview;
