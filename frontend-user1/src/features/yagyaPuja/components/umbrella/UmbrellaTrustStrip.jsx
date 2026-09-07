import { MapPin, Flame, Award, ShieldCheck } from "lucide-react";

/**
 * SECTION 3: TRUST STRIP
 * Immediately follows the hero, featuring 4 core trust pillars in a compact, elegant layout.
 */
const UmbrellaTrustStrip = () => {
  const trustItems = [
    {
      title: "Kashi",
      subtitle: "Performed in the sacred land of Kashi",
      icon: MapPin,
    },
    {
      title: "Vedic Method",
      subtitle: "Traditional Vedic procedures",
      icon: Flame,
    },
    {
      title: "Acharyas",
      subtitle: "Experienced Vedic practitioners",
      icon: Award,
    },
    {
      title: "Updates",
      subtitle: "Ritual updates & completion proof",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative z-10 border-b border-[#ebdcc4] bg-[#fffcf7] py-6 sm:py-7 px-5 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-3.5"
              >
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-[#ead8b8] bg-[#f8edd8] text-[#b36c1e] shadow-2xs">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-[14px] sm:text-[15px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[11.5px] sm:text-[12px] leading-snug text-[#65584a]">
                    {item.subtitle}
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

export default UmbrellaTrustStrip;
