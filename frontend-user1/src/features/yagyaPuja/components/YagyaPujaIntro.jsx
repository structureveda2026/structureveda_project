import { Sparkles, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

const YagyaPujaIntro = () => {
  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
      <div className="mx-auto max-w-[1100px] text-center">
        {/* Eyebrow */}
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
          The Veda Structure Approach
        </p>

        {/* Section Heading */}
        <h2 className="mt-3 font-serif text-[30px] font-semibold text-[#2b241d] sm:text-[38px] lg:text-[42px]">
          Vedic Rituals, Structured With Care
        </h2>

        {/* Descriptive Text */}
        <p className="mx-auto mt-4 max-w-[820px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
          Veda Structure brings together centuries of sacred Vedic traditions into one seamless, transparent experience. Whether you seek personalized deity pujas, powerful fire yagyas, disciplined japa chanting, sacred scriptural recitations, purifying havans, or holy tirtha seva on the ghats of Kashi, every ceremony is structured with authentic samagri, knowledgeable priests, and personalized gotra sankalpa.
        </p>

        {/* 4 Feature Pillars */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <div className="rounded-2xl border border-[#ebdcc4] bg-white p-5 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fbf4e8] text-[#c77722]">
              <Sparkles size={18} />
            </div>
            <h4 className="mt-3 font-serif text-[15px] font-semibold text-[#2b241d]">
              Authentic Vidhi
            </h4>
            <p className="mt-1 text-[12px] text-[#75695c]">
              Strict adherence to Vedic shastras and rituals.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebdcc4] bg-white p-5 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fbf4e8] text-[#c77722]">
              <CheckCircle2 size={18} />
            </div>
            <h4 className="mt-3 font-serif text-[15px] font-semibold text-[#2b241d]">
              Personalized Sankalpa
            </h4>
            <p className="mt-1 text-[12px] text-[#75695c]">
              Individual and family gotra invocation.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebdcc4] bg-white p-5 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fbf4e8] text-[#c77722]">
              <ShieldCheck size={18} />
            </div>
            <h4 className="mt-3 font-serif text-[15px] font-semibold text-[#2b241d]">
              Pure Samagri
            </h4>
            <p className="mt-1 text-[12px] text-[#75695c]">
              Carefully curated herbs, dhoop, and pure offerings.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ebdcc4] bg-white p-5 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#fbf4e8] text-[#c77722]">
              <Heart size={18} />
            </div>
            <h4 className="mt-3 font-serif text-[15px] font-semibold text-[#2b241d]">
              Devotional Care
            </h4>
            <p className="mt-1 text-[12px] text-[#75695c]">
              Digital updates, recordings, and energized prasadam.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YagyaPujaIntro;
