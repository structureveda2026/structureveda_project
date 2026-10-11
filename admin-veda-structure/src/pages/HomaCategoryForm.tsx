import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  Flame,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import HomaCategoryIcon from "@/components/HomaCategoryIcon";
import { useToast } from "@/context/ToastContext";
import * as mediaUploadService from "@/services/mediaUploadService";
import homaCategoryAdminService, {
  HomaCategoryPayload,
  SUPPORTED_CATEGORY_ICONS,
} from "@/services/homaCategoryAdminService";

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

export default function HomaCategoryForm() {
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
    iconName: "Flame",
    displayOrder: 0,
    isActive: true,
  });

  // Load existing category in edit mode
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const cat = await homaCategoryAdminService.getCategoryById(id);
        setForm({
          name: cat.name || "",
          slug: cat.slug || "",
          description: cat.description || "",
          image: cat.image || "",
          iconName: cat.iconName || "Flame",
          displayOrder: typeof cat.displayOrder === "number" ? cat.displayOrder : 0,
          isActive: Boolean(cat.isActive),
        });
        setSlugManuallyEdited(true); // Don't auto-overwrite existing slug
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to load category details.");
        navigate("/admin/homa/categories");
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

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    setImageUploading(true);
    try {
      const uploadRes = await mediaUploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, image: uploadRes.url }));
      toast.success("Image uploaded successfully.");
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to upload image.");
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

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.name.trim()) {
      errs.name = "Category name is required.";
    }

    if (!form.slug.trim()) {
      errs.slug = "URL slug is required.";
    }

    if (isNaN(form.displayOrder) || form.displayOrder < 0) {
      errs.displayOrder = "Display order must be a non-negative number.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: HomaCategoryPayload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image: form.image || null,
        iconName: form.iconName || "Flame",
        displayOrder: Number(form.displayOrder) || 0,
        isActive: form.isActive,
      };

      if (isEdit && id) {
        await homaCategoryAdminService.updateCategory(id, payload);
        toast.success(`Category "${form.name}" updated successfully.`);
      } else {
        await homaCategoryAdminService.createCategory(payload);
        toast.success(`Category "${form.name}" created successfully.`);
      }

      navigate("/admin/homa/categories");
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = errorObj?.status;
      const msg = errorObj?.message || "Failed to save category.";

      if (status === 409) {
        setErrors((prev) => ({
          ...prev,
          slug: "A category with this slug or name already exists.",
        }));
        toast.error("A category with this slug or name already exists.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={isEdit ? "Edit Homa Category" : "Create Homa Category"}
          subtitle="Loading category data..."
        />
        <div className="card p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEdit ? `Edit: ${form.name || "Category"}` : "Create Homa Category"}
        subtitle={
          isEdit
            ? "Update Vedic tradition classification, display metadata, or visibility."
            : "Define a new Vedic Homa fire ritual category with canonical slug and icon."
        }
        actions={
          <div className="flex items-center gap-3">
            <Link to="/admin/homa/categories" className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Categories</span>
            </Link>
            <button
              type="submit"
              form="homa-category-form"
              disabled={submitting}
              className="btn-primary flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>
                {submitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Category"
                  : "Save Category"}
              </span>
            </button>
          </div>
        }
      />

      <form
        id="homa-category-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Core Metadata Card */}
        <div className="card p-6 space-y-5">
          <h3 className="font-semibold text-charcoal-900 text-base border-b border-cream-200 pb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-saffron-600" />
            <span>Category Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category Name */}
            <div>
              <label className="label-field" htmlFor="cat-name">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                id="cat-name"
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Shiva & Rudra Homa"
                className={`input-field ${
                  errors.name ? "border-red-400 focus:border-red-500" : ""
                }`}
                disabled={submitting}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="label-field" htmlFor="cat-slug">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="cat-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g. shiva-rudra-homa"
                  className={`input-field font-mono text-sm ${
                    errors.slug ? "border-red-400 focus:border-red-500" : ""
                  }`}
                  disabled={submitting}
                />
              </div>
              {errors.slug ? (
                <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
              ) : (
                <p className="text-xs text-charcoal-400 mt-1">
                  Canonical slug used in routes and customer discovery URLs.
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label-field" htmlFor="cat-desc">
              Description
            </label>
            <textarea
              id="cat-desc"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief theological narrative and overview of rituals under this Vedic fire tradition..."
              className="input-field text-sm"
              disabled={submitting}
            />
            <p className="text-xs text-charcoal-400 mt-1">
              Displayed on customer category cards and dedicated hero listings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Icon Selection */}
            <div>
              <label className="label-field" htmlFor="cat-icon">
                Icon Symbol
              </label>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-saffron-50 border border-saffron-200 flex items-center justify-center flex-shrink-0 text-saffron-600 shadow-xs">
                  <HomaCategoryIcon
                    iconName={form.iconName}
                    className="w-5 h-5 text-saffron-600"
                  />
                </div>
                <select
                  id="cat-icon"
                  value={form.iconName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, iconName: e.target.value }))
                  }
                  className="input-field text-sm"
                  disabled={submitting}
                >
                  {SUPPORTED_CATEGORY_ICONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="label-field" htmlFor="cat-order">
                Display Order
              </label>
              <input
                id="cat-order"
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    displayOrder: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className={`input-field font-mono text-sm ${
                  errors.displayOrder ? "border-red-400" : ""
                }`}
                disabled={submitting}
              />
              {errors.displayOrder ? (
                <p className="text-xs text-red-500 mt-1">{errors.displayOrder}</p>
              ) : (
                <p className="text-xs text-charcoal-400 mt-1">
                  Determines display position on customer discovery grids (1 = first).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Media & Image Upload Card */}
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-charcoal-900 text-base border-b border-cream-200 pb-3">
            Category Image
          </h3>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileSelect}
          />

          {form.image ? (
            <div className="space-y-3">
              <div className="relative inline-block border border-cream-200 rounded-xl overflow-hidden bg-cream-50 max-w-sm">
                <img
                  src={form.image}
                  alt={form.name || "Category Preview"}
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-charcoal-900/80 text-white rounded-full hover:bg-red-600 transition shadow-sm cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-mono text-charcoal-400 truncate max-w-md">
                {form.image}
              </p>
            </div>
          ) : (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-cream-300 hover:border-saffron-400 rounded-xl p-8 text-center cursor-pointer transition-colors bg-cream-50/50 hover:bg-cream-50"
            >
              <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron-600 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="font-medium text-charcoal-800 text-sm">
                {imageUploading ? "Uploading..." : "Upload Category Hero Image"}
              </p>
              <p className="text-xs text-charcoal-400 mt-1">
                PNG, JPG, or WebP up to 5MB. If left blank, customer pages use deterministic canonical fallbacks.
              </p>
            </div>
          )}
        </div>

        {/* Visibility Card */}
        <div className="card p-6">
          <h3 className="font-semibold text-charcoal-900 text-base border-b border-cream-200 pb-3 mb-4">
            Visibility & Status
          </h3>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-cream-300 text-saffron-600 focus:ring-saffron-500"
              disabled={submitting}
            />
            <div>
              <span className="font-medium text-charcoal-900 text-sm block">
                Active Category
              </span>
              <span className="text-xs text-charcoal-500 block mt-0.5">
                When checked, this category is visible in customer category discovery, filters, and dedicated listings. Inactive categories are hidden from customers.
              </span>
            </div>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
          <Link to="/admin/homa/categories" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>
              {submitting
                ? "Saving..."
                : isEdit
                ? "Update Category"
                : "Save Category"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
