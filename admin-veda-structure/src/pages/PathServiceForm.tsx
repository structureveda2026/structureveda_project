import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Clock,
  Users,
  Sparkles,
  Scroll,
  BookOpen,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Calendar,
  Layers,
  HelpCircle,
  Shield,
  Tag,
  Package,
  Gift,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import mediaUploadService, { UploadedImage } from "@/services/mediaUploadService";
import pathServiceCatalogueService, {
  PathPurpose,
  PathServicePayload,
  PATH_FORMAT_LABELS,
  PathFormatType,
} from "@/services/pathServiceCatalogueService";

const slugify = (str: string): string =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

interface FormErrors {
  name?: string;
  slug?: string;
  scripture?: string;
  startingPrice?: string;
  availableFormats?: string;
  days?: string;
  coupling?: string;
  pandits?: string;
  locations?: string;
}

interface FormState {
  name: string;
  slug: string;
  pathType: string;
  scripture: string;
  shortDescription: string;
  description: string;
  purposeId: string;
  purposeSummary: string;
  purposeCategory: string;
  purposeCategories: string[];
  availableFormats: PathFormatType[];
  availableDurations: string[];
  chapterStructure: string;
  totalChapters: string;
  totalSections: string;
  totalVerses: string;
  estimatedRecitationHours: string;
  dailyRecitationTarget: string;
  dailyHours: string;
  dailyRecitationCapacity: string;
  minimumDays: string;
  recommendedDays: string;
  maximumDays: string;
  minimumPandits: string;
  recommendedPandits: string;
  maximumPandits: string;
  requiredSkills: string;
  startingPrice: string;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  availableLocations: string[];
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string;
  galleryImages: string[];
  samagri: { name: string; status: string }[];
  prasad: string;
  sankalpaFields: {
    name: boolean;
    gotra: boolean;
    nakshatra: boolean;
    rashi: boolean;
    familyMembers: boolean;
    specialSankalpa: boolean;
    specialInstructions: boolean;
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  faqs: { question: string; answer: string }[];
}

const DEFAULT_FORMATS: PathFormatType[] = ["single_session", "same_day"];
const DEFAULT_DURATIONS = ["3 to 4 Hours", "Same-Day Extended (Morning & Evening)"];

export default function PathServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [purposes, setPurposes] = useState<PathPurpose[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Input for adding new duration tags
  const [newDurationInput, setNewDurationInput] = useState("");

  // Media upload states
  const [bannerUploading, setBannerUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    pathType: "Vedic Path",
    scripture: "",
    shortDescription: "",
    description: "",
    purposeId: "",
    purposeSummary: "",
    purposeCategory: "",
    purposeCategories: [],
    availableFormats: DEFAULT_FORMATS,
    availableDurations: DEFAULT_DURATIONS,
    chapterStructure: "",
    totalChapters: "",
    totalSections: "",
    totalVerses: "",
    estimatedRecitationHours: "3.5",
    dailyRecitationTarget: "Complete Chapter / Path per session",
    dailyHours: "3 – 4 Hours Daily",
    dailyRecitationCapacity: "Complete Text / Session",
    minimumDays: "1",
    recommendedDays: "1",
    maximumDays: "1",
    minimumPandits: "2",
    recommendedPandits: "2",
    maximumPandits: "5",
    requiredSkills: "Traditional Vedic Acharyas & Reciters",
    startingPrice: "",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    isFeatured: false,
    isActive: true,
    bannerImage: "",
    galleryImages: [],
    samagri: [],
    prasad: "",
    sankalpaFields: {
      name: true,
      gotra: true,
      nakshatra: true,
      rashi: true,
      familyMembers: true,
      specialSankalpa: true,
      specialInstructions: true,
    },
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    faqs: [{ question: "", answer: "" }],
  });

