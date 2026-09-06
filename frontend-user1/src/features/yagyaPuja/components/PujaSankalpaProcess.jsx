import { Sparkles } from "lucide-react";
import pujaSankalpaImg from "../../../assets/images/puja/puja-sankalpa.webp.png";
import pujaRitualSetupImg from "../../../assets/images/puja/puja-ritual-setup.webp.png";
import pujaSamagriImg from "../../../assets/images/puja/puja-samagri.webp.png";
import pujaPanditImg from "../../../assets/images/puja/puja-pandit.webp.png";
import pujaPrasadImg from "../../../assets/images/puja/puja-prasad.webp.png";

const steps = [
  {
    num: "01",
    label: "Sankalpa",
    sanskrit: "संकल्प",
    title: "Defined Intention",
    description:
      "Declare your personal or family Gotra, Janma Nakshatra, and devotional purpose before the deity. This conscious act of dedication anchors the entire ritual to a living, named intention.",
    image: pujaSankalpaImg,
    imageAlt: "Devotee taking Sankalpa holding flowers and holy water during a Vedic ceremony",
    imageCaption: "The Sankalpa is the soul of every Vedic ritual",
  },
  {
    num: "02",
    label: "Selection",
    sanskrit: "चयन",
    title: "Ritual Choice",
    description:
      "Choose the specific Vedic Puja, presiding deity, and prescribed duration that aligns with your spiritual objective — whether for protection, prosperity, peace, or planetary remedy.",
    image: pujaRitualSetupImg,
    imageAlt: "Sacred Puja ritual arrangement with deity, lamp and flowers",
    imageCaption: "Each Puja is matched to its specific spiritual purpose",
  },
  {
    num: "03",
    label: "Arrangement",
    sanskrit: "आयोजन",
    title: "Purohit & Samagri",
    description:
      "Coordination of qualified Vedic priests, pure Shastric offerings, holy Gangajal, and the auspicious muhurta. Every element is sourced and arranged according to tradition.",
    image: pujaSamagriImg,
    imageAlt: "Traditional Vedic Samagri puja offerings arranged on a ritual plate",
    imageCaption: "Shastric samagri prepared with precision and purity",
  },
  {
    num: "04",
    label: "Puja",
    sanskrit: "पूजा",
    title: "Devotional Vidhi",
    description:
      "Avahan, panchamrit abhishekam, acoustic Vedic chanting, archana, and dedicated aarti — performed with uninterrupted Shastric discipline from invocation through to conclusion.",
    image: pujaPanditImg,
    imageAlt: "Vedic Pandit performing puja ritual with fire and offerings",
    imageCaption: "Continuous Vedic chanting through every stage of the vidhi",
  },
  {
    num: "05",
    label: "Completion",
    sanskrit: "पूर्णाहुति",
    title: "Concluding Prayers",
    description:
      "Concluding prayers, formal dedication of merit, and the ceremonial close of the ritual cycle. Applicable consecrated prasad arrangements are coordinated where the ritual permits.",
    image: pujaPrasadImg,
    imageAlt: "Consecrated prasad and sacred offerings at the conclusion of a Puja ceremony",
    imageCaption: "Merit formally dedicated and prayers concluded",
  },
];

const PujaSankalpaProcess = () => {
  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1200px]">

        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-20">

          {/* Eyebrow — editorial section label */}
          <div className="inline-flex items-center gap-2 border-b border-[#c77722]/40 pb-1.5">
            <Sparkles size={11} className="text-[#c77722]" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
              Sacred Intention &amp; Vidhi Flow
            </span>
          </div>

          {/* Two-color heading */}
          <h2 className="mt-5 font-serif leading-[1.18] text-[#2b241d]">
            <span className="block text-[28px] font-semibold sm:text-[34px] lg:text-[42px]">
              Every Puja Begins With a
            </span>
            <span
              className="block text-[36px] font-bold text-[#c77722] sm:text-[44px] lg:text-[52px]"
              style={{ textDecorationColor: "#c77722" }}
            >
              Sankalpa
              {/* Subtle gold underline ornament */}
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block h-[2px] w-16 rounded-full bg-[#c77722]/50 sm:w-20"
              />
            </span>
          </h2>

          {/* Short refined description */}
          <p className="mx-auto mt-5 max-w-[640px] text-[14.5px] leading-[1.75] text-[#5c4e3f] sm:text-[15.5px]">
            In the Vedic tradition, every Puja begins with a conscious{" "}
            <strong className="font-semibold text-[#2b241d]">Sankalpa</strong> — defining the
            devotee's intention, identity, and sacred purpose before the ritual begins.
          </p>

          {/* Decorative editorial divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-7 flex items-center justify-center gap-3 text-[#c77722]/70"
          >
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
            <span className="text-[13px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/35 sm:w-14" />
          </div>
        </div>

        {/* Alternating Editorial Steps */}
        <div className="space-y-16 lg:space-y-20">
          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={step.label}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20 ${
                  !isEven ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* Image Column */}
                <div className={`${!isEven ? "lg:[direction:ltr]" : ""}`}>
                  <div className="group relative">
                    {/* Step badge — absolute, top-left */}
                    <div className="absolute -left-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#fffaf0] bg-[#c77722] shadow-lg">
                      <span className="font-serif text-[13px] font-bold text-white">{step.num}</span>
                    </div>

                    {/* Image frame */}
                    <div className="overflow-hidden rounded-2xl border border-[#d8c3a1]/60 shadow-[0_12px_36px_rgba(50,30,10,0.10)]">
                      <div className="relative h-[280px] w-full sm:h-[340px] lg:h-[360px] xl:h-[400px]">
                        <img
                          src={step.image}
                          alt={step.imageAlt}
                          className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                        {/* Bottom gradient caption */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a120b]/75 to-transparent px-5 py-5 pt-10">
                          <p className="font-serif text-[13px] font-semibold italic text-[#faf0dc]">
                            {step.imageCaption}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Column */}
                <div className={`${!isEven ? "lg:[direction:ltr]" : ""}`}>
                  {/* Sanskrit label */}
                  <p className="font-serif text-[22px] font-semibold text-[#c77722] sm:text-[26px]">
                    {step.sanskrit}
                  </p>

                  {/* English label + sub-title */}
                  <h3 className="mt-1 font-serif text-[24px] font-bold leading-snug text-[#2b241d] sm:text-[28px] lg:text-[30px]">
                    {step.label}
                    <span className="ml-3 font-sans text-[15px] font-normal text-[#8a7a6a]">
                      — {step.title}
                    </span>
                  </h3>

                  {/* Divider */}
                  <div className="mt-4 h-px w-12 bg-[#c77722]/50" />

                  {/* Description */}
                  <p className="mt-4 text-[15px] leading-relaxed text-[#5c4e3f] sm:text-[16px]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow summary strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-[#ebdcc4] bg-[#fbf5e8] px-6 py-5 lg:mt-20">
          {steps.map((step, idx) => (
            <span key={step.label} className="flex items-center gap-2">
              <span className="font-serif text-[13.5px] font-semibold text-[#2b241d]">
                {step.label}
              </span>
              <span className="font-serif text-[12px] text-[#c77722]">({step.sanskrit})</span>
              {idx < steps.length - 1 && (
                <span className="text-[#d2baa0] mx-1">→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PujaSankalpaProcess;
