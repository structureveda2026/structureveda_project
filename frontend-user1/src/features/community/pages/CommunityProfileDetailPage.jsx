import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Globe,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Flame,
  Calendar,
  AlertCircle,
  Share2,
  Edit3,
  Check,
  UserCheck,
  UserPlus,
  MessageSquare,
  Users,
  ShieldCheck,
  Compass,
} from "lucide-react";
import {
  getCommunityProfileBySlug,
  getCommunityProfiles,
  getCommunityPostsByAuthor,
  isFollowingPractitioner,
  toggleFollowPractitioner,
  getPractitionerFollowerCount,
  toggleLikePost,
  toggleSavePost,
  addPostComment,
  deleteCommunityPost,
  getUserCustomProfile,
} from "../data/communityMockData";
import CommunityPostCard from "../components/CommunityPostCard";
import CommunityPostComposer from "../components/CommunityPostComposer";
import defaultCoverBg from "../../../assets/images/create-profile-hero-bg.jpg";

// Neutral dignified spiritual avatar placeholder
const DEFAULT_NEUTRAL_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='28' fill='%23faebd7'/%3E%3Ccircle cx='60' cy='46' r='20' fill='%23a94f0a' fill-opacity='0.85'/%3E%3Cpath d='M28 98c0-16 14-28 32-28s32 12 32 28v4H28v-4z' fill='%23a94f0a' fill-opacity='0.85'/%3E%3Ccircle cx='60' cy='46' r='5' fill='%23d9a441'/%3E%3C/svg%3E";

