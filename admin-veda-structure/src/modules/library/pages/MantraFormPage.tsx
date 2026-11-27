import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Scroll,
  Languages,
  BookOpen,
  Volume2,
  Flame,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import type { VedaMantra } from "../types/veda.types";
import VedaMantraAdminService from "../services/vedaMantra.service";
import PadapathaEditor from "../components/PadapathaEditor";

export const MantraFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);
  const initialVedaId = searchParams.get("vedaId") || "rigveda";
  const initialVedaDetails = {
    rigveda: { name: "Rigveda", shakha: "Shakala Shakha", textName: "Rigveda Samhita" },
    yajurveda: { name: "Yajurveda", shakha: "Madhyandina Vajasaneyi Shakha", textName: "Vajasaneyi Samhita (Shukla Yajurveda)" },
    samaveda: { name: "Samaveda", shakha: "Kauthuma Shakha", textName: "Kauthuma Samaveda Samhita" },
    atharvaveda: { name: "Atharvaveda", shakha: "Shaunaka Shakha", textName: "Shaunaka Atharvaveda Samhita" },
  }[initialVedaId] || { name: initialVedaId, shakha: "", textName: "" };

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "translations" | "padapatha" | "shastric">("content");

  const [formData, setFormData] = useState<Partial<VedaMantra>>({
    id: "",
    slug: "",
    vedaId: initialVedaId,
    nodeId: searchParams.get("nodeId") || "",
    vedaName: initialVedaDetails.name,
    shakha: initialVedaDetails.shakha,
    textName: initialVedaDetails.textName,
    sectionRef: searchParams.get("sectionRef") || "",
    mantraNumber: "",
    rishi: "",
    devata: "",
    chhanda: "Gayatri",
    svara: "Svara Vedic Chanting (Udatta, Anudatta, Svarita)",
    sanskrit: "",
    hindiTranslation: "",
    englishTranslation: "",
    hinglishTranslation: "",
    padapatha: [],
    shastricContext: "",
    audioUrl: "",
    previousId: "",
    nextId: "",
    chapterMantraIds: [],
    orderIndex: 0,
    status: "ACTIVE",
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchMantra = async () => {
        try {
          setLoading(true);
          const data = await VedaMantraAdminService.getMantraById(id);
          if (data) {
            setFormData({
              ...data,
              padapatha: data.padapatha || [],
            });
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Failed to load mantra";
          showToast(msg || "Failed to load mantra", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchMantra();
    }
  }, [id, isEditing, showToast]);

  const handleVedaChange = (vId: string) => {
    let vName = "Rigveda";
    let shakha = "Shakala Shakha";
    let textName = "Rigveda Samhita";

    if (vId === "yajurveda") {
      vName = "Yajurveda";
      shakha = "Madhyandina Vajasaneyi Shakha";
      textName = "Vajasaneyi Samhita (Shukla Yajurveda)";
    } else if (vId === "samaveda") {
      vName = "Samaveda";
      shakha = "Kauthuma Shakha";
      textName = "Kauthuma Samaveda Samhita";
    } else if (vId === "atharvaveda") {
      vName = "Atharvaveda";
      shakha = "Shaunaka Shakha";
      textName = "Shaunaka Atharvaveda Samhita";
    }

    setFormData((prev) => ({
      ...prev,
      vedaId: vId,
      nodeId: "",
      sectionRef: "",
      vedaName: vName,
      shakha,
      textName,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      if (!formData.sanskrit?.trim()) {
        setActiveTab("content");
        throw new Error("Sanskrit mantra text is required. (Step 1: Core Mantra)");
      }
      if (!formData.hindiTranslation?.trim()) {
        setActiveTab("translations");
        throw new Error("Authentic Hindi translation is required. (Step 2: Translations)");
      }

      const generatedId =
        formData.id?.trim() ||
        `${formData.vedaId || "mantra"}-${(formData.mantraNumber || "1").replace(/[^a-zA-Z0-9_-]/g, "-")}-${Date.now()}`;

      const payload = {
        ...formData,
        id: generatedId,
        slug: formData.slug || generatedId,
      };

      if (isEditing && id) {
        await VedaMantraAdminService.updateMantra(id, payload);
        showToast("Mantra updated successfully", "success");
      } else {
        await VedaMantraAdminService.createMantra(payload);
        showToast("New mantra added successfully", "success");
      }
      const destinationParams = new URLSearchParams();
      if (formData.vedaId) destinationParams.set("vedaId", formData.vedaId);
      if (formData.nodeId) destinationParams.set("nodeId", formData.nodeId);
      if (formData.sectionRef) destinationParams.set("sectionRef", formData.sectionRef);
      navigate(`/admin/library/mantras?${destinationParams.toString()}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save mantra";
      showToast(msg || "Failed to save mantra", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-charcoal-500">
        Loading mantra details...
      </div>
    );
  }

  const translationsCount = [
    formData.hindiTranslation?.trim(),
    formData.englishTranslation?.trim(),
    formData.hinglishTranslation?.trim(),
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={
          isEditing
            ? `Edit Mantra (${formData.mantraNumber || formData.id})`
            : "Add Vedic Mantra"
        }
        subtitle="Sanskrit text, Padapatha, and Hindi, English & Hinglish meanings"
        actions={
          <Link
            to="/admin/library/mantras"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cream-300 text-charcoal-700 text-xs font-bold hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Mantras</span>
          </Link>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cream-200 pb-2 text-xs font-bold">
        {[
          {
            id: "content",
            label: "1. Core Mantra & Reference",
            icon: Scroll,
            badge: formData.sanskrit?.trim() ? "✓" : undefined,
          },
          {
            id: "translations",
            label: "2. Multilingual Meanings (3 Languages)",
            icon: Languages,
            badge: `${translationsCount}/3 Languages`,
            badgeColor: formData.hindiTranslation?.trim() ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
          },
          {
            id: "padapatha",
            label: "3. Padapatha (Word Meanings)",
            icon: Sparkles,
            badge: formData.padapatha && formData.padapatha.length > 0 ? `${formData.padapatha.length} padas` : undefined,
          },
          {
            id: "shastric",
            label: "4. Shastric Context & Viniyoga",
            icon: Flame,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setActiveTab(tab.id as "content" | "translations" | "padapatha" | "shastric")
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "bg-saffron-600 text-white shadow-2xs"
                  : "bg-white text-charcoal-700 hover:bg-cream-100 border border-cream-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-white/25 text-white"
                      : tab.badgeColor || "bg-cream-200 text-charcoal-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: CORE MANTRA & REFERENCES */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Classification Card */}
            <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
              <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-saffron-600" />
                <span>Vedic Classification &amp; Reference</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Veda *
                  </label>
                  <select
                    value={formData.vedaId}
                    onChange={(e) => handleVedaChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 bg-white focus:border-saffron-500 focus:outline-none"
                  >
                    <option value="rigveda">Rigveda</option>
                    <option value="yajurveda">Yajurveda (Shukla / Krishna)</option>
                    <option value="samaveda">Samaveda</option>
                    <option value="atharvaveda">Atharvaveda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Shakha
                  </label>
                  <input
                    type="text"
                    value={formData.shakha || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, shakha: e.target.value })
                    }
                    placeholder="e.g. Shakala Shakha or Madhyandina Vajasaneyi Shakha"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Text Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.textName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, textName: e.target.value })
                    }
                    placeholder="e.g. Rigveda Samhita (Agni Sukta)"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Section Reference (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.sectionRef || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, sectionRef: e.target.value })
                    }
                    placeholder="Use the selected tree section, or enter a reference"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Mantra Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mantraNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, mantraNumber: e.target.value })
                    }
                    placeholder="Enter the numbering used by this Veda / Shakha"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Mantra ID (Unique ID)
                  </label>
                  <input
                    type="text"
                    value={formData.id || ""}
                    disabled={isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    placeholder="e.g. rv-1-1-1 or vs-16-1"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono disabled:bg-cream-50"
                  />
                </div>
              </div>

              {/* Shastric Meta Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-cream-100">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Sage (Rishi)
                  </label>
                  <input
                    type="text"
                    value={formData.rishi || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, rishi: e.target.value })
                    }
                    placeholder="e.g. Madhucchanda Vaishvamitra"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Deity (Devata)
                  </label>
                  <input
                    type="text"
                    value={formData.devata || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, devata: e.target.value })
                    }
                    placeholder="e.g. Agni"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Meter (Chhanda)
                  </label>
                  <input
                    type="text"
                    value={formData.chhanda || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, chhanda: e.target.value })
                    }
                    placeholder="e.g. Gayatri (24 syllables)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    Svara (Chanting Pitch)
                  </label>
                  <input
                    type="text"
                    value={formData.svara || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, svara: e.target.value })
                    }
                    placeholder="e.g. Svara Vedic Chanting"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sacred Sanskrit Text */}
            <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
              <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-saffron-600" />
                <span>Original Sanskrit Text</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Sanskrit Original Mantra (Svara Devanagari) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.sanskrit || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sanskrit: e.target.value })
                  }
                  placeholder="ॐ अ॒ग्निमी॑ळे पु॒रोहि॑तं य॒ज्ञस्य॑ दे॒वमृ॒त्विज॑म्।&#10;होता॑रं रत्न॒धात॑मम्॥१॥"
                  className="w-full p-4 rounded-xl text-base font-devanagari font-bold border border-cream-300 focus:border-saffron-500 focus:outline-none bg-[#fffaf0] text-[#2e1808] leading-loose shadow-inner"
                />
              </div>
            </div>

            {/* Step Next Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("translations")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>Next: Multilingual Meanings (Hindi, English, Hinglish)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MULTILINGUAL TRANSLATIONS (HINDI / ENGLISH / HINGLISH) */}
        {activeTab === "translations" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Languages className="w-4 h-4 text-saffron-600" />
              <span>3-Language Meanings (Hindi, English &amp; Hinglish)</span>
            </h3>

            {/* Language Status Bar */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium">
                Edit meanings across Hindi (required), English, and Hinglish.
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span
                  className={`px-2 py-0.5 rounded ${
                    formData.hindiTranslation?.trim()
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Hindi: {formData.hindiTranslation?.trim() ? "Filled ✓" : "Required *"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    formData.englishTranslation?.trim()
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  English: {formData.englishTranslation?.trim() ? "Filled ✓" : "Optional"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    formData.hinglishTranslation?.trim()
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  Hinglish: {formData.hinglishTranslation?.trim() ? "Filled ✓" : "Optional"}
                </span>
              </div>
            </div>

            {/* 1. Hindi Meaning */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                  1. Hindi Meaning
                </span>
                <span>Authentic Hindi Translation *</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.hindiTranslation || ""}
                onChange={(e) =>
                  setFormData({ ...formData, hindiTranslation: e.target.value })
                }
                placeholder="मैं यज्ञ के पुरोहित, दिव्य प्रकाशयुक्त, देवों को बुलाने वाले ऋत्विक तथा प्रचुर रत्नों को धारण कराने वाले अग्निदेव की स्तुति करता हूँ।"
                className="w-full p-3 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari leading-relaxed"
              />
            </div>

            {/* 2. English Meaning */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                  2. English Meaning
                </span>
                <span>Authentic English Translation</span>
              </label>
              <textarea
                rows={3}
                value={formData.englishTranslation || ""}
                onChange={(e) =>
                  setFormData({ ...formData, englishTranslation: e.target.value })
                }
                placeholder="I magnify Agni, the divine domestic priest of the sacrifice, the ministrant priest who summons the gods, and the greatest bestower of treasures."
                className="w-full p-3 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-serif leading-relaxed"
              />
            </div>

            {/* 3. Hinglish Meaning */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px]">
                  3. Hinglish
                </span>
                <span>Simple Hinglish Meaning (Romanized Explanation)</span>
              </label>
              <textarea
                rows={3}
                value={formData.hinglishTranslation || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hinglishTranslation: e.target.value,
                  })
                }
                placeholder="Main yagya ke purohit, divya prakaash se yukt, devon ka aahvaan karne waale ritvik aur sarvashreshth ratnon/sukhon ko pradaan karne waale Agni Dev ki stuti karta hoon."
                className="w-full p-3 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-sans leading-relaxed"
              />
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all cursor-pointer"
              >
                <span>← Previous: Core Mantra</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("padapatha")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>Next: Padapatha (Word Meanings)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PADAPATHA (WORD-BY-WORD BREAKDOWN) */}
        {activeTab === "padapatha" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
            <PadapathaEditor
              items={formData.padapatha || []}
              onChange={(padapatha) =>
                setFormData((prev) => ({ ...prev, padapatha }))
              }
            />

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setActiveTab("translations")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all cursor-pointer"
              >
                <span>← Previous: Translations</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shastric")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>Next: Shastric Context &amp; Viniyoga</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SHASTRIC CONTEXT & AUDIO */}
        {activeTab === "shastric" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-saffron-600" />
              <span>Shastric Context, Viniyoga &amp; Audio</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Shastric Context, Commentary &amp; Ritual Viniyoga
              </label>
              <textarea
                rows={4}
                value={formData.shastricContext || ""}
                onChange={(e) =>
                  setFormData({ ...formData, shastricContext: e.target.value })
                }
                placeholder="Opening invocation mantra of the Rigveda, celebrating both physical and spiritual fire (Agni)..."
                className="w-full p-3 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-saffron-600" />
                  <span>Audio Chanting URL</span>
                </label>
                <input
                  type="text"
                  value={formData.audioUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, audioUrl: e.target.value })
                  }
                  placeholder="https://example.com/audio/rv-1-1-1.mp3"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.orderIndex || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderIndex: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-100">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Previous Mantra ID
                </label>
                <input
                  type="text"
                  value={formData.previousId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, previousId: e.target.value })
                  }
                  placeholder="e.g. rv-1-1-1"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Next Mantra ID
                </label>
                <input
                  type="text"
                  value={formData.nextId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, nextId: e.target.value })
                  }
                  placeholder="e.g. rv-1-1-2"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-start pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setActiveTab("padapatha")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all cursor-pointer"
              >
                <span>← Previous: Padapatha</span>
              </button>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-cream-200">
          <div className="text-xs text-charcoal-400">
            * Required fields
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/library/mantras"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Mantra"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MantraFormPage;
