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
import astrologerService from "../astrologerService";

const AcharyaAnuragBhardwajDetails = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [astrologerData, setAstrologerData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await astrologerService.getPublicAstrologerBySlug("acharya-anurag-bhardwaj");
        if (isMounted && res?.success && res.data) {
          setAstrologerData(res.data);
        }
      } catch (err) {
        console.warn("Could not fetch Anurag Bhardwaj backend profile:", err.message);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

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
    navigate("/astrologers/acharya-anurag-bhardwaj/book-consultation");
  };

  const startingPriceText = astrologerData?.startingPrice
    ? `₹${Number(astrologerData.startingPrice).toLocaleString("en-IN")}`
    : "₹1,100";

  const dynamicPackages = astrologerData?.packages?.length
    ? astrologerData.packages.map((pkg) => ({
        id: pkg.packageKey || pkg.id,
        badge: pkg.badge || (pkg.isPopular ? "Most Popular" : null),
        title: pkg.title,
        subtitle: pkg.subtitle || "",
        image: pkg.isPopular ? vishalImage : vishalBlueImage,
        isPopular: Boolean(pkg.isPopular),
        knownFor: Array.isArray(pkg.knownFor) && pkg.knownFor.length > 0
          ? pkg.knownFor
          : [
              "Personalized remedies for career, finance, marriage, and health",
              "Easy-to-follow solutions for daily life",
              "Clear and honest guidance without fear tactics",
            ],
        consultationDetails: Array.isArray(pkg.consultationDetails) && pkg.consultationDetails.length > 0
          ? pkg.consultationDetails
          : [
              `Duration: ${pkg.duration}`,
              "Immediate slot availability & priority booking",
              "Couple consultation available at checkout",
            ],
        normalPrice: `₹${Number(pkg.price).toLocaleString("en-IN")}`,
        urgentPrice: `₹${Number(pkg.originalPrice || (Number(pkg.price) + 400)).toLocaleString("en-IN")}`,
      }))
    : undefined;

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      {/* ========================================
          1. HERO SECTION (Reusable)
      ======================================== */}
      <AstrologerHero
        eyebrow="Vedic Astrology • Ancient Wisdom"
        astrologerPrefix="Acharya"
        astrologerName={astrologerData?.name || "Acharya Anurag Bhardwaj"}
        quote={astrologerData?.quote || "Traditional Vedic astrology guidance rooted in ancient wisdom."}
        description={astrologerData?.description || "Personalized Vedic Astrology consultation rooted in ancient Sanatan traditions. Gain actionable guidance on career, relationships, marriage timing, wealth yogas, and practical Vedic remedies."}
        price={startingPriceText}
        sessionText="30-Min Audio / Video Session"
        portrait={vishalTransparentPortrait}
        portraitAlt="Acharya Anurag Bhardwaj"
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
          2. TRUST BAR (Infinite Marquee)
      ======================================== */}
      <TrustBar />

      {/* ========================================
          3. WHAT DO YOU NEED GUIDANCE ABOUT?
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
          4. WHY CHOOSE ASTROLOGER
      ======================================== */}
      <WhyChooseAstrologer
        astrologerImage={vishalBlueImage}
        astrologerName={astrologerData?.name || "Acharya Anurag Bhardwaj"}
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          5. CHOOSE YOUR EXPERT CONSULTATION
      ======================================== */}
      <AstrologerPackages
        packages={dynamicPackages}
        mainAstrologerImage={vishalImage}
        secondaryAstrologerImage={vishalBlueImage}
        astrologerName={astrologerData?.name || "Acharya Anurag Bhardwaj"}
        directAstrologerText="Direct 1-on-1 with Acharya Anurag"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          6. WHAT YOU GET (CONSULTATION JOURNEY)
      ======================================== */}
      <AstrologerJourney
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          7. ABOUT ASTROLOGER & LINEAGE
      ======================================== */}
      <AboutAstrologer
        astrologerImage={vishalImage}
        astrologerName="Acharya Anurag Bhardwaj"
        consultationButtonText="Book Consultation With Acharya Anurag"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          8. SPIRITUAL HERITAGE
      ======================================== */}
      <AstrologerHeritage
        heritageImage={kashiHeritageImage}
        astrologerName="Acharya Anurag Bhardwaj"
        buttonText="Connect With Acharya Anurag"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          9. REVIEWS / CLIENT EXPERIENCES
      ======================================== */}
      <AstrologerReviews />

      {/* ========================================
          10. HOW BOOKING WORKS (4-STEP PROCESS)
      ======================================== */}
      <AstrologerBookingProcess
        astrologerName="Acharya Anurag Bhardwaj"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          11. FAQ SECTION (INTERACTIVE ACCORDION)
      ======================================== */}
      <AstrologerFaq
        astrologerName="Acharya Anurag Bhardwaj"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          12. FINAL CTA SECTION
      ======================================== */}
      <AstrologerFinalCta
        astrologerName="Acharya Anurag Bhardwaj"
        directConsultationText="Direct 1-on-1 with Acharya Anurag"
        onBookConsultation={handleBookConsultation}
      />

      {/* ========================================
          13. FLOATING STICKY CONSULTATION BAR
      ======================================== */}
      <AstrologerFloatingBar
        astrologerImage={vishalImage}
        astrologerName={astrologerData?.name || "Acharya Anurag Bhardwaj"}
        rating={astrologerData?.rating ? `${astrologerData.rating} ★` : "4.9 ★"}
        price={startingPriceText}
        showStickyBar={showStickyBar}
        onBookConsultation={handleBookConsultation}
      />
    </div>
  );
};

export default AcharyaAnuragBhardwajDetails;
