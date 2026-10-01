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
  Flame,
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
import mediaUploadService from "@/services/mediaUploadService";
import homaServiceCatalogueService, {
  HomaPurpose,
  HomaServicePayload,
} from "@/services/homaServiceCatalogueService";

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
  homaType?: string;
  availableHavanCounts?: string;
  availableDays?: string;
  coupling?: string;
  pandits?: string;
  basePrice?: string;
  perHavanPrice?: string;
  perDayPrice?: string;
}

interface FormState {
  name: string;
  slug: string;
  homaType: string;
  shortDescription: string;
  description: string;
  purposeId: string;
  purposeSummary: string;
  purposeCategory: string;
  purposeCategories: string[];
  availableHavanCounts: number[];
  availableDays: number[];
  minimumPandits: string;
  recommendedPandits: string;
  maximumPandits: string;
  requiredSkills: string;
  dailyHours: string;
  havanCapacityPerPandit: string;
  basePrice: string;
  perHavanPrice: string;
  perDayPrice: string;
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
    gotra: boolean;
    nakshatra: boolean;
    rashi: boolean;
    deity: boolean;
    specialInstructions: boolean;
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  faqs: { question: string; answer: string }[];
}

const DEFAULT_HAVAN_COUNTS = [1, 3, 5, 7, 11];
const DEFAULT_DAYS = [1, 2, 3];

