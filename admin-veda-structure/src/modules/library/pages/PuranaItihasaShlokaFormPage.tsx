import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Scroll,
  Languages,
  BookOpen,
  Flame,
  ChevronRight,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import type { PuranaItihasaShloka } from "../types/puranaItihasa.types";
import { PuranaItihasaAdminService } from "../services/puranaItihasa.service";
import PadapathaEditor from "../components/PadapathaEditor";
import {
  GRANTHA_CATALOGUE,
  INITIAL_PURANA_ITIHASA_SHLOKAS,
} from "../constants/puranaShloka.constants";

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

export const PuranaItihasaShlokaFormPage: React.FC = () => {
  const { id, shlokaId } = useParams<{ id?: string; shlokaId?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Determine if editing or creating
  const effectiveShlokaId = shlokaId || (id && id.startsWith("shloka-") ? id : undefined);
  const effectiveGranthaId =
    id && !id.startsWith("shloka-")
      ? id
      : undefined;

  const isEditing = Boolean(effectiveShlokaId);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "translations" | "padapatha" | "shastric">("content");
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");
  const [copied, setCopied] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<Partial<PuranaItihasaShloka>>({
    id: "",
    slug: "",
    vedaId: effectiveGranthaId || "shrimad-bhagavata",
    textId: effectiveGranthaId || "shrimad-bhagavata",
    nodeId: "",
    vedaName: "Shrimad Bhagavata Mahapurana",
    shakha: "Gita Press Gorakhpur • Vyasa Tradition",
    textName: "Skandha 1, Chapter 1",
    sectionRef: "Skandha 1, Chapter 1, Shloka 1",
    mantraNumber: "1.1.1",
    rishi: "Maharshi Vedavyasa",
    devata: "Supreme Lord",
    chhanda: "Anushtup",
    svara: "Vedic Chanting",
    sanskrit: "",
    hindiTranslation: "",
    englishTranslation: "",
    hinglishTranslation: "",
    padapatha: [],
    shastricContext: "",
    purport: "",
    audioUrl: "",
    orderIndex: 1,
    isFeatured: false,
    status: "ACTIVE",
  });

  // Load existing shloka if editing
  useEffect(() => {
    if (isEditing && effectiveShlokaId) {
      const fetchShloka = async () => {
        try {
          setLoading(true);
          let data: PuranaItihasaShloka | null = null;
          try {
            data = await PuranaItihasaAdminService.getShlokaById(effectiveShlokaId);
          } catch {
            // fallback
          }

          if (!data) {
            data =
              INITIAL_PURANA_ITIHASA_SHLOKAS.find(
                (s) => s.id === effectiveShlokaId || s.slug === effectiveShlokaId
              ) || null;
          }

          if (data) {
            setFormData({
              ...data,
              padapatha: data.padapatha || [],
            });
          } else {
            showToast("Shloka not found, please try again", "error");
          }
        } catch (err: unknown) {
          showToast(getErrorMessage(err, "Failed to load shloka"), "error");
        } finally {
          setLoading(false);
        }
      };
      fetchShloka();
    } else if (effectiveGranthaId) {
      // Pre-fill grantha if creating under a specific grantha
      const matched = GRANTHA_CATALOGUE.find((g) => g.id === effectiveGranthaId);
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          vedaId: matched.id,
          textId: matched.id,
          vedaName: matched.enName || matched.name,
          textName: matched.sections[0] || "",
        }));
      }
    }
  }, [effectiveShlokaId, effectiveGranthaId, isEditing, showToast]);

  // Handle Grantha selector change
  const handleGranthaSelect = (gId: string) => {
    const matched = GRANTHA_CATALOGUE.find((g) => g.id === gId);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        vedaId: matched.id,
        textId: matched.id,
        vedaName: matched.enName || matched.name,
        textName: matched.sections[0] || "",
      }));
    }
  };

  // Copy Sanskrit
  const handleCopySanskrit = () => {
    if (formData.sanskrit) {
      navigator.clipboard.writeText(formData.sanskrit);
      setCopied(true);
      showToast("Sanskrit shloka copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent, continueAdding = false) => {
    e.preventDefault();

    const errs: Record<string, string> = {};
    if (!formData.mantraNumber?.trim()) {
      errs.mantraNumber = "Shloka Number (Ref) is required (e.g. 1.1.1 or 2.47)";
    }
    if (!formData.sanskrit?.trim()) {
      errs.sanskrit = "Original Sanskrit shloka is required";
    }
    if (!formData.hindiTranslation?.trim()) {
      errs.hindiTranslation = "Hindi meaning is required, please fill it in";
    }

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      if (errs.mantraNumber || errs.sanskrit) {
        showToast(errs.sanskrit || errs.mantraNumber, "error");
        setActiveTab("content");
      } else if (errs.hindiTranslation) {
        showToast(errs.hindiTranslation, "error");
        setActiveTab("translations");
      }
      return;
    }

    try {
      setSaving(true);
      const textId = formData.vedaId || formData.textId || "shrimad-bhagavata";

      const payload: Partial<PuranaItihasaShloka> = {
        ...formData,
        id:
          formData.id ||
          `shloka-${textId}-${formData.mantraNumber?.replace(/[^a-zA-Z0-9]/g, "-") || Date.now()}`,
        slug:
          formData.slug ||
          `${textId}-${formData.mantraNumber?.replace(/[^a-zA-Z0-9]/g, "-") || Date.now()}`,
        vedaId: textId,
        textId,
        orderIndex: Number(formData.orderIndex) || 1,
      };

      if (isEditing && effectiveShlokaId) {
        await PuranaItihasaAdminService.updateShloka(effectiveShlokaId, payload);
        showToast("Shloka updated successfully!", "success");
      } else {
        await PuranaItihasaAdminService.createShloka(textId, payload);
        showToast("New shloka added successfully!", "success");
      }

      if (continueAdding) {
        // Reset form for next entry with incremented order & number
        const nextOrder = (Number(formData.orderIndex) || 1) + 1;
        setFormData((prev) => ({
          ...prev,
          id: "",
          slug: "",
          sanskrit: "",
          hindiTranslation: "",
          englishTranslation: "",
          hinglishTranslation: "",
          padapatha: [],
          orderIndex: nextOrder,
        }));
        setActiveTab("content");
      } else {
        // Navigate back to shlokas list
        navigate(`/admin/purana-itihasa/${textId}/shlokas`);
      }
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Error saving shloka"), "error");
    } finally {
      setSaving(false);
    }
  };

  // Back link URL
  const backUrl = formData.vedaId
    ? `/admin/purana-itihasa/${formData.vedaId}/shlokas`
    : "/admin/purana-itihasa/shlokas";

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-charcoal-700">
          Loading shloka data...
        </p>
      </div>
    );
  }

  const granthaDisplayName =
    GRANTHA_CATALOGUE.find((g) => g.id === formData.vedaId)?.enName ||
    formData.vedaName;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-medium text-charcoal-500">
        <Link
          to="/admin/dashboard"
          className="hover:text-saffron-700 transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <Link
          to="/admin/purana-itihasa"
          className="hover:text-saffron-700 transition-colors"
        >
          Purana &amp; Itihasa Archive
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <Link
          to={backUrl}
          className="hover:text-saffron-700 transition-colors"
        >
          Shloka Management
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="text-charcoal-900 font-bold">
          {isEditing ? "Edit Shloka" : "Add Shloka"}
        </span>
      </nav>

      {/* 2. FORM HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-amber-500/10 via-saffron-500/10 to-orange-500/5 p-5 md:p-6 rounded-2xl border border-saffron-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron-600 text-white shadow-2xs">
              <Scroll className="w-3.5 h-3.5" />
              <span>{isEditing ? "Edit Shloka" : "New Shloka"}</span>
            </span>
            <span className="text-xs font-bold text-charcoal-600 bg-white/80 px-2 py-0.5 rounded-md border border-cream-200">
              {granthaDisplayName}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-serif font-bold text-charcoal-900">
            {isEditing
              ? `Edit Shloka: ${formData.mantraNumber || formData.sectionRef}`
              : "Add New Shloka / Verse"}
          </h1>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            Save original Sanskrit verse, Padapatha breakdown, 3-language meanings (Hindi, English, Hinglish), and shastric commentary.
          </p>
        </div>

        <Link
          to={backUrl}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shloka List</span>
        </Link>
      </div>

      {/* 3. STEP / TAB NAVIGATION BAR */}
      <div className="flex border-b border-cream-200 bg-white p-1 rounded-2xl shadow-2xs gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "content"
              ? "bg-saffron-50 text-saffron-700 shadow-2xs border border-saffron-200"
              : "text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Grantha Reference &amp; Sanskrit Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("translations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "translations"
              ? "bg-saffron-50 text-saffron-700 shadow-2xs border border-saffron-200"
              : "text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-50"
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>2. 3-Language Meanings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("padapatha")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "padapatha"
              ? "bg-saffron-50 text-saffron-700 shadow-2xs border border-saffron-200"
              : "text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-50"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Padapatha Breakdown</span>
          {formData.padapatha && formData.padapatha.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-saffron-200 text-saffron-900 font-bold">
              {formData.padapatha.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shastric")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "shastric"
              ? "bg-saffron-50 text-saffron-700 shadow-2xs border border-saffron-200"
              : "text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-50"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>4. Shastric Context &amp; Settings</span>
        </button>
      </div>

      {/* 4. FORM FIELDS */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* TAB 1: GRANTHA INFO & SANSKRIT CONTENT */}
        {activeTab === "content" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-saffron-600" />
              <span>Grantha Selection &amp; Shloka Reference</span>
            </h3>

            {/* Grantha & Chapter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Purana / Itihasa Grantha *
                </label>
                <select
                  value={formData.vedaId || ""}
                  onChange={(e) => handleGranthaSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none bg-white font-medium"
                >
                  <optgroup label="18 Mahapuranas">
                    {GRANTHA_CATALOGUE.filter((g) => g.category === "purana").map(
                      (g) => (
                        <option key={g.id} value={g.id}>
                          {g.enName}
                        </option>
                      )
                    )}
                  </optgroup>
                  <optgroup label="Itihasa & Epics">
                    {GRANTHA_CATALOGUE.filter((g) => g.category === "itihasa").map(
                      (g) => (
                        <option key={g.id} value={g.id}>
                          {g.enName}
                        </option>
                      )
                    )}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Section / Parva / Skandha / Chapter
                </label>
                <input
                  type="text"
                  value={formData.textName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, textName: e.target.value })
                  }
                  placeholder="e.g. Skandha 1, Chapter 1 or Bhishma Parva Chapter 25"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Shloka Number / Ref *
                </label>
                <input
                  type="text"
                  value={formData.mantraNumber || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, mantraNumber: e.target.value });
                    if (formErrors.mantraNumber) {
                      setFormErrors((prev) => ({ ...prev, mantraNumber: "" }));
                    }
                  }}
                  placeholder="e.g. 1.1.1 or 2.47"
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-saffron-800 border ${
                    formErrors.mantraNumber ? "border-red-400 focus:ring-red-200" : "border-cream-300 focus:border-saffron-500"
                  } focus:outline-none`}
                />
                {formErrors.mantraNumber && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.mantraNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Detailed Section Reference
                </label>
                <input
                  type="text"
                  value={formData.sectionRef || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sectionRef: e.target.value })
                  }
                  placeholder="e.g. Skandha 1, Chapter 1, Shloka 1"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Edition / Tradition
                </label>
                <input
                  type="text"
                  value={formData.shakha || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, shakha: e.target.value })
                  }
                  placeholder="e.g. Gita Press Gorakhpur Edition • Vyasa Tradition"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
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
                  placeholder="e.g. Anushtup, Shardulavikridita, Malini, Upajati"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Mula Sanskrit Shloka Textarea with Live Preview Controls */}
            <div className="space-y-2 pt-2 border-t border-cream-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-charcoal-700 flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-saffron-600" />
                  <span>Original Sanskrit Shloka (Devanagari) *</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-charcoal-400">Font Size:</span>
                  <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-md">
                    <button
                      type="button"
                      onClick={() => setFontSize("sm")}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        fontSize === "sm" ? "bg-white text-saffron-700 shadow-2xs" : "text-charcoal-500"
                      }`}
                    >
                      Small
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize("md")}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        fontSize === "md" ? "bg-white text-saffron-700 shadow-2xs" : "text-charcoal-500"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize("lg")}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        fontSize === "lg" ? "bg-white text-saffron-700 shadow-2xs" : "text-charcoal-500"
                      }`}
                    >
                      Large
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopySanskrit}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={formData.sanskrit || ""}
                onChange={(e) => {
                  setFormData({ ...formData, sanskrit: e.target.value });
                  if (formErrors.sanskrit) {
                    setFormErrors((prev) => ({ ...prev, sanskrit: "" }));
                  }
                }}
                placeholder="ॐ जन्माद्यस्य यतोऽन्वयादितरतश्चार्थेष्वभिज्ञः स्वराट्...&#10;सत्यं परं धीमहि॥१॥"
                className={`w-full p-4 rounded-xl border ${
                  formErrors.sanskrit ? "border-red-400 focus:ring-red-200" : "border-cream-300 focus:border-saffron-500"
                } focus:outline-none font-serif font-bold text-charcoal-900 leading-relaxed bg-amber-50/25 ${
                  fontSize === "sm"
                    ? "text-xs"
                    : fontSize === "lg"
                    ? "text-base"
                    : "text-sm"
                }`}
              />
              {formErrors.sanskrit && (
                <p className="text-xs text-red-600 mt-1">{formErrors.sanskrit}</p>
              )}
              <p className="text-[11px] text-charcoal-400">
                Enter the original Sanskrit text with Vedic avagraha, danda, and double danda marks.
              </p>
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setActiveTab("translations")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>Next Step: 3-Language Meanings</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 3-LANGUAGE TRANSLATIONS */}
        {activeTab === "translations" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Languages className="w-4 h-4 text-saffron-600" />
              <span>3-Language Meanings &amp; Translations</span>
            </h3>

            {/* 1. Hindi Bhavartha */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-saffron-600" />
                <span>1. Hindi Meaning (Bhavartha) *</span>
                <span className="text-[11px] text-saffron-700 font-normal">
                  (Required)
                </span>
              </label>
              <textarea
                rows={4}
                value={formData.hindiTranslation || ""}
                onChange={(e) => {
                  setFormData({ ...formData, hindiTranslation: e.target.value });
                  if (formErrors.hindiTranslation) {
                    setFormErrors((prev) => ({ ...prev, hindiTranslation: "" }));
                  }
                }}
                placeholder="इस संपूर्ण विश्व की उत्पत्ति, स्थिति और प्रलय जिसके द्वारा होते हैं; जो अन्वय और व्यतिरेक रूप से समस्त पदार्थों को जानने वाला है..."
                className={`w-full p-3.5 rounded-xl text-xs border ${
                  formErrors.hindiTranslation ? "border-red-400 focus:ring-red-200" : "border-cream-300 focus:border-saffron-500"
                } focus:outline-none font-devanagari leading-relaxed`}
              />
              {formErrors.hindiTranslation && (
                <p className="text-xs text-red-600 mt-1">{formErrors.hindiTranslation}</p>
              )}
              <p className="text-[11px] text-charcoal-400">
                Clear and accessible Hindi explanation aligned with authentic traditional commentaries.
              </p>
            </div>

            {/* 2. English Translation */}
            <div className="space-y-1.5 pt-2 border-t border-cream-100">
              <label className="block text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>2. English Translation</span>
                <span className="text-[11px] text-charcoal-400 font-normal">
                  (Optional)
                </span>
              </label>
              <textarea
                rows={4}
                value={formData.englishTranslation || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    englishTranslation: e.target.value,
                  })
                }
                placeholder="From whom arises the origin, sustenance, and dissolution of this universe; who is directly and indirectly cognizant of all manifestations..."
                className="w-full p-3.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none leading-relaxed italic"
              />
            </div>

            {/* 3. Hinglish Explanation */}
            <div className="space-y-1.5 pt-2 border-t border-cream-100">
              <label className="block text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-600" />
                <span>3. Hinglish Explanation</span>
                <span className="text-[11px] text-charcoal-400 font-normal">
                  (Optional)
                </span>
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
                placeholder="Jisse is poore sansaar ki rachna, paalan aur laya hota hai; jo har situation ko poori tarah jaanta hai..."
                className="w-full p-3.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none leading-relaxed"
              />
              <p className="text-[11px] text-charcoal-400">
                Conversational Romanized Hindi explanation for younger and modern readers.
              </p>
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all cursor-pointer"
              >
                <span>← Previous: Original Shloka</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("padapatha")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>Next: Padapatha Breakdown</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PADAPATHA BREAKDOWN */}
        {activeTab === "padapatha" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
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
                <span>← Previous: Meanings</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shastric")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>Next: Shastric Context</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SHASTRIC CONTEXT, RISHI, DEVATA & SETTINGS */}
        {activeTab === "shastric" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-saffron-600" />
              <span>Rishi, Deity, Shastric Context &amp; Settings</span>
            </h3>

            {/* Rishi / Devata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Speaker / Rishi
                </label>
                <input
                  type="text"
                  value={formData.rishi || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, rishi: e.target.value })
                  }
                  placeholder="e.g. Maharshi Vedavyasa, Shukadeva Goswami, Lord Sri Krishna"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Deity / Worshipped Form
                </label>
                <input
                  type="text"
                  value={formData.devata || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, devata: e.target.value })
                  }
                  placeholder="e.g. Lord Narayana, Mahadeva Shiva, Goddess Durga"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Shastric Context */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Shastric Context &amp; Philosophical Significance
              </label>
              <textarea
                rows={3}
                value={formData.shastricContext || ""}
                onChange={(e) =>
                  setFormData({ ...formData, shastricContext: e.target.value })
                }
                placeholder="e.g. Supreme invocation shloka of Shrimad Bhagavatam, directly commenting on the Brahma Sutra 'Janmadyasya Yatah'."
                className="w-full p-3.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Detailed Commentary / Purport */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Detailed Purport / Commentary
              </label>
              <textarea
                rows={4}
                value={formData.purport || ""}
                onChange={(e) =>
                  setFormData({ ...formData, purport: e.target.value })
                }
                placeholder="Traditional commentary and philosophical purport according to acharyas..."
                className="w-full p-3.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* Order, isFeatured & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-cream-100 items-center">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.orderIndex || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orderIndex: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={formData.status || "ACTIVE"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "ACTIVE" | "INACTIVE",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none bg-white font-medium"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.isFeatured)}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-saffron-600 focus:ring-saffron-500 border-cream-300"
                  />
                  <span className="text-xs font-bold text-charcoal-800">
                    Mark as Featured
                  </span>
                </label>
                <p className="text-[11px] text-charcoal-400 mt-0.5">
                  Displayed on homepage and featured narratives.
                </p>
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

        {/* 5. FORM ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-cream-200 bg-white p-4 rounded-2xl shadow-2xs">
          <div className="text-xs text-charcoal-400">
            * Required fields (Original Sanskrit shloka and Hindi meaning are mandatory)
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to={backUrl}
              className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
            >
              Cancel
            </Link>

            {!isEditing && (
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e, true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Save &amp; Add Next</span>
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save & Close"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PuranaItihasaShlokaFormPage;
