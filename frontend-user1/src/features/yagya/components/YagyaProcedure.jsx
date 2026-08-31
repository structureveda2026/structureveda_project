import { Sparkles } from "lucide-react";

const YagyaProcedure = ({ procedureSteps }) => {
  if (!procedureSteps || procedureSteps.length === 0) return null;

  return (
    <section className="border-b border-[#ead8b8] bg-[#f8edd8] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-[700px] text-center sm:mb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
            AUTHENTIC VIDHI
          </p>
          <h2 className="mt-3 font-serif text-[30px] font-bold leading-tight text-[#2b241d] sm:text-[38px]">
            Sacred Yagya Procedure & Steps
          </h2>
          <p className="mt-3 text-[14.5px] text-[#685c4f]">
            Every step is conducted strictly in accordance with classical Vedic Shastras by consecrated Acharyas.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {procedureSteps.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-2xl border border-[#e6cca0] bg-white p-5 shadow-xs transition hover:border-[#d4872b] hover:shadow-md"
            >
              <div>
                <span className="font-serif text-[28px] font-bold text-[#d4872b]/70">
                  {item.step}
                </span>
                <h3 className="mt-2 font-serif text-[17px] font-bold text-[#2b241d]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5e5143]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YagyaProcedure;
