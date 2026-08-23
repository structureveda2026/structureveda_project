import { CheckCircle2, ArrowRight } from "lucide-react";

export const defaultHeritageBullets = [
  "Traditional Parashari Jyotish calculated with sacred Kashi Panchang precision.",
  "Authentic remedial rituals, mantra recommendations, and spiritual clarity.",
  "Direct connection with an astrologer immersed daily in Kashi's spiritual discipline.",
];

const AstrologerHeritage = ({
  eyebrow = "Spiritual Heritage & Origin",
  heading = "Guided From the Heart of",
  highlightedHeading = "Sacred Kashi",
  heritageImage,
  heritageImageAlt = "Spiritual Heritage of Kashi",
  overlayBadge = "Avimukta Kshetra • Holy Varanasi",
  overlayTitle = "The Living Seat of Sanatan Wisdom",
  astrologerName = "Vishal Bhardwaj",
  holyCity = "Kashi (Varanasi)",
  bulletPoints = defaultHeritageBullets,
  buttonText,
  onBookConsultation,
}) => {
  const ctaLabel = buttonText || `Connect With Astrologer ${astrologerName.split(" ")[0] || astrologerName}`;

  return (
    <section className="reveal-on-scroll relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#f8edd8]/80 via-[#fffdf9] to-[#f8edd8]/50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute -left-28 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[#eab12c]/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Atmospheric Spiritual Heritage Artwork */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[30px] border-2 border-[#d6b8a0] bg-gradient-to-b from-[#fbf3e4] to-[#f4e4c7] p-5 shadow-[0_20px_50px_rgba(43,36,29,0.12)]">
              <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-[22px] border border-[#d4872b]/40 shadow-[0_10px_30px_rgba(43,36,29,0.14)]">
                {heritageImage && (
                  <img
                    src={heritageImage}
                    alt={heritageImageAlt}
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b120a]/85 via-[#1b120a]/30 to-transparent" />

                {/* Corner Ornaments */}
                <div className="absolute left-3.5 top-3.5 h-6 w-6 border-l-2 border-t-2 border-[#eab12c]" />
                <div className="absolute right-3.5 top-3.5 h-6 w-6 border-r-2 border-t-2 border-[#eab12c]" />

                {/* Overlay Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block rounded-full bg-[#eab12c] px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#1c1308]">
                    {overlayBadge}
                  </span>
                  <h3 className="mt-1 font-serif text-[22px] font-semibold text-[#fffaf0]">
                    {overlayTitle}
                  </h3>
                </div>
              </div>

              {/* 3 Heritage Highlights */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl border border-[#e6cca0] bg-white/80 p-3">
                  <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                    5,000+ Yrs
                  </p>
                  <p className="text-[10px] font-medium text-[#75695c]">
                    Living Tradition
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e6cca0] bg-white/80 p-3">
                  <p className="font-serif text-[16px] font-bold text-[#c77722]">
                    84 Ghats
                  </p>
                  <p className="text-[10px] font-medium text-[#75695c]">
                    Sacred Energy
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e6cca0] bg-white/80 p-3">
                  <p className="font-serif text-[16px] font-bold text-[#2b241d]">
                    Jyotish
                  </p>
                  <p className="text-[10px] font-medium text-[#75695c]">
                    Classical Roots
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="order-1 space-y-6 lg:order-2">
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

            <div className="space-y-4 text-[15px] leading-relaxed text-[#685c4f] sm:text-[16px]">
              <p>
                Astrologer {astrologerName} practices from{" "}
                <strong className="font-semibold text-[#2b241d]">
                  {holyCity}
                </strong>{" "}
                — the timeless spiritual capital of Bharat and a cradle of
                Vedic astronomical and astrological scholarship for millennia.
              </p>
              <p>
                The spiritual resonance of Kashi embodies deep clarity, karmic
                purification, and inner alignment. Every consultation reflects
                this sacred atmosphere: grounded in authentic Shastras, free
                from sensationalism, and dedicated to your highest well-being.
              </p>
            </div>

            {/* Bullet Highlights */}
            <div className="space-y-2.5 pt-1">
              {bulletPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-[13.5px] text-[#554739]"
                >
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-[#d4872b]"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onBookConsultation}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-[0_10px_25px_rgba(234,177,44,0.25)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_14px_32px_rgba(234,177,44,0.35)]"
              >
                <span>{ctaLabel}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologerHeritage;
