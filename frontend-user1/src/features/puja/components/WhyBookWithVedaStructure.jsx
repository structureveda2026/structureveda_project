import { ShieldCheck } from "lucide-react";

// Authentic local trust icons from Book_With_Veda_Structure
import traditionalVidhiImg from "../../../assets/images/Book_With_Veda_Structure/Traditional Vidhi.png";
import experiencedAcharyasImg from "../../../assets/images/Book_With_Veda_Structure/Experienced Acharyas.png";
import personalSankalpImg from "../../../assets/images/Book_With_Veda_Structure/Personal Sankalp.png";
import sacredKashiImg from "../../../assets/images/Book_With_Veda_Structure/Sacred Kashi.png";
import prasadConfirmationImg from "../../../assets/images/Book_With_Veda_Structure/Prasad & Confirmation.png";
import onlineParticipationImg from "../../../assets/images/Book_With_Veda_Structure/Online Participation.png";

/**
 * Why Book with Veda Structure
 * Clean, open editorial trust section featuring the 6 authentic client-approved benefits.
 * Displays dedicated local image icons directly on the warm ivory page background.
 */
const WhyBookWithVedaStructure = () => {
  const benefits = [
    {
      id: "traditional-vidhi",
      title: "Traditional Vidhi",
      description: "Authentic Vedic procedure",
      image: traditionalVidhiImg,
    },
    {
      id: "experienced-acharyas",
      title: "Experienced Acharyas",
      description: "Guided by trained Vedic practitioners",
      image: experiencedAcharyasImg,
    },
    {
      id: "personal-sankalp",
      title: "Personal Sankalp",
      description: "Your name & intention included",
      image: personalSankalpImg,
    },
    {
      id: "sacred-kashi",
      title: "Sacred Kashi",
      description: "Rituals performed in Kashi",
      image: sacredKashiImg,
    },
    {
      id: "prasad-confirmation",
      title: "Prasad & Confirmation",
      description: "Available as per selected Puja",
      image: prasadConfirmationImg,
    },
    {
      id: "online-participation",
      title: "Online Participation",
      description: "Participate even when you cannot be present",
      image: onlineParticipationImg,
    },
  ];

  return (
    <section
      id="why-book-with-veda-structure"
      aria-label="Why Book with Veda Structure"
      className="mt-16 mb-16 sm:mt-20 sm:mb-20"
    >
      {/* ── Section Heading (Open, Centered, Editorial) ── */}
      <div className="mb-10 sm:mb-12 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
          <ShieldCheck size={13} className="text-[#c77722]" />
          <span>TRUST &amp; AUTHENTICITY</span>
        </div>
        <h2 className="font-serif text-[26px] font-bold text-[#2b241d] sm:text-[30px] lg:text-[32px]">
          Why Book With Veda Structure?
        </h2>
      </div>

      {/* ── 6 Open Editorial Benefit Items (Desktop: 6 cols in 1 row, Tablet: 3 cols, Mobile: 2 cols) ── */}
      <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 sm:gap-y-8 sm:gap-x-6 lg:grid-cols-6 lg:gap-0 text-center">
        {benefits.map((benefit, idx) => {
          return (
            <div
              key={benefit.id}
              className={`group flex flex-col items-center px-3 sm:px-4 lg:px-3.5 xl:px-4 transition-all duration-300 ${
                idx < benefits.length - 1 ? "lg:border-r lg:border-[#ebdcc4]/70" : ""
              }`}
            >
              {/* Image Icon - Directly on page background, no circular container or box */}
              <div className="mb-3.5 flex h-[46px] w-[46px] items-center justify-center">
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="h-[42px] w-[42px] object-contain transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
              </div>

              {/* Title with serif styling & subtle warm hover */}
              <h3 className="font-serif text-[14px] sm:text-[14.5px] lg:text-[15px] font-bold text-[#2b241d] leading-snug transition-colors duration-300 group-hover:text-[#c77722]">
                {benefit.title}
              </h3>

              {/* Small decorative gold accent line */}
              <div
                aria-hidden="true"
                className="my-2 h-[1.5px] w-4 bg-[#eab12c]/60 transition-all duration-300 ease-out group-hover:w-6 group-hover:bg-[#c77722] motion-reduce:transition-none"
              />

              {/* Description */}
              <p className="text-[11.5px] sm:text-[12px] leading-relaxed text-[#75695c] transition-colors duration-300 group-hover:text-[#423629] max-w-[170px]">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyBookWithVedaStructure;
