import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Layers,
  HelpCircle,
  Check,
  UploadCloud,
  X,
  Info,
  Flame,
  CheckCircle2,
  ListPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BulkFaqModal from "@/components/BulkFaqModal";
import BulkStringListModal from "@/components/BulkStringListModal";
import CompactRichTextEditor from "@/components/CompactRichTextEditor";
import CompactListManager from "@/components/CompactListManager";
import { useToast } from "@/context/ToastContext";
import mediaUploadService from "@/services/mediaUploadService";
import pujaServiceCatalogueService, {
  PujaPurpose,
  PujaAvailableMode,
  PujaServicePayload,
  PujaFaqItem,
} from "@/services/pujaServiceCatalogueService";

const MODE_OPTIONS: { label: string; value: PujaAvailableMode }[] = [
  { label: "Hybrid (In-Person & Remote)", value: "hybrid" },
  { label: "In-Person (Kashi Temple / Ashram)", value: "in_person" },
  { label: "Remote (Vedic Live Stream)", value: "remote" },
];

const LOCATION_TYPE_OPTIONS = [
  { label: "Temple", value: "temple" },
  { label: "Ashram", value: "ashram" },
  { label: "Home", value: "home" },
  { label: "Custom Venue", value: "custom" },
];

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

interface FormState {
  name: string;
  slug: string;
  deity: string;
  purposeId: string;
  categoryId: string;
  eyebrow: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  purposeSummary: string;
  startingPrice: string;
  availableMode: PujaAvailableMode;
  locationType: "temple" | "ashram" | "home" | "custom";
  location: string;
  isKashiAvailable: boolean;
  duration: string;
  durationHoursText: string;
  availableDurations: string[];
  isFeatured: boolean;
  isActive: boolean;
  bannerImage: string;
  galleryImages: string[];
  whatsIncluded: string[];
  whyPerform: string[];
  significance: string[];
  procedureSteps: string[];
  faqs: PujaFaqItem[];
}

