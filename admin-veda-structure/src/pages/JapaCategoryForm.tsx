import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import JapaCategoryIcon from "@/components/JapaCategoryIcon";
import { useToast } from "@/context/ToastContext";
import * as mediaUploadService from "@/services/mediaUploadService";
import japaCategoryAdminService, {
  JapaCategoryPayload,
  SUPPORTED_CATEGORY_ICONS,
} from "@/services/japaCategoryAdminService";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

interface FormState {
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
}

export default function JapaCategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    image: "",
    iconName: "Sparkles",
    displayOrder: 0,
    isActive: true,
  });

  // Load existing category in edit mode
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const cat = await japaCategoryAdminService.getCategoryById(id);
        setForm({
          name: cat.name || "",
          slug: cat.slug || "",
          description: cat.description || "",
          image: cat.image || "",
          iconName: cat.iconName || "Sparkles",
          displayOrder: typeof cat.displayOrder === "number" ? cat.displayOrder : 0,
          isActive: Boolean(cat.isActive),
        });
        setSlugManuallyEdited(true); // Don't auto-overwrite existing slug
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to load category details.");
        navigate("/admin/japa/categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, navigate, toast]);

  const handleNameChange = (name: string) => {
    setForm((prev) => {
      const next = { ...prev, name };
      if (!slugManuallyEdited) {
        next.slug = slugify(name);
      }
      return next;
    });
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleSlugChange = (rawSlug: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(rawSlug) }));
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  // Image Upload Handler
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const uploaded = await mediaUploadService.uploadImage(file, {
        folder: "japa/categories",
      });
      setForm((prev) => ({ ...prev, image: uploaded.url }));
      toast.success("Category image uploaded successfully.");
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Category name is required.";
    if (!form.slug.trim()) newErrors.slug = "Valid unique slug is required.";
    if (
      isNaN(Number(form.displayOrder)) ||
      !Number.isInteger(Number(form.displayOrder))
    ) {
      newErrors.displayOrder = "Display order must be an integer.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please resolve highlighted validation errors before saving.");
      return;
    }

    setSubmitting(true);
    setErrors({});

    const payload: JapaCategoryPayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      iconName: form.iconName.trim() || "Sparkles",
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
    };

    try {
      if (isEdit && id) {
        await japaCategoryAdminService.updateCategory(id, payload);
        toast.success("Japa category updated successfully.");
      } else {
        await japaCategoryAdminService.createCategory(payload);
        toast.success("Japa category created successfully.");
      }
      navigate("/admin/japa/categories");
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = errorObj?.status;
      const msg = errorObj?.message || "";

      if (status === 409 || msg.toLowerCase().includes("slug already exists")) {
        setErrors({
          slug: "Category slug already exists. Please choose a different slug.",
        });
        toast.error("Slug conflict: category slug already exists.");
      } else if (status === 400) {
        toast.error(msg || "Validation error: please verify form fields.");
      } else {
        toast.error(msg || "Unable to save category. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">
          Loading category details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/japa/categories"
          className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>
      </div>

      <PageHeader
        title={isEdit ? `Edit Category: ${form.name}` : "Create Japa Category"}
        subtitle="Manage Vedic Mantra Japa category metadata, icon, thumbnail, and catalog sequencing."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Information Card */}
        <div className="card p-6 space-y-5">
          <h2 className="text-base font-semibold text-charcoal-900 border-b border-cream-200 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input-field ${
                  errors.name ? "border-red-300 focus:ring-red-400" : ""
                }`}
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Shiva & Moola Mantra Japa, Gayatri & Vedic Japa"
                required
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="label-field">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input-field font-mono text-xs ${
                  errors.slug ? "border-red-300 focus:ring-red-400" : ""
                }`}
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="e.g. shiva-mantra-japa"
                required
              />
              {errors.slug ? (
                <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
              ) : (
                <p className="text-xs text-charcoal-400 mt-1">
                  URL path: /yagya-puja/japa/category/
                  <span className="font-semibold text-charcoal-600">
                    {form.slug || "slug"}
                  </span>
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="label-field">Category Description</label>
              <textarea
                className="input-field min-h-[90px] resize-y"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe the tradition, significance, and spiritual focus of this Mantra Japa category..."
              />
              <p className="text-xs text-charcoal-400 mt-1">
                Shown on the customer category hero section and discovery cards.
              </p>
            </div>
          </div>
        </div>

        {/* Icon & Display Order Card */}
        <div className="card p-6 space-y-5">
          <h2 className="text-base font-semibold text-charcoal-900 border-b border-cream-200 pb-3">
            Icon &amp; Sequencing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Icon selection */}
            <div>
              <label className="label-field">Category Icon</label>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center flex-shrink-0">
                  <JapaCategoryIcon
                    iconName={form.iconName}
                    className="w-5 h-5 text-saffron-600"
                  />
                </div>
                <select
                  className="input-field flex-1"
                  value={form.iconName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, iconName: e.target.value }))
                  }
                >
                  {SUPPORTED_CATEGORY_ICONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-charcoal-400 mt-1.5">
                Controlled Vedic symbol displayed on discovery and navigation.
              </p>
            </div>

            {/* Display Order */}
            <div>
              <label className="label-field">
                Display Order <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                className={`input-field ${
                  errors.displayOrder
                    ? "border-red-300 focus:ring-red-400"
                    : ""
                }`}
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    displayOrder: parseInt(e.target.value, 10) || 0,
                  }))
                }
                placeholder="0"
                required
              />
              {errors.displayOrder ? (
                <p className="text-xs text-red-500 mt-1">{errors.displayOrder}</p>
              ) : (
                <p className="text-xs text-charcoal-400 mt-1.5">
                  Lower numbers display first (e.g. 1, 2, 3).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Image Card */}
        <div className="card p-6 space-y-5">
          <h2 className="text-base font-semibold text-charcoal-900 border-b border-cream-200 pb-3">
            Category Image (Banner / Card)
          </h2>

          <div className="space-y-4">
            {form.image ? (
              <div className="relative rounded-2xl overflow-hidden border border-cream-200 max-w-md bg-cream-50">
                <img
                  src={form.image}
                  alt={form.name || "Category Thumbnail"}
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-cream-300 hover:border-saffron-400 rounded-2xl p-8 text-center cursor-pointer transition bg-cream-50/50 hover:bg-cream-50"
              >
                <UploadCloud className="w-10 h-10 text-charcoal-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-charcoal-700">
                  {imageUploading
                    ? "Uploading image..."
                    : "Click to upload category image"}
                </p>
                <p className="text-xs text-charcoal-400 mt-1">
                  JPG, PNG, WebP up to 5MB. Aspect ratio 16:10 or 16:9 recommended.
                </p>
              </div>
            )}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
              disabled={imageUploading}
            />

            <div>
              <label className="label-field text-xs text-charcoal-500">
                Or paste image URL directly
              </label>
              <input
                type="url"
                className="input-field text-xs"
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="https://images.unsplash.com/... or asset path"
              />
            </div>
          </div>
        </div>

        {/* Status / Visibility Card */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-charcoal-900 border-b border-cream-200 pb-3">
            Visibility &amp; Status
          </h2>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-cream-300 text-saffron-600 focus:ring-saffron-500 cursor-pointer"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
            <div>
              <span className="text-sm font-medium text-charcoal-800 block">
                Category is Active
              </span>
              <span className="text-xs text-charcoal-500 block mt-0.5">
                Active categories are visible on public customer discovery and category listings. Inactive categories remain managed in admin without deleting records.
              </span>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
          <Link
            to="/admin/japa/categories"
            className="btn-secondary px-6 py-2.5 text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-2 px-7 py-2.5 text-sm cursor-pointer"
            disabled={submitting || imageUploading}
          >
            <Save className="w-4 h-4" />
            <span>
              {submitting
                ? "Saving Category..."
                : isEdit
                ? "Update Category"
                : "Create Category"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