  // Load Purposes
  useEffect(() => {
    let isMounted = true;
    const fetchPurposes = async () => {
      try {
        const data = await pathServiceCatalogueService.getPathPurposes();
        if (isMounted) setPurposes(data);
      } catch (err) {
        console.warn("Could not load Path purposes:", err);
      }
    };
    fetchPurposes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load Service for Edit
  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    pathServiceCatalogueService
      .getPathService(id)
      .then((data) => {
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          pathType: data.pathType || "Vedic Path",
          scripture: data.scripture || "",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          purposeId: data.purposeId || "",
          purposeSummary: data.purposeSummary || "",
          purposeCategory: data.purposeCategory || "",
          purposeCategories: Array.isArray(data.purposeCategories) ? data.purposeCategories : [],
          availableFormats: (Array.isArray(data.availableFormats) && data.availableFormats.length > 0
            ? data.availableFormats
            : DEFAULT_FORMATS) as PathFormatType[],
          availableDurations: Array.isArray(data.availableDurations) ? data.availableDurations : [],
          chapterStructure: data.chapterStructure || "",
          totalChapters: data.totalChapters != null ? String(data.totalChapters) : "",
          totalSections: data.totalSections != null ? String(data.totalSections) : "",
          totalVerses: data.totalVerses != null ? String(data.totalVerses) : "",
          estimatedRecitationHours:
            data.estimatedRecitationHours != null ? String(data.estimatedRecitationHours) : "",
          dailyRecitationTarget: data.dailyRecitationTarget || "",
          dailyHours: data.dailyHours || "3 – 4 Hours Daily",
          dailyRecitationCapacity: data.dailyRecitationCapacity || "",
          minimumDays: String(data.minimumDays || 1),
          recommendedDays: String(data.recommendedDays || 1),
          maximumDays: String(data.maximumDays || 1),
          minimumPandits: String(data.minimumPandits || 2),
          recommendedPandits: String(data.recommendedPandits || 2),
          maximumPandits: String(data.maximumPandits || 5),
          requiredSkills: data.requiredSkills || "",
          startingPrice: data.startingPrice != null ? String(data.startingPrice) : "",
          isKashiAvailable: Boolean(data.isKashiAvailable),
          isRemoteAvailable: Boolean(data.isRemoteAvailable),
          availableLocations: Array.isArray(data.availableLocations)
            ? data.availableLocations
            : ["kashi", "remote"],
          isFeatured: Boolean(data.isFeatured),
          isActive: Boolean(data.isActive),
          bannerImage: data.bannerImage || "",
          galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
          samagri: Array.isArray(data.samagri)
            ? data.samagri.map((s) =>
                typeof s === "string" ? { name: s, status: "included" } : { name: s.name || "", status: s.status || "included" }
              )
            : [],
          prasad: data.prasad || "",
          sankalpaFields: {
            name: data.sankalpaFields?.name !== false,
            gotra: data.sankalpaFields?.gotra !== false,
            nakshatra: data.sankalpaFields?.nakshatra !== false,
            rashi: data.sankalpaFields?.rashi !== false,
            familyMembers: data.sankalpaFields?.familyMembers !== false,
            specialSankalpa: data.sankalpaFields?.specialSankalpa !== false,
            specialInstructions: data.sankalpaFields?.specialInstructions !== false,
          },
          seoTitle: data.seo?.title || "",
          seoDescription: data.seo?.description || "",
          seoKeywords: Array.isArray(data.seo?.keywords)
            ? data.seo.keywords.join(", ")
            : data.seo?.keywords || "",
          faqs:
            Array.isArray(data.faqs) && data.faqs.length > 0
              ? data.faqs
              : [{ question: "", answer: "" }],
        });
        setSlugManuallyEdited(true);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Unable to load Path service.";
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, isEdit, toast]);

  // Name & Slug synchronization
  const handleNameChange = (val: string) => {
    setForm((p) => ({
      ...p,
      name: val,
      slug: slugManuallyEdited ? p.slug : slugify(val),
    }));
    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setForm((p) => ({ ...p, slug: slugify(val) }));
    if (errors.slug) setErrors((p) => ({ ...p, slug: undefined }));
  };

  // Purpose Selection
  const handlePurposeChange = (purposeIdVal: string) => {
    const matched = purposes.find((p) => p.id === purposeIdVal);
    setForm((prev) => {
      const newCategories = matched
        ? prev.purposeCategories.includes(matched.slug)
          ? prev.purposeCategories
          : [...prev.purposeCategories, matched.slug]
        : prev.purposeCategories;

      return {
        ...prev,
        purposeId: purposeIdVal,
        purposeCategory: matched ? matched.slug : prev.purposeCategory,
        purposeSummary:
          prev.purposeSummary || (matched?.description ? matched.description : matched?.name || ""),
        purposeCategories: newCategories,
      };
    });
  };

  // Category Toggle
  const handleToggleCategory = (catSlug: string) => {
    setForm((prev) => {
      const exists = prev.purposeCategories.includes(catSlug);
      const nextCategories = exists
        ? prev.purposeCategories.filter((c) => c !== catSlug)
        : [...prev.purposeCategories, catSlug];
      return {
        ...prev,
        purposeCategories: nextCategories,
      };
    });
  };

