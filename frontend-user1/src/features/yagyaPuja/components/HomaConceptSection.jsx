import { Sparkles, Flame, ScrollText, Droplets, CheckCircle2 } from "lucide-react";

const STAGES = [
  {
    num: "01",
    title: "Sankalpa",
    subtitle: "Sacred Intention",
    desc: "Formulating the sacred personal, ancestral, or spiritual vow with your Gotra and Nakshatra.",
    icon: Sparkles,
  },
  {
    num: "02",
    title: "Agni Sthapana",
    subtitle: "Fire Invocation",
    desc: "Kindling the consecrated Agni inside the Shastric Havan Kund using sacred Samidha wood.",
    icon: Flame,
  },
  {
    num: "03",
    title: "Veda Mantra",
    subtitle: "Chanted Swara",
    desc: "Chanting prescribed Samhita hymns, Suktas, and Beeja mantras by initiated Acharyas.",
    icon: ScrollText,
  },
  {
    num: "04",
    title: "Ahuti",
    subtitle: "Sacred Offerings",
    desc: "Offering pure cow ghee (ghrita), botanical herbs, and sacred grains directly into the flames.",
    icon: Droplets,
  },
  {
    num: "05",
    title: "Purnahuti",
    subtitle: "Fulfillment",
    desc: "Final supreme oblation with dry coconut, silk vastra, Aarti, and distribution of Agni Bhasma.",
    icon: CheckCircle2,
  },
];

const HomaConceptSection = () => {
  return (
    <section className="border-b border-[#EAD8B8] bg-[#FFFDF9] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F]">
            VEDIC FOUNDATIONS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#29231B] sm:text-[34px] lg:text-[38px]">
            The Five Sacred Stages of Homa
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#766D60]">
            In Vedic cosmology, Agni is revered as Havya-vahana—the divine messenger carrying consecrated oblations directly to the devatas. Every Homa follows a disciplined five-fold sequence.
          </p>
        </div>

        {/* ── DESKTOP HORIZONTAL CONNECTED TIMELINE (hidden on mobile, visible on lg) ── */}
        <div className="hidden lg:block mt-16">
          {/* Continuous Connecting Guide Rail */}
          <div className="relative">
            <div
              className="absolute top-6 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#EAD8B8] via-[#B7791F] to-[#EAD8B8] z-0"
              aria-hidden="true"
            />

            <div className="grid grid-cols-5 gap-4 relative z-10">
              {STAGES.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.num} className="flex flex-col items-center text-center">
                    {/* Numbered Step Hub */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#B7791F] bg-white text-[#B7791F] shadow-[0_4px_12px_rgba(183,121,31,0.18)] transition-transform duration-300 hover:scale-110">
                      <Icon size={18} />
                    </div>

                    {/* Step Label */}
                    <span className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#B7791F]">
                      STAGE {stage.num}
                    </span>

                    {/* Stage Card */}
                    <div className="mt-2 w-full rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-4.5 shadow-2xs transition-all duration-300 hover:border-[#B7791F] hover:bg-white flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-serif text-[16.5px] font-bold text-[#29231B]">
                          {stage.title}
                        </h3>
                        <span className="text-[11px] font-medium text-[#B7791F] block mt-0.5">
                          {stage.subtitle}
                        </span>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-[#766D60]">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── MOBILE / TABLET CONNECTED VERTICAL TIMELINE (visible on <lg) ── */}
        <div className="lg:hidden mt-10 relative">
          {/* Vertical Connecting Guide Rail */}
          <div
            className="absolute top-4 bottom-4 left-5 w-[2px] bg-gradient-to-b from-[#EAD8B8] via-[#B7791F] to-[#EAD8B8]"
            aria-hidden="true"
          />

          <div className="space-y-6">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.num} className="relative flex items-start gap-4 pl-1">
                  {/* Step Node */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#B7791F] bg-white text-[#B7791F] shadow-xs">
                    <Icon size={16} />
                  </div>

                  {/* Step Card */}
                  <div className="flex-1 rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7791F]">
                        STAGE {stage.num} • {stage.subtitle}
                      </span>
                    </div>
                    <h3 className="mt-1 font-serif text-[16px] font-bold text-[#29231B]">
                      {stage.title}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#766D60]">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomaConceptSection;
