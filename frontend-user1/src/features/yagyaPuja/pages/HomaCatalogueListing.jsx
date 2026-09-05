import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Flame, Sparkles } from 'lucide-react';

// Data
import {
  HOMA_SERVICES,
  HOMA_PURPOSE_CATEGORIES,
} from '../data/homaCatalogueData';

// Section Components (in 18-section sequence)
import HomaListingHero from '../components/HomaListingHero'; // 1. Hero
import HomaConceptSection from '../components/HomaConceptSection'; // 2. What is Homa / Havan?
import HomaPurposeSection from '../components/HomaPurposeSection'; // 3. Homa by Purpose
import HomaServiceCard from '../components/HomaServiceCard'; // 4. Explore Cards
import HomaConfiguratorDemo from '../components/HomaConfiguratorDemo'; // 5. Configure Your Homa
import HomaCountSection from '../components/HomaCountSection'; // 6. Number of Havan
import HomaProcessTimeline from '../components/HomaProcessTimeline'; // 7. How Homa is Performed
import HomaPanditTeamSection from '../components/HomaPanditTeamSection'; // 8. Pandit Requirement
import HomaSamagriSection from '../components/HomaSamagriSection'; // 9. Homa Samagri
import HomaConfigurationPreview from '../components/HomaConfigurationPreview'; // 10. Your Homa Plan
import HomaKashiSection from '../components/HomaKashiSection'; // 11. Homa in Kashi
import HomaArrangementModes from '../components/HomaArrangementModes'; // 12. Homa for Individual & Family
import HomaWhyVedaStructure from '../components/HomaWhyVedaStructure'; // 13. Why Veda Structure?
import HomaPopularSection from '../components/HomaPopularSection'; // 14. Popular Homa
import HomaCustomSection from '../components/HomaCustomSection'; // 15. Custom Homa
import HomaWorkflowSection from '../components/HomaWorkflowSection'; // 16. How Booking Works
import HomaFaqSection from '../components/HomaFaqSection'; // 17. FAQ
import HomaFinalCta from '../components/HomaFinalCta'; // 18. Final CTA

