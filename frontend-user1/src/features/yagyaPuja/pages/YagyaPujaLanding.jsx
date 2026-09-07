import { useEffect } from "react";

import UmbrellaTrustBar from "../components/umbrella/UmbrellaTrustBar";
import UmbrellaHero from "../components/umbrella/UmbrellaHero";
import UmbrellaTrustStrip from "../components/umbrella/UmbrellaTrustStrip";
import UmbrellaRitualCategories from "../components/umbrella/UmbrellaRitualCategories";
import UmbrellaPopularServices from "../components/umbrella/UmbrellaPopularServices";
import UmbrellaPurposeDiscovery from "../components/umbrella/UmbrellaPurposeDiscovery";
import UmbrellaWhyVeda from "../components/umbrella/UmbrellaWhyVeda";
import UmbrellaBookingProcess from "../components/umbrella/UmbrellaBookingProcess";
import UmbrellaFeaturedKashiRitual from "../components/umbrella/UmbrellaFeaturedKashiRitual";
import UmbrellaKashiStory from "../components/umbrella/UmbrellaKashiStory";
import UmbrellaGallery from "../components/umbrella/UmbrellaGallery";
import UmbrellaFaq from "../components/umbrella/UmbrellaFaq";
import UmbrellaFinalCta from "../components/umbrella/UmbrellaFinalCta";

/**
 * MAIN YAGYA & PUJA UMBRELLA LANDING PAGE (/yagya-puja)
 * Primary discovery and conversion showcase for Veda Structure Vedic rituals.
 */
const YagyaPujaLanding = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Vedic Yagya & Puja in Kashi • Veda Structure";
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#2b241d]">
      {/* SECTION 1: TOP TRUST BAR */}
      <UmbrellaTrustBar />

      {/* SECTION 2: HERO */}
      <UmbrellaHero />

      {/* SECTION 3: TRUST STRIP */}
      <UmbrellaTrustStrip />

      {/* SECTION 4: CHOOSE THE RITUAL THAT MATCHES YOUR PURPOSE */}
      <UmbrellaRitualCategories />

      {/* SECTION 5: POPULAR PUJA + POPULAR YAGYA */}
      <UmbrellaPopularServices />

      {/* SECTION 6: PURPOSE-BASED DISCOVERY */}
      <UmbrellaPurposeDiscovery />

      {/* SECTION 7: WHY VEDA STRUCTURE */}
      <UmbrellaWhyVeda />

      {/* SECTION 8: FROM BOOKING TO SANKALP */}
      <UmbrellaBookingProcess />

      {/* SECTION 9: FEATURED KASHI RITUAL */}
      <UmbrellaFeaturedKashiRitual />

      {/* SECTION 10: PERFORMED IN THE SACRED LAND OF KASHI */}
      <UmbrellaKashiStory />

      {/* SECTION 11: RITUAL GALLERY */}
      <UmbrellaGallery />

      {/* SECTION 13: FAQ */}
      <UmbrellaFaq />

      {/* SECTION 14: FINAL CTA */}
      <UmbrellaFinalCta />
    </div>
  );
};

export default YagyaPujaLanding;
