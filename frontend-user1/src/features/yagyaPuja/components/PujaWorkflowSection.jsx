import {
  Compass,
  Sliders,
  FileHeart,
  Eye,
  CheckCircle,
  Flame,
  Gift,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import pujaDevotionalAltarImg from "../../../assets/images/puja/puja-devotional-altar.webp.png";
import pujaRitualSetupImg from "../../../assets/images/puja/puja-ritual-setup.webp.png";
import pujaSankalpaImg from "../../../assets/images/puja/puja-sankalpa.webp.png";
import pujaSamagriImg from "../../../assets/images/puja/puja-samagri.webp.png";
import pujaKashiImg from "../../../assets/images/puja/puja-kashi.webp.png";
import pujaPanditImg from "../../../assets/images/puja/puja-pandit.webp.png";
import pujaPrasadImg from "../../../assets/images/puja/puja-prasad.webp.png";

const steps = [
  {
    step: "01",
    title: "Choose Your Puja",
    description: "Select the sacred ritual according to your spiritual purpose or astrological need.",
    icon: Compass,
    image: pujaDevotionalAltarImg,
    alt: "Sacred Vedic Puja altar and deity worship arrangement",
  },
  {
    step: "02",
    title: "Select Arrangement",
    description: "Choose available duration, date, in-person at Kashi or remote Sankalpa.",
    icon: Sliders,
    image: pujaRitualSetupImg,
    alt: "Auspicious Muhurta and ritual setup arrangement",
  },
  {
    step: "03",
    title: "Share Sankalpa",
    description: "Provide devotee name, Gotra, Janma Nakshatra, and specific intentions.",
    icon: FileHeart,
    image: pujaSankalpaImg,
    alt: "Recording sacred Sankalpa with Gotra and devotional intentions",
  },
  {
    step: "04",
    title: "Review Details",
    description: "Inspect transparent inclusions, Acharya requirements, and ritual schedule.",
    icon: Eye,
    image: pujaSamagriImg,
    alt: "Transparent review of Vedic samagri and ritual inclusions",
  },
  {
    step: "05",
    title: "Confirm Booking",
    description: "Lock the auspicious date and confirm your dedicated ritual arrangement.",
    icon: CheckCircle,
    image: pujaKashiImg,
    alt: "Auspicious date lock and confirmed ceremonial arrangement",
  },
  {
    step: "06",
    title: "Puja Begins",
    description: "The ritual is performed with authentic Vidhi, mantras, and dedicated offerings.",
    icon: Flame,
    image: pujaPanditImg,
    alt: "Vedic Pandits beginning ceremony with holy fire offerings",
  },
  {
    step: "07",
    title: "Completion",
    description: "Conclude with Purnahuti, ritual blessings, and consecrated Prasad dispatch.",
    icon: Gift,
    image: pujaPrasadImg,
    alt: "Ceremonial completion with blessed Prasad and sacred thread",
  },
];

const PujaWorkflowSection = () => {
  const leftSteps = steps.slice(0, 4);
  const rightSteps = steps.slice(4);

  const renderWorkflowCard = (item) => {
    const Icon = item.icon;
    return (
      <div
        key={item.step}
        className="group relative flex flex-col justify-between overflow-hidden rounded-[18px] border border-[#ebdcc4] bg-[#fffdfa] p-4.5 shadow-[0_2px_10px_rgba(60,40,15,0.04)] transition-all duration-300 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_8px_24px_rgba(199,119,34,0.10)] sm:p-5"
      >
        {/* Top Bar: Number + Icon + Arrow */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Step Number Badge */}
            <span className="flex h-7 items-center justify-center rounded-md border border-[#ecdcc3] bg-[#faf2e4]/80 px-2 font-sans text-[11px] font-bold tracking-wider text-[#b36c1e] transition-all duration-300 group-hover:border-[#eab12c] group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
              {item.step}
            </span>

            {/* Compact Supporting Icon */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#eedcc7]/70 bg-[#fffdfa] text-[#b36c1e] transition-all duration-300 group-hover:border-[#eab12c] group-hover:bg-[#eab12c] group-hover:text-[#1c1308]">
              <Icon size={14} />
            </div>
          </div>

          {/* Interaction Cue Arrow */}
          <ArrowRight
            size={14}
            className="text-[#c5b59f] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#c77722]"
          />
        </div>

        {/* Bottom Area: Main Content + Right-Aligned Ritual Visual */}
        <div className="mt-3.5 flex items-end justify-between gap-3.5">
          <div className="flex-1">
            <h3 className="font-serif text-[17px] font-semibold leading-snug text-[#2b241d] transition-colors duration-250 group-hover:text-[#b36c1e] sm:text-[18px]">
              {item.title}
            </h3>
            <p className="mt-1 text-[12.5px] leading-[1.55] text-[#685c4f] sm:text-[13px]">
              {item.description}
            </p>
          </div>

          {/* Compact Integrated Ritual Visual Thumbnail */}
          <div className="relative h-[68px] w-[82px] shrink-0 overflow-hidden rounded-[12px] border border-[#ebdcc4] bg-[#22170f] shadow-2xs transition-all duration-300 group-hover:border-[#c77722]/60 sm:h-[74px] sm:w-[96px]">
            <img
              src={item.image}
              alt={item.alt}
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140c06]/35 to-transparent" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">

        {/* ── Section Header ── */}
        <div className="mb-12 text-center lg:mb-14">
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Transparent Ceremony Arrangement
            </span>
          </div>

          <h2 className="mt-5 font-serif leading-[1.15]">
            <span className="block text-[24px] font-semibold text-[#2b241d] sm:text-[30px] lg:text-[36px]">
              From Sankalpa to
            </span>
            <span className="block text-[32px] font-bold text-[#c77722] sm:text-[40px] lg:text-[44px]">
              Completion
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block h-[2px] w-10 rounded-full bg-[#c77722]/50 sm:w-14"
              />
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[620px] text-[14.5px] leading-[1.75] text-[#5c4e3f] sm:text-[15.5px]">
            A clear and disciplined 7-step sequence ensuring your Vedic ritual is conducted with authenticity and peace of mind.
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

        {/* ── 2-Column Visual Workflow Grid (4 Left / 3 Right on Desktop) ── */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 items-start">
          {/* LEFT COLUMN: Steps 01 to 04 */}
          <div className="space-y-4 sm:space-y-5">
            {leftSteps.map(renderWorkflowCard)}
          </div>

          {/* RIGHT COLUMN: Steps 05 to 07 */}
          <div className="space-y-4 sm:space-y-5">
            {rightSteps.map(renderWorkflowCard)}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PujaWorkflowSection;