const CommunityProfileDetailPage = () => {
  const { slug } = useParams();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState("about"); // "about" | "posts" | "services"
  const [followVersion, setFollowVersion] = useState(0);
  const [postsVersion, setPostsVersion] = useState(0);

  // Load profile by slug from mock data or local store
  const profile = useMemo(() => {
    return getCommunityProfileBySlug(slug);
  }, [slug]);

  // Current user's custom profile
  const myCustomProfile = useMemo(() => {
    return getUserCustomProfile();
  }, []);

  const isOwnProfile = Boolean(
    myCustomProfile && (myCustomProfile.slug === slug || myCustomProfile.id === slug)
  );

  // Follow state for this practitioner
  const isFollowing = useMemo(() => {
    return isFollowingPractitioner(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, followVersion]);

  const followerCount = useMemo(() => {
    return getPractitionerFollowerCount(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, followVersion]);

  // Load posts authored by this practitioner
  const authorPosts = useMemo(() => {
    return getCommunityPostsByAuthor(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, postsVersion]);

  // Suggested other practitioners (excluding current)
  const suggestedScholars = useMemo(() => {
    const all = getCommunityProfiles();
    return all.filter((p) => p.slug !== slug).slice(0, 3);
  }, [slug]);

  const handleFollowToggle = useCallback(() => {
    toggleFollowPractitioner(slug);
    setFollowVersion((v) => v + 1);
  }, [slug]);

  const handleLike = useCallback((postId) => {
    toggleLikePost(postId);
    setPostsVersion((v) => v + 1);
  }, []);

  const handleSave = useCallback((postId) => {
    toggleSavePost(postId);
    setPostsVersion((v) => v + 1);
  }, []);

  const handleCommentSubmit = useCallback((postId, content) => {
    const authorName = myCustomProfile?.displayName || "Spiritual Seeker";
    const authorRole = myCustomProfile?.professionalType || "Devotee / Scholar";
    const authorAvatar = myCustomProfile?.avatar || "";

    addPostComment(postId, {
      authorName,
      authorRole,
      authorAvatar,
      content,
    });
    setPostsVersion((v) => v + 1);
  }, [myCustomProfile]);

  const handleDeletePost = useCallback((postId) => {
    deleteCommunityPost(postId);
    setPostsVersion((v) => v + 1);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fffcf7] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-[#ebdcc2] p-8 sm:p-10 max-w-md w-full text-center shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center mx-auto text-[#a94f0a]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#382516]">
            Profile Not Found
          </h2>
          <p className="text-xs sm:text-sm text-[#7a6452] leading-relaxed">
            The requested practitioner profile does not exist or has been removed from this demonstration directory.
          </p>
          <div className="pt-2">
            <Link
              to="/community"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Return to Community Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    displayName,
    fullName,
    headline,
    professionalType,
    avatar,
    coverImage,
    location,
    city,
    state,
    yearsOfExperience,
    languages = [],
    isVerified,
    isFeatured,
    bio,
    expertise = [],
    specializations = [],
    education,
    lineage,
    services = [],
    websiteUrl,
    linkedInUrl,
    youtubeUrl,
    instagramUrl,
    status,
    isCustomUserCreated,
    availabilityMode,
    serviceLocations,
  } = profile;

  const specializationsList = Array.isArray(specializations)
    ? specializations
    : typeof specializations === "string" && specializations.trim()
    ? specializations.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const expertiseList = Array.isArray(expertise)
    ? expertise
    : typeof expertise === "string" && expertise.trim()
    ? expertise.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const languagesList = Array.isArray(languages)
    ? languages
    : typeof languages === "string" && languages.trim()
    ? languages.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Sanskrit", "Hindi"];

  const servicesList = Array.isArray(services)
    ? services.filter((s) => s && (s.name || s.type))
    : [];

  const formattedLocation = location || [city, state].filter(Boolean).join(", ") || "Varanasi, India";

  return (
    <div className="min-h-screen bg-[#fffcf7] text-[#382516] pb-16">
      {/* Top Breadcrumb Navigation & Action Bar */}
      <div className="bg-[#fffdfa] border-b border-[#ebdcc2] sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 flex items-center justify-between">
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#a94f0a] hover:text-[#8f4208] transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Community Directory</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isCustomUserCreated && (
              <Link
                to={`/community/edit-profile?slug=${profile.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fff5e5] hover:bg-[#faeed8] text-[#a94f0a] text-xs font-semibold border border-[#d6be9a] transition shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#ebdcc2] hover:bg-[#fff5e5] text-xs font-medium text-[#5c4736] transition shadow-2xs cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#7a6452]" />
                  <span className="hidden sm:inline">Share Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Demo Status Disclosure if User-Created */}
      {(status === "PENDING_REVIEW" || isCustomUserCreated) && (
        <div className="bg-[#fff8ed] border-b border-[#ebdcc2] px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-[#7a4010]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#a94f0a] shrink-0" />
              <span>
                <strong>Browser Session Demonstration:</strong> This profile is stored locally with a <em>Pending Review</em> status. Devotees and scholars can discover it across the directory.
              </span>
            </div>
            <Link
              to={`/community/edit-profile?slug=${profile.slug}`}
              className="font-bold underline shrink-0 hover:text-[#382516]"
            >
              Edit Details
            </Link>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-7">
        {/* Redesigned Hero Portfolio Card */}
        <div className="bg-white rounded-3xl border border-[#ebdcc2] shadow-sm overflow-hidden">
          {/* Panoramic Cover Banner with High-Quality Vedic Scene */}
          <div className="relative h-56 sm:h-72 md:h-80 bg-[#382516] overflow-hidden">
            <img
              src={coverImage || defaultCoverBg}
              alt="Vedic Sanctuary Cover"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = defaultCoverBg;
              }}
            />
            {/* Luminous Bottom Gradient for Natural Transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />
          </div>

          {/* Profile Identity Bar */}
          <div className="px-6 sm:px-8 md:px-10 pb-8 pt-0 relative">
            {/* Upper Action & Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 md:-mt-22 mb-5">
              {/* Avatar overlapping banner border */}
              <div className="relative shrink-0 w-max">
                <img
                  src={avatar || DEFAULT_NEUTRAL_AVATAR}
                  alt={displayName}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-50"
                />
                {isVerified && (
                  <div
                    className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md"
                    title="Verified Sanatana Scholar"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  </div>
                )}
              </div>

              {/* Action Buttons: Follow Scholar & Book Consultation */}
              <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-0">
                {!isOwnProfile && (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-2xs cursor-pointer ${
                      isFollowing
                        ? "bg-[#fff5e5] hover:bg-[#faebd7] text-[#a94f0a] border border-[#d6be9a]"
                        : "bg-white hover:bg-[#fff5e5] text-[#382516] border border-[#ebdcc2]"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 text-[#a94f0a]" />
                        <span>Following Scholar</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-[#a94f0a]" />
                        <span>Follow Scholar</span>
                      </>
                    )}
                  </button>
                )}

                <Link
                  to="/book-consultation"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#a94f0a]/20 transition transform active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </Link>
              </div>
            </div>

            {/* Name, Verification, Follower Stats & Headline */}
            <div className="mb-6">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2]">
                  {professionalType}
                </span>

                {/* Genuine Verification Status */}
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Scholar</span>
                  </span>
                ) : isCustomUserCreated ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-300">
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>Pending Review</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fcf8f0] text-[#7a6452] border border-[#ebdcc2]">
                    <span>Community Scholar</span>
                  </span>
                )}

                {isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fff5e5] text-[#d9a441] border border-[#d9a441]/40">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}

                {/* Follower Metric Pill */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fffcf7] text-[#6b5542] border border-[#ebdcc2]">
                  <Users className="w-3 h-3 text-[#a94f0a]" />
                  <span>{followerCount} Followers</span>
                </span>
              </div>

              {/* Title & Honorific */}
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#382516] tracking-tight">
                  {displayName}
                </h1>
                {fullName && fullName !== displayName && (
                  <p className="text-xs sm:text-sm text-[#7a6452] italic">
                    ({fullName})
                  </p>
                )}
              </div>

              {headline && (
                <p className="text-sm sm:text-base text-[#5c4736] font-medium leading-relaxed max-w-4xl mt-1.5">
                  {headline}
                </p>
              )}
            </div>

            {/* Profile Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3.5 px-4 sm:px-6 rounded-2xl bg-[#fffdfa] border border-[#ebdcc2] text-xs sm:text-sm text-[#382516]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Location</p>
                  <p className="font-semibold truncate">{formattedLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Experience</p>
                  <p className="font-semibold">{yearsOfExperience}+ Years</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Languages</p>
                  <p className="font-semibold truncate">
                    {languagesList.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Tradition</p>
                  <p className="font-semibold truncate">{lineage || "Vedic Parampara"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 mb-6 border-b border-[#ebdcc2] pb-0.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "about"
                ? "border-[#a94f0a] text-[#a94f0a]"
                : "border-transparent text-[#7a6452] hover:text-[#382516]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Heritage & About</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "posts"
                ? "border-[#a94f0a] text-[#a94f0a]"
                : "border-transparent text-[#7a6452] hover:text-[#382516]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Vedic Posts & Insights</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "posts"
                  ? "bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2]"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {authorPosts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "services"
                ? "border-[#a94f0a] text-[#a94f0a]"
                : "border-transparent text-[#7a6452] hover:text-[#382516]"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Services & Vidhis</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === "services"
                  ? "bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2]"
                  : "bg-stone-100 text-stone-600"
              }`}
            >
              {servicesList.length}
            </span>
          </button>
        </div>

        {/* Balanced Two-Column Layout: Main Tab Content vs Purposeful Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Main Content Column (7 or 8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            {/* ================= TAB 1: HERITAGE & ABOUT ================= */}
            {activeTab === "about" && (
              <div className="space-y-6 animate-fade-in">
                {/* About & Spiritual Heritage Section */}
                <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#f0e4cf]">
                    <BookOpen className="w-4 h-4 text-[#a94f0a]" />
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#382516]">
                      About & Spiritual Heritage
                    </h2>
                  </div>
                  <div className="prose prose-stone max-w-none text-xs sm:text-sm text-[#5c4736] leading-relaxed whitespace-pre-line">
                    {bio || "This spiritual practitioner has not provided a biography yet."}
                  </div>
                </div>

                {/* Specializations & Shastra Study */}
                {specializationsList.length > 0 && (
                  <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#f0e4cf]">
                      <Sparkles className="w-4 h-4 text-[#a94f0a]" />
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#382516]">
                        Specializations & Shastra Study
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {specializationsList.map((spec, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#fffdfa] border border-[#ebdcc2] flex items-center gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#a94f0a] shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-[#382516]">
                            {spec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education, Gurukul & Lineage Section */}
                <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-[#f0e4cf]">
                    <Award className="w-4 h-4 text-[#a94f0a]" />
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#382516]">
                      Education, Gurukul & Lineage
                    </h2>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] block">
                        Formal Training & Degree
                      </span>
                      <p className="text-[#382516] font-semibold mt-0.5">
                        {education || "Traditional Gurukul and Sanskrit Studies"}
                      </p>
                    </div>

                    {lineage && (
                      <div className="pt-3 border-t border-[#f5ebd9]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] block">
                          Spiritual Lineage / Guru Parampara
                        </span>
                        <p className="text-[#382516] font-semibold mt-0.5">
                          {lineage}
                        </p>
                      </div>
                    )}

                    {(availabilityMode || serviceLocations) && (
                      <div className="pt-3 border-t border-[#f5ebd9] grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availabilityMode && (
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] block">
                              Consultation Mode
                            </span>
                            <p className="text-[#382516] capitalize mt-0.5">
                              {availabilityMode === "both"
                                ? "In-Person & Online Live"
                                : availabilityMode === "online"
                                ? "Online Video Only"
                                : "In-Person at Kshetra Only"}
                            </p>
                          </div>
                        )}
                        {serviceLocations && (
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] block">
                              Travel Locations
                            </span>
                            <p className="text-[#382516] mt-0.5">
                              {Array.isArray(serviceLocations)
                                ? serviceLocations.join(", ")
                                : serviceLocations}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: VEDIC POSTS & INSIGHTS ================= */}
            {activeTab === "posts" && (
              <div className="space-y-6 animate-fade-in">
                {/* Post Composer if viewing own profile */}
                {isOwnProfile && (
                  <CommunityPostComposer
                    onPostCreated={() => setPostsVersion((v) => v + 1)}
                  />
                )}

                {authorPosts.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#ebdcc2] p-8 sm:p-12 text-center shadow-xs space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center mx-auto text-[#a94f0a]">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#382516]">
                      No Vedic Reflections Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-[#7a6452] max-w-sm mx-auto leading-relaxed">
                      {isOwnProfile
                        ? "You have not published any shastric thoughts or study notes yet. Use the composer above to share with the community."
                        : `${displayName} has not shared any public discussions or scriptural study insights yet.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {authorPosts.map((post) => (
                      <CommunityPostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onSave={handleSave}
                        onCommentSubmit={handleCommentSubmit}
                        onDeletePost={handleDeletePost}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 3: SERVICES & VIDHIS ================= */}
            {activeTab === "services" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#f0e4cf]">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#a94f0a]" />
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-[#382516]">
                        Vedic Rituals & Vidhis Catalogue
                      </h2>
                    </div>
                    <span className="text-xs text-[#7a6452] font-semibold">
                      {servicesList.length} {servicesList.length === 1 ? "Offering" : "Offerings"}
                    </span>
                  </div>

                  {servicesList.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs sm:text-sm text-[#7a6452] italic">
                        No specific ritual vidhis currently listed for this profile.
                      </p>
                      <Link
                        to="/book-consultation"
                        className="inline-block text-xs font-bold text-[#a94f0a] hover:underline"
                      >
                        Inquire directly for custom Vedic vidhi →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {servicesList.map((srv, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-[#fffdfa] border border-[#ebdcc2] hover:border-[#a94f0a]/50 transition flex flex-col justify-between gap-4 shadow-2xs"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2]">
                                {srv.type || "Vedic Vidhi"}
                              </span>
                              {srv.duration && (
                                <span className="flex items-center gap-1 text-[11px] text-[#7a6452]">
                                  <Clock className="w-3 h-3 text-[#a94f0a]" />
                                  <span>{srv.duration}</span>
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif text-base font-bold text-[#382516]">
                              {srv.name}
                            </h3>

                            {srv.description && (
                              <p className="text-xs text-[#6b5542] leading-relaxed line-clamp-3">
                                {srv.description}
                              </p>
                            )}

                            {srv.mode && (
                              <p className="text-[11px] text-[#8a725e]">
                                Mode: <strong className="text-[#382516] font-medium">{srv.mode}</strong>
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t border-[#f5ebd9]">
                            <Link
                              to="/book-consultation"
                              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#a94f0a] text-[#a94f0a] hover:text-white border border-[#a94f0a] text-xs font-bold transition shadow-2xs cursor-pointer"
                            >
                              <span>Request Vidhi</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Purposeful Contextual Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* 1. Consultation & Sankalpa Panel */}
            <div className="bg-[#fff5e5] rounded-2xl border border-[#ebdcc2] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a94f0a]">
                <Flame className="w-4 h-4 text-[#a94f0a]" />
                <span>Sanatana Consultation</span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#382516]">
                  Consult with {displayName}
                </h3>
                <p className="text-xs text-[#6b5542] mt-1 leading-relaxed">
                  Receive personalized Vedic guidance, horoscope inquiry, and authentic shastric remedies.
                </p>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-white border border-[#ebdcc2] text-xs text-[#382516]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold">Available for Consultations</span>
                </div>
                <div className="flex items-center gap-2 text-[#7a6452]">
                  <Clock className="w-3.5 h-3.5 text-[#a94f0a] shrink-0" />
                  <span>Prompt coordination within 2–4 hours</span>
                </div>
                <div className="flex items-center gap-2 text-[#7a6452]">
                  <MapPin className="w-3.5 h-3.5 text-[#a94f0a] shrink-0" />
                  <span className="truncate">{formattedLocation} & Worldwide Online</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  to="/book-consultation"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#a94f0a]/20 transition transform active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation Now</span>
                </Link>

                {isCustomUserCreated && (
                  <Link
                    to={`/community/edit-profile?slug=${profile.slug}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-[#faebd7] text-[#7a4010] text-xs font-semibold border border-[#d6be9a] transition"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#a94f0a]" />
                    <span>Edit Profile Details</span>
                  </Link>
                )}
              </div>
            </div>

            {/* 2. Areas of Expertise Tags */}
            {expertiseList.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#382516] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d9a441]" />
                  <span>Areas of Expertise</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {expertiseList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#fff5e5] text-[#7a4010] border border-[#ebdcc2]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Other Recommended Scholars */}
            {suggestedScholars.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#382516] mb-3 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#a94f0a]" />
                  <span>Other Vedic Scholars</span>
                </h4>

                <div className="space-y-2.5">
                  {suggestedScholars.map((sch) => (
                    <div
                      key={sch.slug}
                      className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-[#fffdfa] border border-[#ebdcc2] hover:border-[#a94f0a]/50 transition"
                    >
                      <Link
                        to={`/community/profile/${sch.slug}`}
                        className="flex items-center gap-2.5 min-w-0"
                      >
                        <img
                          src={sch.avatar || DEFAULT_NEUTRAL_AVATAR}
                          alt={sch.displayName}
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-[#ebdcc2]"
                        />
                        <div className="min-w-0">
                          <p className="font-serif text-xs font-bold text-[#382516] truncate">
                            {sch.displayName}
                          </p>
                          <p className="text-[10px] text-[#7a6452] truncate">
                            {sch.city} • {sch.professionalType}
                          </p>
                        </div>
                      </Link>

                      <Link
                        to={`/community/profile/${sch.slug}`}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2] hover:bg-[#faeed8] transition shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Professional Media Channels (Only if defined) */}
            {(websiteUrl || linkedInUrl || youtubeUrl || instagramUrl) && (
              <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#382516] mb-3">
                  Professional Channels
                </h4>
                <div className="space-y-2 text-xs">
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#fff5e5] border border-[#ebdcc2] text-[#382516] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#a94f0a]" />
                        <span>Official Website</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#8a725e]" />
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#fff5e5] border border-[#ebdcc2] text-[#382516] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 fill-red-600 shrink-0" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>YouTube Channel</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#8a725e]" />
                    </a>
                  )}
                  {linkedInUrl && (
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#fff5e5] border border-[#ebdcc2] text-[#382516] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 fill-blue-700 shrink-0" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        <span>LinkedIn Profile</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#8a725e]" />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#fff5e5] border border-[#ebdcc2] text-[#382516] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 fill-pink-600 shrink-0" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#8a725e]" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 5. Trust Assurance */}
            <div className="p-4 rounded-2xl bg-[#fffdfa] border border-[#ebdcc2] text-xs text-[#7a6452] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-bold text-[#382516]">
                <ShieldCheck className="w-4 h-4 text-[#a94f0a]" />
                <span>Veda Structure Sanatana Standard</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Practitioners are verified by traditional scholarly credentials and adhere to classical Sanskrit shastras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfileDetailPage;
