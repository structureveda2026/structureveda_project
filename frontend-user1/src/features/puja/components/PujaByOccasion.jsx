import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { PUJA_LIST } from "../data/pujaData";

// Authentic local occasion icons
import lampIcon from "../../../assets/images/Pujas-by-Occasion/lamp.png";
import moonIcon from "../../../assets/images/Pujas-by-Occasion/moon.png";
import moonPhaseIcon from "../../../assets/images/Pujas-by-Occasion/moon-phase.png";
import chakrasIcon from "../../../assets/images/Pujas-by-Occasion/chakras.png";
import trisulIcon from "../../../assets/images/Pujas-by-Occasion/trisul.png";
import sunIcon from "../../../assets/images/Pujas-by-Occasion/sun.png";
import shaktiIcon from "../../../assets/images/Pujas-by-Occasion/shakti.png";
import japaMalaIcon from "../../../assets/images/Pujas-by-Occasion/japa-mala.png";
import templeIcon from "../../../assets/images/Pujas-by-Occasion/temple.png";

/**
 * Presentation configuration for the 10 manager-approved occasion categories.
 * Maps occasion names to canonical data keys (event.occasion) and local icon assets.
 */
const OCCASION_CONFIG = [
  { id: "festival-puja", title: "Festival Puja", occasionKey: "Festival Puja", icon: lampIcon },
  { id: "purnima", title: "Purnima", occasionKey: "Purnima", icon: moonIcon },
  { id: "amavasya", title: "Amavasya", occasionKey: "Amavasya", icon: moonPhaseIcon },
  { id: "ekadashi", title: "Ekadashi", occasionKey: "Ekadashi", icon: chakrasIcon },
  { id: "pradosh", title: "Pradosh", occasionKey: "Pradosh", icon: trisulIcon },
  { id: "sankranti", title: "Sankranti", occasionKey: "Sankranti", icon: sunIcon },
  { id: "navratri", title: "Navratri", occasionKey: "Navratri", icon: shaktiIcon },
  { id: "mahashivratri", title: "Mahashivratri", occasionKey: "Mahashivratri", icon: trisulIcon },
  { id: "sawan", title: "Sawan", occasionKey: "Sawan", icon: japaMalaIcon },
  { id: "special-kashi-rituals", title: "Special Kashi Rituals", occasionKey: "Special Kashi Rituals", icon: templeIcon },
];

const PujaByOccasion = () => {
  // Dynamically resolve upcoming events for each occasion from PUJA_LIST
  const occasionEventsMap = useMemo(() => {
    const now = Date.now();
    const map = {};

    OCCASION_CONFIG.forEach((cat) => {
      const matchingEvents = PUJA_LIST.filter(
        (p) =>
          p.occasion === cat.occasionKey &&
          (!p.startDateTime || new Date(p.startDateTime).getTime() > now)
      ).sort((a, b) => {
        const timeA = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
        const timeB = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
        return timeA - timeB;
      });

      map[cat.occasionKey] = matchingEvents;
    });

    return map;
  }, []);

  const handleScrollToCeremonies = () => {
    const targetElement = document.getElementById("upcoming-ceremonies");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="puja-by-occasion"
      aria-label="Upcoming Pujas by Occasion"
      className="mt-12 mb-10 sm:mt-16 sm:mb-14 border-t border-[#ebdcc4] pt-10 sm:pt-14"
    >
      {/* ── Section Header ── */}
      <div className="mb-6 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
          <Calendar size={12} className="text-[#c77722]" />
          <span>SACRED OCCASIONS</span>
        </div>
        <h2 className="font-serif text-[24px] font-bold text-[#2b241d] sm:text-[28px]">
          Upcoming Pujas by Occasion
        </h2>
        <p className="max-w-[720px] text-[13.5px] leading-relaxed text-[#6b5d4e]">
          Explore upcoming ceremonies through sacred festivals, tithis and special Kashi occasions.
        </p>
      </div>

      {/* ── Compact 10-Occasion Directory (Desktop: 5 cols × 2 rows, Tablet: 3 cols, Mobile: 2 cols) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
        {OCCASION_CONFIG.map((category) => {
          const matchingEvents = occasionEventsMap[category.occasionKey] || [];
          const count = matchingEvents.length;

          const isSingleEvent = count === 1;
          const isMultipleEvents = count > 1;
          const singleEvent = isSingleEvent ? matchingEvents[0] : null;

          const content = (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fbf5e8] p-1 transition-colors group-hover:bg-[#f5e8d0]">
                  <img
                    src={category.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-[22px] w-[22px] object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="font-serif text-[13.5px] font-bold text-[#2b241d] transition-colors group-hover:text-[#c77722] truncate">
                  {category.title}
                </span>
              </div>
              {count > 0 && (
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#eab12c]"
                  title={`${count} upcoming ${count === 1 ? "ceremony" : "ceremonies"}`}
                />
              )}
            </>
          );

          const baseClass =
            "group flex items-center justify-between rounded-[10px] border border-[#ebdcc4] bg-[#fffdfa] px-3 py-2.5 text-left transition-all duration-150 hover:border-[#c77722] hover:bg-[#fff9ee] hover:shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]";

          if (isSingleEvent) {
            return (
              <Link
                key={category.id}
                to={`/puja/${singleEvent.slug}`}
                aria-label={`View ceremony details for ${singleEvent.name} (${category.title})`}
                className={baseClass}
              >
                {content}
              </Link>
            );
          }

          if (isMultipleEvents) {
            return (
              <button
                key={category.id}
                type="button"
                onClick={handleScrollToCeremonies}
                aria-label={`Explore ${count} upcoming ceremonies for ${category.title}`}
                className={baseClass}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={category.id}
              to="/yagya-puja/puja"
              aria-label={`Explore ${category.title} rituals in catalogue`}
              className={baseClass}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default PujaByOccasion;


