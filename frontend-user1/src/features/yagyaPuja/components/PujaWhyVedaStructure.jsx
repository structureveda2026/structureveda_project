import { BookOpen, CalendarCheck, Users, Package, HeartHandshake, MapPin, Sparkles, ShieldCheck } from "lucide-react";
import pujaDevotionalAltarImg from "../../../assets/images/puja/puja-devotional-altar.webp.png";

const PujaWhyVedaStructure = () => {
  const pillars = [
    {
      title: "Traditional Ritual Information",
      description: "In-depth context on prescribed Shastric Vidhi, presiding deities, mantras, and authentic significance.",
      icon: BookOpen,
      motif: (
        <svg aria-hidden="true" className="h-20 w-20 text-[#b36c1e]/[0.09] transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-[#b36c1e]/[0.15]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="80" cy="20" r="16" strokeWidth="0.8" />
          <circle cx="80" cy="20" r="30" strokeWidth="0.8" strokeDasharray="2 2" />
          <path d="M80 4 C72 16 64 28 80 40 C96 28 88 16 80 4 Z" strokeWidth="0.8" />
          <path d="M64 20 C76 12 88 4 100 20 C88 36 76 28 64 20 Z" strokeWidth="0.8" />
          <circle cx="80" cy="20" r="5" fill="currentColor" fillOpacity="0.2" strokeWidth="0.4" />
        </svg>
      ),
    },
    {
      title: "Structured Booking",
      description: "A clear step-by-step arrangement process without ambiguities, hidden parameters, or confusing schedules.",
      icon: CalendarCheck,
      motif: (
        <svg aria-hidden="true" className="h-20 w-20 text-[#b36c1e]/[0.09] transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-[#b36c1e]/[0.15]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <rect x="58" y="2" width="40" height="40" rx="4" strokeWidth="0.8" />
          <rect x="64" y="8" width="28" height="28" rx="2" strokeWidth="0.6" strokeDasharray="2 2" />
          <circle cx="78" cy="22" r="8" strokeWidth="0.8" />
          <path d="M78 10 L78 34 M66 22 L90 22" strokeWidth="0.7" />
          <circle cx="78" cy="22" r="3" fill="currentColor" fillOpacity="0.25" strokeWidth="0.4" />
        </svg>
      ),
    },
    {
      title: "Pandit Coordination",
      description: "Carefully designated Vedic purohits versed in proper acoustic pronunciation and ritual discipline.",
      icon: Users,
      motif: (
        <svg aria-hidden="true" className="h-20 w-20 text-[#b36c1e]/[0.09] transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-[#b36c1e]/[0.15]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="80" cy="20" r="14" strokeWidth="0.8" />
          <circle cx="80" cy="20" r="28" strokeWidth="0.8" strokeDasharray="3 2" />
          <path d="M80 6 C74 15 74 25 80 34 C86 25 86 15 80 6 Z" strokeWidth="0.8" />
          <path d="M66 20 C75 14 85 14 94 20 C85 26 75 26 66 20 Z" strokeWidth="0.8" />
          <circle cx="80" cy="20" r="6" fill="currentColor" fillOpacity="0.18" strokeWidth="0.5" />
        </svg>
      ),
    },
    {
      title: "Samagri Arrangement",
      description: "Coordination of pure, unadulterated sacred materials required by traditional ritual scriptures.",
      icon: Package,
      motif: (
        <svg aria-hidden="true" className="h-20 w-20 text-[#b36c1e]/[0.09] transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-[#b36c1e]/[0.15]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <path d="M80 6 C70 18 62 26 80 36 C98 26 90 18 80 6 Z" strokeWidth="0.8" />
          <circle cx="80" cy="21" r="18" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M68 21 L92 21 M80 9 L80 33" strokeWidth="0.6" />
          <circle cx="80" cy="21" r="4" fill="currentColor" fillOpacity="0.22" strokeWidth="0.4" />
        </svg>
      ),
    },
    {
      title: "Sankalpa Management",
      description: "Careful recording of your personal and family Gotra, Nakshatra, and dedicated devotional intentions.",
      icon: HeartHandshake,
      motif: (
        <svg aria-hidden="true" className="h-20 w-20 text-[#b36c1e]/[0.09] transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-[#b36c1e]/[0.15]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="80" cy="20" r="12" strokeWidth="0.8" />
          <circle cx="80" cy="20" r="26" strokeWidth="0.8" strokeDasharray="3 3" />
          <path d="M80 2 C70 14 60 20 80 38 C100 20 90 14 80 2 Z" strokeWidth="0.8" />
          <circle cx="80" cy="20" r="4" fill="currentColor" fillOpacity="0.25" strokeWidth="0.5" />
        </svg>
      ),
    },
    {
      title: "Kashi-Based Services",
      description: "Direct facilitation of sacred rituals along the holy banks of River Ganga and consecrated Varanasi shrines.",
      icon: MapPin,
      motif: (
        <svg aria-hidden="true" className="h-20 w-20 text-[#b36c1e]/[0.09] transition-all duration-500 ease-out group-hover:scale-105 group-hover:text-[#b36c1e]/[0.15]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="80" cy="20" r="15" strokeWidth="0.8" />
          <circle cx="80" cy="20" r="29" strokeWidth="0.8" strokeDasharray="2 2" />
          <path d="M80 5 L80 35 M65 20 L95 20" strokeWidth="0.7" />
          <polygon points="80,10 88,20 80,30 72,20" strokeWidth="0.8" fill="currentColor" fillOpacity="0.1" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#ebdcc4] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      {/* Subtle warm ambient light behind content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fbf3e4]/60 via-transparent to-transparent"
      />

      <div className="relative mx-auto max-w-[1360px]">

        {/* ── 2. Section Header ── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.24em]">
              The Veda Structure Approach
            </span>
          </div>

          <h2 className="mt-2.5 font-serif text-[28px] font-semibold leading-[1.15] sm:text-[36px] lg:text-[40px]">
            <span className="text-[#2b241d]">
              A Structured
            </span>
            <span className="text-[#c77722]">
              {" "}Way to Arrange
            </span>
            Your Puja
          </h2>

          <p className="mx-auto mt-3.5 max-w-[750px] font-sans text-[14.5px] leading-relaxed text-[#5c4e3f] sm:text-[15.5px]">
            We believe arranging a Puja should be clear and organized. From selecting the ritual to completing your Sankalpa,
            Veda Structure brings the essential arrangements together in one experience.
          </p>

          {/* Understated Decorative Divider */}
          <div
            aria-hidden="true"
            className="mx-auto mt-6 flex items-center justify-center gap-3 text-[#c77722]/60"
          >
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
            <span className="text-[12px]">✦</span>
            <span className="h-px w-10 bg-[#c77722]/30 sm:w-14" />
          </div>
        </div>

        {/* ── 3. Asymmetric Editorial Composition (40% Left Image / 60% Right Cards) ── */}
        <div className="mt-12 grid items-stretch gap-8 sm:mt-14 lg:grid-cols-12 lg:gap-11 xl:gap-12">

          {/* ── 4 & 5. Left Image: Framed Editorial Visual Anchor & Integrated Caption ── */}
          <div className="lg:col-span-5">
            <div className="group relative h-full min-h-[380px] overflow-hidden rounded-[22px] border border-[#ead8b8] bg-[#22170f] shadow-[0_10px_30px_rgba(60,42,20,0.08)] transition-all duration-300 hover:border-[#c77722] sm:min-h-[440px] lg:min-h-[530px] xl:min-h-[560px]">
              <img
                src={pujaDevotionalAltarImg}
                alt="Consecrated temple altar with sacred offerings and traditional lamps"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                loading="lazy"
              />

              {/* Natural warm/dark bottom gradient so caption remains effortlessly legible */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140c06]/92 via-[#140c06]/35 via-45% to-transparent transition-opacity duration-300 group-hover:from-[#140c06]/95"
              />

              {/* Directly Integrated Editorial Caption */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-[#faf4e8]">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#eab12c]/35 bg-[#160d06]/65 px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#f5ce6f] backdrop-blur-xs">
                  <ShieldCheck size={11} className="text-[#eab12c]" />
                  <span>Authentic Vedic Standard</span>
                </div>

                <h3 className="font-serif text-[19px] font-semibold leading-snug text-[#faf4e8] sm:text-[21px]">
                  Preserving Sanatana Discipline
                </h3>

                <p className="mt-1 text-[12px] leading-relaxed text-[#eedcc5]/90">
                  "Uniting traditional Gurukul training with transparent modern coordination for devotees globally."
                </p>
              </div>
            </div>
          </div>

          {/* ── 6-11. Right Side: 2-Column × 3-Row Sacred Heritage Benefit Cards ── */}
          <div className="lg:col-span-7">
            <div className="grid h-full gap-4 sm:grid-cols-2 sm:gap-4.5">
              {pillars.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group relative flex min-h-[155px] flex-col justify-between overflow-hidden rounded-[18px] border border-[#ead8b8] bg-[#fbf6eb] p-5 shadow-[0_2px_10px_rgba(60,40,15,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c77722] hover:bg-[#fffcf7] hover:shadow-[0_8px_22px_rgba(199,119,34,0.09)] sm:p-5.5"
                  >
                    {/* Subtle Indian-Inspired Line-Art Background Motif (Top-Right) */}
                    <div className="pointer-events-none absolute -right-1 -top-1 z-0">
                      {item.motif}
                    </div>

                    {/* Card Inner Content */}
                    <div className="relative z-10">
                      {/* Circular Antique-Gold Medallion Container */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ead8b8] bg-[#f5ebd7] text-[#b36c1e] shadow-2xs transition-all duration-300 group-hover:border-[#c77722] group-hover:bg-[#f0dfc4] group-hover:text-[#965511]">
                        <Icon size={18} />
                      </div>

                      {/* Card Title */}
                      <h3 className="mt-3.5 font-serif text-[17.5px] font-semibold leading-snug text-[#2b241d] transition-colors duration-200 group-hover:text-[#b36c1e]">
                        {item.title}
                      </h3>

                      {/* Card Description */}
                      <p className="mt-1.5 font-sans text-[13px] leading-[1.62] text-[#685c4f]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PujaWhyVedaStructure;

