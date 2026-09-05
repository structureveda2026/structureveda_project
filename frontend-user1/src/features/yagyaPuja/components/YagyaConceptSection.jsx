import { Compass, Sparkles, Flame, ShieldAlert, BookOpen, CheckCircle2 } from "lucide-react";

const YagyaConceptSection = () => {
  const progression = [
    {
      step: "01",
      label: "Sankalpa",
      sanskrit: "संकल्प",
      title: "Defined Intention",
      description: "Personal or family dedication establishing Gotra, Nakshatra, and spiritual objective.",
      icon: Compass,
    },
    {
      step: "02",
      label: "Mantra",
      sanskrit: "मन्त्र",
      title: "Vedic Acoustic Japa",
      description: "Disciplined recitation with committed count commitments performed by designated priests.",
      icon: Sparkles,
    },
    {
      step: "03",
      label: "Agni",
      sanskrit: "अग्नि",
      title: "Consecrated Fire",
      description: "Invocation of the sacred havan kund representing divine cosmic mouth.",
      icon: Flame,
    },
    {
      step: "04",
      label: "Ahuti",
      sanskrit: "आहुति",
      title: "Prescribed Offerings",
      description: "Pure herbal samagri, desi cow ghee, navadhanya, and sacred dravyas offered with svaha.",
      icon: ShieldAlert,
    },
    {
      step: "05",
      label: "Vidhi",
      sanskrit: "विधि",
      title: "Shastric Sequence",
      description: "Multi-day adherence to Mandap puja, Kalash sthapana, and continuous ritual discipline.",
      icon: BookOpen,
    },
    {
      step: "06",
      label: "Completion",
      sanskrit: "पूर्णाहुति",
      title: "Purnahuti & Dedication",
      description: "Final sacred offering, Vasordhara continuous stream, and formal ritual completion.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            THE FOUNDATIONAL DIFFERENCE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Yagya Is More Than a Single Ritual
          </h2>
          <p className="mx-auto mt-3.5 max-w-[760px] text-[15px] leading-relaxed text-[#5e5143] sm:text-[16px]">
            A Yagya is a structured Vedic ritual involving Sankalpa, Mantra, Agni, prescribed offerings and a defined sequence
            of ritual procedures. Depending on the selected Yagya, the ritual may be performed over multiple days with a defined daily schedule.
          </p>
        </div>

        {/* 6-Stage Process Flow */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {progression.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="relative flex flex-col justify-between rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-5 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8edd8] text-[11px] font-bold text-[#b36c1e]">
                      {item.step}
                    </span>
                    <span className="font-serif text-[12.5px] font-semibold text-[#8a6a32]">
                      {item.sanskrit}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edd8]/80 text-[#c77722]">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-3 font-serif text-[18px] font-bold text-[#2b241d]">
                      {item.label}
                    </h3>
                    <p className="text-[11.5px] font-semibold text-[#a06828]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-[#685c4f]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {idx < progression.length - 1 && (
                  <div className="mt-4 hidden lg:block border-t border-dashed border-[#d8c5a8] pt-2 text-right text-[10.5px] font-semibold text-[#b36c1e]">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default YagyaConceptSection;
