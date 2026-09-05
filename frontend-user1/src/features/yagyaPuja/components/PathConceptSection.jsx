import { Sparkles, BookOpen, Scroll, CheckCircle2, ArrowRight } from "lucide-react";

const PathConceptSection = () => {
  const steps = [
    {
      num: "01",
      title: "Sankalpa",
      desc: "Sacred consecration aligning personal or family intention with the Granth.",
      icon: Sparkles,
    },
    {
      num: "02",
      title: "Selection",
      desc: "Choosing the authentic scripture, Adhyayas, and appropriate recitation format.",
      icon: BookOpen,
    },
    {
      num: "03",
      title: "Recitation",
      desc: "Systematic chanting by initiated scholars adhering to classical Swara and meter.",
      icon: Scroll,
    },
    {
      num: "04",
      title: "Completion",
      desc: "Purnahuti, concluding Aarti, and sharing of applicable updates.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[820px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            VEDIC RECENSION
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Sacred Words, Recited With Discipline
          </h2>
          <div className="mt-4 space-y-2 text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            <p>
              Path and Recitation involve the systematic reading or chanting of a selected sacred text, Stotra, Mantra or scripture according to the applicable tradition and prescribed procedure.
            </p>
            <p>
              Depending on the selected Path, the recitation may be completed in a single session or structured across multiple days.
            </p>
          </div>
        </div>

        {/* 4-Step Visual Process Progression */}
        <div className="mt-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

                    <h3 className="mt-4 font-serif text-[19px] font-bold text-[#2b241d]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#6d5e4f]">
                      {step.desc}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-[#d4872b]">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shastric Procedural Note */}
        <div className="mx-auto mt-10 max-w-[820px] rounded-2xl border border-[#e4d1b8] bg-[#fbf5eb] p-4 text-center text-[13px] text-[#6d5c4b]">
          <p>
            <strong>Prescribed Procedural Diversity:</strong> In classical traditions, a brief Stotra like Aditya Hridaya may take under two hours, whereas a full Ramcharitmanas Navah Parayan spans nine dedicated days with multiple relay Pandits. Veda Structure configures scheduling according to the authentic scale of the chosen scripture.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PathConceptSection;
