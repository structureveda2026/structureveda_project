import { Sparkles, MapPin, Award, ShieldCheck, ArrowRight } from "lucide-react";
import zodiacWheel from "../../../assets/images/wheel.png";

const PujaListingHero = ({
  deityImage = null,
  deityAlt = "Sacred Vedic Deity",
  eyebrow = "Kashi Vishwanath • Sacred Dhams",
  heading = "Upcoming Sacred Puja & Yagya",
  description = "Participate in authentic Vedic rituals performed on the holy banks of River Ganga in Kashi and sacred Dhams.",
  startingPrice = "₹1,100",
  priceNote = "(Incl. Samagri & Sankalp)",
  onBookClick,
  onViewDetailsClick,
}) => {
  const handleScrollToPujas = () => {
    if (onBookClick) {
      onBookClick();
      return;
    }
    const el = document.getElementById("puja-list") || document.getElementById("puja-filters");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: 480, behavior: "smooth" });
    }
  };

  const handleViewDetails = () => {
    if (onViewDetailsClick) {
      onViewDetailsClick();
      return;
    }
    handleScrollToPujas();
  };

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      {/* Ambient Warm Golden Aura Glow */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#eab12c]/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-[#d4872b]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* =========================================================
              LEFT COLUMN: SACRED DEITY ARTWORK (TRANSPARENT & BLENDED)
          ========================================================== */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div className="relative flex h-[280px] w-[280px] items-center justify-center sm:h-[340px] sm:w-[340px] lg:h-[380px] lg:w-[380px]">
              {/* Subtle Ambient Radial Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-[#eab12c]/20 via-[#f5cf73]/15 to-transparent blur-2xl" />

              {/* Extremely Low-Opacity Sacred Geometry / Mandala Wheel */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img
                  src={zodiacWheel}
                  alt=""
                  className="h-full w-full object-contain opacity-[0.16] animate-[spin_160s_linear_infinite]"
                />
              </div>

              {/* Subtle Concentric Sacred Rings */}
              <div className="pointer-events-none absolute h-[85%] w-[85%] rounded-full border border-[#d4872b]/25" />
              <div className="pointer-events-none absolute h-[98%] w-[98%] rounded-full border border-[#eab12c]/15 border-dashed" />

              {/* Sacred Deity Artwork */}
              {deityImage ? (
                <img
                  src={deityImage}
                  alt={deityAlt}
                  className="relative z-10 max-h-[90%] max-w-[90%] object-contain drop-shadow-[0_12px_28px_rgba(43,36,29,0.14)] transition-transform duration-700 hover:scale-105"
                />
              ) : (
                /* Elegant Vedic Sacred Emblem (Trishul & Lotus Deity Symbol) */
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#e6cca0]/80 bg-gradient-to-b from-white/90 to-[#fdf8f0]/90 shadow-[0_10px_30px_rgba(43,36,29,0.08)] backdrop-blur-sm sm:h-36 sm:w-36">
                    <svg
                      viewBox="0 0 100 100"
                      className="h-16 w-16 text-[#c77722] sm:h-20 sm:w-20"
                      fill="currentColor"
                    >
                      {/* Sacred Trishul & Damru Vedic Motif */}
                      <path d="M48 10 C48 6 52 6 52 10 L52 88 C52 90 48 90 48 88 Z" fill="#b36c1e" />
                      <path d="M30 22 C34 32 44 38 48 40 L48 34 C44 32 36 28 34 20 C33 16 29 18 30 22 Z" fill="#c77722" />
                      <path d="M70 22 C66 32 56 38 52 40 L52 34 C56 32 64 28 66 20 C67 16 71 18 70 22 Z" fill="#c77722" />
                      <circle cx="50" cy="10" r="3" fill="#eab12c" />
                      <circle cx="28" cy="20" r="2.5" fill="#eab12c" />
                      <circle cx="72" cy="20" r="2.5" fill="#eab12c" />
                      {/* Sacred Lotus Petals Base */}
                      <path d="M36 78 C42 70 50 68 50 68 C50 68 58 70 64 78 C56 82 44 82 36 78 Z" fill="#d4872b" opacity="0.85" />
                      <path d="M26 80 C34 74 44 74 50 78 C42 84 32 84 26 80 Z" fill="#eab12c" opacity="0.75" />
                      <path d="M74 80 C66 74 56 74 50 78 C58 84 68 84 74 80 Z" fill="#eab12c" opacity="0.75" />
                    </svg>
                  </div>

                  <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#9c6225]">
                    ✦ Sacred Sankalp ✦
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: PUJA EDITORIAL INFORMATION & CTA
          ========================================================== */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0]/95 px-4 py-1.5 shadow-[0_2px_12px_rgba(43,36,29,0.04)] backdrop-blur-sm">
              <Sparkles size={13} className="text-[#d4872b]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#b36c1e]">
                {eyebrow}
              </span>
            </div>

            {/* Main Serif Heading */}
            <h1 className="mt-4 font-serif text-[36px] font-semibold leading-[1.14] tracking-[-0.025em] text-[#2b241d] sm:text-[46px] lg:text-[52px]">
              Upcoming Sacred <span className="text-[#c77722]">Puja & Yagya</span>
            </h1>

            {/* Short Supporting Description */}
            <p className="mt-3.5 max-w-[620px] text-[15.5px] leading-relaxed text-[#6e6255] sm:text-[16.5px]">
              {description}
            </p>

            {/* Key Information Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start">
              <div className="flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-white/80 px-3.5 py-1.5 text-[12.5px] font-medium text-[#2b241d] shadow-[0_2px_8px_rgba(43,36,29,0.03)] backdrop-blur-sm">
                <MapPin size={13.5} className="text-[#d4872b]" />
                <span>Ganga Ghats & Sacred Dhams</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-white/80 px-3.5 py-1.5 text-[12.5px] font-medium text-[#2b241d] shadow-[0_2px_8px_rgba(43,36,29,0.03)] backdrop-blur-sm">
                <Award size={13.5} className="text-[#d4872b]" />
                <span>Authentic Vedic Vidhi</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-white/80 px-3.5 py-1.5 text-[12.5px] font-medium text-[#2b241d] shadow-[0_2px_8px_rgba(43,36,29,0.03)] backdrop-blur-sm">
                <ShieldCheck size={13.5} className="text-[#d4872b]" />
                <span>Personalized Sankalp</span>
              </div>
            </div>

            {/* Pricing & Booking CTA Row */}
            <div className="mt-8 flex flex-col items-center justify-center gap-5 border-t border-[#ead8b8]/80 pt-6 sm:flex-row sm:justify-between lg:justify-start lg:gap-8">
              {/* Starting Price */}
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#917f6e]">
                  Participation Starts At
                </span>
                <p className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[32px]">
                  {startingPrice}
                  <span className="ml-2 text-[12px] font-normal text-[#6e6255]">
                    {priceNote}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleScrollToPujas}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#2b241d] shadow-[0_10px_24px_rgba(234,177,44,0.28)] transition-all duration-300 hover:bg-[#dfa420] hover:shadow-[0_14px_30px_rgba(234,177,44,0.36)]"
                >
                  <span>Book Puja</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleViewDetails}
                  className="text-[13.5px] font-semibold text-[#8a571f] underline decoration-[#ead8b8] underline-offset-4 transition-colors hover:text-[#2b241d]"
                >
                  View Puja Details
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PujaListingHero;
