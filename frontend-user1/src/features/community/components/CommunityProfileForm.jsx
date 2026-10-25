import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  User,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Check,
  MapPin,
  Clock,
  Lightbulb,
  X,
} from "lucide-react";
import {
  saveCommunityProfile,
  saveCommunityDraft,
  getCommunityDraft,
  clearCommunityDraft,
  EXPERTISE_CATEGORIES,
} from "../data/communityMockData";
import CommunityProfilePreview from "./CommunityProfilePreview";

// Neutral dignified spiritual avatar placeholder (replaces generic hardcoded stock photos)
const DEFAULT_NEUTRAL_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='28' fill='%23faebd7'/%3E%3Ccircle cx='60' cy='46' r='20' fill='%23a94f0a' fill-opacity='0.85'/%3E%3Cpath d='M28 98c0-16 14-28 32-28s32 12 32 28v4H28v-4z' fill='%23a94f0a' fill-opacity='0.85'/%3E%3Ccircle cx='60' cy='46' r='5' fill='%23d9a441'/%3E%3C/svg%3E";

const STEPS = [
  { id: 1, title: "Basic Information", subtitle: "Name, Portrait & Bio", icon: User },
  { id: 2, title: "Professional Identity", subtitle: "Traditions & Vidhis", icon: Sparkles },
  { id: 3, title: "Credentials & Links", subtitle: "Gurukul & Channels", icon: Award },
  { id: 4, title: "Preview & Publish", subtitle: "Review & Submission", icon: Eye },
];

const DEFAULT_FORM_DATA = {
  fullName: "",
  displayName: "",
  headline: "",
  bio: "",
  city: "Varanasi",
  state: "Uttar Pradesh",
  country: "India",
  languages: "Sanskrit, Hindi",
  avatar: "",
  coverImage: "",

  professionalType: "Pandit",
  yearsOfExperience: 10,
  expertise: ["Vedic Karmakand", "Maha Rudrabhishek"],
  education: "",
  lineage: "",
  specializations: "Shukla Yajurveda, Assi Ghat Parampara",
  availabilityMode: "both",
  serviceLocations: "Varanasi, Prayagraj, Worldwide Live Broadcast",
  services: [
    {
      name: "Maha Rudrabhishek with Vedic Pandits",
      type: "Sacred Fire Ritual",
      mode: "In-Person & Online Live",
      duration: "3 Hours",
      description: "Authentic Rudri Path, panchamrit abhishekam, and samidha ahutis as per shastra vidhi.",
    },
  ],

  certificateName: "Acharya in Shukla Yajurveda",
  issuingInstitution: "Sampurnanand Sanskrit Vishwavidyalaya",
  credentialFileName: "",
  websiteUrl: "",
  linkedInUrl: "",
  youtubeUrl: "",
  instagramUrl: "",
};

