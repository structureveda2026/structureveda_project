import { HeartHandshake, Sparkles, Home, Compass, ShieldCheck, GraduationCap, Users, Flame, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * SECTION 6: PURPOSE-BASED DISCOVERY
 * 8 Intent tiles guiding devotees from their life situations to appropriate Shastric rituals.
 */
const UmbrellaPurposeDiscovery = () => {
  const purposes = [
    {
      title: "Marriage & Relationships",
      tagline: "Vivaha & Conjugal Harmony",
      description: "Appeasing relational obstacles, manglik dosha, and blessing lifelong companionship.",
      icon: HeartHandshake,
      link: "/yagya-puja/puja",
    },
    {
      title: "Wealth & Prosperity",
      tagline: "Lakshmi & Business Growth",
      description: "Consecrated rituals to remove financial blockages and invite auspicious abundance.",
      icon: Sparkles,
      link: "/yagya-puja/puja",
    },
    {
      title: "Home & Family",
      tagline: "Griha Shanti & Peace",
      description: "Purifying household energies, vastu harmony, and cultivating familial warmth.",
      icon: Home,
      link: "/yagya-puja/homa",
    },
    {
      title: "Graha Shanti",
      tagline: "Planetary Equilibrium",
      description: "Appeasing planetary transit periods (Dasha / Sade Sati) with Shastric ahutis.",
      icon: Compass,
      link: "/yagya-puja/yagya",
    },
    {
      title: "Protection & Peace",
      tagline: "Abhaya & Shielding",
      description: "Dissolving negativity, anxiety, and invoking divine shielding for household members.",
      icon: ShieldCheck,
      link: "/yagya-puja/puja",
    },
    {
      title: "Education & Career",
      tagline: "Vidya & Intellect",
      description: "Saraswati and Ganesha invocations for sharp focus, competitive exams, and job growth.",
      icon: GraduationCap,
      link: "/yagya-puja/puja",
    },
    {
      title: "Family & Children",
      tagline: "Santana & Lineage",
      description: "Devotional blessings for progeny wellbeing, child health, and ancestral gratitude.",
      icon: Users,
      link: "/yagya-puja/puja",
    },
    {
      title: "Spiritual Practice",
      tagline: "Sadhana & Moksha",
      description: "Deep meditative japa, Rudrabhishek, and sacred scriptural paths for inner elevation.",
      icon: Flame,
      link: "/yagya-puja/japa",
    },
  ];

  return (
    <section className="relative border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              FIND YOUR RITUAL BY INTENTION
            </span>
          </div>

          <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight text-[#2b241d] sm:text-[36px] lg:text-[40px]">
            What Would You Like to <span className="text-[#c77722]">Perform a Puja For?</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[680px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f]">
            Vedic rituals are traditionally aligned with specific life intentions. Select your focus area below to explore prescribed Shastric ceremonies.
          </p>

          <div aria-hidden="true" className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60">
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            <span className="text-[12px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
          </div>
        </div>

        {/* 8 Purpose Tiles Grid */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:mt-14">
          {purposes.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.title}
                to={p.link}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#ead8b8] bg-[#fbf6eb] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_8px_22px_rgba(199,119,34,0.1)]"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ead8b8] bg-[#f5ebd7] text-[#b36c1e] shadow-2xs transition-colors duration-300 group-hover:border-[#c77722] group-hover:bg-[#f0dfc4]">
                    <Icon size={19} />
                  </div>

                  <span className="mt-4 block font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                    {p.tagline}
                  </span>

                  <h3 className="mt-1 font-serif text-[18px] font-bold text-[#2b241d] group-hover:text-[#b36c1e] transition-colors">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#65584a]">
                    {p.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#f0e2cd] flex items-center justify-between text-[12px] font-bold text-[#b36c1e]">
                  <span>Explore Rituals</span>
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UmbrellaPurposeDiscovery;
