import { useEffect } from "react";
import PujaServiceListingHero from "../components/PujaServiceListingHero";
import PujaSankalpaProcess from "../components/PujaSankalpaProcess";
import PujaCategoryDiscovery from "../components/PujaCategoryDiscovery";
import PujaDurationSection from "../components/PujaDurationSection";
import PujaInclusionsSection from "../components/PujaInclusionsSection";
import PujaWorkflowSection from "../components/PujaWorkflowSection";
import PujaArrangementModes from "../components/PujaArrangementModes";
import PujaKashiSection from "../components/PujaKashiSection";
import PujaWhyVedaStructure from "../components/PujaWhyVedaStructure";
import PujaBeforeYouBook from "../components/PujaBeforeYouBook";
import PujaFaqSection from "../components/PujaFaqSection";
import PujaFinalCta from "../components/PujaFinalCta";

/**
 * PUJA CATEGORY LANDING PAGE (/yagya-puja/puja)
 * Category-first discovery architecture.
 * Displays a preview of maximum 6 active Puja Categories via PujaCategoryDiscovery.
 * Preview is strictly limited to 6 cards [slice(0, 6)].
 * Clicking a category navigates to /yagya-puja/puja/category/:categorySlug.
 * Clicking "View All Puja" navigates to /yagya-puja/puja/all.
 * Individual Puja services are NOT displayed on this page.
 */
const PujaCatalogueListing = () => {
  useEffect(() => {
    document.title = "Vedic Puja Categories in Kashi • Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* 1. HERO SECTION */}
      <PujaServiceListingHero />

      {/* 2. EVERY PUJA BEGINS WITH A SANKALPA */}
      <PujaSankalpaProcess />

      {/* 3. PUJA CATEGORIES SHOWCASE (PRIMARY DISCOVERY LAYER - MAX 6 CARDS, NO PAGINATION) */}
      <PujaCategoryDiscovery limit={6} showViewAll={true} />

      {/* 4. PUJA DURATION */}
      <PujaDurationSection />

      {/* 5. WHAT IS INCLUDED? */}
      <PujaInclusionsSection />

      {/* 6. HOW PUJA BOOKING WORKS */}
      <PujaWorkflowSection />

      {/* 7. PERSONAL / FAMILY / REMOTE */}
      <PujaArrangementModes />

      {/* 8. PUJA IN KASHI */}
      <PujaKashiSection />

      {/* 9. WHY VEDA STRUCTURE? */}
      <PujaWhyVedaStructure />

      {/* 10. BEFORE YOU BOOK */}
      <PujaBeforeYouBook />

      {/* 11. FAQ ACCORDION */}
      <PujaFaqSection />

      {/* 12. FINAL CTA BANNER */}
      <PujaFinalCta />
    </div>
  );
};

export default PujaCatalogueListing;

