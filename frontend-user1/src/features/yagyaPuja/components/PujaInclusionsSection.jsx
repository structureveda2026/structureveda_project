import {
  Users,
  Package,
  Scroll,
  Calendar,
  Gift,
  Video,
  Info,
} from "lucide-react";

const PujaInclusionsSection = () => {
  const inclusions = [
    {
      title: "Pandit Coordination",
      description: "Required Pandit team according to the selected Puja.",
      icon: Users,
    },
    {
      title: "Puja Samagri",
      description: "Applicable ritual materials according to the selected service.",
      icon: Package,
    },
    {
      title: "Sankalpa",
      description: "Your personal/family ritual intention and required details.",
      icon: Scroll,
    },
    {
      title: "Ritual Schedule",
      description: "Date and available time according to operational availability.",
      icon: Calendar,
    },
    {
      title: "Prasad",
      description: "Where included or selected as an additional option.",
      icon: Gift,
    },
    {
      title: "Completion Update",
      description: "Applicable photo/video or completion information.",
      icon: Video,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            TRANSPARENT ARRANGEMENTS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            What Your Puja Arrangement May Include
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            Veda Structure coordinates all essential elements to ensure rituals are conducted with traditional integrity.
          </p>
        </div>

        {/* 6 Inclusions Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inclusions.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex flex-col justify-between rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-6 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
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

        {/* Client Disclaimer Callout */}
        <div className="mt-10 rounded-[16px] border border-[#ebdcc4] bg-[#fcf6eb] p-5 text-center sm:p-6">
          <p className="flex items-center justify-center gap-2 font-serif text-[15.5px] font-medium text-[#2b241d]">
            <Info size={18} className="text-[#b36c1e]" />
            <span>Exact inclusions are shown before you confirm your booking.</span>
          </p>
          <p className="mx-auto mt-1 max-w-[620px] text-[12.5px] text-[#786b5c]">
            Inclusions vary according to ritual complexity, location (Kashi temple or remote vidhi), and chosen configuration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PujaInclusionsSection;
