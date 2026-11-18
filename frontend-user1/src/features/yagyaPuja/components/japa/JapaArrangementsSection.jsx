import { Sparkles, Package, Flame, HeartHandshake, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

/**
 * Section 06: Ritual Arrangements & Included Items
 * Distinguishes core inclusions, Shastric traditions, and delivery items.
 * Transparently reflects Vedic ceremonial requirements without unsupported claims.
 */
const JapaArrangementsSection = () => {
  const arrangements = [
    {
      title: "Consecrated Japa Mala & Asana",
      category: "Ritual Equipment",
      status: "Included as per Tradition",
      statusColor: "bg-[#eaf4ea] text-[#2d6a2d] border-[#bfe0bf]",
      description:
        "Priests recite using traditional counting rosaries matched to the deity: Rudraksha for Shiva, Lal Chandan for Durga, Kamalgatta for Lakshmi, and Tulsi for Vishnu/Hanuman.",
      icon: Sparkles,
    },
    {
      title: "Daily Gotra & Nakshatra Sankalpa",
      category: "Core Ceremonial Anchor",
      status: "Universal Inclusion",
      statusColor: "bg-[#fbf4ea] text-[#8a561c] border-[#ebd8bc]",
      description:
        "Every recitation session opens with your personal Sankalpa, invoking the names of the Yajman and family members with their Vedic Gotra and Janma Nakshatra.",
      icon: HeartHandshake,
    },
    {
      title: "Concluding Purnahuti & Havan",
      category: "Ceremonial Completion",
      status: "Included with Anushthan Packages",
      statusColor: "bg-[#fbf4ea] text-[#8a561c] border-[#ebd8bc]",
      description:
        "Traditional Dashamsha Homa (one-tenth or ritual conclusion) with pure cow ghee, sacred samidha, and herbal ahutis to seal and complete the recited mantra count.",
      icon: Flame,
    },
    {
      title: "Sanctum Prasad & Tracking Dispatch",
      category: "Post-Ritual Delivery",
      status: "Standard Shipment",
      statusColor: "bg-[#eaf4ea] text-[#2d6a2d] border-[#bfe0bf]",
      description:
        "The energized Japa Mala, sacred Raksha Sutra, and sanctum-touched dry Prasad (Vibhuti/Kumkum/Akshat) are carefully packed and couriered to your residence.",
      icon: Package,
    },
  ];

  return (
    <section className="border-b border-[#ead8bc] bg-[#f8f1e6] py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8bc] bg-[#fffcf6] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a561c]">
            <Package size={12} className="text-[#b77920]" />
            <span>Ritual Inclusions</span>
          </div>
          <h2 className="mt-3 font-serif text-[28px] sm:text-[34px] font-bold text-[#30251c]">
            Ritual Arrangements & Vedic Integrity
          </h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#6b5845]">
            Every Mantra Japa is arranged with pure Shastric samagri, initiated Vedic purohits, and transparent
            fulfillment standards.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {arrangements.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-[20px] border border-[#ead8bc] bg-[#fffcf6] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#b77920] hover:shadow-[0_12px_24px_rgba(183,121,32,0.10)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf2e4] text-[#b77920]">
                      <Icon size={22} />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <span className="mt-4 block text-[10.5px] font-bold uppercase tracking-wider text-[#8a725b]">
                    {item.category}
                  </span>
                  <h3 className="mt-1 font-serif text-[17px] font-bold text-[#30251c]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#5c4d3c]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-[#f0e3ce] pt-3 text-[11px] font-medium text-[#8a725b]">
                  Verified Vedic Standard
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JapaArrangementsSection;

