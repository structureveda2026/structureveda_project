import { Sparkles, MapPin, Flame, Award, Eye, ShieldCheck } from "lucide-react";

/**
 * SECTION 7: WHY VEDA STRUCTURE
 * 5 Brand Pillars highlighting Kashi sanctity, Shastric rigor, and verifiable transparency.
 */
const UmbrellaWhyVeda = () => {
  const pillars = [
    {
      number: "01",
      title: "Kashi",
      subtitle: "Sacred Geographic Sanctity",
      description: "Rituals performed in the sacred ecosystem of Kashi, along holy Ganga ghats and consecrated shrines.",
      icon: MapPin,
    },
    {
      number: "02",
      title: "Vedic Process",
      subtitle: "Prescribed Shastric Vidhi",
      description: "Traditional procedures with appropriate acoustic mantra pronunciation, personal gotra sankalp, and pure samagri.",
      icon: Flame,
    },
    {
      number: "03",
      title: "Experienced Acharyas",
      subtitle: "Gurukul-Trained Purohits",
      description: "Qualified Vedic practitioners versed in traditional Shakhas and multi-generational ritual discipline.",
      icon: Award,
    },
    {
      number: "04",
      title: "Transparency",
      subtitle: "No Ambiguities",
      description: "Clear service details, itemized samagri inclusions, explicit durations, and transparent pricing without surprises.",
      icon: Eye,
    },
    {
      number: "05",
      title: "Proof",
      subtitle: "Digital Accountability",
      description: "Personalized ritual updates, video recordings of your specific Gotra Sankalpa, and sanctified prasad delivery.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              THE VEDA STRUCTURE STANDARD
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Why Perform Your Ritual with <span className="text-[#c77722]">Veda Structure?</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[700px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f]">
            Uniting classical Sanatana Gurukul traditions with transparent, structured coordination for devotees in India and across the world.
          </p>

          <div aria-hidden="true" className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60">
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            <span className="text-[12px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
          </div>
        </div>

        {/* 5 Brand Pillars Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5 sm:mt-14">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fbf6eb] p-6 shadow-[0_2px_10px_rgba(60,40,15,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_8px_24px_rgba(199,119,34,0.1)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[24px] font-bold text-[#b36c1e]/40 group-hover:text-[#b36c1e] transition-colors">
                      {item.number}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8b8] bg-[#f5ebd7] text-[#b36c1e]">
                      <Icon size={17} />
                    </div>
                  </div>

                  <span className="mt-4 block font-sans text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                    {item.subtitle}
                  </span>

                  <h3 className="mt-1 font-serif text-[18px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-[#65584a]">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UmbrellaWhyVeda;
