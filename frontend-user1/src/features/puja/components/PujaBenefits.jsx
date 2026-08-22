import { Sparkles, ShieldCheck, Heart, Sun } from "lucide-react";

const ICON_MAP = {
  Sparkles: Sparkles,
  ShieldCheck: ShieldCheck,
  Heart: Heart,
  Sun: Sun,
};

const PujaBenefits = ({ benefits = [] }) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-[700px] text-center sm:mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            DIVINE BLESSINGS
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-semibold leading-tight text-[#2b241d] sm:text-[42px]">
            Why Perform This Sacred Puja?
          </h2>
          <p className="mt-3 text-[15px] text-[#685c4f]">
            Experiencing the spiritual, karmic, and energetic rewards of authentic Vedic ritual.
          </p>
        </div>

        {/* Benefits Grid (3-4 Cards) */}
        <div className={`grid gap-6 sm:grid-cols-2 ${benefits.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {benefits.map((b, index) => {
            const IconComponent = ICON_MAP[b.icon] || Sparkles;

            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between rounded-[22px] border border-[#e6cca0] bg-white p-6 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4872b] hover:shadow-[0_16px_35px_rgba(212,135,43,0.12)]"
              >
                <div>
                  {/* Icon Circle */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8edd8] text-[#c77722] transition-colors duration-300 group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                    <IconComponent size={22} />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-[20px] font-bold text-[#2b241d]">
                    {b.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {b.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-[#f0e2cd]/60">
                  <span className="text-[11px] font-semibold tracking-wider text-[#d4872b] uppercase">
                    Vedic Merit • 0{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PujaBenefits;
