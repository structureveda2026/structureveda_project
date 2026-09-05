import { Hash, Users, CalendarCheck, Sparkles, Package, MapPin } from "lucide-react";

const JapaWhyVedaStructure = () => {
  const pillars = [
    {
      title: "Prescribed Japa Counts",
      desc: "Systematic tallying based on classical Shastric benchmarks (11K, 21K, 51K, 125K) rather than arbitrary estimations.",
      icon: Hash,
    },
    {
      title: "Pandit Coordination",
      desc: "Assigning dedicated teams of initiated Vedic priests matched specifically to the chosen mantra's Shakha.",
      icon: Users,
    },
    {
      title: "Completion Scheduling",
      desc: "Disciplined scheduling calculated through daily priest chanting capacities to guarantee steady ritual momentum.",
      icon: CalendarCheck,
    },
    {
      title: "Sankalpa Management",
      desc: "Individual and family gotras, names, and spiritual intentions formally consecrated into daily prayers.",
      icon: Sparkles,
    },
    {
      title: "Ritual Arrangements",
      desc: "Authentic samagri, energized malas, and pristine ritual environments curated according to traditional vidhi.",
      icon: Package,
    },
    {
      title: "Kashi-Based Services",
      desc: "Coordination rooted in the spiritual epicenter of Kashi with options for in-person attendance or remote proxy.",
      icon: MapPin,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[800px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            AUTHENTIC DISCIPLINE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Structured Approach to Mantra Japa
          </h2>
          <p className="mx-auto mt-3 max-w-[660px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            A large-scale Japa involves more than repeating a Mantra. It requires a defined count, chanting capacity, Pandit coordination, schedule and completion planning. Veda Structure brings these elements together into one structured experience.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-[22px] border border-[#e8d7be] bg-[#fffaf2] p-6 shadow-[0_4px_16px_rgba(80,50,20,0.03)] transition duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.09)]"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4e6d1] text-[#9c5a17]">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-4 font-serif text-[19px] font-bold text-[#2b241d]">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {pillar.desc}
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

export default JapaWhyVedaStructure;
