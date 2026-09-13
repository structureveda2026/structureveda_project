import { useState, useEffect } from "react";
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
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
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

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Form state interface
interface FormState {
  name: string;
  slug: string;
  eyebrow: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  occasion: string;
  location: string;
  temple: string;
  deity: string;
  ceremonyDate: string;
  startDateTime: string;
  bookingCloseAt: string;
  totalCapacity: number;
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
  name: "Individual Sankalp",
  price: 1100,
  maxDevotees: 1,
  description: "Single devotee sankalp with personalized gotra and name chanting.",
  features: ["Sankalp with Name & Gotra", "Puja Video Snippet", "Dry Prasad Delivered"],
  isDefault: true,
};

export default function UpcomingPujaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [existingBookedCount, setExistingBookedCount] = useState(0);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    eyebrow: "",
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    category: "Special Occasion Pujas",
    occasion: "Pradosh",
    location: "Varanasi, Uttar Pradesh",
    temple: "Kashi Vishwanath Corridor",
    deity: "Lord Shiva",
    ceremonyDate: "",
    startDateTime: "",
    bookingCloseAt: "",
    totalCapacity: 100,
    isFeatured: false,
    remoteAvailable: true,
    status: "Draft",
    bannerImage: "",
    galleryImages: [],
    benefits: [],
    significance: [],
    whatsIncluded: [],
    procedureSteps: [],
  });

  const [packages, setPackages] = useState<PujaPackageData[]>([{ ...defaultPackage }]);

  // Load existing data when editing
  useEffect(() => {
    if (!isEdit || !id) return;

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await upcomingPujaService.getUpcomingPuja(id);
        setExistingBookedCount(data.bookedCount || 0);

        // Format dates for input fields (YYYY-MM-DD and YYYY-MM-DDTHH:mm)
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
          location: data.location || "",
          temple: data.temple || "",
          deity: data.deity || "",
          ceremonyDate: ceremonyDateFormatted,
          startDateTime: toDatetimeLocal(data.startDateTime),
          bookingCloseAt: toDatetimeLocal(data.bookingCloseAt),
          totalCapacity: data.totalCapacity || 100,
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
        setError((err as Error).message || "Unable to load existing Puja record.");
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
  };

  // Helper for dynamic string list fields
  const handleAddListItem = (field: keyof FormState, value = "") => {
    setForm((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value],
    }));
  };

  const handleUpdateListItem = (
    field: keyof FormState,
    index: number,
    value: string,
  ) => {
    setForm((prev) => {
      const list = [...(prev[field] as string[])];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const handleRemoveListItem = (field: keyof FormState, index: number) => {
    setForm((prev) => {
      const list = [...(prev[field] as string[])];
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
      description: "Comprehensive family sankalp tier.",
      features: ["Personalized Sankalp", "Puja Video", "Prasad Delivery"],
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
      alert("At least one package is required for an Upcoming Puja.");
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent, overrideStatus?: UpcomingPujaStatus) => {
    e.preventDefault();
    setError("");

    // Client validation
    if (!form.name.trim()) {
      setError("Puja ceremony name is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }
    if (!form.ceremonyDate) {
      setError("Ceremony Date is required.");
      return;
    }
    if (!form.startDateTime) {
      setError("Ceremony Start Date & Time is required.");
      return;
    }

    const startDate = new Date(form.startDateTime);
    if (form.bookingCloseAt) {
      const closeDate = new Date(form.bookingCloseAt);
      if (closeDate > startDate) {
        setError(
          "Booking close cutoff time cannot be after the ceremony start date and time.",
        );
        return;
      }
    }

    const parsedCap = parseInt(String(form.totalCapacity), 10);
    if (isNaN(parsedCap) || parsedCap <= 0) {
      setError("Total Capacity must be a positive integer greater than zero.");
      return;
    }

    if (isEdit && parsedCap < existingBookedCount) {
      setError(
        `Cannot reduce Total Capacity to ${parsedCap} because ${existingBookedCount} devotee slots are already booked.`,
      );
      return;
    }

    if (packages.length === 0) {
      setError("Please define at least one package for this Puja.");
      return;
    }

    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      if (!pkg.name.trim()) {
        setError(`Package #${i + 1} must have a valid title/name.`);
        return;
      }
      if (isNaN(Number(pkg.price)) || Number(pkg.price) < 0) {
        setError(`Package "${pkg.name}" price must be >= 0.`);
        return;
      }
      if (isNaN(Number(pkg.maxDevotees)) || Number(pkg.maxDevotees) < 1) {
        setError(`Package "${pkg.name}" max devotees must be at least 1.`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload: UpcomingPujaPayload = {
        name: form.name.trim(),
        slug: slugify(form.slug),
        eyebrow: form.eyebrow.trim() || null,
        tagline: form.tagline.trim() || null,
        shortDescription: form.shortDescription.trim() || null,
        fullDescription: form.fullDescription.trim() || null,
        category: form.category || null,
        occasion: form.occasion || null,
        location: form.location.trim() || null,
        temple: form.temple.trim() || null,
        deity: form.deity.trim() || null,
        ceremonyDate: form.ceremonyDate,
        startDateTime: new Date(form.startDateTime).toISOString(),
        bookingCloseAt: form.bookingCloseAt
          ? new Date(form.bookingCloseAt).toISOString()
          : null,
        totalCapacity: parsedCap,
        isFeatured: Boolean(form.isFeatured),
        remoteAvailable: Boolean(form.remoteAvailable),
        status: overrideStatus || form.status,
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
      } else {
        await upcomingPujaService.createUpcomingPuja(payload);
      }

      navigate("/admin/upcoming-pujas");
    } catch (err) {
      setError(
        (err as Error).message ||
          "Failed to save Upcoming Puja. Please check the fields and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-charcoal-500">Loading ceremony details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Navigation Breadcrumb */}
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
            : "Define a sacred upcoming ceremony, configure devotee packages and schedule bookings."
        }
      />

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Validation Notice</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* 1. Basic Information */}
        <div className="card p-6 space-y-5">
          <div className="border-b border-cream-200 pb-3">
            <h2 className="text-base font-bold text-charcoal-800">
              1. Basic Ceremony Information
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              General identifying titles, descriptive copy, and categorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">
                Ceremony Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field font-medium text-base"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Maha Rudrabhishek & Ganga Aarti Sankalp"
                required
              />
            </div>

            <div>
              <label className="label-field">
                Unique Slug <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 font-mono text-xs">
                  /
                </span>
                <input
                  type="text"
                  className="input-field pl-7 font-mono text-xs"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                  }}
                  placeholder="maha-rudrabhishek-ganga-aarti"
                  required
                />
              </div>
              <p className="text-[11px] text-charcoal-400 mt-1">
                Used in public URLs (/puja/slug). Must be unique across all pujas.
              </p>
            </div>

            <div>
              <label className="label-field">Eyebrow Tag</label>
              <input
                type="text"
                className="input-field"
                value={form.eyebrow}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, eyebrow: e.target.value }))
                }
                placeholder="e.g. Kashi Special, Maha Shivratri"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Tagline / Hero Hook</label>
              <input
                type="text"
                className="input-field"
                value={form.tagline}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tagline: e.target.value }))
                }
                placeholder="e.g. Live from Manikarnika Ghat with personalized Vedic Sankalp."
              />
            </div>

            <div>
              <label className="label-field">Category</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
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
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, occasion: e.target.value }))
                }
              >
                {OCCASION_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Short Overview</label>
              <textarea
                rows={2}
                className="input-field"
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="Brief summary for listings and discovery cards..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Full Ceremony Description</label>
              <textarea
                rows={4}
                className="input-field"
                value={form.fullDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fullDescription: e.target.value,
                  }))
                }
                placeholder="Comprehensive description of spiritual benefits, history and significance..."
              />
            </div>
          </div>
        </div>

        {/* 2. Date, Timing & Capacity Management */}
        <div className="card p-6 space-y-5">
          <div className="border-b border-cream-200 pb-3">
            <h2 className="text-base font-bold text-charcoal-800">
              2. Ceremony Date, Timing & Quota
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Configure event dates, cutoff schedules and overall participant capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label-field">
                Ceremony Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="input-field"
                value={form.ceremonyDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ceremonyDate: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="label-field">
                Ceremony Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.startDateTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startDateTime: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="label-field">Booking Cutoff (Optional)</label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.bookingCloseAt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bookingCloseAt: e.target.value }))
                }
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Bookings close after this time (must be before ceremony start).
              </p>
            </div>

            <div>
              <label className="label-field">
                Total Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                className="input-field font-semibold"
                value={form.totalCapacity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    totalCapacity: parseInt(e.target.value, 10) || 0,
                  }))
                }
                required
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Maximum overall booking slots available for this ceremony.
              </p>
            </div>
          </div>

          {/* Operational Booked Count Display (Read-Only) */}
          {isEdit && (
            <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-charcoal-500" />
                <span className="text-charcoal-600">
                  Current Operational Bookings:{" "}
                  <strong className="text-charcoal-900 text-sm font-bold">
                    {existingBookedCount}
                  </strong>{" "}
                  slots booked
                </span>
              </div>
              <span className="text-[11px] text-charcoal-400 italic">
                (Managed automatically by booking transactions. Cannot be edited arbitrarily.)
              </span>
            </div>
          )}
        </div>

        {/* 3. Location & Temple Details */}
        <div className="card p-6 space-y-5">
          <div className="border-b border-cream-200 pb-3">
            <h2 className="text-base font-bold text-charcoal-800">
              3. Sacred Location & Temple
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Specify where the physical ritual will be performed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-field">City / Destination</label>
              <input
                type="text"
                className="input-field"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="e.g. Varanasi, Uttar Pradesh"
              />
            </div>

            <div>
              <label className="label-field">Temple / Ghat / Ashram</label>
              <input
                type="text"
                className="input-field"
                value={form.temple}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, temple: e.target.value }))
                }
                placeholder="e.g. Kashi Vishwanath Corridor"
              />
            </div>

            <div>
              <label className="label-field">Presiding Deity</label>
              <input
                type="text"
                className="input-field"
                value={form.deity}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, deity: e.target.value }))
                }
                placeholder="e.g. Lord Shiva, Maa Ganga"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.remoteAvailable}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    remoteAvailable: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-saffron-600 rounded border-cream-300 focus:ring-saffron-400"
              />
              <span className="text-sm text-charcoal-700 font-medium">
                Remote / Online Sankalp Available (Devotees can participate from anywhere)
              </span>
            </label>
          </div>
        </div>

        {/* 4. Visual Media (Images) */}
        <div className="card p-6 space-y-5">
          <div className="border-b border-cream-200 pb-3">
            <h2 className="text-base font-bold text-charcoal-800">
              4. Media & Visuals
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Banner image and photo gallery URLs for editorial presentation.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label-field">Banner Hero Image URL</label>
              <input
                type="url"
                className="input-field"
                value={form.bannerImage}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bannerImage: e.target.value }))
                }
                placeholder="https://images.unsplash.com/photo-..."
              />
              {form.bannerImage && (
                <div className="mt-2.5">
                  <span className="text-xs text-charcoal-400 block mb-1">Preview:</span>
                  <img
                    src={form.bannerImage}
                    alt="Banner preview"
                    className="w-full max-w-md h-36 object-cover rounded-xl border border-cream-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-field mb-0">Gallery Images (URLs)</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("galleryImages")}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Gallery Photo
                </button>
              </div>

              {form.galleryImages.length === 0 ? (
                <p className="text-xs text-charcoal-400 italic">
                  No gallery images added yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {form.galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        className="input-field text-xs py-2"
                        value={imgUrl}
                        onChange={(e) =>
                          handleUpdateListItem("galleryImages", idx, e.target.value)
                        }
                        placeholder="https://..."
                      />
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt="preview"
                          className="w-9 h-9 rounded object-cover border border-cream-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem("galleryImages", idx)}
                        className="p-2 text-charcoal-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Packages Management (Dynamic Package Editor) */}
        <div className="card p-6 space-y-5">
          <div className="border-b border-cream-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-charcoal-800">
                5. Devotee Packages
              </h2>
              <p className="text-xs text-charcoal-400 mt-0.5">
                Define booking tiers. Note: <strong>Max Devotees</strong> is the limit for that package tier, while <strong>Total Capacity</strong> above controls overall ceremony attendees.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPackage}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Another Package
            </button>
          </div>

          <div className="space-y-4">
            {packages.map((pkg, pIdx) => (
              <div
                key={pIdx}
                className={`p-4 rounded-xl border transition-all ${
                  pkg.isDefault
                    ? "border-saffron-400 bg-saffron-50/20 shadow-sm"
                    : "border-cream-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cream-100 text-charcoal-700 font-bold text-xs flex items-center justify-center">
                      {pIdx + 1}
                    </span>
                    <span className="font-semibold text-sm text-charcoal-800">
                      {pkg.name || `Package #${pIdx + 1}`}
                    </span>
                    {pkg.isDefault && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-100 px-2 py-0.5 rounded-full">
                        Default Package
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetDefaultPackage(pIdx)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                        pkg.isDefault
                          ? "bg-saffron-500 text-white"
                          : "text-charcoal-500 hover:bg-cream-100"
                      }`}
                    >
                      {pkg.isDefault ? "Selected as Default" : "Set as Default"}
                    </button>
                    {packages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePackage(pIdx)}
                        className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label-field text-xs">
                      Package Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input-field text-xs py-2"
                      value={pkg.name}
                      onChange={(e) =>
                        handleUpdatePackage(pIdx, "name", e.target.value)
                      }
                      placeholder="e.g. Individual, Couple, Family"
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field text-xs">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="input-field text-xs py-2 font-semibold"
                      value={pkg.price}
                      onChange={(e) =>
                        handleUpdatePackage(
                          pIdx,
                          "price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="label-field text-xs">
                      Max Devotee Names <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input-field text-xs py-2"
                      value={pkg.maxDevotees}
                      onChange={(e) =>
                        handleUpdatePackage(
                          pIdx,
                          "maxDevotees",
                          parseInt(e.target.value, 10) || 1,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="label-field text-xs">Short Description</label>
                    <input
                      type="text"
                      className="input-field text-xs py-2"
                      value={pkg.description || ""}
                      onChange={(e) =>
                        handleUpdatePackage(pIdx, "description", e.target.value)
                      }
                      placeholder="e.g. Single devotee sankalp with prasad box."
                    />
                  </div>

                  {/* Package Features List */}
                  <div className="sm:col-span-3 pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-charcoal-600">
                        Package Inclusions / Features:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddPackageFeature(pIdx)}
                        className="text-[11px] text-saffron-700 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Feature
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {(pkg.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                          <input
                            type="text"
                            className="input-field text-xs py-1.5"
                            value={feat}
                            onChange={(e) =>
                              handleUpdatePackageFeature(
                                pIdx,
                                fIdx,
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Sankalp with Gotra chanting"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemovePackageFeature(pIdx, fIdx)
                            }
                            className="p-1 text-charcoal-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Benefits, Significance & Procedure (Dynamic String Lists) */}
        <div className="card p-6 space-y-5">
          <div className="border-b border-cream-200 pb-3">
            <h2 className="text-base font-bold text-charcoal-800">
              6. Ritual Content & Structured Lists
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Structured editorial lists displayed on public puja landing pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Benefits */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="label-field mb-0">Key Benefits</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("benefits")}
                  className="text-xs text-saffron-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Benefit
                </button>
              </div>
              {form.benefits.length === 0 ? (
                <p className="text-xs text-charcoal-400 italic">No benefits added.</p>
              ) : (
                <div className="space-y-2">
                  {form.benefits.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input-field text-xs py-2"
                        value={item}
                        onChange={(e) =>
                          handleUpdateListItem("benefits", idx, e.target.value)
                        }
                        placeholder="e.g. Eliminates negative energies and brings mental peace"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem("benefits", idx)}
                        className="p-2 text-charcoal-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Significance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="label-field mb-0">Sacred Significance</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("significance")}
                  className="text-xs text-saffron-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Point
                </button>
              </div>
              {form.significance.length === 0 ? (
                <p className="text-xs text-charcoal-400 italic">No points added.</p>
              ) : (
                <div className="space-y-2">
                  {form.significance.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input-field text-xs py-2"
                        value={item}
                        onChange={(e) =>
                          handleUpdateListItem("significance", idx, e.target.value)
                        }
                        placeholder="e.g. Performed on holy Pradosh tithi along sacred Ganga"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem("significance", idx)}
                        className="p-2 text-charcoal-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="label-field mb-0">What's Included</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("whatsIncluded")}
                  className="text-xs text-saffron-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Inclusion
                </button>
              </div>
              {form.whatsIncluded.length === 0 ? (
                <p className="text-xs text-charcoal-400 italic">No items added.</p>
              ) : (
                <div className="space-y-2">
                  {form.whatsIncluded.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="input-field text-xs py-2"
                        value={item}
                        onChange={(e) =>
                          handleUpdateListItem("whatsIncluded", idx, e.target.value)
                        }
                        placeholder="e.g. Pure Ganga Jal, Belpatra and Vibhuti prasad"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem("whatsIncluded", idx)}
                        className="p-2 text-charcoal-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Procedure Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="label-field mb-0">Ritual Procedure Steps</label>
                <button
                  type="button"
                  onClick={() => handleAddListItem("procedureSteps")}
                  className="text-xs text-saffron-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Step
                </button>
              </div>
              {form.procedureSteps.length === 0 ? (
                <p className="text-xs text-charcoal-400 italic">No steps added.</p>
              ) : (
                <div className="space-y-2">
                  {form.procedureSteps.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-charcoal-400 w-5 text-right">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        className="input-field text-xs py-2"
                        value={item}
                        onChange={(e) =>
                          handleUpdateListItem("procedureSteps", idx, e.target.value)
                        }
                        placeholder="e.g. Swasti Vachan and Ganesh Puja"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveListItem("procedureSteps", idx)}
                        className="p-2 text-charcoal-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 7. Publishing & Visibility */}
        <div className="card p-6 space-y-4">
          <div className="border-b border-cream-200 pb-3">
            <h2 className="text-base font-bold text-charcoal-800">
              7. Publishing & Spotlight Status
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Control public availability and spotlight positioning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">
                Publication Status <span className="text-red-500">*</span>
              </label>
              <select
                className="input-field font-semibold"
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
                Only "Published" ceremonies appear in public listings. Drafts remain private to admin.
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <label className="inline-flex items-center gap-2.5 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))
                  }
                  className="w-4 h-4 text-saffron-600 rounded border-cream-300 focus:ring-saffron-400"
                />
                <span className="text-sm font-semibold text-charcoal-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Mark as Featured Puja (Hero Spotlight)
                </span>
              </label>
              <p className="text-[11px] text-charcoal-400 mt-1 ml-6">
                Note: Setting this as featured will automatically un-feature any other ceremony in the database.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-cream-200">
          <Link to="/admin/upcoming-pujas" className="btn-secondary w-full sm:w-auto">
            Cancel
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {form.status !== "Published" && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "Draft")}
                disabled={submitting}
                className="btn-secondary w-full sm:w-auto"
              >
                Save as Draft
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full sm:w-auto min-w-[140px] flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>
                {submitting
                  ? "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : form.status === "Published"
                      ? "Publish Ceremony"
                      : "Create Ceremony"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
