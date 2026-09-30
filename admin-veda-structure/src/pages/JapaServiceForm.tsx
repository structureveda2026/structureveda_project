import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Save,
  Plus,
  Trash2,
  HelpCircle,
  Image as ImageIcon,
  Upload,
  X,
  Clock,
  Users,
  Sparkles,
  BookOpen,
  Layers,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Tag,
  Hash,
  Shield,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import mediaUploadService from "@/services/mediaUploadService";
import japaServiceCatalogueService, {
  JapaPurpose,
  JapaCountVariant,
  JapaFaqItem,
  JapaServicePayload,
} from "@/services/japaServiceCatalogueService";
import { ApiError } from "@/services/api";

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
  mantra?: string;
  startingPrice?: string;
  availableCounts?: string;
  pandits?: string;
  variants?: string;
}

interface FormState {
  name: string;
  slug: string;
  mantra: string;
  mantraMeaning: string;
  shortDescription: string;
  description: string;
  purposeId: string;
  purposeSummary: string;
  purposeCategory: string;
  purposeCategories: string[];
  availableCounts: number[];
  variants: JapaCountVariant[];
  dailyCapacityPerPandit: string;
  minimumPandits: string;
  recommendedPandits: string;
  maximumPandits: string;
  requiredSkills: string;
  dailyHours: string;
  completionWindow: string;
  startingPrice: string;
  isKashiAvailable: boolean;
  isRemoteAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string;
  galleryImages: string[];
  samagri: string[];
  prasad: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  faqs: JapaFaqItem[];
}

const DEFAULT_COUNTS = [11000, 21000, 51000, 125000];

