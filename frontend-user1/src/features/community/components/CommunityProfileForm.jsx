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
  Info,
  Check,
  ShieldCheck,
  Clock,
  MapPin,
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

const STEPS = [
  { id: 1, title: "Basic Information", subtitle: "Name, Portrait & Bio", icon: User },
  { id: 2, title: "Professional Identity", subtitle: "Expertise, Lineage & Vidhis", icon: Sparkles },
  { id: 3, title: "Credentials & Links", subtitle: "Certifications & Channels", icon: Award },
  { id: 4, title: "Preview & Submit", subtitle: "Directory Inspection", icon: Eye },
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

  // Autosave draft locally whenever formData changes (only if not editing existing)
  useEffect(() => {
    if (!isEditing) {
      saveCommunityDraft(formData);
    }
  }, [formData, isEditing]);

  // Profile Completeness Calculation
  const completenessScore = useMemo(() => {
    let score = 0;
    if (formData.fullName?.trim()) score += 10;
    if (formData.displayName?.trim()) score += 10;
    if (formData.headline?.trim()) score += 15;
    if (formData.bio?.trim() && formData.bio.length >= 20) score += 15;
    if (formData.city?.trim()) score += 10;
    if (formData.avatar) score += 10;
    if (formData.expertise?.length > 0) score += 15;
    if (formData.services?.length > 0 && formData.services[0].name?.trim()) score += 10;
    if (formData.certificateName?.trim() || formData.education?.trim()) score += 5;
    return Math.min(score, 100);
  }, [formData]);

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
      if (!formData.fullName.trim()) newErrors.fullName = "Full legal name is required";
      if (!formData.displayName.trim())
        newErrors.displayName = "Professional display name is required";
      if (!formData.headline.trim()) newErrors.headline = "Professional headline is required";
      if (!formData.city.trim()) newErrors.city = "Sacred city/location is required";
      if (!formData.bio.trim() || formData.bio.length < 20) {
        newErrors.bio = "Please write at least 20 characters introducing your spiritual lineage & vidhis";
      }
    }

    if (step === 2) {
      if (formData.yearsOfExperience < 0)
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
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
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

  // Dynamic context tips for right sidebar
  const getStepTips = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Crafting Your Sacred Presentation",
          tips: [
            "Use traditional titles honoring your lineage (Acharya, Pandit, Jyotishi).",
            "A portrait in traditional attire (Kurta/Dhoti/Saffron) communicates reverence and authenticity.",
            "In your biography, highlight your guru parampara, family traditions, and temples served.",
          ],
        };
      case 2:
        return {
          title: "Defining Rituals & Consultations",
          tips: [
            "Devotees seek specific vidhis such as Maha Rudrabhishek, Kaal Sarp Shanti, or Navagraha Japa.",
            "Clarify if you conduct rituals in-person, travel, or perform online live sankalpas.",
            "Multiple expertise tags help seekers discover you easily in the directory.",
          ],
        };
      case 3:
        return {
          title: "Credentials & Transparency",
          tips: [
            "Upload Gurukul or Sanskrit Vishwavidyalaya degrees for demonstration.",
            "Official links to your YouTube channel or website increase devotee confidence.",
            "Credentials will be verified by the Sanatana Advisory Council in future phases.",
          ],
        };
      case 4:
      default:
        return {
          title: "Final Directory Review",
          tips: [
            "Verify all details as they will appear to devotees in the directory card and full profile page.",
            "You can return to any step using the 'Previous' button before saving.",
            "Submissions are preserved in your local session for instant demonstration.",
          ],
        };
    }
  };

  const currentTips = getStepTips();

  return (
    <div className="relative">
      {/* Toast Notification for Draft Save */}
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#2b190c] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#d4af37]/50 text-xs sm:text-sm animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Draft profile autosaved to browser storage!</span>
        </div>
      )}

      {/* Redesigned Stepper Header */}
      <div className="mb-8">
        {/* Desktop Stepper */}
        <div className="hidden md:flex items-center justify-between relative bg-white rounded-2xl border border-[#ebdcc2] p-4 shadow-2xs">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-[#ebdcc2] -translate-y-1/2 z-0" />
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (step.id < currentStep || validateStep(currentStep)) {
                    setCurrentStep(step.id);
                  }
                }}
                className="relative z-10 flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl cursor-pointer group text-left"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#9b4e10] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#fff8ed] text-[#9b4e10] border-2 border-[#9b4e10] ring-4 ring-[#faeed8] shadow-sm"
                      : "bg-[#fcf8f0] text-[#8a725e] border border-[#ebdcc2]"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a0520d] block">
                    Step 0{step.id}
                  </span>
                  <span
                    className={`text-xs font-bold block ${
                      isCurrent ? "text-[#2b241d]" : "text-[#7a6452]"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Compact Progress Bar */}
        <div className="md:hidden bg-white rounded-xl border border-[#ebdcc2] p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#a0520d] uppercase tracking-wider">
              Step {currentStep} of 4: {STEPS[currentStep - 1].title}
            </span>
            <span className="text-xs font-semibold text-[#2b241d]">{completenessScore}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#faeed8] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9b4e10] to-[#c2782b] transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Desktop 2-Column Grid Layout: Main Form (Left 68%) vs Contextual Sidebar (Right 32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical Single-Column Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#ebdcc2] p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_rgba(43,36,29,0.05)]">
          <form onSubmit={handleSubmit}>
            {/* ================= STEP 1: BASIC INFORMATION ================= */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#f0e4cf]">
                  <h2 className="font-serif text-2xl font-bold text-[#2b241d]">
                    Step 1: Personal & Basic Information
                  </h2>
                  <p className="text-xs sm:text-sm text-[#735e4d] mt-1">
                    Present your authentic identity and background to seekers looking for guidance.
                  </p>
                </div>

                {/* Profile Photo Upload Dropzone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-2">
                    Profile Photograph <span className="text-red-500">*</span>
                  </label>

                  <div className="p-5 rounded-2xl bg-[#fffdfa] border-2 border-dashed border-[#dfcdb5] hover:border-[#b35d14] transition-all flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative group shrink-0">
                      <img
                        src={
                          formData.avatar ||
                          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                        }
                        alt="Profile Avatar Preview"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-[#d4af37] shadow-sm bg-white"
                      />
                      <label
                        htmlFor="avatar-file-upload"
                        className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition text-white"
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
                      <h4 className="text-sm font-bold text-[#2b241d]">Upload Portrait Photograph</h4>
                      <p className="text-xs text-[#7d6857] mt-0.5 leading-relaxed">
                        Serene portrait in traditional attire (Kurta/Dhoti/Saffron). PNG, JPG, max 5MB.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                        <label
                          htmlFor="avatar-file-upload-btn"
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faeed8] hover:bg-[#f7dfb0] border border-[#d6be9a] text-xs font-semibold text-[#8a4e17] shadow-2xs transition"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose New Photo</span>
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
                            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Legal Name - Single Column */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rameshwar Dattatreya Shastri"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#2b241d] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/30 focus:border-[#b35d14] ${
                      errors.fullName ? "border-red-500" : "border-[#ebdcc2]"
                    }`}
                  />
                  <p className="text-[11px] text-[#8a725e] mt-1">
                    Your formal birth name as listed on personal identity records.
                  </p>
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* Professional Display Name - Single Column */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Professional Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="e.g. Acharya Rameshwar Shastri"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#2b241d] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/30 focus:border-[#b35d14] ${
                      errors.displayName ? "border-red-500" : "border-[#ebdcc2]"
                    }`}
                  />
                  <p className="text-[11px] text-[#8a725e] mt-1">
                    This is the primary name devotees will see across search results and directory cards.
                  </p>
                  {errors.displayName && (
                    <p className="text-xs text-red-500 mt-1">{errors.displayName}</p>
                  )}
                </div>

                {/* Professional Headline - Single Column */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Professional Headline / Traditional Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g. Shukla Yajurveda Parayan Acharya & Karmakand Specialist from Kashi"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#2b241d] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/30 focus:border-[#b35d14] ${
                      errors.headline ? "border-red-500" : "border-[#ebdcc2]"
                    }`}
                  />
                  <p className="text-[11px] text-[#8a725e] mt-1">
                    A concise title explaining your sampradaya, samhita, or core astrological discipline.
                  </p>
                  {errors.headline && <p className="text-xs text-red-500 mt-1">{errors.headline}</p>}
                </div>

                {/* Biography - Single Column */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    About & Spiritual Heritage (Biography) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Describe your lineage, traditional initiation, guru parampara, sacred pilgrimage sites served, and primary rituals conducted..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#2b241d] bg-[#fffdfa] focus:outline-none focus:ring-2 focus:ring-[#b35d14]/30 focus:border-[#b35d14] ${
                      errors.bio ? "border-red-500" : "border-[#ebdcc2]"
                    }`}
                  />
                  <div className="flex justify-between items-center text-[11px] text-[#8a725e] mt-1">
                    <span>Minimum 20 characters recommended.</span>
                    <span>{formData.bio?.length || 0} characters</span>
                  </div>
                  {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
                </div>

                {/* Location: City, State, Country - Single Column Rows */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                      Sacred City / Headquarters <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Varanasi (Kashi)"
                      className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="e.g. Uttar Pradesh"
                      className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                      className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                    />
                  </div>
                </div>

                {/* Languages Spoken - Single Column */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Languages Spoken (comma separated)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={
                      Array.isArray(formData.languages)
                        ? formData.languages.join(", ")
                        : (formData.languages || "")
                    }
                    onChange={handleChange}
                    placeholder="Sanskrit, Hindi, English, Gujarati"
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                  <p className="text-[11px] text-[#8a725e] mt-1">
                    Include liturgical and regional spoken languages.
                  </p>
                </div>
              </div>
            )}

            {/* ================= STEP 2: PROFESSIONAL IDENTITY ================= */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#f0e4cf]">
                  <h2 className="font-serif text-2xl font-bold text-[#2b241d]">
                    Step 2: Professional Identity & Vidhis
                  </h2>
                  <p className="text-xs sm:text-sm text-[#735e4d] mt-1">
                    Detail your spiritual discipline, areas of expertise, and rituals offered to devotees.
                  </p>
                </div>

                {/* Professional Role Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-2.5">
                    Professional Category
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
                        className={`p-4 rounded-xl text-left border transition-all ${
                          formData.professionalType === role.id
                            ? "border-[#9b4e10] bg-[#fff8ed] ring-2 ring-[#c2782b]/30 shadow-xs"
                            : "border-[#ebdcc2] bg-[#fffdfa] hover:bg-[#faebd7]/30"
                        }`}
                      >
                        <p className="font-bold text-sm text-[#2b241d]">{role.label}</p>
                        <p className="text-xs text-[#7d6857] mt-1 leading-snug">{role.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Years of Active Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                  {errors.yearsOfExperience && (
                    <p className="text-xs text-red-500 mt-1">{errors.yearsOfExperience}</p>
                  )}
                </div>

                {/* Spiritual Lineage */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Spiritual Lineage / Guru Parampara
                  </label>
                  <input
                    type="text"
                    name="lineage"
                    value={formData.lineage}
                    onChange={handleChange}
                    placeholder="e.g. 5th Generation Kashi Assi Ghat Vedic Scholar Lineage"
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                </div>

                {/* Education and Traditional Training */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Education & Traditional Training
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g. Acharya in Shukla Yajurveda, Sampurnanand Sanskrit Vishwavidyalaya"
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                </div>

                {/* Specializations & Shastric Rigor */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Specializations & Shastric Focus (comma separated)
                  </label>
                  <input
                    type="text"
                    name="specializations"
                    value={
                      Array.isArray(formData.specializations)
                        ? formData.specializations.join(", ")
                        : (formData.specializations || "")
                    }
                    onChange={handleChange}
                    placeholder="e.g. Shukla Yajurveda, Assi Ghat Parampara, Rudri Path, Vivah Sanskar"
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                  <p className="text-[11px] text-[#8a725e] mt-1">
                    Specific shastric texts, paramparas, or ritual disciplines you specialize in.
                  </p>
                </div>

                {/* Areas of Expertise Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#574332]">
                      Areas of Expertise (Select all that apply) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-[#8a4e17] font-semibold">
                      {(formData.expertise || []).length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-[#fffdfa] border border-[#f0e4cf]">
                    {EXPERTISE_CATEGORIES.filter((c) => c !== "All").map((cat) => {
                      const isSelected = (formData.expertise || []).includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleExpertise(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-[#9b4e10] text-white shadow-2xs"
                              : "bg-white text-[#523d2d] hover:bg-[#faebd7] border border-[#ebdcc2]"
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

                {/* Consultation Availability */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Consultation Availability Mode
                  </label>
                  <select
                    name="availabilityMode"
                    value={formData.availabilityMode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  >
                    <option value="both">Both Online Video & In-Person at Temple/Home</option>
                    <option value="online">Online Video Consultations Only</option>
                    <option value="in_person">In-Person at Temple Kshetra Only</option>
                  </select>
                </div>

                {/* Service Locations */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Service Travel Locations
                  </label>
                  <input
                    type="text"
                    name="serviceLocations"
                    value={formData.serviceLocations}
                    onChange={handleChange}
                    placeholder="Varanasi, Prayagraj, Ayodhya, Delhi NCR, Worldwide Live Stream"
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                </div>

                {/* Dynamic Services Section */}
                <div className="pt-4 border-t border-[#f0e4cf]">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2b241d]">
                        Specific Rituals & Consultations Offered
                      </h3>
                      <p className="text-xs text-[#735e4d]">
                        Add ritual vidhis or reading packages that devotees can request from you.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#fff8ed] border border-[#d6be9a] text-xs font-bold text-[#9b4e10] hover:bg-[#faebd7] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Ritual</span>
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {(formData.services || []).map((srv, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#fffdfa] border border-[#ebdcc2] relative space-y-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8a4e17]">Ritual #{idx + 1}</span>
                          {(formData.services || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveService(idx)}
                              className="text-stone-400 hover:text-red-600 p-1 rounded transition"
                              title="Remove Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            value={srv.name}
                            onChange={(e) => handleUpdateService(idx, "name", e.target.value)}
                            placeholder="Ritual Name (e.g. Maha Rudrabhishek with 11 Pandits)"
                            className="w-full px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs font-semibold text-[#2b241d]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={srv.type}
                            onChange={(e) => handleUpdateService(idx, "type", e.target.value)}
                            placeholder="Type (e.g. Vedic Fire Ritual)"
                            className="px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs text-[#2b241d]"
                          />
                          <input
                            type="text"
                            value={srv.duration}
                            onChange={(e) => handleUpdateService(idx, "duration", e.target.value)}
                            placeholder="Duration (e.g. 3.5 Hours)"
                            className="px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs text-[#2b241d]"
                          />
                        </div>

                        <input
                          type="text"
                          value={srv.description}
                          onChange={(e) => handleUpdateService(idx, "description", e.target.value)}
                          placeholder="Brief description of samidha, mantras, benefits, and sankalpa..."
                          className="w-full px-3.5 py-2 rounded-lg border border-[#ebdcc2] text-xs text-[#2b241d]"
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
                  <h2 className="font-serif text-2xl font-bold text-[#2b241d]">
                    Step 3: Credentials, Certifications & Web Presence
                  </h2>
                  <p className="text-xs sm:text-sm text-[#735e4d] mt-1">
                    Upload degrees and share your public professional media channels.
                  </p>
                </div>

                {/* Future Verification Disclaimer Box */}
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-[#614522] flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-[#543b1c]">
                      Notice Regarding Credential Verification
                    </p>
                    <p className="text-[#694e2e] mt-0.5 leading-relaxed text-xs">
                      Credentials submitted here are stored for demonstration purposes. In future phases, verified badges will be awarded after thorough administrative review of gurukul certificates, university degrees, and identity verification. No actual server documents are uploaded in this frontend preview.
                    </p>
                  </div>
                </div>

                {/* Certificate Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Qualification or Certificate Name
                  </label>
                  <input
                    type="text"
                    name="certificateName"
                    value={formData.certificateName}
                    onChange={handleChange}
                    placeholder="e.g. Acharya / Jyotish Praveena / Shastri"
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                </div>

                {/* Issuing Institution */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
                    Issuing Institution / Gurukul / Board
                  </label>
                  <input
                    type="text"
                    name="issuingInstitution"
                    value={formData.issuingInstitution}
                    onChange={handleChange}
                    placeholder="e.g. Sampurnanand Sanskrit Vishwavidyalaya, Varanasi"
                    className="w-full px-4 py-3 rounded-xl border border-[#ebdcc2] text-sm text-[#2b241d] bg-[#fffdfa]"
                  />
                </div>

                {/* Credential File Upload Dropzone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#574332] mb-1.5">
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
                      <FileText className="w-8 h-8 text-[#a0520d] mb-2" />
                      <p className="text-xs sm:text-sm font-bold text-[#2b241d]">
                        {formData.credentialFileName
                          ? `Selected: ${formData.credentialFileName}`
                          : "Click to select certificate file or drag & drop"}
                      </p>
                      <p className="text-[11px] text-[#856e5c] mt-1">
                        PDF, JPG, or PNG up to 10MB (Local preview demonstration)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Links */}
                <div className="pt-4 border-t border-[#f0e4cf] space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#2b241d]">
                    Professional Channels & Media
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#6e5947] mb-1">
                      Professional Website
                    </label>
                    <input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://acharya-example.org"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#2b241d] bg-[#fffdfa]"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#2b241d] bg-[#fffdfa]"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#2b241d] bg-[#fffdfa]"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdcc2] text-xs sm:text-sm text-[#2b241d] bg-[#fffdfa]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 4: PREVIEW & SUBMIT ================= */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#f0e4cf]">
                  <h2 className="font-serif text-2xl font-bold text-[#2b241d]">
                    Step 4: Inspect Your Profile & Submit
                  </h2>
                  <p className="text-xs sm:text-sm text-[#735e4d] mt-1">
                    Review your professional representation before saving to your local demonstration session.
                  </p>
                </div>

                <CommunityProfilePreview formData={formData} />

                <div className="p-4 rounded-xl bg-[#fff8ed] border border-[#e8d2b2] text-xs text-[#634827]">
                  <p className="font-bold text-[#4f371a] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#a0520d]" />
                    Frontend Demonstration Notice
                  </p>
                  <p className="mt-1 leading-relaxed">
                    This phase is frontend-only. Clicking &quot;Submit for Review&quot; will persist your profile locally in your browser so you can preview it immediately within the directory and detail page. No external network request or actual admin review takes place.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="mt-8 pt-6 border-t border-[#ebdcc2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#d6be9a] text-xs sm:text-sm font-semibold text-[#523d2d] hover:bg-stone-50 transition w-full sm:w-auto justify-center"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#fffdfa] border border-[#d6be9a] text-xs sm:text-sm font-semibold text-[#7a4010] hover:bg-[#faeed8] transition w-full sm:w-auto justify-center shadow-2xs"
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
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9b4e10] to-[#b86116] hover:from-[#853f09] hover:to-[#a0520d] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#9b4e10]/20 transition"
                  >
                    <span>Continue to Step 0{currentStep + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9b4e10] to-[#b86116] hover:from-[#853f09] hover:to-[#a0520d] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#9b4e10]/20 transition transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isEditing ? "Update Profile (Local)" : "Submit for Review (Demo)"}</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Contextual Side Panel (~32% Width) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Progress & Completeness Card */}
          <div className="bg-white rounded-3xl border border-[#ebdcc2] p-5 sm:p-6 shadow-[0_4px_20px_rgba(43,36,29,0.05)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#a0520d]">
                Profile Completeness
              </span>
              <span className="text-sm font-bold text-[#2b241d]">{completenessScore}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#faeed8] overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-[#9b4e10] via-[#c2782b] to-[#d4af37] transition-all duration-500 rounded-full"
                style={{ width: `${completenessScore}%` }}
              />
            </div>
            <p className="text-[11px] text-[#7d6857] leading-relaxed">
              Profiles with complete photographs, traditional training, and ritual descriptions receive 3x higher consultation requests.
            </p>
          </div>

          {/* Dynamic Step Tips Card */}
          <div className="bg-gradient-to-br from-[#fffdfa] to-[#fbf6ed] rounded-3xl border border-[#ebdcc2] p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-[#b35d14]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5c3e21]">
                {currentTips.title}
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-[#6e5845] leading-relaxed">
              {currentTips.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b35d14] mt-1.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Real-time Mini Profile Summary Card */}
          <div className="bg-white rounded-3xl border border-[#ebdcc2] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#f0e4cf]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8a4e17]">
                Live Preview Snippet
              </span>
              <span className="text-[10px] text-stone-500 font-medium">Updates Live</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={
                  formData.avatar ||
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                }
                alt="Mini Preview"
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#d4af37]"
              />
              <div className="min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#faeed8] text-[#8a4e17]">
                  {formData.professionalType}
                </span>
                <h5 className="font-serif text-sm font-bold text-[#2b241d] truncate mt-1">
                  {formData.displayName || formData.fullName || "Your Name"}
                </h5>
                <p className="text-[11px] text-[#735e4d] truncate">
                  {formData.headline || "Your Vedic title"}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#f5ebd9] flex items-center justify-between text-[11px] text-[#8a725e]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#b35d14]" />
                {formData.city || "Sacred City"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#b35d14]" />
                {formData.yearsOfExperience || 0}+ Yrs
              </span>
            </div>
          </div>

          {/* Sanatana Advisory Verification Notice */}
          <div className="p-4 rounded-2xl bg-[#fdfaf5] border border-[#ebdcc2] text-xs text-[#705844] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#453324]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sanatana Council Standards</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Veda Structure operates on strictly verified authentic shastric rituals. Profiles submitted here are tagged as demo until official review.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal upon Successful Submission */}
      {showSubmissionSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#ebdcc2] p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2b241d]">
              {isEditing ? "Profile Updated Successfully!" : "Profile Submitted for Review!"}
            </h3>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left">
              <p className="font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Mock Demonstration Status:
              </p>
              <p className="mt-1 text-amber-800 leading-relaxed">
                {isEditing ? (
                  <>Your profile changes have been saved to your local browser session. Your profile remains listed in the Community Directory with its review status preserved.</>
                ) : (
                  <>Your profile is now saved locally with a <strong>&quot;Pending Review&quot;</strong> badge. You can view its live public representation or check the Community Directory.</>
                )}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#665342]">
              In the live system, the Veda Structure spiritual advisory committee verifies credentials before publishing.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => navigate(`/community/profile/${submittedSlug}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#9b4e10] hover:bg-[#853f09] text-white font-semibold text-xs sm:text-sm shadow-xs transition"
              >
                {isEditing ? "View Updated Profile" : "View Profile Detail"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/community")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#fffdfa] hover:bg-[#faebd7] text-[#7a4010] border border-[#ebdcc2] font-semibold text-xs sm:text-sm transition"
              >
                Back to Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityProfileForm;
