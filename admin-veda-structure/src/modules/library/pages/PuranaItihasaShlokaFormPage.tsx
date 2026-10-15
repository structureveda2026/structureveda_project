import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Sparkles,
  Scroll,
  Languages,
  BookOpen,
  Volume2,
  Info,
  Flame,
  CheckCircle2,
  ChevronRight,
  Eye,
  Copy,
  Check,
  Plus,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import type { PuranaItihasaShloka, PadapathaItem } from "../types/puranaItihasa.types";
import { PuranaItihasaAdminService } from "../services/puranaItihasa.service";
import PadapathaEditor from "../components/PadapathaEditor";
import {
  GRANTHA_CATALOGUE,
  INITIAL_PURANA_ITIHASA_SHLOKAS,
} from "../constants/puranaShloka.constants";

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
    vedaName: "श्रीमद्भागवत महापुराण",
    shakha: "गीताप्रेस गोरखपुर • व्यास परम्परा",
    textName: "प्रथम स्कन्ध, अध्याय १",
    sectionRef: "स्कन्ध १, अध्याय १, श्लोक १",
    mantraNumber: "१.१.१",
    rishi: "महर्षि वेदव्यास",
    devata: "परमेश्वर",
    chhanda: "अनुष्टुप्",
    svara: "वैदिक पाठ",
    sanskrit: "",
    transliteration: "",
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
          } catch (_) {
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
            showToast("श्लोक नहीं मिला, कृपया पुनः प्रयास करें", "error");
          }
        } catch (err: any) {
          showToast(err.message || "श्लोक लोड करने में विफल", "error");
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
          vedaName: matched.name,
          textName: matched.sections[0] || "",
        }));
      }
    }
  }, [effectiveShlokaId, effectiveGranthaId, isEditing]);

  // Handle Grantha selector change
  const handleGranthaSelect = (gId: string) => {
    const matched = GRANTHA_CATALOGUE.find((g) => g.id === gId);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        vedaId: matched.id,
        textId: matched.id,
        vedaName: matched.name,
        textName: matched.sections[0] || "",
      }));
    }
  };

  // Copy Sanskrit
  const handleCopySanskrit = () => {
    if (formData.sanskrit) {
      navigator.clipboard.writeText(formData.sanskrit);
      setCopied(true);
      showToast("संस्कृत श्लोक कॉपी किया गया", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent, continueAdding = false) => {
    e.preventDefault();

    const errs: Record<string, string> = {};
    if (!formData.mantraNumber?.trim()) {
      errs.mantraNumber = "श्लोक संख्या (Ref) अनिवार्य है (e.g. १.१.१ अथवा २.४७)";
    }
    if (!formData.sanskrit?.trim()) {
      errs.sanskrit = "मूल संस्कृत श्लोक अनिवार्य है";
    }
    if (!formData.hindiTranslation?.trim()) {
      errs.hindiTranslation = "हिन्दी भावार्थ अनिवार्य है, कृपया इसे भरें";
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
        showToast("श्लोक सफलतापूर्वक अद्यतन (Updated) किया गया!", "success");
      } else {
        await PuranaItihasaAdminService.createShloka(textId, payload);
        showToast("नया श्लोक सफलतापूर्वक जोड़ा गया!", "success");
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
    } catch (err: any) {
      showToast(err.message || "श्लोक सहेजने में त्रुटि हुई", "error");
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
          श्लोक डेटा लोड हो रहा है...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-medium text-charcoal-500">
        <Link
          to="/admin/dashboard"
          className="hover:text-saffron-700 transition-colors"
        >
          डैशबोर्ड
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <Link
          to="/admin/purana-itihasa"
          className="hover:text-saffron-700 transition-colors"
        >
          पुराण एवं इतिहास आर्काइव
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <Link
          to={backUrl}
          className="hover:text-saffron-700 transition-colors"
        >
          श्लोक प्रबन्धन
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="text-charcoal-900 font-bold">
          {isEditing ? "श्लोक सम्पादन" : "नया श्लोक जोड़ें"}
        </span>
      </nav>

      {/* 2. FORM HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-amber-500/10 via-saffron-500/10 to-orange-500/5 p-5 md:p-6 rounded-2xl border border-saffron-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-saffron-600 text-white shadow-2xs">
              <Scroll className="w-3.5 h-3.5" />
              <span>{isEditing ? "श्लोक सम्पादन" : "नूतन श्लोक रचना"}</span>
            </span>
            <span className="text-xs font-bold text-charcoal-600 bg-white/80 px-2 py-0.5 rounded-md border border-cream-200">
              {formData.vedaName}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-serif font-bold text-charcoal-900">
            {isEditing
              ? `श्लोक सम्पादन: ${formData.mantraNumber || formData.sectionRef}`
              : "नया श्लोक जोड़ें (Add New Shloka / Verse)"}
          </h1>

          <p className="text-xs text-charcoal-600 leading-relaxed">
            वैदिक देवनागरी लिपि में मूल श्लोक, पदच्छेद (Padapatha), त्रिभाषी भावार्थ (हिन्दी, English, हिंग्लिश) एवं शास्त्रीय व्याख्या सहेजें।
          </p>
        </div>

        <Link
          to={backUrl}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>श्लोक सूची पर लौटें</span>
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
          <span>१. ग्रंथ संदर्भ एवं मूल श्लोक</span>
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
          <span>२. त्रिभाषी भावार्थ (३ भाषाएं)</span>
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
          <span>३. पदच्छेद एवं पदार्थ (Padapatha)</span>
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
          <span>४. शास्त्रीय संदर्भ एवं विन्यास</span>
        </button>
      </div>

      {/* 4. FORM FIELDS */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* TAB 1: GRANTHA INFO & SANSKRIT CONTENT */}
        {activeTab === "content" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-saffron-600" />
              <span>ग्रंथ चयन एवं श्लोक संदर्भ विवरण</span>
            </h3>

            {/* Grantha & Chapter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  पुराण / इतिहास ग्रंथ *
                </label>
                <select
                  value={formData.vedaId || ""}
                  onChange={(e) => handleGranthaSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none bg-white font-medium"
                >
                  <optgroup label="अष्टादश महापुराण">
                    {GRANTHA_CATALOGUE.filter((g) => g.category === "purana").map(
                      (g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      )
                    )}
                  </optgroup>
                  <optgroup label="इतिहास एवं महाकाव्य">
                    {GRANTHA_CATALOGUE.filter((g) => g.category === "itihasa").map(
                      (g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      )
                    )}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  खण्ड / पर्व / स्कन्ध / अध्याय
                </label>
                <input
                  type="text"
                  value={formData.textName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, textName: e.target.value })
                  }
                  placeholder="e.g. प्रथम स्कन्ध, अध्याय १ या भीष्मपर्व अध्याय २५"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  श्लोक संख्या (Shloka Number / Ref) *
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
                  placeholder="e.g. १.१.१ अथवा २.४७"
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
                  विस्तृत संदर्भ (Section Reference)
                </label>
                <input
                  type="text"
                  value={formData.sectionRef || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sectionRef: e.target.value })
                  }
                  placeholder="e.g. स्कन्ध १, अध्याय १, श्लोक १"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  संस्करण / परम्परा विवरण
                </label>
                <input
                  type="text"
                  value={formData.shakha || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, shakha: e.target.value })
                  }
                  placeholder="e.g. गीताप्रेस गोरखपुर संस्करण • व्यास परम्परा"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  छन्द (Metre)
                </label>
                <input
                  type="text"
                  value={formData.chhanda || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, chhanda: e.target.value })
                  }
                  placeholder="e.g. अनुष्टुप्, शार्दूलविक्रीड़ित, मालिनी, उपजाति"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Mula Sanskrit Shloka Textarea with Live Preview Controls */}
            <div className="space-y-2 pt-2 border-t border-cream-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-charcoal-700 flex items-center gap-1.5">
                  <Scroll className="w-4 h-4 text-saffron-600" />
                  <span>मूल संस्कृत श्लोक (Devanagari Sanskrit Text) *</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-charcoal-400">फ़ॉन्ट आकार:</span>
                  <div className="flex items-center gap-1 bg-cream-100 p-0.5 rounded-md">
                    <button
                      type="button"
                      onClick={() => setFontSize("sm")}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        fontSize === "sm" ? "bg-white text-saffron-700 shadow-2xs" : "text-charcoal-500"
                      }`}
                    >
                      छोटा
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize("md")}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        fontSize === "md" ? "bg-white text-saffron-700 shadow-2xs" : "text-charcoal-500"
                      }`}
                    >
                      मध्यम
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize("lg")}
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        fontSize === "lg" ? "bg-white text-saffron-700 shadow-2xs" : "text-charcoal-500"
                      }`}
                    >
                      बड़ा
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
                    <span>कॉपी</span>
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
                वैदिक अवग्रह (ऽ), विराम (।) एवं पूर्णविराम (॥) सहित शुद्ध देवनागरी में लिखें।
              </p>
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setActiveTab("translations")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>अगला चरण: बहुभाषी भावार्थ</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 3-LANGUAGE TRANSLATIONS */}
        {activeTab === "translations" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Languages className="w-4 h-4 text-saffron-600" />
              <span>त्रिभाषी भावार्थ एवं अनुवाद (3-Language Translations)</span>
            </h3>

            {/* 1. Hindi Bhavartha */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-saffron-600" />
                <span>१. हिन्दी भावार्थ (Hindi Bhavartha) *</span>
                <span className="text-[11px] text-saffron-700 font-normal">
                  (अनिवार्य)
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
                गीताप्रेस गोरखपुर अथवा प्रामाणिक आचार्यों के भाष्य के अनुसार सरल एवं सुबोध हिन्दी व्याख्या।
              </p>
            </div>

            {/* 2. English Translation */}
            <div className="space-y-1.5 pt-2 border-t border-cream-100">
              <label className="block text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>२. English Translation</span>
                <span className="text-[11px] text-charcoal-400 font-normal">
                  (वैकल्पिक / Optional)
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
                <span>३. हिंग्लिश व्याख्या (Hinglish Explanation)</span>
                <span className="text-[11px] text-charcoal-400 font-normal">
                  (वैकल्पिक / Optional)
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
                युवा पीढ़ी एवं आधुनिक पाठकों हेतु बोलचाल की भाषा में व्याख्या।
              </p>
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-cream-100">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-charcoal-700 text-xs font-bold transition-all cursor-pointer"
              >
                <span>⬅ पिछला चरण: मूल श्लोक</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("padapatha")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>अगला चरण: पदच्छेद व पदार्थ</span>
                <span>➔</span>
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
                <span>⬅ पिछला चरण: भावार्थ</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shastric")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>अगला चरण: शास्त्रीय संदर्भ</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SHASTRIC CONTEXT, RISHI, DEVATA & SETTINGS */}
        {activeTab === "shastric" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-saffron-600" />
              <span>ऋषि, देवता, शास्त्रीय संदर्भ एवं विन्यास</span>
            </h3>

            {/* Rishi / Devata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  वक्ता / ऋषि (Speaker / Rishi)
                </label>
                <input
                  type="text"
                  value={formData.rishi || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, rishi: e.target.value })
                  }
                  placeholder="e.g. महर्षि वेदव्यास, श्रीशुकदेव, भगवान् श्रीकृष्ण"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  देवता / मुख्य आराध्य (Chief Deity)
                </label>
                <input
                  type="text"
                  value={formData.devata || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, devata: e.target.value })
                  }
                  placeholder="e.g. भगवान् नारायण, महादेव शिव, भगवती दुर्गा"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Shastric Context */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                शास्त्रीय संदर्भ एवं दार्शनिक महत्त्व (Shastric Context)
              </label>
              <textarea
                rows={3}
                value={formData.shastricContext || ""}
                onChange={(e) =>
                  setFormData({ ...formData, shastricContext: e.target.value })
                }
                placeholder="श्रीमद्भागवत का सर्वोच्च मंगलाचरण श्लोक (गायत्री-मंत्र-गर्भित)। ब्रह्मसूत्र के 'जन्माद्यस्य यतः' सूत्र का साक्षात भाष्य।"
                className="w-full p-3.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari leading-relaxed"
              />
            </div>

            {/* Detailed Commentary / Purport */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                विस्तृत तात्पर्य / भाष्य (Detailed Purport / Commentary)
              </label>
              <textarea
                rows={4}
                value={formData.purport || ""}
                onChange={(e) =>
                  setFormData({ ...formData, purport: e.target.value })
                }
                placeholder="आचार्य श्रीधर स्वामी एवं जीव गोस्वामी के अनुसार इस श्लोक का तात्पर्य..."
                className="w-full p-3.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari leading-relaxed"
              />
            </div>

            {/* Order, isFeatured & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-cream-100 items-center">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  क्रम संख्या (Order Index)
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
                  प्रकाशन स्थिति (Status)
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
                  <option value="ACTIVE">सक्रिय (Active)</option>
                  <option value="INACTIVE">निष्क्रिय (Inactive)</option>
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
                    विशेष श्लोक (Mark as Featured)
                  </span>
                </label>
                <p className="text-[11px] text-charcoal-400 mt-0.5">
                  मुखपृष्ठ एवं प्रमुख आख्यानों में प्रदर्शित होगा।
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
                <span>⬅ पिछला चरण: पदच्छेद</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. FORM ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-cream-200 bg-white p-4 rounded-2xl shadow-2xs">
          <div className="text-xs text-charcoal-400">
            * आवश्यक फ़ील्ड्स (संस्कृत श्लोक एवं हिन्दी भावार्थ अनिवार्य हैं)
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to={backUrl}
              className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
            >
              रद्द करें
            </Link>

            {!isEditing && (
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e, true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>सहेजें एवं अगला जोड़ें (Save & Add Next)</span>
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "सहेजा जा रहा है..." : "सहेजें एवं बंद करें (Save & Close)"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PuranaItihasaShlokaFormPage;
