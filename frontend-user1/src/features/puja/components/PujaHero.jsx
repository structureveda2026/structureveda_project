import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PujaHero = ({ puja, onBookClick }) => {
  if (!puja) return null;

  // Multiple carousel images support
  const images = Array.isArray(puja.images) && puja.images.length > 0
    ? puja.images
    : [puja.image].filter(Boolean);

  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Dynamic booking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: "17",
    minutes: "05",
    seconds: "37",
  });

  useEffect(() => {
    const getTargetTime = () => {
      if (puja.bookingCloseAt) {
        const target = new Date(puja.bookingCloseAt).getTime();
        if (!isNaN(target) && target > Date.now()) return target;
      }
      
      // Default: anchor dynamically to 17h 5m 37s relative to midnight / current day
      const now = new Date();
      const target = new Date(now);
      target.setHours(23, 59, 59, 999);
      if (target.getTime() - now.getTime() < 3 * 3600 * 1000) {
        target.setTime(now.getTime() + (17 * 3600 + 5 * 60 + 37) * 1000);
      }
      return target.getTime();
    };

    const targetTime = getTargetTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(totalHours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [puja.bookingCloseAt, puja.date]);

  return (
    <section className="relative overflow-hidden border-b border-[#ead8b8] bg-gradient-to-b from-[#fbf4e8] via-[#fffaf0] to-[#fffdfa] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16 xl:px-12">
      {/* Warm Ambient Spiritual Glow */}
      <div className="pointer-events-none absolute -left-20 top-10 h-[380px] w-[380px] rounded-full bg-[#eab12c]/10 blur-[100px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-[#d4872b]/8 blur-[90px]" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          
          {/* =========================================================
              LEFT COLUMN: PUJA IMAGE CAROUSEL
          ========================================================== */}
          <div className="lg:col-span-6">
            <div className="group relative overflow-hidden rounded-[26px] sm:rounded-[30px] border-2 border-[#e6caa0] bg-[#fffdfa] p-2 shadow-[0_16px_45px_rgba(80,60,30,0.08)] transition-all duration-500 hover:border-[#d4872b]/70 hover:shadow-[0_20px_50px_rgba(212,135,43,0.12)]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[24px] bg-[#241a12]">
                <img
                  src={images[currentSlide] || puja.image}
                  alt={`${puja.name} - slide ${currentSlide + 1}`}
                  className="h-full w-full object-cover object-center transition-all duration-500"
                />
                
                {/* Subtle Bottom Gradient Scrim */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b120a]/75 via-transparent to-black/20" />

                {/* Floating Badge (Top Left) */}
                {puja.badge && (
                  <div className="absolute left-4 top-4 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[#1c130b]/85 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f5ce6f] backdrop-blur-md shadow-sm">
                      <Sparkles size={11} className="text-[#eab12c]" />
                      {puja.badge}
                    </span>
                  </div>
                )}

                {/* Location Overlay Pill (Bottom Left) */}
                <div className="absolute bottom-4 left-4 z-10 max-w-[85%]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11.5px] font-medium text-[#f0e3ce] backdrop-blur-sm shadow-sm">
                    <MapPin size={13} className="shrink-0 text-[#eab12c]" />
                    <span className="truncate">{puja.temple || puja.location}</span>
                  </span>
                </div>

                {/* Carousel Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      aria-label="Previous slide"
                      className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-all hover:bg-black/85 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#eab12c]"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      aria-label="Next slide"
                      className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-all hover:bg-black/85 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#eab12c]"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Pagination Indicators / Dots */}
                    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 backdrop-blur-sm">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSlide(idx)}
                          aria-label={`Go to slide ${idx + 1}`}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentSlide
                              ? "w-4 bg-[#eab12c]"
                              : "w-1.5 bg-white/60 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: PUJA INFORMATION & BOOKING HIERARCHY
          ========================================================== */}
          <div className="space-y-4 lg:col-span-6">
            
            {/* 1. Small Puja Category / Type Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4872b]/35 bg-[#fdf5e6] px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#b36c1e]">
                <Sparkles size={11} className="text-[#c77722]" />
                {puja.eyebrow || "VEDIC YAGYA • KASHI"}
              </span>
            </div>

            {/* 2. Main Puja Name */}
            <h1 className="font-serif text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#2b241d] sm:text-[34px] lg:text-[38px] xl:text-[42px]">
              {puja.name}
            </h1>

            {/* 3. Short Meaningful Subtitle / Tagline */}
            {puja.tagline && (
              <p className="font-serif text-[15px] italic leading-snug text-[#9d5b12] sm:text-[16.5px]">
                "{puja.tagline}"
              </p>
            )}

            {/* 4. Short Description (1-2 lines) */}
            <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#5e5143] line-clamp-2">
              {puja.description}
            </p>

            {/* 5. Date + Location Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-1.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs">
                <Calendar size={14} className="text-[#d4872b]" />
                <span>{puja.formattedDate}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-[#ead8b8] bg-[#fffaf0] px-3.5 py-1.5 text-[13px] font-semibold text-[#2b241d] shadow-2xs">
                <MapPin size={14} className="text-[#d4872b]" />
                <span>{puja.location}</span>
              </div>
            </div>

            {/* 6. Booking Closing Countdown (Inline, individual number boxes only) */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 text-[13px]">
              <span className="text-[13px] font-medium text-[#75695c]">Booking closes in</span>
              <div className="flex items-center gap-1.5 font-medium text-[#75695c]">
                <span className="inline-flex min-w-[34px] items-center justify-center rounded-md border border-[#e6caa0] bg-[#fffdf9] px-1.5 py-0.5 font-mono text-[13.5px] font-bold text-[#2b241d] shadow-2xs">
                  {timeLeft.hours}
                </span>
                <span className="text-[12px] font-semibold text-[#8c7e6c]">H</span>
                <span className="text-[#d6b8a0] font-bold">:</span>
                <span className="inline-flex min-w-[34px] items-center justify-center rounded-md border border-[#e6caa0] bg-[#fffdf9] px-1.5 py-0.5 font-mono text-[13.5px] font-bold text-[#2b241d] shadow-2xs">
                  {timeLeft.minutes}
                </span>
                <span className="text-[12px] font-semibold text-[#8c7e6c]">M</span>
                <span className="text-[#d6b8a0] font-bold">:</span>
                <span className="inline-flex min-w-[34px] items-center justify-center rounded-md border border-[#e6caa0] bg-[#fffdf9] px-1.5 py-0.5 font-mono text-[13.5px] font-bold text-[#2b241d] shadow-2xs">
                  {timeLeft.seconds}
                </span>
                <span className="text-[12px] font-semibold text-[#8c7e6c]">S</span>
              </div>
            </div>

            {/* 7. Social Proof / Trust Info */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5 text-[13.5px] text-[#5e5143]">
              {/* Rating & Reviews */}
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md border border-[#ecd5a8] bg-[#fbf0d9] px-2 py-0.5 text-[12.5px] font-bold text-[#9d5b12] shadow-2xs">
                  <Star size={12} fill="#d4872b" className="text-[#d4872b]" />
                  <span>{puja.rating || "4.8"}</span>
                </span>
                <span className="font-semibold text-[#2b241d]">
                  {puja.reviewCount ? `${puja.reviewCount} Reviews` : "7.3K Reviews"}
                </span>
              </div>

              <span className="text-[#d6b8a0]">•</span>

              {/* Devotees Booked */}
              <div className="flex items-center gap-1.5 text-[#5e5143]">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f6e7cb] text-[#a36316]">
                  <Users size={12} strokeWidth={2.2} />
                </div>
                <span className="text-[13px]">
                  <strong className="font-bold text-[#2b241d]">{puja.bookingCount || "15K+"}</strong> already booked this puja
                </span>
              </div>
            </div>

            {/* 8. Single Subtle Horizontal Divider & Price + Primary CTA */}
            <div className="border-t border-[#ead8b8] pt-4.5 sm:pt-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="block text-[10.5px] font-bold uppercase tracking-wider text-[#8a7c6b]">
                    Participation Starts At
                  </span>
                  <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                    <span className="font-serif text-[28px] font-bold leading-none text-[#2b241d] sm:text-[34px]">
                      {puja.formattedPrice}
                    </span>
                    <span className="text-[12px] font-medium text-[#7a6d5f]">
                      Incl. Samagri & Sankalp
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onBookClick}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#eab12c] px-8 py-3.5 text-[14.5px] font-bold text-[#1c1308] shadow-[0_6px_22px_rgba(234,177,44,0.32)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_28px_rgba(234,177,44,0.42)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4872b]"
                >
                  <span>Book This Puja</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default PujaHero;
