import { Clock, MapPin, Languages, Star, CheckCircle2, ArrowRight } from "lucide-react";

export const defaultPillars = [
  {
    title: "Fear-Free & Compassionate Guidance",
    desc: "Astrology is treated as a guiding light (Jyoti), not fatalism. Every session empowers you to take conscious action.",
  },
  {
    title: "Timing & Dasha Synchronization",
    desc: "Precise calculation of planetary periods (Vimshottari Dasha) and transits (Gochar) to align choices with cosmic timing.",
  },
  {
    title: "Pure & Actionable Vedic Remedies",
    desc: "Straightforward remedial measures centered on mantra sadhana, genuine gemstones, and karma alignment.",
  },
];

const AboutAstrologer = ({
  eyebrow = "Spiritual Lineage & Philosophy",
  heading = "Rooted in Kashi Tradition.",
  highlightedHeading = "Guiding With Astrological Clarity.",
  astrologerImage,
  astrologerName = "Vishal Bhardwaj",
  badgeText = "Verified Jyotish Guide",
  location = "Kashi (Varanasi), India",
  experience = "10+ Years",
  holySeat = "Kashi / Varanasi",
  languages = "Hindi, English",
  seekersCount = "1,500+ Guided",
  bioParagraphs,
  pillars = defaultPillars,
  consultationButtonText,
  onBookConsultation,
  onViewPackages,
}) => {
  const handleScrollToPackages = () => {
    if (onViewPackages) {
      onViewPackages();
    } else {
      const el = document.getElementById("packages");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const buttonLabel = consultationButtonText || `Book Consultation With ${astrologerName.split(" ")[0] || astrologerName}`;

  return (
    <section
      id="profile"
      className="reveal-on-scroll scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden border-b border-[#ead8b8] bg-[#fffaf0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      {/* Ambient Warm Glow */}
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[500px] w-[500px] rounded-full bg-[#d4872b]/[0.05] blur-[130px]" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-[450px] w-[450px] rounded-full bg-[#eab12c]/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid items-center gap-12 lg:grid-cols-[440px_1fr] lg:gap-16 xl:grid-cols-[460px_1fr]">
          {/* LEFT: Astrologer Portrait & Verified Credentials */}
          <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
            {/* Outer Decorative Card */}
            <div className="relative overflow-hidden rounded-[30px] border-2 border-[#d6b8a0] bg-gradient-to-b from-[#fbf3e4] via-[#f9ecda] to-[#f4e4c7] p-6 shadow-[0_25px_60px_rgba(43,36,29,0.14)]">
              {/* Framed Image */}
              <div className="relative mx-auto aspect-[4/4.8] w-full overflow-hidden rounded-[24px] border border-[#d4872b]/40 shadow-[0_12px_35px_rgba(43,36,29,0.16)]">
                {astrologerImage && (
                  <img
                    src={astrologerImage}
                    alt={`Astrologer ${astrologerName}`}
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                )}
                {/* Subtle Gradient Scrim */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18110b]/85 via-transparent to-transparent" />

                {/* Traditional Corner Accents */}
                <div className="absolute left-3.5 top-3.5 h-6 w-6 border-l-2 border-t-2 border-[#eab12c]" />
                <div className="absolute right-3.5 top-3.5 h-6 w-6 border-r-2 border-t-2 border-[#eab12c]" />

                {/* Name Tag on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block rounded-full bg-[#eab12c] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1c1308]">
                    {badgeText}
                  </span>
                  <h3 className="mt-1.5 font-serif text-[24px] font-semibold text-[#fffaf0]">
                    {astrologerName}
                  </h3>
                  <p className="text-[12px] text-[#ded3c4]">
                    {location}
                  </p>
                </div>
              </div>

              {/* 4-Box Credentials Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                    <Clock size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                      Experience
                    </p>
                    <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                      Holy Seat
                    </p>
                    <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {holySeat}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                    <Languages size={17} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                      Languages
                    </p>
                    <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {languages}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-[#e6cca0] bg-white/85 p-3.5 backdrop-blur-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                    <Star size={17} fill="#c77722" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#75695c]">
                      Seekers
                    </p>
                    <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                      {seekersCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Narrative & Guiding Principles */}
          <div className="space-y-7">
            {/* Header */}
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-[#d4872b]/70" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b36c1e]">
                  {eyebrow}
                </p>
              </div>

              <h2 className="font-serif text-[36px] font-semibold leading-[1.12] tracking-[-0.025em] text-[#2b241d] sm:text-[44px] lg:text-[48px]">
                {heading}{" "}
                {highlightedHeading && (
                  <span className="text-[#c77722]">{highlightedHeading}</span>
                )}
              </h2>
            </div>

            {/* Biography Narrative */}
            <div className="space-y-4 text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              {bioParagraphs ? (
                bioParagraphs.map((para, idx) => <p key={idx}>{para}</p>)
              ) : (
                <>
                  <p>
                    <strong className="font-semibold text-[#2b241d]">
                      {astrologerName}
                    </strong>{" "}
                    is a seasoned Vedic Astrologer based in the sacred city of{" "}
                    <strong className="font-semibold text-[#2b241d]">
                      {holySeat}
                    </strong>
                    , dedicating over a decade to the deep study and practical
                    application of classical Parashari Jyotish.
                  </p>
                  <p>
                    His consultations bridge ancient Sanatan wisdom with modern
                    life complexities — helping individuals navigate career
                    milestones, marriage timings, financial decisions, and
                    spiritual growth without fear or superstition.
                  </p>
                </>
              )}
            </div>

            {/* 3 Core Guiding Pillars */}
            <div className="space-y-3 pt-2">
              {pillars.map((pillar, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#f0e2cd] bg-white/70 p-4 transition-all duration-300 hover:border-[#d4872b] hover:bg-white hover:shadow-[0_6px_20px_rgba(212,135,43,0.08)]"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f8edd8] text-[#c77722]">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <h4 className="font-serif text-[17px] font-semibold text-[#2b241d]">
                      {pillar.title}
                    </h4>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-[#75695c]">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3.5 pt-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={onBookConsultation}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.25)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_14px_32px_rgba(234,177,44,0.35)]"
              >
                <span>{buttonLabel}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={handleScrollToPackages}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#d6b8a0] bg-white px-7 py-3 text-[14px] font-bold text-[#2b241d] transition-all duration-300 hover:border-[#eab12c] hover:bg-[#fffaf0]"
              >
                View Packages & Rates
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAstrologer;
