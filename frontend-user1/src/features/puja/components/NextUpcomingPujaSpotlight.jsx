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

const getStatusBadge = (status) => {
  switch (status) {
    case "Filling Fast":
      return { bg: "bg-amber-500/10 border-amber-500/30 text-[#b45309]", dot: "bg-amber-500", label: "Filling Fast" };
    case "Almost Full":
      return { bg: "bg-rose-500/10 border-rose-500/30 text-[#be123c]", dot: "bg-rose-500", label: "Almost Full" };
    case "Booking Closed":
      return { bg: "bg-stone-500/10 border-stone-400 text-stone-600", dot: "bg-stone-400", label: "Booking Closed" };
    case "Coming Soon":
      return { bg: "bg-sky-500/10 border-sky-500/30 text-sky-800", dot: "bg-sky-500", label: "Coming Soon" };
    case "Booking Open":
    default:
      return { bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-800", dot: "bg-emerald-500", label: "Booking Open" };
  }
};

/**
 * Compact-but-premium inline countdown.
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
    <div className="flex items-center gap-2">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2">
          <div className="flex min-w-[54px] flex-col items-center rounded-xl border border-[#ebdcc4] bg-[#fffaf0] px-3 py-2 shadow-2xs sm:min-w-[58px]">
            <span className="font-serif text-[20px] font-bold leading-none text-[#2b241d] sm:text-[22px]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-[#917960]">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && <span className="text-[15px] text-[#d4c3ab]">:</span>}
        </div>
      ))}
    </div>
  );
};

const NextUpcomingPujaSpotlight = () => {
  const upcomingEvents = useMemo(() => {
    const list = getNextUpcomingPujas(5);
    return list.length > 0 ? list : PUJA_LIST.slice(0, 5);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentEvent = upcomingEvents[currentIndex] || upcomingEvents[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? upcomingEvents.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === upcomingEvents.length - 1 ? 0 : prev + 1));
  };

  const statusConfig = getStatusBadge(currentEvent.bookingStatus);
  const isBookable = currentEvent.bookingStatus !== "Booking Closed" && currentEvent.bookingStatus !== "Coming Soon";

  return (
    <section
      id="next-upcoming-puja"
      aria-label="Next Upcoming Puja Spotlight"
      className="relative mx-auto max-w-[1400px] px-4 pt-8 pb-10 sm:px-6 lg:px-8 xl:px-10"
    >
      {/* Scoped scrollbar-hide utility — keeps horizontal scroll working, hides the bar itself */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Eyebrow */}
      <div className="mb-4 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <Flame size={15} className="text-[#c77722]" />
          <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            Next Upcoming Puja
          </span>
        </div>

        {upcomingEvents.length > 1 && (
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] font-bold text-[#8a7a68]">
              <span className="text-[#2b241d]">{currentIndex + 1}</span> of {upcomingEvents.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous upcoming puja"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ebdcc4] bg-[#fffaf0] text-[#423629] shadow-2xs transition-all hover:border-[#c77722] hover:text-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next upcoming puja"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#ebdcc4] bg-[#fffaf0] text-[#423629] shadow-2xs transition-all hover:border-[#c77722] hover:text-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c77722]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          QUICK MULTI-EVENT PILL SELECTOR — now placed at the top,
          right above the spotlight card
      ========================================================== */}
      {upcomingEvents.length > 1 && (
        <div className="no-scrollbar mb-4 flex items-center gap-2 overflow-x-auto">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#917960]">
            Explore Upcoming:
          </span>
          {upcomingEvents.map((event, idx) => (
            <button
              key={event.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition-all ${idx === currentIndex
                ? "bg-[#2b241d] text-[#f5ce6f] shadow-2xs"
                : "border border-[#ebdcc4] bg-[#fffaf0] text-[#6b5d4e] hover:border-[#c77722] hover:text-[#2b241d]"
                }`}
            >
              <span className="max-w-[130px] truncate sm:max-w-[190px]">{event.name}</span>
              <span className="text-[10px] opacity-75">({event.date?.slice(5)})</span>
            </button>
          ))}
        </div>
      )}

      {/* =========================================================
          SPACIOUS SPOTLIGHT STRIP — premium single-row card
      ========================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-[#ebdcc4] bg-[#fffdfa] shadow-[0_10px_32px_rgba(43,36,29,0.07)] transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-stretch">

          {/* Thumbnail — fixed aspect ratio so every puja image renders at the same size, regardless of source dimensions */}
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-auto sm:h-auto sm:w-[190px] lg:w-[220px]">
            <img
              src={currentEvent.image}
              alt={currentEvent.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#1f160e]/80 px-2.5 py-1 text-[10.5px] font-semibold text-[#f5ce6f] backdrop-blur-md">
              <Sparkles size={10} className="text-[#eab12c]" />
              {currentEvent.category || currentEvent.occasion || "Puja"}
            </span>
            <span
              className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold backdrop-blur-md ${statusConfig.bg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
              {statusConfig.label}
            </span>
          </div>

          {/* Title + tags + date/location */}
          <div className="flex flex-col justify-center gap-2 border-b border-[#f0e2cd] px-6 py-5 sm:border-b-0 sm:border-r sm:px-7 sm:py-6 sm:w-[270px] lg:w-[300px]">
            <Link
              to={`/puja/${currentEvent.slug}`}
              className="font-serif text-[21px] font-bold leading-snug text-[#2b241d] transition-colors hover:text-[#c77722] sm:text-[23px]"
            >
              {currentEvent.name}
            </Link>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#75695c]">
              <Sparkles size={12} className="shrink-0 text-[#d4872b]" />
              <span className="truncate">{currentEvent.purpose}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] font-semibold text-[#6b5d4e]">
              <div className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-[#c77722]" />
                <span>{currentEvent.formattedDate}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-[#c77722]" />
                <span>{currentEvent.location}</span>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex flex-col justify-center gap-2.5 border-b border-[#f0e2cd] px-6 py-5 sm:border-b-0 sm:border-r sm:px-7 sm:py-6">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#8a7a68]">
              Starts In
            </span>
            <CompactCountdown targetDateTime={currentEvent.startDateTime} />
          </div>

          {/* Price + CTA */}
          <div className="flex flex-1 flex-col justify-center gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-6">
            <div>
              <span className="block text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#8a7a68]">
                From
              </span>
              <span className="font-serif text-[28px] font-bold leading-tight text-[#2b241d] sm:text-[30px]">
                {currentEvent.formattedPrice}
              </span>
            </div>

            <div className="flex flex-col items-start gap-1.5 sm:items-end">
              {isBookable ? (
                <Link
                  to={`/puja/${currentEvent.slug}`}
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#eab12c] px-7 py-3.5 text-[14px] font-bold text-[#1c1308] shadow-[0_6px_18px_rgba(234,177,44,0.35)] transition-all duration-300 hover:bg-[#dda018] hover:shadow-[0_8px_22px_rgba(234,177,44,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                >
                  <span>Book Your Sankalp</span>
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ) : currentEvent.bookingStatus === "Coming Soon" ? (
                <Link
                  to={`/puja/${currentEvent.slug}`}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#c77722] bg-[#fffdfa] px-7 py-3.5 text-[13.5px] font-bold text-[#9d5b12] shadow-2xs transition-colors hover:bg-[#fbf4e8]"
                >
                  <span>Notify Me</span>
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <span className="inline-flex cursor-not-allowed items-center justify-center whitespace-nowrap rounded-full bg-stone-200 px-7 py-3.5 text-[13.5px] font-bold text-stone-500">
                  Booking Closed
                </span>
              )}

              {isBookable && (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#8a7a68]">
                  <ShieldCheck size={11} className="text-[#8a7a68]" />
                  Secure Transaction
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextUpcomingPujaSpotlight;