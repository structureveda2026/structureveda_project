import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Authentic local project photography assets
import vishwanathImg from "../../../assets/images/puja-rudrabhishek.jpg";
import gangaImg from "../../../assets/images/puja-ganga.jpg";
import manikarnikaImg from "../../../assets/images/puja-kashi.jpg";
import bhairavImg from "../../../assets/images/puja-mrityunjaya.jpg";
import aartiImg from "../../../assets/images/puja/puja-kashi.webp.png";
import kashiKhandImg from "../../../assets/images/puja/puja-ritual-setup.webp.png";

const KASHI_DESTINATIONS = [
  {
    id: "kashi-vishwanath",
    name: "Kashi Vishwanath",
    image: vishwanathImg,
    route: "/yagya-puja/kashi",
  },
  {
    id: "ganga",
    name: "Ganga",
    image: gangaImg,
    route: "/yagya-puja/kashi",
  },
  {
    id: "manikarnika",
    name: "Manikarnika",
    image: manikarnikaImg,
    route: "/yagya-puja/kashi",
  },
  {
    id: "kaal-bhairav",
    name: "Kaal Bhairav",
    image: bhairavImg,
    route: "/yagya-puja/kashi",
  },
  {
    id: "ganga-aarti",
    name: "Ganga Aarti",
    image: aartiImg,
    route: "/yagya-puja/kashi",
  },
  {
    id: "kashi-khand-rituals",
    name: "Kashi Khand Rituals",
    image: kashiKhandImg,
    route: "/yagya-puja/kashi",
  },
];

/**
 * Compact, image-led Kashi discovery banner for the Upcoming Puja page.
 * Features the client-required heading, quote, CTA, and 6 circular visual destination items.
 */
const UpcomingPujaKashiSpecial = () => {
  return (
    <section
      id="upcoming-puja-kashi-special"
      aria-label="Kashi Special Ritual Traditions"
      className="mt-12 mb-10 sm:mt-16 sm:mb-14"
    >
      <div className="rounded-[20px] sm:rounded-[24px] border border-[#ebdcc4] bg-[#fbf5e8] p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          
          {/* ── Left Column: Editorial Text & Primary CTA (5 cols on desktop) ── */}
          <div className="lg:col-span-5 space-y-3">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
              <Sparkles size={12} className="text-[#c77722]" />
              <span>KASHI SPECIAL</span>
            </div>

            {/* Required Heading */}
            <h2 className="font-serif text-[26px] font-bold leading-tight text-[#2b241d] sm:text-[30px] lg:text-[32px]">
              Experience the Sacred Rituals of Kashi
            </h2>

            {/* Required Supporting Statement */}
            <p className="font-serif text-[15px] italic leading-relaxed text-[#8d5b24] sm:text-[16px]">
              &ldquo;Kashi is not simply a location. It is a living spiritual tradition.&rdquo;
            </p>

            {/* Main Action CTA */}
            <div className="pt-2">
              <Link
                to="/yagya-puja/kashi"
                aria-label="Explore Puja in Kashi and sacred ritual services"
                className="group inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#eab12c] px-5 py-2.5 text-[13px] font-bold text-[#1c1308] shadow-2xs transition-all duration-200 hover:bg-[#dda018] hover:shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
              >
                <span>Explore Puja in Kashi</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* ── Right Column: 6 Visual Destination Items (7 cols on desktop) ── */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-y-5 gap-x-3 sm:gap-y-6 sm:gap-x-6 justify-items-center">
              {KASHI_DESTINATIONS.map((item) => (
                <Link
                  key={item.id}
                  to={item.route}
                  aria-label={`Explore ${item.name} rituals in Kashi`}
                  className="group flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c] rounded-xl p-1 transition-all"
                >
                  {/* Circular Image Thumbnail */}
                  <div className="relative h-20 w-20 sm:h-22 sm:w-22 overflow-hidden rounded-full border-2 border-[#ebdcc4] bg-[#241a12] shadow-xs transition-all duration-300 group-hover:border-[#c77722] group-hover:shadow-sm">
                    <img
                      src={item.image}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Label */}
                  <span className="mt-2 font-serif text-[12.5px] sm:text-[13px] font-bold leading-tight text-[#2b241d] transition-colors duration-200 group-hover:text-[#c77722] max-w-[96px] sm:max-w-[108px] line-clamp-2">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UpcomingPujaKashiSpecial;

