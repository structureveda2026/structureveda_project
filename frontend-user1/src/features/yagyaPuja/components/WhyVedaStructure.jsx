import {
  SlidersHorizontal,
  UserCheck,
  FileCheck2,
  PackageCheck,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";

const WHY_POINTS = [
  {
    icon: SlidersHorizontal,
    title: "Ritual-Specific Configuration",
    description:
      "Customize deity offerings, mantra counts, gotra invocations, and individual family preferences without ambiguity.",
  },
  {
    icon: UserCheck,
    title: "Pandit Coordination",
    description:
      "Experienced, Vedic-certified acharyas and purohits dedicated to maintaining the sacred sanctity of every ritual.",
  },
  {
    icon: FileCheck2,
    title: "Sankalpa Management",
    description:
      "Your exact name, gotra, birth nakshatra, and prayer intentions are recorded and recited during the pratham sankalpa.",
  },
  {
    icon: PackageCheck,
    title: "Pure Samagri Arrangements",
    description:
      "100% authentic, unadulterated herbal samidha, pure cow ghee, Ganga jal, and sacred offerings arranged in advance.",
  },
  {
    icon: CalendarCheck,
    title: "Transparent Scheduling",
    description:
      "Clear auspicious muhurat timing, estimated durations, and stage-by-stage coordination before the ceremony begins.",
  },
  {
    icon: ShieldCheck,
    title: "Seamless Digital Booking",
    description:
      "Structured online booking, continuous updates, post-ritual videos, and delivery of energized holy prasad.",
  },
];

const WhyVedaStructure = () => {
  return (
    <section className="border-t border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            The Veda Structure Standard
          </p>

          <h2 className="mt-3 font-serif text-[32px] font-semibold text-[#2b241d] sm:text-[40px]">
            Why Choose Veda Structure
          </h2>

          <p className="mx-auto mt-3 max-w-[680px] text-[15px] leading-relaxed text-[#685c4f]">
            We bridge authentic spiritual heritage with modern reliability, ensuring every ritual is conducted with purity, transparency, and reverence.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-[#ebdcc4] bg-white p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_10px_30px_rgba(199,119,34,0.1)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722] transition-colors group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 font-serif text-[18px] font-semibold text-[#2b241d] transition-colors group-hover:text-[#c77722]">
                  {point.title}
                </h3>

                <p className="mt-2 text-[13.5px] leading-relaxed text-[#685c4f]">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyVedaStructure;
