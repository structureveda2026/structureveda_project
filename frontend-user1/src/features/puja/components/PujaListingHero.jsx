import { Sparkles, MapPin, Award, ShieldCheck, ArrowRight } from "lucide-react";
import defaultPujaHeroImage from "../../../assets/images/puja_hero1.png";

const PujaListingHero = ({
  deityImage = null,
  deityAlt = "Sacred Vedic Puja & Yagya",
  eyebrow = "Kashi Vishwanath • Sacred Dhams",
  heading = "Upcoming Sacred Puja & Yagya",
  description = "Participate in authentic Vedic rituals performed on the holy banks of River Ganga in Kashi and sacred Dhams.",
  startingPrice = "₹1,100",
  priceNote = "(Incl. Samagri & Sankalp)",
  onBookClick,
  onViewDetailsClick,
}) => {
  const heroImage = deityImage || defaultPujaHeroImage;

  const handleScrollToPujas = () => {
    if (onBookClick) {
      onBookClick();
      return;
    }
    const el =
      document.getElementById("puja-list") ||
      document.getElementById("puja-filters");
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
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#f8edd8] to-[#f4e4c7] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      {/* Ambient Warm Golden Background Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#eab12c]/12 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[#d4872b]/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* =========================================================
              LEFT COLUMN: TRANSPARENT SACRED PUJA ARTWORK
              Desktop -> Left (5 cols, ~42%)
              Mobile  -> Top (Order 1)
          ========================================================== */}
          <div className="order-1 flex items-center justify-center lg:order-1 lg:col-span-5">
            <div className="relative flex w-full max-w-[360px] items-center justify-center sm:max-w-[420px] lg:max-w-[460px]">
              {/* Extremely soft, diffuse ambient gold glow directly behind artwork */}
              <div className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-gradient-to-tr from-[#eab12c]/20 via-[#f5cf73]/15 to-transparent blur-3xl" />

              {/* Pure Transparent Puja Artwork */}
              <img
                src={heroImage}
                alt={deityAlt}
                className="relative z-10 max-h-[320px] w-full object-contain drop-shadow-[0_16px_32px_rgba(43,36,29,0.12)] transition-transform duration-700 hover:scale-[1.02] sm:max-h-[380px] lg:max-h-[440px]"
                loading="eager"
              />
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: EDITORIAL HIERARCHY & BOOKING ACTIONS
              Desktop -> Right (7 cols)
              Mobile  -> Below Artwork (Order 2)
          ========================================================== */}
          <div className="order-2 text-center lg:order-2 lg:col-span-7 lg:text-left">
            {/* 1. Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8b8] bg-[#fffaf0]/95 px-3.5 py-1.5 shadow-[0_2px_10px_rgba(43,36,29,0.04)] backdrop-blur-xs">
              <Sparkles size={13} className="text-[#c77722]" />
              <span className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-[#b36c1e] sm:text-[11px]">
                {eyebrow}
              </span>
            </div>

            {/* 2. Large Editorial Heading */}
            <h1 className="mt-3.5 font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.02em] text-[#2b241d] sm:text-[42px] lg:text-[48px] xl:text-[52px]">
              Upcoming Sacred{" "}
              <span className="text-[#c77722]">Puja & Yagya</span>
            </h1>

            {/* 3. Short Supporting Description */}
            <p className="mx-auto mt-3 max-w-[600px] text-[14.5px] leading-relaxed text-[#5e5143] sm:text-[15.5px] lg:mx-0">
              {description}
            </p>

            {/* 4. Compact Key Information / Trust Pills */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 lg:justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <MapPin size={13} className="text-[#d4872b]" />
                <span>Ganga Ghats & Sacred Dhams</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <Award size={13} className="text-[#d4872b]" />
                <span>Authentic Vedic Vidhi</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#ead8b8] bg-[#fffdfa]/95 px-3 py-1.5 text-[12px] font-medium text-[#3d3226] shadow-2xs">
                <ShieldCheck size={13} className="text-[#d4872b]" />
                <span>Personalized Sankalp</span>
              </div>
            </div>

            {/* 5. Price & Booking CTA Action Area */}
            <div className="mt-7 flex flex-col items-center justify-center gap-5 border-t border-[#ead8b8]/80 pt-5 sm:flex-row sm:justify-between lg:justify-start lg:gap-8">
              {/* Starting Price Block */}
              <div className="text-center sm:text-left">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7c6b] sm:text-[10.5px]">
                  Participation Starts At
                </span>
                <div className="mt-0.5 flex items-baseline justify-center gap-2 sm:justify-start">
                  <span className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[32px]">
                    {startingPrice}
                  </span>
                  <span className="text-[12px] font-medium text-[#7a6d5f]">
                    {priceNote}
                  </span>
                </div>
              </div>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleScrollToPujas}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.32)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_28px_rgba(234,177,44,0.42)] hover:-translate-y-0.5"
                >
                  <span>Book Puja</span>
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                <button
                  type="button"
                  onClick={handleViewDetails}
                  className="text-[13px] font-semibold text-[#9d5b12] underline decoration-[#ead8b8] underline-offset-4 transition-colors hover:text-[#2b241d]"
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
