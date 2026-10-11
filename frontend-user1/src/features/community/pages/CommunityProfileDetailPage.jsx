import { useState, useMemo } from "react";
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
} from "lucide-react";
import { getCommunityProfileBySlug } from "../data/communityMockData";
import templeBg from "../../../assets/images/sacred-vedic-temple-hero-bg.jpg";

const CommunityProfileDetailPage = () => {
  const { slug } = useParams();
  const [copiedLink, setCopiedLink] = useState(false);

  // Load profile by slug from mock data or local store
  const profile = useMemo(() => {
    return getCommunityProfileBySlug(slug);
  }, [slug]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fffcf7] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#ebdcc2] p-8 max-w-md w-full text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#faeed8] flex items-center justify-center mx-auto text-[#a0520d] mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2b241d] mb-2">
            Profile Not Found
          </h2>
          <p className="text-xs sm:text-sm text-[#735e4d] mb-6">
            The requested spiritual professional profile does not exist or has been removed from this demonstration directory.
          </p>
          <Link
            to="/community"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9b4e10] hover:bg-[#853f09] text-white text-xs sm:text-sm font-semibold transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Community Directory</span>
          </Link>
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
  } = profile;

  // Safe array normalization to prevent any .map() TypeError
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf7] text-[#2b241d] pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-[#fffdfa] border-b border-[#ebdcc2]/70 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to="/community"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7a4010] hover:text-[#2b241d] transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Community</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {isCustomUserCreated && (
              <Link
                to={`/community/edit-profile?slug=${profile.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faeed8] hover:bg-[#f7dfb0] text-[#7a4010] text-xs font-semibold border border-[#d6be9a] transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Profile (Demo)</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#ebdcc2] hover:bg-[#faf3e8] text-xs font-medium text-[#5c4736] transition shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Demo Warning Banner if Profile is User-Created & Pending Review */}
      {(status === "PENDING_REVIEW" || isCustomUserCreated) && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Demo Status: Pending Review.</strong> This profile was created locally in your browser. In a production system, it would be reviewed by the Veda Structure spiritual advisory committee before full indexation.
              </span>
            </div>
            <Link
              to={`/community/edit-profile?slug=${profile.slug}`}
              className="font-semibold underline shrink-0 hover:text-amber-950"
            >
              Edit Details
            </Link>
          </div>
        </div>
      )}

      {/* Hero Cover & Profile Bio Card Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-3xl border border-[#ebdcc2] shadow-xs overflow-hidden">
          {/* Cover Banner Area */}
          <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-[#4a2406] via-[#7d3c0b] to-[#9b4e10]">
            <img
              src={coverImage || templeBg}
              alt="Sacred Cover Banner"
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                e.target.src = templeBg;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Profile Identity Bar */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-6">
              {/* Avatar + Main Names */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="relative shrink-0">
                  <img
                    src={
                      avatar ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                    }
                    alt={displayName}
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-100"
                  />
                  {isVerified && (
                    <div
                      className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md"
                      title="Verified by Veda Structure"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#faeed8] text-[#8a4e17] border border-[#d6be9a]">
                      {professionalType}
                    </span>

                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Expert</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
                        <span>Awaiting Verification (Demo)</span>
                      </span>
                    )}

                    {isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#2b241d]">
                    {displayName}
                  </h1>
                  {fullName && fullName !== displayName && (
                    <p className="text-xs sm:text-sm text-[#7a6452] italic mt-0.5">
                      ({fullName})
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Book Consultation & Edit Profile */}
              <div className="flex flex-wrap items-center gap-3">
                {isCustomUserCreated && (
                  <Link
                    to={`/community/edit-profile?slug=${profile.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#faeed8] hover:bg-[#f7dfb0] text-[#7a4010] text-sm font-bold border border-[#d6be9a] transition shadow-xs active:scale-95"
                  >
                    <Edit3 className="w-4 h-4 text-[#b35d14]" />
                    <span>Edit Profile</span>
                  </Link>
                )}

                <Link
                  to="/book-consultation"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#9b4e10] to-[#b86116] hover:from-[#853f09] hover:to-[#a0520d] text-white text-sm font-semibold shadow-md shadow-[#9b4e10]/20 transition transform active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </Link>
              </div>
            </div>

            {/* Headline */}
            <p className="text-base sm:text-lg text-[#4a3727] font-medium leading-relaxed max-w-4xl mb-6">
              {headline}
            </p>

            {/* Meta Tags Row: Location, Experience, Languages, Lineage */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 px-4 sm:px-6 rounded-2xl bg-[#fffdfa] border border-[#f0e4cf] text-xs sm:text-sm text-[#4d3a2a]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#a0520d] shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Location</p>
                  <p className="font-semibold truncate">{location || city}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#a0520d] shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Experience</p>
                  <p className="font-semibold">{yearsOfExperience}+ Years</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#a0520d] shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Languages</p>
                  <p className="font-semibold truncate">
                    {languagesList.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#a0520d] shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8a725e]">Tradition</p>
                  <p className="font-semibold truncate">{lineage || "Vedic Parampara"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns (Main Details vs Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main 2-Span Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Spiritual Heritage Section */}
            <section className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#a0520d]" />
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2b241d]">
                  About & Spiritual Heritage
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[#5c4736] leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </section>

            {/* Services Offered Section */}
            {servicesList.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#a0520d]" />
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2b241d]">
                      Vedic Services & Vidhis Offered
                    </h2>
                  </div>
                  <span className="text-xs text-[#7d6857] font-medium">
                    {servicesList.length} {servicesList.length === 1 ? "service" : "services"}
                  </span>
                </div>

                <div className="space-y-4">
                  {servicesList.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#fffdfa] border border-[#f0e4cf] hover:border-[#d6be9a] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-base sm:text-lg font-bold text-[#2b241d]">
                            {srv.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#faeed8] text-[#8a4e17]">
                            {srv.type}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#665342] leading-relaxed">
                          {srv.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a725e] pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#a0520d]" />
                            {srv.duration || "Standard Vidhi"}
                          </span>
                          <span>•</span>
                          <span>{srv.mode || "Online Live & In-Person"}</span>
                        </div>
                      </div>

                      <Link
                        to="/book-consultation"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#9b4e10] text-[#9b4e10] hover:text-white border border-[#c2782b] text-xs font-semibold transition shrink-0 shadow-2xs"
                      >
                        <span>Request Ritual</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Specializations & Shastric Rigor */}
            {specializationsList.length > 0 && (
              <section className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#a0520d]" />
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2b241d]">
                    Specializations & Shastra Study
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specializationsList.map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#fffdfa] border border-[#f0e4cf] flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#a0520d] shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-[#4a3727]">
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Consultation Request Card */}
            <div className="bg-gradient-to-br from-[#fffdfa] via-[#fdf8f0] to-[#fbf2e3] rounded-3xl border-2 border-[#d4af37]/50 p-6 shadow-md">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#9b4e10]">
                <Flame className="w-4 h-4 text-[#b35d14]" />
                <span>Sanatana Consultation</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2b241d] mb-1">
                Book with {displayName}
              </h3>
              <p className="text-xs text-[#6e5845] leading-relaxed mb-4">
                Receive traditional Vedic vidhi, personalized sankalpa, and authentic shastric guidance.
              </p>

              <div className="space-y-2.5 text-xs text-[#543f2e] mb-5 p-3 rounded-xl bg-white/80 border border-[#ebdcc2]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-[#2b241d]">Currently Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#b35d14]" />
                  <span>Prompt coordination within 2-4 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#b35d14]" />
                  <span>{location || city} & Worldwide Online</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/book-consultation"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#9b4e10] via-[#b35d14] to-[#c76d1a] hover:from-[#88430c] hover:via-[#a0520d] hover:to-[#b35d14] text-white text-sm font-bold shadow-lg shadow-[#9b4e10]/20 transition-all transform active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation Now</span>
                </Link>

                {isCustomUserCreated && (
                  <Link
                    to={`/community/edit-profile?slug=${profile.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#faeed8] hover:bg-[#f7dfb0] text-[#7a4010] text-xs font-bold border border-[#d6be9a] transition shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#b35d14]" />
                    <span>Edit My Profile (Demo)</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Expertise Tags Card */}
            {expertiseList.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#2b241d] mb-3">
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {expertiseList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#fcf8f0] text-[#7a4010] border border-[#ebdcc2]"
                    >
                      <Sparkles className="w-3 h-3 text-[#a0520d]" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Traditional Education & Lineage Card */}
            <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 shadow-xs">
              <h3 className="font-serif text-lg font-bold text-[#2b241d] mb-4">
                Education & Parampara
              </h3>
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] mb-1">
                    Formal Training
                  </p>
                  <p className="text-[#3b2b1d] font-medium leading-snug">
                    {education || "Traditional Vedic Gurukul Discipline"}
                  </p>
                </div>

                {lineage && (
                  <div className="pt-3 border-t border-[#f0e4cf]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a725e] mb-1">
                      Lineage
                    </p>
                    <p className="text-[#3b2b1d] font-medium leading-snug">{lineage}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Public Professional Links Card */}
            {(websiteUrl || linkedInUrl || youtubeUrl || instagramUrl) && (
              <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#2b241d] mb-3">
                  Professional Channels
                </h3>
                <div className="space-y-2 text-xs">
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#faeed8] border border-[#f0e4cf] text-[#7a4010] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#a0520d]" />
                        <span>Official Website</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#faeed8] border border-[#f0e4cf] text-[#7a4010] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 fill-red-600 shrink-0" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span>YouTube Channel</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {linkedInUrl && (
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#faeed8] border border-[#f0e4cf] text-[#7a4010] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 fill-blue-700 shrink-0" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        <span>LinkedIn Profile</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffdfa] hover:bg-[#faeed8] border border-[#f0e4cf] text-[#7a4010] font-medium transition"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 fill-pink-600 shrink-0" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Community Trust Assurance Note */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#faf3e8] to-[#f4e8d3] border border-[#ebdcc2] text-xs text-[#634f3e] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#453324]">
                <CheckCircle2 className="w-4 h-4 text-[#a0520d]" />
                <span>Veda Structure Sanatana Standard</span>
              </div>
              <p className="leading-relaxed">
                All community profiles are curated to ensure adherence to authentic Vedic injunctions, ethical consultation, and sacred tradition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfileDetailPage;
