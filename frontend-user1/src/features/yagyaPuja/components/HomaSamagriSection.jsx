import React from "react";
import { Package, ShieldCheck, Info, CheckCircle2, Gift, PlusCircle } from "lucide-react";

import homaSamagriBannerImg from "../../../assets/images/samagri/homa-samagri-banner.jpg";
import samagriGheeImg from "../../../assets/images/samagri/samagri-desi-ghee.jpg";
import samagriSamidhaImg from "../../../assets/images/samagri/samagri-samidha-wood.jpg";
import samagriHavanMixImg from "../../../assets/images/samagri/samagri-havan-mix.jpg";
import samagriDhanyaImg from "../../../assets/images/samagri/samagri-dhanya-akshata.jpg";
import samagriPushpaImg from "../../../assets/images/samagri/samagri-pushpa-bilva.jpg";
import samagriSpecialAhutiImg from "../../../assets/images/samagri/samagri-special-ahuti.jpg";
import samagriHerbalImg from "../../../assets/images/samagri/samagri-herbal-decoction.jpg";
import samagriPurnahutiImg from "../../../assets/images/samagri/samagri-purnahuti-coconut.jpg";
import samagriPanchamritImg from "../../../assets/images/samagri/samagri-panchamrit.jpg";
import samagriCopperKundImg from "../../../assets/images/samagri/samagri-copper-agni-kund.jpg";
import { isUnresolvableAsset } from "../../../services/homaCatalogueService";

/**
 * Intelligent image matching for dynamic ritual items
 */
const resolveItemImage = (name, customImg) => {
  if (customImg && !isUnresolvableAsset(customImg)) return customImg;
  const n = (name || "").toLowerCase();
  if (n.includes("ghee") || n.includes("ghrita")) return samagriGheeImg;
  if (n.includes("wood") || n.includes("samidha")) return samagriSamidhaImg;
  if (n.includes("flower") || n.includes("bilva") || n.includes("lotus") || n.includes("pushpa") || n.includes("durva") || n.includes("garland")) return samagriPushpaImg;
  if (n.includes("grain") || n.includes("akshat") || n.includes("dhanya") || n.includes("til") || n.includes("sesame") || n.includes("rice")) return samagriDhanyaImg;
  if (n.includes("modak") || n.includes("sweet") || n.includes("jaggery") || n.includes("fruit") || n.includes("payasam") || n.includes("offering") || n.includes("special") || n.includes("makhana")) return samagriSpecialAhutiImg;
  if (n.includes("herb") || n.includes("decoction") || n.includes("bhasma") || n.includes("vibhuti") || n.includes("juice") || n.includes("water") || n.includes("gangajal") || n.includes("amrita") || n.includes("camphor") || n.includes("sandalwood") || n.includes("kumkum")) return samagriHerbalImg;
  if (n.includes("panchamrit") || n.includes("milk") || n.includes("honey") || n.includes("curd")) return samagriPanchamritImg;
  if (n.includes("coconut") || n.includes("purnahuti") || n.includes("sari") || n.includes("cloth")) return samagriPurnahutiImg;
  if (n.includes("kund") || n.includes("copper") || n.includes("pyramid") || n.includes("idol") || n.includes("yantra") || n.includes("coin") || n.includes("thread") || n.includes("archana")) return samagriCopperKundImg;
  return samagriHavanMixImg;
};

