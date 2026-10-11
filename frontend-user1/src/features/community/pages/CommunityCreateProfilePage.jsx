import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight, Home, Users, Sparkles, AlertCircle } from "lucide-react";
import CommunityProfileForm from "../components/CommunityProfileForm";
import { getUserCustomProfile } from "../data/communityMockData";

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
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9b4e10] hover:bg-[#853f09] text-white text-xs sm:text-sm font-semibold transition shadow-xs"
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
    <div className="min-h-screen bg-[#fffcf7] text-[#2b241d] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#7d6857] mb-6">
          <Link to="/" className="hover:text-[#9b4e10] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#cfbda9]" />
          <Link to="/community" className="hover:text-[#9b4e10] flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>Community</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#cfbda9]" />
          <span className="text-[#9b4e10] font-semibold">
            {isEditing ? "Edit Profile" : "Create Professional Profile"}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faeed8] border border-[#d6be9a] text-[11px] font-bold tracking-wider uppercase text-[#8a4e17] mb-3">
            <Sparkles className="w-3 h-3 text-[#a0520d]" />
            <span>Spiritual Professional Onboarding</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b241d]">
            {isEditing ? "Edit Your Vedic Profile" : "Create Your Spiritual Profile"}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#614e3e]">
            {isEditing
              ? "Update your bio, credentials, or sacred services. Changes will be saved locally to your demo session."
              : "Step into the Veda Structure directory. Present your traditional lineage, credentials, and consultations to seekers worldwide."}
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[#fff9ef] to-[#fff5e3] border border-[#ebdcc2] flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-[#9b4e10] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#5c4736]">
            <p className="font-semibold text-[#3d2d20]">Frontend Demonstration Environment</p>
            <p className="mt-0.5 text-xs text-[#705844]">
              This profile wizard works entirely inside your browser. No backend APIs, external database records, or real admin approvals are utilized in this phase.
            </p>
          </div>
        </div>

        {/* Form Wizard Component */}
        <CommunityProfileForm
          key={existingProfile?.id || (isEditing ? "editing" : "creating")}
          initialData={existingProfile}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default CommunityCreateProfilePage;
