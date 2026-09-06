import { User, Users, Globe, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import pujaSankalpaImg from "../../../assets/images/puja/puja-sankalpa.webp.png";
import pujaFamilyImg from "../../../assets/images/puja/puja-family.webp.png";
import pujaRemoteImg from "../../../assets/images/puja/puja-remote.webp.png";

const modes = [
  {
    key: "individual",
    title: "Individual Puja",
    highlight: "Perform a Puja with your personal Sankalpa.",
    description:
      "A dedicated ritual focused on your personal spiritual goals, birthday, Janma Nakshatra Shanti, or life milestone. The primary Sankalpa is uttered strictly in your name and Gotra with focused Ahutis.",
    image: pujaSankalpaImg,
    alt: "Devotee performing personal Sankalpa during dedicated Vedic Puja",
    icon: User,
    badgeLabel: "Personal Vidhi",
    points: [
      "Single-devotee Gotra & Nakshatra declaration",
      "Focused archana on personal planetary alignment",
    ],
    ctaText: "Explore Individual Pujas",
  },
  {
    key: "family",
    title: "Family Puja",
    highlight: "Include family members within the Sankalpa and ritual arrangement.",
    description:
      "Comprehensive family rituals invoking Kuldevi/Kuldevta, Griha Shanti, and lineage wellbeing. Names and Janma Nakshatras of spouse, parents, and children are collectively recited in the Sankalpa.",
    image: pujaFamilyImg,
    alt: "Family participating together in sacred Vedic Puja",
    icon: Users,
    badgeLabel: "Family Wellbeing",
    points: [
      "Collective Gotra & family member names in Sankalpa",
      "Kuldevi/Kuldevta blessings & Griha Shanti prayers",
    ],
    ctaText: "Explore Family Pujas",
  },
  {
    key: "remote",
    title: "Remote Puja",
    highlight: "Selected Pujas arranged for devotees who cannot be physically present.",
    description:
      "Priests in Kashi recite your Gotra Sankalpa on the holy Ganga ghats or consecrated shrines. Receive ritual video updates and sanctified prasad delivered safely to your home.",
    image: pujaRemoteImg,
    alt: "Coordinated Remote Vedic Puja streaming and sanctified prasad packaging",
    icon: Globe,
    badgeLabel: "Worldwide Devotees",
    points: [
      "Consecrated Kashi shrine or Ganga ghat Sankalpa",
      "Ritual video updates & doorstep Prasad delivery",
    ],
    ctaText: "Explore Remote Pujas",
  },
];

const PujaArrangementModes = ({ onFilterMode }) => {
  const handleCtaClick = (modeType) => {
    if (onFilterMode) onFilterMode(modeType);
    const el = document.getElementById("puja-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffcf7] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">

        {/* ── Section Header ── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Arrangement Modes
            </span>
          </div>

          <h2 className="mt-5 font-serif leading-[1.15]">
            <span className="block text-[24px] font-semibold text-[#2b241d] sm:text-[30px] lg:text-[36px]">
              Puja For You, Your Family or
            </span>
            <span className="block text-[32px] font-bold text-[#c77722] sm:text-[40px] lg:text-[44px]">
              From Anywhere
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block h-[2px] w-10 rounded-full bg-[#c77722]/50 sm:w-14"
              />
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[640px] text-[14.5px] leading-[1.75] text-[#5c4e3f] sm:text-[15.5px]">
            Tailor your ritual arrangement according to who participates and your physical presence.
          </p>

          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/70"
          >
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
          </div>
        </div>

        {/* ── 3 Unified Visual Arrangement Cards ── */}
        <div className="mt-12 grid gap-7 sm:gap-8 lg:grid-cols-3 items-stretch">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.key}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#ebdcc4] bg-[#fffdfa] shadow-[0_4px_16px_rgba(60,40,15,0.05)] transition-all duration-300 hover:border-[#c77722] hover:shadow-[0_12px_32px_rgba(199,119,34,0.12)]"
              >
                <div>
                  {/* Image Frame (Equal Height Across All 3 Cards) */}
                  <div className="relative h-[200px] w-full overflow-hidden bg-[#241a12] sm:h-[210px]">
                    <img
                      src={mode.image}
                      alt={mode.alt}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                    />

                    {/* Ambient subtle warm dark bottom gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1109]/85 via-[#1a1109]/20 to-transparent" />

                    {/* Upper-Left Subtle Icon Badge */}
                    <div className="absolute top-3.5 left-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-[#1a1109]/60 text-[#f5ce6f] shadow-xs backdrop-blur-xs">
                      <Icon size={17} />
                    </div>

                    {/* Lower-Left Category Pill */}
                    <div className="absolute bottom-3.5 left-4">
                      <span className="inline-flex items-center rounded-full border border-[#eab12c]/35 bg-[#1a1109]/75 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f5ce6f] backdrop-blur-xs">
                        {mode.badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Content Area */}
                  <div className="p-6 sm:p-7">
                    <h3 className="font-serif text-[22px] font-bold text-[#2b241d] transition-colors duration-250 group-hover:text-[#b36c1e]">
                      {mode.title}
                    </h3>

                    <p className="mt-1.5 text-[13px] font-semibold text-[#b36c1e]">
                      {mode.highlight}
                    </p>

                    <p className="mt-2.5 text-[13px] leading-[1.65] text-[#685c4f]">
                      {mode.description}
                    </p>

                    {/* Supporting Points */}
                    <div className="mt-5 space-y-2 text-[12px] text-[#756653]">
                      {mode.points.map((point) => (
                        <div key={point} className="flex items-center gap-2">
                          <ShieldCheck size={14} className="shrink-0 text-[#b36c1e]" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom-Aligned CTA (Consistent Styling Across All 3 Cards) */}
                <div className="p-6 pt-0 sm:p-7 sm:pt-0">
                  <div className="border-t border-[#f0e2cd] pt-4">
                    <button
                      type="button"
                      onClick={() => handleCtaClick(mode.key)}
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#d6b8a0] bg-[#fffdfa] py-3 text-[13px] font-bold text-[#2b241d] shadow-2xs transition-all duration-300 hover:border-[#eab12c] hover:bg-[#eab12c] hover:text-[#1c1308] cursor-pointer"
                    >
                      <span>{mode.ctaText}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PujaArrangementModes;