export default function PujaServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [purposes, setPurposes] = useState<PujaPurpose[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Bulk entry modal states
  const [isFaqBulkModalOpen, setIsFaqBulkModalOpen] = useState(false);
  const [expandedFaqIndices, setExpandedFaqIndices] = useState<Record<number, boolean>>({});
  const [stringBulkModalConfig, setStringBulkModalConfig] = useState<{
    isOpen: boolean;
    field: "whatsIncluded" | "whyPerform" | "significance" | "procedureSteps";
    title: string;
    itemLabel: string;
    placeholder: string;
    isNumbered: boolean;
    sampleItems: string[];
  } | null>(null);

  // Media upload state
  const [bannerUploading, setBannerUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    deity: "",
    purposeId: "",
    categoryId: "",
    eyebrow: "",
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    purposeSummary: "",
    startingPrice: "",
    availableMode: "hybrid",
    locationType: "temple",
    location: "Kashi Vishwanath Corridor, Varanasi",
    isKashiAvailable: true,
    duration: "2 - 3 Hours",
    durationHoursText: "2, 3",
    availableDurations: ["2 Hours", "3 Hours"],
    isFeatured: false,
    isActive: true,
    bannerImage: "",
    galleryImages: [],
    whatsIncluded: ["Vedic Brahmin Dakshina", "Panchamrit & Puja Samagri"],
    whyPerform: ["Neutralizes negative doshas and malefic influences"],
    significance: ["Prescribed in ancient Vedic texts"],
    procedureSteps: ["Sankalp & Ganapati Puja", "Mantra Chanting & Abhishek"],
    faqs: [{ question: "Can I participate virtually?", answer: "Yes, high-definition live stream is provided." }],
  });

  // Load purposes and categories
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [purposesData, categoriesData] = await Promise.all([
          pujaServiceCatalogueService.getPurposes(),
          pujaServiceCatalogueService.getCategories(),
        ]);
        setPurposes(purposesData);
        setCategories(categoriesData);
        // Default purpose if none selected
        if (!isEdit && purposesData.length > 0 && !form.purposeId) {
          setForm((prev) => ({ ...prev, purposeId: purposesData[0].id }));
        }
      } catch (err) {
        console.warn("Unable to load purposes or categories:", err);
      }
    };
    fetchDropdownData();
  }, [isEdit]);

  // Load existing service if edit
  useEffect(() => {
    if (!isEdit || !id) return;

    const loadService = async () => {
      setLoading(true);
      try {
        const data = await pujaServiceCatalogueService.getPujaService(id);
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          deity: data.deity || "",
          purposeId: data.purposeId || "",
          categoryId: data.categoryId || "",
          eyebrow: data.eyebrow || "",
          tagline: data.tagline || "",
          shortDescription: data.shortDescription || "",
          fullDescription: data.fullDescription || "",
          purposeSummary: data.purposeSummary || "",
          startingPrice: String(data.startingPrice || 0),
          availableMode: data.availableMode || "hybrid",
          locationType: data.locationType || "temple",
          location: data.location || "",
          isKashiAvailable: Boolean(data.isKashiAvailable),
          duration: data.duration || "",
          durationHoursText: Array.isArray(data.durationHours) ? data.durationHours.join(", ") : "",
          availableDurations: Array.isArray(data.availableDurations) ? data.availableDurations : [],
          isFeatured: Boolean(data.isFeatured),
          isActive: Boolean(data.isActive),
          bannerImage: data.bannerImage || "",
          galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
          whatsIncluded: Array.isArray(data.whatsIncluded) ? data.whatsIncluded : [],
          whyPerform: Array.isArray(data.whyPerform) ? data.whyPerform : [],
          significance: Array.isArray(data.significance) ? data.significance : [],
          procedureSteps: Array.isArray(data.procedureSteps) ? data.procedureSteps : [],
          faqs: Array.isArray(data.faqs)
            ? data.faqs.map((f: any) => ({
                question: f.question || f.q || "",
                answer: f.answer || f.a || "",
              }))
            : [],
        });
        setSlugManuallyEdited(true);
      } catch (err: any) {
        toast.error(err?.message || "Unable to load existing Puja service.");
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id, isEdit]);

  // Name to slug generator
  const handleNameChange = (newName: string) => {
    setForm((prev) => ({
      ...prev,
      name: newName,
      slug: slugManuallyEdited ? prev.slug : slugify(newName),
    }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(newSlug) }));
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  // Dynamic repeater helpers
  const handleAddStringItem = (
    field: "whatsIncluded" | "whyPerform" | "significance" | "procedureSteps" | "availableDurations",
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleUpdateStringItem = (
    field: "whatsIncluded" | "whyPerform" | "significance" | "procedureSteps" | "availableDurations",
    index: number,
    value: string,
  ) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const handleRemoveStringItem = (
    field: "whatsIncluded" | "whyPerform" | "significance" | "procedureSteps" | "availableDurations",
    index: number,
  ) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list.splice(index, 1);
      return { ...prev, [field]: list };
    });
  };

  // FAQ helpers
  const toggleFaqExpand = (idx: number) => {
    setExpandedFaqIndices((prev) => ({
      ...prev,
      [idx]: prev[idx] !== undefined ? !prev[idx] : false,
    }));
  };

  const toggleAllFaqs = (expand: boolean) => {
    const next: Record<number, boolean> = {};
    form.faqs.forEach((_, i) => {
      next[i] = expand;
    });
    setExpandedFaqIndices(next);
  };

  const handleAddFaq = () => {
    const newIdx = form.faqs.length;
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
    setExpandedFaqIndices((prev) => ({ ...prev, [newIdx]: true }));
  };

  const handleUpdateFaq = (index: number, key: "question" | "answer" | "q" | "a", value: string) => {
    setForm((prev) => {
      const faqs = [...prev.faqs];
      const normalizedKey = key === "q" ? "question" : key === "a" ? "answer" : key;
      faqs[index] = { ...faqs[index], [normalizedKey]: value, [key]: value };
      return { ...prev, faqs };
    });
  };

  const handleRemoveFaq = (index: number) => {
    setForm((prev) => {
      const faqs = [...prev.faqs];
      faqs.splice(index, 1);
      return { ...prev, faqs };
    });
  };

  // Bulk FAQ handler
  const handleApplyBulkFaqs = (
    newFaqs: Array<{ question: string; answer: string }>,
    mode: "append" | "replace"
  ) => {
    setForm((prev) => ({
      ...prev,
      faqs: mode === "replace" ? newFaqs : [...prev.faqs, ...newFaqs],
    }));
    // Auto-expand the first 2 newly added FAQs
    const startIndex = mode === "replace" ? 0 : form.faqs.length;
    const newExpanded = { ...expandedFaqIndices };
    newFaqs.forEach((_, i) => {
      if (i < 2) newExpanded[startIndex + i] = true;
    });
    setExpandedFaqIndices(newExpanded);
    toast.success(
      `${newFaqs.length} FAQ${newFaqs.length > 1 ? "s" : ""} ${
        mode === "replace" ? "replaced" : "added to"
      } ritual.`
    );
  };

  // Bulk string list modal configuration & handlers
  const openStringBulkModal = (
    field: "whatsIncluded" | "whyPerform" | "significance" | "procedureSteps"
  ) => {
    const configs = {
      whatsIncluded: {
        title: "Bulk Add Inclusions",
        itemLabel: "Inclusion",
        placeholder: "Paste inclusions here (one per line)...\ne.g.\nPure Desi Cow Ghee\nVedic Brahmin Dakshina\nConsecrated Prasad Delivery",
        isNumbered: false,
        sampleItems: [
          "Vedic Brahmin Dakshina & Guru Dakshina",
          "Panchamrit & Complete Puja Samagri",
          "Personalized Gotra & Family Sankalp",
          "Private High-Definition Live Stream",
          "Consecrated Prasad Shipped to Home",
        ],
      },
      procedureSteps: {
        title: "Bulk Add Procedure Steps",
        itemLabel: "Procedure Step",
        placeholder: "Paste procedure steps here (one per line)...\ne.g.\n1. Sankalp invocation and Ganapati Pujan\n2. Navagraha Avahan and Kalash Sthapana\n3. Principal Deity Abhishek & Mool Mantra Japa\n4. Maha Aarti and Pushpanjali",
        isNumbered: true,
        sampleItems: [
          "1. Sankalp invocation & Ganapati Pujan",
          "2. Navagraha Avahan & Sacred Kalash Sthapana",
          "3. Principal Deity Avahan & Dhyan",
          "4. Sacred Mool Mantra Chanting & Abhishek",
          "5. Maha Aarti, Pushpanjali & Kshama Prarthana",
        ],
      },
      whyPerform: {
        title: "Bulk Add Benefits (Why Perform)",
        itemLabel: "Benefit",
        placeholder: "Paste spiritual benefits here (one per line)...\ne.g.\nNeutralizes malefic planetary influences\nPurifies household energy and invites prosperity\nBrings health, peace, and longevity",
        isNumbered: false,
        sampleItems: [
          "Neutralizes malefic planetary doshas and negative influences",
          "Invokes divine grace for health, peace, and longevity",
          "Purifies household aura and protects against adverse vibrations",
          "Bestows spiritual clarity, prosperity, and family harmony",
        ],
      },
      significance: {
        title: "Bulk Add Scriptural Significance",
        itemLabel: "Significance",
        placeholder: "Paste scriptural references here (one per line)...\ne.g.\nReferenced in Shukla Yajurveda\nPrescribed in Shiva Purana for overcoming fear and illness\nMentioned across ancient Smritis",
        isNumbered: false,
        sampleItems: [
          "Referenced in Shukla Yajurveda as an auspicious foundational ceremony",
          "Prescribed in Shiva Purana for longevity and inner protection",
          "Extolled across Vedic Samhitas for harmonizing spiritual karmas",
        ],
      },
    };

    const conf = configs[field];
    setStringBulkModalConfig({
      isOpen: true,
      field,
      title: conf.title,
      itemLabel: conf.itemLabel,
      placeholder: conf.placeholder,
      isNumbered: conf.isNumbered,
      sampleItems: conf.sampleItems,
    });
  };

  const handleApplyBulkStringList = (
    newItems: string[],
    mode: "append" | "replace"
  ) => {
    if (!stringBulkModalConfig) return;
    const field = stringBulkModalConfig.field;
    setForm((prev) => ({
      ...prev,
      [field]: mode === "replace" ? newItems : [...prev[field], ...newItems],
    }));
    toast.success(
      `${newItems.length} ${stringBulkModalConfig.itemLabel.toLowerCase()}${
        newItems.length > 1 ? "s" : ""
      } ${mode === "replace" ? "replaced" : "added to"} ${stringBulkModalConfig.title.toLowerCase()}.`
    );
  };

  // Banner image upload
  const handleBannerSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      mediaUploadService.validateImageFile(file);
    } catch (err: any) {
      toast.error(err.message || "Invalid image file");
      if (bannerInputRef.current) bannerInputRef.current.value = "";
      return;
    }

    setBannerUploading(true);
    try {
      const result = await mediaUploadService.uploadImage(file, {
        folder: "veda-structure/puja-services/banners",
      });
      setForm((prev) => ({ ...prev, bannerImage: result.url }));
      toast.success("Banner image uploaded successfully.");
    } catch (err: any) {
      toast.error(err.message || "Image upload failed. Please try again.");
    } finally {
      setBannerUploading(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleRemoveBanner = () => {
    setForm((prev) => ({ ...prev, bannerImage: "" }));
    toast.info("Banner image removed.");
  };

  // Gallery images upload
  const handleGallerySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList || filesList.length === 0) return;

    const files = Array.from(filesList);
    for (const file of files) {
      try {
        mediaUploadService.validateImageFile(file);
      } catch (err: any) {
        toast.error(`${file.name}: ${err.message}`);
        if (galleryInputRef.current) galleryInputRef.current.value = "";
        return;
      }
    }

    setGalleryUploading(true);
    setGalleryProgress({ current: 1, total: files.length });

    try {
      const results = await mediaUploadService.uploadImages(files, {
        folder: "veda-structure/puja-services/gallery",
        onProgress: (current, total) => {
          setGalleryProgress({ current, total });
        },
      });

      const newUrls = results.map((r) => r.url);
      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newUrls],
      }));
      toast.success(`${results.length} gallery image${results.length > 1 ? "s" : ""} uploaded.`);
    } catch (err: any) {
      toast.error(err.message || "Some gallery images failed to upload.");
    } finally {
      setGalleryUploading(false);
      setGalleryProgress(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setForm((prev) => {
      const gallery = [...prev.galleryImages];
      gallery.splice(index, 1);
      return { ...prev, galleryImages: gallery };
    });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Puja service name is required.";
    if (!form.slug.trim()) newErrors.slug = "Unique slug is required.";
    if (!form.deity.trim()) newErrors.deity = "Presiding deity is required.";
    if (!form.purposeId) newErrors.purposeId = "Please select a Puja purpose.";

    const priceNum = Number(form.startingPrice);
    if (form.startingPrice === "" || isNaN(priceNum) || priceNum < 0) {
      newErrors.startingPrice = "Starting price must be a valid positive number.";
    }

    // Parse durationHours
    const hoursParsed: number[] = form.durationHoursText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number);

    if (hoursParsed.some((n) => isNaN(n) || n <= 0 || !Number.isInteger(n))) {
      newErrors.durationHours = "Duration hours must be positive integers separated by commas (e.g. 2, 3, 5).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please resolve highlighted validation errors before saving.");
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload: PujaServicePayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      deity: form.deity.trim(),
      startingPrice: priceNum,
      availableMode: form.availableMode,
      purposeId: form.purposeId,
      categoryId: form.categoryId ? form.categoryId : null,
      eyebrow: form.eyebrow.trim() || null,
      tagline: form.tagline.trim() || null,
      shortDescription: form.shortDescription.trim() || null,
      fullDescription: form.fullDescription.trim() || null,
      purposeSummary: form.purposeSummary.trim() || null,
      availableDurations: form.availableDurations.map((d) => d.trim()).filter(Boolean),
      duration: form.duration.trim() || null,
      durationHours: hoursParsed,
      locationType: form.locationType,
      location: form.location.trim() || null,
      isKashiAvailable: form.isKashiAvailable,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      bannerImage: form.bannerImage || null,
      galleryImages: form.galleryImages,
      whatsIncluded: form.whatsIncluded.map((s) => s.trim()).filter(Boolean),
      whyPerform: form.whyPerform.map((s) => s.trim()).filter(Boolean),
      significance: form.significance.map((s) => s.trim()).filter(Boolean),
      procedureSteps: form.procedureSteps.map((s) => s.trim()).filter(Boolean),
      faqs: form.faqs
        .map((f) => ({
          question: (f.question || f.q || "").trim(),
          answer: (f.answer || f.a || "").trim(),
        }))
        .filter((f) => f.question && f.answer),
    };

    try {
      if (isEdit && id) {
        await pujaServiceCatalogueService.updatePujaService(id, payload);
        toast.success("Puja service updated successfully.");
      } else {
        await pujaServiceCatalogueService.createPujaService(payload);
        toast.success("Puja service created successfully.");
      }
      navigate("/admin/puja-services");
    } catch (err: any) {
      if (err?.status === 409 || err?.message?.toLowerCase().includes("slug already exists")) {
        setErrors({ slug: "A Puja service with this slug already exists. Please enter a unique slug." });
        toast.error("Slug conflict: please choose a unique slug.");
      } else {
        toast.error(err?.message || "Failed to save Puja service.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading service details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/puja-services"
            className="p-2 rounded-lg border border-cream-200 text-charcoal-500 hover:bg-cream-100 transition"
            title="Back to Catalogue"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal-800">
              {isEdit ? "Edit Puja Service" : "Create Puja Service"}
            </h1>
            <p className="text-sm text-charcoal-400 mt-0.5">
              {isEdit
                ? "Update ritual parameters, descriptions, pricing and media."
                : "Add a reusable Vedic ritual service to the master catalogue."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/puja-services" className="btn-secondary text-sm">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Ritual Identity */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100 flex items-center gap-2">
            <Flame className="w-4 h-4 text-saffron-600" />
            1. Core Ritual Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">
                Ritual / Puja Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input-field font-medium ${errors.name ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Maha Mrityunjaya Homa"
                required
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label-field">
                Unique URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input-field font-mono text-xs ${errors.slug ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="maha-mrityunjaya-homa"
                required
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
            </div>

            <div>
              <label className="label-field">
                Presiding Deity <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input-field ${errors.deity ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.deity}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, deity: e.target.value }));
                  if (errors.deity) setErrors((prev) => ({ ...prev, deity: "" }));
                }}
                placeholder="e.g. Lord Shiva, Maa Durga"
                required
              />
              {errors.deity && <p className="text-xs text-red-500 mt-1">{errors.deity}</p>}
            </div>

            <div>
              <label className="label-field">
                Puja Purpose Category <span className="text-red-500">*</span>
              </label>
              <select
                className={`input-field ${errors.purposeId ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.purposeId}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, purposeId: e.target.value }));
                  if (errors.purposeId) setErrors((prev) => ({ ...prev, purposeId: "" }));
                }}
                required
              >
                <option value="">Select a Puja Purpose</option>
                {purposes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.purposeId && <p className="text-xs text-red-500 mt-1">{errors.purposeId}</p>}
            </div>

            <div>
              <label className="label-field">
                Puja Category (Tradition)
              </label>
              <select
                className="input-field"
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
              >
                <option value="">No Category / General</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-charcoal-400 mt-1">
                Assigns this service to a tradition (e.g. Shiva Puja) for mega menu & category pages.
              </p>
            </div>

            <div>
              <label className="label-field">Eyebrow / Badge</label>
              <input
                type="text"
                className="input-field"
                value={form.eyebrow}
                onChange={(e) => setForm((prev) => ({ ...prev, eyebrow: e.target.value }))}
                placeholder="e.g. Sacred Vedic Healing"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Tagline / Highlight Header</label>
              <input
                type="text"
                className="input-field"
                value={form.tagline}
                onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
                placeholder="e.g. Triumph over severe health setbacks and attain longevity"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Descriptions & Purpose Summary */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-saffron-600" />
            2. Narrative Descriptions & Spiritual Context
          </h3>

          <div className="space-y-4">
            <div>
              <label className="label-field">Purpose Summary</label>
              <input
                type="text"
                className="input-field"
                value={form.purposeSummary}
                onChange={(e) => setForm((prev) => ({ ...prev, purposeSummary: e.target.value }))}
                placeholder="Short spiritual rationale, e.g. Invoke the divine nectar of longevity and vitality."
              />
            </div>

            <div>
              <label className="label-field">Short Description (Catalogue Cards)</label>
              <textarea
                rows={2}
                className="input-field"
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Brief summary displayed on catalogue listing cards..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-field mb-0">Full Ceremony Description</label>
                <span className="text-[11px] font-medium text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded-full border border-saffron-200">
                  Rich-Text Formatting
                </span>
              </div>
              <CompactRichTextEditor
                value={form.fullDescription}
                onChange={(val) => setForm((prev) => ({ ...prev, fullDescription: val }))}
                placeholder="Comprehensive description of ritual verses, Vedic significance, and priest guidance..."
                minHeight="170px"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pricing, Mode & Durations */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-saffron-600" />
            3. Pricing, Participation Mode & Durations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-field">
                Starting Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className={`input-field font-semibold ${errors.startingPrice ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.startingPrice}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, startingPrice: e.target.value }));
                  if (errors.startingPrice) setErrors((prev) => ({ ...prev, startingPrice: "" }));
                }}
                placeholder="5100"
                required
              />
              {errors.startingPrice && <p className="text-xs text-red-500 mt-1">{errors.startingPrice}</p>}
            </div>

            <div>
              <label className="label-field">
                Available Mode <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field"
                value={form.availableMode}
                onChange={(e) => setForm((prev) => ({ ...prev, availableMode: e.target.value as PujaAvailableMode }))}
              >
                {MODE_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Display Duration String</label>
              <input
                type="text"
                className="input-field"
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g. 2 - 3 Hours"
              />
            </div>

            <div>
              <label className="label-field">
                Duration Hours Array (Integers)
              </label>
              <input
                type="text"
                className={`input-field ${errors.durationHours ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.durationHoursText}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, durationHoursText: e.target.value }));
                  if (errors.durationHours) setErrors((prev) => ({ ...prev, durationHours: "" }));
                }}
                placeholder="e.g. 2, 3, 5"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">Comma-separated positive integers.</p>
              {errors.durationHours && <p className="text-xs text-red-500 mt-1">{errors.durationHours}</p>}
            </div>

            <div>
              <label className="label-field">Location Type</label>
              <select
                className="input-field"
                value={form.locationType}
                onChange={(e) => setForm((prev) => ({ ...prev, locationType: e.target.value as any }))}
              >
                {LOCATION_TYPE_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Specific Location</label>
              <input
                type="text"
                className="input-field"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Kashi Vishwanath Corridor, Varanasi"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cream-100 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-charcoal-700">
              <input
                type="checkbox"
                checked={form.isKashiAvailable}
                onChange={(e) => setForm((prev) => ({ ...prev, isKashiAvailable: e.target.checked }))}
                className="w-4 h-4 rounded text-saffron-500 focus:ring-saffron-400"
              />
              Kashi Temple Conduct Available
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-charcoal-700">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              Mark as Featured Ritual
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-charcoal-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 rounded text-green-500 focus:ring-green-400"
              />
              Active (Visible in Public Catalogue)
            </label>
          </div>
        </div>

        {/* Section 4: Media Uploads */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-saffron-600" />
            4. Media & Visuals (Cloudinary Upload)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner Image */}
            <div>
              <label className="label-field">Banner / Cover Image</label>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleBannerSelect}
                disabled={bannerUploading}
                className="hidden"
              />

              {form.bannerImage ? (
                <div className="relative rounded-xl overflow-hidden border border-cream-200 bg-cream-50 h-44 group">
                  <img
                    src={form.bannerImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!bannerUploading) bannerInputRef.current?.click();
                      }}
                      disabled={bannerUploading}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      {bannerUploading ? "Uploading..." : "Replace"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      disabled={bannerUploading}
                      className="btn-danger text-xs py-1.5 px-3"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (!bannerUploading) bannerInputRef.current?.click();
                  }}
                  className={`rounded-xl border-2 border-dashed border-cream-300 bg-cream-50/50 p-6 text-center h-44 flex flex-col items-center justify-center transition ${
                    bannerUploading
                      ? "opacity-60 cursor-not-allowed pointer-events-none"
                      : "hover:border-saffron-400 hover:bg-cream-50 cursor-pointer"
                  }`}
                >
                  <UploadCloud className={`w-8 h-8 mb-2 ${bannerUploading ? "text-saffron-500 animate-pulse" : "text-charcoal-300"}`} />
                  <p className="text-sm font-medium text-charcoal-700">
                    {bannerUploading ? "Uploading to Cloudinary..." : "Click to upload banner image"}
                  </p>
                  <p className="text-xs text-charcoal-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-field mb-0">Gallery Images</label>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={galleryUploading}
                  className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {galleryUploading ? "Uploading..." : "Add Images"}
                </button>
              </div>

              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleGallerySelect}
                disabled={galleryUploading}
                className="hidden"
              />

              {galleryProgress && (
                <div className="p-2 mb-3 rounded-lg bg-saffron-50 text-saffron-700 text-xs font-medium">
                  Uploading image {galleryProgress.current} of {galleryProgress.total}...
                </div>
              )}

              {form.galleryImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2.5 max-h-44 overflow-y-auto p-1">
                  {form.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-cream-200 h-20 group">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-charcoal-900/70 text-white opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => {
                    if (!galleryUploading) galleryInputRef.current?.click();
                  }}
                  className={`rounded-xl border-2 border-dashed border-cream-300 bg-cream-50/50 p-6 text-center h-44 flex flex-col items-center justify-center transition ${
                    galleryUploading
                      ? "opacity-60 cursor-not-allowed pointer-events-none"
                      : "hover:border-saffron-400 hover:bg-cream-50 cursor-pointer"
                  }`}
                >
                  <ImageIcon className={`w-8 h-8 mb-2 ${galleryUploading ? "text-saffron-500 animate-pulse" : "text-charcoal-300"}`} />
                  <p className="text-sm font-medium text-charcoal-700">
                    {galleryUploading ? "Uploading gallery images..." : "Click to upload gallery photos"}
                  </p>
                  <p className="text-xs text-charcoal-400 mt-1">Multiple images supported</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Structured Arrays & Repeaters */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-saffron-600" />
            5. Structured Content (What's Included, Procedure Steps & Significance)
          </h3>

          <div className="space-y-4">
            {/* What's Included */}
            <CompactListManager
              title="What's Included in Ritual"
              items={form.whatsIncluded}
              placeholder="e.g. Acharya Dakshina, Pure Desi Cow Ghee, Prasad Delivery"
              isNumbered={false}
              onUpdateItem={(idx, val) => handleUpdateStringItem("whatsIncluded", idx, val)}
              onRemoveItem={(idx) => handleRemoveStringItem("whatsIncluded", idx)}
              onAddItem={() => handleAddStringItem("whatsIncluded")}
              onOpenBulkModal={() => openStringBulkModal("whatsIncluded")}
              defaultExpanded={form.whatsIncluded.length <= 4}
            />

            {/* Procedure Steps */}
            <CompactListManager
              title="Ritual Procedure Steps"
              items={form.procedureSteps}
              placeholder="e.g. Sankalp invocation and Ganapati Pujan"
              isNumbered={true}
              onUpdateItem={(idx, val) => handleUpdateStringItem("procedureSteps", idx, val)}
              onRemoveItem={(idx) => handleRemoveStringItem("procedureSteps", idx)}
              onAddItem={() => handleAddStringItem("procedureSteps")}
              onOpenBulkModal={() => openStringBulkModal("procedureSteps")}
              defaultExpanded={form.procedureSteps.length <= 4}
            />

            {/* Why Perform & Significance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CompactListManager
                title="Why Perform Benefits"
                items={form.whyPerform}
                placeholder="e.g. Neutralizes malefic periods"
                isNumbered={false}
                onUpdateItem={(idx, val) => handleUpdateStringItem("whyPerform", idx, val)}
                onRemoveItem={(idx) => handleRemoveStringItem("whyPerform", idx)}
                onAddItem={() => handleAddStringItem("whyPerform")}
                onOpenBulkModal={() => openStringBulkModal("whyPerform")}
                defaultExpanded={form.whyPerform.length <= 4}
              />

              <CompactListManager
                title="Scriptural Significance"
                items={form.significance}
                placeholder="e.g. Referenced in Shukla Yajurveda"
                isNumbered={false}
                onUpdateItem={(idx, val) => handleUpdateStringItem("significance", idx, val)}
                onRemoveItem={(idx) => handleRemoveStringItem("significance", idx)}
                onAddItem={() => handleAddStringItem("significance")}
                onOpenBulkModal={() => openStringBulkModal("significance")}
                defaultExpanded={form.significance.length <= 4}
              />
            </div>
          </div>
        </div>

        {/* Section 6: FAQs */}
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-cream-100">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-saffron-600" />
                6. Frequently Asked Questions (FAQs)
              </h3>
              <span className="text-xs font-semibold text-charcoal-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-200">
                {form.faqs.length} {form.faqs.length === 1 ? "FAQ" : "FAQs"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {form.faqs.length > 1 && (
                <div className="flex items-center bg-cream-50 rounded-lg border border-cream-200 p-0.5 text-xs text-charcoal-600">
                  <button
                    type="button"
                    onClick={() => toggleAllFaqs(true)}
                    className="px-2 py-0.5 hover:text-saffron-700 transition"
                  >
                    Expand All
                  </button>
                  <span className="text-cream-300">|</span>
                  <button
                    type="button"
                    onClick={() => toggleAllFaqs(false)}
                    className="px-2 py-0.5 hover:text-saffron-700 transition"
                  >
                    Collapse All
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsFaqBulkModalOpen(true)}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-white hover:bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200 transition flex items-center gap-1 shadow-2xs"
              >
                <ListPlus className="w-3.5 h-3.5" /> Bulk Add FAQs
              </button>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200 transition flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>
          </div>

          {/* Empty FAQs state */}
          {form.faqs.length === 0 ? (
            <div className="text-center py-6 px-4 rounded-xl border border-dashed border-cream-300 bg-cream-50/40 text-xs text-charcoal-500">
              No FAQs added yet. Click{" "}
              <strong
                className="text-saffron-600 cursor-pointer hover:underline"
                onClick={() => setIsFaqBulkModalOpen(true)}
              >
                Bulk Add FAQs
              </strong>{" "}
              to paste multiple entries or{" "}
              <strong
                className="text-charcoal-800 cursor-pointer hover:underline"
                onClick={handleAddFaq}
              >
                + Add FAQ
              </strong>{" "}
              to create one manually.
            </div>
          ) : (
            <div className="space-y-2.5">
              {form.faqs.map((faq, idx) => {
                const isExpanded =
                  expandedFaqIndices[idx] !== undefined
                    ? expandedFaqIndices[idx]
                    : idx < 2;
                const questionText = faq.question || faq.q || "";
                const answerText = faq.answer || faq.a || "";
                const plainAnswer = answerText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? "border-saffron-200 bg-white shadow-2xs p-3.5 space-y-3"
                        : "border-cream-200 bg-cream-50/60 p-2.5 hover:bg-cream-50"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                        onClick={() => toggleFaqExpand(idx)}
                      >
                        <span className="text-[11px] font-bold text-saffron-800 bg-saffron-100/80 px-2 py-0.5 rounded-md shrink-0">
                          Q{idx + 1}
                        </span>
                        {!isExpanded ? (
                          <div className="flex items-center gap-2 truncate text-xs">
                            <span className="font-semibold text-charcoal-800 truncate">
                              {questionText || <em className="text-charcoal-400 font-normal">Untitled Question</em>}
                            </span>
                            {plainAnswer && (
                              <span className="text-charcoal-400 text-[11px] truncate hidden sm:inline">
                                — {plainAnswer}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-charcoal-700">
                            Question & Answer Editor
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleFaqExpand(idx)}
                          className="p-1 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 rounded transition text-xs flex items-center gap-0.5"
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="p-1 text-charcoal-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                          title="Remove FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="space-y-2.5 pt-1 border-t border-cream-100">
                        <div>
                          <label className="text-[11px] font-bold text-charcoal-700 block mb-1">
                            Question <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            className="input-field text-xs font-medium py-1.5 px-3"
                            value={questionText}
                            onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                            placeholder="e.g. Can my family members participate in the Sankalpa?"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-charcoal-700">
                              Answer (Rich-Text Formatted)
                            </label>
                            <span className="text-[10px] text-charcoal-400">
                              Supports bold, lists & links
                            </span>
                          </div>
                          <CompactRichTextEditor
                            value={answerText}
                            onChange={(val) => handleUpdateFaq(idx, "answer", val)}
                            placeholder="Enter detailed answer. Use bold, lists, and links as needed..."
                            minHeight="95px"
                            compact={true}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link to="/admin/puja-services" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Service"}
          </button>
        </div>
      </form>

      {/* Bulk FAQ Modal */}
      <BulkFaqModal
        isOpen={isFaqBulkModalOpen}
        onClose={() => setIsFaqBulkModalOpen(false)}
        onApply={handleApplyBulkFaqs}
        existingCount={
          form.faqs.filter((f) => (f.question || f.q || "").trim().length > 0)
            .length
        }
      />

      {/* Bulk String List Modal */}
      {stringBulkModalConfig && (
        <BulkStringListModal
          isOpen={stringBulkModalConfig.isOpen}
          onClose={() => setStringBulkModalConfig(null)}
          title={stringBulkModalConfig.title}
          itemLabel={stringBulkModalConfig.itemLabel}
          placeholder={stringBulkModalConfig.placeholder}
          sampleItems={stringBulkModalConfig.sampleItems}
          isNumbered={stringBulkModalConfig.isNumbered}
          existingCount={
            form[stringBulkModalConfig.field].filter((s) => s.trim().length > 0)
              .length
          }
          onApply={handleApplyBulkStringList}
        />
      )}
    </div>
  );
}
