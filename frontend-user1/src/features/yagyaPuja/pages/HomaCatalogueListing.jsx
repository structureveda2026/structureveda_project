import { useEffect } from 'react';

// Section Components (8 approved sections in sequence)
import HomaListingHero from '../components/HomaListingHero'; // 1. Hero
import HomaConceptSection from '../components/HomaConceptSection'; // 2. Concept of Agni & Homa
import HomaCategoryDiscovery from '../components/HomaCategoryDiscovery'; // 3. Category Discovery (max 6)
import HomaCountSection from '../components/HomaCountSection'; // 4. Havan Count Guide
import HomaSamagriSection from '../components/HomaSamagriSection'; // 5. Samagri & Inclusions
import HomaWorkflowSection from '../components/HomaWorkflowSection'; // 6. How Booking Works
import HomaFaqSection from '../components/HomaFaqSection'; // 7. FAQ
import HomaFinalCta from '../components/HomaFinalCta'; // 8. Final CTA

/**
 * HOMA CATALOGUE LANDING PAGE (/yagya-puja/homa)
 * Strict Category-First discovery architecture matching Puja & Yagya.
 * Displays 8 focused sections:
 * 1. Hero with primary CTA to explore categories
 * 2. Concept of Agni & Homa
 * 3. Category Discovery (max 6 active categories linking to /category/:categorySlug)
 * 4. Havan Count Guide (1, 3, 5, 7, 11 benchmarks)
 * 5. Samagri & Inclusions Guide
 * 6. Ceremony Workflow
 * 7. Frequently Asked Questions
 * 8. Final CTA banner
 */
export default function HomaCatalogueListing() {
  useEffect(() => {
    document.title = "Vedic Homa & Havan in Kashi • Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleScrollToCategories = () => {
    const el = document.getElementById('homa-categories-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FFFDF9] text-[#29231B] min-h-screen">
      {/* 1. HOMA HERO */}
      <HomaListingHero onExploreClick={handleScrollToCategories} />

      {/* 2. SACRED AGNI & HOMA CONCEPT */}
      <HomaConceptSection />

      {/* 3. CATEGORY DISCOVERY (PRIMARY LAYER - MAX 6 CARDS) */}
      <HomaCategoryDiscovery limit={6} showViewAll={true} />

      {/* 4. HAVAN COUNT GUIDE */}
      <HomaCountSection />

      {/* 5. SAMAGRI & INCLUSIONS */}
      <HomaSamagriSection />

      {/* 6. HOW BOOKING WORKS */}
      <HomaWorkflowSection />

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <HomaFaqSection />

      {/* 8. FINAL CTA */}
      <HomaFinalCta onExploreCategories={handleScrollToCategories} />
    </div>
  );
}
