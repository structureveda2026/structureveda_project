import { useState } from "react";
import { Flame, Check, AlertCircle, ArrowRight } from "lucide-react";
import { STANDARD_HAVAN_COUNTS, HOMA_CATALOGUE_LIST } from "../data/homaCatalogueData";

const HomaCountSection = ({ selectedCountFilter, onSelectCountFilter }) => {
  const [activeServiceSlug, setActiveServiceSlug] = useState("maha-mrityunjaya-homa");
  const currentService =
    HOMA_CATALOGUE_LIST.find((h) => h.slug === activeServiceSlug) || HOMA_CATALOGUE_LIST[0];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#faf4e6] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SACRIFICIAL CADENCE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Choose the Number of Havan
          </h2>
          <p className="mx-auto mt-3 max-w-[660px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Every Homa does not support every configuration. The number of Havans is traditionally prescribed based on the deity, Ahuti targets, and anushthan scale.
          </p>
        </div>

        {/* Interactive Demonstrator Card */}
        <div className="mt-10 rounded-[24px] border border-[#e6d3ba] bg-[#fffdfa] p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-[#e2cca8] pb-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8e5a1e]">
                INTERACTIVE SERVICE SWITCHER
              </span>
              <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                Observed Count Availability for {currentService.name}
              </h3>
              <p className="text-[13px] text-[#6d5c4a]">
                Select another Homa to witness how supported Havan counts adapt strictly per ritual tradition:
              </p>
            </div>

            {/* Quick switcher buttons */}
            <div className="flex flex-wrap gap-2">
              {HOMA_CATALOGUE_LIST.slice(0, 4).map((srv) => (
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

          {/* 6 Standard Count Benchmark Cards Display */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARD_HAVAN_COUNTS.map((item) => {
              const isSupported = (currentService.availableHavanCounts || []).includes(item.count);

              return (
                <div
                  key={item.count}
                  className={`relative flex flex-col justify-between rounded-[20px] border p-5 transition-all ${
                    isSupported
                      ? "border-[#d8b584] bg-[#fffaf1] shadow-[0_4px_16px_rgba(80,50,20,0.03)] hover:border-[#c77722]"
                      : "border-[#e0d6c8] bg-[#f5ede2]/60 opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8a571c]">
                        <Flame size={12} className="text-[#c77722]" />
                        {item.tagline}
                      </span>
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

                    <h4 className="mt-3.5 font-serif text-[21px] font-bold text-[#2b241d]">
                      {item.label}
                    </h4>

                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#685c4f]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#f0e1cb]">
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

          {/* Shastric Rule Banner */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#d8b584] bg-[#fffaf0] p-4 text-[12.5px] leading-relaxed text-[#735e47]">
            <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#c77722]" />
            <div>
              <strong>Service-Specific Havan Dimensions:</strong> Standard Ganapati or Vastu Homas are classical single or 3-Havan ceremonies, whereas extensive Chandi or Maha Mrityunjaya fire rituals support multi-session (5, 7, 11) sacrificial Ahuti offerings. There is no global assumption of universal count support.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomaCountSection;
