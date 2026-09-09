import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { PUJA_LIST } from "../data/pujaData";

// Authentic project photography assets
import mahashivratriImg from "../../../assets/images/puja-kashi.jpg";
import sawanImg from "../../../assets/images/puja-rudrabhishek.jpg";
import navratriImg from "../../../assets/images/puja-ganesh.jpg";
import guruPurnimaImg from "../../../assets/images/puja/puja-pandit.webp.png";
import devDeepawaliImg from "../../../assets/images/puja-ganga.jpg";
import akshayaTritiyaImg from "../../../assets/images/puja/puja-prasad.webp.png";
import pitruPakshaImg from "../../../assets/images/puja/puja-kashi.webp.png";
import dhanterasImg from "../../../assets/images/puja-lakshmi.jpg";
import diwaliImg from "../../../assets/images/puja/puja-devotional-altar.webp.png";

/**
 * Presentation configuration for the 9 manager-required special event themes.
 * Resolves upcoming ceremonies dynamically from PUJA_LIST.
 */
const SPECIAL_EVENTS_CONFIG = [
  {
    id: "mahashivratri",
    title: "Mahashivratri",
    image: mahashivratriImg,
  },
  {
    id: "sawan",
    title: "Sawan",
    image: sawanImg,
  },
  {
    id: "navratri",
    title: "Navratri",
    image: navratriImg,
  },
  {
    id: "guru-purnima",
    title: "Guru Purnima",
    image: guruPurnimaImg,
  },
  {
    id: "dev-deepawali",
    title: "Dev Deepawali",
    image: devDeepawaliImg,
  },
  {
    id: "akshaya-tritiya",
    title: "Akshaya Tritiya",
    image: akshayaTritiyaImg,
  },
  {
    id: "pitru-paksha",
    title: "Pitru Paksha",
    image: pitruPakshaImg,
  },
  {
    id: "dhanteras",
    title: "Dhanteras",
    image: dhanterasImg,
  },
  {
    id: "diwali",
    title: "Diwali",
    image: diwaliImg,
  },
];

const UpcomingSpecialEvents = () => {
  // Dynamically resolve matching upcoming events from PUJA_LIST for each theme
  const resolvedEvents = useMemo(() => {
    const now = Date.now();

    return SPECIAL_EVENTS_CONFIG.map((theme) => {
      const matchingEvents = PUJA_LIST.filter((p) => {
        // Consider only upcoming events
        const isUpcoming = !p.startDateTime || new Date(p.startDateTime).getTime() > now;
        if (!isUpcoming) return false;

        // Dynamic matching against occasion, name, or slug
        const occasionMatch =
          p.occasion && p.occasion.toLowerCase() === theme.title.toLowerCase();
        const nameMatch =
          p.name && p.name.toLowerCase().includes(theme.title.toLowerCase());
        const slugMatch =
          p.slug && p.slug.toLowerCase().includes(theme.id.toLowerCase());

        return occasionMatch || nameMatch || slugMatch;
      }).sort((a, b) => {
        const timeA = a.startDateTime ? new Date(a.startDateTime).getTime() : 0;
        const timeB = b.startDateTime ? new Date(b.startDateTime).getTime() : 0;
        return timeA - timeB;
      });

      const hasMatch = matchingEvents.length > 0;
      const targetRoute = hasMatch
        ? `/puja/${matchingEvents[0].slug}`
        : "/yagya-puja/puja";

      return {
        ...theme,
        hasMatch,
        targetRoute,
        matchingEvent: hasMatch ? matchingEvents[0] : null,
      };
    });
  }, []);

  return (
    <section
      id="upcoming-special-events"
      aria-label="Upcoming Special Events and Vedic Festivals"
      className="mt-14 mb-10 sm:mt-18 sm:mb-14"
    >
      {/* ── Section Header ── */}
      <div className="mb-8 space-y-2 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
          <Sparkles size={12} className="text-[#c77722]" />
          <span>FESTIVAL &amp; SPECIAL EVENTS</span>
        </div>
        <h2 className="font-serif text-[26px] font-bold leading-tight text-[#2b241d] sm:text-[32px]">
          Upcoming Special Events
        </h2>
        <p className="max-w-[720px] text-[14px] leading-relaxed text-[#6b5d4e] sm:text-[14.5px]">
          Explore major annual Vedic festivals and special occasions in Kashi.
        </p>
      </div>

      {/* ── 9 Compact Event Cards Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4.5">
        {resolvedEvents.map((event) => (
          <Link
            key={event.id}
            to={event.targetRoute}
            aria-label={`Explore ${event.title} special Puja`}
            className="group flex flex-col overflow-hidden rounded-[16px] border border-[#ebdcc4] bg-[#fffdfa] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c77722] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
          >
            {/* Image Area */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#241a12]">
              <img
                src={event.image}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-center transition-transform duration-300 motion-reduce:transform-none group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5">
              <h3 className="font-serif text-[14px] sm:text-[15px] font-bold leading-snug text-[#2b241d] transition-colors duration-200 group-hover:text-[#c77722] line-clamp-1">
                {event.title}
              </h3>

              <div className="mt-2.5 flex items-center gap-1 text-[11.5px] sm:text-[12px] font-semibold text-[#b36c1e] transition-colors duration-200 group-hover:text-[#945210]">
                <span>Explore special Puja</span>
                <ArrowRight
                  size={12}
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none shrink-0"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default UpcomingSpecialEvents;