export default function HomaCatalogueListing() {
  const navigate = useNavigate();

  // State for Section 4 (Explore & Filter)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHavanCountFilter, setSelectedHavanCountFilter] = useState('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Currently selected Homa for the Section 5 Demonstrator
  const [demonstratorHoma, setDemonstratorHoma] = useState(HOMA_SERVICES[0]);

  // Handler when user selects a category from Section 3
  const handleSelectPurposeCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler when user clicks "Configure" from any card
  const handleConfigureHoma = (homa) => {
    setDemonstratorHoma(homa);
    const demoSection = document.getElementById('demonstrator');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered Homa Services for Section 4 Explore
  const filteredServices = useMemo(() => {
    return HOMA_SERVICES.filter((homa) => {
      // Search
      const matchesSearch =
        searchQuery.trim() === '' ||
        homa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homa.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homa.purpose.toLowerCase().includes(searchQuery.toLowerCase());

      // Purpose Category
      const matchesCategory =
        selectedCategory === 'all' ||
        homa.purposeCategory === selectedCategory ||
        (homa.purposeCategories && homa.purposeCategories.includes(selectedCategory));

      // Havan count filter
      const matchesHavan =
        selectedHavanCountFilter === 'all' ||
        homa.availableHavanCounts.includes(Number(selectedHavanCountFilter)) ||
        (selectedHavanCountFilter === 'custom' && homa.availableHavanCounts.includes('Custom'));

      // Location filter
      const matchesLocation =
        selectedLocationFilter === 'all' ||
        (selectedLocationFilter === 'kashi' && homa.kashiAvailable) ||
        (selectedLocationFilter === 'remote' && homa.remoteAvailable);

      return matchesSearch && matchesCategory && matchesHavan && matchesLocation;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.startingPrice - b.startingPrice;
      }
      if (sortBy === 'price-high') {
        return b.startingPrice - a.startingPrice;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0; // default order
    });
  }, [searchQuery, selectedCategory, selectedHavanCountFilter, selectedLocationFilter, sortBy]);

  const handleOpenCustomModal = () => {
    const customSection = document.getElementById('custom-homa');
    if (customSection) {
      customSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#fffdf9] text-[#2a221b] min-h-screen">
      {/* 1. HERO */}
      <HomaListingHero />

      {/* 2. WHAT IS HOMA / HAVAN? */}
      <HomaConceptSection />

      {/* 3. HOMA BY PURPOSE */}
      <HomaPurposeSection onSelectCategory={handleSelectPurposeCategory} />

      {/* 4. EXPLORE HOMA & HAVAN */}
      <section className="py-20 bg-[#fffdf9] border-b border-[#e8dfd1]" id="explore">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#b36c1e] font-semibold">
              TRADITIONAL FIRE RITUALS CATALOGUE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#2a221b] mt-2 mb-4">
              Explore Vedic Homa & Havan
            </h2>
            <p className="text-sm sm:text-base text-[#685847] leading-relaxed">
              Choose a traditional Homa and configure it according to the available options.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-[#faf6ee] p-5 rounded-2xl border border-[#ebdcc4] mb-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search input */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-[#8c7863] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Homa by name, purpose, deity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#ebdcc4] text-xs sm:text-sm text-[#2a221b] placeholder-[#998775] focus:outline-none focus:border-[#b36c1e]"
                />
              </div>

              {/* Purpose Category Select */}
              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#ebdcc4] text-xs sm:text-sm text-[#2a221b] focus:outline-none focus:border-[#b36c1e]"
                >
                  <option value="all">All Purpose Categories</option>
                  {HOMA_PURPOSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Havan Count Filter */}
              <div className="md:col-span-2">
                <select
                  value={selectedHavanCountFilter}
                  onChange={(e) => setSelectedHavanCountFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#ebdcc4] text-xs sm:text-sm text-[#2a221b] focus:outline-none focus:border-[#b36c1e]"
                >
                  <option value="all">Any Havan Count</option>
                  <option value="1">1 Havan</option>
                  <option value="3">3 Havan</option>
                  <option value="5">5 Havan</option>
                  <option value="7">7 Havan</option>
                  <option value="11">11 Havan</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="md:col-span-2">
                <select
                  value={selectedLocationFilter}
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white rounded-xl border border-[#ebdcc4] text-xs sm:text-sm text-[#2a221b] focus:outline-none focus:border-[#b36c1e]"
                >
                  <option value="all">All Locations</option>
                  <option value="kashi">Kashi Eligible</option>
                  <option value="remote">Remote Eligible</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="md:col-span-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-2.5 bg-white rounded-xl border border-[#ebdcc4] text-xs text-[#2a221b] focus:outline-none focus:border-[#b36c1e]"
                >
                  <option value="default">Sort</option>
                  <option value="price-low">₹ Low</option>
                  <option value="price-high">₹ High</option>
                  <option value="name">A–Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters count summary */}
            <div className="flex items-center justify-between text-xs text-[#7d6854] mt-3 pt-3 border-t border-[#ebdcc4]">
              <span>
                Showing <strong className="text-[#2a221b]">{filteredServices.length}</strong> Homa services
              </span>
              {(selectedCategory !== 'all' || searchQuery !== '' || selectedHavanCountFilter !== 'all' || selectedLocationFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedHavanCountFilter('all');
                    setSelectedLocationFilter('all');
                    setSortBy('default');
                  }}
                  className="text-[#b36c1e] hover:underline font-medium"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredServices.length === 0 ? (
            <div className="bg-[#faf6ee] rounded-2xl border border-[#ebdcc4] p-12 text-center max-w-md mx-auto">
              <Flame className="w-10 h-10 text-[#b36c1e] mx-auto mb-3" />
              <h3 className="font-serif text-lg text-[#2a221b] mb-1">
                No matching Homa found
              </h3>
              <p className="text-xs text-[#685847] mb-4">
                Try adjusting your search query or purpose category filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedHavanCountFilter('all');
                  setSelectedLocationFilter('all');
                }}
                className="px-4 py-2 bg-[#b36c1e] text-white text-xs font-semibold rounded-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((homa) => (
                <HomaServiceCard
                  key={homa.id}
                  homa={homa}
                  onConfigure={handleConfigureHoma}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. CONFIGURE YOUR HOMA (Demonstrator) */}
      <HomaConfiguratorDemo
        selectedHoma={demonstratorHoma}
        onSelectHoma={setDemonstratorHoma}
      />

      {/* 6. NUMBER OF HAVAN */}
      <HomaCountSection
        selectedHoma={demonstratorHoma}
        onSelectHoma={setDemonstratorHoma}
      />

      {/* 7. HOW HOMA IS PERFORMED */}
      <HomaProcessTimeline />

      {/* 8. PANDIT REQUIREMENT */}
      <HomaPanditTeamSection selectedHoma={demonstratorHoma} />

      {/* 9. HOMA SAMAGRI */}
      <HomaSamagriSection selectedHoma={demonstratorHoma} />

      {/* 10. YOUR HOMA PLAN */}
      <HomaConfigurationPreview
        selectedHoma={demonstratorHoma}
        onProceedBooking={() => navigate(`/yagya-puja/homa/${demonstratorHoma.slug}`)}
      />

      {/* 11. HOMA IN KASHI */}
      <HomaKashiSection />

      {/* 12. HOMA FOR INDIVIDUAL & FAMILY */}
      <HomaArrangementModes />

      {/* 13. WHY VEDA STRUCTURE? */}
      <HomaWhyVedaStructure />

      {/* 14. POPULAR HOMA */}
      <HomaPopularSection onSelectHoma={handleConfigureHoma} />

      {/* 15. CUSTOM HOMA */}
      <HomaCustomSection />

      {/* 16. HOW BOOKING WORKS */}
      <HomaWorkflowSection />

      {/* 17. FAQ */}
      <HomaFaqSection />

      {/* 18. FINAL CTA */}
      <HomaFinalCta onRequestCustom={handleOpenCustomModal} />
    </div>
  );
}
