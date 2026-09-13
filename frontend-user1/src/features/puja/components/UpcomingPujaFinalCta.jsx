import { ArrowRight } from "lucide-react";
import pujaFinalCtaImg from "../../../assets/images/puja/puja-final-cta.webp.png";

const UpcomingPujaFinalCta = () => {
  const handleScrollToCeremonies = (e) => {
    e.preventDefault();
    const el = document.getElementById("upcoming-ceremonies");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="upcoming-puja-final-cta"
      aria-label="Reserve Your Sankalp Call to Action"
      className="mt-14 mb-10 sm:mt-18 sm:mb-14"
    >
      <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[#c77722]/35 bg-[#1a1109] px-6 py-13 sm:px-10 sm:py-16 lg:px-14 lg:py-20 text-center text-[#faf4e8] shadow-sm">
        {/* Wide Panoramic Background Image with Tasteful Warm Scrim */}
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <img
            src={pujaFinalCtaImg}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
          {/* Single Tasteful Dark Warm Overlay for High Readability while Keeping Image Visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180f07]/80 via-[#180f07]/65 to-[#180f07]/80" />
        </div>

        {/* Foreground Centered Content */}
        <div className="relative z-10 mx-auto max-w-[780px] flex flex-col items-center">
          {/* Exact Heading */}
          <h2 className="font-serif text-[25px] sm:text-[32px] lg:text-[38px] font-bold leading-tight tracking-tight text-[#faf4e8]">
            Your Sankalp. Your Prayer. Your Sacred Moment.
          </h2>

          {/* Exact Supporting Text */}
          <p className="mt-3 sm:mt-4 max-w-[640px] text-[14px] sm:text-[15.5px] leading-relaxed text-[#f0e2cd]/90">
            Explore upcoming Vedic ceremonies in Kashi and reserve your participation with Veda
            Structure.
          </p>

          {/* Single Compact CTA Button */}
          <div className="mt-6 sm:mt-7.5">
            <a
              href="#upcoming-ceremonies"
              onClick={handleScrollToCeremonies}
              aria-label="Explore upcoming pujas and ceremonies in Kashi"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#eab12c] px-7 sm:px-8 py-3 sm:py-3.5 text-[12.5px] sm:text-[13px] font-bold uppercase tracking-wider text-[#1c1308] shadow-xs transition-all duration-200 hover:bg-[#dda018] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] cursor-pointer"
            >
              <span>EXPLORE UPCOMING PUJAS</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingPujaFinalCta;