export default function HomaServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [purposes, setPurposes] = useState<HomaPurpose[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Inputs for adding new counts & days
  const [newHavanInput, setNewHavanInput] = useState("");
  const [newDayInput, setNewDayInput] = useState("");

  // Media upload states
  const [bannerUploading, setBannerUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    homaType: "Vedic Homa",
    shortDescription: "",
    description: "",
    purposeId: "",
    purposeSummary: "",
    purposeCategory: "",
    purposeCategories: [],
    availableHavanCounts: DEFAULT_HAVAN_COUNTS,
    availableDays: DEFAULT_DAYS,
    minimumPandits: "2",
    recommendedPandits: "3",
    maximumPandits: "11",
    requiredSkills: "Vedic Recitation, Homa Vidhi, Samagri Ahuti",
    dailyHours: "3 – 4 Hours Daily",
    havanCapacityPerPandit: "1 – 2 Havans Daily",
    basePrice: "11000",
    perHavanPrice: "3500",
    perDayPrice: "5000",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    availableLocations: ["kashi", "remote"],
    isFeatured: false,
    isActive: true,
    bannerImage: "",
    galleryImages: [],
    samagri: [
      { name: "Pure Ghee & Homa Herbs", status: "included" },
      { name: "Navadhanya & Sacred Woods", status: "included" },
    ],
    prasad: "Blessed Bhasma (sacred ash), Panchamrit, and Dry Fruits delivered to your home.",
    sankalpaFields: {
      gotra: true,
      nakshatra: true,
      rashi: true,
      deity: true,
      specialInstructions: true,
    },
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    faqs: [
      {
        question: "What is the spiritual significance of this Homa?",
        answer: "This sacred Vedic fire ceremony invokes divine blessings, purifying the surroundings and bestowing auspiciousness and peace.",
      },
    ],
  });

  // 1. Load Purpose classifications dynamically
  useEffect(() => {
    let isMounted = true;
    homaServiceCatalogueService
      .getHomaPurposes()
      .then((data) => {
        if (isMounted) {
          setPurposes(data);
          if (!isEdit && data.length > 0) {
            setForm((p) => {
              if (!p.purposeId) {
                const first = data[0];
                return {
                  ...p,
                  purposeId: first.id,
                  purposeCategory: first.slug,
                  purposeSummary: first.description || first.name,
                  purposeCategories: [first.slug],
                };
              }
              return p;
            });
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load Homa purposes:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [isEdit]);

  // 2. Fetch existing service in EDIT mode
  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);

    homaServiceCatalogueService
      .getHomaService(id)
      .then((data) => {
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          homaType: data.homaType || "Vedic Homa",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          purposeId: data.purposeId || "",
          purposeSummary: data.purposeSummary || "",
          purposeCategory: data.purposeCategory || "",
          purposeCategories: Array.isArray(data.purposeCategories) ? data.purposeCategories : [],
          availableHavanCounts:
            Array.isArray(data.availableHavanCounts) && data.availableHavanCounts.length > 0
              ? data.availableHavanCounts
              : DEFAULT_HAVAN_COUNTS,
          availableDays:
            Array.isArray(data.availableDays) && data.availableDays.length > 0
              ? data.availableDays
              : DEFAULT_DAYS,
          minimumPandits: String(data.minimumPandits || 2),
          recommendedPandits: String(data.recommendedPandits || 3),
          maximumPandits: String(data.maximumPandits || 11),
          requiredSkills: data.requiredSkills || "",
          dailyHours: data.dailyHours || "3 – 4 Hours Daily",
          havanCapacityPerPandit: data.havanCapacityPerPandit || "",
          basePrice: String(data.basePrice ?? data.startingPrice ?? 0),
          perHavanPrice: String(data.perHavanPrice || 0),
          perDayPrice: String(data.perDayPrice || 0),
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
            gotra: data.sankalpaFields?.gotra !== false,
            nakshatra: data.sankalpaFields?.nakshatra !== false,
            rashi: data.sankalpaFields?.rashi !== false,
            deity: data.sankalpaFields?.deity !== false,
            specialInstructions: data.sankalpaFields?.specialInstructions !== false,
          },
          seoTitle: data.seo?.title || data.seo?.metaTitle || "",
          seoDescription: data.seo?.description || data.seo?.metaDescription || "",
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
        const msg = err instanceof Error ? err.message : "Unable to load Homa service.";
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
        purposeSummary: prev.purposeSummary || (matched?.description ? matched.description : matched?.name || ""),
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

  // Available Havan Counts
  const handleAddHavanCount = (countNum: number) => {
    if (!Number.isInteger(countNum) || countNum <= 0) {
      toast.error("Havan count must be a positive integer.");
      return;
    }
    if (form.availableHavanCounts.includes(countNum)) {
      toast.info(`Havan count ${countNum} is already in the list.`);
      return;
    }
    const updated = [...form.availableHavanCounts, countNum].sort((a, b) => a - b);
    setForm((p) => ({ ...p, availableHavanCounts: updated }));
    if (errors.availableHavanCounts || errors.coupling) {
      setErrors((p) => ({ ...p, availableHavanCounts: undefined, coupling: undefined }));
    }
  };

  const handleRemoveHavanCount = (countNum: number) => {
    if (form.availableHavanCounts.length <= 1) {
      toast.error("At least one Havan count is required.");
      return;
    }
    const updated = form.availableHavanCounts.filter((c) => c !== countNum);
    setForm((p) => ({ ...p, availableHavanCounts: updated }));
  };

  // Available Days
  const handleAddDay = (dayNum: number) => {
    if (!Number.isInteger(dayNum) || dayNum <= 0) {
      toast.error("Day count must be a positive integer.");
      return;
    }
    if (form.availableDays.includes(dayNum)) {
      toast.info(`Duration of ${dayNum} Day(s) is already in the list.`);
      return;
    }
    const updated = [...form.availableDays, dayNum].sort((a, b) => a - b);
    setForm((p) => ({ ...p, availableDays: updated }));
    if (errors.availableDays || errors.coupling) {
      setErrors((p) => ({ ...p, availableDays: undefined, coupling: undefined }));
    }
  };

  const handleRemoveDay = (dayNum: number) => {
    if (form.availableDays.length <= 1) {
      toast.error("At least one Day duration is required.");
      return;
    }
    const updated = form.availableDays.filter((d) => d !== dayNum);
    setForm((p) => ({ ...p, availableDays: updated }));
  };

  // Media Handlers
  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      mediaUploadService.validateImageFile(file);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid image file.";
      toast.error(msg);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
      return;
    }

    setBannerUploading(true);
    try {
      const res = await mediaUploadService.uploadImage(file, {
        folder: "veda-structure/homa-services/banners",
      });
      setForm((p) => ({ ...p, bannerImage: res.url }));
      toast.success("Banner image uploaded successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Banner upload failed.";
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
    try {
      const results = await mediaUploadService.uploadImages(files, {
        folder: "veda-structure/homa-services/gallery",
        onProgress: (current, total) => setGalleryProgress({ current, total }),
      });
      setForm((p) => ({
        ...p,
        galleryImages: [...p.galleryImages, ...results.map((r) => r.url)],
      }));
      toast.success(`${results.length} gallery image(s) uploaded.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gallery upload failed.";
      toast.error(msg);
    } finally {
      setGalleryUploading(false);
      setGalleryProgress(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  // Samagri Handlers
  const handleAddSamagri = () => {
    setForm((p) => ({
      ...p,
      samagri: [...p.samagri, { name: "", status: "included" }],
    }));
  };

  const handleUpdateSamagri = (index: number, field: "name" | "status", value: string) => {
    setForm((p) => {
      const updated = [...p.samagri];
      updated[index] = { ...updated[index], [field]: value };
      return { ...p, samagri: updated };
    });
  };

  const handleRemoveSamagri = (index: number) => {
    setForm((p) => {
      const updated = [...p.samagri];
      updated.splice(index, 1);
      return { ...p, samagri: updated };
    });
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    setForm((p) => ({
      ...p,
      faqs: [...p.faqs, { question: "", answer: "" }],
    }));
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", val: string) => {
    setForm((p) => {
      const updated = [...p.faqs];
      updated[index] = { ...updated[index], [field]: val };
      return { ...p, faqs: updated };
    });
  };

  const handleRemoveFaq = (index: number) => {
    setForm((p) => {
      const updated = [...p.faqs];
      updated.splice(index, 1);
      return { ...p, faqs: updated };
    });
  };

  // Coupling Rule Status Check (1 Havan cannot be multi-day)
  const isOnlyOneHavan =
    form.availableHavanCounts.length === 1 && Number(form.availableHavanCounts[0]) === 1;
  const hasMultiDay = form.availableDays.some((d) => Number(d) > 1);
  const couplingViolation = isOnlyOneHavan && hasMultiDay;

  // Pricing calculation live preview
  const pricingPreview = useMemo(() => {
    const base = Number(form.basePrice) || 0;
    const perHavan = Number(form.perHavanPrice) || 0;
    const perDay = Number(form.perDayPrice) || 0;

    return form.availableHavanCounts.slice(0, 3).map((hCount) => {
      const day = form.availableDays[0] || 1;
      const total = base + (hCount - 1) * perHavan + (day - 1) * perDay;
      return {
        label: `${hCount} Havan${hCount > 1 ? "s" : ""} / ${day} Day${day > 1 ? "s" : ""}`,
        amount: total,
      };
    });
  }, [form.basePrice, form.perHavanPrice, form.perDayPrice, form.availableHavanCounts, form.availableDays]);

  // Client Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Service name is required.";
    if (!form.slug.trim()) newErrors.slug = "Service slug is required.";
    if (!form.homaType.trim()) newErrors.homaType = "Homa type is required.";

    const basePriceNum = Number(form.basePrice);
    if (form.basePrice === "" || isNaN(basePriceNum) || basePriceNum < 0) {
      newErrors.basePrice = "Base price must be a valid non-negative number.";
    }

    const perHavanNum = Number(form.perHavanPrice);
    if (form.perHavanPrice !== "" && (isNaN(perHavanNum) || perHavanNum < 0)) {
      newErrors.perHavanPrice = "Per Havan price must be a non-negative number.";
    }

    const perDayNum = Number(form.perDayPrice);
    if (form.perDayPrice !== "" && (isNaN(perDayNum) || perDayNum < 0)) {
      newErrors.perDayPrice = "Per Day price must be a non-negative number.";
    }

    if (!Array.isArray(form.availableHavanCounts) || form.availableHavanCounts.length === 0) {
      newErrors.availableHavanCounts = "At least one Havan count is required.";
    }

    if (!Array.isArray(form.availableDays) || form.availableDays.length === 0) {
      newErrors.availableDays = "At least one Day duration is required.";
    }

    // Havan/Day coupling rule check
    const onlyOneHavan =
      form.availableHavanCounts.length === 1 && Number(form.availableHavanCounts[0]) === 1;
    const multiDay = form.availableDays.some((d) => Number(d) > 1);
    if (onlyOneHavan && multiDay) {
      newErrors.coupling =
        "A single Havan (1 Havan) cannot be performed as a multi-day ceremony. Remove days > 1 or add multi-havan options.";
    }

    // Pandit Range Check
    const minP = parseInt(form.minimumPandits, 10);
    const recP = parseInt(form.recommendedPandits, 10);
    const maxP = parseInt(form.maximumPandits, 10);

    if (isNaN(minP) || minP <= 0 || isNaN(recP) || recP <= 0 || isNaN(maxP) || maxP <= 0) {
      newErrors.pandits = "Pandit counts must be positive integers.";
    } else if (minP > recP) {
      newErrors.pandits = `Minimum pandits (${minP}) cannot exceed recommended pandits (${recP}).`;
    } else if (recP > maxP) {
      newErrors.pandits = `Recommended pandits (${recP}) cannot exceed maximum pandits (${maxP}).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please resolve highlighted validation errors before saving.");
      return;
    }

    setSubmitting(true);
    try {
      const baseNum = Number(form.basePrice);

      const payload: HomaServicePayload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        homaType: form.homaType.trim() || "Vedic Homa",
        shortDescription: form.shortDescription.trim() || null,
        description: form.description.trim() || null,
        purposeId: form.purposeId || null,
        purposeSummary: form.purposeSummary.trim() || null,
        purposeCategory: form.purposeCategory.trim() || null,
        purposeCategories: form.purposeCategories,
        availableHavanCounts: form.availableHavanCounts.map(Number),
        availableDays: form.availableDays.map(Number),
        minimumPandits: parseInt(form.minimumPandits, 10) || 2,
        recommendedPandits: parseInt(form.recommendedPandits, 10) || 3,
        maximumPandits: parseInt(form.maximumPandits, 10) || 11,
        requiredSkills: form.requiredSkills.trim() || null,
        dailyHours: form.dailyHours.trim() || "3 – 4 Hours Daily",
        havanCapacityPerPandit: form.havanCapacityPerPandit.trim() || null,
        basePrice: baseNum,
        perHavanPrice: Number(form.perHavanPrice) || 0,
        perDayPrice: Number(form.perDayPrice) || 0,
        isKashiAvailable: form.isKashiAvailable,
        isRemoteAvailable: form.isRemoteAvailable,
        availableLocations: [
          ...(form.isKashiAvailable ? ["kashi"] : []),
          ...(form.isRemoteAvailable ? ["remote"] : []),
        ],
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        bannerImage: form.bannerImage || null,
        galleryImages: form.galleryImages,
        samagri: form.samagri.filter((s) => s.name.trim()),
        prasad: form.prasad.trim() || null,
        sankalpaFields: form.sankalpaFields,
        seo: {
          title: form.seoTitle.trim() || undefined,
          description: form.seoDescription.trim() || undefined,
          keywords: form.seoKeywords.trim()
            ? form.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
            : undefined,
        },
        faqs: form.faqs.filter((f) => f.question.trim() || f.answer.trim()),
      };

      if (isEdit && id) {
        await homaServiceCatalogueService.updateHomaService(id, payload);
        toast.success(`Homa service "${payload.name}" updated successfully.`);
      } else {
        await homaServiceCatalogueService.createHomaService(payload);
        toast.success(`Homa service "${payload.name}" created successfully.`);
      }

      navigate("/admin/homa-services");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save Homa service.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-9 h-9 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading Homa service configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/homa-services"
            className="p-2 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition"
            title="Back to catalogue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal-800">
              {isEdit ? "Edit Homa Service" : "Create New Homa Service"}
            </h1>
            <p className="text-xs text-charcoal-400 mt-0.5">
              {isEdit
                ? `Updating "${form.name || form.slug}" configuration, pricing, and pandit hierarchy.`
                : "Configure a new sacred Vedic Homa ritual, available havan counts, pricing, and scholars."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/homa-services"
            className="btn-secondary text-xs px-3.5 py-2"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary text-xs px-4 py-2 flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving..." : isEdit ? "Update Service" : "Create Service"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Flame className="w-4 h-4 text-saffron-600" /> 1. Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="homa-name" className="label-field">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                id="homa-name"
                type="text"
                className={`input-field ${errors.name ? "border-red-400 focus:ring-red-300" : ""}`}
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Maha Ganapati Homa"
                disabled={submitting}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="homa-slug" className="label-field">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-charcoal-400 font-mono">/</span>
                <input
                  id="homa-slug"
                  type="text"
                  className={`input-field pl-7 font-mono text-xs ${errors.slug ? "border-red-400 focus:ring-red-300" : ""}`}
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="maha-ganapati-homa"
                  disabled={submitting}
                />
              </div>
              {errors.slug && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.slug}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="homa-type" className="label-field">
                Homa Classification Type <span className="text-red-500">*</span>
              </label>
              <input
                id="homa-type"
                type="text"
                className="input-field"
                value={form.homaType}
                onChange={(e) => setForm((p) => ({ ...p, homaType: e.target.value }))}
                placeholder="e.g. Vedic Homa, Tantric Homa, Shanti Homa"
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="homa-short-desc" className="label-field">
                Short Summary (Catalogue Cards)
              </label>
              <input
                id="homa-short-desc"
                type="text"
                className="input-field"
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
                placeholder="Brief one-line summary of benefits..."
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="homa-description" className="label-field">
                Full Ritual Description
              </label>
              <textarea
                id="homa-description"
                rows={4}
                className="input-field"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detailed explanation of the Vedic homa vidhi, history, and spiritual fruits..."
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Purpose & Classification */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Tag className="w-4 h-4 text-saffron-600" /> 2. Purpose & Spiritual Benefits
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="homa-purpose" className="label-field">
                Primary Purpose Category
              </label>
              <select
                id="homa-purpose"
                className="input-field"
                value={form.purposeId}
                onChange={(e) => handlePurposeChange(e.target.value)}
                disabled={submitting}
              >
                <option value="">Select Purpose</option>
                {purposes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="homa-purpose-summary" className="label-field">
                Purpose Highlight Summary
              </label>
              <input
                id="homa-purpose-summary"
                type="text"
                className="input-field"
                value={form.purposeSummary}
                onChange={(e) => setForm((p) => ({ ...p, purposeSummary: e.target.value }))}
                placeholder="e.g. Removes Obstacles & Auspicious Beginnings"
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Filterable Purpose Categories</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {purposes.map((p) => {
                  const active = form.purposeCategories.includes(p.slug);
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handleToggleCategory(p.slug)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                        active
                          ? "bg-saffron-100 text-saffron-800 border-saffron-300"
                          : "bg-cream-50 text-charcoal-500 border-cream-200 hover:bg-cream-100"
                      }`}
                      disabled={submitting}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Homa & Duration Configuration (Coupling Rule enforced) */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-2 pb-2 border-b border-cream-100">
            <Layers className="w-4 h-4 text-saffron-600" /> 3. Havan Counts & Ceremony Duration
          </h3>

          <p className="text-xs text-charcoal-500 mb-4">
            Configure available recitation/havan counts and duration days. A single Havan (1 Havan) must be completed in 1 Day. Multi-day ceremonies require multi-havan options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Havan Counts */}
            <div className="p-4 rounded-xl bg-cream-50/60 border border-cream-200">
              <label className="label-field">
                Available Havan Counts <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap gap-1.5 mb-3 min-h-[38px] p-2 bg-white rounded-lg border border-cream-200">
                {form.availableHavanCounts.map((count) => (
                  <span
                    key={count}
                    className="inline-flex items-center gap-1 bg-saffron-50 text-saffron-900 border border-saffron-200 px-2 py-0.5 rounded text-xs font-mono font-medium"
                  >
                    {count} Havan{count > 1 ? "s" : ""}
                    <button
                      type="button"
                      onClick={() => handleRemoveHavanCount(count)}
                      className="text-saffron-500 hover:text-red-600 focus:outline-none"
                      title={`Remove ${count}`}
                      disabled={submitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  className="input-field text-xs py-1.5"
                  value={newHavanInput}
                  onChange={(e) => setNewHavanInput(e.target.value)}
                  placeholder="Add count (e.g. 21)"
                  disabled={submitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newHavanInput) {
                        handleAddHavanCount(parseInt(newHavanInput, 10));
                        setNewHavanInput("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newHavanInput) {
                      handleAddHavanCount(parseInt(newHavanInput, 10));
                      setNewHavanInput("");
                    }
                  }}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                  disabled={submitting || !newHavanInput}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[11px] text-charcoal-400">Presets:</span>
                {[1, 3, 5, 7, 11, 21].map((pCount) => (
                  <button
                    type="button"
                    key={pCount}
                    onClick={() => handleAddHavanCount(pCount)}
                    className="text-[11px] px-1.5 py-0.5 bg-cream-100 hover:bg-cream-200 text-charcoal-700 rounded transition"
                  >
                    +{pCount}
                  </button>
                ))}
              </div>

              {errors.availableHavanCounts && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.availableHavanCounts}
                </p>
              )}
            </div>

            {/* Available Days */}
            <div className="p-4 rounded-xl bg-cream-50/60 border border-cream-200">
              <label className="label-field">
                Available Ceremony Durations (Days) <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap gap-1.5 mb-3 min-h-[38px] p-2 bg-white rounded-lg border border-cream-200">
                {form.availableDays.map((day) => (
                  <span
                    key={day}
                    className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-xs font-medium"
                  >
                    <Calendar className="w-3 h-3 text-amber-600" />
                    {day} Day{day > 1 ? "s" : ""}
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(day)}
                      className="text-amber-500 hover:text-red-600 focus:outline-none"
                      title={`Remove ${day} day(s)`}
                      disabled={submitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  className="input-field text-xs py-1.5"
                  value={newDayInput}
                  onChange={(e) => setNewDayInput(e.target.value)}
                  placeholder="Add days (e.g. 5)"
                  disabled={submitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newDayInput) {
                        handleAddDay(parseInt(newDayInput, 10));
                        setNewDayInput("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDayInput) {
                      handleAddDay(parseInt(newDayInput, 10));
                      setNewDayInput("");
                    }
                  }}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                  disabled={submitting || !newDayInput}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Quick Day Presets */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[11px] text-charcoal-400">Presets:</span>
                {[1, 2, 3, 5, 7, 9].map((dCount) => (
                  <button
                    type="button"
                    key={dCount}
                    onClick={() => handleAddDay(dCount)}
                    className="text-[11px] px-1.5 py-0.5 bg-cream-100 hover:bg-cream-200 text-charcoal-700 rounded transition"
                  >
                    +{dCount}D
                  </button>
                ))}
              </div>

              {errors.availableDays && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.availableDays}
                </p>
              )}
            </div>
          </div>

          {/* Coupling Rule Feedback Banner */}
          {couplingViolation ? (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Coupling Rule Violation:</strong>
                1 Havan cannot be configured as a multi-day ceremony. Since availableHavanCounts is [1], availableDays cannot contain values &gt; 1. Add multi-havan counts (e.g. 3, 5) or remove multi-day options.
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-lg bg-cream-50 border border-cream-200 text-xs text-charcoal-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>
                Coupling Valid: Current configuration allows single and multi-havan options aligned with duration.
              </span>
            </div>
          )}

          {errors.coupling && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.coupling}
            </p>
          )}
        </div>

        {/* Section 4: Pandit Configuration */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Users className="w-4 h-4 text-saffron-600" /> 4. Vedic Scholar Hierarchy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="homa-min-pandits" className="label-field">
                Minimum Scholars <span className="text-red-500">*</span>
              </label>
              <input
                id="homa-min-pandits"
                type="number"
                min="1"
                className="input-field"
                value={form.minimumPandits}
                onChange={(e) => setForm((p) => ({ ...p, minimumPandits: e.target.value }))}
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="homa-rec-pandits" className="label-field">
                Recommended Scholars <span className="text-red-500">*</span>
              </label>
              <input
                id="homa-rec-pandits"
                type="number"
                min="1"
                className="input-field"
                value={form.recommendedPandits}
                onChange={(e) => setForm((p) => ({ ...p, recommendedPandits: e.target.value }))}
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="homa-max-pandits" className="label-field">
                Maximum Scholars <span className="text-red-500">*</span>
              </label>
              <input
                id="homa-max-pandits"
                type="number"
                min="1"
                className="input-field"
                value={form.maximumPandits}
                onChange={(e) => setForm((p) => ({ ...p, maximumPandits: e.target.value }))}
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-3">
              <label htmlFor="homa-required-skills" className="label-field">
                Scholar Skill Requirements
              </label>
              <input
                id="homa-required-skills"
                type="text"
                className="input-field"
                value={form.requiredSkills}
                onChange={(e) => setForm((p) => ({ ...p, requiredSkills: e.target.value }))}
                placeholder="e.g. Rigveda Mandalam, Homa Vidhi, Samagri Ahuti"
                disabled={submitting}
              />
            </div>
          </div>

          {errors.pandits && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.pandits}
            </p>
          )}

          <div className="mt-3 p-3 rounded-lg bg-cream-50 border border-cream-200 text-xs text-charcoal-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>
              Pandit Hierarchy: <strong>{form.minimumPandits || 2}</strong> (min) &le;{" "}
              <strong>{form.recommendedPandits || 3}</strong> (rec) &le;{" "}
              <strong>{form.maximumPandits || 11}</strong> (max). Scholars receive ₹0 surcharge in Homa customer pricing.
            </span>
          </div>
        </div>

        {/* Section 5: Authoritative Pricing (Formula Synchronized) */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-2 pb-2 border-b border-cream-100">
            <DollarSign className="w-4 h-4 text-saffron-600" /> 5. Authoritative Pricing Configuration
          </h3>

          <p className="text-xs text-charcoal-500 mb-4">
            Starting price is strictly synchronized with Base Price. The runtime formula is:{" "}
            <code className="bg-cream-100 px-1 py-0.5 rounded text-charcoal-800 font-mono text-[11px]">
              Total = basePrice + (havanCount - 1) * perHavanPrice + (days - 1) * perDayPrice
            </code>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="homa-base-price" className="label-field">
                Base Price (₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-charcoal-400 font-semibold">₹</span>
                <input
                  id="homa-base-price"
                  type="number"
                  min="0"
                  step="500"
                  className={`input-field pl-7 font-mono font-semibold ${errors.basePrice ? "border-red-400" : ""}`}
                  value={form.basePrice}
                  onChange={(e) => setForm((p) => ({ ...p, basePrice: e.target.value }))}
                  disabled={submitting}
                />
              </div>
              <p className="text-[11px] text-charcoal-400 mt-1">Synchronizes startingPrice</p>
              {errors.basePrice && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.basePrice}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="homa-havan-price" className="label-field">
                Per Additional Havan (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-charcoal-400 font-semibold">₹</span>
                <input
                  id="homa-havan-price"
                  type="number"
                  min="0"
                  step="500"
                  className="input-field pl-7 font-mono"
                  value={form.perHavanPrice}
                  onChange={(e) => setForm((p) => ({ ...p, perHavanPrice: e.target.value }))}
                  disabled={submitting}
                />
              </div>
              <p className="text-[11px] text-charcoal-400 mt-1">Added per havan count &gt; 1</p>
            </div>

            <div>
              <label htmlFor="homa-day-price" className="label-field">
                Per Additional Day (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-charcoal-400 font-semibold">₹</span>
                <input
                  id="homa-day-price"
                  type="number"
                  min="0"
                  step="500"
                  className="input-field pl-7 font-mono"
                  value={form.perDayPrice}
                  onChange={(e) => setForm((p) => ({ ...p, perDayPrice: e.target.value }))}
                  disabled={submitting}
                />
              </div>
              <p className="text-[11px] text-charcoal-400 mt-1">Added per duration day &gt; 1</p>
            </div>
          </div>

          {/* Pricing Preview Callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-saffron-50/60 border border-saffron-200">
            <span className="text-xs font-semibold text-saffron-900 block mb-2">
              Formula Sample Calculations:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {pricingPreview.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded-lg border border-saffron-100 text-xs">
                  <span className="text-charcoal-500 block text-[11px]">{item.label}</span>
                  <span className="font-bold text-charcoal-800 text-sm">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Operational & Location Availability */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Clock className="w-4 h-4 text-saffron-600" /> 6. Operational & Location Availability
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="homa-daily-hours" className="label-field">
                Daily Ceremony Hours
              </label>
              <input
                id="homa-daily-hours"
                type="text"
                className="input-field"
                value={form.dailyHours}
                onChange={(e) => setForm((p) => ({ ...p, dailyHours: e.target.value }))}
                placeholder="e.g. 3 – 4 Hours Daily"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="homa-capacity-pandit" className="label-field">
                Havan Capacity per Pandit
              </label>
              <input
                id="homa-capacity-pandit"
                type="text"
                className="input-field"
                value={form.havanCapacityPerPandit}
                onChange={(e) => setForm((p) => ({ ...p, havanCapacityPerPandit: e.target.value }))}
                placeholder="e.g. 1 – 2 Havans Daily"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={form.isKashiAvailable}
                onChange={(e) => setForm((p) => ({ ...p, isKashiAvailable: e.target.checked }))}
                className="rounded text-saffron-600 focus:ring-saffron-500"
                disabled={submitting}
              />
              <div>
                <span className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-saffron-600" /> Kashi (In-Person)
                </span>
                <p className="text-[11px] text-charcoal-400">Performed in Varanasi</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={form.isRemoteAvailable}
                onChange={(e) => setForm((p) => ({ ...p, isRemoteAvailable: e.target.checked }))}
                className="rounded text-blue-600 focus:ring-blue-500"
                disabled={submitting}
              />
              <div>
                <span className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" /> Remote Sankalpa
                </span>
                <p className="text-[11px] text-charcoal-400">Live streamed ritual</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                className="rounded text-amber-600 focus:ring-amber-500"
                disabled={submitting}
              />
              <div>
                <span className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured
                </span>
                <p className="text-[11px] text-charcoal-400">Catalogue highlight</p>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-lg border border-cream-200 hover:bg-cream-50 transition cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded text-green-600 focus:ring-green-500"
                disabled={submitting}
              />
              <div>
                <span className="text-xs font-semibold text-charcoal-800 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-green-600" /> Active in Public
                </span>
                <p className="text-[11px] text-charcoal-400">Bookable by customers</p>
              </div>
            </label>
          </div>
        </div>

        {/* Section 7: Media Assets */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <ImageIcon className="w-4 h-4 text-saffron-600" /> 7. Media Assets (Cloudinary URLs)
          </h3>

          <div className="space-y-5">
            {/* Banner Image */}
            <div>
              <label className="label-field">Banner Image</label>
              <div className="flex items-start gap-4 flex-wrap">
                {form.bannerImage ? (
                  <div className="relative group">
                    <img
                      src={form.bannerImage}
                      alt="Homa Banner"
                      className="w-44 h-28 object-cover rounded-xl border border-cream-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, bannerImage: "" }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition"
                      title="Remove banner"
                      disabled={submitting}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-44 h-28 rounded-xl border-2 border-dashed border-cream-300 bg-cream-50/50 flex flex-col items-center justify-center text-charcoal-400">
                    <ImageIcon className="w-6 h-6 text-charcoal-300 mb-1" />
                    <span className="text-xs">No banner set</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    ref={bannerInputRef}
                    onChange={handleBannerSelect}
                    className="hidden"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={bannerUploading || submitting}
                    className="btn-secondary text-xs px-3 py-2 flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {bannerUploading ? "Uploading..." : "Upload Banner"}
                  </button>
                  <p className="text-[11px] text-charcoal-400">
                    JPG, PNG, or WEBP up to 10MB. Stored in veda-structure/homa-services/banners.
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="pt-3 border-t border-cream-100">
              <label className="label-field">Gallery Images</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={imgUrl}
                      alt={`Homa Gallery ${idx + 1}`}
                      className="w-24 h-20 object-cover rounded-lg border border-cream-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => {
                          const updated = [...p.galleryImages];
                          updated.splice(idx, 1);
                          return { ...p, galleryImages: updated };
                        })
                      }
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition"
                      title="Remove image"
                      disabled={submitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  ref={galleryInputRef}
                  onChange={handleGallerySelect}
                  className="hidden"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={galleryUploading || submitting}
                  className="w-24 h-20 rounded-lg border-2 border-dashed border-cream-300 hover:border-saffron-400 bg-cream-50/50 hover:bg-saffron-50/30 flex flex-col items-center justify-center text-charcoal-400 transition"
                  title="Upload Gallery Images"
                >
                  <Upload className="w-4 h-4 text-charcoal-400 mb-1" />
                  <span className="text-[11px] font-medium">Add Photos</span>
                </button>
              </div>

              {galleryProgress && (
                <p className="text-xs text-saffron-700">
                  Uploading {galleryProgress.current} of {galleryProgress.total}...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 8: Samagri & Prasad */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Package className="w-4 h-4 text-saffron-600" /> 8. Samagri & Prasad
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="homa-prasad" className="label-field">
                Prasad Details
              </label>
              <input
                id="homa-prasad"
                type="text"
                className="input-field"
                value={form.prasad}
                onChange={(e) => setForm((p) => ({ ...p, prasad: e.target.value }))}
                placeholder="e.g. Blessed Bhasma (sacred ash), Panchamrit, and Dry Fruits..."
                disabled={submitting}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">Homa Samagri List</label>
                <button
                  type="button"
                  onClick={handleAddSamagri}
                  className="text-xs text-saffron-700 hover:text-saffron-800 font-semibold flex items-center gap-1"
                  disabled={submitting}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Samagri Item
                </button>
              </div>

              <div className="space-y-2">
                {form.samagri.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input-field text-xs flex-1"
                      value={item.name}
                      onChange={(e) => handleUpdateSamagri(idx, "name", e.target.value)}
                      placeholder="e.g. Desi Cow Ghee (Pure A2)"
                      disabled={submitting}
                    />
                    <select
                      className="input-field text-xs w-36"
                      value={item.status}
                      onChange={(e) => handleUpdateSamagri(idx, "status", e.target.value)}
                      disabled={submitting}
                    >
                      <option value="included">Included</option>
                      <option value="optional">Optional</option>
                      <option value="additional">Additional</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveSamagri(idx)}
                      className="p-2 text-charcoal-400 hover:text-red-600 hover:bg-cream-100 rounded transition"
                      disabled={submitting}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 9: Sankalpa Fields */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-3 pb-2 border-b border-cream-100">
            <Gift className="w-4 h-4 text-saffron-600" /> 9. Sankalpa Requirements
          </h3>

          <p className="text-xs text-charcoal-500 mb-3">
            Select the Yajman details required during the customer booking wizard step:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: "gotra", label: "Gotra" },
              { key: "nakshatra", label: "Nakshatra" },
              { key: "rashi", label: "Rashi" },
              { key: "deity", label: "Ishta Devata" },
              { key: "specialInstructions", label: "Special Wish" },
            ].map((f) => (
              <label
                key={f.key}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-cream-200 hover:bg-cream-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.sankalpaFields[f.key as keyof typeof form.sankalpaFields]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      sankalpaFields: {
                        ...p.sankalpaFields,
                        [f.key]: e.target.checked,
                      },
                    }))
                  }
                  className="rounded text-saffron-600 focus:ring-saffron-500"
                  disabled={submitting}
                />
                <span className="text-xs font-medium text-charcoal-700">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 10: SEO Metadata */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Globe className="w-4 h-4 text-saffron-600" /> 10. Search Engine Optimization (SEO)
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="homa-seo-title" className="label-field">
                SEO Meta Title
              </label>
              <input
                id="homa-seo-title"
                type="text"
                className="input-field"
                value={form.seoTitle}
                onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
                placeholder="e.g. Maha Ganapati Homa in Kashi | Online Booking & Live Stream"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="homa-seo-desc" className="label-field">
                Meta Description
              </label>
              <textarea
                id="homa-seo-desc"
                rows={2}
                className="input-field"
                value={form.seoDescription}
                onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
                placeholder="Comprehensive meta description for search engine indexers..."
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="homa-seo-keywords" className="label-field">
                Keywords (Comma Separated)
              </label>
              <input
                id="homa-seo-keywords"
                type="text"
                className="input-field"
                value={form.seoKeywords}
                onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))}
                placeholder="ganapati homa, havan varanasi, vedic ritual kashi"
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Section 11: Frequently Asked Questions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-100">
            <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-saffron-600" /> 11. Frequently Asked Questions (FAQs)
            </h3>
            <button
              type="button"
              onClick={handleAddFaq}
              className="text-xs text-saffron-700 hover:text-saffron-800 font-semibold flex items-center gap-1"
              disabled={submitting}
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {form.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-cream-50/50 border border-cream-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    className="input-field text-xs font-semibold flex-1"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                    placeholder="FAQ Question..."
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-cream-100 rounded transition"
                    title="Remove FAQ"
                    disabled={submitting}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  className="input-field text-xs"
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                  placeholder="FAQ Answer..."
                  disabled={submitting}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
          <Link
            to="/admin/homa-services"
            className="btn-secondary text-sm px-4 py-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || couplingViolation}
            className="btn-primary text-sm px-5 py-2 flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving..." : isEdit ? "Update Homa Service" : "Create Homa Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