  // Recitation Formats Toggle & Single Session Coupling Enforcement
  const handleToggleFormat = (formatKey: PathFormatType) => {
    setForm((prev) => {
      const exists = prev.availableFormats.includes(formatKey);
      let nextFormats: PathFormatType[];
      if (exists) {
        if (prev.availableFormats.length <= 1) {
          toast.error("At least one recitation format is required.");
          return prev;
        }
        nextFormats = prev.availableFormats.filter((f) => f !== formatKey);
      } else {
        nextFormats = [...prev.availableFormats, formatKey];
      }

      // Check coupling rule: if only single_session or same_day, maximumDays must be 1
      const isOnlySingleOrSameDay =
        nextFormats.length > 0 &&
        nextFormats.every((f) => f === "single_session" || f === "same_day");

      let updatedMaxDays = prev.maximumDays;
      let updatedRecDays = prev.recommendedDays;
      let updatedMinDays = prev.minimumDays;

      if (isOnlySingleOrSameDay && Number(prev.maximumDays) > 1) {
        updatedMaxDays = "1";
        if (Number(prev.recommendedDays) > 1) updatedRecDays = "1";
        if (Number(prev.minimumDays) > 1) updatedMinDays = "1";
        toast.info("Single-session / Same-day recitations have been coupled to 1 maximum day.");
      }

      return {
        ...prev,
        availableFormats: nextFormats,
        minimumDays: updatedMinDays,
        recommendedDays: updatedRecDays,
        maximumDays: updatedMaxDays,
      };
    });
    if (errors.availableFormats || errors.coupling) {
      setErrors((p) => ({ ...p, availableFormats: undefined, coupling: undefined }));
    }
  };

  // Available Durations
  const handleAddDuration = () => {
    const val = newDurationInput.trim();
    if (!val) return;
    if (form.availableDurations.includes(val)) {
      toast.info(`Duration '${val}' is already present.`);
      return;
    }
    setForm((p) => ({ ...p, availableDurations: [...p.availableDurations, val] }));
    setNewDurationInput("");
  };

  const handleRemoveDuration = (dur: string) => {
    setForm((p) => ({
      ...p,
      availableDurations: p.availableDurations.filter((d) => d !== dur),
    }));
  };

  // Samagri Array
  const handleAddSamagri = () => {
    setForm((p) => ({
      ...p,
      samagri: [...p.samagri, { name: "", status: "included" }],
    }));
  };

  const handleUpdateSamagri = (index: number, field: "name" | "status", value: string) => {
    setForm((p) => {
      const next = [...p.samagri];
      next[index] = { ...next[index], [field]: value };
      return { ...p, samagri: next };
    });
  };

  const handleRemoveSamagri = (index: number) => {
    setForm((p) => ({
      ...p,
      samagri: p.samagri.filter((_, i) => i !== index),
    }));
  };

  // FAQs Array
  const handleAddFaq = () => {
    setForm((p) => ({
      ...p,
      faqs: [...p.faqs, { question: "", answer: "" }],
    }));
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", val: string) => {
    setForm((p) => {
      const next = [...p.faqs];
      next[index] = { ...next[index], [field]: val };
      return { ...p, faqs: next };
    });
  };

  const handleRemoveFaq = (index: number) => {
    setForm((p) => ({
      ...p,
      faqs: p.faqs.filter((_, i) => i !== index),
    }));
  };

