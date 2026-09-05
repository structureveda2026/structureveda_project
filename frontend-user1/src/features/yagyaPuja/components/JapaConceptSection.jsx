import { ArrowRight, Sparkles, Scroll, Hash, CheckCircle2, Shield } from "lucide-react";

const JapaConceptSection = () => {
  const steps = [
    {
      num: "01",
      title: "Sankalpa",
      desc: "Sacred personal intention formulated prior to chanting.",
      icon: Sparkles,
    },
    {
      num: "02",
      title: "Mantra",
      desc: "Prescribed Vedic hymn chosen for the discipline.",
      icon: Scroll,
    },
    {
      num: "03",
      title: "Japa Count",
      desc: "Structured repetitions according to Shastric norms.",
      icon: Hash,
    },
    {
      num: "04",
      title: "Discipline",
      desc: "Continuous cadence, purity, and daily targets.",
      icon: Shield,
    },
    {
      num: "05",
      title: "Completion",
      desc: "Purnahuti, prayer, and concluding reflections.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[820px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            VEDIC FOUNDATIONS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Japa Is the Disciplined Repetition of Mantra
          </h2>
          <div className="mt-4 space-y-2 text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            <p>
              In the Vedic tradition, Japa involves the repeated recitation of a Mantra with focus, discipline and Sankalpa.
            </p>
            <p>
              Different Mantras may be associated with different traditional practices, counts and ritual procedures. The appropriate Japa configuration depends on the selected Mantra and service.
            </p>
          </div>
        </div>

        {/* 5-Step Visual Process Progression */}
        <div className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative flex flex-col justify-between rounded-[20px] border border-[#e8d5bc] bg-[#fffbf4] p-6 shadow-[0_4px_16px_rgba(80,50,20,0.04)] transition duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.12)]"
                >
                  <div>
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#a8641b]">
                        STEP {step.num}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6ecdc] text-[#a8641b]">
                        <Icon size={16} />
                      </div>
                    </div>

                    <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#6d5e4f]">
                      {step.desc}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#d4872b]">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Philosophical Note */}
        <div className="mx-auto mt-10 max-w-[800px] rounded-2xl border border-[#e4d1b8] bg-[#fbf5eb] p-5 text-center text-[13px] text-[#6d5c4b]">
          <p>
            <strong>Shastric Precision:</strong> Japa is performed with adherence to classical Sanskrit pronunciation (Varna-Uchcharana), rhythm (Laya), and sincere devotion, without making speculative guarantees of outcomes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default JapaConceptSection;
