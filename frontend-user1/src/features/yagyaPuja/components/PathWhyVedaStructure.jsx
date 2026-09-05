import { BookOpen, CalendarCheck, Users, Sparkles, MapPin, Laptop } from "lucide-react";

const PathWhyVedaStructure = () => {
  const pillars = [
    {
      title: "Traditional Text Selection",
      desc: "Authentic Shakha editions, verified chapter divisions, and classical Samput arrangements aligned with tradition.",
      icon: BookOpen,
    },
    {
      title: "Structured Scheduling",
      desc: "Daily session targets formulated around text length and scholar endurance to ensure steady ritual momentum.",
      icon: CalendarCheck,
    },
    {
      title: "Pandit Coordination",
      desc: "Initiated Vedic priests trained in traditional Sanskrit Swara and meter deployed according to scripture scale.",
      icon: Users,
    },
    {
      title: "Sankalpa Management",
      desc: "Formal recording of devotee Gotra, Nakshatra, and personal intentions pronounced during Pratham Sankalpa.",
      icon: Sparkles,
    },
    {
      title: "Kashi-Based Services",
      desc: "Rituals coordinated in the spiritual hub of Varanasi with options for attending in person or remote proxy.",
      icon: MapPin,
    },
    {
      title: "Digital Booking",
      desc: "A transparent, structured digital portal allowing clear review of chapter plans, schedules, and arrangements.",
      icon: Laptop,
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
            A Structured Approach to Sacred Recitation
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            A scripture recitation can involve multiple arrangements—from selecting the appropriate text and determining its schedule to coordinating Pandits and completion. Veda Structure brings these elements together into one organized experience.
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

export default PathWhyVedaStructure;
