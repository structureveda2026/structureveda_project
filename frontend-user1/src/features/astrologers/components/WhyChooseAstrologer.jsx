import { ArrowRight, Sparkles, UserRound, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

const defaultAdvantages = [
  {
    number: "01",
    title: "Authentic Vedic Principles",
    subtitle: "Classical Jyotish Analysis",
    description:
      "Strictly adhering to classical Parashari and Jaimini Vedic methods, analyzing Janam Kundali, Navamsha (D-9), and planetary strengths.",
    Icon: Sparkles,
    points: [
      "Birth Chart (Lagna & Rashi)",
      "Divisional Charts (D-9, D-10)",
      "Planetary Strengths (Shadbala)",
    ],
  },
  {
    number: "02",
    title: "Personalized Life Guidance",
    subtitle: "Tailored to Your Destiny",
    description:
      "No generic horoscopes. Every reading is deeply tailored to your specific questions, life stage, and unique planetary placements.",
    Icon: UserRound,
    points: [
      "Career & Financial Yogas",
      "Marriage & Relationship Timing",
      "Foreign Travel & Relocation",
    ],
  },
  {
    number: "03",
    title: "Precise Timing of Events",
    subtitle: "Dasha & Gochar Synchronization",
    description:
      "Understanding when favorable or challenging planetary periods occur through Mahadasha, Antardasha, and current planetary transits.",
    Icon: Clock,
    points: [
      "Vimshottari Dasha Analysis",
      "Planetary Transit (Gochar) Impact",
      "Sade Sati & Rahu-Ketu Periods",
    ],
  },
  {
    number: "04",
    title: "Practical & Pure Remedies",
    subtitle: "Sanatan Spiritual Balance",
    description:
      "Sensible, non-superstitious remedies focused on mantra chanting, targeted lifestyle alignments, authentic gemstones, and spiritual pujas.",
    Icon: ShieldCheck,
    points: [
      "Mantra Japa & Sooktam",
      "Auspicious Gemstone Guidance",
      "Daan & Karma Alignment",
    ],
  },
];

const WhyChooseAstrologer = ({
  eyebrow = "Why Choose Vishal Bhardwaj",
  heading = "Rooted in Kashi’s Sacred Tradition.",
  highlightedHeading = "Driven by Astrological Precision.",
  description = "Vedic Astrology is a sacred tool of self-discovery and life alignment. Experience grounded, compassionate counsel free from superstition, tailored to your exact birth chart.",
  astrologerImage,
  astrologerName = "Vishal Bhardwaj",
  astrologerTitle = "Vedic Astrologer & Kundali Specialist",
  tradition = "Kashi Vishwanath Parampara",
  experience = "10+ Yrs",
  rating = "4.9 ★",
  consultations = "1,500+",
  quote = '"Jyotish is not about fear; it is the divine science of time that brings clarity and empowers right action."',
  consultationButtonText = "Book Consultation With Vishal",
  onBookConsultation,
  advantages = defaultAdvantages,
}) => {
  return (
    <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-white via-[#fffdf9] to-[#f8edd8]/40 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-[450px] w-[450px] rounded-full bg-[#d4872b]/[0.04] blur-[110px]" />

      <div className="relative mx-auto max-w-[1240px]">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-[760px] text-center sm:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d4872b]/70" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
              {eyebrow}
            </p>
            <span className="h-px w-8 bg-[#d4872b]/70" />
          </div>

          <h2 className="font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-[#2b241d] sm:text-[46px] lg:text-[50px]">
            {heading}{" "}
            {highlightedHeading && (
              <span className="text-[#c77722]">{highlightedHeading}</span>
            )}
          </h2>

          {description && (
            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              {description}
            </p>
          )}
        </div>

        {/* Main 2-Column Content Grid */}
        <div className="grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-14 xl:grid-cols-[460px_1fr]">
          {/* LEFT: Astrologer Portrait & Authority Showcase */}
          <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
            {/* Outer Decorative Card */}
            <div className="relative overflow-hidden rounded-[28px] border-2 border-[#d6b8a0] bg-gradient-to-b from-[#fbf3e4] to-[#f4e4c7] p-6 shadow-[0_20px_50px_rgba(43,36,29,0.12)]">
              {/* Image Frame */}
              <div className="relative mx-auto aspect-[4/4.5] w-full overflow-hidden rounded-[22px] border border-[#d4872b]/40 shadow-[0_10px_30px_rgba(43,36,29,0.15)]">
                {astrologerImage && (
                  <img
                    src={astrologerImage}
                    alt={astrologerName}
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                )}
                {/* Subtle Gradient Scrim */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b140e]/85 via-transparent to-transparent" />

                {/* Corner Ornaments */}
                <div className="absolute left-3.5 top-3.5 h-6 w-6 border-l-2 border-t-2 border-[#eab12c]" />
                <div className="absolute right-3.5 top-3.5 h-6 w-6 border-r-2 border-t-2 border-[#eab12c]" />

                {/* Overlay Name & Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  {tradition && (
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f5ce6f]">
                      {tradition}
                    </p>
                  )}
                  <h3 className="font-serif text-[24px] font-semibold text-[#fffaf0]">
                    {astrologerName}
                  </h3>
                  {astrologerTitle && (
                    <p className="text-[12px] text-[#dfd4c5]">{astrologerTitle}</p>
                  )}
                </div>
              </div>

              {/* Authority Highlights Row */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 text-center backdrop-blur-sm">
                <div>
                  <p className="font-serif text-[20px] font-bold text-[#2b241d]">
                    {experience}
                  </p>
                  <p className="text-[10.5px] font-medium text-[#75695c]">
                    Experience
                  </p>
                </div>
                <div className="border-x border-[#ead8b8]">
                  <p className="font-serif text-[20px] font-bold text-[#c77722]">
                    {rating}
                  </p>
                  <p className="text-[10.5px] font-medium text-[#75695c]">
                    Rating
                  </p>
                </div>
                <div>
                  <p className="font-serif text-[20px] font-bold text-[#2b241d]">
                    {consultations}
                  </p>
                  <p className="text-[10.5px] font-medium text-[#75695c]">
                    Consultations
                  </p>
                </div>
              </div>

              {/* Ethos Quote */}
              {quote && (
                <div className="mt-5 rounded-2xl border border-[#e6cca0]/80 bg-[#fffaf0] p-4 text-center">
                  <p className="font-serif text-[14.5px] italic leading-relaxed text-[#5e5143]">
                    {quote}
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="button"
                onClick={onBookConsultation}
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#eab12c] py-3.5 text-[13.5px] font-bold text-[#2b241d] shadow-[0_8px_20px_rgba(234,177,44,0.22)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_12px_28px_rgba(234,177,44,0.3)]"
              >
                <span>{consultationButtonText}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>

          {/* RIGHT: 4 Core Advantages Grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {advantages.map((card) => {
              const CardIcon = card.Icon;
              return (
                <div
                  key={card.number}
                  className="group relative flex flex-col justify-between rounded-[24px] border-2 border-[#ead8b8] bg-white p-6 shadow-[0_8px_25px_rgba(80,60,30,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#d4872b] hover:shadow-[0_18px_40px_rgba(212,135,43,0.14)] sm:p-7"
                >
                  {/* Top Row: Number + Icon */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center justify-center rounded-full bg-[#f8edd8] px-3 py-1 font-serif text-[14px] font-bold text-[#b36c1e]">
                        {card.number}
                      </span>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6cca0] bg-[#fffaf0] text-[#d4872b] shadow-[0_3px_12px_rgba(212,135,43,0.1)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#eab12c] group-hover:text-[#2b241d]">
                        <CardIcon size={20} strokeWidth={1.8} />
                      </div>
                    </div>

                    {/* Headings */}
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c77722]">
                      {card.subtitle}
                    </p>
                    <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#2b241d] transition-colors duration-300 group-hover:text-[#a86616]">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#685c4f]">
                      {card.description}
                    </p>
                  </div>

                  {/* Key Bullet Checklist */}
                  <div className="mt-5 border-t border-[#f0e4cf] pt-4">
                    <ul className="space-y-1.5">
                      {card.points.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[12px] font-medium text-[#5c4f42]"
                        >
                          <CheckCircle2
                            size={13}
                            className="shrink-0 text-[#d4872b]"
                          />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Accent Line */}
                  <span className="absolute bottom-0 left-6 h-[2.5px] w-0 rounded-full bg-[#eab12c] transition-all duration-500 group-hover:w-16" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseAstrologer;
