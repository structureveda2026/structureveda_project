import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { getNextUpcomingPujas, PUJA_LIST } from "../data/pujaData";
import defaultPujaImg from "../../../assets/images/puja-kashi.jpg";

const getStatusBadge = (status) => {
  switch (status) {
    case "Filling Fast":
      return {
        bg: "bg-amber-500/15 border-amber-500/30 text-[#b45309]",
        dot: "bg-amber-500",
        label: "Filling Fast",
      };
    case "Almost Full":
      return {
        bg: "bg-rose-500/15 border-rose-500/30 text-[#be123c]",
        dot: "bg-rose-500",
        label: "Almost Full",
      };
    case "Booking Closed":
      return {
        bg: "bg-stone-500/15 border-stone-400 text-stone-600",
        dot: "bg-stone-400",
        label: "Booking Closed",
      };
    case "Coming Soon":
      return {
        bg: "bg-sky-500/15 border-sky-500/30 text-sky-800",
        dot: "bg-sky-500",
        label: "Coming Soon",
      };
    case "Booking Open":
    default:
      return {
        bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-800",
        dot: "bg-emerald-500",
        label: "Booking Open",
      };
  }
};

/**
 * Compact, editorial inline countdown module.
 */
const CompactCountdown = ({ targetDateTime }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDateTime).getTime();

    const tick = () => {
      const diff = Math.max(target - Date.now(), 0);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDateTime]);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-1 sm:gap-1.5">
          <div className="flex w-[42px] sm:w-[46px] lg:w-[44px] xl:w-[48px] flex-col items-center rounded-xl border border-[#ebdcc4] bg-[#fffaf0] py-1.5 text-center shadow-2xs">
            <span className="font-serif text-[17px] sm:text-[18px] lg:text-[18px] xl:text-[19px] font-bold leading-none text-[#2b241d]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[8px] sm:text-[8.5px] font-semibold uppercase tracking-wider text-[#917960]">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-[13px] font-bold text-[#d4c3ab]">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Next Upcoming Puja Spotlight Carousel
 * Responsive horizontal banner with:
 * - Outside flanking arrows
 * - Responsive 4-column layout guaranteeing zero clipping on any screen width
 * - Clickable carousel dots below
 * - Auto-rotation with hover/focus pause
 */
const NextUpcomingPujaSpotlight = ({ pujas }) => {
  const upcomingEvents = useMemo(() => {
    if (Array.isArray(pujas)) {
      const now = Date.now();
      return [...pujas]
        .filter((p) => !p.startDateTime || new Date(p.startDateTime).getTime() > now)
        .sort((a, b) => {
          const timeA = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
          const timeB = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
          return timeA - timeB;
        })
        .slice(0, 5);
    }
    const list = getNextUpcomingPujas(5);
    return list.length > 0 ? list : PUJA_LIST.slice(0, 5);
  }, [pujas]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentEvent = upcomingEvents[currentIndex] || upcomingEvents[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? upcomingEvents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === upcomingEvents.length - 1 ? 0 : prev + 1));
  };

  const handleSelectEvent = (idx) => {
    setCurrentIndex(idx);
  };

  // Auto-rotation every 5 seconds (pauses on hover/focus and respects prefers-reduced-motion)
  useEffect(() => {
    if (isPaused || !currentEvent || upcomingEvents.length <= 1) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === upcomingEvents.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, upcomingEvents.length, currentIndex, currentEvent]);

  // Early return must only occur AFTER all hooks have executed unconditionally
  if (!currentEvent) return null;

  const statusConfig = getStatusBadge(currentEvent.bookingStatus);
  const isBookable =
    currentEvent.bookingStatus !== "Booking Closed" &&
    currentEvent.bookingStatus !== "Coming Soon";

  return (
    <section
      id="next-upcoming-puja"
      aria-label="Next Upcoming Puja Spotlight"
      className="relative mx-auto max-w-[1360px] px-4 pt-8 pb-10 sm:px-6 lg:px-8"
    >
      {/* Component Scoped Styles */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes spotlightFadeIn {
          from {
            opacity: 0.7;
            transform: translateX(6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .spotlight-animate-enter {
          animation: spotlightFadeIn 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .spotlight-animate-enter {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      {/* ── Header: Eyebrow + Counter ── */}
      <div className="mb-3.5 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <Flame size={15} className="text-[#c77722]" />
          <span className="text-[11.5px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            Next Upcoming Puja
          </span>
        </div>

        {upcomingEvents.length > 1 && (
          <span className="text-[12.5px] font-bold text-[#8a7a68]">
            <span className="text-[#2b241d]">{currentIndex + 1}</span> of {upcomingEvents.length}
          </span>
        )}
      </div>

      {/* ── Quick Multi-Event Pill Selector (Explore Upcoming) ── */}
      {upcomingEvents.length > 1 && (
        <div className="no-scrollbar mb-4 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#917960]">
            Explore Upcoming:
          </span>
          {upcomingEvents.map((event, idx) => (
            <button
              key={event.id}
              type="button"
              onClick={() => handleSelectEvent(idx)}
              aria-current={idx === currentIndex ? "true" : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-all cursor-pointer ${
                idx === currentIndex
                  ? "bg-[#2b241d] text-[#f5ce6f] shadow-2xs"
                  : "border border-[#ebdcc4] bg-[#fffaf0] text-[#6b5d4e] hover:border-[#c77722] hover:text-[#2b241d]"
              }`}
            >
              <span className="max-w-[130px] truncate sm:max-w-[190px]">{event.name}</span>
              <span className="text-[10.5px] opacity-80">{event.date?.slice(5)}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Carousel Wrapper with Desktop Flanking Arrows (Outside Card) ── */}
      <div className="relative flex items-center justify-center">
        
        {/* Desktop Left Carousel Arrow */}
        {upcomingEvents.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous upcoming puja"
            className="hidden lg:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ebdcc4] bg-[#fffdfa] text-[#2b241d] shadow-sm transition-all duration-200 hover:scale-105 hover:border-[#c77722] hover:bg-[#eab12c] hover:text-[#1c1308] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] cursor-pointer mr-3 xl:mr-4"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Spotlight Banner Card - No overflow-hidden on card parent to prevent clipping */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="flex-1 min-w-0 rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] shadow-[0_8px_28px_rgba(43,36,29,0.06)] transition-all duration-300"
        >
          <div
            key={currentEvent.id}
            className="spotlight-animate-enter flex flex-col lg:flex-row lg:items-stretch w-full"
          >
            {/* Column 1: Image Area with Category & Status Badges */}
            <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-auto w-full lg:w-[210px] xl:w-[230px] shrink-0 rounded-t-[19px] lg:rounded-l-[19px] lg:rounded-tr-none overflow-hidden">
              <img
                src={currentEvent.image}
                alt={currentEvent.name}
                className="h-full w-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultPujaImg;
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {/* Category Badge near Top-Left */}
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#1f160e]/80 px-2.5 py-1 text-[10.5px] font-semibold text-[#f5ce6f] backdrop-blur-md shadow-xs">
                <Sparkles size={10} className="text-[#eab12c]" />
                <span>{currentEvent.category || currentEvent.occasion || "Puja"}</span>
              </span>

              {/* Status Badge near Bottom-Left */}
              <span
                className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold backdrop-blur-md shadow-xs ${statusConfig.bg}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
                <span>{statusConfig.label}</span>
              </span>
            </div>

            {/* Column 2: Event Information (Title, Purpose, Date, Location) - Flexible Width with min-w-0 */}
            <div className="flex flex-1 min-w-0 flex-col justify-center border-b border-[#f0e2cd]/80 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:p-5 xl:p-6">
              <Link
                to={`/puja/${currentEvent.slug}`}
                className="font-serif text-[18px] sm:text-[20px] lg:text-[20px] xl:text-[22px] font-bold leading-snug text-[#2b241d] transition-colors hover:text-[#c77722] line-clamp-2"
              >
                {currentEvent.name}
              </Link>

              <div className="mt-1.5 flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-medium text-[#75695c]">
                <Sparkles size={12} className="shrink-0 text-[#d4872b]" />
                <span className="truncate">{currentEvent.purpose}</span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11.5px] sm:text-[12px] font-semibold text-[#6b5d4e]">
                <div className="inline-flex items-center gap-1.5 shrink-0">
                  <Calendar size={13} className="text-[#c77722] shrink-0" />
                  <span>{currentEvent.formattedDate}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 min-w-0">
                  <MapPin size={13} className="text-[#c77722] shrink-0" />
                  <span className="truncate max-w-[150px]">{currentEvent.location}</span>
                </div>
              </div>
            </div>

            {/* Column 3: Countdown Module - Controlled Width */}
            <div className="flex shrink-0 flex-col justify-center border-b border-[#f0e2cd]/80 p-5 sm:p-6 lg:border-b-0 lg:border-r lg:px-4 xl:px-6 lg:py-5">
              <span className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a7a68]">
                STARTS IN
              </span>
              <CompactCountdown targetDateTime={currentEvent.startDateTime} />
            </div>

            {/* Column 4: Price + CTA + Security Notice - Completely Visible Without Clipping */}
            <div className="flex shrink-0 flex-col justify-center items-start sm:items-end lg:items-center gap-2.5 p-5 sm:p-6 lg:px-3 xl:px-4 lg:py-5 lg:w-[245px] xl:w-[255px] rounded-b-[19px] lg:rounded-r-[19px] lg:rounded-bl-none">
              {/* Price */}
              <div className="text-left sm:text-right lg:text-center">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7a68]">
                  From
                </span>
                <span className="font-serif text-[24px] sm:text-[26px] lg:text-[28px] font-bold leading-tight text-[#2b241d]">
                  {currentEvent.formattedPrice}
                </span>
              </div>

              {/* Action CTA Button - Single Line, Fits Column Fully and Never Wraps or Overflows */}
              <div className="w-full sm:w-auto lg:w-full flex justify-start sm:justify-end lg:justify-center">
                {isBookable ? (
                  <Link
                    to={`/puja/${currentEvent.slug}`}
                    className="group inline-flex w-full sm:w-auto lg:w-full max-w-[220px] items-center justify-center flex-nowrap whitespace-nowrap gap-2 rounded-full bg-[#eab12c] px-5 py-2.5 text-[12px] xl:text-[12.5px] font-bold uppercase tracking-wider text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.3)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_6px_18px_rgba(234,177,44,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] text-center"
                  >
                    <span className="whitespace-nowrap">Book Your Sankalp</span>
                    <ArrowRight
                      size={14}
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ) : currentEvent.bookingStatus === "Coming Soon" ? (
                  <Link
                    to={`/puja/${currentEvent.slug}`}
                    className="inline-flex w-full sm:w-auto lg:w-full max-w-[220px] items-center justify-center flex-nowrap whitespace-nowrap gap-2 rounded-full border border-[#c77722] bg-[#fffdfa] px-5 py-2.5 text-[12px] font-bold text-[#9d5b12] shadow-2xs transition-colors hover:bg-[#fbf4e8] text-center"
                  >
                    <span className="whitespace-nowrap">Notify Me</span>
                    <ArrowRight size={14} className="shrink-0" />
                  </Link>
                ) : (
                  <span className="inline-flex w-full sm:w-auto lg:w-full max-w-[220px] cursor-not-allowed items-center justify-center flex-nowrap whitespace-nowrap rounded-full bg-stone-200 px-5 py-2.5 text-[12px] font-bold text-stone-500 text-center">
                    Booking Closed
                  </span>
                )}
              </div>

              {/* Secure Transaction Notice */}
              {isBookable && (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#8a7a68]">
                  <ShieldCheck size={11} className="text-[#c77722] shrink-0" />
                  <span>Secure Transaction</span>
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Desktop Right Carousel Arrow */}
        {upcomingEvents.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next upcoming puja"
            className="hidden lg:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ebdcc4] bg-[#fffdfa] text-[#2b241d] shadow-sm transition-all duration-200 hover:scale-105 hover:border-[#c77722] hover:bg-[#eab12c] hover:text-[#1c1308] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] cursor-pointer ml-3 xl:ml-4"
          >
            <ChevronRight size={18} />
          </button>
        )}

      </div>

      {/* ── Carousel Dot Indicators (Below the Banner) ── */}
      {upcomingEvents.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          {/* Mobile Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous upcoming puja"
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-full border border-[#ebdcc4] bg-[#fffaf0] text-[#2b241d] shadow-2xs transition-all hover:bg-[#eab12c] hover:border-[#c77722] cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Carousel slide indicator">
            {upcomingEvents.map((event, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={event.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}: ${event.name}`}
                  onClick={() => handleSelectEvent(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] ${
                    isActive
                      ? "h-2.5 w-7 bg-[#eab12c] shadow-xs"
                      : "h-2.5 w-2.5 bg-[#ebdcc4] hover:bg-[#c77722]/60"
                  }`}
                />
              );
            })}
          </div>

          {/* Mobile Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next upcoming puja"
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-full border border-[#ebdcc4] bg-[#fffaf0] text-[#2b241d] shadow-2xs transition-all hover:bg-[#eab12c] hover:border-[#c77722] cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

    </section>
  );
};

export default NextUpcomingPujaSpotlight;