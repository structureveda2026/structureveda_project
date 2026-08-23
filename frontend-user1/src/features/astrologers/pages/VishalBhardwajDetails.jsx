import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import marriageImage from "../../../assets/images/guidance-marriage.png";
import careerImage from "../../../assets/images/guidance-career.png";
import familyImage from "../../../assets/images/guidance-family.png";
import businessImage from "../../../assets/images/guidance-business.png";
import financeImage from "../../../assets/images/guidance-finance.png";
import remediesImage from "../../../assets/images/guidance-remedies.png";
import zodiacWheelImage from "../../../assets/images/wheel.png";
import vishalTransparentPortrait from "../../../assets/images/vishal_png.png";
import vishalImage from "../../../assets/images/vishal.png";
import vishalBlueImage from "../../../assets/images/vishal vhadrawaj.png";
import kashiHeritageImage from "../../../assets/images/prasadam-section.jpg";
import GuidanceSection from "../components/GuidanceSection";
import AstrologerHero from "../components/AstrologerHero";
import TrustBar from "../components/TrustBar";
import WhyChooseAstrologer from "../components/WhyChooseAstrologer";
import AstrologerPackages from "../components/AstrologerPackages";
import AstrologerJourney from "../components/AstrologerJourney";
import AboutAstrologer from "../components/AboutAstrologer";
import AstrologerHeritage from "../components/AstrologerHeritage";
import AstrologerReviews from "../components/AstrologerReviews";
import AstrologerBookingProcess from "../components/AstrologerBookingProcess";
import AstrologerFaq from "../components/AstrologerFaq";
import AstrologerFinalCta from "../components/AstrologerFinalCta";
import AstrologerFloatingBar from "../components/AstrologerFloatingBar";

const VishalBhardwajDetails = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    // 1. Scroll listener for floating consultation bar
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 2. IntersectionObserver for smooth scroll reveals
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px",
    });

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleBookConsultation = () => {
    navigate("/astrologers/vishal-bhardwaj/book-consultation");
  };

  return (
    <div className="min-h-screen bg-[#fffaf0]">      {/* ========================================
          VISHAL BHARDWAJ HERO SECTION (Reusable)
      ======================================== */}
      <AstrologerHero
        eyebrow="Vedic Astrology • Kashi / Varanasi"
        astrologerPrefix="Astrologer"
        astrologerName="Vishal Bhardwaj"
        quote="Understand Your Kundali. Find Clarity in Life."
        description="Personalized Vedic Astrology consultation rooted in ancient Kashi traditions. Gain actionable guidance on career, relationships, marriage timing, wealth yogas, and practical Vedic remedies."
        price="₹1,100"
        sessionText="30-Min Audio / Video Session"
        portrait={vishalTransparentPortrait}
        portraitAlt="Astrologer Vishal Bhardwaj"
        zodiacWheel={zodiacWheelImage}
        onBookConsultation={handleBookConsultation}
        onExploreGuidance={() => {
          const el = document.getElementById("guidance-section");
          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
            });
          } else {
            window.scrollBy({
              top: 600,
              behavior: "smooth",
            });
          }
        }}
      />
      {/* ========================================
          TRUST BAR (Infinite Marquee)
      ======================================== */}
      <TrustBar />

      {/* ========================================
          WHAT DO YOU NEED GUIDANCE ABOUT?
      ======================================== */}
      <GuidanceSection
        marriageImage={marriageImage}
        careerImage={careerImage}
        familyImage={familyImage}
        businessImage={businessImage}
        financeImage={financeImage}
        remediesImage={remediesImage}
      />

      {/* ========================================
          WHY VISHAL BHARDWAJ?
      ======================================== */}
      <WhyChooseAstrologer
        astrologerImage={vishalBlueImage}
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          CHOOSE YOUR EXPERT CONSULTATION
      ======================================== */}
      <AstrologerPackages
        mainAstrologerImage={vishalImage}
        secondaryAstrologerImage={vishalBlueImage}
        astrologerName="Vishal Bhardwaj"
        directAstrologerText="Direct 1-on-1 with Astrologer Vishal"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          WHAT YOU GET (CONSULTATION JOURNEY)
      ======================================== */}
      <AstrologerJourney
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          ABOUT VISHAL BHARDWAJ
      ======================================== */}
      <AboutAstrologer
        astrologerImage={vishalImage}
        astrologerName="Vishal Bhardwaj"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          KASHI / VARANASI SECTION (SPIRITUAL HERITAGE)
      ======================================== */}
      <AstrologerHeritage
        heritageImage={kashiHeritageImage}
        astrologerName="Vishal Bhardwaj"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          REVIEWS / CLIENT EXPERIENCES
      ======================================== */}
      <AstrologerReviews />

      {/* ========================================
          HOW BOOKING WORKS (4-STEP PROCESS)
      ======================================== */}
      <AstrologerBookingProcess
        astrologerName="Vishal Bhardwaj"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          FAQ SECTION (INTERACTIVE ACCORDION)
      ======================================== */}
      <AstrologerFaq
        astrologerName="Vishal Bhardwaj"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          FINAL CTA SECTION
      ======================================== */}
      <AstrologerFinalCta
        astrologerName="Vishal Bhardwaj"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          FLOATING STICKY CONSULTATION BAR
      ======================================== */}
      <AstrologerFloatingBar
        astrologerImage={vishalImage}
        astrologerName="Vishal Bhardwaj"
        rating="4.9 ★"
        price="₹1,100"
        showStickyBar={showStickyBar}
        onBookConsultation={handleBookConsultation}
      />
    </div>
  );
};

export default VishalBhardwajDetails;
