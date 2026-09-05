import YagyaPujaHero from "../components/YagyaPujaHero";
import YagyaPujaIntro from "../components/YagyaPujaIntro";
import ServiceCategoryCards from "../components/ServiceCategoryCards";
import ExploreByPurpose from "../components/ExploreByPurpose";
import PopularRituals from "../components/PopularRituals";
import WhyVedaStructure from "../components/WhyVedaStructure";
import KashiSection from "../components/KashiSection";
import HowItWorksSection from "../components/HowItWorksSection";
import YagyaPujaFaq from "../components/YagyaPujaFaq";
import YagyaPujaFinalCta from "../components/YagyaPujaFinalCta";

const YagyaPujaLanding = () => {
  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* 1. Hero Section */}
      <YagyaPujaHero />

      {/* 2. Introduction */}
      <YagyaPujaIntro />

      {/* 3. Six Service Categories */}
      <ServiceCategoryCards />

      {/* 4. Explore by Purpose */}
      <ExploreByPurpose />

      {/* 5. Popular Rituals */}
      <PopularRituals />

      {/* 6. Why Veda Structure */}
      <WhyVedaStructure />

      {/* 7. Kashi Section */}
      <KashiSection />

      {/* 8. How It Works */}
      <HowItWorksSection />

      {/* 9. FAQ Section */}
      <YagyaPujaFaq />

      {/* 10. Final CTA */}
      <YagyaPujaFinalCta />
    </div>
  );
};

export default YagyaPujaLanding;
