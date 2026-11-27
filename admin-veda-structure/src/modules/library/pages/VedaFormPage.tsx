import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookOpen,
  Sparkles,
  Scroll,
  Image as ImageIcon,
  Flame,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import type { Veda } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";

export const VedaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get("category") || "";
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Veda>>({
    id: "",
    slug: "",
    name: "",
    enName: "",
    category: queryCategory || "veda",
    eyebrow: "",
    intro: "",
    overviewText: "",
    desc: "",
    stats: "",
    priest: "",
    badge: "Shruti",
    imageKey: "",
    bannerImage: "",
    quickInfo: {
      type: "Veda (Shruti)",
      language: "Vedic Sanskrit",
      chiefPriest: "",
      mandalCount: "",
      suktaCount: "",
      chiefRishis: "",
    },
    orderIndex: 1,
    status: "ACTIVE",
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchVeda = async () => {
        try {
          setLoading(true);
          const data = await VedaAdminService.getVedaById(id);
          if (data) {
            setFormData({
              ...data,
              quickInfo: {
                type: data.quickInfo?.type || "Veda (Shruti)",
                language: data.quickInfo?.language || "Vedic Sanskrit",
                chiefPriest: data.quickInfo?.chiefPriest || data.priest || "",
                mandalCount: data.quickInfo?.mandalCount || "",
                suktaCount: data.quickInfo?.suktaCount || "",
                chiefRishis: data.quickInfo?.chiefRishis || "",
              },
            });
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to load Veda details";
          showToast(msg || "Failed to load Veda details", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchVeda();
    }
  }, [id, isEditing, showToast]);

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
    }));
  };

  const handleEnNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

    setFormData((prev) => ({
      ...prev,
      enName: val,
      id: isEditing ? prev.id : prev.id || slug,
      slug: isEditing ? prev.slug : prev.slug || slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (!formData.name?.trim() || !formData.enName?.trim()) {
        throw new Error("Both Hindi/Sanskrit and English names are required.");
      }

      const slug =
        formData.slug?.trim() ||
        formData.id?.trim() ||
        formData.enName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const vedaId = formData.id?.trim() || slug;

      const payload: Partial<Veda> = {
        ...formData,
        id: vedaId,
        slug,
        desc: formData.intro || formData.desc,
        quickInfo: {
          ...formData.quickInfo,
          chiefPriest: formData.priest || formData.quickInfo?.chiefPriest || "",
        },
      };

      if (isEditing && id) {
        await VedaAdminService.updateVeda(id, payload);
        showToast("Updated successfully", "success");
      } else {
        await VedaAdminService.createVeda(payload);
        showToast("New scripture added successfully", "success");
      }

      const categoryPath = (payload.category || queryCategory || "").toLowerCase();
      if (categoryPath === "purana") navigate("/admin/library/puranas");
      else if (categoryPath === "itihasa") navigate("/admin/library/itihasas");
      else if (categoryPath === "upanishad") navigate("/admin/library/upanishads");
      else if (categoryPath === "darshana") navigate("/admin/library/darshanas");
      else navigate("/admin/library/vedas");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      showToast(msg || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const resolvedCategory = (formData.category || queryCategory || "").toLowerCase();
  const backRoute =
    resolvedCategory === "purana"
      ? "/admin/library/puranas"
      : resolvedCategory === "itihasa"
      ? "/admin/library/itihasas"
      : resolvedCategory === "upanishad"
      ? "/admin/library/upanishads"
      : resolvedCategory === "darshana"
      ? "/admin/library/darshanas"
      : "/admin/library/vedas";

  const categoryLabel =
    resolvedCategory === "purana"
      ? "Purana"
      : resolvedCategory === "itihasa"
      ? "Itihasa Text"
      : resolvedCategory === "upanishad"
      ? "Upanishad"
      : resolvedCategory === "darshana"
      ? "Darshana"
      : "Veda";

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-charcoal-500 font-medium">Loading scripture data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Header with Back button */}
      <PageHeader
        title={
          isEditing
            ? `Edit ${categoryLabel}: ${formData.enName || formData.name}`
            : `Add New ${categoryLabel}`
        }
        subtitle="Classical Samhita, Author/Ritvik, introduction, overview, and visual layout"
        actions={
          <Link
            to={backRoute}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-cream-300 text-charcoal-700 text-xs font-bold hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to List</span>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: General Information */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-saffron-600" />
              <span>1. General Identification</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              * Required fields
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Hindi / Sanskrit Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Rigveda Samhita (or Devanagari title)"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 focus:outline-none font-devanagari transition-all font-semibold"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                Primary Hindi or Sanskrit title of the scripture
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                English Name *
              </label>
              <input
                type="text"
                required
                value={formData.enName || ""}
                onChange={(e) => handleEnNameChange(e.target.value)}
                placeholder="e.g. Rigveda, Yajurveda, Samaveda, Atharvaveda"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 focus:outline-none transition-all font-semibold"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                International English title (e.g. Rigveda)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                ID / Slug Identifier *
              </label>
              <input
                type="text"
                required
                disabled={isEditing}
                value={formData.id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  })
                }
                placeholder="e.g. rigveda, yajurveda"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono disabled:bg-cream-50 disabled:text-charcoal-400 transition-all"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                Unique identifier (read-only when editing)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Eyebrow Tagline
              </label>
              <input
                type="text"
                value={formData.eyebrow || ""}
                onChange={(e) =>
                  setFormData({ ...formData, eyebrow: e.target.value })
                }
                placeholder="e.g. Ancient Shruti Wisdom • Samhita"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none transition-all"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                Short label displayed above the main heading
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category || queryCategory || "veda"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 bg-white font-semibold focus:border-saffron-500 focus:outline-none"
              >
                <option value="veda">Vedas</option>
                <option value="purana">Puranas</option>
                <option value="itihasa">Itihasa</option>
                <option value="upanishad">Upanishads</option>
                <option value="darshana">Darshanas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Order Index
              </label>
              <input
                type="number"
                value={formData.orderIndex ?? 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    orderIndex: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "ACTIVE" | "INACTIVE" | "DRAFT",
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 bg-white font-semibold focus:border-saffron-500 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE - Published</option>
                <option value="DRAFT">DRAFT - Unpublished</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              Intro / Subtitle
            </label>
            <textarea
              rows={2}
              value={formData.intro || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  intro: e.target.value,
                  desc: e.target.value,
                })
              }
              placeholder="Ancient Vedic collection of hymns and suktas — foundational source of devotion, wisdom, and spiritual consciousness..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 2: Classification & Priest Tradition */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <span>2. Classification &amp; Priest Tradition</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              Classical Vedic standards
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Chief Priest (Ritvik)
              </label>
              <input
                type="text"
                value={formData.priest || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priest: e.target.value,
                    quickInfo: {
                      ...formData.quickInfo,
                      chiefPriest: e.target.value,
                    },
                  })
                }
                placeholder="e.g. Hotri, Adhvaryu, Udgatri, Brahma"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-semibold"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                Primary officiating priest associated with this tradition
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Badge Tag
              </label>
              <input
                type="text"
                value={formData.badge || ""}
                onChange={(e) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                placeholder="e.g. Principal Shruti, Karma & Jnana, Music & Worship"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                Badge shown on cards and page headers
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Mandal / Kanda Count
              </label>
              <input
                type="text"
                value={formData.quickInfo?.mandalCount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickInfo: {
                      ...formData.quickInfo,
                      mandalCount: e.target.value,
                    },
                  })
                }
                placeholder="e.g. 10 Mandalas or 40 Chapters or 20 Kandas"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Sukta Count
              </label>
              <input
                type="text"
                value={formData.quickInfo?.suktaCount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quickInfo: {
                      ...formData.quickInfo,
                      suktaCount: e.target.value,
                    },
                  })
                }
                placeholder="e.g. 1,028 Suktas or 1,975 Mantras"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              Chief Seers / Rishis
            </label>
            <input
              type="text"
              value={formData.quickInfo?.chiefRishis || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quickInfo: {
                    ...formData.quickInfo,
                    chiefRishis: e.target.value,
                  },
                })
              }
              placeholder="e.g. Madhucchanda, Vishwamitra, Vamadeva, Atri, Bharadvaja, Vasishtha"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
            />
            <span className="text-[10px] text-charcoal-400 mt-1 block">
              Principal Vedic seer lineage associated with this text
            </span>
          </div>
        </div>

        {/* SECTION 3: Classical Overview & Stats */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-emerald-600" />
              <span>3. Classical Overview &amp; Stats</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              Deep scriptural context
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              Stats Summary Line
            </label>
            <input
              type="text"
              value={formData.stats || ""}
              onChange={(e) =>
                setFormData({ ...formData, stats: e.target.value })
              }
              placeholder="e.g. 10 Mandalas • 1,028 Suktas • 10,552 Mantras"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-semibold"
            />
            <span className="text-[10px] text-charcoal-400 mt-1 block">
              Brief summary shown inside the card metrics box
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              Overview Text
            </label>
            <textarea
              rows={4}
              value={formData.overviewText || ""}
              onChange={(e) =>
                setFormData({ ...formData, overviewText: e.target.value })
              }
              placeholder="Comprehensive introduction to the scripture, Rishi lineage, presiding deities, ritual role, and philosophical significance..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 4: Visual Media & Live Card Preview */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <span>4. Visual Previews &amp; Media</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              Live card preview
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Card Image Key
              </label>
              <input
                type="text"
                value={formData.imageKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageKey: e.target.value })
                }
                placeholder="e.g. card-rigveda.jpg or URL"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                Banner Image Key / URL
              </label>
              <input
                type="text"
                value={formData.bannerImage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bannerImage: e.target.value })
                }
                placeholder="e.g. banner-rigveda.jpg or URL"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Interactive Live Card Preview */}
          <div className="mt-4 pt-4 border-t border-cream-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-charcoal-600">
              <Eye className="w-4 h-4 text-saffron-600" />
              <span>Live Card Preview:</span>
            </div>

            <div className="max-w-md mx-auto sm:mx-0 bg-white rounded-3xl border border-cream-200/90 shadow-soft overflow-hidden">
              <div className="h-2.5 bg-gradient-to-r from-amber-600 via-saffron-600 to-orange-700" />
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {formData.badge || "Shruti"}
                    </span>
                    {formData.priest && (
                      <span className="text-[11px] font-semibold text-charcoal-600">
                        Ritvik: {formData.priest}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                    {formData.status || "ACTIVE"}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900">
                    {formData.name || "Scripture Name"}
                  </h3>
                  <p className="text-xs font-semibold text-saffron-700">
                    {formData.enName || "English Name"}
                  </p>
                </div>

                <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                  {formData.intro ||
                    "Eternal collection of Vedic hymns and suktas — foundational source of wisdom, devotion, and spiritual awakening."}
                </p>

                <div className="p-2.5 rounded-xl bg-cream-50 text-xs flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-charcoal-700">
                    {formData.stats || "10 Mandalas • 1,028 Suktas • 10,552 Mantras"}
                  </span>
                  <span className="text-[10px] text-charcoal-400 font-bold uppercase">
                    Structure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Sticky Save Footer */}
        <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-cream-300 shadow-elevated">
          <div className="flex items-center gap-2 text-xs text-charcoal-600">
            <Sparkles className="w-4 h-4 text-saffron-600" />
            <span className="hidden sm:inline">
              {isEditing
                ? `Ready to save changes (${formData.enName || formData.name})`
                : `Ready to register new ${categoryLabel}`}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to={backRoute}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-500 hover:to-amber-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : isEditing ? `Save Changes (${categoryLabel})` : `Add ${categoryLabel}`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VedaFormPage;
