import {
  MapPin,
  Globe,
  Award,
  Sparkles,
  AlertCircle,
  Shield,
  Layers,
} from "lucide-react";
import ProfessionalProfileCard from "./ProfessionalProfileCard";
import { normalizeCommunityProfile } from "../data/communityMockData";

const CommunityProfilePreview = ({ formData }) => {
  // Compute normalized preview object using canonical normalizer
  const previewProfile = normalizeCommunityProfile({
    ...formData,
    slug: formData.slug || "preview-profile",
    displayName: formData.displayName || formData.fullName || "Your Professional Name",
    headline: formData.headline || "Your Vedic title, tradition, and core specialization",
    location: formData.city
      ? `${formData.city}${formData.state ? `, ${formData.state}` : ""}${
          formData.country ? `, ${formData.country}` : ""
        }`
      : "Varanasi, India",
    yearsOfExperience: Number(formData.yearsOfExperience) || 0,
    bio:
      formData.bio ||
      "Your detailed spiritual journey, gurukul training, lineage, and rituals will appear here.",
    education: formData.education || "Traditional Gurukul or Sanskrit Vishwavidyalaya",
    lineage: formData.lineage || "Vedic Parampara",
    avatar:
      formData.avatar ||
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    coverImage:
      formData.coverImage ||
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&q=80&w=1200",
    isVerified: false, // User created profiles await verification
    status: "PENDING_REVIEW",
    isCustomUserCreated: true,
  });

  return (
    <div className="space-y-8">
      {/* Disclaimer / Demo Notice */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Live Profile Demonstration Preview</p>
          <p className="text-amber-800/90 text-xs mt-0.5">
            This preview simulates how your profile will look to devotees and seekers across the Veda Structure directory and public profile page once submitted.
          </p>
        </div>
      </div>

      {/* Directory Card Preview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-[#a0520d]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e5947]">
            Directory Card Appearance
          </h4>
        </div>
        <div className="max-w-md">
          <ProfessionalProfileCard profile={previewProfile} />
        </div>
      </div>

      {/* Detailed Page Appearance Preview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#a0520d]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e5947]">
            Full Profile Page Appearance
          </h4>
        </div>

        <div className="bg-white rounded-2xl border border-[#ebdcc2] overflow-hidden shadow-xs">
          {/* Banner */}
          <div className="relative h-40 sm:h-52 bg-gradient-to-r from-[#5a2e0a] to-[#9b4e10]">
            <img
              src={previewProfile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Profile Header */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-4">
              <div className="flex items-end gap-4">
                <img
                  src={previewProfile.avatar}
                  alt={previewProfile.displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-stone-100"
                />
                <div className="mb-1">
                  <h3 className="font-serif text-2xl font-bold text-[#2b241d]">
                    {previewProfile.displayName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7a4010] font-medium">
                    {previewProfile.professionalType} • {previewProfile.yearsOfExperience} Years Experience
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-300">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Pending Review</span>
              </span>
            </div>

            <p className="text-sm text-[#4d3a2a] mb-4 font-medium">
              {previewProfile.headline}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#735e4d] py-3 border-y border-[#f0e4cf]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#a0520d]" />
                {previewProfile.location}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#a0520d]" />
                {previewProfile.languages.join(", ")}
              </span>
              {previewProfile.lineage && (
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#a0520d]" />
                  {previewProfile.lineage}
                </span>
              )}
            </div>

            {/* About */}
            <div className="mt-5">
              <h5 className="font-serif text-base font-bold text-[#2b241d] mb-2">
                About & Spiritual Heritage
              </h5>
              <p className="text-xs sm:text-sm text-[#5c4a3b] leading-relaxed whitespace-pre-line">
                {previewProfile.bio}
              </p>
            </div>

            {/* Expertise Tags */}
            <div className="mt-5">
              <h5 className="font-serif text-base font-bold text-[#2b241d] mb-2">
                Areas of Expertise
              </h5>
              <div className="flex flex-wrap gap-2">
                {previewProfile.expertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-[#fcf8f0] text-[#7a4010] border border-[#ebdcc2]"
                  >
                    <Sparkles className="w-3 h-3 text-[#a0520d]" />
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Services preview if any */}
            {previewProfile.services && previewProfile.services.length > 0 && (
              <div className="mt-5">
                <h5 className="font-serif text-base font-bold text-[#2b241d] mb-2">
                  Rituals & Consultations Offered
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {previewProfile.services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#fffdfa] border border-[#f0e4cf] text-xs"
                    >
                      <p className="font-semibold text-[#2b241d]">{srv.name}</p>
                      <p className="text-[11px] text-[#8a725e] mt-0.5">
                        {srv.type} • {srv.duration || "Standard Vidhi"} • {srv.mode || "Online/In-person"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfilePreview;
