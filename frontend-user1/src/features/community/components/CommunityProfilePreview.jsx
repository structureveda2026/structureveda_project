import {
  MapPin,
  Layers,
  Edit3,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import ProfessionalProfileCard from "./ProfessionalProfileCard";
import { normalizeCommunityProfile } from "../data/communityMockData";

// Neutral dignified spiritual avatar placeholder (replaces generic hardcoded stock photos)
const DEFAULT_NEUTRAL_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='28' fill='%23faebd7'/%3E%3Ccircle cx='60' cy='46' r='20' fill='%23a94f0a' fill-opacity='0.85'/%3E%3Cpath d='M28 98c0-16 14-28 32-28s32 12 32 28v4H28v-4z' fill='%23a94f0a' fill-opacity='0.85'/%3E%3Ccircle cx='60' cy='46' r='5' fill='%23d9a441'/%3E%3C/svg%3E";

const DEFAULT_COVER_IMAGE =
  "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&q=80&w=1200";

const CommunityProfilePreview = ({ formData, onEditStep }) => {
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
      : "Varanasi, Uttar Pradesh, India",
    yearsOfExperience: Number(formData.yearsOfExperience) || 0,
    bio:
      formData.bio ||
      "Your detailed spiritual journey, gurukul training, lineage, and rituals will appear here.",
    education: formData.education || "Traditional Gurukul or Sanskrit Vishwavidyalaya",
    lineage: formData.lineage || "Vedic Parampara",
    avatar: formData.avatar || DEFAULT_NEUTRAL_AVATAR,
    coverImage: formData.coverImage || DEFAULT_COVER_IMAGE,
    isVerified: false,
    status: "PENDING_REVIEW",
    isCustomUserCreated: true,
  });

  // Check for required fields for clear feedback on Step 4
  const missingRequired = [];
  if (!formData.fullName?.trim()) missingRequired.push({ field: "Legal Name", step: 1 });
  if (!formData.displayName?.trim()) missingRequired.push({ field: "Display Name", step: 1 });
  if (!formData.headline?.trim()) missingRequired.push({ field: "Professional Headline", step: 1 });
  if (!formData.bio?.trim() || formData.bio.length < 20)
    missingRequired.push({ field: "Biography (20+ chars)", step: 1 });
  if (!formData.city?.trim()) missingRequired.push({ field: "Sacred City / Location", step: 1 });
  if (!formData.expertise || formData.expertise.length === 0)
    missingRequired.push({ field: "At least one Area of Expertise", step: 2 });

  return (
    <div className="space-y-6">
      {/* Missing Required Warning (if any) */}
      {missingRequired.length > 0 ? (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-950">
                Incomplete Information ({missingRequired.length} items missing)
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Missing: {missingRequired.map((m) => m.field).join(", ")}
              </p>
            </div>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(missingRequired[0].step)}
              className="px-3.5 py-1.5 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white text-xs font-semibold shrink-0 transition shadow-2xs"
            >
              Fix Missing Fields →
            </button>
          )}
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 text-xs sm:text-sm shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-emerald-950">
            All required information is complete and ready for submission.
          </span>
        </div>
      )}

      {/* Review Group 1: Basic Information */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#ebdcc2] p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0e4cf] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[11px] font-bold text-[#a94f0a]">
              01
            </span>
            <h3 className="font-serif text-base font-bold text-[#382516]">
              Basic Information & Heritage
            </h3>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#a94f0a] hover:bg-[#fff5e5] border border-[#ebdcc2] transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <img
              src={previewProfile.avatar}
              alt="Avatar"
              className="w-14 h-14 rounded-xl object-cover border-2 border-[#d9a441] shadow-2xs bg-stone-50 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
                Display Name
              </span>
              <p className="text-sm font-bold text-[#382516] truncate">
                {previewProfile.displayName}
              </p>
              <p className="text-xs text-[#7a6452] truncate">
                Legal: {formData.fullName || "—"}
              </p>
            </div>
          </div>

          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
              Title & Tradition
            </span>
            <p className="text-xs font-semibold text-[#382516] line-clamp-2">
              {previewProfile.headline}
            </p>
          </div>

          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
              Location & Languages
            </span>
            <p className="text-xs text-[#382516] font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#a94f0a]" />
              {previewProfile.location}
            </p>
            <p className="text-xs text-[#7a6452] mt-0.5">
              {previewProfile.languages.join(", ") || "Sanskrit, Hindi"}
            </p>
          </div>
        </div>

        {formData.bio && (
          <div className="mt-3.5 pt-3 border-t border-[#f5ebd9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block mb-1">
              Lineage & Biography
            </span>
            <p className="text-xs text-[#5c4a3b] leading-relaxed line-clamp-3 whitespace-pre-line">
              {formData.bio}
            </p>
          </div>
        )}
      </div>

      {/* Review Group 2: Professional Identity & Vidhis */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#ebdcc2] p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0e4cf] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[11px] font-bold text-[#a94f0a]">
              02
            </span>
            <h3 className="font-serif text-base font-bold text-[#382516]">
              Professional Identity & Offerings
            </h3>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#a94f0a] hover:bg-[#fff5e5] border border-[#ebdcc2] transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
              Role & Experience
            </span>
            <p className="font-bold text-[#382516] mt-0.5">
              {formData.professionalType} • {formData.yearsOfExperience || 0} Years Active
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
              Consultation Mode
            </span>
            <p className="text-[#382516] capitalize mt-0.5">
              {formData.availabilityMode === "both"
                ? "Online Video & In-Person"
                : formData.availabilityMode === "online"
                ? "Online Video Only"
                : "In-Person Kshetra Only"}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
              Parampara / Lineage
            </span>
            <p className="text-[#382516] mt-0.5 truncate">
              {formData.lineage || "Traditional Vedic Lineage"}
            </p>
          </div>
        </div>

        {/* Areas of Expertise */}
        <div className="mt-3 pt-3 border-t border-[#f5ebd9]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block mb-1.5">
            Areas of Expertise ({previewProfile.expertise.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {previewProfile.expertise.map((exp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#fff5e5] text-[#7a4010] border border-[#ebdcc2]"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Services / Vidhis summary */}
        {formData.services && formData.services.length > 0 && formData.services[0].name && (
          <div className="mt-3 pt-3 border-t border-[#f5ebd9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block mb-1.5">
              Rituals & Consultations Offered ({formData.services.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {formData.services.map((srv, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-[#ebdcc2] text-xs">
                  <p className="font-bold text-[#382516]">{srv.name || "Untitled Ritual"}</p>
                  <p className="text-[11px] text-[#7a6452] mt-0.5">
                    {srv.type} • {srv.duration || "Standard Vidhi"} • {srv.mode || "Online/In-person"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Group 3: Credentials & Links */}
      <div className="bg-[#fffdfa] rounded-2xl border border-[#ebdcc2] p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0e4cf] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#fff5e5] border border-[#ebdcc2] flex items-center justify-center text-[11px] font-bold text-[#a94f0a]">
              03
            </span>
            <h3 className="font-serif text-base font-bold text-[#382516]">
              Credentials & Professional Links
            </h3>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#a94f0a] hover:bg-[#fff5e5] border border-[#ebdcc2] transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
              Gurukul / Vishwavidyalaya Qualification
            </span>
            <p className="font-bold text-[#382516] mt-0.5">
              {formData.certificateName || "Traditional Sanskrit Studies"}
            </p>
            <p className="text-[#7a6452] mt-0.5">
              {formData.issuingInstitution || "Sampurnanand Sanskrit Vishwavidyalaya"}
            </p>
            {formData.credentialFileName && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-medium">
                Document: {formData.credentialFileName} (Demonstration)
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
              Channels & Online Presence
            </span>
            <div className="mt-1 space-y-1">
              {formData.websiteUrl && (
                <p className="text-[#382516] flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-[#a94f0a]" />
                  <span className="truncate">{formData.websiteUrl}</span>
                </p>
              )}
              {formData.youtubeUrl && (
                <p className="text-[#382516] flex items-center gap-1">
                  <ExternalLink className="w-3 h-3 text-red-600" />
                  <span className="truncate">{formData.youtubeUrl}</span>
                </p>
              )}
              {!formData.websiteUrl && !formData.youtubeUrl && !formData.linkedInUrl && (
                <p className="text-stone-400 italic">No external web links specified (Optional)</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Directory Card Preview Subsection */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-[#a94f0a]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e5947]">
            Directory Card Appearance
          </h4>
        </div>
        <div className="max-w-md">
          <ProfessionalProfileCard profile={previewProfile} />
        </div>
      </div>
    </div>
  );
};

export default CommunityProfilePreview;
