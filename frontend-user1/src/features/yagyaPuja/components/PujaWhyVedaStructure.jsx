import { BookOpen, CalendarCheck, Users, Package, HeartHandshake, MapPin } from "lucide-react";

const PujaWhyVedaStructure = () => {
  const pillars = [
    {
      title: "Traditional Ritual Information",
      description: "Detailed context on prescribed shastric vidhi, presiding deities, mantras, and traditional significance.",
      icon: BookOpen,
    },
    {
      title: "Structured Booking",
      description: "A clear step-by-step arrangement process without ambiguities, hidden parameters, or confusing schedules.",
      icon: CalendarCheck,
    },
    {
      title: "Pandit Coordination",
      description: "Carefully designated Vedic purohits versed in proper pronunciation and ritual discipline.",
      icon: Users,
    },
    {
      title: "Samagri Arrangement",
      description: "Coordination of pure, unadulterated sacred materials required by traditional ritual scriptures.",
      icon: Package,
    },
    {
      title: "Sankalpa Management",
      description: "Careful recording of your personal and family Gotra, Nakshatra, and dedicated devotional intentions.",
      icon: HeartHandshake,
    },
    {
      title: "Kashi-Based Services",
      description: "Direct facilitation of sacred rituals along the holy banks of River Ganga and consecrated Varanasi shrines.",
      icon: MapPin,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            THE VEDA STRUCTURE APPROACH
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Structured Way to Arrange Your Puja
          </h2>
          <p className="mx-auto mt-4 max-w-[740px] font-serif text-[16px] font-medium leading-relaxed text-[#45372a] sm:text-[17.5px]">
            We believe arranging a Puja should be clear and organized. From selecting the ritual to completing your Sankalpa,
            Veda Structure brings the essential arrangements together in one experience.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex flex-col justify-between rounded-[22px] border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722] transition-colors group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-serif text-[19px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
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

export default PujaWhyVedaStructure;
