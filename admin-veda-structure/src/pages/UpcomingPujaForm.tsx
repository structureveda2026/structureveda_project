import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  Layers,
  HelpCircle,
  Users,
  Check,
  UploadCloud,
  X,
  Star,
  Info,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import mediaUploadService from "@/services/mediaUploadService";
import upcomingPujaService, {
  UpcomingPujaData,
  UpcomingPujaPayload,
  PujaPackageData,
  UpcomingPujaStatus,
} from "@/services/upcomingPujaService";

const STATUS_OPTIONS: UpcomingPujaStatus[] = [
  "Draft",
  "Published",
  "Booking Closed",
  "Completed",
  "Cancelled",
];

const CATEGORY_OPTIONS = [
  "Festival Pujas",
  "Tithi Pujas",
  "Special Occasion Pujas",
  "Dosha Shanti Pujas",
  "Kashi Special Rituals",
];

const OCCASION_OPTIONS = [
  "Festival Puja",
  "Purnima",
  "Amavasya",
  "Ekadashi",
  "Pradosh",
  "Sankranti",
  "Navratri",
  "Mahashivratri",
  "Sawan",
  "Special Kashi Rituals",
];

const STANDARD_PURPOSES = [
  "Protection",
  "Marriage & Relationships",
  "Prosperity",
  "Health & Longevity",
  "Peace & Mental Well-being",
  "Education & Knowledge",
  "Family & Home",
  "Spiritual Growth",
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
  eyebrow: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  occasion: string;
  purposeCategories: string[];
  location: string;
  temple: string;
  deity: string;
  ceremonyDate: string;
  startDateTime: string;
  bookingCloseAt: string;
  totalCapacity: string;
  isFeatured: boolean;
  remoteAvailable: boolean;
  status: UpcomingPujaStatus;
  bannerImage: string;
  galleryImages: string[];
  benefits: string[];
  significance: string[];
  whatsIncluded: string[];
  procedureSteps: string[];
}

const defaultPackage: PujaPackageData = {
  name: "Individual Devotee Sankalp",
  price: 1100,
  maxDevotees: 1,
  description: "Single devotee sankalp with personalized gotra and name chanting.",
  features: ["Personalized Gotra Sankalp", "Live Stream Video Link", "Prasad Box Delivered"],
  isDefault: true,
};