  // Media Upload Handlers
  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const uploaded = await mediaUploadService.uploadImage(file, {
        folder: "veda-structure/path-services/banners",
      });
      setForm((p) => ({ ...p, bannerImage: uploaded.url }));
      toast.success("Banner image uploaded successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload banner.";
      toast.error(msg);
    } finally {
      setBannerUploading(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setGalleryUploading(true);
    setGalleryProgress({ current: 0, total: files.length });
    try {
      const uploaded = await mediaUploadService.uploadImages(files, {
        folder: "veda-structure/path-services/gallery",
        onProgress: (current: number, total: number) => setGalleryProgress({ current, total }),
      });
      const newUrls = uploaded.map((u: UploadedImage) => u.url);
      setForm((p) => ({ ...p, galleryImages: [...p.galleryImages, ...newUrls] }));
      toast.success(`Successfully uploaded ${uploaded.length} gallery image(s).`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload gallery images.";
      toast.error(msg);
    } finally {
      setGalleryUploading(false);
      setGalleryProgress(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setForm((p) => ({
      ...p,
      galleryImages: p.galleryImages.filter((_, i) => i !== index),
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) nextErrors.name = "Service name is required.";
    if (!form.scripture.trim()) nextErrors.scripture = "Scripture / Text name is required.";

    const priceNum = Number(form.startingPrice);
    if (form.startingPrice === "" || isNaN(priceNum) || priceNum < 0) {
      nextErrors.startingPrice = "Starting price must be a non-negative number.";
    }

    if (form.availableFormats.length === 0) {
      nextErrors.availableFormats = "At least one recitation format must be selected.";
    }

    // Days hierarchy
    const minDays = Number(form.minimumDays);
    const recDays = Number(form.recommendedDays);
    const maxDays = Number(form.maximumDays);

    if (!Number.isInteger(minDays) || minDays < 1) {
      nextErrors.days = "Minimum days must be an integer >= 1.";
    } else if (!Number.isInteger(recDays) || recDays < minDays) {
      nextErrors.days = `Recommended days (${recDays}) must be >= minimum days (${minDays}).`;
    } else if (!Number.isInteger(maxDays) || maxDays < recDays) {
      nextErrors.days = `Maximum days (${maxDays}) must be >= recommended days (${recDays}).`;
    }

    // Single-Session Coupling
    const isOnlySingleOrSameDay =
      form.availableFormats.length > 0 &&
      form.availableFormats.every((f) => f === "single_session" || f === "same_day");
    if (isOnlySingleOrSameDay && maxDays > 1) {
      nextErrors.coupling =
        "When only Single-Session or Same-Day formats are selected, maximum days must equal 1.";
    }

    // Pandits hierarchy
    const minP = Number(form.minimumPandits);
    const recP = Number(form.recommendedPandits);
    const maxP = Number(form.maximumPandits);

    if (!Number.isInteger(minP) || minP < 1) {
      nextErrors.pandits = "Minimum pandits must be an integer >= 1.";
    } else if (!Number.isInteger(recP) || recP < minP) {
      nextErrors.pandits = `Recommended pandits (${recP}) must be >= minimum pandits (${minP}).`;
    } else if (!Number.isInteger(maxP) || maxP < recP) {
      nextErrors.pandits = `Maximum pandits (${maxP}) must be >= recommended pandits (${recP}).`;
    }

    // Locations
    if (!form.isKashiAvailable && !form.isRemoteAvailable) {
      nextErrors.locations = "At least one arrangement mode (Kashi or Remote) must be enabled.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const derivedLocations: string[] = [];
      if (form.isKashiAvailable) derivedLocations.push("kashi");
      if (form.isRemoteAvailable) derivedLocations.push("remote");

      const cleanFaqs = form.faqs.filter((f) => f.question.trim() || f.answer.trim());
      const cleanSamagri = form.samagri.filter((s) => s.name.trim());

      const payload: PathServicePayload = {
        name: form.name.trim(),
        scripture: form.scripture.trim(),
        pathType: form.pathType.trim() || "Vedic Path",
        slug: form.slug.trim() || undefined,
        shortDescription: form.shortDescription.trim() || null,
        description: form.description.trim() || null,
        purposeId: form.purposeId || null,
        purposeSummary: form.purposeSummary.trim() || null,
        purposeCategory: form.purposeCategory || null,
        purposeCategories: form.purposeCategories,
        availableFormats: form.availableFormats,
        availableDurations: form.availableDurations,
        chapterStructure: form.chapterStructure.trim() || null,
        totalChapters: form.totalChapters ? Number(form.totalChapters) : null,
        totalSections: form.totalSections ? Number(form.totalSections) : null,
        totalVerses: form.totalVerses ? Number(form.totalVerses) : null,
        estimatedRecitationHours: form.estimatedRecitationHours
          ? Number(form.estimatedRecitationHours)
          : null,
        dailyRecitationTarget: form.dailyRecitationTarget.trim() || null,
        dailyHours: form.dailyHours.trim() || "3 – 4 Hours Daily",
        dailyRecitationCapacity: form.dailyRecitationCapacity.trim() || null,
        minimumDays: Number(form.minimumDays),
        recommendedDays: Number(form.recommendedDays),
        maximumDays: Number(form.maximumDays),
        minimumPandits: Number(form.minimumPandits),
        recommendedPandits: Number(form.recommendedPandits),
        maximumPandits: Number(form.maximumPandits),
        requiredSkills: form.requiredSkills.trim() || null,
        startingPrice: Number(form.startingPrice),
        isKashiAvailable: form.isKashiAvailable,
        isRemoteAvailable: form.isRemoteAvailable,
        availableLocations: derivedLocations,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        bannerImage: form.bannerImage || null,
        galleryImages: form.galleryImages,
        samagri: cleanSamagri,
        prasad: form.prasad.trim() || null,
        sankalpaFields: form.sankalpaFields,
        seo: {
          title: form.seoTitle.trim() || undefined,
          description: form.seoDescription.trim() || undefined,
          keywords: form.seoKeywords.trim() || undefined,
        },
        faqs: cleanFaqs,
      };

      if (isEdit && id) {
        await pathServiceCatalogueService.updatePathService(id, payload);
        toast.success(`"${form.name}" updated successfully.`);
        navigate(`/admin/path-services/${id}`);
      } else {
        const created = await pathServiceCatalogueService.createPathService(payload);
        toast.success(`"${form.name}" created successfully.`);
        navigate(`/admin/path-services/${created.id}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save Path service.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isOnlySingleOrSameDay = useMemo(() => {
    return (
      form.availableFormats.length > 0 &&
      form.availableFormats.every((f) => f === "single_session" || f === "same_day")
    );
  }, [form.availableFormats]);

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <Clock className="w-8 h-8 text-saffron-500 animate-spin mx-auto mb-3" />
        <p className="text-sm text-charcoal-500">Loading Path service configuration...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={isEdit ? `/admin/path-services/${id}` : "/admin/path-services"}
            className="p-2 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <PageHeader
            title={isEdit ? `Edit: ${form.name || "Path Service"}` : "Create Path Service"}
            subtitle="Configure Vedic scriptures, recitation formats, duration schedules, scholar requirements, starting price, and publishing settings."
          />
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={isEdit ? `/admin/path-services/${id}` : "/admin/path-services"}
            className="btn-secondary text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}
          </button>
        </div>
      </div>

      {/* 1. Basic Information */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <BookOpen className="w-4 h-4 text-saffron-600" />
          1. Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Path Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Sundarkand Path"
              className="input-field w-full text-sm"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Slug (URL Identifier)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="Auto-generated if left blank"
              className="input-field w-full text-sm font-mono text-xs"
            />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Scripture / Sacred Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.scripture}
              onChange={(e) => {
                setForm((p) => ({ ...p, scripture: e.target.value }));
                if (errors.scripture) setErrors((p) => ({ ...p, scripture: undefined }));
              }}
              placeholder="e.g. Shri Ramcharitmanas (Goswami Tulsidas)"
              className="input-field w-full text-sm"
            />
            {errors.scripture && <p className="text-xs text-red-500 mt-1">{errors.scripture}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Path Type Classification
            </label>
            <input
              type="text"
              value={form.pathType}
              onChange={(e) => setForm((p) => ({ ...p, pathType: e.target.value }))}
              placeholder="e.g. Ramcharitmanas Adhyaya, Vedic Path, Stotra"
              className="input-field w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. Purpose & Intention */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <Tag className="w-4 h-4 text-saffron-600" />
          2. Purpose & Intention
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Primary Purpose Category
            </label>
            <select
              value={form.purposeId}
              onChange={(e) => handlePurposeChange(e.target.value)}
              className="input-field w-full text-sm bg-white"
            >
              <option value="">-- Select Purpose --</option>
              {purposes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-charcoal-400 mt-1">
              Links this service to a canonical spiritual purpose.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Purpose Summary / Intention
            </label>
            <input
              type="text"
              value={form.purposeSummary}
              onChange={(e) => setForm((p) => ({ ...p, purposeSummary: e.target.value }))}
              placeholder="e.g. Overcoming obstacles, mental strength, and family peace"
              className="input-field w-full text-sm"
            />
          </div>
        </div>

        {/* Secondary categories */}
        {purposes.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1.5">
              Associated Purpose Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {purposes.map((p) => {
                const isSelected = form.purposeCategories.includes(p.slug);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleToggleCategory(p.slug)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-saffron-50 border-saffron-300 text-saffron-800 font-medium"
                        : "bg-white border-cream-200 text-charcoal-600 hover:border-cream-300"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-saffron-600" />}
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Descriptions */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <Layers className="w-4 h-4 text-saffron-600" />
          3. Descriptions
        </h3>
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
            Short Description
          </label>
          <textarea
            rows={2}
            value={form.shortDescription}
            onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
            placeholder="Brief summary displayed on cards and catalogue preview..."
            className="input-field w-full text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
            Detailed Description & Spiritual Significance
          </label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Full explanation of the scripture, divine benefits, recitation tradition, and rituals performed..."
            className="input-field w-full text-sm"
          />
        </div>
      </div>

      {/* 4. Recitation Formats & Schedule */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <Calendar className="w-4 h-4 text-saffron-600" />
          4. Recitation Formats & Schedule
        </h3>

        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1.5">
            Supported Recitation Formats <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {(Object.keys(PATH_FORMAT_LABELS) as PathFormatType[]).map((fmt) => {
              const checked = form.availableFormats.includes(fmt);
              return (
                <label
                  key={fmt}
                  className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
                    checked
                      ? "bg-saffron-50/50 border-saffron-300 text-charcoal-900"
                      : "bg-white border-cream-200 text-charcoal-600 hover:border-cream-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleFormat(fmt)}
                    className="mt-0.5 rounded text-saffron-600 focus:ring-saffron-500"
                  />
                  <div>
                    <span className="text-xs font-semibold block">{PATH_FORMAT_LABELS[fmt]}</span>
                    <span className="text-[10px] text-charcoal-400 font-mono">{fmt}</span>
                  </div>
                </label>
              );
            })}
          </div>
          {errors.availableFormats && (
            <p className="text-xs text-red-500 mt-1">{errors.availableFormats}</p>
          )}
          {isOnlySingleOrSameDay && (
            <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Single-Session Rule:</strong> Services supporting only Single Session or Same-Day formats are restricted to 1 day maximum.
              </span>
            </div>
          )}
        </div>

        {/* Available Durations List */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1.5">
            Duration Options Displayed to Customer
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.availableDurations.map((dur) => (
              <span
                key={dur}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-cream-100 text-charcoal-700 border border-cream-200"
              >
                <Clock className="w-3 h-3 text-saffron-600" />
                {dur}
                <button
                  type="button"
                  onClick={() => handleRemoveDuration(dur)}
                  className="text-charcoal-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={newDurationInput}
              onChange={(e) => setNewDurationInput(e.target.value)}
              placeholder="e.g. 3 to 4 Hours, 2 Hours Morning"
              className="input-field text-xs flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddDuration();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddDuration}
              className="btn-secondary text-xs px-3 py-2 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Duration
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Daily Hours
            </label>
            <input
              type="text"
              value={form.dailyHours}
              onChange={(e) => setForm((p) => ({ ...p, dailyHours: e.target.value }))}
              placeholder="e.g. 3 – 4 Hours Daily"
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Daily Recitation Target
            </label>
            <input
              type="text"
              value={form.dailyRecitationTarget}
              onChange={(e) => setForm((p) => ({ ...p, dailyRecitationTarget: e.target.value }))}
              placeholder="e.g. 1 Adhyaya / Session"
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Estimated Recitation Hours
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={form.estimatedRecitationHours}
              onChange={(e) => setForm((p) => ({ ...p, estimatedRecitationHours: e.target.value }))}
              placeholder="e.g. 3.5"
              className="input-field w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* 5. Scripture Structure & Targets */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <Scroll className="w-4 h-4 text-saffron-600" />
          5. Scripture Structure & Targets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Chapter Structure Summary
            </label>
            <input
              type="text"
              value={form.chapterStructure}
              onChange={(e) => setForm((p) => ({ ...p, chapterStructure: e.target.value }))}
              placeholder="e.g. 18 Chapters / 700 Shlokas"
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Total Chapters
            </label>
            <input
              type="number"
              min="0"
              value={form.totalChapters}
              onChange={(e) => setForm((p) => ({ ...p, totalChapters: e.target.value }))}
              placeholder="e.g. 18"
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Total Sections / Sargas
            </label>
            <input
              type="number"
              min="0"
              value={form.totalSections}
              onChange={(e) => setForm((p) => ({ ...p, totalSections: e.target.value }))}
              placeholder="e.g. 60"
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Total Verses / Shlokas
            </label>
            <input
              type="number"
              min="0"
              value={form.totalVerses}
              onChange={(e) => setForm((p) => ({ ...p, totalVerses: e.target.value }))}
              placeholder="e.g. 700"
              className="input-field w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* 6. Duration & Scholars */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <Users className="w-4 h-4 text-saffron-600" />
          6. Duration (Days) & Scholar Requirements
        </h3>

        {/* Days Hierarchy */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-2">
            Schedule Days Hierarchy: Min &le; Recommended &le; Max <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-charcoal-500 block mb-1">Minimum Days</span>
              <input
                type="number"
                min="1"
                value={form.minimumDays}
                onChange={(e) => {
                  setForm((p) => ({ ...p, minimumDays: e.target.value }));
                  if (errors.days) setErrors((err) => ({ ...err, days: undefined }));
                }}
                className="input-field w-full text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-charcoal-500 block mb-1">Recommended Days</span>
              <input
                type="number"
                min="1"
                value={form.recommendedDays}
                onChange={(e) => {
                  setForm((p) => ({ ...p, recommendedDays: e.target.value }));
                  if (errors.days) setErrors((err) => ({ ...err, days: undefined }));
                }}
                className="input-field w-full text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-charcoal-500 block mb-1">Maximum Days</span>
              <input
                type="number"
                min="1"
                value={form.maximumDays}
                onChange={(e) => {
                  setForm((p) => ({ ...p, maximumDays: e.target.value }));
                  if (errors.days || errors.coupling) {
                    setErrors((err) => ({ ...err, days: undefined, coupling: undefined }));
                  }
                }}
                className="input-field w-full text-sm"
              />
            </div>
          </div>
          {errors.days && <p className="text-xs text-red-500 mt-1">{errors.days}</p>}
          {errors.coupling && <p className="text-xs text-red-500 mt-1">{errors.coupling}</p>}
        </div>

        {/* Pandits Hierarchy */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-2">
            Vedic Scholars (Pandits) Range: Min &le; Recommended &le; Max <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-charcoal-500 block mb-1">Minimum Pandits</span>
              <input
                type="number"
                min="1"
                value={form.minimumPandits}
                onChange={(e) => {
                  setForm((p) => ({ ...p, minimumPandits: e.target.value }));
                  if (errors.pandits) setErrors((err) => ({ ...err, pandits: undefined }));
                }}
                className="input-field w-full text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-charcoal-500 block mb-1">Recommended Pandits</span>
              <input
                type="number"
                min="1"
                value={form.recommendedPandits}
                onChange={(e) => {
                  setForm((p) => ({ ...p, recommendedPandits: e.target.value }));
                  if (errors.pandits) setErrors((err) => ({ ...err, pandits: undefined }));
                }}
                className="input-field w-full text-sm"
              />
            </div>
            <div>
              <span className="text-xs text-charcoal-500 block mb-1">Maximum Pandits</span>
              <input
                type="number"
                min="1"
                value={form.maximumPandits}
                onChange={(e) => {
                  setForm((p) => ({ ...p, maximumPandits: e.target.value }));
                  if (errors.pandits) setErrors((err) => ({ ...err, pandits: undefined }));
                }}
                className="input-field w-full text-sm"
              />
            </div>
          </div>
          {errors.pandits && <p className="text-xs text-red-500 mt-1">{errors.pandits}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
            Required Scholar Qualifications & Vedic Skills
          </label>
          <input
            type="text"
            value={form.requiredSkills}
            onChange={(e) => setForm((p) => ({ ...p, requiredSkills: e.target.value }))}
            placeholder="e.g. Ghanapaathi Acharyas, Rigveda Samhita Reciters"
            className="input-field w-full text-sm"
          />
        </div>
      </div>

      {/* 7. Pricing */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <DollarSign className="w-4 h-4 text-saffron-600" />
          7. Pricing (Authoritative Backend Model)
        </h3>
        <div className="max-w-md">
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
            Starting Price (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-charcoal-400 font-semibold text-sm">₹</span>
            <input
              type="number"
              min="0"
              value={form.startingPrice}
              onChange={(e) => {
                setForm((p) => ({ ...p, startingPrice: e.target.value }));
                if (errors.startingPrice) setErrors((p) => ({ ...p, startingPrice: undefined }));
              }}
              placeholder="e.g. 5100"
              className="input-field w-full pl-8 text-sm font-semibold"
            />
          </div>
          {errors.startingPrice && (
            <p className="text-xs text-red-500 mt-1">{errors.startingPrice}</p>
          )}
          <p className="text-[11px] text-charcoal-400 mt-1.5">
            Path recitations utilize a pure flat starting price. Pandit allocations carry zero surcharge in accordance with traditional recitation seva principles.
          </p>
        </div>
      </div>

      {/* 8. Arrangement & Locations */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <MapPin className="w-4 h-4 text-saffron-600" />
          8. Arrangement & Locations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-cream-200 cursor-pointer hover:bg-cream-50/50 transition">
            <input
              type="checkbox"
              checked={form.isKashiAvailable}
              onChange={(e) => setForm((p) => ({ ...p, isKashiAvailable: e.target.checked }))}
              className="mt-1 rounded text-saffron-600 focus:ring-saffron-500"
            />
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-sm text-charcoal-800">
                <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                Holy Kashi (Varanasi)
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Physical recitation conducted on holy Ganga Ghats or Vedic ashrams in Kashi.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-lg border border-cream-200 cursor-pointer hover:bg-cream-50/50 transition">
            <input
              type="checkbox"
              checked={form.isRemoteAvailable}
              onChange={(e) => setForm((p) => ({ ...p, isRemoteAvailable: e.target.checked }))}
              className="mt-1 rounded text-saffron-600 focus:ring-saffron-500"
            />
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-sm text-charcoal-800">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Remote / Online Recitation
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Conducted with Live Video Stream / Digital Sankalpa for remote devotees.
              </p>
            </div>
          </label>
        </div>
        {errors.locations && <p className="text-xs text-red-500">{errors.locations}</p>}
      </div>

      {/* 9. Ritual Content */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <Package className="w-4 h-4 text-saffron-600" />
          9. Ritual Inclusions & Sacred Prasad
        </h3>

        {/* Samagri */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-charcoal-700 uppercase">
              Samagri & Scripture Materials
            </label>
            <button
              type="button"
              onClick={handleAddSamagri}
              className="btn-secondary text-xs px-2.5 py-1 inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
          {form.samagri.length === 0 ? (
            <p className="text-xs text-charcoal-400 italic">No specific samagri items added.</p>
          ) : (
            <div className="space-y-2">
              {form.samagri.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateSamagri(idx, "name", e.target.value)}
                    placeholder="e.g. Ramcharitmanas Granth, Sindoor, Janeu"
                    className="input-field text-xs flex-1"
                  />
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateSamagri(idx, "status", e.target.value)}
                    className="input-field text-xs w-32 bg-white"
                  >
                    <option value="included">Included</option>
                    <option value="provided">Provided</option>
                    <option value="optional">Optional</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveSamagri(idx)}
                    className="p-1.5 text-charcoal-400 hover:text-red-500 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prasad */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
            Consecrated Prasad Details
          </label>
          <input
            type="text"
            value={form.prasad}
            onChange={(e) => setForm((p) => ({ ...p, prasad: e.target.value }))}
            placeholder="e.g. Blessed Raksha Sutra, Consecrated Vibhuti, and Hanuman Prasad"
            className="input-field w-full text-sm"
          />
        </div>

        {/* Sankalpa Fields */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1.5">
            Sankalpa Form Requirements for Yajman
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { key: "name", label: "Devotee Name" },
              { key: "gotra", label: "Gotra" },
              { key: "nakshatra", label: "Janma Nakshatra" },
              { key: "rashi", label: "Chandra Rashi" },
              { key: "familyMembers", label: "Family Members" },
              { key: "specialSankalpa", label: "Special Sankalpa" },
              { key: "specialInstructions", label: "Special Requests" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 p-2 rounded border border-cream-100 bg-cream-50/50 text-xs cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={Boolean(form.sankalpaFields[key as keyof typeof form.sankalpaFields])}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      sankalpaFields: {
                        ...p.sankalpaFields,
                        [key]: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-saffron-600 focus:ring-saffron-500"
                />
                <span className="text-charcoal-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 10. Media */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <ImageIcon className="w-4 h-4 text-saffron-600" />
          10. Media & Imagery
        </h3>

        {/* Banner Image */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1.5">
            Service Banner Image (Wide 16:9 recommended)
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {form.bannerImage ? (
              <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-cream-200 bg-cream-100">
                <img
                  src={form.bannerImage}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, bannerImage: "" }))}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-48 h-28 rounded-lg border-2 border-dashed border-cream-300 flex flex-col items-center justify-center text-charcoal-400 bg-cream-50/50">
                <ImageIcon className="w-6 h-6 mb-1 text-charcoal-300" />
                <span className="text-[11px]">No Banner Uploaded</span>
              </div>
            )}
            <div className="space-y-2 flex-1">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerSelect}
                className="hidden"
                id="banner-file-input"
              />
              <button
                type="button"
                disabled={bannerUploading}
                onClick={() => bannerInputRef.current?.click()}
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                {bannerUploading ? "Uploading Banner..." : "Choose Banner Image"}
              </button>
              <p className="text-[11px] text-charcoal-400">
                Uploaded to <code>veda-structure/path-services/banners</code> on Cloudinary.
              </p>
              {form.bannerImage && (
                <input
                  type="text"
                  value={form.bannerImage}
                  onChange={(e) => setForm((p) => ({ ...p, bannerImage: e.target.value }))}
                  placeholder="Or paste banner image URL directly"
                  className="input-field w-full text-xs font-mono"
                />
              )}
            </div>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-charcoal-700 uppercase">
              Gallery Images
            </label>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGallerySelect}
              className="hidden"
              id="gallery-file-input"
            />
            <button
              type="button"
              disabled={galleryUploading}
              onClick={() => galleryInputRef.current?.click()}
              className="btn-secondary text-xs px-2.5 py-1 inline-flex items-center gap-1.5"
            >
              <Upload className="w-3 h-3" />
              {galleryUploading
                ? `Uploading (${galleryProgress?.current}/${galleryProgress?.total})...`
                : "Add Gallery Photos"}
            </button>
          </div>

          {form.galleryImages.length === 0 ? (
            <p className="text-xs text-charcoal-400 italic">No gallery images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {form.galleryImages.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-lg overflow-hidden border border-cream-200 bg-cream-100 group"
                >
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 group-hover:opacity-100 transition"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 11. SEO & FAQs */}
      <div className="card p-6 space-y-4">
        <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 border-b border-cream-100 pb-2">
          <HelpCircle className="w-4 h-4 text-saffron-600" />
          11. SEO, FAQs & Publishing Status
        </h3>

        {/* SEO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
              placeholder="e.g. Sundarkand Path Recitation in Kashi"
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Meta Description
            </label>
            <input
              type="text"
              value={form.seoDescription}
              onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
              placeholder="e.g. Book authentic Sundarkand Path recited by Vedic Acharyas..."
              className="input-field w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase mb-1">
              Keywords (Comma-separated)
            </label>
            <input
              type="text"
              value={form.seoKeywords}
              onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))}
              placeholder="e.g. sundarkand path, ramcharitmanas, kashi recitation"
              className="input-field w-full text-sm"
            />
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-charcoal-700 uppercase">
              Frequently Asked Questions (FAQs)
            </label>
            <button
              type="button"
              onClick={handleAddFaq}
              className="btn-secondary text-xs px-2.5 py-1 inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add FAQ
            </button>
          </div>
          <div className="space-y-3">
            {form.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-cream-200 bg-cream-50/40 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-charcoal-400 uppercase">
                    FAQ #{idx + 1}
                  </span>
                  {form.faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-charcoal-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                  placeholder="Question (e.g. How is the Sankalpa taken during online recitation?)"
                  className="input-field text-xs w-full"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                  placeholder="Answer..."
                  className="input-field text-xs w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Publishing Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cream-100">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-cream-200 cursor-pointer bg-white">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="rounded text-green-600 focus:ring-green-500 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-charcoal-900 block">
                Active in Public Catalogue
              </span>
              <span className="text-xs text-charcoal-500">
                When enabled, devotees can discover and book this Path recitation.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-cream-200 cursor-pointer bg-white">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <div>
              <span className="text-sm font-semibold text-charcoal-900 block">
                Featured Path Service
              </span>
              <span className="text-xs text-charcoal-500">
                Highlighted with priority placement in catalogue and home previews.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2">
        <Link
          to={isEdit ? `/admin/path-services/${id}` : "/admin/path-services"}
          className="btn-secondary text-sm"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-sm flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}
        </button>
      </div>
    </form>
  );
}
