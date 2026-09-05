import { useState } from "react";
import { Clock, Calendar, Sun, Sparkles, Check, AlertCircle, ArrowRight } from "lucide-react";
import { RECITATION_FORMATS, PATH_CATALOGUE_LIST } from "../data/pathCatalogueData";

const iconMap = {
  single_session: Clock,
  same_day: Sun,
  multi_day: Calendar,
  custom_request: Sparkles,
};

const PathFormatSection = ({ selectedFormatFilter, onSelectFormatFilter }) => {
  // Demo service selector to prove formats are strictly service-specific
  const [activeServiceSlug, setActiveServiceSlug] = useState("sundarkand-path");

  const currentService =
    PATH_CATALOGUE_LIST.find((s) => s.slug === activeServiceSlug) || PATH_CATALOGUE_LIST[0];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            AUTHENTIC ARRANGEMENTS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Choose How Your Path Is Arranged
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Whether you desire a focused morning recitation or an extensive multi-day scripture anushthan, the arrangement is structured according to traditional Shastric guidelines.
          </p>
        </div>

        {/* Interactive Demonstrator: Select a Scripture to observe its specific supported formats */}
        <div className="mt-10 rounded-[24px] border border-[#e6d3ba] bg-[#faf3e3] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-[#e2cca8] pb-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                INTERACTIVE DEMO PREVIEW
              </span>
              <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                Service-Specific Format Availability
              </h3>
              <p className="text-[13px] text-[#6d5c4a]">
                Select a scripture below to see how formats adapt strictly to text length and classical traditions:
              </p>
            </div>

            {/* Quick Switcher */}
            <div className="flex flex-wrap gap-2">
              {PATH_CATALOGUE_LIST.slice(0, 4).map((srv) => (
                <button
                  key={srv.slug}
                  type="button"
                  onClick={() => setActiveServiceSlug(srv.slug)}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition cursor-pointer ${
                    activeServiceSlug === srv.slug
                      ? "bg-[#2b241d] text-[#f7ecd5] shadow-xs"
                      : "border border-[#d6b8a0] bg-white text-[#5c4e3f] hover:border-[#c77722]"
                  }`}
                >
                  {srv.name}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Standard Format Options Display for the active service */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RECITATION_FORMATS.map((fmt) => {
              const Icon = iconMap[fmt.id] || Clock;
              const isSupported = (currentService.availableFormats || []).includes(fmt.id);

              return (
                <div
                  key={fmt.id}
                  className={`relative flex flex-col justify-between rounded-[20px] border p-5 transition-all ${
                    isSupported
                      ? "border-[#d8b584] bg-[#fffdfa] shadow-[0_6px_20px_rgba(80,50,20,0.05)] hover:border-[#c77722]"
                      : "border-[#e0d6c8] bg-[#f5ede2]/60 opacity-60"
                  }`}
                >
                  <div>
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4e4cd] text-[#9c5a17]">
                        <Icon size={16} />
                      </div>
                      {isSupported ? (
                        <span className="rounded-full bg-[#dcf1dc] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1e6628]">
                          Supported
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#eee5d8] px-2.5 py-0.5 text-[10px] font-semibold text-[#827464]">
                          Not Applicable
                        </span>
                      )}
                    </div>

                    <h4 className="mt-3.5 font-serif text-[19px] font-bold text-[#2b241d]">
                      {fmt.label}
                    </h4>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#8a571c]">
                      {fmt.tagline}
                    </span>

                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#685c4f]">
                      {fmt.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#f0e1cb]">
                    {isSupported ? (
                      <button
                        type="button"
                        onClick={() => onSelectFormatFilter && onSelectFormatFilter(fmt.id)}
                        className={`w-full rounded-full py-2 text-[12px] font-bold transition cursor-pointer ${
                          selectedFormatFilter === fmt.id
                            ? "bg-[#c77722] text-white"
                            : "border border-[#caa77a] bg-[#fffcf7] text-[#6d4c1b] hover:bg-[#c77722] hover:text-white"
                        }`}
                      >
                        {selectedFormatFilter === fmt.id ? "Filtering Catalogue" : `Filter by ${fmt.label}`}
                      </button>
                    ) : (
                      <div className="text-center text-[11px] italic text-[#877868]">
                        Unavailable for {currentService.name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Critical Rule Clarification Banner */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#d8b584] bg-[#fffaf0] p-4 text-[12.5px] leading-relaxed text-[#735e47]">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#c77722]" />
            <div>
              <strong>Service-Specific Format Architecture:</strong> Not every scripture supports every format. For instance, a focused Sundarkand is traditionally chanted in a single session, while the complete 18-chapter Bhagavad Gita or 13-chapter Durga Saptashati naturally expands into same-day or multi-day configurations.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathFormatSection;
