import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import astrologerAdminService, {
  AdminAstrologer,
  UpdateAstrologerInput,
  AstrologerPillar,
  AstrologerFaq,
} from "@/services/astrologerAdminService";
import { uploadImage } from "@/services/mediaUploadService";

export default function AstrologerForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "basic" | "media" | "bio" | "pillars" | "faqs" | "slots"
  >("basic");

  // Form states
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [holySeat, setHolySeat] = useState("Vedic Tradition");
  const [location, setLocation] = useState("India");
  const [experienceYears, setExperienceYears] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [rating, setRating] = useState(4.9);
  const [reviewsCount, setReviewsCount] = useState("0+");
  const [sessionsCount, setSessionsCount] = useState("0+");

  // Media
  const [profileImage, setProfileImage] = useState("");
  const [portraitImage, setPortraitImage] = useState("");
  const [secondaryImage, setSecondaryImage] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Lists & Arrays
  const [languagesStr, setLanguagesStr] = useState("");
  const [specializationsStr, setSpecializationsStr] = useState("");
  const [expertiseStr, setExpertiseStr] = useState("");

  // Bio & Editorial
  const [quote, setQuote] = useState("");
  const [description, setDescription] = useState("");
  const [bioParagraphs, setBioParagraphs] = useState<string[]>([]);

  // Pillars & FAQs
  const [pillars, setPillars] = useState<AstrologerPillar[]>([]);
  const [faqs, setFaqs] = useState<AstrologerFaq[]>([]);

  // Availability & Add-Ons
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [addOnCouple, setAddOnCouple] = useState(3100);
  const [addOnReport, setAddOnReport] = useState(500);
  const [addOnExpress, setAddOnExpress] = useState(400);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await astrologerAdminService.getAstrologerById(id);
        if (res && res.data) {
          const a = res.data;
          setName(a.name || "");
          setTitle(a.title || "");
          setCode(a.code || "");
          setSlug(a.slug || "");
          setEyebrow(a.eyebrow || "");
          setHolySeat(a.holySeat || "Vedic Tradition");
          setLocation(a.location || "India");
          setExperienceYears(a.experienceYears || 0);
          setDisplayOrder(a.displayOrder || 1);
          setIsActive(a.isActive !== false);
          setRating(Number(a.rating) || 5.0);
          setReviewsCount(a.reviewsCount || "0+");
          setSessionsCount(a.sessionsCount || "0+");

          setProfileImage(a.profileImage || "");
          setPortraitImage(a.portraitImage || "");
          setSecondaryImage(a.secondaryImage || "");

          setLanguagesStr((a.languages || []).join(", "));
          setSpecializationsStr((a.specializations || []).join(", "));
          setExpertiseStr((a.expertise || []).join(", "));

          setQuote(a.quote || "");
          setDescription(a.description || "");
          setBioParagraphs(a.bioParagraphs || []);

          setPillars(a.pillars || []);
          setFaqs(a.faqs || []);
          setAvailableTimeSlots(a.availableTimeSlots || []);

          if (a.addOnPricing) {
            setAddOnCouple(a.addOnPricing.addOnCouple ?? 3100);
            setAddOnReport(a.addOnPricing.addOnReport ?? 500);
            setAddOnExpress(a.addOnPricing.addOnExpress ?? 400);
          }
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load astrologer details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Image upload handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "profile" | "portrait" | "secondary"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    try {
      const res = await uploadImage(file);
      if (res && res.url) {
        if (field === "profile") setProfileImage(res.url);
        if (field === "portrait") setPortraitImage(res.url);
        if (field === "secondary") setSecondaryImage(res.url);
        toast.success("Image uploaded successfully.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Image upload failed.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: UpdateAstrologerInput = {
        name: name.trim(),
        title: title.trim(),
        code: code.trim() || undefined,
        slug: slug.trim() || undefined,
        eyebrow: eyebrow.trim() || null,
        holySeat: holySeat.trim() || "Vedic Tradition",
        location: location.trim() || "India",
        experienceYears: Number(experienceYears) || 0,
        displayOrder: Number(displayOrder) || 1,
        isActive,
        rating: Number(rating) || 5.0,
        reviewsCount: reviewsCount.trim() || "0+",
        sessionsCount: sessionsCount.trim() || "0+",
        profileImage: profileImage.trim() || null,
        portraitImage: portraitImage.trim() || null,
        secondaryImage: secondaryImage.trim() || null,
        quote: quote.trim() || null,
        description: description.trim() || null,
        languages: languagesStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        specializations: specializationsStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        expertise: expertiseStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        bioParagraphs: bioParagraphs.filter((p) => p.trim().length > 0),
        pillars: pillars.filter((p) => p.title.trim() || p.desc.trim()),
        faqs: faqs.filter((f) => f.q.trim() || f.a.trim()),
        availableTimeSlots: availableTimeSlots.filter((s) => s.trim().length > 0),
        addOnPricing: {
          addOnCouple: Number(addOnCouple) || 0,
          addOnReport: Number(addOnReport) || 0,
          addOnExpress: Number(addOnExpress) || 0,
        },
      };

      if (isEdit) {
        await astrologerAdminService.updateAstrologer(id!, payload);
        toast.success("Astrologer profile updated successfully.");
        navigate(`/admin/astrologers/${id}`);
      } else {
        const createPayload = {
          ...payload,
          name: name.trim(),
          title: title.trim(),
        };
        const res = await astrologerAdminService.createAstrologer(createPayload);
        toast.success("Astrologer profile created successfully.");
        if (res?.data?.id) {
          navigate(`/admin/astrologers/${res.data.id}`);
        } else {
          navigate("/admin/astrologers");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to save astrologer profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-charcoal-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-saffron-600" />
        <p className="text-sm">Loading astrologer profile...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link
          to={isEdit ? `/admin/astrologers/${id}` : "/admin/astrologers"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-600 hover:text-saffron-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEdit ? "Back to Profile" : "Back to Astrologers"}</span>
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-saffron-500 text-white hover:bg-saffron-600 shadow-sm transition cursor-pointer disabled:opacity-60"
        >
          {submitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>
            {submitting
              ? isEdit
                ? "Saving Changes..."
                : "Creating Profile..."
              : isEdit
              ? "Save Changes"
              : "Create Astrologer"}
          </span>
        </button>
      </div>

      <PageHeader
        title={isEdit ? `Edit Profile: ${name || "Astrologer"}` : "Create New Astrologer"}
        description={
          isEdit
            ? "Update profile details, credentials, media assets, and consultation availability."
            : "Add a new verified astrologer profile to the Veda Structure platform."
        }
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-cream-200 gap-2 overflow-x-auto">
        {[
          { key: "basic", label: "Basic Info & Credentials" },
          { key: "media", label: "Media & Photos" },
          { key: "bio", label: "Bio & Narrative" },
          { key: "pillars", label: "Core Pillars" },
          { key: "faqs", label: "FAQs" },
          { key: "slots", label: "Slots & Add-On Pricing" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === tab.key
                ? "border-saffron-500 text-saffron-700 font-semibold"
                : "border-transparent text-charcoal-500 hover:text-charcoal-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC INFO */}
      {activeTab === "basic" && (
        <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!isEdit && !slug) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "")
                    );
                  }
                }}
                required
                placeholder="e.g. Acharya Dev Sharma"
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Professional Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Senior Vedic Astrologer & Kundali Specialist"
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                URL Slug {isEdit ? "(Unique)" : "(Optional - Auto-generated from name)"}
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. acharya-dev-sharma"
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Astrologer Code {isEdit ? "(Unique Identifier)" : "(Optional - Auto-generated)"}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ast-dev-sharma"
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Holy Seat (पीठ)
              </label>
              <input
                type="text"
                value={holySeat}
                onChange={(e) => setHolySeat(e.target.value)}
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Rating (0.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Reviews Count Text
              </label>
              <input
                type="text"
                value={reviewsCount}
                onChange={(e) => setReviewsCount(e.target.value)}
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-3 border-t border-cream-100">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Languages (comma separated)
              </label>
              <input
                type="text"
                value={languagesStr}
                onChange={(e) => setLanguagesStr(e.target.value)}
                placeholder="e.g. Hindi, Sanskrit, English"
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Core Expertise (comma separated)
              </label>
              <input
                type="text"
                value={expertiseStr}
                onChange={(e) => setExpertiseStr(e.target.value)}
                placeholder="e.g. Vedic Astrology, Kundali Analysis, Life Guidance"
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                Specializations (comma separated)
              </label>
              <input
                type="text"
                value={specializationsStr}
                onChange={(e) => setSpecializationsStr(e.target.value)}
                placeholder="e.g. Career & Job, Business & Finance, Marriage & Relationship"
                className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-cream-100 flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-charcoal-800">
                Active / Published Status
              </span>
              <span className="text-xs text-charcoal-500">
                Control whether this astrologer appears on the public website.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? "bg-green-600" : "bg-charcoal-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA & PHOTOS */}
      {activeTab === "media" && (
        <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-6">
          {/* Profile Image */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-charcoal-800">
              Primary Profile Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-xl object-cover border border-cream-200 shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="Paste URL or upload below..."
                  className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-lg cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingField === "profile" ? "Uploading..." : "Upload New Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "profile")}
                    disabled={uploadingField !== null}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Portrait Image */}
          <div className="space-y-3 pt-4 border-t border-cream-100">
            <label className="block text-sm font-semibold text-charcoal-800">
              Portrait Image (Landing Page Hero)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {portraitImage ? (
                <img
                  src={portraitImage}
                  alt="Portrait"
                  className="w-20 h-20 rounded-xl object-cover border border-cream-200 shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={portraitImage}
                  onChange={(e) => setPortraitImage(e.target.value)}
                  placeholder="Paste URL or upload below..."
                  className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-lg cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingField === "portrait" ? "Uploading..." : "Upload New Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "portrait")}
                    disabled={uploadingField !== null}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Secondary Image */}
          <div className="space-y-3 pt-4 border-t border-cream-100">
            <label className="block text-sm font-semibold text-charcoal-800">
              Secondary / In-Session Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {secondaryImage ? (
                <img
                  src={secondaryImage}
                  alt="Secondary"
                  className="w-20 h-20 rounded-xl object-cover border border-cream-200 shadow-xs"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-cream-100 flex items-center justify-center text-charcoal-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="flex-1 space-y-2 w-full">
                <input
                  type="text"
                  value={secondaryImage}
                  onChange={(e) => setSecondaryImage(e.target.value)}
                  placeholder="Paste URL or upload below..."
                  className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-charcoal-700 bg-cream-100 hover:bg-cream-200 rounded-lg cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingField === "secondary" ? "Uploading..." : "Upload New Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "secondary")}
                    disabled={uploadingField !== null}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BIO & NARRATIVE */}
      {activeTab === "bio" && (
        <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Guiding Quote
            </label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. Understand Your Kundali. Find Clarity in Life."
              className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Short Description / Introduction
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>

          <div className="space-y-3 pt-3 border-t border-cream-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-charcoal-700 uppercase">
                Detailed Biography Paragraphs
              </label>
              <button
                type="button"
                onClick={() => setBioParagraphs([...bioParagraphs, ""])}
                className="flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Paragraph</span>
              </button>
            </div>

            {bioParagraphs.map((p, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <textarea
                  rows={2}
                  value={p}
                  onChange={(e) => {
                    const next = [...bioParagraphs];
                    next[idx] = e.target.value;
                    setBioParagraphs(next);
                  }}
                  className="flex-1 px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setBioParagraphs(bioParagraphs.filter((_, i) => i !== idx))
                  }
                  className="p-2 text-charcoal-400 hover:text-red-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CORE PILLARS */}
      {activeTab === "pillars" && (
        <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-charcoal-800">
                Core Consultation Pillars
              </h3>
              <p className="text-xs text-charcoal-500">
                Key foundational promises or methodologies highlighted on the landing page.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPillars([...pillars, { title: "", desc: "" }])}
              className="flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pillar</span>
            </button>
          </div>

          <div className="space-y-3">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-cream-200 bg-cream-50/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const next = [...pillars];
                      next[idx] = { ...next[idx], title: e.target.value };
                      setPillars(next);
                    }}
                    placeholder="Pillar Title (e.g. Fear-Free Guidance)"
                    className="flex-1 mr-3 px-3 py-1.5 border border-cream-300 rounded-lg text-sm font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPillars(pillars.filter((_, i) => i !== idx))}
                    className="p-1.5 text-charcoal-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={pillar.desc}
                  onChange={(e) => {
                    const next = [...pillars];
                    next[idx] = { ...next[idx], desc: e.target.value };
                    setPillars(next);
                  }}
                  placeholder="Pillar Description"
                  className="w-full px-3 py-1.5 border border-cream-300 rounded-lg text-xs text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FAQS */}
      {activeTab === "faqs" && (
        <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-charcoal-800">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-charcoal-500">
                Answers to common client questions about the consultation process.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
              className="flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-cream-200 bg-cream-50/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={faq.q}
                    onChange={(e) => {
                      const next = [...faqs];
                      next[idx] = { ...next[idx], q: e.target.value };
                      setFaqs(next);
                    }}
                    placeholder="Question (e.g. What details do I need to provide?)"
                    className="flex-1 mr-3 px-3 py-1.5 border border-cream-300 rounded-lg text-sm font-semibold text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                    className="p-1.5 text-charcoal-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={faq.a}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[idx] = { ...next[idx], a: e.target.value };
                    setFaqs(next);
                  }}
                  placeholder="Answer"
                  className="w-full px-3 py-1.5 border border-cream-300 rounded-lg text-xs text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SLOTS & ADD-ON PRICING */}
      {activeTab === "slots" && (
        <div className="space-y-6">
          {/* Time Slots */}
          <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-charcoal-800">
                  Daily Consultation Slots
                </h3>
                <p className="text-xs text-charcoal-500">
                  Standard time windows presented to clients when booking an appointment.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAvailableTimeSlots([
                    ...availableTimeSlots,
                    "09:00 AM - 09:30 AM",
                  ])
                }
                className="flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time Slot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableTimeSlots.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => {
                      const next = [...availableTimeSlots];
                      next[idx] = e.target.value;
                      setAvailableTimeSlots(next);
                    }}
                    placeholder="e.g. 10:00 AM - 10:30 AM"
                    className="flex-1 px-3 py-1.5 border border-cream-300 rounded-lg text-xs text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setAvailableTimeSlots(
                        availableTimeSlots.filter((_, i) => i !== idx)
                      )
                    }
                    className="p-1.5 text-charcoal-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add-On Pricing */}
          <div className="bg-white p-6 rounded-xl border border-cream-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-charcoal-800">
                Consultation Add-On Rates
              </h3>
              <p className="text-xs text-charcoal-500">
                Additional fees applied when customers select optional upgrades during booking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Couple Consultation (+₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={addOnCouple}
                  onChange={(e) => setAddOnCouple(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Written Kundali Report (+₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={addOnReport}
                  onChange={(e) => setAddOnReport(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
                  Express / Priority Slot (+₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={addOnExpress}
                  onChange={(e) => setAddOnExpress(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-cream-300 rounded-lg text-sm text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
        <Link
          to={isEdit ? `/admin/astrologers/${id}` : "/admin/astrologers"}
          className="px-4 py-2 text-sm font-medium text-charcoal-600 hover:text-charcoal-800 transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg bg-saffron-500 text-white hover:bg-saffron-600 shadow-sm transition cursor-pointer disabled:opacity-60"
        >
          {submitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>
            {submitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
              ? "Save Changes"
              : "Create Astrologer"}
          </span>
        </button>
      </div>
    </form>
  );
}
