import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { JAPA_CATALOGUE_LIST } from "../data/japaCatalogueData";
import japaCatalogueService, {
  mapApiJapaServiceToUi,
} from "../../../services/japaCatalogueService";

// Consolidated Premium Vedic Sections (With Catalogue Removed & Planner Redesigned)
import JapaHero from "../components/japa/JapaHero";
import JapaCategorySection from "../components/japa/JapaCategorySection";
import JapaAnushthanPlanner from "../components/japa/JapaAnushthanPlanner";
import JapaParticipationSection from "../components/japa/JapaParticipationSection";
import JapaArrangementsSection from "../components/japa/JapaArrangementsSection";
import JapaJourneySection from "../components/japa/JapaJourneySection";
import JapaFAQAndCTA from "../components/japa/JapaFAQAndCTA";

const JapaCatalogueListing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Set SEO Title
  useEffect(() => {
    document.title = "Vedic Mantra Japa & Anushthan Services | Veda Structure";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const currentSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Dynamic API state
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load category pills dynamically on mount
  useEffect(() => {
    let isCancelled = false;
    japaCatalogueService
      .getJapaCategories()
      .then((data) => {
        if (!isCancelled && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load Japa categories:", err);
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  // Fetch all active Japa services for the Anushthan Planner
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    japaCatalogueService
      .getJapaServices({ limit: 50 })
      .then((response) => {
        if (!isCancelled) {
          if (response && response.success && Array.isArray(response.services)) {
            setServices(response.services);
          } else {
            throw new Error("Invalid API response format");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn("Japa services API failed, engaging fallback data:", err?.message || err);
          const activeServices = JAPA_CATALOGUE_LIST.filter((j) => j.active).map(mapApiJapaServiceToUi);
          setServices(activeServices);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const scrollToCategories = () => {
    const el = document.getElementById("japa-categories-showcase");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToPlanner = () => {
    const el = document.getElementById("anushthan-planner");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf6] text-[#30251c]">
      {/* 1. HERO (Full-Width Background Image Hero) */}
      <JapaHero
        searchQuery={searchInput}
        setSearchQuery={setSearchInput}
        onSearchSubmit={(val) => {
          setSearchInput(val);
          scrollToPlanner();
        }}
        onExploreClick={scrollToCategories}
        onExpertClick={() => navigate("/consultation")}
      />

      {/* 2. DEDICATED JAPA CATEGORY DISCOVERY (Preview with View All) */}
      <JapaCategorySection
        categories={categories}
        loading={loading && categories.length === 0}
        limit={6}
        showViewAll={true}
      />

      {/* 3. INTERACTIVE ANUSHTHAN & COUNT PLANNER (Image-Integrated 2-Column Experience) */}
      <JapaAnushthanPlanner
        services={
          services.length > 0
            ? services
            : JAPA_CATALOGUE_LIST.filter((j) => j.active).map(mapApiJapaServiceToUi)
        }
        initialSearch={searchInput}
      />

      {/* 4. SACRED VENUE & PARTICIPATION MODES */}
      <JapaParticipationSection />

      {/* 5. RITUAL ARRANGEMENTS & INCLUDED ITEMS */}
      <JapaArrangementsSection />

      {/* 6. THE FOUR-STEP VEDIC JOURNEY */}
      <JapaJourneySection />

      {/* 7. FAQs & FINAL BOOKING CTA */}
      <JapaFAQAndCTA
        onExploreClick={scrollToPlanner}
        onCustomClick={() => navigate("/consultation")}
      />
    </div>
  );
};

export default JapaCatalogueListing;