const CommunityProfileForm = ({ initialData = null, isEditing = false }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [showSubmissionSuccessModal, setShowSubmissionSuccessModal] = useState(false);
  const [submittedSlug, setSubmittedSlug] = useState("");

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      const mapped = { ...DEFAULT_FORM_DATA, ...initialData };
      if (Array.isArray(mapped.languages)) {
        mapped.languages = mapped.languages.join(", ");
      }
      if (Array.isArray(mapped.specializations)) {
        mapped.specializations = mapped.specializations.join(", ");
      }
      if (Array.isArray(mapped.serviceLocations)) {
        mapped.serviceLocations = mapped.serviceLocations.join(", ");
      }
      if (mapped.socialLinks) {
        mapped.websiteUrl = mapped.websiteUrl || mapped.socialLinks.website || "";
        mapped.linkedInUrl = mapped.linkedInUrl || mapped.socialLinks.linkedin || "";
        mapped.youtubeUrl = mapped.youtubeUrl || mapped.socialLinks.youtube || "";
        mapped.instagramUrl = mapped.instagramUrl || mapped.socialLinks.instagram || "";
      }
      return mapped;
    }
    const savedDraft = getCommunityDraft();
    return savedDraft ? { ...DEFAULT_FORM_DATA, ...savedDraft } : DEFAULT_FORM_DATA;
  });

  // Autosave draft locally whenever formData changes (only if creating fresh)
  useEffect(() => {
    if (!isEditing) {
      saveCommunityDraft(formData);
    }
  }, [formData, isEditing]);

  // Real Progress Calculation based on active wizard step & required fields
  const calculatedProgress = useMemo(() => {
    let completedStepsCount = currentStep - 1;
    let requiredFieldsCount = 0;
    let requiredFieldsFilled = 0;

    // Required fields in Step 1
    requiredFieldsCount += 5;
    if (formData.fullName?.trim()) requiredFieldsFilled++;
    if (formData.displayName?.trim()) requiredFieldsFilled++;
    if (formData.headline?.trim()) requiredFieldsFilled++;
    if (formData.bio?.trim() && formData.bio.length >= 20) requiredFieldsFilled++;
    if (formData.city?.trim()) requiredFieldsFilled++;

    // Required fields in Step 2
    requiredFieldsCount += 2;
    if (formData.yearsOfExperience !== undefined && formData.yearsOfExperience >= 0) requiredFieldsFilled++;
    if (formData.expertise?.length > 0) requiredFieldsFilled++;

    // Base percentage from step + proportion of filled fields
    const stepBase = (completedStepsCount / 4) * 100;
    const fieldsProportion = (requiredFieldsFilled / requiredFieldsCount) * 25;
    return Math.min(Math.round(stepBase + fieldsProportion), 100);
  }, [currentStep, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Image Upload handler (Simulated with local base64/dataURL preview)
  const handlePhotoUpload = (e, fieldName = "avatar") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image exceeds 5MB size limit. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCredentialUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File exceeds 10MB limit.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        credentialFileName: file.name,
      }));
    }
  };

  // Expertise toggle
  const toggleExpertise = (item) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.expertise) ? prev.expertise : [];
      if (current.includes(item)) {
        return { ...prev, expertise: current.filter((x) => x !== item) };
      } else {
        return { ...prev, expertise: [...current, item] };
      }
    });
    if (errors.expertise) {
      setErrors((prev) => ({ ...prev, expertise: null }));
    }
  };

  // Services management
  const handleAddService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...(prev.services || []),
        {
          name: "",
          type: "Vedic Ritual",
          mode: "Online & In-Person",
          duration: "2 Hours",
          description: "",
        },
      ],
    }));
  };

  const handleUpdateService = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.services || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, services: updated };
    });
  };

  const handleRemoveService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: (prev.services || []).filter((_, i) => i !== index),
    }));
  };

  // Validation
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName?.trim()) newErrors.fullName = "Full legal name is required";
      if (!formData.displayName?.trim())
        newErrors.displayName = "Professional display name is required";
      if (!formData.headline?.trim()) newErrors.headline = "Professional headline is required";
      if (!formData.city?.trim()) newErrors.city = "Sacred city/location is required";
      if (!formData.bio?.trim() || formData.bio.length < 20) {
        newErrors.bio = "Please write at least 20 characters introducing your spiritual lineage";
      }
    }

    if (step === 2) {
      if (formData.yearsOfExperience === undefined || formData.yearsOfExperience < 0)
        newErrors.yearsOfExperience = "Years of experience cannot be negative";
      if (!formData.expertise || formData.expertise.length === 0) {
        newErrors.expertise = "Please select at least one area of expertise";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 80, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  const handleSaveDraft = () => {
    saveCommunityDraft(formData);
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      alert("Please ensure all required fields in steps 1 and 2 are filled.");
      setCurrentStep(!validateStep(1) ? 1 : 2);
      return;
    }

    const dataToSave = {
      ...formData,
      ...(isEditing && initialData?.id ? { id: initialData.id } : {}),
      ...(isEditing && initialData?.slug ? { slug: initialData.slug } : {}),
      ...(isEditing && initialData?.status ? { status: initialData.status } : {}),
    };

    const saved = saveCommunityProfile(dataToSave);
    clearCommunityDraft();

    if (saved) {
      setSubmittedSlug(saved.slug);
      setShowSubmissionSuccessModal(true);
    }
  };

  // Concise contextual tips for the current step
  const currentTips = useMemo(() => {
    switch (currentStep) {
      case 1:
        return {
          title: "Crafting Your Sacred Presentation",
          tips: [
            "Use traditional titles honoring your lineage (Acharya, Pandit, Jyotishi).",
            "A portrait in traditional attire communicates reverence and authenticity.",
            "In your biography, highlight your guru parampara and sacred traditions.",
          ],
        };
      case 2:
        return {
          title: "Defining Rituals & Consultations",
          tips: [
            "Devotees seek specific vidhis such as Maha Rudrabhishek or Navagraha Japa.",
            "Clarify if you conduct rituals in-person, travel, or perform online live sankalpas.",
            "Specific expertise tags help seekers discover your profile in the directory.",
          ],
        };
      case 3:
        return {
          title: "Credentials & Transparency",
          tips: [
            "Upload Gurukul or Sanskrit Vishwavidyalaya credentials for demonstration.",
            "Official links to your YouTube channel or website increase devotee confidence.",
            "Credentials will be verified by the Sanatana Advisory Council in future phases.",
          ],
        };
      case 4:
      default:
        return {
          title: "Final Directory Review",
          tips: [
            "Verify all details as they will appear in the directory card and profile detail.",
            "Click 'Edit' on any section to return and refine your information before saving.",
            "Submissions are saved locally to your demo session for instant inspection.",
          ],
        };
    }
  }, [currentStep]);

  return (
    <div className="relative">
      {/* Toast Notification for Draft Save */}
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#231a12] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#d9a441]/50 text-xs sm:text-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Draft profile saved to browser storage!</span>
        </div>
      )}

      {/* Redesigned Compact Stepper Header */}
      <div className="mb-7">
        {/* Desktop Horizontal Stepper */}
        <div className="hidden md:flex items-center justify-between bg-white rounded-2xl border border-[#ebdcc2] p-3.5 shadow-2xs">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex-1 flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (step.id < currentStep || validateStep(currentStep)) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer group ${
                    isCurrent
                      ? "bg-[#fff5e5] border border-[#d9a441]/50"
                      : "hover:bg-[#fffcf7]"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                      isCompleted
                        ? "bg-[#a94f0a] text-white shadow-2xs"
                        : isCurrent
                        ? "bg-[#a94f0a] text-white shadow-sm ring-2 ring-[#a94f0a]/30"
                        : "bg-[#fff5e5] text-[#7a6452] border border-[#ebdcc2]"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : `0${step.id}`}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#a94f0a] block">
                      Step 0{step.id}
                    </span>
                    <span
                      className={`text-xs font-bold truncate block ${
                        isCurrent ? "text-[#382516]" : "text-[#7a6452]"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </button>

                {idx < STEPS.length - 1 && (
                  <div className="w-8 h-0.5 bg-[#ebdcc2] mx-2 shrink-0 hidden lg:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Compact Current-Step Bar */}
        <div className="md:hidden bg-white rounded-xl border border-[#ebdcc2] p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold text-[#a94f0a] uppercase tracking-wider block">
                STEP 0{currentStep} OF 04
              </span>
              <span className="text-xs font-bold text-[#382516]">
                {STEPS[currentStep - 1].title}
              </span>
            </div>
            <span className="text-xs font-bold text-[#a94f0a]">{calculatedProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#faeed8] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#a94f0a] to-[#d9a441] transition-all duration-300 rounded-full"
              style={{ width: `${calculatedProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two-Column Form Layout (Left: Form ~68%, Right: Live Preview Card ~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Current Step Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 md:p-9 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* ================= STEP 1: BASIC INFORMATION ================= */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#f0e4cf]">
                  <h2 className="font-serif text-2xl font-bold text-[#382516]">
                    Basic Information & Heritage
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6b5542] mt-1">
                    Introduce your personal identity, lineage, and sacred city to seekers.
                  </p>
                </div>

                {/* Group A: Your Portrait */}
                <div className="p-5 rounded-2xl bg-[#fffdfa] border border-[#ebdcc2] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#382516]">
                        Group A: Your Portrait & Banner
                      </h3>
                      <p className="text-[11px] text-[#7a6452] mt-0.5">
                        Authentic portrait in traditional attire (Kurta/Dhoti/Saffron). PNG or JPG, max 5MB.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                    <div className="relative group shrink-0">
                      <img
                        src={formData.avatar || DEFAULT_NEUTRAL_AVATAR}
                        alt="Portrait Avatar"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#d9a441] shadow-2xs bg-stone-50"
                      />
                      <label
                        htmlFor="avatar-file-upload"
                        className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white"
                        title="Change Photo"
                      >
                        <Upload className="w-5 h-5" />
                      </label>
                      <input
                        id="avatar-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "avatar")}
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <label
                          htmlFor="avatar-file-upload-btn"
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fff5e5] hover:bg-[#faebd7] border border-[#d6be9a] text-xs font-semibold text-[#a94f0a] transition shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{formData.avatar ? "Change Photo" : "Upload Profile Photo"}</span>
                        </label>
                        <input
                          id="avatar-file-upload-btn"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoUpload(e, "avatar")}
                          className="hidden"
                        />

                        {formData.avatar && (
                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, avatar: "" }))}
                            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-800 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8a725e] mt-2">
                        {formData.avatar
                          ? "Custom photo uploaded successfully."
                          : "A neutral dignified avatar placeholder is active until you upload a portrait."}
                      </p>
                    </div>
                  </div>

                  {/* Optional Cover Banner */}
                  <div className="pt-3 border-t border-[#f5ebd9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-[#382516]">
                        Cover Banner Image (Optional)
                      </span>
                      <p className="text-[11px] text-[#7a6452]">
                        Background depicting temples or holy rivers. Default banner applied if left blank.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="cover-file-upload-btn"
                        className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#ebdcc2] hover:bg-[#fff5e5] text-xs font-semibold text-[#5c4736] transition"
                      >
                        <Upload className="w-3 h-3 text-[#a94f0a]" />
                        <span>{formData.coverImage ? "Change Banner" : "Select Banner"}</span>
                      </label>
                      <input
                        id="cover-file-upload-btn"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, "coverImage")}
                        className="hidden"
                      />
                      {formData.coverImage && (
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, coverImage: "" }))}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Group B: Your Name */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#382516]">
                    Group B: Name & Traditional Title
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Legal Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#382516] mb-1.5">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Rameshwar Dattatreya Shastri"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a] transition ${
                          errors.fullName ? "border-red-500" : "border-[#ebdcc2]"
                        }`}
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Professional Display Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#382516] mb-1.5">
                        Professional Display Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="e.g. Acharya Rameshwar Shastri"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a] transition ${
                          errors.displayName ? "border-red-500" : "border-[#ebdcc2]"
                        }`}
                      />
                      {errors.displayName && (
                        <p className="text-xs text-red-500 mt-1">{errors.displayName}</p>
                      )}
                    </div>
                  </div>

                  {/* Professional Headline */}
                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1">
                      Professional Headline / Traditional Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      placeholder="Acharya specializing in Jyotish and traditional Vedic studies"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a] transition ${
                        errors.headline ? "border-red-500" : "border-[#ebdcc2]"
                      }`}
                    />
                    <p className="text-[11px] text-[#7a6452] mt-1">
                      Example: Acharya specializing in Jyotish and traditional Vedic studies
                    </p>
                    {errors.headline && <p className="text-xs text-red-500 mt-1">{errors.headline}</p>}
                  </div>
                </div>

                {/* Group C: Your Story */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#382516]">
                      Group C: Your Story & Lineage <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#7a6452]">
                      {formData.bio?.length || 0} characters (min 20)
                    </span>
                  </div>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Share your guru parampara, traditional training, sacred traditions, and the guidance you offer to seekers."
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a] transition leading-relaxed ${
                      errors.bio ? "border-red-500" : "border-[#ebdcc2]"
                    }`}
                  />
                  {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
                </div>

                {/* Group D: Your Location and Languages */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#382516]">
                    Group D: Sacred Location & Languages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#382516] mb-1.5">
                        Sacred City / Kshetra <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Varanasi (Kashi)"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a] ${
                          errors.city ? "border-red-500" : "border-[#ebdcc2]"
                        }`}
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#382516] mb-1.5">
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Uttar Pradesh"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#382516] mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="India"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#382516] mb-1.5">
                        Languages Spoken (comma separated)
                      </label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleChange}
                        placeholder="Sanskrit, Hindi, English"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: PROFESSIONAL IDENTITY ================= */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#f0e4cf]">
                  <h2 className="font-serif text-2xl font-bold text-[#382516]">
                    Professional Identity & Vidhis
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6b5542] mt-1">
                    Detail your spiritual discipline, areas of expertise, and rituals offered to devotees.
                  </p>
                </div>

                {/* Role Category Selector Cards */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#382516] mb-2.5">
                    Professional Role Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "Pandit", label: "Pandit / Acharya", desc: "Karmakand, Puja, Yagya & Sanskar rituals" },
                      { id: "Astrologer", label: "Vedic Astrologer", desc: "Kundli analysis, KP Jyotish & Prashna" },
                      { id: "Both", label: "Both (Pandit & Jyotishi)", desc: "Dual practice in ritual fire & astrology" },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, professionalType: role.id }))}
                        className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          formData.professionalType === role.id
                            ? "border-[#a94f0a] bg-[#fff5e5] ring-2 ring-[#a94f0a]/30 shadow-2xs"
                            : "border-[#ebdcc2] bg-[#fffdfa] hover:bg-[#fff5e5]/50"
                        }`}
                      >
                        <p className="font-bold text-sm text-[#382516]">{role.label}</p>
                        <p className="text-xs text-[#7a6452] mt-1 leading-snug">{role.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Years of Experience & Lineage (2-column) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Years of Active Practice <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="80"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    />
                    {errors.yearsOfExperience && (
                      <p className="text-xs text-red-500 mt-1">{errors.yearsOfExperience}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Spiritual Lineage / Guru Parampara
                    </label>
                    <input
                      type="text"
                      name="lineage"
                      value={formData.lineage}
                      onChange={handleChange}
                      placeholder="e.g. 5th Generation Kashi Assi Ghat Scholar"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    />
                  </div>
                </div>

                {/* Education and Specializations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Traditional Education / Gurukul
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Acharya in Shukla Yajurveda"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Specializations (comma separated)
                    </label>
                    <input
                      type="text"
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleChange}
                      placeholder="Rudri Path, Vivah Sanskar, Griha Pravesh"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    />
                  </div>
                </div>

                {/* Areas of Expertise Selection Chips */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#382516]">
                      Areas of Expertise (Select all that apply) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-[#a94f0a] font-semibold">
                      {(formData.expertise || []).length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-[#fffdfa] border border-[#ebdcc2]">
                    {EXPERTISE_CATEGORIES.filter((c) => c !== "All").map((cat) => {
                      const isSelected = (formData.expertise || []).includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleExpertise(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#a94f0a] text-white shadow-2xs"
                              : "bg-white text-[#523d2d] hover:bg-[#fff5e5] border border-[#ebdcc2]"
                          }`}
                        >
                          {isSelected && <span className="mr-1">✓</span>}
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {errors.expertise && (
                    <p className="text-xs text-red-500 mt-1">{errors.expertise}</p>
                  )}
                </div>

                {/* Consultation Availability Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Consultation Availability Mode
                    </label>
                    <select
                      name="availabilityMode"
                      value={formData.availabilityMode}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    >
                      <option value="both">Both Online Video & In-Person</option>
                      <option value="online">Online Video Consultations Only</option>
                      <option value="in_person">In-Person at Temple Kshetra Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Service Travel Locations
                    </label>
                    <input
                      type="text"
                      name="serviceLocations"
                      value={formData.serviceLocations}
                      onChange={handleChange}
                      placeholder="Varanasi, Prayagraj, Worldwide Live"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    />
                  </div>
                </div>

                {/* Dynamic Services / Rituals Section */}
                <div className="pt-4 border-t border-[#f0e4cf]">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#382516]">
                        Specific Rituals & Consultations
                      </h3>
                      <p className="text-xs text-[#7a6452]">
                        List specific pujas, yagyas, or reading packages devotees can request.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fff5e5] border border-[#d6be9a] text-xs font-bold text-[#a94f0a] hover:bg-[#faebd7] transition shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Ritual</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.services || []).map((srv, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#fffdfa] border border-[#ebdcc2] relative space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#a94f0a]">
                            Ritual #{idx + 1}
                          </span>
                          {(formData.services || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveService(idx)}
                              className="text-stone-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                              title="Remove Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => handleUpdateService(idx, "name", e.target.value)}
                          placeholder="Ritual Name (e.g. Maha Rudrabhishek with 11 Pandits)"
                          className="w-full px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs font-semibold text-[#382516] bg-white focus:outline-none focus:ring-1 focus:ring-[#a94f0a]"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={srv.type}
                            onChange={(e) => handleUpdateService(idx, "type", e.target.value)}
                            placeholder="Type (e.g. Vedic Fire Ritual)"
                            className="px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs text-[#382516] bg-white"
                          />
                          <input
                            type="text"
                            value={srv.duration}
                            onChange={(e) => handleUpdateService(idx, "duration", e.target.value)}
                            placeholder="Duration (e.g. 3 Hours)"
                            className="px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs text-[#382516] bg-white"
                          />
                        </div>

                        <input
                          type="text"
                          value={srv.description}
                          onChange={(e) => handleUpdateService(idx, "description", e.target.value)}
                          placeholder="Brief description of samidha, mantras, and benefits..."
                          className="w-full px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs text-[#382516] bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 3: CREDENTIALS & LINKS ================= */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#f0e4cf]">
                  <h2 className="font-serif text-2xl font-bold text-[#382516]">
                    Credentials & Web Presence
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6b5542] mt-1">
                    Upload degrees and share your public professional media channels.
                  </p>
                </div>

                {/* Credential Details (2-column) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Qualification or Certificate Name
                    </label>
                    <input
                      type="text"
                      name="certificateName"
                      value={formData.certificateName}
                      onChange={handleChange}
                      placeholder="e.g. Acharya / Jyotish Praveena"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#382516] mb-1.5">
                      Issuing Gurukul / University / Board
                    </label>
                    <input
                      type="text"
                      name="issuingInstitution"
                      value={formData.issuingInstitution}
                      onChange={handleChange}
                      placeholder="e.g. Sampurnanand Sanskrit Vishwavidyalaya"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                    />
                  </div>
                </div>

                {/* Credential File Upload Simulation Dropzone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#382516] mb-1.5">
                    Upload Certificate Document (PDF/JPG Simulation)
                  </label>
                  <div className="border-2 border-dashed border-[#d6be9a] rounded-2xl p-6 text-center bg-[#fffdfa] hover:bg-[#fff9ef] transition cursor-pointer relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleCredentialUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <FileText className="w-8 h-8 text-[#a94f0a] mb-2" />
                      <p className="text-xs sm:text-sm font-bold text-[#382516]">
                        {formData.credentialFileName
                          ? `Selected: ${formData.credentialFileName}`
                          : "Click to select certificate file or drag & drop"}
                      </p>
                      <p className="text-[11px] text-[#7a6452] mt-1">
                        PDF, JPG, or PNG up to 10MB (Stored locally for demonstration preview)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Links in 2-column Grid */}
                <div className="pt-4 border-t border-[#f0e4cf] space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#382516]">
                    Professional Channels & Media (Optional)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#6e5947] mb-1">
                        Website URL
                      </label>
                      <input
                        type="url"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        placeholder="https://acharya-example.org"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6e5947] mb-1">
                        YouTube Channel
                      </label>
                      <input
                        type="url"
                        name="youtubeUrl"
                        value={formData.youtubeUrl}
                        onChange={handleChange}
                        placeholder="https://youtube.com/@vedic_karmakand"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6e5947] mb-1">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedInUrl"
                        value={formData.linkedInUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/acharya-profile"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6e5947] mb-1">
                        Instagram Profile
                      </label>
                      <input
                        type="url"
                        name="instagramUrl"
                        value={formData.instagramUrl}
                        onChange={handleChange}
                        placeholder="https://instagram.com/vedic_acharya"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#382516] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#a94f0a]/20 focus:border-[#a94f0a]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 4: PREVIEW & PUBLISH ================= */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#f0e4cf]">
                  <h2 className="font-serif text-2xl font-bold text-[#382516]">
                    Inspect Your Profile & Publish
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6b5542] mt-1">
                    Review your professional representation before saving to your local demonstration session.
                  </p>
                </div>

                <CommunityProfilePreview
                  formData={formData}
                  onEditStep={(stepNum) => setCurrentStep(stepNum)}
                />

                <div className="p-4 rounded-xl bg-[#fff8ed] border border-[#e8d2b2] text-xs text-[#634827]">
                  <p className="font-bold text-[#4f371a] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#a94f0a]" />
                    <span>Submission Confirmation Notice</span>
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Clicking <strong>&quot;Create My Profile&quot;</strong> persists your profile into your browser session with a <em>Pending Review</em> status. Devotees and scholars will be able to discover your profile in the Community Directory and post interactions.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="mt-8 pt-6 border-t border-[#ebdcc2] flex flex-col sm:flex-row items-center justify-between gap-3.5">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#d6be9a] text-xs sm:text-sm font-semibold text-[#523d2d] bg-[#fffdfa] hover:bg-[#fff5e5] transition w-full sm:w-auto cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#fffdfa] border border-[#d6be9a] text-xs sm:text-sm font-semibold text-[#7a4010] hover:bg-[#faeed8] transition w-full sm:w-auto shadow-2xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#a94f0a]/20 transition cursor-pointer"
                  >
                    <span>Continue to Step 0{currentStep + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#a94f0a]/20 transition transform active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isEditing ? "Update Profile" : "Create My Profile"}</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Identity Preview (~32% Width) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          {/* Live Profile Identity Card */}
          <div className="bg-white rounded-2xl border border-[#ebdcc2] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#f0e4cf]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a94f0a] block">
                  Your Profile Preview
                </span>
                <span className="text-[10px] text-[#7a6452]">
                  Live directory representation
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Sync Active" />
            </div>

            {/* Identity Card Contents */}
            <div className="flex items-start gap-3">
              <img
                src={formData.avatar || DEFAULT_NEUTRAL_AVATAR}
                alt="Live Preview"
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#d9a441] bg-stone-50 shrink-0 shadow-2xs"
              />
              <div className="min-w-0 flex-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#fff5e5] text-[#a94f0a] border border-[#ebdcc2]">
                  {formData.professionalType}
                </span>
                <h4 className="font-serif text-sm font-bold text-[#382516] truncate mt-1">
                  {formData.displayName || formData.fullName || "Your Professional Name"}
                </h4>
                <p className="text-[11px] text-[#7a6452] line-clamp-2 leading-snug">
                  {formData.headline || "Your traditional Vedic title & specialization"}
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#f5ebd9] grid grid-cols-2 gap-2 text-[11px] text-[#6b5542]">
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#a94f0a] shrink-0" />
                <span className="truncate">{formData.city || "Sacred City"}</span>
              </span>
              <span className="flex items-center gap-1 truncate">
                <Clock className="w-3 h-3 text-[#a94f0a] shrink-0" />
                <span>{formData.yearsOfExperience || 0}+ Yrs Experience</span>
              </span>
            </div>

            {/* Areas of Expertise chips */}
            {formData.expertise && formData.expertise.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-[#f5ebd9]">
                <div className="flex flex-wrap gap-1">
                  {formData.expertise.slice(0, 3).map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#fff5e5] text-[#7a4010] border border-[#ebdcc2]"
                    >
                      {exp}
                    </span>
                  ))}
                  {formData.expertise.length > 3 && (
                    <span className="text-[10px] text-[#7a6452] self-center">
                      +{formData.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <p className="text-[10px] text-[#8a725e] italic mt-3 pt-2 border-t border-[#f5ebd9] text-center">
              This is how your professional identity may appear in the directory.
            </p>
          </div>

          {/* Contextual Step Guidance Card */}
          <div className="bg-[#fffdfa] rounded-2xl border border-[#ebdcc2] p-5 shadow-2xs">
            <div className="flex items-center gap-2 mb-2.5">
              <Lightbulb className="w-4 h-4 text-[#d9a441]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#382516]">
                {currentTips.title}
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-[#6e5845] leading-relaxed">
              {currentTips.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a94f0a] mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal Upon Successful Submission */}
      {showSubmissionSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#ebdcc2] p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#382516]">
              {isEditing ? "Profile Updated!" : "Profile Created Successfully!"}
            </h3>

            <p className="text-xs sm:text-sm text-[#665342] leading-relaxed">
              Your profile is now active in your local browser demonstration session with a <strong>&quot;Pending Review&quot;</strong> badge. Devotees can view your offerings in the Community Directory.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigate(`/community/profile/${submittedSlug}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#a94f0a] hover:bg-[#8f4208] text-white font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer"
              >
                View My Profile Detail
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/community?view=directory")}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#fff5e5] hover:bg-[#faeed8] text-[#7a4010] border border-[#d6be9a] font-semibold text-xs transition cursor-pointer"
                >
                  Browse Directory
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/community?view=feed")}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#fffdfa] hover:bg-[#faebd7] text-[#7a4010] border border-[#ebdcc2] font-semibold text-xs transition cursor-pointer"
                >
                  Community Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityProfileForm;
