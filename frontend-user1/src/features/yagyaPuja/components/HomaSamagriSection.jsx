import { Package, Flame, Sparkles, Droplets, Trees, Flower2, Gift, Info } from "lucide-react";

const HomaSamagriSection = () => {
  const items = [
    {
      title: "Havan Samagri",
      desc: "Sacred mixture of fragrant herbs, guggal, dhoop, and medicinal woods.",
      status: "Included",
      icon: Package,
    },
    {
      title: "Pure Cow Ghrita",
      desc: "Desi cow ghee consecrated as the primary prana-oblation for Agni.",
      status: "Included",
      icon: Droplets,
    },
    {
      title: "Sacred Herbs",
      desc: "Specific botanical herbs (e.g. Durva, Belpatra, Amrita) suited to the deity.",
      status: "Included",
      icon: Sparkles,
    },
    {
      title: "Dhanya (Sacred Grains)",
      desc: "Whole grains (Akshat, Til, Navadhanya) offered with sacred mantras.",
      status: "Included",
      icon: Flame,
    },
    {
      title: "Wood / Samidha",
      desc: "Specific dry sacred twigs (Palash, Peepal, Shami, Khadira) for the fire altar.",
      status: "Included",
      icon: Trees,
    },
    {
      title: "Flowers & Garlands",
      desc: "Fresh, unblemished seasonal flowers, lotus petals, and Bilva leaves.",
      status: "Included",
      icon: Flower2,
    },
    {
      title: "Special Offerings",
      desc: "Modaks, sugarcane, lotus seeds, or red silk vastra where prescribed.",
      status: "Optional / Specific",
      icon: Gift,
    },
    {
      title: "Other Ritual Materials",
      desc: "Panchamrit, camphor, dry coconut for Purnahuti, and silver coins.",
      status: "Additional / As Configured",
      icon: Package,
    },
  ];

  return (
    <section className="border-b border-[#ebdcc4] bg-[#fffdfa] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mx-auto max-w-[780px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
            SACRED OFFERING ELEMENTS
          </p>
          <h2 className="mt-2.5 font-serif text-[28px] font-semibold text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            Samagri According to the Homa
          </h2>
          <p className="mx-auto mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-[#685c4f] sm:text-[15.5px]">
            The sacred oblations vary precisely according to the presiding deity, Shastric texts, and configured Havan scale. Every item is verified for purity prior to ignition.
          </p>
        </div>

        {/* 8 Items Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between rounded-[20px] border border-[#e4d1b8] bg-[#fffaf2] p-5 shadow-[0_4px_16px_rgba(80,50,20,0.03)] transition hover:border-[#c77722]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4e6d1] text-[#9c5a17]">
                      <Icon size={18} />
                    </div>
                    <span className="rounded-full bg-[#f8eedf] px-2.5 py-0.5 text-[10.5px] font-semibold text-[#8c591c]">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-[17px] font-bold text-[#2b241d]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#685c4f]">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shastric Transparency Banner */}
        <div className="mx-auto mt-10 max-w-[820px] rounded-2xl border border-[#d8b584] bg-[#fffaf0] p-4 text-center text-[13px] text-[#705c48]">
          <div className="flex items-center justify-center gap-2">
            <Info size={15} className="text-[#c77722]" />
            <span>
              In accordance with Veda Structure architecture, each specific Homa service explicitly defines items as <strong>Included</strong>, <strong>Optional</strong>, <strong>Additional</strong>, or <strong>Not Required</strong>.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomaSamagriSection;
