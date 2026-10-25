import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Users,
  Sparkles,
  AlertCircle,
  Flower2,
  BookOpen,
} from "lucide-react";
import CommunityProfileForm from "../components/CommunityProfileForm";
import { getUserCustomProfile } from "../data/communityMockData";
import createProfileHeroBg from "../../../assets/images/create-profile-hero-bg.jpg";

const CommunityCreateProfilePage = ({ isEditing = false }) => {
  const { slug: routeSlug } = useParams();
  const [searchParams] = useSearchParams();
  const editSlug = routeSlug || searchParams.get("slug");

  // If editing, find the user's custom profile from local store
  const existingProfile = useMemo(() => {
    if (!isEditing) return null;
    return editSlug ? getUserCustomProfile(editSlug) : getUserCustomProfile();
  }, [isEditing, editSlug]);

  // If user navigated to edit-profile but no custom demo profile exists
  if (isEditing && !existingProfile) {
    return (
      <div className="min-h-screen bg-[#fffcf7] text-[#2b241d] py-12 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-[#ebdcc2] p-8 max-w-md w-full text-center shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#faeed8] flex items-center justify-center mx-auto text-[#a0520d]">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2b241d]">
            No Editable Profile Found
          </h2>
          <p className="text-xs sm:text-sm text-[#735e4d] leading-relaxed">
            You do not currently have a local demo profile to edit, or the specified profile belongs to a permanent demonstration scholar. Create your spiritual profile to manage and edit it here.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/community/create-profile"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white text-xs sm:text-sm font-semibold transition shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your Profile</span>
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#fffdfa] hover:bg-[#faebd7] text-[#7a4010] text-xs sm:text-sm font-semibold border border-[#ebdcc2] transition"
            >
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf7] text-[#382516]">
      {/* Full-Width Immersive Vedic Hero Section */}
      <section className="relative overflow-hidden bg-[#fffcf7] border-b border-[#ebdcc2]">
        {/* Background Photographic Layer with Varanasi & Temple Atmosphere */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src={createProfileHeroBg}
            alt="Varanasi Ghats & Sacred Temples"
            className="w-full h-full object-cover object-right md:object-center lg:object-right"
          />
        </div>

        {/* Luminous Ivory-to-Transparent Editorial Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffcf7] via-[#fffcf7]/95 via-[54%] md:via-[50%] lg:via-[46%] to-transparent" />

        {/* Mobile Contrast Guard */}
        <div className="sm:hidden absolute inset-0 bg-[#fffcf7]/75" />

        {/* Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-9 relative z-10">
          <div className="max-w-2xl">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-1.5 text-xs text-[#7d6857] mb-3">
              <Link to="/" className="hover:text-[#a94f0a] flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#cfbda9]" />
              <Link to="/community" className="hover:text-[#a94f0a] flex items-center gap-1 transition-colors">
                <Users className="w-3.5 h-3.5" />
                <span>Community</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#cfbda9]" />
              <span className="text-[#a94f0a] font-semibold">
                {isEditing ? "Edit Profile" : "Create Profile"}
              </span>
            </nav>

            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff5e5]/90 border border-[#ebdcc2] text-[11px] font-bold tracking-wider uppercase text-[#a94f0a] mb-2.5 shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#d9a441]" />
              <span>YOUR PROFESSIONAL JOURNEY</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#382516] tracking-tight leading-[1.15] mb-2">
              {isEditing ? (
                <>
                  Edit Your <span className="text-[#a94f0a]">Spiritual Profile</span>
                </>
              ) : (
                <>
                  Create Your <span className="text-[#a94f0a]">Spiritual Profile</span>
                </>
              )}
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-xs sm:text-sm md:text-[15px] text-[#5c4736] max-w-xl leading-relaxed mb-5">
              {isEditing
                ? "Update your tradition, experience, and services to people seeking authentic Vedic guidance. Changes are saved directly to your local session."
                : "Introduce your tradition, experience, and services to people seeking authentic Vedic guidance."}
            </p>

            {/* Three Benefit Highlights */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 pt-1">
              {/* Benefit 1 */}
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#382516]">
                <div className="w-8 h-8 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0 shadow-2xs">
                  <Flower2 className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs leading-snug">
                  Join a Global<br className="hidden sm:inline" /> Vedic Community
                </span>
              </div>

              <div className="hidden sm:block w-px h-7 bg-[#ebdcc2]" />

              {/* Benefit 2 */}
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#382516]">
                <div className="w-8 h-8 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0 shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs leading-snug">
                  Share Your Knowledge<br className="hidden sm:inline" /> & Services
                </span>
              </div>

              <div className="hidden sm:block w-px h-7 bg-[#ebdcc2]" />

              {/* Benefit 3 */}
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#382516]">
                <div className="w-8 h-8 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[#a94f0a] shrink-0 shadow-2xs">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-semibold text-xs leading-snug">
                  Connect with<br className="hidden sm:inline" /> Sincere Seekers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Wizard Form Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <CommunityProfileForm
          key={existingProfile?.id || (isEditing ? "editing" : "creating")}
          initialData={existingProfile}
          isEditing={isEditing}
        />

        {/* Small, Unobtrusive Informational Footer Notice */}
        <div className="mt-12 pt-6 border-t border-[#f0e4cf] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8a725e]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#d9a441] shrink-0" />
            <span>
              Profiles are stored locally in your browser for this preview. In the production network, official verification badges are issued upon traditional credential review.
            </span>
          </div>
          <Link
            to="/community"
            className="text-[#a94f0a] hover:underline font-semibold shrink-0"
          >
            ← Return to Community Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityCreateProfilePage;
