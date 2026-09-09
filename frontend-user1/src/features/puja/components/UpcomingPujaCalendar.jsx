import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { PUJA_LIST, getPujasByDate } from "../data/pujaData";
import defaultPujaImg from "../../../assets/images/puja-kashi.jpg";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Format year, monthIndex (0-11), and day into canonical ISO string YYYY-MM-DD.
 * Strictly string-based to prevent any client-side timezone shifting.
 */
const formatISODate = (year, monthIndex, day) => {
  const y = String(year);
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * Extract 12-hour time string from ISO startDateTime safely without timezone shifting
 * Example: "2026-09-12T07:00:00+05:30" -> "07:00 AM IST"
 */
const formatEventTime = (startDateTime) => {
  if (!startDateTime || !startDateTime.includes("T")) return null;
  const timePart = startDateTime.split("T")[1];
  const [hhStr, mmStr] = timePart.split(":");
  let hh = parseInt(hhStr, 10);
  const mm = mmStr || "00";
  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12 || 12;
  return `${String(hh).padStart(2, "0")}:${mm} ${ampm} IST`;
};

/**
 * Dynamically resolves the initial calendar month from the earliest upcoming event.
 * Never hardcodes September 2026.
 */
const getInitialCalendarState = () => {
  const now = Date.now();
  const futureEvents = PUJA_LIST
    .filter((p) => p.startDateTime && new Date(p.startDateTime).getTime() > now)
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

  if (futureEvents.length > 0) {
    const earliest = futureEvents[0];
    const [yStr, mStr] = earliest.date.split("-");
    const year = parseInt(yStr, 10);
    const monthIndex = parseInt(mStr, 10) - 1;
    return {
      year,
      monthIndex,
      selectedDate: earliest.date,
    };
  }

  const d = new Date();
  const year = d.getFullYear();
  const monthIndex = d.getMonth();
  return {
    year,
    monthIndex,
    selectedDate: formatISODate(year, monthIndex, d.getDate()),
  };
};

/**
 * Status styling mapper with reliable dark-tinted backing surfaces for strong contrast.
 */
const getStatusBadge = (status) => {
  switch (status) {
    case "Filling Fast":
      return {
        bg: "bg-[#241709]/92 border-amber-500/40 text-[#fcd34d]",
        dot: "bg-amber-400",
        label: "Filling Fast",
      };
    case "Almost Full":
      return {
        bg: "bg-[#251014]/92 border-rose-500/40 text-[#fda4af]",
        dot: "bg-rose-400",
        label: "Almost Full",
      };
    case "Booking Closed":
      return {
        bg: "bg-[#1c1917]/92 border-stone-600/40 text-[#d6d3d1]",
        dot: "bg-stone-400",
        label: "Booking Closed",
      };
    case "Coming Soon":
      return {
        bg: "bg-[#1f190e]/92 border-[#d4a359]/40 text-[#f5d590]",
        dot: "bg-[#eab12c]",
        label: "Coming Soon",
      };
    case "Booking Open":
    default:
      return {
        bg: "bg-[#111f15]/92 border-emerald-500/40 text-[#6ee7b7]",
        dot: "bg-emerald-400",
        label: "Booking Open",
      };
  }
};

const UpcomingPujaCalendar = () => {
  const [{ year, monthIndex, selectedDate }, setCalendarState] = useState(getInitialCalendarState);

  // Calculate calendar grid days for current viewed month
  const calendarGrid = useMemo(() => {
    const now = Date.now();
    // Total days in viewed month
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    // Starting day of week for the 1st of viewed month (0 = Sun, 6 = Sat)
    const firstDayIndex = new Date(year, monthIndex, 1).getDay();

    const cells = [];

    // Empty lead cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ isCurrentMonth: false, key: `lead-${i}` });
    }

    // Days in current month
    for (let day = 1; day <= totalDays; day++) {
      const isoDate = formatISODate(year, monthIndex, day);
      // Scheduled event detection: canonical getPujasByDate filtered for upcoming events
      const rawEvents = getPujasByDate(isoDate);
      const upcomingEventsOnDate = rawEvents.filter(
        (p) => !p.startDateTime || new Date(p.startDateTime).getTime() > now
      );

      cells.push({
        isCurrentMonth: true,
        day,
        isoDate,
        hasEvents: upcomingEventsOnDate.length > 0,
        eventCount: upcomingEventsOnDate.length,
        key: isoDate,
      });
    }

    return cells;
  }, [year, monthIndex]);

  // Month navigation: update currentMonth and auto-select first scheduled ceremony in new month
  const handlePrevMonth = () => {
    setCalendarState((prev) => {
      let nextMonth = prev.monthIndex - 1;
      let nextYear = prev.year;
      if (nextMonth < 0) {
        nextMonth = 11;
        nextYear -= 1;
      }

      const now = Date.now();
      const targetPrefix = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}`;
      const monthEvents = PUJA_LIST
        .filter(
          (p) =>
            p.date &&
            p.date.startsWith(targetPrefix) &&
            (!p.startDateTime || new Date(p.startDateTime).getTime() > now)
        )
        .sort((a, b) => a.date.localeCompare(b.date));

      const newSelectedDate = monthEvents.length > 0 ? monthEvents[0].date : null;
      return { year: nextYear, monthIndex: nextMonth, selectedDate: newSelectedDate };
    });
  };

  const handleNextMonth = () => {
    setCalendarState((prev) => {
      let nextMonth = prev.monthIndex + 1;
      let nextYear = prev.year;
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear += 1;
      }

      const now = Date.now();
      const targetPrefix = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}`;
      const monthEvents = PUJA_LIST
        .filter(
          (p) =>
            p.date &&
            p.date.startsWith(targetPrefix) &&
            (!p.startDateTime || new Date(p.startDateTime).getTime() > now)
        )
        .sort((a, b) => a.date.localeCompare(b.date));

      const newSelectedDate = monthEvents.length > 0 ? monthEvents[0].date : null;
      return { year: nextYear, monthIndex: nextMonth, selectedDate: newSelectedDate };
    });
  };

  // Resolve events for the selected date (supports single or multiple events)
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const now = Date.now();
    return getPujasByDate(selectedDate).filter(
      (p) => !p.startDateTime || new Date(p.startDateTime).getTime() > now
    );
  }, [selectedDate]);

  // Format selected date for display
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return null;
    const [y, m, d] = selectedDate.split("-").map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
  }, [selectedDate]);

  return (
    <section
      id="puja-calendar"
      aria-label="Upcoming Puja Calendar"
      className="mt-14 mb-8 sm:mt-16 sm:mb-12"
    >
      {/* ── Section Header ── */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
          <CalendarIcon size={12} className="text-[#c77722]" />
          <span>Vedic Calendar View</span>
        </div>
        <h2 className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px]">
          Upcoming Puja Calendar
        </h2>
        <p className="max-w-[720px] text-[14.5px] leading-relaxed text-[#6b5d4e]">
          Explore upcoming sacred ceremonies by date and discover the Puja scheduled in Kashi.
        </p>
      </div>

      {/* ── Main Calendar Container (Refined Split Layout) ── */}
      <div className="rounded-[24px] border border-[#ebdcc4] bg-[#fbf6ec]/60 p-4 sm:p-6 lg:p-8 shadow-xs">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10 items-start">
          
          {/* =========================================================
              LEFT: MONTH-WISE INTERACTIVE CALENDAR GRID (7 cols)
          ========================================================== */}
          <div className="rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-4 sm:p-6 shadow-2xs lg:col-span-7">
            
            {/* 1. Month Navigation Header */}
            <div className="mb-5 flex items-center justify-between border-b border-[#f0e2cd] pb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="inline-flex items-center gap-1 rounded-[8px] border border-[#ebdcc4] bg-[#fffaf0] px-3 py-1.5 text-[12px] font-semibold text-[#423629] shadow-2xs transition-all duration-200 hover:border-[#c77722] hover:bg-[#fffdfa] hover:text-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
              >
                <ChevronLeft size={15} />
                <span>Prev</span>
              </button>

              <div className="text-center">
                <span className="font-serif text-[18px] font-bold tracking-wide text-[#2b241d] sm:text-[20px]">
                  {MONTH_NAMES[monthIndex]} {year}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="inline-flex items-center gap-1 rounded-[8px] border border-[#ebdcc4] bg-[#fffaf0] px-3 py-1.5 text-[12px] font-semibold text-[#423629] shadow-2xs transition-all duration-200 hover:border-[#c77722] hover:bg-[#fffdfa] hover:text-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>

            {/* 2. Days of Week Header */}
            <div className="grid grid-cols-7 text-center text-[11.5px] font-bold uppercase tracking-wider text-[#8a7a68] pb-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* 3. Calendar Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-1 sm:gap-2">
              {calendarGrid.map((cell) => {
                if (!cell.isCurrentMonth) {
                  return (
                    <div
                      key={cell.key}
                      aria-hidden="true"
                      className="h-10 sm:h-12 rounded-[10px] opacity-10"
                    />
                  );
                }

                const isSelected = selectedDate === cell.isoDate;
                const hasEvents = cell.hasEvents;

                return (
                  <button
                    key={cell.key}
                    type="button"
                    onClick={() =>
                      setCalendarState((prev) => ({ ...prev, selectedDate: cell.isoDate }))
                    }
                    aria-label={`${cell.day} ${MONTH_NAMES[monthIndex]} ${year}${
                      hasEvents ? ` - ${cell.eventCount} ceremony scheduled` : ""
                    }`}
                    aria-selected={isSelected}
                    className={`relative flex h-10 sm:h-12 flex-col items-center justify-center rounded-[10px] text-[13px] font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] ${
                      isSelected
                        ? "bg-[#2b241d] text-[#f5ce6f] shadow-xs scale-[1.02]"
                        : hasEvents
                        ? "border border-[#eab12c]/80 bg-[#fff8eb] text-[#2b241d] hover:border-[#c77722] hover:bg-[#fff3db]"
                        : "border border-transparent text-[#685c4f] hover:border-[#ebdcc4] hover:bg-[#fffaf0]"
                    }`}
                  >
                    <span>{cell.day}</span>

                    {/* Indicator Dot for Scheduled Event(s) */}
                    {hasEvents && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full mt-0.5 ${
                          isSelected ? "bg-[#eab12c]" : "bg-[#c77722]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 4. Calendar Legend */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-5 border-t border-[#f0e2cd]/80 pt-3.5 text-[11.5px] text-[#75695c]">
              <div className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#c77722]" />
                <span>Ceremony Scheduled</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-[3px] bg-[#2b241d]" />
                <span>Selected Date</span>
              </div>
            </div>

          </div>

          {/* =========================================================
              RIGHT: SELECTED DATE CEREMONY DETAILS (5 cols)
          ========================================================== */}
          <div className="rounded-[20px] border border-[#ebdcc4] bg-[#fffdfa] p-4 sm:p-5 shadow-2xs lg:col-span-5">
            
            {/* Panel Top Heading */}
            <div className="flex items-center justify-between border-b border-[#ebdcc4] pb-3 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b36c1e]">
                Ceremonies for Date
              </span>
              {formattedSelectedDate && (
                <span className="text-[12.5px] font-bold text-[#2b241d]">
                  {formattedSelectedDate}
                </span>
              )}
            </div>

            {/* Ceremony Event Previews with Integrated Photo or Empty State */}
            <div className="space-y-4">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map((event) => {
                  const statusConfig = getStatusBadge(event.bookingStatus);
                  const muhuratTime = formatEventTime(event.startDateTime);
                  const eventImg = event.image || defaultPujaImg;

                  return (
                    <div
                      key={event.id}
                      className="overflow-hidden rounded-[16px] border border-[#ebdcc4] bg-[#fffdfa] shadow-xs transition-all duration-200 hover:border-[#d4872b]"
                    >
                      {/* Integrated Ceremony Photo with Category & Status Overlay */}
                      <div className="relative h-44 w-full overflow-hidden bg-[#241a12] sm:h-48">
                        <img
                          src={eventImg}
                          alt={event.name}
                          className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        {/* Soft dark vignette */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />

                        {/* Top Category Tag + High-contrast Status Badge */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                          <span className="rounded-full bg-black/70 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-[#f5eedf]">
                            {event.category || "Sacred Puja"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold shadow-xs ${statusConfig.bg}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
                            <span>{statusConfig.label}</span>
                          </span>
                        </div>

                        {/* Location chip overlay at bottom */}
                        <div className="absolute bottom-2.5 left-3 z-10">
                          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#f5eedf]">
                            <MapPin size={11} className="text-[#eab12c]" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 sm:p-5">
                        {/* Date & Occasion */}
                        <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-[#75695c]">
                          <span className="font-semibold text-[#b36c1e]">
                            {formattedSelectedDate || event.formattedDate}
                          </span>
                          {event.occasion && (
                            <>
                              <span className="text-[#d9c9b4]" aria-hidden="true">•</span>
                              <span className="text-[#5c4e3f]">{event.occasion}</span>
                            </>
                          )}
                        </div>

                        {/* Ceremony Title */}
                        <h4 className="mt-1.5 font-serif text-[18px] font-bold leading-snug text-[#2b241d] transition-colors hover:text-[#c77722]">
                          <Link to={`/puja/${event.slug}`}>{event.name}</Link>
                        </h4>

                        {/* Muhurat / Timing */}
                        {muhuratTime && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-[#8a7a68]">
                            <Clock size={12} className="text-[#c77722] shrink-0" />
                            <span>{muhuratTime}</span>
                          </div>
                        )}

                        {/* Purpose */}
                        {event.purpose && (
                          <div className="mt-2 flex items-center gap-1.5 text-[12.5px] text-[#5c4e3f]">
                            <Sparkles size={12} className="text-[#d4872b] shrink-0" />
                            <span className="line-clamp-1">{event.purpose}</span>
                          </div>
                        )}

                        {/* Bottom Row: Starting Price + Compact View Puja CTA */}
                        <div className="mt-4 flex items-center justify-between border-t border-[#f0e2cd] pt-3">
                          <div>
                            <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#8a7a68]">
                              Starts From
                            </span>
                            <span className="font-serif text-[18px] font-bold text-[#2b241d]">
                              {event.formattedPrice || `₹${event.price}`}
                            </span>
                          </div>

                          <Link
                            to={`/puja/${event.slug}`}
                            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#eab12c] px-4 py-2 text-[12.5px] font-bold text-[#1c1308] shadow-2xs transition-all duration-200 hover:bg-[#dda018] hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                          >
                            <span>View Puja</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty State for Date */
                <div className="flex flex-col items-center justify-center py-10 px-3 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ebdcc4] bg-[#fffaf0] text-[#b36c1e]">
                    <CalendarIcon size={18} />
                  </div>
                  <h4 className="mt-3 font-serif text-[16px] font-bold text-[#2b241d]">
                    No rituals scheduled on this date
                  </h4>
                  <p className="mt-1 text-[12.5px] text-[#75695c] max-w-[240px]">
                    Select a highlighted date with a gold indicator to explore upcoming ceremonies.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Quick Help Note */}
            <div className="mt-4 border-t border-[#ebdcc4] pt-3 text-[11.5px] text-[#75695c] flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#c77722] shrink-0" />
              <span>All dates reflect authentic Shastric Muhurats in Kashi.</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default UpcomingPujaCalendar;

