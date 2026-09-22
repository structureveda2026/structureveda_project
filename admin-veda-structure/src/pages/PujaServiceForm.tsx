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
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
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
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Load purposes
  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const data = await pujaServiceCatalogueService.getPurposes();
        setPurposes(data);
        // Default purpose if none selected
        if (!isEdit && data.length > 0 && !form.purposeId) {
          setForm((prev) => ({ ...prev, purposeId: data[0].id }));
        }
      } catch (err) {
        console.warn("Unable to load purposes:", err);
      }
    };
    fetchPurposes();
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
  const handleAddFaq = () => {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
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
              <label className="label-field">Full Ceremony Description</label>
              <textarea
                rows={5}
                className="input-field"
                value={form.fullDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, fullDescription: e.target.value }))}
                placeholder="Comprehensive description of ritual verses, Vedic significance, and priest guidance..."
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

          <div className="space-y-6">
            {/* What's Included */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">What's Included in Ritual</label>
                <button
                  type="button"
                  onClick={() => handleAddStringItem("whatsIncluded")}
                  className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Inclusions
                </button>
              </div>
              <div className="space-y-2">
                {form.whatsIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input-field py-1.5 text-xs"
                      value={item}
                      onChange={(e) => handleUpdateStringItem("whatsIncluded", idx, e.target.value)}
                      placeholder="e.g. Acharya Dakshina, Pure Desi Cow Ghee"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStringItem("whatsIncluded", idx)}
                      className="p-1.5 text-charcoal-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedure Steps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">Ritual Procedure Steps</label>
                <button
                  type="button"
                  onClick={() => handleAddStringItem("procedureSteps")}
                  className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>
              <div className="space-y-2">
                {form.procedureSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-charcoal-400 w-6 text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      className="input-field py-1.5 text-xs"
                      value={step}
                      onChange={(e) => handleUpdateStringItem("procedureSteps", idx, e.target.value)}
                      placeholder="e.g. Sankalp invocation and Ganapati Pujan"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStringItem("procedureSteps", idx)}
                      className="p-1.5 text-charcoal-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Perform & Significance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-field mb-0">Why Perform Benefits</label>
                  <button
                    type="button"
                    onClick={() => handleAddStringItem("whyPerform")}
                    className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.whyPerform.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input-field py-1.5 text-xs"
                        value={b}
                        onChange={(e) => handleUpdateStringItem("whyPerform", idx, e.target.value)}
                        placeholder="e.g. Neutralizes malefic periods"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStringItem("whyPerform", idx)}
                        className="p-1.5 text-charcoal-400 hover:text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label-field mb-0">Scriptural Significance</label>
                  <button
                    type="button"
                    onClick={() => handleAddStringItem("significance")}
                    className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {form.significance.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input-field py-1.5 text-xs"
                        value={s}
                        onChange={(e) => handleUpdateStringItem("significance", idx, e.target.value)}
                        placeholder="e.g. Referenced in Shukla Yajurveda"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveStringItem("significance", idx)}
                        className="p-1.5 text-charcoal-400 hover:text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: FAQs */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-100">
            <h3 className="text-base font-semibold text-charcoal-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-saffron-600" />
              6. Frequently Asked Questions (FAQs)
            </h3>
            <button
              type="button"
              onClick={handleAddFaq}
              className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {form.faqs.map((faq, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-cream-200 bg-cream-50/50 space-y-2 relative group">
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="absolute top-2 right-2 p-1 text-charcoal-400 hover:text-red-500 transition"
                  title="Remove FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div>
                  <input
                    type="text"
                    className="input-field text-xs font-medium"
                    value={faq.question || faq.q || ""}
                    onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                    placeholder="Question (e.g. Can my family members participate?)"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    className="input-field text-xs"
                    value={faq.answer || faq.a || ""}
                    onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                    placeholder="Answer details..."
                  />
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}
