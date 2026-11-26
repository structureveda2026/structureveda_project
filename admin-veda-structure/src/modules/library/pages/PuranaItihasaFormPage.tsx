import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookOpen,
  Sparkles,
  Scroll,
  Eye,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import type {
  PuranaItihasaGrantha,
  GranthaCategory,
  GunaClassification,
  GranthaStatus,
} from "../types/puranaItihasa.types";
import PuranaItihasaAdminService from "../services/puranaItihasa.service";

export const PuranaItihasaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState<boolean>(false);
  const [activePreviewTab, setActivePreviewTab] = useState<"edit" | "preview">("edit");

  // Form State
  const [formData, setFormData] = useState<Partial<PuranaItihasaGrantha>>({
    id: "",
    slug: "",
    name: "",
    enName: "",
    hinglishName: "",
    category: "purana",
    guna: "sattvika",
    chiefDeity: "",
    primaryRishis: "",
    shlokaCount: "",
    adhyayaCount: "",
    stats: "",
    eyebrow: "",
    intro: "",
    overviewText: "",
    orderIndex: 1,
    status: "ACTIVE",
    badge: "Sattvika Mahapurana",
  });

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-slug control
  const [autoSlug, setAutoSlug] = useState<boolean>(!isEditing);

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchGrantha = async () => {
        try {
          setLoading(true);
          const data = await PuranaItihasaAdminService.getTextById(id);
          if (data) {
            setFormData({
              ...data,
              stats: data.stats || `${data.adhyayaCount || "Chapters"} • ${data.shlokaCount || "Shlokas"}`,
            });
            setAutoSlug(false);
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to load scripture details";
          showError(msg || "Failed to load scripture details");
        } finally {
          setLoading(false);
        }
      };
      fetchGrantha();
    }
  }, [id, isEditing, showError]);

  // Handle English Name Change & Auto-slug
  const handleEnNameChange = (val: string) => {
    setFormData((prev) => {
      const updated = { ...prev, enName: val };
      if (autoSlug) {
        updated.slug = val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return updated;
    });

    if (errors.enName) {
      setErrors((prev) => ({ ...prev, enName: "" }));
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errs.name = "Hindi name is required (e.g. Brahma Purana, Vishnu Purana)";
    }
    if (!formData.enName?.trim()) {
      errs.enName = "English name is required (e.g. Vishnu Purana)";
    }
    if (!formData.slug?.trim()) {
      errs.slug = "URL slug is required";
    }
    if (!formData.category) {
      errs.category = "Please select a category";
    }
    if (!formData.guna) {
      errs.guna = "Please select a Guna classification";
    }
    if (!formData.chiefDeity?.trim()) {
      errs.chiefDeity = "Chief Deity name is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save / Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please complete all required fields in the form.");
      return;
    }

    try {
      setSaving(true);

      const finalId = formData.id || formData.slug || Date.now().toString();

      // Resolve badge
      let badge = formData.badge;
      if (!badge) {
        if (formData.guna === "sattvika") badge = "Sattvika Mahapurana";
        else if (formData.guna === "rajasa") badge = "Rajasa Mahapurana";
        else if (formData.guna === "tamasa") badge = "Tamasa Mahapurana";
        else badge = "Sanatana Grantha";
      }

      const payload: Partial<PuranaItihasaGrantha> = {
        ...formData,
        id: finalId,
        badge,
        orderIndex: Number(formData.orderIndex) || 1,
      };

      if (isEditing && id) {
        await PuranaItihasaAdminService.update(id, payload);
        showSuccess(`"${formData.enName || formData.name}" updated successfully!`);
      } else {
        await PuranaItihasaAdminService.create(payload);
        showSuccess(`New scripture "${formData.enName || formData.name}" added successfully!`);
      }

      navigate("/admin/purana-itihasa");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save scripture";
      showError(msg || "Failed to save scripture");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* 1. Header with Breadcrumbs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cream-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-saffron-700 mb-1">
            <Link
              to="/admin/purana-itihasa"
              className="hover:underline flex items-center gap-1 text-charcoal-500 hover:text-saffron-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Purana &amp; Itihasa Archive
            </Link>
            <span>/</span>
            <span className="text-charcoal-700 font-bold">
              {isEditing ? `Edit: ${formData.enName || formData.name || id}` : "Add New Scripture"}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-charcoal-900 font-serif flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-saffron-500" />
            {isEditing ? `Edit Scripture: ${formData.enName || formData.name}` : "Add New Grantha"}
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Enter full metadata, Guna classification, presiding deity, and structural statistics for a Mahapurana, Epic, Upapurana, or philosophical work.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/purana-itihasa"
            className="btn-secondary text-xs"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary text-xs flex items-center gap-2 shadow-md"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : isEditing ? "Save Changes" : "Add Grantha"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-charcoal-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-saffron-500 mb-2" />
          <p className="text-sm font-medium">Loading scripture details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section 1: Basic Information */}
              <div className="card p-6 space-y-4">
                <h3 className="text-base font-bold text-charcoal-900 border-b border-cream-200 pb-2.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-saffron-500" />
                  <span>1. Basic Grantha Identification</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Hindi Name */}
                  <div>
                    <label className="label-field">
                      Hindi Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder="E.g. Brahma Purana / Devanagari title"
                      className={`input-field font-devanagari font-semibold text-sm ${
                        errors.name ? "border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  {/* English Name */}
                  <div>
                    <label className="label-field">
                      English Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.enName || ""}
                      onChange={(e) => handleEnNameChange(e.target.value)}
                      placeholder="E.g. Brahma Purana, Vishnu Purana"
                      className={`input-field text-sm ${
                        errors.enName ? "border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.enName && <p className="text-xs text-red-600 mt-1">{errors.enName}</p>}
                  </div>

                  {/* Hinglish Name */}
                  <div>
                    <label className="label-field">
                      Hinglish Name
                    </label>
                    <input
                      type="text"
                      value={formData.hinglishName || ""}
                      onChange={(e) => setFormData({ ...formData, hinglishName: e.target.value })}
                      placeholder="E.g. Brahma Puran, Vishnu Puran"
                      className="input-field text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slug */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-charcoal-700">
                        URL Slug <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setAutoSlug(!autoSlug)}
                        className="text-[11px] text-saffron-600 hover:underline"
                      >
                        {autoSlug ? "Auto-slug enabled" : "Auto-slug disabled"}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value });
                        if (errors.slug) setErrors({ ...errors, slug: "" });
                      }}
                      disabled={autoSlug}
                      placeholder="vishnu-purana"
                      className={`input-field font-mono text-xs ${
                        autoSlug ? "bg-cream-50 text-charcoal-500" : ""
                      } ${errors.slug ? "border-red-400" : ""}`}
                    />
                    {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
                  </div>

                  {/* Eyebrow badge */}
                  <div>
                    <label className="label-field">Eyebrow Badge</label>
                    <input
                      type="text"
                      value={formData.eyebrow || ""}
                      onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                      placeholder="E.g. Vaishnava Mahapurana • Narrated by Parashara"
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Classification, Deity & Rishis */}
              <div className="card p-6 space-y-4">
                <h3 className="text-base font-bold text-charcoal-900 border-b border-cream-200 pb-2.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>2. Classification, Deity &amp; Rishis</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="label-field">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category || "purana"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as GranthaCategory })
                      }
                      className="input-field text-sm"
                    >
                      <option value="purana">18 Mahapuranas (Mahapurana)</option>
                      <option value="itihasa">Itihasa &amp; Epics (Itihasa)</option>
                      <option value="upapurana">18 Upapuranas (Upapurana)</option>
                      <option value="mahakavya">Classical Epic (Mahakavya)</option>
                    </select>
                  </div>

                  {/* Guna Classification */}
                  <div>
                    <label className="label-field">
                      Guna Classification <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.guna || "sattvika"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guna: e.target.value as GunaClassification,
                          badge:
                            e.target.value === "sattvika"
                              ? "Sattvika Mahapurana"
                              : e.target.value === "rajasa"
                              ? "Rajasa Mahapurana"
                              : e.target.value === "tamasa"
                              ? "Tamasa Mahapurana"
                              : "Sanatana Grantha",
                        })
                      }
                      className="input-field text-sm font-semibold"
                    >
                      <option value="sattvika">Sattvika (Vishnu / Krishna Tradition)</option>
                      <option value="rajasa">Rajasa (Brahma / Surya / Prakriti Tradition)</option>
                      <option value="tamasa">Tamasa (Shiva / Agni / Shakti Tradition)</option>
                      <option value="nirguna">Nirguna / Advaita (Vedantic)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Chief Deity */}
                  <div>
                    <label className="label-field">
                      Chief Deity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.chiefDeity || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, chiefDeity: e.target.value });
                        if (errors.chiefDeity) setErrors({ ...errors, chiefDeity: "" });
                      }}
                      placeholder="E.g. Lord Vishnu, Mahadeva Shiva, Shri Krishna"
                      className={`input-field ${
                        errors.chiefDeity ? "border-red-400" : ""
                      }`}
                    />
                    {errors.chiefDeity && (
                      <p className="text-xs text-red-600 mt-1">{errors.chiefDeity}</p>
                    )}
                  </div>

                  {/* Primary Rishis / Speakers */}
                  <div>
                    <label className="label-field">Primary Rishis / Speakers</label>
                    <input
                      type="text"
                      value={formData.primaryRishis || ""}
                      onChange={(e) => setFormData({ ...formData, primaryRishis: e.target.value })}
                      placeholder="E.g. Maharshi Parashara & Maitreya Muni, Shukadeva Goswami"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Shloka & Adhyaya Stats */}
              <div className="card p-6 space-y-4">
                <h3 className="text-base font-bold text-charcoal-900 border-b border-cream-200 pb-2.5 flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-amber-600" />
                  <span>3. Structural Counts &amp; Metrics</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Shlokas Count */}
                  <div>
                    <label className="label-field">Shloka Count</label>
                    <input
                      type="text"
                      value={formData.shlokaCount || ""}
                      onChange={(e) => setFormData({ ...formData, shlokaCount: e.target.value })}
                      placeholder="E.g. 23,000 or 18,000"
                      className="input-field font-semibold"
                    />
                  </div>

                  {/* Adhyayas Count */}
                  <div>
                    <label className="label-field">Chapters / Sargas Count</label>
                    <input
                      type="text"
                      value={formData.adhyayaCount || ""}
                      onChange={(e) => setFormData({ ...formData, adhyayaCount: e.target.value })}
                      placeholder="E.g. 126 Chapters or 500 Sargas"
                      className="input-field"
                    />
                  </div>

                  {/* Combined Stats Pill */}
                  <div>
                    <label className="label-field">Stats Summary</label>
                    <input
                      type="text"
                      value={formData.stats || ""}
                      onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                      placeholder="E.g. 6 Amshas • 126 Chapters • 7,000 Shlokas"
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Intro & Detailed Overview */}
              <div className="card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
                  <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>4. Intro &amp; Detailed Overview</span>
                  </h3>
                  <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("edit")}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        activePreviewTab === "edit"
                          ? "bg-white text-charcoal-900 shadow-xs"
                          : "text-charcoal-500 hover:text-charcoal-800"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab("preview")}
                      className={`px-3 py-1 rounded-md font-semibold transition ${
                        activePreviewTab === "preview"
                          ? "bg-white text-charcoal-900 shadow-xs"
                          : "text-charcoal-500 hover:text-charcoal-800"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {/* Brief Intro */}
                <div>
                  <label className="label-field">Brief Intro / Tagline</label>
                  <input
                    type="text"
                    value={formData.intro || ""}
                    onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                    placeholder="Sacred chronicle of cosmic creation, preservation, dissolution, and the incarnations of Lord Vishnu."
                    className="input-field text-sm"
                  />
                </div>

                {/* Detailed Overview */}
                <div>
                  <label className="label-field">
                    Detailed Overview / Shastric Significance
                  </label>

                  {activePreviewTab === "edit" ? (
                    <div>
                      <textarea
                        rows={8}
                        value={formData.overviewText || ""}
                        onChange={(e) => setFormData({ ...formData, overviewText: e.target.value })}
                        placeholder="Write the scripture's historical lineage, key narratives, speaker-listener dialogues, philosophical significance, and cultural importance..."
                        className="input-field font-sans text-sm leading-relaxed p-3.5"
                      />
                      <p className="text-[11px] text-charcoal-400 mt-1">
                        Tip: You can include paragraphs, bullet points, or mantra references.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 min-h-[200px] text-sm text-charcoal-800 leading-relaxed font-sans whitespace-pre-line">
                      {formData.overviewText || "No overview text provided."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Publishing Status & Live Card Preview */}
            <div className="space-y-6">
              {/* Publishing Controls */}
              <div className="card p-6 space-y-4">
                <h3 className="text-base font-bold text-charcoal-900 border-b border-cream-200 pb-2.5">
                  Publishing Controls
                </h3>

                {/* Status */}
                <div>
                  <label className="label-field">Publication Status</label>
                  <select
                    value={formData.status || "ACTIVE"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as GranthaStatus })
                    }
                    className="input-field font-semibold text-sm"
                  >
                    <option value="ACTIVE">Active (Published)</option>
                    <option value="DRAFT">Draft (Admin Only)</option>
                    <option value="INACTIVE">Inactive (Hidden)</option>
                  </select>
                </div>

                {/* Order Index */}
                <div>
                  <label className="label-field">Order Index</label>
                  <input
                    type="number"
                    value={formData.orderIndex ?? 1}
                    onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                    className="input-field text-sm"
                  />
                  <p className="text-[11px] text-charcoal-400 mt-1">
                    Display priority order in the catalogue (1–25).
                  </p>
                </div>

                {/* Badge text */}
                <div>
                  <label className="label-field">Badge Text</label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="E.g. Sattvika Mahapurana"
                    className="input-field text-xs"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="card p-6 space-y-3 bg-gradient-to-b from-white to-cream-50 border-saffron-200">
                <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-saffron-600" />
                    Live Card Preview
                  </span>
                  <span className="text-[10px] text-charcoal-400 font-mono">Card View</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-cream-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-saffron-50 text-saffron-700 border border-saffron-200">
                      {formData.category === "purana"
                        ? "Mahapurana"
                        : formData.category === "itihasa"
                        ? "Itihasa"
                        : formData.category}
                    </span>

                    {formData.guna === "sattvika" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Sattvika
                      </span>
                    )}
                    {formData.guna === "rajasa" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Rajasa
                      </span>
                    )}
                    {formData.guna === "tamasa" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        Tamasa
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-lg text-charcoal-900">
                      {formData.enName || formData.name || "Grantha Title"}
                    </h4>
                    {formData.name && formData.name !== formData.enName && (
                      <p className="text-xs text-charcoal-500 font-medium">
                        {formData.name}
                      </p>
                    )}
                  </div>

                  {formData.eyebrow && (
                    <p className="text-xs text-saffron-700 font-semibold line-clamp-1">
                      {formData.eyebrow}
                    </p>
                  )}

                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {formData.intro || "Brief introduction will appear here..."}
                  </p>

                  <div className="pt-2 border-t border-cream-100 flex items-center justify-between text-[11px] text-charcoal-500">
                    <span>{formData.chiefDeity || "Chief Deity"}</span>
                    <span className="font-bold text-charcoal-800">
                      {formData.shlokaCount || "Shloka Count"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="card p-4 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isEditing ? "Save Changes" : "Add Grantha"}</span>
                </button>

                <Link
                  to="/admin/purana-itihasa"
                  className="btn-secondary w-full text-center text-xs py-2"
                >
                  Cancel &amp; Return to List
                </Link>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PuranaItihasaFormPage;
