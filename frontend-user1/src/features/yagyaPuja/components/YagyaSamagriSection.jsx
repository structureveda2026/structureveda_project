import { Package, Flame, Sparkles, Flower2, Wheat, Droplets, Gift, Box } from "lucide-react";

const YagyaSamagriSection = () => {
  const categories = [
    { title: "Yagya Samagri", desc: "Core ceremonial wood, herbs & sacred sticks", icon: Package, defaultStatus: "Included" },
    { title: "Havan Samagri", desc: "108-herb aromatic oblation blends", icon: Flame, defaultStatus: "Included" },
    { title: "Mantra-related Offerings", desc: "Lotus seeds, bilva fruits & guggul", icon: Sparkles, defaultStatus: "Included" },
    { title: "Flowers", desc: "Fresh sacred blossoms & garlands", icon: Flower2, defaultStatus: "Included" },
    { title: "Dhanya", desc: "Navadhanya grains for planetary deities", icon: Wheat, defaultStatus: "Included" },
    { title: "Ghrita", desc: "Pure Desi Cow Ghee for Agni ahutis", icon: Droplets, defaultStatus: "Included" },
    { title: "Special Offerings", desc: "Customized silver coins & silk fabrics", icon: Gift, defaultStatus: "Optional" },
    { title: "Other Ritual Requirements", desc: "Kalash, panchapatra & arghya sets", icon: Box, defaultStatus: "Additional" },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            AUTHENTIC SACRED SUBSTANCES
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Traditional Samagri, Arranged According to the Ritual
          </h2>
          <p className="mx-auto mt-3.5 max-w-[720px] text-[15px] leading-relaxed text-[#5e5143] sm:text-[16px]">
            Every Yagya may require a specific combination of Samagri and offerings. The applicable Samagri is determined
            according to the selected Yagya configuration.
          </p>
        </div>

        {/* 8 Samagri Cards Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="flex flex-col justify-between rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-5 shadow-2xs transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_8px_24px_rgba(199,119,34,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f8edd8] text-[#c77722]">
                      <Icon size={20} />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                        cat.defaultStatus === "Included"
                          ? "bg-[#eef8ee] text-[#2d7a2d]"
                          : cat.defaultStatus === "Optional"
                          ? "bg-[#fcf3e3] text-[#b36c1e]"
                          : "bg-[#f4edf8] text-[#7a2d8a]"
                      }`}
                    >
                      {cat.defaultStatus}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-[18px] font-bold text-[#2b241d]">
                    {cat.title}
                  </h3>

                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#685c4f]">
                    {cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-[16px] border border-[#ebdcc4] bg-[#fbf6ec] p-4 text-center text-[13px] text-[#756653]">
          <p>
            <strong>Note:</strong> Not every Yagya includes every Samagri item. The exact Samagri configuration belongs to the selected Yagya and is transparently reviewed prior to confirmation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default YagyaSamagriSection;