const resolveDefaultDesc = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes("ghrita") || n.includes("ghee")) return "Consecrated A2 desi cow ghee as the primary Prana-oblation for Agni Deva.";
  if (n.includes("wood") || n.includes("samidha")) return "Scripturally prescribed dry twigs for the altar (Palash, Peepal, Shami).";
  if (n.includes("bilva") || n.includes("dhatura")) return "Unblemished sacred Bilva patra and offerings invoking Bhagwan Shiva.";
  if (n.includes("durva")) return "Fresh sacred Durva grass sprigs offered with Vedic Ganapati mantras.";
  if (n.includes("lotus") || n.includes("kamalgatta")) return "Consecrated sacred lotus elements invoking Maha Lakshmi and Kubera.";
  if (n.includes("grain") || n.includes("dhanya") || n.includes("akshata") || n.includes("navadhanya")) return "Consecrated unbroken rice, black til, barley, and sacred navadhanya.";
  if (n.includes("bhasma") || n.includes("vibhuti")) return "Consecrated holy Agni ash blessed during the Purnahuti.";
  if (n.includes("payasam") || n.includes("modak") || n.includes("sweet")) return "Sacred Sattvic naivedyam prepared strictly per traditional vidhi.";
  if (n.includes("vastu")) return "Consecrated Vastu Purusha apparatus and boundary sanctification dravya.";
  return "Authentic Shastric material freshly inspected and prepared per Vedic Vidhi.";
};

const getStatusBadge = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("included")) {
    return {
      label: "Included",
      className: "bg-[#eaf5ea] text-[#2b7a35] border-[#c1e2c6]",
    };
  }
  if (s.includes("optional")) {
    return {
      label: "Optional",
      className: "bg-[#FFF9EE] text-[#B7791F] border-[#EAD8B8]",
    };
  }
  if (s.includes("additional")) {
    return {
      label: "Additional",
      className: "bg-[#F7F4EE] text-[#766D60] border-[#E5DECF]",
    };
  }
  if (s.includes("not required") || s.includes("not_required")) {
    return {
      label: "Not Required",
      className: "bg-[#EEF4FB] text-[#1D5E9E] border-[#CFDFEF]",
    };
  }
  return {
    label: status || "Included",
    className: "bg-[#eaf5ea] text-[#2b7a35] border-[#c1e2c6]",
  };
};

