import { CheckCircle2, Check, Sparkles } from "lucide-react";

const PujaPackages = ({ packages = [], selectedPackageId, onSelectPackage }) => {
  if (!packages || packages.length === 0) return null;

  return (
    <section id="packages" className="scroll-mt-20 sm:scroll-mt-24 border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-[700px] text-center sm:mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            SELECT SANKALP TIER
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-semibold leading-tight text-[#2b241d] sm:text-[42px]">
            Choose Your Participation
          </h2>
          <p className="mt-3 text-[15px] text-[#685c4f]">
            Select the participation option that best suits your family and intention.
          </p>
        </div>

        {/* 4 Packages Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => onSelectPackage(pkg.id)}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-[24px] border-2 p-6 transition-all duration-300 ${
                  isSelected
                    ? "border-[#d4872b] bg-gradient-to-b from-[#fff6e6] via-[#fffdf9] to-[#fbf2e3] shadow-[0_16px_40px_rgba(212,135,43,0.2)] ring-2 ring-[#eab12c]/40 -translate-y-1.5"
                    : "border-[#ead8b8] bg-white shadow-[0_6px_20px_rgba(80,60,30,0.04)] hover:border-[#d4872b] hover:shadow-[0_12px_30px_rgba(212,135,43,0.1)]"
                }`}
              >
                <div>
                  {/* Top Header & Radio Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[20px] font-bold text-[#2b241d]">
                      {pkg.name}
                    </span>
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                        isSelected
                          ? "border-[#d4872b] bg-[#d4872b] text-white"
                          : "border-[#d6b8a0] bg-white"
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-serif text-[32px] font-bold text-[#2b241d]">
                      {pkg.formattedPrice}
                    </span>
                    <span className="text-[12px] text-[#75695c]">/ Sankalp</span>
                  </div>

                  {/* Subtitle Description */}
                  <p className="mt-2 text-[13px] leading-relaxed text-[#685c4f]">
                    {pkg.description}
                  </p>

                  {/* Features List */}
                  {pkg.includes && (
                    <div className="mt-5 space-y-2 border-t border-[#f0e2cd] pt-4">
                      {pkg.includes.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2 text-[12.5px] text-[#4a3d31]">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#d4872b]" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Select Action */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPackage(pkg.id);
                    }}
                    className={`w-full rounded-full py-2.5 text-[13px] font-bold transition-all ${
                      isSelected
                        ? "bg-[#eab12c] text-[#1c1308] shadow-sm"
                        : "border border-[#d6b8a0] bg-transparent text-[#75695c] group-hover:border-[#d4872b] group-hover:text-[#2b241d]"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Tier"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PujaPackages;
