import { BookOpen, Users, Calendar, Package, HeartHandshake, Laptop } from "lucide-react";

const YagyaWhyVedaStructure = () => {
  const features = [
    {
      title: "Defined Ritual Configuration",
      desc: "Clear shastric specifications detailing presiding deities, mantra commitments, and traditional sequence.",
      icon: BookOpen,
    },
    {
      title: "Pandit Coordination",
      desc: "Carefully designated teams of Vedic Purohits proficient in proper Yajurvedic and Samavedic intonation.",
      icon: Users,
    },
    {
      title: "Multi-Day Scheduling",
      desc: "Disciplined scheduling coordinating daily 5-hour ritual sessions across consecutive days.",
      icon: Calendar,
    },
    {
      title: "Samagri Management",
      desc: "Systematic coordination of 100% pure herbal oblations, sacred wood samidha, and unadulterated cow ghee.",
      icon: Package,
    },
    {
      title: "Sankalpa Details",
      desc: "Thorough recording and dedicated pronunciation of family Gotra, Nakshatra, Rashi, and ritual intentions.",
      icon: HeartHandshake,
    },
    {
      title: "Digital Booking & Updates",
      desc: "Transparent coordination with completion updates and energized sacred prasad dispatch.",
      icon: Laptop,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            THE VEDA STRUCTURE DISCIPLINE
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            A Structured Approach to Vedic Yagya
          </h2>
          <p className="mx-auto mt-4 max-w-[740px] font-serif text-[16px] font-medium leading-relaxed text-[#45372a] sm:text-[17.5px]">
            A multi-day Yagya requires more than selecting a ritual. It involves duration, scheduling, Pandit coordination,
            Samagri, Sankalpa and completion planning. Veda Structure brings these arrangements together in one structured experience.
          </p>
        </div>

        {/* 6 Feature Blocks Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group flex flex-col justify-between rounded-[22px] border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722] transition-colors group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-serif text-[19px] font-bold text-[#2b241d]">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                    {feat.desc}
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

export default YagyaWhyVedaStructure;
