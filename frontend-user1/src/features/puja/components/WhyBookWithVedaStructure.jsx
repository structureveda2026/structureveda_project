import { BookOpen, Users, Sparkles, MapPin, Package, Globe, ShieldCheck } from "lucide-react";

/**
 * Why Book with Veda Structure
 * Compact, editorial trust panel highlighting the 6 authentic client-approved benefits.
 * Features a refined, noticeable warm antique-gold hover interaction per benefit tile.
 */
const WhyBookWithVedaStructure = () => {
  const benefits = [
    {
      id: "traditional-vidhi",
      title: "Traditional Vidhi",
      description: "Authentic Vedic procedure",
      icon: BookOpen,
    },
    {
      id: "experienced-acharyas",
      title: "Experienced Acharyas",
      description: "Guided by trained Vedic practitioners",
      icon: Users,
    },
    {
      id: "personal-sankalp",
      title: "Personal Sankalp",
      description: "Your name & intention included",
      icon: Sparkles,
    },
    {
      id: "sacred-kashi",
      title: "Sacred Kashi",
      description: "Rituals performed in Kashi",
      icon: MapPin,
    },
    {
      id: "prasad-confirmation",
      title: "Prasad & Confirmation",
      description: "Available as per selected Puja",
      icon: Package,
    },
    {
      id: "online-participation",
      title: "Online Participation",
      description: "Participate even when you cannot be present",
      icon: Globe,
    },
  ];

  return (
    <section
      id="why-book-with-veda-structure"
      aria-label="Why Book with Veda Structure"
      className="mt-12 mb-10 sm:mt-16 sm:mb-14"
    >
      <div className="rounded-[20px] border border-[#ebdcc4] bg-[#fbf5e8] p-5 sm:p-7 lg:p-9 shadow-xs">
        {/* ── Section Heading ── */}
        <div className="mb-6 sm:mb-7 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            <ShieldCheck size={12} className="text-[#c77722]" />
            <span>TRUST &amp; AUTHENTICITY</span>
          </div>
          <h2 className="font-serif text-[22px] font-bold text-[#2b241d] sm:text-[26px]">
            Why Book With Veda Structure?
          </h2>
        </div>

        {/* ── 6 Unified Benefit Items (Desktop: 6 cols, Tablet: 3 cols, Mobile: 2 cols) ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-2.5 text-center">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.id}
                className="group relative flex flex-col items-center rounded-[16px] border border-transparent p-3 sm:p-3.5 transition-all duration-300 ease-out hover:-translate-y-[3px] hover:border-[#d9a13a] hover:bg-[#f6e7bf] hover:shadow-[0_8px_22px_rgba(199,119,34,0.14)] motion-reduce:hover:translate-y-0 motion-reduce:transition-none cursor-default"
              >
                {/* Icon with circular background */}
                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f2e6d2] text-[#b36c1e] shadow-2xs transition-all duration-300 ease-out group-hover:scale-[1.08] group-hover:bg-[#eab12c] group-hover:text-[#2b241d] group-hover:shadow-xs motion-reduce:group-hover:scale-100">
                  <Icon size={17} />
                </div>

                {/* Title with antique gold transition */}
                <h3 className="font-serif text-[14px] sm:text-[14.5px] font-bold text-[#2b241d] leading-snug transition-colors duration-300 ease-out group-hover:text-[#5b3817]">
                  {benefit.title}
                </h3>

                {/* Small antique-gold accent line (20px on hover) */}
                <div
                  aria-hidden="true"
                  className="mx-auto mt-1.5 h-[1.5px] w-0 bg-[#d9a13a] transition-all duration-300 ease-out group-hover:w-5 motion-reduce:transition-none"
                />

                {/* Description with richer tone on hover */}
                <p className="mt-1.5 text-[11.5px] sm:text-[12px] leading-snug text-[#685c4f] transition-colors duration-300 ease-out group-hover:text-[#6b4a27]">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithVedaStructure;
