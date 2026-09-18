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

const PujaByOccasion = ({ pujas = null }) => {
  // Dynamically resolve upcoming events for each occasion from pujas or PUJA_LIST
  const occasionEventsMap = useMemo(() => {
    const now = Date.now();
    const map = {};
    const eventList = Array.isArray(pujas) ? pujas : PUJA_LIST;

    OCCASION_CONFIG.forEach((cat) => {
      const matchingEvents = eventList
        .filter(
          (p) =>
            p.occasion &&
            p.occasion.toLowerCase() === cat.occasionKey.toLowerCase() &&
            (!p.startDateTime || new Date(p.startDateTime).getTime() > now)
        )
        .sort((a, b) => {
          const timeA = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
          const timeB = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
          return timeA - timeB;
        });

      map[cat.occasionKey] = matchingEvents;
    });

    return map;
  }, [pujas]);

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
      className="mt-14 mb-12 sm:mt-18 sm:mb-16 border-t border-[#ebdcc4] pt-10 sm:pt-14"
    >
      {/* ── Section Header ── */}
      <div className="mb-8 sm:mb-10 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
          <Calendar size={12} className="text-[#c77722]" />
          <span>SACRED OCCASIONS</span>
        </div>
        <h2 className="mt-2 font-serif text-[28px] font-bold leading-tight text-[#2b241d] sm:text-[32px] lg:text-[34px]">
          Upcoming Pujas by Occasion
        </h2>
        <p className="mx-auto mt-2.5 max-w-[650px] text-[13.5px] sm:text-[14px] leading-relaxed text-[#6b5d4e]">
          Explore upcoming ceremonies through sacred festivals, tithis and special Kashi occasions.
        </p>
        <div className="mt-3.5 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-[1px] w-7 bg-[#ebdcc4]" />
          <span className="text-[10px] text-[#c77722]/75">✦</span>
          <span className="h-[1px] w-7 bg-[#ebdcc4]" />
        </div>
      </div>

      {/* ── 10 Occasions Directory (Desktop: 10 cols × 1 row, Tablet: 5 cols × 2 rows, Mobile: 2 cols × 5 rows) ── */}
      <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-5 sm:gap-y-8 lg:grid-cols-10 lg:gap-y-0">
        {OCCASION_CONFIG.map((category, idx) => {
          const matchingEvents = occasionEventsMap[category.occasionKey] || [];
          const count = matchingEvents.length;

          const isSingleEvent = count === 1;
          const isMultipleEvents = count > 1;
          const singleEvent = isSingleEvent ? matchingEvents[0] : null;

          const content = (
            <>
              {/* 1. Icon on TOP - Centered PNG artwork without heavy background */}
              <div className="mb-2 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center">
                <img
                  src={category.icon}
                  alt=""
                  aria-hidden="true"
                  className="h-7 w-7 sm:h-[30px] sm:w-[30px] object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
              </div>

              {/* 2. Occasion Title BELOW Icon - Consistent Height & Center Aligned */}
              <div className="h-[36px] sm:h-[38px] flex items-center justify-center w-full px-1">
                <h3 className="font-serif text-[12.5px] sm:text-[13px] lg:text-[13.5px] font-bold text-[#2b241d] leading-tight text-center transition-colors duration-200 group-hover:text-[#c77722]">
                  {category.title}
                </h3>
              </div>

              {/* 3. Small antique-gold horizontal accent line */}
              <div
                aria-hidden="true"
                className="mt-1.5 h-[1.5px] w-4 sm:w-5 bg-[#eab12c]/60 transition-all duration-200 group-hover:w-6 sm:group-hover:w-7 group-hover:bg-[#c77722] motion-reduce:transition-none"
              />

              {/* 4. Small dynamic upcoming event indicator dot - Centered */}
              <div className="mt-1.5 h-2.5 flex items-center justify-center">
                {count > 0 ? (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#eab12c]"
                    title={`${count} upcoming ${count === 1 ? "ceremony" : "ceremonies"}`}
                  />
                ) : (
                  <span className="h-1.5 w-1.5 opacity-0" aria-hidden="true" />
                )}
              </div>
            </>
          );

          // Responsive subtle vertical divider styling
          const borderClasses = `
            ${idx % 2 === 0 ? "border-r border-[#eadbc3]/50" : "border-r-0"}
            ${idx % 5 !== 4 ? "sm:border-r sm:border-[#eadbc3]/60" : "sm:border-r-0"}
            ${idx < 9 ? "lg:border-r lg:border-[#eadbc3]/60" : "lg:border-r-0"}
          `.trim();

          const itemClass = `group flex flex-col items-center justify-start text-center px-1.5 py-3 sm:px-2 sm:py-3.5 lg:px-1.5 lg:py-4 rounded-[10px] transition-all duration-200 hover:bg-[#fff9ee]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] cursor-pointer ${borderClasses}`;

          if (isSingleEvent) {
            return (
              <Link
                key={category.id}
                to={`/puja/${singleEvent.slug}`}
                aria-label={`View ceremony details for ${singleEvent.name} (${category.title})`}
                className={itemClass}
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
                className={itemClass}
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
              className={itemClass}
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