export default function HomaSamagriSection({ service }) {
  const rawSamagri = Array.isArray(service?.samagri) ? service.samagri : [];

  if (!service || rawSamagri.length === 0) {
    return null;
  }

  // Normalize dynamic Samagri items directly from the service data
  const normalizedItems = rawSamagri.map((item) => {
    const name = typeof item === "string" ? item : item.name || item.title || "";
    const rawStatus = typeof item === "object" && item.status ? item.status : "Included";
    const desc =
      typeof item === "object" && (item.description || item.desc)
        ? item.description || item.desc
        : resolveDefaultDesc(name);
    const customImg = typeof item === "object" ? item.image : null;
    const image = resolveItemImage(name, customImg);

    return {
      name,
      status: rawStatus,
      desc,
      image,
      alt: `${name} sacred Vedic offering`,
    };
  }).filter((i) => i.name.trim());

  // Left Column items: Included in Every Ceremony
  const includedItems = normalizedItems.filter((i) => {
    const s = i.status.toLowerCase();
    return s.includes("included") || (!s.includes("optional") && !s.includes("additional") && !s.includes("not required"));
  });

  // Ceremony-Specific / Optional Items
  const optionalItems = normalizedItems.filter((i) => {
    const s = i.status.toLowerCase();
    return s.includes("optional") || s.includes("deity") || s.includes("ceremony");
  });

  // Additional / As Configured Items
  const additionalItems = normalizedItems.filter((i) => {
    const s = i.status.toLowerCase();
    return s.includes("additional") || s.includes("configured");
  });

  // Not Required Items
  const notRequiredItems = normalizedItems.filter((i) => {
    const s = i.status.toLowerCase();
    return s.includes("not required") || s.includes("not_required");
  });

  // Construct Right Column 3 Groups
  const rightColumnGroups = [
    {
      title: "Ceremony-Specific Offerings",
      groupBadge: "Deity Specific",
      groupBadgeStyle: "bg-[#FFF9EE] text-[#B7791F] border-[#EAD8B8]",
      icon: Gift,
      description: "Oblations prescribed strictly per traditional Shastras for the presiding deity.",
      items: optionalItems.length > 0 ? optionalItems : [
        {
          name: "Deity Specific Ahuti Offerings",
          desc: "Consecrated herbal decoctions, botanical Ahutis, and dry fruits prescribed for this invocation.",
          image: samagriSpecialAhutiImg,
          alt: "Special Vedic Ahuti offerings",
          status: "Optional",
        },
      ],
    },
    {
      title: "Additional / As Configured",
      groupBadge: "As Configured",
      groupBadgeStyle: "bg-[#F7F4EE] text-[#766D60] border-[#E5DECF]",
      icon: PlusCircle,
      description: "Extended sacred materials aligned with Anushthan scale and multi-day duration.",
      items: additionalItems.length > 0 ? additionalItems : [
        {
          name: "Purnahuti Coconut & Dravya",
          desc: "Consecrated whole dry coconut wrapped in silk with holy thread and silver coin.",
          image: samagriPurnahutiImg,
          alt: "Purnahuti consecrated dry coconut",
          status: "Additional",
        },
        {
          name: "Panchamrit Elements",
          desc: "Pure cow milk, fresh curd, golden ghee, raw honey, and pure crystalline mishri.",
          image: samagriPanchamritImg,
          alt: "Five sacred Panchamrit nectars",
          status: "Additional",
        },
      ],
    },
    {
      title: "Arranged by Veda Structure / Not Required from Devotee",
      groupBadge: "Fully Provided",
      groupBadgeStyle: "bg-[#EEF4FB] text-[#1D5E9E] border-[#CFDFEF]",
      icon: ShieldCheck,
      description: "Complete ritual apparatus and hardware supplied directly by the Acharya team.",
      items: notRequiredItems.length > 0 ? notRequiredItems : [
        {
          name: "Copper Agni Kund & Altar",
          desc: "Stepped copper pyramid Havan Kund, wooden Sruk/Sruva ladles, and sacred vessels.",
          image: samagriCopperKundImg,
          alt: "Stepped copper Havan Kund on sacred altar",
          status: "Not Required",
        },
      ],
    },
  ];

  return (
    <section className="border-b border-[#EAD8B8] bg-[#FFFDF9] px-4 py-14 sm:px-6 sm:py-20 lg:px-10" id="samagri-inclusions">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mx-auto max-w-[800px] text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFAF0] border border-[#EAD8B8] text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#B7791F] mb-3 shadow-2xs">
            <Package size={13} className="text-[#C77722]" />
            <span>Sacred Samagri Specifications</span>
          </div>
          <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-[#29231B] leading-tight">
            Samagri &amp; Sacred Inclusions
          </h2>
          <p className="mx-auto mt-3 max-w-[660px] text-[14px] sm:text-[15px] leading-relaxed text-[#766D60]">
            Every fire oblation for {service.name} is curated in strict adherence to Vedic treatises. We supply authenticated botanical herbs, unadulterated cow ghee, and consecrated ritual apparatus for complete spiritual purity.
          </p>
        </div>

        {/* Landscape Hero Banner Image */}
        <div className="relative mb-12 overflow-hidden rounded-[24px] border border-[#EAD8B8] bg-[#1E140C] shadow-md group">
          <div className="aspect-[16/7] sm:aspect-[21/8] lg:aspect-[24/8] w-full overflow-hidden">
            <img
              src={homaSamagriBannerImg}
              alt="Traditional Vedic Havan Kund with sacred fire, brass bowls, ghee and offerings"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#140C06]/85 via-[#140C06]/20 to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-8 sm:right-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#B7791F] backdrop-blur-xs mb-1.5">
                Authentic Shastric Dravya
              </span>
              <h3 className="font-serif text-[18px] sm:text-[22px] font-bold text-white leading-snug drop-shadow-xs">
                Sattvic Ingredients &amp; Pure Oblations
              </h3>
            </div>
            <p className="text-[12px] sm:text-[13px] text-amber-100/90 max-w-[420px] drop-shadow-xs">
              Every item is freshly inspected, unadulterated, and sanctified prior to Havan commencement.
            </p>
          </div>
        </div>

        {/* Two-Column Balanced Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* =========================================================
              LEFT COLUMN: Included in Every Ceremony (col-span-6)
          ========================================================== */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-5 sm:p-6 shadow-2xs">
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-[#EAD8B8]/80 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#EAD8B8] text-[#2b7a35]">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-serif text-[18px] font-bold text-[#29231B]">
                      Included in Every Ceremony
                    </h3>
                    <p className="text-[11.5px] text-[#766D60]">
                      Foundational sacred materials provided by default
                    </p>
                  </div>
                </div>
                <span className="rounded-full px-3 py-1 text-[11px] font-semibold border bg-[#eaf5ea] text-[#2b7a35] border-[#c1e2c6]">
                  Included
                </span>
              </div>

              {/* Dynamic Inclusion Cards */}
              <div className="space-y-3.5">
                {includedItems.map((item, idx) => {
                  const badge = getStatusBadge(item.status);

                  return (
                    <div
                      key={`${item.name}-${idx}`}
                      className="flex items-center gap-4 rounded-xl border border-[#EAD8B8]/70 bg-white p-3 sm:p-3.5 shadow-2xs transition-all hover:border-[#B7791F] hover:shadow-xs"
                    >
                      <div className="h-16 w-16 sm:h-18 sm:w-18 shrink-0 overflow-hidden rounded-xl border border-[#EAD8B8]/80 bg-[#FFFDF9]">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-[14.5px] sm:text-[15.5px] font-bold text-[#29231B] truncate">
                            {item.name}
                          </h4>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border shrink-0 ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <p className="mt-1 text-[12px] sm:text-[12.5px] leading-snug text-[#766D60] line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Three Groups (col-span-6)
          ========================================================== */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {rightColumnGroups.map((group) => {
              const GroupIcon = group.icon;

              return (
                <div
                  key={group.title}
                  className="rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-5 sm:p-6 shadow-2xs transition hover:border-[#B7791F]"
                >
                  {/* Group Header */}
                  <div className="flex items-center justify-between border-b border-[#EAD8B8]/80 pb-3.5 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#EAD8B8] text-[#B7791F]">
                        <GroupIcon size={16} />
                      </div>
                      <div>
                        <h3 className="font-serif text-[17px] font-bold text-[#29231B]">
                          {group.title}
                        </h3>
                        <p className="text-[11.5px] text-[#766D60]">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold border shrink-0 ${group.groupBadgeStyle}`}
                    >
                      {group.groupBadge}
                    </span>
                  </div>

                  {/* Group Items */}
                  <div className="space-y-3">
                    {group.items.map((item, idx) => {
                      const badge = getStatusBadge(item.status);

                      return (
                        <div
                          key={`${item.name}-${idx}`}
                          className="flex items-center gap-4 rounded-xl border border-[#EAD8B8]/70 bg-white p-3 shadow-2xs transition-all hover:border-[#B7791F] hover:shadow-xs"
                        >
                          <div className="h-15 w-15 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-[#EAD8B8]/80 bg-[#FFFDF9]">
                            <img
                              src={item.image}
                              alt={item.alt}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-serif text-[14px] sm:text-[15px] font-bold text-[#29231B] truncate">
                                {item.name}
                              </h4>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border shrink-0 ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11.5px] sm:text-[12px] leading-snug text-[#766D60] line-clamp-2">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shastric Transparency Information Note */}
        <div className="mx-auto mt-10 max-w-[880px] rounded-2xl border border-[#EAD8B8] bg-[#FFFAF0] p-4 text-center text-[13px] text-[#766D60] shadow-2xs">
          <div className="flex items-center justify-center gap-2">
            <Info size={16} className="text-[#B7791F] shrink-0" />
            <span>
              Each specific Homa ceremony itemizes materials as <strong>Included</strong>, <strong>Optional</strong>, <strong>Additional</strong>, or <strong>Not Required</strong> on its service detail page.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
