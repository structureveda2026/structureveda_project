import { Sparkles, CheckCircle2 } from "lucide-react";

const PujaProcedure = ({ steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[700px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            AUTHENTIC VEDIC VIDHI
          </p>
          <h2 className="mt-3 font-serif text-[32px] font-semibold leading-tight text-[#2b241d] sm:text-[42px]">
            How the Puja is Performed
          </h2>
          <p className="mt-3 text-[15px] text-[#685c4f]">
            A sacred, transparent 4-stage ceremonial process conducted by experienced Kashi Vedic Priests.
          </p>
        </div>

        {/* 4-Step Process Timeline Cards */}
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-[22px] border border-[#e6cca0] bg-[#fffaf0] p-6 shadow-[0_6px_20px_rgba(80,60,30,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4872b] hover:shadow-[0_16px_35px_rgba(212,135,43,0.12)]"
            >
              <div>
                {/* Step Number Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-serif text-[28px] font-bold text-[#d4872b]">
                    {step.step}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[#b36c1e]">
                    <CheckCircle2 size={16} />
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="mt-4 font-serif text-[20px] font-bold text-[#2b241d]">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#685c4f]">
                  {step.description}
                </p>
              </div>

              {/* Bottom Subtle Step Status */}
              <div className="mt-6 border-t border-[#ead8b8] pt-3 text-[11px] font-bold uppercase tracking-wider text-[#b36c1e]">
                Phase 0{idx + 1} of 04
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PujaProcedure;
