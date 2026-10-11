import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Flame,
  AlertCircle,
  Sun,
  ShieldCheck,
  User,
} from "lucide-react";

const ProfessionalProfileCard = ({ profile }) => {
  const [imageError, setImageError] = useState(false);

  const {
    slug,
    displayName,
    fullName,
    headline,
    professionalType,
    avatar,
    location,
    city,
    yearsOfExperience,
    languages = [],
    isVerified,
    bio,
    expertise = [],
    status,
    isCustomUserCreated,
  } = profile;

  const expertiseList = Array.isArray(expertise)
    ? expertise
    : typeof expertise === "string" && expertise.trim()
    ? expertise.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const languagesList = Array.isArray(languages)
    ? languages
    : typeof languages === "string" && languages.trim()
    ? languages.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Role tag styling with meaningful spiritual icons and tailored palettes
  const getRoleConfig = (type) => {
    switch (type) {
      case "Pandit":
        return {
          bg: "bg-gradient-to-r from-[#fff3dc] to-[#fdeacc] text-[#854308] border-[#e2be82]",
          label: "Pandit / Acharya",
          Icon: Flame,
        };
      case "Astrologer":
        return {
          bg: "bg-gradient-to-r from-[#f5ebf8] to-[#ede0f2] text-[#692576] border-[#cca7d4]",
          label: "Vedic Astrologer",
          Icon: Sparkles,
        };
      case "Both":
      default:
        return {
          bg: "bg-gradient-to-r from-[#fef1e8] to-[#fce4d6] text-[#8e380b] border-[#e5b293]",
          label: "Pandit & Astrologer",
          Icon: Sun,
        };
    }
  };

  const roleConfig = getRoleConfig(professionalType);
  const RoleIcon = roleConfig.Icon;

  // Initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return "VS";
    return name
      .replace(/^(Pt\.|Dr\.|Acharya|Swami|Vidushi)\s+/i, "")
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <article className="group flex flex-col justify-between bg-gradient-to-b from-white via-[#fffdfa] to-[#fffbf5] rounded-2xl border border-[#ebdcc2] hover:border-[#b35d14]/70 shadow-[0_4px_20px_rgba(43,36,29,0.05)] hover:shadow-[0_16px_36px_rgba(155,78,16,0.12)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
      {/* Top Section */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Header Bar: Role Pill + Verification/Demo status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border shadow-2xs ${roleConfig.bg}`}
          >
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{roleConfig.label}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {isVerified ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs"
                title="Veda Structure Verified Spiritual Professional"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified</span>
              </span>
            ) : status === "PENDING_REVIEW" || isCustomUserCreated ? (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs"
                title="Demo profile created locally"
              >
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Demo (Pending)</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Identity Row: Larger portrait with gold rim, Display Name, and Headline */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-[#d4af37] via-[#ebdcc2] to-[#b35d14] shadow-sm group-hover:from-[#b35d14] group-hover:to-[#d4af37] transition duration-300">
              {!imageError && avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-full h-full rounded-[14px] object-cover bg-white"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-[14px] bg-[#f9eedc] flex flex-col items-center justify-center text-[#8a4e17] font-serif font-bold text-lg">
                  <User className="w-6 h-6 mb-0.5 opacity-60" />
                  <span className="text-xs">{getInitials(displayName || fullName)}</span>
                </div>
              )}
            </div>

            {isVerified && (
              <div
                className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm border border-[#ebdcc2]"
                title="Verified"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2b241d] group-hover:text-[#9b4e10] transition-colors duration-200 line-clamp-1 leading-snug">
              <Link to={`/community/profile/${slug}`}>
                {displayName}
              </Link>
            </h3>
            <p className="text-xs sm:text-[13px] text-[#6d5743] line-clamp-2 mt-1 font-medium leading-relaxed">
              {headline}
            </p>
          </div>
        </div>

        {/* Structured Metadata Box: Experience, Location, Languages */}
        <div className="grid grid-cols-2 gap-2 py-2.5 px-3.5 rounded-xl bg-[#fffdfa] border border-[#f0e4cf] text-xs text-[#523d2d] mb-4 shadow-2xs">
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-[#b35d14] shrink-0" />
            <span className="truncate">
              <strong>{yearsOfExperience}+</strong> Yrs Experience
            </span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#b35d14] shrink-0" />
            <span className="truncate">{location || city}</span>
          </div>

          <div className="col-span-2 flex items-center gap-1.5 truncate text-[11px] text-[#735e4b] pt-0.5 border-t border-[#f5ebd9]">
            <Globe className="w-3.5 h-3.5 text-[#b35d14] shrink-0" />
            <span className="truncate">
              {languagesList.slice(0, 3).join(", ") || "Sanskrit, Hindi"}
              {languagesList.length > 3 ? ` +${languagesList.length - 3}` : ""}
            </span>
          </div>
        </div>

        {/* Short Biography - Clamped with consistent readable line height */}
        <p className="text-xs sm:text-[13px] text-[#5e4c3c] line-clamp-3 leading-relaxed mb-4 min-h-[3.6rem]">
          {bio}
        </p>

        {/* Expertise Tags Chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {expertiseList.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#fcf8f0] text-[#704d2e] border border-[#ebdcc2] group-hover:border-[#deb887]/80 transition"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#b35d14]" />
              <span>{tag}</span>
            </span>
          ))}
          {expertiseList.length > 4 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium text-[#8a725e] bg-stone-100/80">
              +{expertiseList.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Live Booking availability + Premium View Profile CTA */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-[#fefbf6] via-[#fcf6ec] to-[#faf3e8] border-t border-[#ebdcc2] flex items-center justify-between gap-3 mt-auto">
        <span className="text-[11px] text-[#7a6452] font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available for Consultations</span>
        </span>

        <Link
          to={`/community/profile/${slug}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#9b4e10] text-[#9b4e10] hover:text-white border border-[#c2782b] transition-all shadow-xs group-hover:border-[#9b4e10] active:scale-95"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};

export default ProfessionalProfileCard;
