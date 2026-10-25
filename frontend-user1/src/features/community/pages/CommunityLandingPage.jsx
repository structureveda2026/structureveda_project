import { useState, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  Award,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Edit3,
  Eye,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import CommunityHero from "../components/CommunityHero";
import CommunitySearchFilters from "../components/CommunitySearchFilters";
import CommunityDirectory from "../components/CommunityDirectory";
import CommunitySocialFeed from "../components/CommunitySocialFeed";
import { getCommunityProfiles, getUserCustomProfile } from "../data/communityMockData";

const CommunityLandingPage = () => {
  const directoryRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view derived directly from searchParams: "feed" or "directory"
  const activeView = searchParams.get("view") === "directory" ? "directory" : "feed";

  const handleViewChange = (newView) => {
    setSearchParams(newView === "directory" ? { view: "directory" } : {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter & Search State for Directory
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedExpertise, setSelectedExpertise] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  // Load all profiles (built-in mock + local user created)
  const allProfiles = useMemo(() => {
    return getCommunityProfiles();
  }, []);

  // Check if current user has a custom demo profile in localStorage
  const myCustomProfile = useMemo(() => {
    return getUserCustomProfile();
  }, []);

  // Filter and sort computation for Directory
  const filteredProfiles = useMemo(() => {
    return allProfiles
      .filter((profile) => {
        // Search query matching: name, headline, expertise, bio, location
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName =
            profile.displayName?.toLowerCase().includes(q) ||
            profile.fullName?.toLowerCase().includes(q);
          const matchesHeadline = profile.headline?.toLowerCase().includes(q);
          const matchesBio = profile.bio?.toLowerCase().includes(q);
          const matchesLocation = profile.location?.toLowerCase().includes(q);
          const matchesExpertise = (profile.expertise || []).some((e) =>
            e.toLowerCase().includes(q)
          );
          const matchesServices = (profile.services || []).some((s) =>
            s.name?.toLowerCase().includes(q)
          );

          if (
            !matchesName &&
            !matchesHeadline &&
            !matchesBio &&
            !matchesLocation &&
            !matchesExpertise &&
            !matchesServices
          ) {
            return false;
          }
        }

        // Role / Type Filter
        if (selectedType !== "all") {
          if (selectedType === "Both") {
            if (profile.professionalType !== "Both") return false;
          } else {
            if (
              profile.professionalType !== selectedType &&
              profile.professionalType !== "Both"
            ) {
              return false;
            }
          }
        }

        // Expertise Filter
        if (selectedExpertise !== "All") {
          const hasExpertise = (profile.expertise || []).includes(selectedExpertise);
          if (!hasExpertise) return false;
        }

        // Location Filter
        if (selectedLocation !== "All") {
          const locStr = `${profile.city || ""} ${profile.location || ""}`.toLowerCase();
          if (!locStr.includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "featured") {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          if (a.isVerified && !b.isVerified) return -1;
          if (!a.isVerified && b.isVerified) return 1;
          return b.yearsOfExperience - a.yearsOfExperience;
        }
        if (sortBy === "exp-desc") {
          return b.yearsOfExperience - a.yearsOfExperience;
        }
        if (sortBy === "exp-asc") {
          return a.yearsOfExperience - b.yearsOfExperience;
        }
        if (sortBy === "name-asc") {
          return a.displayName.localeCompare(b.displayName);
        }
        return 0;
      });
  }, [allProfiles, searchQuery, selectedType, selectedExpertise, selectedLocation, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedExpertise("All");
    setSelectedLocation("All");
    setSortBy("featured");
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedType !== "all" ||
    selectedExpertise !== "All" ||
    selectedLocation !== "All";

  const scrollToDirectory = () => {
    if (directoryRef.current) {
      directoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf7] text-[#2b241d]">
      {/* Top Experience Sub-navigation Switcher Bar */}
      <div className="bg-[#fffdfa] border-b border-[#ebdcc2] sticky top-0 z-20 shadow-2xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Main Experience View Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#fbf6ec] border border-[#ebdcc2]">
            <button
              type="button"
              onClick={() => handleViewChange("feed")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeView === "feed"
                  ? "bg-[#9b4e10] text-white shadow-2xs"
                  : "text-[#6b5542] hover:text-[#2b241d] hover:bg-white/60"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Community Feed</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange("directory")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeView === "directory"
                  ? "bg-[#9b4e10] text-white shadow-2xs"
                  : "text-[#6b5542] hover:text-[#2b241d] hover:bg-white/60"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Expert Directory</span>
              <span
                className={`hidden sm:inline-block text-[10px] px-2 py-0.2 rounded-full font-bold ${
                  activeView === "directory"
                    ? "bg-white/20 text-white"
                    : "bg-[#faeed8] text-[#8a4e17]"
                }`}
              >
                {allProfiles.length}
              </span>
            </button>
          </div>

          {/* User Quick Actions */}
          <div className="flex items-center gap-2">
            {myCustomProfile ? (
              <div className="flex items-center gap-2">
                <Link
                  to={`/community/profile/${myCustomProfile.slug}`}
                  className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8a4e17] bg-[#faeed8] hover:bg-[#f7dfb0] border border-[#d6be9a] transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to={`/community/edit-profile?slug=${myCustomProfile.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#5c4736] bg-white hover:bg-[#faf4e8] border border-[#ebdcc2] transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#b35d14]" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/community/create-profile"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#faeed8] to-[#f8e5c2] hover:from-[#f5dfb8] hover:to-[#f0d49f] text-[#7a4010] text-xs font-bold border border-[#d6be9a] transition shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#b35d14]" />
                <span>Join Community</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Full-Width Immersive Vedic Hero Section */}
      <CommunityHero
        onExploreDirectory={() => {
          if (activeView === "directory") {
            scrollToDirectory();
          } else {
            handleViewChange("directory");
          }
        }}
      />

      {/* Conditional Rendering of Views Below Hero */}
      {activeView === "feed" ? (
        /* Dedicated Vedic Social Feed Experience */
        <CommunitySocialFeed
          onSwitchToDirectory={() => handleViewChange("directory")}
        />
      ) : (
        /* Preserved Expert Directory & Discovery Experience */
        <>
          <div ref={directoryRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* Section Title Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faeed8] border border-[#d6be9a] text-[11px] font-bold uppercase tracking-wider text-[#9e5410] mb-2 shadow-2xs">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Spiritual Experts Directory</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#2b241d] tracking-tight">
                  Explore Verified Pandits & Astrologers
                </h2>
                <p className="text-xs sm:text-sm text-[#665342] mt-1.5 max-w-xl leading-relaxed">
                  Discover authentic practitioners across sacred pilgrimage centers. Filter by holy tradition, shastric discipline, and consultations.
                </p>
              </div>

              {myCustomProfile ? (
                <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                  <Link
                    to={`/community/edit-profile?slug=${myCustomProfile.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#faeed8] to-[#f8e5c2] hover:from-[#f5dfb8] hover:to-[#f0d49f] text-[#7a4010] text-xs sm:text-sm font-bold border border-[#d6be9a] transition shadow-2xs active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#b35d14]" />
                    <span>Edit My Profile ({myCustomProfile.displayName})</span>
                  </Link>
                  <Link
                    to={`/community/profile/${myCustomProfile.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#faf3e8] text-[#5c4736] text-xs sm:text-sm font-medium border border-[#ebdcc2] transition shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#a0520d]" />
                    <span>View</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/community/create-profile"
                  className="inline-flex items-center gap-2 self-start md:self-auto px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#faeed8] to-[#f8e5c2] hover:from-[#f5dfb8] hover:to-[#f0d49f] text-[#7a4010] text-xs sm:text-sm font-bold border border-[#d6be9a] transition shadow-2xs active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#b35d14]" />
                  <span>Are you a Pandit or Astrologer? Join Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Search & Filter Controls Toolbar */}
            <div className="mb-10">
              <CommunitySearchFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedExpertise={selectedExpertise}
                onExpertiseChange={setSelectedExpertise}
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalResults={filteredProfiles.length}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Directory Card Grid */}
            <CommunityDirectory
              profiles={filteredProfiles}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* "Why Vedic Scholars Choose Veda Structure" Information Section */}
          <section className="bg-gradient-to-b from-[#faf4e8] via-[#f7eedc] to-[#f3e5ce] border-t border-[#ebdcc2] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#9e5410] px-3.5 py-1.5 rounded-full bg-white/80 border border-[#d6be9a] shadow-2xs">
                  FOR SPIRITUAL PRACTITIONERS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#2b241d] mt-3.5">
                  Why Vedic Scholars Choose Veda Structure
                </h2>
                <p className="text-sm sm:text-base text-[#614e3e] mt-2.5 max-w-2xl mx-auto leading-relaxed">
                  Upholding the sanctity of Sanatana traditions while connecting authentic scholars with devotees seeking authentic vidhis worldwide.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-7 border border-[#ebdcc2] shadow-[0_4px_20px_rgba(43,36,29,0.05)] hover:border-[#b35d14]/50 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#faeed8] to-[#f5dfb8] border border-[#ebdcc2] flex items-center justify-center text-[#9e5410] mb-5 shadow-2xs">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2b241d] mb-2.5">
                    Preserve Shastric Integrity
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665342] leading-relaxed">
                    Showcase your genuine guru parampara, vedic sakha, and authentic ritual procedures without algorithmic commodification.
                  </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-7 border border-[#ebdcc2] shadow-[0_4px_20px_rgba(43,36,29,0.05)] hover:border-[#b35d14]/50 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#faeed8] to-[#f5dfb8] border border-[#ebdcc2] flex items-center justify-center text-[#9e5410] mb-5 shadow-2xs">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2b241d] mb-2.5">
                    Worldwide Devotee Reach
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665342] leading-relaxed">
                    Directly connect with seekers wanting authentic karmakand, Prashna astrology, and anushthans across India and the global diaspora.
                  </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-7 border border-[#ebdcc2] shadow-[0_4px_20px_rgba(43,36,29,0.05)] hover:border-[#b35d14]/50 transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#faeed8] to-[#f5dfb8] border border-[#ebdcc2] flex items-center justify-center text-[#9e5410] mb-5 shadow-2xs">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2b241d] mb-2.5">
                    Honored Verification Badge
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665342] leading-relaxed">
                    Gain trust with transparent lineage verification and traditional Sanskrit Vishwavidyalaya credentials honored by traditional scholars.
                  </p>
                </div>
              </div>

              <div className="mt-14 text-center">
                {myCustomProfile ? (
                  <div className="flex flex-wrap justify-center items-center gap-3">
                    <Link
                      to={`/community/edit-profile?slug=${myCustomProfile.slug}`}
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#9b4e10] via-[#b35d14] to-[#c76d1a] hover:from-[#853f09] hover:via-[#a0520d] hover:to-[#b35d14] text-white text-sm font-bold shadow-lg shadow-[#9b4e10]/25 transition transform active:scale-95"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit My Profile</span>
                    </Link>
                    <Link
                      to={`/community/profile/${myCustomProfile.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#fdfbf7] text-[#7a4010] text-sm font-bold border border-[#d6be9a] shadow-xs transition"
                    >
                      <Eye className="w-4 h-4 text-[#a0520d]" />
                      <span>View My Profile</span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/community/create-profile"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#9b4e10] via-[#b35d14] to-[#c76d1a] hover:from-[#853f09] hover:via-[#a0520d] hover:to-[#b35d14] text-white text-sm font-bold shadow-lg shadow-[#9b4e10]/25 transition transform active:scale-95"
                  >
                    <span>Build Your Spiritual Profile Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default CommunityLandingPage;
