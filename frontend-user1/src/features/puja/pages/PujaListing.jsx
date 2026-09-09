import { useState, useMemo } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { PUJA_LIST } from "../data/pujaData";
import PujaListingHero from "../components/PujaListingHero";
import NextUpcomingPujaSpotlight from "../components/NextUpcomingPujaSpotlight";
import UpcomingPujaDiscovery from "../components/UpcomingPujaDiscovery";
import UpcomingPujaCard from "../components/UpcomingPujaCard";
import FeaturedUpcomingPuja from "../components/FeaturedUpcomingPuja";
import UpcomingPujaCalendar from "../components/UpcomingPujaCalendar";
import PujaByPurpose from "../components/PujaByPurpose";
import PujaByOccasion from "../components/PujaByOccasion";
import WhyBookWithVedaStructure from "../components/WhyBookWithVedaStructure";
import UpcomingPujaHowItWorks from "../components/UpcomingPujaHowItWorks";
import UpcomingPujaKashiSpecial from "../components/UpcomingPujaKashiSpecial";
import UpcomingSpecialEvents from "../components/UpcomingSpecialEvents";
import UpcomingPujaFAQ from "../components/UpcomingPujaFAQ";
import UpcomingPujaFinalCta from "../components/UpcomingPujaFinalCta";

const PujaListing = () => {
  const [selectedPurpose, setSelectedPurpose] = useState("All");
  const [showAllCards, setShowAllCards] = useState(false);

  const handleResetFilters = () => {
    setSelectedPurpose("All");
    setShowAllCards(false);
  };

  // Filter and sort items chronologically strictly by startDateTime
  const filteredPujas = useMemo(() => {
    return PUJA_LIST.filter((puja) => {
      // Purpose In-Page Filter
      if (selectedPurpose !== "All") {
        const matchesPurpose =
          puja.purposeCategory === selectedPurpose ||
          (Array.isArray(puja.purposeCategories) && puja.purposeCategories.includes(selectedPurpose));
        if (!matchesPurpose) return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = a.startDateTime ? new Date(a.startDateTime).getTime() : new Date(a.date).getTime();
      const timeB = b.startDateTime ? new Date(b.startDateTime).getTime() : new Date(b.date).getTime();
      return timeA - timeB;
    });
  }, [selectedPurpose]);

  // Primary view: exactly 3 cards, or all cards when expanded
  const visiblePujas = showAllCards ? filteredPujas : filteredPujas.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24">
      {/* =========================================================
          SECTION 1: HERO (KASHI EDITORIAL SPLIT)
      ========================================================== */}
      <PujaListingHero />

      {/* =========================================================
          SECTION 2: NEXT UPCOMING PUJA SPOTLIGHT & DYNAMIC COUNTDOWN
      ========================================================== */}
      <NextUpcomingPujaSpotlight />

      {/* =========================================================
          MAIN CONTENT AREA: DISCOVERY & MAIN CEREMONY CARDS
      ========================================================== */}
      <div id="puja-list" className="mx-auto max-w-[1400px] px-4 pt-10 sm:px-6 lg:px-8 xl:px-10">
        
        {/* SECTION 3: FILTER / DISCOVERY BAR */}
        <UpcomingPujaDiscovery
          selectedPurpose={selectedPurpose}
          onSelectPurpose={(pur) => {
            setSelectedPurpose(pur);
            setShowAllCards(false);
          }}
          onResetFilters={handleResetFilters}
          totalResults={filteredPujas.length}
        />

        {/* SECTION 4: UPCOMING SACRED CEREMONIES (HEADING & 3-CARD MAIN GRID) */}
        <div id="upcoming-ceremonies" className="mt-8 mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#b36c1e]">
            <Sparkles size={12} className="text-[#c77722]" />
            <span>Vedic Ritual Schedule</span>
          </div>
          <h2 className="font-serif text-[28px] font-bold text-[#2b241d] sm:text-[34px]">
            Upcoming Sacred Ceremonies
          </h2>
          <p className="max-w-[720px] text-[14.5px] leading-relaxed text-[#6b5d4e]">
            Participate in carefully scheduled Vedic rituals conducted in Kashi and other sacred locations.
          </p>
        </div>

        {/* Ceremonies Grid (Desktop: exactly 3 cards per row, Tablet: 2, Mobile: 1) */}
        {filteredPujas.length > 0 ? (
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
              {visiblePujas.map((puja) => (
                <UpcomingPujaCard key={puja.id} puja={puja} />
              ))}
            </div>

            {/* View All / Show Less Toggle (when results exceed 3) */}
            {filteredPujas.length > 3 && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllCards((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#ebdcc4] bg-[#fffdfa] px-8 py-3.5 text-[13.5px] font-bold text-[#2b241d] shadow-2xs transition-all duration-200 hover:border-[#c77722] hover:bg-[#fffaf0] hover:text-[#c77722] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#eab12c]"
                >
                  <span>
                    {showAllCards
                      ? "Show Less (First 3 Only)"
                      : `View All (${filteredPujas.length}) Upcoming Ceremonies`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${showAllCards ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Graceful Empty State */
          <div className="rounded-[28px] border border-[#ebdcc4] bg-[#fffdfa] p-12 text-center shadow-xs">
            <h3 className="font-serif text-[22px] font-bold text-[#2b241d]">
              No upcoming ceremonies found for this selection
            </h3>
            <p className="mt-2 text-[14px] text-[#75695c]">
              Try selecting &ldquo;All&rdquo; or adjusting your category and purpose filters to discover more Vedic rituals.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#eab12c] px-7 py-3 text-[13.5px] font-bold text-[#1c1308] shadow-[0_4px_14px_rgba(234,177,44,0.3)] transition-all hover:bg-[#dda018]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* =========================================================
            SECTION 6: FEATURED UPCOMING PUJA (FLAGSHIP SPOTLIGHT)
        ========================================================== */}
        <FeaturedUpcomingPuja />

        {/* =========================================================
            SECTION 7: UPCOMING PUJA CALENDAR (PHASE 5)
        ========================================================== */}
        <UpcomingPujaCalendar />

        {/* =========================================================
            SECTION 8: PUJA BY PURPOSE (PHASE 6)
        ========================================================== */}
        <PujaByPurpose
          selectedPurpose={selectedPurpose}
          onSelectPurpose={(purpose) => {
            setSelectedPurpose(purpose);
            setShowAllCards(false);
          }}
        />

        {/* =========================================================
            SECTION 9: PUJA BY OCCASION (PHASE 7)
        ========================================================== */}
        <PujaByOccasion />

        {/* =========================================================
            SECTION 10: WHY BOOK WITH VEDA STRUCTURE
        ========================================================== */}
        <WhyBookWithVedaStructure />

        {/* =========================================================
            SECTION 11: HOW IT WORKS
        ========================================================== */}
        <UpcomingPujaHowItWorks />

        {/* =========================================================
            SECTION 12: KASHI SPECIAL
        ========================================================== */}
        <UpcomingPujaKashiSpecial />

        {/* =========================================================
            SECTION 13: UPCOMING SPECIAL EVENTS (PHASE 8)
        ========================================================== */}
        <UpcomingSpecialEvents />

        {/* =========================================================
            SECTION 11: UPCOMING PUJA FAQ (PHASE 9)
        ========================================================== */}
        <UpcomingPujaFAQ />

        {/* =========================================================
            SECTION 12: UPCOMING PUJA FINAL CTA (PHASE 10)
        ========================================================== */}
        <UpcomingPujaFinalCta />

      </div>
    </div>
  );
};

export default PujaListing;