export default function UpcomingPujaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [existingBookedCount, setExistingBookedCount] = useState(0);

  // Field validation errors mapping
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileUploadNotice, setFileUploadNotice] = useState<string | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerFileName, setBannerFileName] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState<{ current: number; total: number } | null>(null);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    eyebrow: "",
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    category: "Special Occasion Pujas",
    occasion: "Pradosh",
    purposeCategories: ["Protection", "Spiritual Growth"],
    location: "Varanasi, Uttar Pradesh",
    temple: "Kashi Vishwanath Corridor & Manikarnika Ghat",
    deity: "Lord Shiva & Maa Ganga",
    ceremonyDate: "",
    startDateTime: "",
    bookingCloseAt: "",
    totalCapacity: "100",
    isFeatured: false,
    remoteAvailable: true,
    status: "Draft",
    bannerImage: "",
    galleryImages: [],
    benefits: [
      "Dissolves negative energies and planetary doshas",
      "Bestows health, vitality and mental tranquility",
    ],
    significance: [
      "Performed along the sacred Ganga on the auspicious tithi",
      "Follows authentic Vedic rituals chanted by certified Kashi Acharyas",
    ],
    whatsIncluded: [
      "Personalized Gotra & Name chanting during Sankalp",
      "High-definition video recording snippet of your Sankalp",
      "Consecrated Prasad box dispatched to your doorstep",
    ],
    procedureSteps: [
      "Swasti Vachan and Ganpati Pujan",
      "Kalash Sthapana & Navgrah Aradhana",
      "Sri Rudrabhishek with Panchamrit and Gangajal",
      "Maha Mangal Aarti & Sankalp Samarpan",
    ],
  });

  const [packages, setPackages] = useState<PujaPackageData[]>([{ ...defaultPackage }]);

  // Load existing data when editing
  useEffect(() => {
    if (!isEdit || !id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await upcomingPujaService.getUpcomingPuja(id);
        setExistingBookedCount(data.bookedCount || 0);

        const ceremonyDateFormatted = data.ceremonyDate
          ? new Date(data.ceremonyDate).toISOString().split("T")[0]
          : "";

        const toDatetimeLocal = (isoStr?: string | null) => {
          if (!isoStr) return "";
          const d = new Date(isoStr);
          if (isNaN(d.getTime())) return "";
          const offset = d.getTimezoneOffset() * 60000;
          const localTime = new Date(d.getTime() - offset);
          return localTime.toISOString().slice(0, 16);
        };

        setForm({
          name: data.name || "",
          slug: data.slug || "",
          eyebrow: data.eyebrow || "",
          tagline: data.tagline || "",
          shortDescription: data.shortDescription || "",
          fullDescription: data.fullDescription || "",
          category: data.category || "Special Occasion Pujas",
          occasion: data.occasion || "Pradosh",
          purposeCategories: Array.isArray(data.purposeCategories) ? data.purposeCategories : [],
          location: data.location || "",
          temple: data.temple || "",
          deity: data.deity || "",
          ceremonyDate: ceremonyDateFormatted,
          startDateTime: toDatetimeLocal(data.startDateTime),
          bookingCloseAt: toDatetimeLocal(data.bookingCloseAt),
          totalCapacity: String(data.totalCapacity || 100),
          isFeatured: Boolean(data.isFeatured),
          remoteAvailable: Boolean(data.remoteAvailable),
          status: data.status || "Draft",
          bannerImage: data.bannerImage || "",
          galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
          benefits: Array.isArray(data.benefits) ? data.benefits : [],
          significance: Array.isArray(data.significance) ? data.significance : [],
          whatsIncluded: Array.isArray(data.whatsIncluded) ? data.whatsIncluded : [],
          procedureSteps: Array.isArray(data.procedureSteps) ? data.procedureSteps : [],
        });

        if (Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(
            data.packages.map((pkg) => ({
              id: pkg.id,
              name: pkg.name,
              price: Number(pkg.price),
              maxDevotees: Number(pkg.maxDevotees),
              description: pkg.description || "",
              features: Array.isArray(pkg.features) ? pkg.features : [],
              isDefault: Boolean(pkg.isDefault),
            })),
          );
        }

        setSlugManuallyEdited(true);
      } catch (err) {
        toast.error((err as Error).message || "Unable to load existing Puja record.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit]);

  // Auto-slug when name changes unless manually edited
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

  const togglePurpose = (purpose: string) => {
    setForm((prev) => {
      const exists = prev.purposeCategories.includes(purpose);
      return {
        ...prev,
        purposeCategories: exists
          ? prev.purposeCategories.filter((p) => p !== purpose)
          : [...prev.purposeCategories, purpose],
      };
    });
  };

  // Helper for dynamic string list fields
  const handleAddListItem = (field: "benefits" | "significance" | "whatsIncluded" | "procedureSteps" | "galleryImages") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleUpdateListItem = (
    field: "benefits" | "significance" | "whatsIncluded" | "procedureSteps" | "galleryImages",
    index: number,
    value: string,
  ) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const handleRemoveListItem = (
    field: "benefits" | "significance" | "whatsIncluded" | "procedureSteps" | "galleryImages",
    index: number,
  ) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list.splice(index, 1);
      return { ...prev, [field]: list };
    });
  };

  // Package helpers
  const handleAddPackage = () => {
    const newPkg: PujaPackageData = {
      name: `Package #${packages.length + 1}`,
      price: 2100,
      maxDevotees: 2,
      description: "Family sankalp tier.",
      features: ["Personalized Sankalp", "Puja Video Snippet", "Special Prasad Box"],
      isDefault: packages.length === 0,
    };
    setPackages((prev) => [...prev, newPkg]);
  };

  const handleUpdatePackage = (
    index: number,
    field: keyof PujaPackageData,
    value: unknown,
  ) => {
    setPackages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    // Clear package error
    const errKey = `package_${index}_${String(field)}`;
    if (errors[errKey]) {
      setErrors((prev) => ({ ...prev, [errKey]: "" }));
    }
  };

  const handleSetDefaultPackage = (index: number) => {
    setPackages((prev) =>
      prev.map((pkg, i) => ({
        ...pkg,
        isDefault: i === index,
      })),
    );
  };

  const handleRemovePackage = (index: number) => {
    if (packages.length <= 1) {
      toast.warning("At least one devotee package is required for this ceremony.");
      return;
    }
    setPackages((prev) => {
      const updated = [...prev];
      const wasDefault = updated[index].isDefault;
      updated.splice(index, 1);
      if (wasDefault && updated.length > 0) {
        updated[0].isDefault = true;
      }
      return updated;
    });
  };

  const handleAddPackageFeature = (pkgIndex: number) => {
    setPackages((prev) => {
      const updated = [...prev];
      const features = [...(updated[pkgIndex].features || []), ""];
      updated[pkgIndex] = { ...updated[pkgIndex], features };
      return updated;
    });
  };

  const handleUpdatePackageFeature = (
    pkgIndex: number,
    featIndex: number,
    val: string,
  ) => {
    setPackages((prev) => {
      const updated = [...prev];
      const features = [...(updated[pkgIndex].features || [])];
      features[featIndex] = val;
      updated[pkgIndex] = { ...updated[pkgIndex], features };
      return updated;
    });
  };

  const handleRemovePackageFeature = (pkgIndex: number, featIndex: number) => {
    setPackages((prev) => {
      const updated = [...prev];
      const features = [...(updated[pkgIndex].features || [])];
      features.splice(featIndex, 1);
      updated[pkgIndex] = { ...updated[pkgIndex], features };
      return updated;
    });
  };

  // Single banner image upload handler
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
    setBannerFileName(file.name);

    try {
      const result = await mediaUploadService.uploadImage(file, {
        folder: "veda-structure/upcoming-pujas/banners",
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
    setBannerFileName(null);
    toast.info("Image removed.");
  };

  // Multiple gallery images upload handler
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
        folder: "veda-structure/upcoming-pujas/gallery",
        onProgress: (current, total) => {
          setGalleryProgress({ current, total });
        },
      });

      const newUrls = results.map((r) => r.url);
      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newUrls],
      }));

      toast.success(
        `${results.length} gallery image${results.length > 1 ? "s" : ""} uploaded successfully.`
      );
    } catch (err: any) {
      toast.error(err.message || "Some gallery images failed to upload.");
    } finally {
      setGalleryUploading(false);
      setGalleryProgress(null);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== idxToRemove),
    }));
    toast.info("Image removed.");
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Puja ceremony name is required.";
    }

    if (!form.slug.trim()) {
      newErrors.slug = "Unique slug is required.";
    }

    if (!form.ceremonyDate) {
      newErrors.ceremonyDate = "Ceremony date is required.";
    }

    if (!form.startDateTime) {
      newErrors.startDateTime = "Ceremony start date & time is required.";
    }

    if (form.bookingCloseAt && form.startDateTime) {
      const closeDate = new Date(form.bookingCloseAt);
      const startDate = new Date(form.startDateTime);
      if (closeDate > startDate) {
        newErrors.bookingCloseAt = "Booking close cutoff time cannot be after the ceremony start date and time.";
      }
    }

    const capNum = Number(form.totalCapacity);
    if (!form.totalCapacity || isNaN(capNum) || capNum <= 0 || !Number.isInteger(capNum)) {
      newErrors.totalCapacity = "Total capacity must be a positive whole number greater than 0.";
    } else if (isEdit && capNum < existingBookedCount) {
      newErrors.totalCapacity = `Cannot reduce capacity to ${capNum} slots because ${existingBookedCount} are already booked.`;
    }

    if (packages.length === 0) {
      newErrors.packages = "At least one package must be configured.";
    }

    packages.forEach((pkg, i) => {
      if (!pkg.name.trim()) {
        newErrors[`package_${i}_name`] = "Package title is required.";
      }
      if (isNaN(Number(pkg.price)) || Number(pkg.price) < 0) {
        newErrors[`package_${i}_price`] = "Price must be greater than or equal to 0.";
      }
      if (isNaN(Number(pkg.maxDevotees)) || Number(pkg.maxDevotees) < 1 || !Number.isInteger(Number(pkg.maxDevotees))) {
        newErrors[`package_${i}_maxDevotees`] = "Devotee count must be a whole number of at least 1.";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to the first error
      const firstKey = Object.keys(newErrors)[0];
      const element = document.querySelector(`[data-error-field="${firstKey}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        (element as HTMLElement).focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: UpcomingPujaStatus) => {
    e.preventDefault();
    setFileUploadNotice(null);

    if (!validateForm()) {
      toast.error("Unable to create Upcoming Puja. Please check the highlighted fields.");
      return;
    }

    setSubmitting(true);

    try {
      const finalStatus = overrideStatus || form.status;
      const payload: UpcomingPujaPayload = {
        name: form.name.trim(),
        slug: slugify(form.slug),
        eyebrow: form.eyebrow.trim() || null,
        tagline: form.tagline.trim() || null,
        shortDescription: form.shortDescription.trim() || null,
        fullDescription: form.fullDescription.trim() || null,
        category: form.category || null,
        occasion: form.occasion || null,
        purposeCategories: form.purposeCategories,
        location: form.location.trim() || null,
        temple: form.temple.trim() || null,
        deity: form.deity.trim() || null,
        ceremonyDate: form.ceremonyDate,
        startDateTime: new Date(form.startDateTime).toISOString(),
        bookingCloseAt: form.bookingCloseAt
          ? new Date(form.bookingCloseAt).toISOString()
          : null,
        totalCapacity: parseInt(form.totalCapacity, 10),
        isFeatured: Boolean(form.isFeatured),
        remoteAvailable: Boolean(form.remoteAvailable),
        status: finalStatus,
        bannerImage: form.bannerImage.trim() || null,
        galleryImages: form.galleryImages.filter((url) => url.trim().length > 0),
        benefits: form.benefits.filter((b) => b.trim().length > 0),
        significance: form.significance.filter((s) => s.trim().length > 0),
        whatsIncluded: form.whatsIncluded.filter((w) => w.trim().length > 0),
        procedureSteps: form.procedureSteps.filter((p) => p.trim().length > 0),
        packages: packages.map((pkg) => ({
          ...(pkg.id ? { id: pkg.id } : {}),
          name: pkg.name.trim(),
          price: Number(pkg.price),
          maxDevotees: parseInt(String(pkg.maxDevotees), 10),
          description: pkg.description ? pkg.description.trim() : null,
          features: (pkg.features || []).filter((f) => f.trim().length > 0),
          isDefault: Boolean(pkg.isDefault),
        })),
      };

      if (isEdit && id) {
        await upcomingPujaService.updateUpcomingPuja(id, payload);
        if (finalStatus === "Draft") {
          toast.success("Draft saved successfully.");
        } else {
          toast.success("Upcoming Puja updated successfully.");
        }
      } else {
        await upcomingPujaService.createUpcomingPuja(payload);
        if (finalStatus === "Draft") {
          toast.success("Draft saved successfully.");
        } else {
          toast.success("Upcoming Puja created successfully.");
        }
      }

      navigate("/admin/upcoming-pujas");
    } catch (err) {
      const msg = (err as Error).message || "Unable to save Upcoming Puja. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">Loading ceremony details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/admin/upcoming-pujas"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-saffron-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Upcoming Pujas
        </Link>
      </div>

      <PageHeader
        title={isEdit ? "Edit Upcoming Puja" : "Create Upcoming Puja"}
        subtitle={
          isEdit
            ? `Updating ceremony schedule, packages and capacity for "${form.name}".`
            : "Create and manage an upcoming Vedic ceremony."
        }
      />

      {fileUploadNotice && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>{fileUploadNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setFileUploadNotice(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* 1. Basic Information */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100">
            1. Basic Ceremony Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">
                Puja Ceremony Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                data-error-field="name"
                className={`input-field font-medium ${errors.name ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Maha Rudrabhishek & Ganga Aarti Sankalp"
                required
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label-field">
                Unique Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                data-error-field="slug"
                className={`input-field font-mono text-xs ${errors.slug ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="maha-rudrabhishek-ganga-aarti-sankalp"
                required
              />
              {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
            </div>

            <div>
              <label className="label-field">Eyebrow / Badge</label>
              <input
                type="text"
                className="input-field"
                value={form.eyebrow}
                onChange={(e) => setForm((prev) => ({ ...prev, eyebrow: e.target.value }))}
                placeholder="e.g. Kashi Special or Pradosh Special"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Tagline / Header Highlight</label>
              <input
                type="text"
                className="input-field"
                value={form.tagline}
                onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
                placeholder="e.g. Live Vedic Sankalp from Manikarnika Ghat, Varanasi"
              />
            </div>

            <div>
              <label className="label-field">Category</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Sacred Occasion</label>
              <select
                className="input-field"
                value={form.occasion}
                onChange={(e) => setForm((prev) => ({ ...prev, occasion: e.target.value }))}
              >
                {OCCASION_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-field">Presiding Deity</label>
              <input
                type="text"
                className="input-field"
                value={form.deity}
                onChange={(e) => setForm((prev) => ({ ...prev, deity: e.target.value }))}
                placeholder="e.g. Lord Shiva, Maa Ganga"
              />
            </div>

            {/* Purpose Categories Pill Selector */}
            <div className="md:col-span-2">
              <label className="label-field mb-2">Purpose Categories</label>
              <div className="flex flex-wrap gap-2">
                {STANDARD_PURPOSES.map((purpose) => {
                  const isSelected = form.purposeCategories.includes(purpose);
                  return (
                    <button
                      key={purpose}
                      type="button"
                      onClick={() => togglePurpose(purpose)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        isSelected
                          ? "bg-saffron-50 text-saffron-700 border-saffron-300 shadow-sm"
                          : "bg-white text-charcoal-600 border-cream-200 hover:border-cream-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 inline mr-1 text-saffron-600" />}
                      {purpose}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Short Overview</label>
              <textarea
                rows={2}
                className="input-field"
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Brief summary for discovery cards..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Full Ceremony Description</label>
              <textarea
                rows={4}
                className="input-field min-h-[100px]"
                value={form.fullDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, fullDescription: e.target.value }))}
                placeholder="Comprehensive description of spiritual benefits, history and Vedic procedures..."
              />
            </div>
          </div>
        </div>

        {/* 2. Date & Timing */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100">
            2. Ceremony Date & Timing
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label-field">
                Ceremony Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                data-error-field="ceremonyDate"
                className={`input-field ${errors.ceremonyDate ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.ceremonyDate}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, ceremonyDate: e.target.value }));
                  if (errors.ceremonyDate) setErrors((prev) => ({ ...prev, ceremonyDate: "" }));
                }}
                required
              />
              {errors.ceremonyDate && <p className="text-xs text-red-500 mt-1">{errors.ceremonyDate}</p>}
            </div>

            <div>
              <label className="label-field">
                Ceremony Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                data-error-field="startDateTime"
                className={`input-field ${errors.startDateTime ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.startDateTime}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, startDateTime: e.target.value }));
                  if (errors.startDateTime) setErrors((prev) => ({ ...prev, startDateTime: "" }));
                }}
                required
              />
              {errors.startDateTime && <p className="text-xs text-red-500 mt-1">{errors.startDateTime}</p>}
            </div>

            <div>
              <label className="label-field">Booking Close At</label>
              <input
                type="datetime-local"
                data-error-field="bookingCloseAt"
                className={`input-field ${errors.bookingCloseAt ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.bookingCloseAt}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, bookingCloseAt: e.target.value }));
                  if (errors.bookingCloseAt) setErrors((prev) => ({ ...prev, bookingCloseAt: "" }));
                }}
              />
              {errors.bookingCloseAt ? (
                <p className="text-xs text-red-500 mt-1">{errors.bookingCloseAt}</p>
              ) : (
                <p className="text-[11px] text-charcoal-400 mt-1">Must be before start time</p>
              )}
            </div>

            <div>
              <label className="label-field">
                Total Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                data-error-field="totalCapacity"
                className={`input-field font-semibold ${errors.totalCapacity ? "border-red-300 focus:ring-red-400" : ""}`}
                value={form.totalCapacity}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, totalCapacity: e.target.value }));
                  if (errors.totalCapacity) setErrors((prev) => ({ ...prev, totalCapacity: "" }));
                }}
                required
              />
              {errors.totalCapacity ? (
                <p className="text-xs text-red-500 mt-1">{errors.totalCapacity}</p>
              ) : (
                <p className="text-[11px] text-charcoal-400 mt-1">Total slots available</p>
              )}
            </div>
          </div>

          {isEdit && (
            <div className="mt-4 p-3 rounded-lg bg-cream-50 border border-cream-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-charcoal-500" />
                <span className="text-charcoal-600">
                  Current Operational Bookings:{" "}
                  <strong className="text-charcoal-900 font-bold">{existingBookedCount}</strong> slots booked
                </span>
              </div>
              <span className="text-charcoal-400 italic">Managed by booking transactions</span>
            </div>
          )}
        </div>

        {/* 3. Sacred Location */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100">
            3. Sacred Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">City / Destination</label>
              <input
                type="text"
                className="input-field"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. Varanasi, Uttar Pradesh"
              />
            </div>

            <div>
              <label className="label-field">Temple / Ghat / Ashram</label>
              <input
                type="text"
                className="input-field"
                value={form.temple}
                onChange={(e) => setForm((prev) => ({ ...prev, temple: e.target.value }))}
                placeholder="e.g. Kashi Vishwanath Corridor & Manikarnika Ghat"
              />
            </div>

            <div className="md:col-span-2 pt-1">
              <label className="inline-flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remoteAvailable}
                  onChange={(e) => setForm((prev) => ({ ...prev, remoteAvailable: e.target.checked }))}
                  className="w-4 h-4 text-saffron-600 rounded border-cream-300 focus:ring-saffron-400"
                />
                <span className="text-sm text-charcoal-700 font-medium">
                  Remote / Online Sankalp Available (Devotees can participate remotely)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Media & Visuals */}
        <div className="card p-5">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-cream-100">
            <div>
              <h3 className="text-base font-semibold text-charcoal-800">4. Media & Visuals</h3>
              <p className="text-xs text-charcoal-400 mt-0.5">
                Upload photography for the ceremony hero banner and visual gallery.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-500 bg-cream-50 px-2.5 py-1 rounded-lg border border-cream-200">
              <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
              <span>Cloud Storage</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Banner Hero Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">Banner Hero Image</label>
                <span className="text-xs text-charcoal-400">
                  Max {mediaUploadService.MAX_IMAGE_SIZE_MB} MB • JPG, PNG, WEBP
                </span>
              </div>

              <input
                type="file"
                ref={bannerInputRef}
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleBannerSelect}
              />

              {form.bannerImage ? (
                <div className="rounded-xl border border-cream-200 bg-white p-3.5 space-y-3">
                  <div className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden border border-cream-100 bg-charcoal-900 group">
                    <img
                      src={form.bannerImage}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Uploaded successfully
                      </span>
                      {bannerFileName && (
                        <span className="bg-charcoal-900/80 backdrop-blur-sm px-2 py-1 rounded text-[11px] truncate max-w-[200px]">
                          {bannerFileName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      disabled={bannerUploading}
                      onClick={() => bannerInputRef.current?.click()}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-saffron-600" />
                      {bannerUploading ? "Uploading..." : "Replace Banner"}
                    </button>
                    <button
                      type="button"
                      disabled={bannerUploading}
                      onClick={handleRemoveBanner}
                      className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50 transition text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !bannerUploading && bannerInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                    bannerUploading
                      ? "border-saffron-300 bg-saffron-50/30 cursor-not-allowed"
                      : "border-cream-300 bg-cream-50/50 hover:border-saffron-400 hover:bg-cream-100/60"
                  }`}
                >
                  {bannerUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-saffron-700">Uploading banner image...</span>
                      <span className="text-[11px] text-charcoal-400">Storing in Cloudinary</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-saffron-50 flex items-center justify-center text-saffron-600 border border-saffron-200">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-4 h-4" /> Upload Banner Image
                        </button>
                        <p className="text-[11px] text-charcoal-400 mt-2">
                          JPG, PNG, or WEBP up to {mediaUploadService.MAX_IMAGE_SIZE_MB} MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="label-field mb-0">Gallery Images</label>
                  <p className="text-[11px] text-charcoal-400">
                    {form.galleryImages.length} image{form.galleryImages.length === 1 ? "" : "s"} uploaded
                  </p>
                </div>

                <input
                  type="file"
                  ref={galleryInputRef}
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleGallerySelect}
                />

                <button
                  type="button"
                  disabled={galleryUploading}
                  onClick={() => galleryInputRef.current?.click()}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-saffron-600" />
                  {galleryUploading
                    ? `Uploading ${galleryProgress ? `${galleryProgress.current} of ${galleryProgress.total}...` : "..."}`
                    : "+ Add Images"}
                </button>
              </div>

              {galleryUploading && (
                <div className="mb-4 p-3 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-saffron-800">
                      Uploading {galleryProgress ? `${galleryProgress.current} of ${galleryProgress.total}` : "images"}...
                    </span>
                    <span className="text-charcoal-500 ml-2">Please keep this window open</span>
                  </div>
                </div>
              )}

              {form.galleryImages.length === 0 && !galleryUploading ? (
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="border-2 border-dashed border-cream-300 rounded-xl p-6 text-center cursor-pointer hover:border-saffron-400 hover:bg-cream-50 transition flex flex-col items-center justify-center gap-2"
                >
                  <ImageIcon className="w-8 h-8 text-charcoal-300" />
                  <p className="text-xs font-medium text-charcoal-600">No gallery images uploaded yet</p>
                  <p className="text-[11px] text-charcoal-400">
                    Click to select multiple photos (up to {mediaUploadService.MAX_IMAGE_SIZE_MB} MB each)
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {form.galleryImages.map((imgUrl, idx) => (
                    <div
                      key={`${imgUrl}-${idx}`}
                      className="relative aspect-square rounded-xl overflow-hidden border border-cream-200 bg-charcoal-900 group shadow-sm"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery photo ${idx + 1}`}
                        className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-charcoal-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleRemoveGalleryImage(idx); }}
                          className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition shadow"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-1.5 left-1.5 bg-charcoal-900/80 text-[10px] text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  {/* "+ Add More" Tile */}
                  <button
                    type="button"
                    disabled={galleryUploading}
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-cream-300 flex flex-col items-center justify-center gap-1.5 text-charcoal-400 hover:border-saffron-400 hover:text-saffron-600 hover:bg-cream-50 transition cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-medium">Add More</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Devotee Packages */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-100">
            <div>
              <h3 className="text-base font-semibold text-charcoal-800">5. Devotee Packages</h3>
              <p className="text-xs text-charcoal-400 mt-0.5">
                Define participation tiers, price points, and included benefits.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPackage}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Package Tier
            </button>
          </div>

          <div className="space-y-4">
            {packages.map((pkg, idx) => {
              const nameErr = errors[`package_${idx}_name`];
              const priceErr = errors[`package_${idx}_price`];
              const maxDevErr = errors[`package_${idx}_maxDevotees`];

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition ${
                    pkg.isDefault
                      ? "border-saffron-300 bg-saffron-50/20"
                      : "border-cream-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cream-100 text-charcoal-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-charcoal-800">
                        {pkg.name || `Tier #${idx + 1}`}
                      </span>
                      {pkg.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-saffron-100 text-saffron-800 border border-saffron-200 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-saffron-500 text-saffron-600" /> Default Tier
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!pkg.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultPackage(idx)}
                          className="btn-ghost text-xs py-1 px-2 text-charcoal-600 hover:text-saffron-600"
                        >
                          Set as Default
                        </button>
                      )}
                      {packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePackage(idx)}
                          className="p-1 rounded text-charcoal-400 hover:text-red-500 hover:bg-red-50 transition"
                          title="Delete package tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="label-field text-xs">
                        Package Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        data-error-field={`package_${idx}_name`}
                        className={`input-field text-xs py-2 ${nameErr ? "border-red-300 focus:ring-red-400" : ""}`}
                        value={pkg.name}
                        onChange={(e) => handleUpdatePackage(idx, "name", e.target.value)}
                        placeholder="e.g. Individual Devotee Sankalp"
                        required
                      />
                      {nameErr && <p className="text-xs text-red-500 mt-0.5">{nameErr}</p>}
                    </div>

                    <div>
                      <label className="label-field text-xs">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        data-error-field={`package_${idx}_price`}
                        className={`input-field text-xs py-2 font-semibold ${priceErr ? "border-red-300 focus:ring-red-400" : ""}`}
                        value={pkg.price}
                        onChange={(e) => handleUpdatePackage(idx, "price", Number(e.target.value))}
                        required
                      />
                      {priceErr && <p className="text-xs text-red-500 mt-0.5">{priceErr}</p>}
                    </div>

                    <div>
                      <label className="label-field text-xs">
                        Max Devotees <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        data-error-field={`package_${idx}_maxDevotees`}
                        className={`input-field text-xs py-2 ${maxDevErr ? "border-red-300 focus:ring-red-400" : ""}`}
                        value={pkg.maxDevotees}
                        onChange={(e) => handleUpdatePackage(idx, "maxDevotees", Number(e.target.value))}
                        required
                      />
                      {maxDevErr && <p className="text-xs text-red-500 mt-0.5">{maxDevErr}</p>}
                    </div>

                    <div className="sm:col-span-3">
                      <label className="label-field text-xs">Tier Description</label>
                      <input
                        type="text"
                        className="input-field text-xs py-2"
                        value={pkg.description || ""}
                        onChange={(e) => handleUpdatePackage(idx, "description", e.target.value)}
                        placeholder="Brief summary of what this devotee package covers..."
                      />
                    </div>

                    {/* Features checklist */}
                    <div className="sm:col-span-3">
                      <div className="flex items-center justify-between mb-1">
                        <label className="label-field text-xs mb-0">Included Features / Deliverables</label>
                        <button
                          type="button"
                          onClick={() => handleAddPackageFeature(idx)}
                          className="text-[11px] text-saffron-600 hover:text-saffron-700 font-medium"
                        >
                          + Add Item
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {(pkg.features || []).map((feat, featIdx) => (
                          <div key={featIdx} className="flex items-center gap-2">
                            <span className="text-charcoal-300 text-xs">•</span>
                            <input
                              type="text"
                              className="input-field text-xs py-1.5"
                              value={feat}
                              onChange={(e) => handleUpdatePackageFeature(idx, featIdx, e.target.value)}
                              placeholder="e.g. Personalized Gotra chanting during Sankalp"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePackageFeature(idx, featIdx)}
                              className="text-charcoal-400 hover:text-red-500 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Ritual Content */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100">
            6. Ritual Content
          </h3>
          <div className="space-y-6">
            {/* Benefits */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">Spiritual Benefits</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("benefits")}
                  className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Benefit
                </button>
              </div>
              <div className="space-y-2">
                {form.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input-field text-xs py-2"
                      value={b}
                      onChange={(e) => handleUpdateListItem("benefits", i, e.target.value)}
                      placeholder="e.g. Dissolves negative energies and planetary doshas"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem("benefits", i)}
                      className="text-charcoal-400 hover:text-red-500 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Significance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">Vedic Significance & History</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("significance")}
                  className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Point
                </button>
              </div>
              <div className="space-y-2">
                {form.significance.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input-field text-xs py-2"
                      value={s}
                      onChange={(e) => handleUpdateListItem("significance", i, e.target.value)}
                      placeholder="e.g. Performed along the sacred Ganga on Pradosh tithi"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem("significance", i)}
                      className="text-charcoal-400 hover:text-red-500 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">What's Included in Sankalp</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("whatsIncluded")}
                  className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Deliverable
                </button>
              </div>
              <div className="space-y-2">
                {form.whatsIncluded.map((w, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input-field text-xs py-2"
                      value={w}
                      onChange={(e) => handleUpdateListItem("whatsIncluded", i, e.target.value)}
                      placeholder="e.g. Consecrated Prasad box dispatched to your doorstep"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem("whatsIncluded", i)}
                      className="text-charcoal-400 hover:text-red-500 p-1.5"
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
                  onClick={() => handleAddListItem("procedureSteps")}
                  className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Step
                </button>
              </div>
              <div className="space-y-2">
                {form.procedureSteps.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cream-100 text-charcoal-600 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      className="input-field text-xs py-2"
                      value={p}
                      onChange={(e) => handleUpdateListItem("procedureSteps", i, e.target.value)}
                      placeholder="e.g. Swasti Vachan and Ganpati Pujan"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem("procedureSteps", i)}
                      className="text-charcoal-400 hover:text-red-500 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 7. Publishing & Visibility */}
        <div className="card p-5">
          <h3 className="text-base font-semibold text-charcoal-800 mb-4 pb-2 border-b border-cream-100">
            7. Publishing & Visibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Publication Status</label>
              <select
                className="input-field font-medium"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as UpcomingPujaStatus,
                  }))
                }
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-charcoal-400 mt-1">
                "Published" makes the ceremony visible on the public devotee website.
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <label className="inline-flex items-center gap-2.5 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-saffron-600 rounded border-cream-300 focus:ring-saffron-400"
                />
                <div>
                  <span className="text-sm text-charcoal-700 font-semibold block">
                    Mark as Featured Ceremony
                  </span>
                  <span className="text-xs text-charcoal-400 block">
                    Appears in the Next Upcoming Spotlight banner on the customer portal.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end pt-2">
          <Link to="/admin/upcoming-pujas" className="btn-secondary w-full sm:w-auto">
            Cancel
          </Link>
          <button
            type="button"
            disabled={submitting || bannerUploading || galleryUploading}
            onClick={(e) => handleSubmit(e, "Draft")}
            className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            type="submit"
            disabled={submitting || bannerUploading || galleryUploading}
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Ceremony...</span>
              </>
            ) : form.status === "Published" ? (
              isEdit ? "Update & Publish Puja" : "Publish Upcoming Puja"
            ) : isEdit ? (
              "Update Upcoming Puja"
            ) : (
              "Create Upcoming Puja"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
