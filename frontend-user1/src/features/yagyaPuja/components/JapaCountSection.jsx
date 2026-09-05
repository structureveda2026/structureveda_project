import { useState } from "react";
import { Hash, Check, Clock, Calendar, Users, AlertCircle, ArrowRight } from "lucide-react";
import { STANDARD_JAPA_COUNTS, JAPA_CATALOGUE_LIST } from "../data/japaCatalogueData";

const JapaCountSection = ({ selectedCountFilter, onSelectCountFilter }) => {
  // Demo service selector to prove that availability is service-specific
  const [activeServiceSlug, setActiveServiceSlug] = useState("maha-mrityunjaya-japa");

  const currentService = JAPA_CATALOGUE_LIST.find((s) => s.slug === activeServiceSlug) || JAPA_CATALOGUE_LIST[0];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdf9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            CONFIGURABLE ANUSHTHAN
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Choose Your Japa Count
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Select the prescribed Japa count available for your chosen Mantra. Every service specifies its traditional count variants based on classical Shastric guidelines.
          </p>
        </div>

        {/* Interactive Demonstrator: Select a Mantra to preview its specific supported counts */}
        <div className="mt-10 rounded-[24px] border border-[#e6d3ba] bg-[#faf3e3] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-[#e2cca8] pb-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                INTERACTIVE DEMO PREVIEW
              </span>
              <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                Service-Specific Count Availability
              </h3>
              <p className="text-[13px] text-[#6d5c4a]">
                Choose a Mantra below to observe how counts are strictly service-specific and never globally assumed:
              </p>
            </div>

            {/* Service quick switcher buttons */}
            <div className="flex flex-wrap gap-2">
              {JAPA_CATALOGUE_LIST.slice(0, 4).map((srv) => (
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

          {/* 4 Standard Count Benchmarks Display for the selected service */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARD_JAPA_COUNTS.map((item) => {
              const isSupported = (currentService.availableCounts || []).includes(item.count);
              const variant = (currentService.variants || []).find((v) => v.count === item.count);

              return (
                <div
                  key={item.count}
                  className={`relative flex flex-col justify-between rounded-[20px] border p-5 transition-all ${
                    isSupported
                      ? "border-[#d8b584] bg-[#fffdfa] shadow-[0_6px_20px_rgba(80,50,20,0.05)] hover:border-[#c77722]"
                      : "border-[#e0d6c8] bg-[#f5ede2]/60 opacity-65"
                  }`}
                >
                  <div>
                    {/* Top Status Pill */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8a571c]">
                        <Hash size={12} className="text-[#c77722]" />
                        {item.tagline}
                      </span>
                      {isSupported ? (
                        <span className="rounded-full bg-[#dcf1dc] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1e6628]">
                          Available
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#eee5d8] px-2 py-0.5 text-[10px] font-semibold text-[#827464]">
                          Not Applicable
                        </span>
                      )}
                    </div>

                    {/* Count Heading */}
                    <h4 className="mt-3 font-serif text-[22px] font-bold text-[#2b241d]">
                      {item.label}
                    </h4>

                    <p className="mt-1 text-[12.5px] leading-relaxed text-[#685c4f]">
                      {item.description}
                    </p>

                    {/* Details if supported */}
                    {isSupported && variant && (
                      <div className="mt-4 space-y-2 border-t border-[#f0e1cb] pt-3 text-[12px] text-[#705e4d]">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-[#c77722]" /> Duration:
                          </span>
                          <span className="font-semibold text-[#2b241d]">{variant.estimatedDuration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Users size={12} className="text-[#c77722]" /> Team:
                          </span>
                          <span className="font-semibold text-[#2b241d]">{variant.minimumPandits} – {variant.recommendedPandits} Priests</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[13px] font-bold text-[#2b241d]">
                          <span>Starting from:</span>
                          <span className="text-[#a8641b]">₹{variant.startingPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filter / Explore action */}
                  <div className="mt-5">
                    {isSupported ? (
                      <button
                        type="button"
                        onClick={() => onSelectCountFilter && onSelectCountFilter(item.count)}
                        className={`w-full rounded-full py-2 text-[12px] font-bold transition cursor-pointer ${
                          selectedCountFilter === item.count
                            ? "bg-[#c77722] text-white"
                            : "border border-[#caa77a] bg-[#fffcf7] text-[#6d4c1b] hover:bg-[#c77722] hover:text-white"
                        }`}
                      >
                        {selectedCountFilter === item.count ? "Filtering Catalogue" : `Filter by ${item.label}`}
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

          {/* Critical Business Rule Clarification Note */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#d8b584] bg-[#fffaf0] p-4 text-[12.5px] leading-relaxed text-[#735e47]">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#c77722]" />
            <div>
              <strong>Shastric Architecture Rule:</strong> Not every Mantra traditionally supports all four counts. For example, specific Upasanas are classical 11K/21K vows, whereas Mahamrityunjaya and Gayatri encompass full 1,25,000 Purascharana. The system renders only certified options configured per individual service.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JapaCountSection;