export default function JapaServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [purposes, setPurposes] = useState<JapaPurpose[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Custom count input field state
  const [newCountInput, setNewCountInput] = useState("");

  // Media upload states
  const [bannerUploading, setBannerUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    mantra: "",
    mantraMeaning: "",
    shortDescription: "",
    description: "",
    purposeId: "",
    purposeSummary: "",
    purposeCategory: "",
    purposeCategories: [],
    availableCounts: DEFAULT_COUNTS,
    variants: [
      {
        count: 11000,
        label: "11,000 Japa",
        startingPrice: 15000,
        estimatedDuration: "3 Days",
        minimumPandits: 2,
        recommendedPandits: 2,
        dailyCapacity: 2000,
      },
      {
        count: 21000,
        label: "21,000 Japa",
        startingPrice: 24000,
        estimatedDuration: "4 Days",
        minimumPandits: 2,
        recommendedPandits: 3,
        dailyCapacity: 2000,
      },
      {
        count: 51000,
        label: "51,000 Japa",
        startingPrice: 45000,
        estimatedDuration: "6 Days",
        minimumPandits: 3,
        recommendedPandits: 5,
        dailyCapacity: 2000,
      },
      {
        count: 125000,
        label: "1,25,000 Japa",
        startingPrice: 85000,
        estimatedDuration: "11 Days",
        minimumPandits: 5,
        recommendedPandits: 8,
        dailyCapacity: 2000,
      },
    ],
    dailyCapacityPerPandit: "2000",
    minimumPandits: "2",
    recommendedPandits: "4",
    maximumPandits: "11",
    requiredSkills: "Rigvedic Samhita & Rudrashtadhyayi Japa Acharyas",
    dailyHours: "4 Hours Daily",
    completionWindow: "3 to 11 Days",
    startingPrice: "15000",
    isKashiAvailable: true,
    isRemoteAvailable: true,
    isFeatured: false,
    isActive: true,
    bannerImage: "",
    galleryImages: [],
    samagri: ["Rudraksha Mala", "Gangajal", "Pure Desi Ghee", "Dhoop & Deepam"],
    prasad: "Consecrated Rudraksha and energized Vibhuti (where applicable)",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    faqs: [
      {
        question: "How is the daily chanting count tracked?",
        answer: "Each designated priest tracks recitation using traditional Rudraksha chanting malas and disciplined tally metrics under senior Acharya supervision.",
      },
    ],
  });

  // 1. Fetch available purposes dynamically
  useEffect(() => {
    let isMounted = true;
    japaServiceCatalogueService
      .getJapaPurposes()
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
        console.warn("Could not load Japa purposes:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [isEdit]);

  // 2. Fetch existing service in EDIT mode
  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);

    japaServiceCatalogueService
      .getJapaService(id)
      .then((data) => {
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          mantra: data.mantra || "",
          mantraMeaning: data.mantraMeaning || "",
          shortDescription: data.shortDescription || "",
          description: data.description || "",
          purposeId: data.purposeId || "",
          purposeSummary: data.purposeSummary || "",
          purposeCategory: data.purposeCategory || "",
          purposeCategories: Array.isArray(data.purposeCategories) ? data.purposeCategories : [],
          availableCounts:
            Array.isArray(data.availableCounts) && data.availableCounts.length > 0
              ? data.availableCounts
              : DEFAULT_COUNTS,
          variants: Array.isArray(data.variants) ? data.variants : [],
          dailyCapacityPerPandit: String(data.dailyCapacityPerPandit || 2000),
          minimumPandits: String(data.minimumPandits || 2),
          recommendedPandits: String(data.recommendedPandits || 4),
          maximumPandits: String(data.maximumPandits || 11),
          requiredSkills: data.requiredSkills || "",
          dailyHours: data.dailyHours || "4 Hours Daily",
          completionWindow: data.completionWindow || "",
          startingPrice: String(data.startingPrice || 0),
          isKashiAvailable: Boolean(data.isKashiAvailable),
          isRemoteAvailable: Boolean(data.isRemoteAvailable),
          isFeatured: Boolean(data.isFeatured),
          isActive: Boolean(data.isActive),
          bannerImage: data.bannerImage || "",
          galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
          samagri: Array.isArray(data.samagri) ? data.samagri : [],
          prasad: data.prasad || "",
          seoTitle: data.seo?.title || data.seo?.metaTitle || "",
          seoDescription: data.seo?.description || data.seo?.metaDescription || "",
          seoKeywords: Array.isArray(data.seo?.keywords)
            ? data.seo.keywords.join(", ")
            : data.seo?.keywords || "",
          faqs: Array.isArray(data.faqs) && data.faqs.length > 0
            ? data.faqs
            : [{ question: "", answer: "" }],
        });
        setSlugManuallyEdited(true);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Unable to load Japa service.";
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

  // Purpose selection handler
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

  // Category toggle handler
  const handleToggleCategory = (categorySlug: string) => {
    setForm((prev) => {
      const exists = prev.purposeCategories.includes(categorySlug);
      const nextCategories = exists
        ? prev.purposeCategories.filter((c) => c !== categorySlug)
        : [...prev.purposeCategories, categorySlug];
      return {
        ...prev,
        purposeCategories: nextCategories,
      };
    });
  };

  // Available Counts Handlers
  const handleAddAvailableCount = (countNum: number) => {
    if (!Number.isInteger(countNum) || countNum <= 0) {
      toast.error("Count must be a positive integer.");
      return;
    }
    if (form.availableCounts.includes(countNum)) {
      toast.info(`Count ${countNum.toLocaleString("en-IN")} is already in the list.`);
      return;
    }
    const updatedCounts = [...form.availableCounts, countNum].sort((a, b) => a - b);
    setForm((prev) => ({
      ...prev,
      availableCounts: updatedCounts,
    }));
    setNewCountInput("");
    if (errors.availableCounts) setErrors((p) => ({ ...p, availableCounts: undefined }));
  };

  const handleRemoveAvailableCount = (countToRemove: number) => {
    if (form.availableCounts.length <= 1) {
      toast.error("A Japa service must provide at least one recitation count.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      availableCounts: prev.availableCounts.filter((c) => c !== countToRemove),
    }));
  };

  // Variants Management
  const handleAddVariant = () => {
    const unusedCount = form.availableCounts.find(
      (c) => !form.variants.some((v) => Number(v.count) === c)
    );
    const countToUse = unusedCount || form.availableCounts[0] || 11000;
    const newVariant: JapaCountVariant = {
      count: countToUse,
      startingPrice: Number(form.startingPrice) || 0,
      label: `${countToUse.toLocaleString("en-IN")} Japa`,
      estimatedDuration: "3 Days",
      minimumPandits: Number(form.minimumPandits) || 2,
      recommendedPandits: Number(form.recommendedPandits) || 3,
      dailyCapacity: Number(form.dailyCapacityPerPandit) || 2000,
    };
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }));
  };

  const handleUpdateVariant = (
    index: number,
    field: keyof JapaCountVariant,
    value: string | number
  ) => {
    setForm((prev) => {
      const nextVariants = [...prev.variants];
      const target = { ...nextVariants[index] };
      if (
        field === "count" ||
        field === "startingPrice" ||
        field === "minimumPandits" ||
        field === "recommendedPandits" ||
        field === "dailyCapacity"
      ) {
        const numVal = value === "" ? 0 : Number(value);
        (target as Record<string, unknown>)[field] = isNaN(numVal) ? 0 : numVal;
      } else {
        (target as Record<string, unknown>)[field] = String(value);
      }
      nextVariants[index] = target;
      return { ...prev, variants: nextVariants };
    });
  };

  const handleRemoveVariant = (index: number) => {
    setForm((prev) => {
      const nextVariants = [...prev.variants];
      nextVariants.splice(index, 1);
      return { ...prev, variants: nextVariants };
    });
  };

  const handleAutoGenerateVariants = () => {
    const existingCounts = new Set(form.variants.map((v) => Number(v.count)));
    const missingCounts = form.availableCounts.filter((c) => !existingCounts.has(c));

    if (missingCounts.length === 0) {
      toast.info("All available counts already have a corresponding variant tier.");
      return;
    }

    const defaultMinP = parseInt(form.minimumPandits, 10) || 2;
    const defaultRecP = parseInt(form.recommendedPandits, 10) || 4;
    const defaultCap = parseInt(form.dailyCapacityPerPandit, 10) || 2000;

    const newVariants: JapaCountVariant[] = missingCounts.map((count) => {
      const totalDailyChants = defaultRecP * defaultCap;
      const days = Math.ceil(count / totalDailyChants);
      return {
        count,
        label: `${count.toLocaleString("en-IN")} Japa`,
        startingPrice: 0,
        estimatedDuration: `${days} Days`,
        minimumPandits: defaultMinP,
        recommendedPandits: defaultRecP,
        dailyCapacity: defaultCap,
      };
    });

    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, ...newVariants].sort((a, b) => a.count - b.count),
    }));
    toast.success(`Generated ${newVariants.length} variant tier(s). Set their starting prices.`);
  };

  // Sync starting price from lowest variant
  const handleSyncStartingPriceFromVariants = () => {
    if (form.variants.length === 0) return;
    const validPrices = form.variants
      .map((v) => Number(v.startingPrice))
      .filter((p) => !isNaN(p) && p > 0);
    if (validPrices.length > 0) {
      const minPrice = Math.min(...validPrices);
      setForm((p) => ({ ...p, startingPrice: String(minPrice) }));
      toast.info(`Starting price set to lowest variant: ₹${minPrice.toLocaleString("en-IN")}`);
    }
  };

  // Samagri repeaters
  const handleAddSamagri = () => {
    setForm((p) => ({ ...p, samagri: [...p.samagri, ""] }));
  };

  const handleUpdateSamagri = (idx: number, val: string) => {
    setForm((p) => {
      const updated = [...p.samagri];
      updated[idx] = val;
      return { ...p, samagri: updated };
    });
  };

  const handleRemoveSamagri = (idx: number) => {
    setForm((p) => {
      const updated = [...p.samagri];
      updated.splice(idx, 1);
      return { ...p, samagri: updated };
    });
  };

  // FAQ repeaters
  const handleAddFaq = () => {
    setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }));
  };

  const handleUpdateFaq = (idx: number, field: "question" | "answer", val: string) => {
    setForm((p) => {
      const updated = [...p.faqs];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...p, faqs: updated };
    });
  };

  const handleRemoveFaq = (idx: number) => {
    setForm((p) => {
      const updated = [...p.faqs];
      updated.splice(idx, 1);
      return { ...p, faqs: updated };
    });
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
        folder: "veda-structure/japa-services/banners",
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
        folder: "veda-structure/japa-services/gallery",
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

  // Client Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Service name is required.";
    }
    if (!form.slug.trim()) {
      newErrors.slug = "Service slug is required.";
    }
    if (!form.mantra.trim()) {
      newErrors.mantra = "Mantra is required.";
    }

    const priceNum = Number(form.startingPrice);
    if (form.startingPrice === "" || isNaN(priceNum) || priceNum < 0) {
      newErrors.startingPrice = "Starting price must be a non-negative number.";
    }

    if (!Array.isArray(form.availableCounts) || form.availableCounts.length === 0) {
      newErrors.availableCounts = "At least one positive recitation count is required.";
    }

    const minP = parseInt(form.minimumPandits, 10);
    const recP = parseInt(form.recommendedPandits, 10);
    const maxP = parseInt(form.maximumPandits, 10);
    const cap = parseInt(form.dailyCapacityPerPandit, 10);

    if (isNaN(minP) || minP <= 0 || isNaN(recP) || recP <= 0 || isNaN(maxP) || maxP <= 0) {
      newErrors.pandits = "Pandit counts must be positive integers.";
    } else if (minP > recP) {
      newErrors.pandits = `Minimum pandits (${minP}) cannot exceed recommended pandits (${recP}).`;
    } else if (recP > maxP) {
      newErrors.pandits = `Recommended pandits (${recP}) cannot exceed maximum pandits (${maxP}).`;
    } else if (isNaN(cap) || cap <= 0) {
      newErrors.pandits = "Daily capacity per pandit must be a positive integer.";
    }

    // Check variant count validity
    for (const v of form.variants) {
      const vCount = Number(v.count);
      const vPrice = Number(v.startingPrice);
      if (!Number.isInteger(vCount) || vCount <= 0) {
        newErrors.variants = "All variants must have a valid positive integer count.";
        break;
      }
      if (isNaN(vPrice) || vPrice < 0) {
        newErrors.variants = "All variant prices must be non-negative numbers.";
        break;
      }
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
      // Build clean payload adhering to the authoritative backend contract
      const payload: JapaServicePayload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        mantra: form.mantra.trim(),
        mantraMeaning: form.mantraMeaning.trim() || null,
        shortDescription: form.shortDescription.trim() || null,
        description: form.description.trim() || null,
        purposeId: form.purposeId || null,
        purposeSummary: form.purposeSummary.trim() || null,
        purposeCategory: form.purposeCategory.trim() || null,
        purposeCategories: form.purposeCategories,
        availableCounts: form.availableCounts.map(Number),
        variants: form.variants.map((v) => ({
          count: Number(v.count),
          startingPrice: Number(v.startingPrice),
          label: v.label?.trim() || `${Number(v.count).toLocaleString("en-IN")} Japa`,
          estimatedDuration: v.estimatedDuration?.trim() || undefined,
          minimumPandits: v.minimumPandits ? Number(v.minimumPandits) : undefined,
          recommendedPandits: v.recommendedPandits ? Number(v.recommendedPandits) : undefined,
          dailyCapacity: v.dailyCapacity ? Number(v.dailyCapacity) : undefined,
        })),
        dailyCapacityPerPandit: parseInt(form.dailyCapacityPerPandit, 10) || 2000,
        minimumPandits: parseInt(form.minimumPandits, 10) || 2,
        recommendedPandits: parseInt(form.recommendedPandits, 10) || 4,
        maximumPandits: parseInt(form.maximumPandits, 10) || 11,
        requiredSkills: form.requiredSkills.trim() || null,
        dailyHours: form.dailyHours.trim() || "4 Hours Daily",
        completionWindow: form.completionWindow.trim() || null,
        startingPrice: Number(form.startingPrice),
        isKashiAvailable: form.isKashiAvailable,
        isRemoteAvailable: form.isRemoteAvailable,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        bannerImage: form.bannerImage.trim() || null,
        galleryImages: form.galleryImages.filter((img) => Boolean(img && img.trim())),
        samagri: form.samagri.map((s) => s.trim()).filter(Boolean),
        prasad: form.prasad.trim() || null,
        seo: {
          title: form.seoTitle.trim() || undefined,
          description: form.seoDescription.trim() || undefined,
          keywords: form.seoKeywords.trim()
            ? form.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
            : undefined,
        },
        faqs: form.faqs
          .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
          .filter((f) => f.question || f.answer),
      };

      if (isEdit && id) {
        await japaServiceCatalogueService.updateJapaService(id, payload);
        toast.success(`Japa service "${form.name}" updated successfully.`);
        navigate("/admin/japa-services");
      } else {
        await japaServiceCatalogueService.createJapaService(payload);
        toast.success(`Japa service "${form.name}" created successfully.`);
        navigate("/admin/japa-services");
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setErrors((prev) => ({
            ...prev,
            slug: `Slug "${form.slug}" is already in use by another Japa service.`,
          }));
          toast.error(`Slug conflict: '${form.slug}' already exists. Please choose a distinct slug.`);
        } else if (err.status === 400) {
          toast.error(err.message || "Backend rejected invalid field parameters.");
        } else if (err.status === 401 || err.status === 403) {
          toast.error("Admin authorization failed. Please check your credentials.");
        } else {
          toast.error(err.message || "Failed to save Japa service.");
        }
      } else {
        const msg = err instanceof Error ? err.message : "Failed to save Japa service.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading Japa service details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Japa Service" : "New Japa Service"}
        subtitle={
          isEdit
            ? `Editing: ${form.name || "Japa Ritual"}`
            : "Create a structured Vedic Mantra Japa recitation service with authoritative variant tiers"
        }
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/japa-services" className="btn-secondary flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Cancel
            </Link>
            <button
              type="submit"
              form="japa-service-form"
              disabled={submitting}
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {submitting ? "Saving…" : isEdit ? "Update Service" : "Create Service"}
            </button>
          </div>
        }
      />

      <form id="japa-service-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Basic Information */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Sparkles className="w-4 h-4 text-saffron-600" /> 1. Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="japa-name" className="label-field">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                id="japa-name"
                type="text"
                className={`input-field ${errors.name ? "border-red-400 focus:border-red-500" : ""}`}
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Maha Mrityunjaya Japa"
                disabled={submitting}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="japa-slug" className="label-field">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="japa-slug"
                  type="text"
                  className={`input-field font-mono text-sm ${
                    errors.slug ? "border-red-400 focus:border-red-500" : ""
                  }`}
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g. maha-mrityunjaya-japa"
                  disabled={submitting}
                />
              </div>
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="japa-mantra" className="label-field">
                Vedic Mantra (Devanagari / IAST) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="japa-mantra"
                rows={2}
                className={`input-field font-serif text-base leading-relaxed ${
                  errors.mantra ? "border-red-400 focus:border-red-500" : ""
                }`}
                value={form.mantra}
                onChange={(e) => {
                  setForm((p) => ({ ...p, mantra: e.target.value }));
                  if (errors.mantra) setErrors((p) => ({ ...p, mantra: undefined }));
                }}
                placeholder="ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्..."
                disabled={submitting}
              />
              {errors.mantra && <p className="text-xs text-red-500 mt-1">{errors.mantra}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="japa-mantra-meaning" className="label-field">
                Mantra Meaning / Significance
              </label>
              <textarea
                id="japa-mantra-meaning"
                rows={2}
                className="input-field text-sm"
                value={form.mantraMeaning}
                onChange={(e) => setForm((p) => ({ ...p, mantraMeaning: e.target.value }))}
                placeholder="Classical Sanskrit translation, deity invocation, and spiritual essence..."
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="japa-short-desc" className="label-field">
                Short Description (Listing Summary)
              </label>
              <textarea
                id="japa-short-desc"
                rows={2}
                className="input-field text-sm"
                value={form.shortDescription}
                onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
                placeholder="Brief 1-2 sentence overview for catalogue cards and search results..."
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="japa-full-desc" className="label-field">
                Full Description (Detailed Narrative)
              </label>
              <textarea
                id="japa-full-desc"
                rows={4}
                className="input-field text-sm"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="In-depth explanation of the Japa vidhi, traditional lineage, and spiritual benefits..."
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Purpose & Classification */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <BookOpen className="w-4 h-4 text-saffron-600" /> 2. Purpose & Classification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="japa-purpose" className="label-field">
                Primary Purpose
              </label>
              <select
                id="japa-purpose"
                className="input-field"
                value={form.purposeId}
                onChange={(e) => handlePurposeChange(e.target.value)}
                disabled={submitting}
              >
                <option value="">— Select Japa Purpose —</option>
                {purposes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="japa-purpose-summary" className="label-field">
                Purpose Summary
              </label>
              <input
                id="japa-purpose-summary"
                type="text"
                className="input-field"
                value={form.purposeSummary}
                onChange={(e) => setForm((p) => ({ ...p, purposeSummary: e.target.value }))}
                placeholder="e.g. Spiritual practice, peace, vitality and wellbeing"
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">
                Associated Classification Categories
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {purposes.map((p) => {
                  const isSelected = form.purposeCategories.includes(p.slug);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleToggleCategory(p.slug)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        isSelected
                          ? "bg-saffron-50 border-saffron-300 text-saffron-800"
                          : "bg-white border-cream-200 text-charcoal-600 hover:bg-cream-50"
                      }`}
                    >
                      <Tag className={`w-3.5 h-3.5 ${isSelected ? "text-saffron-600" : "text-charcoal-400"}`} />
                      {p.name}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-charcoal-400 mt-1.5">
                Categories are saved as tags for filtered discovery in the public catalogue.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Japa Recitation Configuration (Available Counts) */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-100">
            <div>
              <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
                <Hash className="w-4 h-4 text-saffron-600" /> 3. Japa Recitation Configuration
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Configure positive integer recitation targets offered for this Mantra Japa.
              </p>
            </div>
          </div>

          {/* Quick preset buttons & custom addition */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-charcoal-600 mb-1.5 block">
                Quick Count Presets (Click to add)
              </label>
              <div className="flex flex-wrap gap-2">
                {[11000, 21000, 51000, 100000, 125000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleAddAvailableCount(preset)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-cream-200 bg-cream-50 text-charcoal-700 hover:bg-cream-100 hover:border-cream-300 transition"
                  >
                    <Plus className="w-3 h-3 text-saffron-600" />
                    {preset.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="number"
                min="1"
                step="1000"
                className="input-field py-1.5 text-xs font-mono flex-1"
                placeholder="Add custom count (e.g. 31000)"
                value={newCountInput}
                onChange={(e) => setNewCountInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newCountInput) handleAddAvailableCount(Number(newCountInput));
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newCountInput) handleAddAvailableCount(Number(newCountInput));
                }}
                className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Configured Counts Pill List */}
            <div>
              <label className="text-xs font-medium text-charcoal-600 mb-1.5 block">
                Configured Recitation Counts <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {form.availableCounts.map((count) => (
                  <div
                    key={count}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-saffron-50 border border-saffron-200 text-saffron-900 text-xs font-mono font-semibold"
                  >
                    <span>{count.toLocaleString("en-IN")} Japa</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAvailableCount(count)}
                      className="text-saffron-600 hover:text-red-600 transition"
                      title={`Remove ${count}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.availableCounts && (
                <p className="text-xs text-red-500 mt-1">{errors.availableCounts}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Authoritative Variant Tiers & Starting Price */}
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-cream-100">
            <div>
              <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-saffron-600" /> 4. Pricing & Recitation Variant Tiers
              </h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Variants are consumed directly by the authoritative pricing engine (
                <code className="text-saffron-700 bg-saffron-50 px-1 py-0.5 rounded font-mono text-[11px]">
                  calculateJapaPriceInternal
                </code>
                ).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoGenerateVariants}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-saffron-50 border border-saffron-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Auto-sync Missing Counts
              </button>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-cream-100 border border-cream-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tier
              </button>
            </div>
          </div>

          {/* Starting Price Field */}
          <div className="mb-5 p-3 rounded-lg bg-cream-50 border border-cream-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <label htmlFor="japa-starting-price" className="label-field mb-0 text-xs">
                Base Starting Price (INR) <span className="text-red-500">*</span>
              </label>
              <p className="text-[11px] text-charcoal-500">
                Catalogue display price (typically lowest recitation tier).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 font-serif text-sm">
                  ₹
                </span>
                <input
                  id="japa-starting-price"
                  type="number"
                  min="0"
                  step="500"
                  className={`input-field pl-7 py-1.5 text-sm font-semibold max-w-[160px] ${
                    errors.startingPrice ? "border-red-400" : ""
                  }`}
                  value={form.startingPrice}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, startingPrice: e.target.value }));
                    if (errors.startingPrice) setErrors((p) => ({ ...p, startingPrice: undefined }));
                  }}
                  placeholder="15000"
                  disabled={submitting}
                />
              </div>
              <button
                type="button"
                onClick={handleSyncStartingPriceFromVariants}
                className="text-xs text-charcoal-600 hover:text-saffron-700 border border-cream-300 rounded px-2 py-1.5 hover:bg-cream-100 transition"
                title="Update starting price to match the cheapest variant"
              >
                Match Lowest Variant
              </button>
            </div>
            {errors.startingPrice && (
              <p className="w-full text-xs text-red-500 mt-1">{errors.startingPrice}</p>
            )}
          </div>

          {/* Variant Rows */}
          <div className="space-y-3">
            {form.variants.map((variant, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-white border border-cream-200 hover:border-saffron-300 transition-colors shadow-sm space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                  {/* Count selector */}
                  <div>
                    <label className="text-xs font-medium text-charcoal-600 block mb-1">
                      Recitation Count <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="input-field py-1.5 text-xs font-mono"
                      value={variant.count}
                      onChange={(e) => handleUpdateVariant(idx, "count", Number(e.target.value))}
                      disabled={submitting}
                    >
                      {form.availableCounts.map((c) => (
                        <option key={c} value={c}>
                          {c.toLocaleString("en-IN")} Japa
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tier Label */}
                  <div>
                    <label className="text-xs font-medium text-charcoal-600 block mb-1">
                      Display Label
                    </label>
                    <input
                      type="text"
                      className="input-field py-1.5 text-xs"
                      placeholder="e.g. 11,000 Japa"
                      value={variant.label || ""}
                      onChange={(e) => handleUpdateVariant(idx, "label", e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  {/* Estimated Duration */}
                  <div>
                    <label className="text-xs font-medium text-charcoal-600 block mb-1">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      className="input-field py-1.5 text-xs"
                      placeholder="e.g. 3 Days"
                      value={variant.estimatedDuration || ""}
                      onChange={(e) => handleUpdateVariant(idx, "estimatedDuration", e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  {/* Tier Price */}
                  <div>
                    <label className="text-xs font-medium text-charcoal-600 block mb-1">
                      Price (INR) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 font-serif text-xs">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          className="input-field pl-6 py-1.5 text-xs font-semibold"
                          value={variant.startingPrice}
                          onChange={(e) =>
                            handleUpdateVariant(idx, "startingPrice", Number(e.target.value))
                          }
                          disabled={submitting}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1.5 text-charcoal-400 hover:text-red-600 rounded transition"
                        title="Remove variant"
                        disabled={submitting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optional overrides: Pandit configuration for this specific count */}
                <div className="pt-2 border-t border-cream-100 grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-charcoal-400 block mb-0.5">
                      Min Pandits (Override)
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input-field py-1 text-xs"
                      placeholder={form.minimumPandits}
                      value={variant.minimumPandits || ""}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "minimumPandits",
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-charcoal-400 block mb-0.5">
                      Rec. Pandits (Override)
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input-field py-1 text-xs"
                      placeholder={form.recommendedPandits}
                      value={variant.recommendedPandits || ""}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "recommendedPandits",
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-charcoal-400 block mb-0.5">
                      Daily Capacity/Pandit
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      className="input-field py-1 text-xs"
                      placeholder={form.dailyCapacityPerPandit}
                      value={variant.dailyCapacity || ""}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "dailyCapacity",
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            ))}

            {form.variants.length === 0 && (
              <p className="text-xs text-charcoal-400 italic p-3 text-center bg-cream-50 rounded-lg">
                No variant tiers defined yet. Click &quot;Auto-sync Missing Counts&quot; or &quot;Add Tier&quot; to configure pricing.
              </p>
            )}
            {errors.variants && <p className="text-xs text-red-500 mt-1">{errors.variants}</p>}
          </div>
        </div>

        {/* Section 5: Pandit Configuration & Capacity */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Users className="w-4 h-4 text-saffron-600" /> 5. Pandit Configuration & Capacity Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="japa-min-pandits" className="label-field">
                Minimum Pandits <span className="text-red-500">*</span>
              </label>
              <input
                id="japa-min-pandits"
                type="number"
                min="1"
                className="input-field"
                value={form.minimumPandits}
                onChange={(e) => {
                  setForm((p) => ({ ...p, minimumPandits: e.target.value }));
                  if (errors.pandits) setErrors((p) => ({ ...p, pandits: undefined }));
                }}
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="japa-rec-pandits" className="label-field">
                Recommended Pandits <span className="text-red-500">*</span>
              </label>
              <input
                id="japa-rec-pandits"
                type="number"
                min="1"
                className="input-field"
                value={form.recommendedPandits}
                onChange={(e) => {
                  setForm((p) => ({ ...p, recommendedPandits: e.target.value }));
                  if (errors.pandits) setErrors((p) => ({ ...p, pandits: undefined }));
                }}
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="japa-max-pandits" className="label-field">
                Maximum Pandits <span className="text-red-500">*</span>
              </label>
              <input
                id="japa-max-pandits"
                type="number"
                min="1"
                className="input-field"
                value={form.maximumPandits}
                onChange={(e) => {
                  setForm((p) => ({ ...p, maximumPandits: e.target.value }));
                  if (errors.pandits) setErrors((p) => ({ ...p, pandits: undefined }));
                }}
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="japa-daily-cap" className="label-field">
                Daily Capacity / Pandit <span className="text-red-500">*</span>
              </label>
              <input
                id="japa-daily-cap"
                type="number"
                min="100"
                step="100"
                className="input-field"
                value={form.dailyCapacityPerPandit}
                onChange={(e) => {
                  setForm((p) => ({ ...p, dailyCapacityPerPandit: e.target.value }));
                  if (errors.pandits) setErrors((p) => ({ ...p, pandits: undefined }));
                }}
                disabled={submitting}
              />
            </div>
          </div>
          {errors.pandits && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.pandits}
            </p>
          )}

          {/* Derived Capacity Information Callout */}
          <div className="mt-3 p-3 rounded-lg bg-cream-50 border border-cream-200 text-xs text-charcoal-600 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>
              Hierarchy: <strong>{form.minimumPandits || 2}</strong> (min) &le;{" "}
              <strong>{form.recommendedPandits || 4}</strong> (rec) &le;{" "}
              <strong>{form.maximumPandits || 11}</strong> (max). At{" "}
              <strong>{Number(form.dailyCapacityPerPandit || 2000).toLocaleString("en-IN")}</strong>{" "}
              chants/day/priest, a team of {form.recommendedPandits || 4} scholars recites{" "}
              <strong>
                {(
                  (Number(form.recommendedPandits) || 4) *
                  (Number(form.dailyCapacityPerPandit) || 2000)
                ).toLocaleString("en-IN")}
              </strong>{" "}
              chants/day.
            </span>
          </div>
        </div>

        {/* Section 6: Ritual Configuration */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Clock className="w-4 h-4 text-saffron-600" /> 6. Ritual Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="japa-daily-hours" className="label-field">
                Daily Recitation Hours
              </label>
              <input
                id="japa-daily-hours"
                type="text"
                className="input-field"
                value={form.dailyHours}
                onChange={(e) => setForm((p) => ({ ...p, dailyHours: e.target.value }))}
                placeholder="e.g. 4 Hours Daily"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="japa-completion-window" className="label-field">
                Completion Window
              </label>
              <input
                id="japa-completion-window"
                type="text"
                className="input-field"
                value={form.completionWindow}
                onChange={(e) => setForm((p) => ({ ...p, completionWindow: e.target.value }))}
                placeholder="e.g. 3 to 11 Days"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="japa-required-skills" className="label-field">
                Required Priest Skills / Sampradaya
              </label>
              <input
                id="japa-required-skills"
                type="text"
                className="input-field"
                value={form.requiredSkills}
                onChange={(e) => setForm((p) => ({ ...p, requiredSkills: e.target.value }))}
                placeholder="e.g. Rigvedic Samhita & Rudrashtadhyayi Japa Acharyas"
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Availability & Visibility */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Globe className="w-4 h-4 text-saffron-600" /> 7. Availability & Catalogue Visibility
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
                  <MapPin className="w-3.5 h-3.5 text-saffron-600" /> Kashi Venue
                </span>
                <p className="text-[11px] text-charcoal-400">Available in Varanasi</p>
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
                <p className="text-[11px] text-charcoal-400">Available via live stream</p>
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
                <p className="text-[11px] text-charcoal-400">Highlight in public catalogue</p>
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
                <p className="text-[11px] text-charcoal-400">Visible for bookings</p>
              </div>
            </label>
          </div>
        </div>

        {/* Section 8: Media (Banner & Gallery Images) */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <ImageIcon className="w-4 h-4 text-saffron-600" /> 8. Media Assets
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
                      alt="Japa Banner"
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
                    className="btn-secondary flex items-center gap-2 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {bannerUploading
                      ? "Uploading to Cloudinary…"
                      : form.bannerImage
                      ? "Replace Banner Image"
                      : "Upload Banner Image"}
                  </button>
                  <p className="text-[11px] text-charcoal-400">
                    JPG, PNG, or WEBP up to 10 MB. Cloudinary CDN hosted.
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div>
              <label className="label-field">Gallery Images</label>
              <div className="flex flex-wrap gap-3 mb-3">
                {form.galleryImages.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-24 h-20 object-cover rounded-lg border border-cream-200 shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          galleryImages: p.galleryImages.filter((_, i) => i !== idx),
                        }))
                      }
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition"
                      title="Remove image"
                      disabled={submitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  ref={galleryInputRef}
                  onChange={handleGallerySelect}
                  className="hidden"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={galleryUploading || submitting}
                  className="btn-secondary flex items-center gap-2 text-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {galleryUploading
                    ? galleryProgress
                      ? `Uploading ${galleryProgress.current} of ${galleryProgress.total}…`
                      : "Uploading images…"
                    : "Upload Gallery Images"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 9: Samagri & Prasad */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-100">
            <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-saffron-600" /> 9. Samagri & Prasad
            </h3>
            <button
              type="button"
              onClick={handleAddSamagri}
              className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              disabled={submitting}
            >
              <Plus className="w-3.5 h-3.5" /> Add Samagri Item
            </button>
          </div>

          {/* Samagri string list */}
          <div className="space-y-2 mb-4">
            {form.samagri.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono text-charcoal-400 w-6 text-right">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  className="input-field py-1.5 text-xs flex-1"
                  value={item}
                  onChange={(e) => handleUpdateSamagri(idx, e.target.value)}
                  placeholder="e.g. Rudraksha Mala, Shiva Linga Archana Samagri"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSamagri(idx)}
                  className="p-1.5 text-charcoal-400 hover:text-red-500 rounded transition"
                  title="Remove item"
                  disabled={submitting}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {form.samagri.length === 0 && (
              <p className="text-xs text-charcoal-400 italic">No specific samagri items entered.</p>
            )}
          </div>

          <div>
            <label htmlFor="japa-prasad" className="label-field">
              Consecrated Prasad Description
            </label>
            <input
              id="japa-prasad"
              type="text"
              className="input-field"
              value={form.prasad}
              onChange={(e) => setForm((p) => ({ ...p, prasad: e.target.value }))}
              placeholder="e.g. Consecrated Rudraksha and energized Vibhuti (where applicable)"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Section 10: FAQs */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-100">
            <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-saffron-600" /> 10. Frequently Asked Questions (FAQs)
            </h3>
            <button
              type="button"
              onClick={handleAddFaq}
              className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              disabled={submitting}
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {form.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-cream-50/60 border border-cream-200 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-saffron-600 mt-2 flex-shrink-0">
                    Q{idx + 1}
                  </span>
                  <input
                    type="text"
                    className="input-field py-1.5 text-xs flex-1"
                    placeholder="Question (e.g. Can this Japa be arranged on specific dates?)"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-1.5 text-charcoal-400 hover:text-red-500 rounded flex-shrink-0 mt-0.5"
                    title="Remove FAQ"
                    disabled={submitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-charcoal-400 mt-2 flex-shrink-0">
                    A{idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    className="input-field py-1.5 text-xs flex-1"
                    placeholder="Answer details..."
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>
            ))}

            {form.faqs.length === 0 && (
              <p className="text-xs text-charcoal-400 italic">No FAQs configured.</p>
            )}
          </div>
        </div>

        {/* Section 11: SEO Metadata */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2 mb-4 pb-2 border-b border-cream-100">
            <Globe className="w-4 h-4 text-saffron-600" /> 11. Search Engine Optimization (SEO)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="japa-seo-title" className="label-field">
                SEO Meta Title
              </label>
              <input
                id="japa-seo-title"
                type="text"
                className="input-field text-sm"
                value={form.seoTitle}
                onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
                placeholder="e.g. Maha Mrityunjaya Mantra Japa Services | Veda Structure"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="japa-seo-keywords" className="label-field">
                Keywords (Comma-separated)
              </label>
              <input
                id="japa-seo-keywords"
                type="text"
                className="input-field text-sm"
                value={form.seoKeywords}
                onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))}
                placeholder="e.g. japa, mrityunjaya, shiva, kashi, sankalpa"
                disabled={submitting}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="japa-seo-desc" className="label-field">
                SEO Meta Description
              </label>
              <textarea
                id="japa-seo-desc"
                rows={2}
                className="input-field text-sm"
                value={form.seoDescription}
                onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
                placeholder="Meta description for search engines and social link previews..."
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Form Submission Footer */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link to="/admin/japa-services" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving Japa Service…" : isEdit ? "Update Service" : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
