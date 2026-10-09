import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PathCategoryIcon from "@/components/PathCategoryIcon";
import { useToast } from "@/context/ToastContext";
import * as mediaUploadService from "@/services/mediaUploadService";
import pathCategoryAdminService, {
  PathCategoryPayload,
  SUPPORTED_CATEGORY_ICONS,
} from "@/services/pathCategoryAdminService";

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

export default function PathCategoryForm() {
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
    iconName: "BookOpen",
    displayOrder: 0,
    isActive: true,
  });

  // Load existing category in edit mode
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const cat = await pathCategoryAdminService.getCategoryById(id);
        setForm({
          name: cat.name || "",
          slug: cat.slug || "",
          description: cat.description || "",
          image: cat.image || "",
          iconName: cat.iconName || "BookOpen",
          displayOrder: typeof cat.displayOrder === "number" ? cat.displayOrder : 0,
          isActive: Boolean(cat.isActive),
        });
        setSlugManuallyEdited(true); // Don't auto-overwrite existing slug
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to load category details.");
        navigate("/admin/path/categories");
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

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug: slugify(slug) }));
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    setImageUploading(true);
    try {
      const result = await mediaUploadService.uploadImage(file, {
        folder: "path_categories",
      });
      setForm((prev) => ({ ...prev, image: result.url }));
      toast.success("Category image uploaded successfully.");
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to upload image.");
    } finally {
      setImageUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.name.trim()) {
      errs.name = "Category name is required.";
    }

    if (!form.slug.trim()) {
      errs.slug = "URL slug is required.";
    } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
      errs.slug = "Slug must contain only lowercase letters, numbers, and hyphens.";
    }

    if (form.displayOrder < 0) {
      errs.displayOrder = "Display order must be a non-negative number.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors before saving.");
      return;
    }

    setSubmitting(true);
    const payload: PathCategoryPayload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      iconName: form.iconName || "BookOpen",
      displayOrder: Number(form.displayOrder) || 0,
      isActive: form.isActive,
    };

    try {
      if (isEdit && id) {
        await pathCategoryAdminService.updateCategory(id, payload);
        toast.success(`Category "${payload.name}" updated successfully.`);
      } else {
        await pathCategoryAdminService.createCategory(payload);
        toast.success(`Category "${payload.name}" created successfully.`);
      }
      navigate("/admin/path/categories");
    } catch (err: unknown) {
      const errorObj = err as {
        status?: number;
        message?: string;
        response?: { data?: { message?: string } };
      };
      const msg =
        errorObj.response?.data?.message ||
        errorObj.message ||
        "An unexpected error occurred.";

      if (errorObj.status === 409 || msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already exists")) {
        if (msg.toLowerCase().includes("slug")) {
          setErrors((prev) => ({ ...prev, slug: "A category with this slug already exists." }));
        } else if (msg.toLowerCase().includes("name")) {
          setErrors((prev) => ({ ...prev, name: "A category with this name already exists." }));
        } else {
          setErrors((prev) => ({ ...prev, slug: "Slug or Name already in use." }));
        }
      }
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-charcoal-500">
          Loading category information...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title={isEdit ? "Edit Path Category" : "New Path Category"}
        subtitle={
          isEdit
            ? `Update details and classification settings for "${form.name || "Category"}"`
            : "Create a new Liturgical Category for Vedic Scripture & Parayan Recitations."
        }
        actions={
          <Link
            to="/admin/path/categories"
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <div className="card p-6 space-y-5">
          <h3 className="text-base font-semibold text-charcoal-800 border-b border-cream-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-saffron-600" />
            General Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category Name */}
            <div>
              <label className="label-field">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Ramayana & Manas Parayan"
                className={`input-field ${errors.name ? "border-red-400 focus:ring-red-400" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* URL Slug */}
            <div>
              <label className="label-field">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-charcoal-400 font-mono">
                  /
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="ramayana-manas-path"
                  className={`input-field pl-6 font-mono text-xs ${errors.slug ? "border-red-400 focus:ring-red-400" : ""}`}
                />
              </div>
              {errors.slug && (
                <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
              )}
              <p className="text-[11px] text-charcoal-400 mt-1">
                Used in public discovery routes: /yagya-puja/path/category/:slug
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label-field">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief liturgical summary of this scripture category, traditions, and auspicious vidhi..."
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Visual Assets Card */}
        <div className="card p-6 space-y-5">
          <h3 className="text-base font-semibold text-charcoal-800 border-b border-cream-100 pb-3 flex items-center gap-2">
            <PathCategoryIcon iconName={form.iconName} className="w-4 h-4 text-saffron-600" />
            Icon & Featured Banner
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Icon Picker */}
            <div>
              <label className="label-field">Category Icon</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center text-saffron-600 flex-shrink-0">
                  <PathCategoryIcon iconName={form.iconName} className="w-6 h-6 text-saffron-600" />
                </div>
                <div className="flex-1">
                  <select
                    value={form.iconName}
                    onChange={(e) => setForm((p) => ({ ...p, iconName: e.target.value }))}
                    className="input-field text-sm"
                  >
                    {SUPPORTED_CATEGORY_ICONS.map((opt) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-charcoal-400 mt-2">
                Displayed in navigation, category cards, and admin tables.
              </p>
            </div>

            {/* Display Order */}
            <div>
              <label className="label-field">Display Order</label>
              <input
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: parseInt(e.target.value, 10) || 0 }))}
                className="input-field"
              />
              {errors.displayOrder && (
                <p className="text-xs text-red-500 mt-1">{errors.displayOrder}</p>
              )}
              <p className="text-[11px] text-charcoal-400 mt-1">
                Lower values display earlier in category carousels and lists.
              </p>
            </div>

            {/* Image Banner Upload */}
            <div className="md:col-span-2">
              <label className="label-field">Featured Category Image</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {form.image ? (
                  <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-cream-200 bg-cream-50 flex-shrink-0">
                    <img
                      src={form.image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, image: "" }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-charcoal-800/80 text-white hover:bg-red-600 transition cursor-pointer"
                      title="Remove Image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-36 h-24 rounded-lg border-2 border-dashed border-cream-300 flex flex-col items-center justify-center text-charcoal-400 text-xs flex-shrink-0 bg-cream-50/50">
                    <BookOpen className="w-6 h-6 text-charcoal-300 mb-1" />
                    <span>No image</span>
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={imageUploading}
                      className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      {imageUploading ? "Uploading..." : form.image ? "Change Image" : "Upload Image"}
                    </button>
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, image: "" }))}
                        className="text-xs text-charcoal-500 hover:text-red-600 transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                    placeholder="Or paste external image URL..."
                    className="input-field text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-charcoal-800 text-sm">
                Active & Visible
              </p>
              <p className="text-xs text-charcoal-500 mt-0.5">
                When active, this category is displayed in customer category discovery and public filters.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-cream-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-saffron-500"></div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
          <Link
            to="/admin/path/categories"
            className="btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}
