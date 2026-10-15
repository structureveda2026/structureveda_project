import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookOpen,
  Sparkles,
  Scroll,
  CheckCircle2,
  Eye,
  Shield,
  HelpCircle,
  RefreshCw,
  Layers,
  Flame,
  Award,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
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
    badge: "सात्त्विक महापुराण",
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
              stats: data.stats || `${data.adhyayaCount || "अध्याय"} • ${data.shlokaCount || "श्लोक"}`,
            });
            setAutoSlug(false);
          }
        } catch (err: any) {
          showError(err.message || "ग्रंथ विवरण लोड करने में असमर्थ");
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
      errs.name = "हिन्दी नाम अनिवार्य है (उदा. ब्रह्म पुराण, विष्णु पुराण)";
    }
    if (!formData.enName?.trim()) {
      errs.enName = "अंग्रेजी नाम अनिवार्य है (उदा. Vishnu Purana)";
    }
    if (!formData.slug?.trim()) {
      errs.slug = "स्लग (URL पहचानकर्ता) अनिवार्य है";
    }
    if (!formData.category) {
      errs.category = "श्रेणी का चयन करें";
    }
    if (!formData.guna) {
      errs.guna = "त्रिगुण वर्गीकरण का चयन करें";
    }
    if (!formData.chiefDeity?.trim()) {
      errs.chiefDeity = "प्रधान देव/देवी का नाम लिखें";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save / Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("कृपया फॉर्म में सभी अनिवार्य क्षेत्रों को सही भरें।");
      return;
    }

    try {
      setSaving(true);

      const finalId = formData.id || formData.slug || Date.now().toString();

      // Resolve badge
      let badge = formData.badge;
      if (!badge) {
        if (formData.guna === "sattvika") badge = "सात्त्विक महापुराण";
        else if (formData.guna === "rajasa") badge = "राजस महापुराण";
        else if (formData.guna === "tamasa") badge = "तामस महापुराण";
        else badge = "सनातन ग्रंथ";
      }

      const payload: Partial<PuranaItihasaGrantha> = {
        ...formData,
        id: finalId,
        badge,
        orderIndex: Number(formData.orderIndex) || 1,
      };

      if (isEditing && id) {
        await PuranaItihasaAdminService.update(id, payload);
        showSuccess(`"${formData.name}" का विवरण सफलतापूर्वक अपडेट किया गया!`);
      } else {
        await PuranaItihasaAdminService.create(payload);
        showSuccess(`नया ग्रंथ "${formData.name}" सफलतापूर्वक जोड़ा गया!`);
      }

      navigate("/admin/purana-itihasa");
    } catch (err: any) {
      showError(err.message || "ग्रंथ सहेजने में त्रुटि उत्पन्न हुई");
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
              पुराण एवं इतिहास सूची (Archive List)
            </Link>
            <span>/</span>
            <span className="text-charcoal-700 font-bold">
              {isEditing ? `संपादन: ${formData.name || id}` : "नया ग्रंथ जोड़ें"}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-charcoal-900 font-serif flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-saffron-500" />
            {isEditing ? `ग्रंथ संपादन: ${formData.name}` : "नया ग्रंथ जोड़ें (Add Grantha)"}
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            महापुराण, रामायण, महाभारत, उपपुराण या दार्शनिक ग्रंथ का पूर्ण विवरण, गुण, देवता व सांख्यिकी दर्ज करें।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/purana-itihasa"
            className="btn-secondary text-xs"
          >
            रद्द करें (Cancel)
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
            <span>{saving ? "सहेजा जा रहा है..." : isEditing ? "परिवर्तन सहेजें (Update)" : "ग्रंथ जोड़ें (Save)"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-charcoal-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-saffron-500 mb-2" />
          <p className="text-sm font-medium">ग्रंथ विवरण लोड हो रहा है...</p>
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
                  <span>१. आधारभूत पहचान (Basic Grantha Identification)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Hindi Name */}
                  <div>
                    <label className="label-field">
                      हिन्दी नाम (Hindi Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder="उदा. ब्रह्म पुराण, विष्णु पुराण"
                      className={`input-field font-devanagari font-semibold text-sm ${
                        errors.name ? "border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  {/* English Name */}
                  <div>
                    <label className="label-field">
                      अंग्रेजी नाम (English Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.enName || ""}
                      onChange={(e) => handleEnNameChange(e.target.value)}
                      placeholder="उदा. Brahma Purana, Vishnu Purana"
                      className={`input-field text-sm ${
                        errors.enName ? "border-red-400 focus:ring-red-200" : ""
                      }`}
                    />
                    {errors.enName && <p className="text-xs text-red-600 mt-1">{errors.enName}</p>}
                  </div>

                  {/* Hinglish Name */}
                  <div>
                    <label className="label-field">
                      हिंग्लिश नाम (Hinglish Name)
                    </label>
                    <input
                      type="text"
                      value={formData.hinglishName || ""}
                      onChange={(e) => setFormData({ ...formData, hinglishName: e.target.value })}
                      placeholder="उदा. Brahma Puran, Vishnu Puran"
                      className="input-field text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slug */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-charcoal-700">
                        स्लग (URL Slug) <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setAutoSlug(!autoSlug)}
                        className="text-[11px] text-saffron-600 hover:underline"
                      >
                        {autoSlug ? "स्वतः निर्माण चालू" : "स्वतः निर्माण बंद"}
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
                    <label className="label-field">आईब्रो शीर्षक (Eyebrow Badge)</label>
                    <input
                      type="text"
                      value={formData.eyebrow || ""}
                      onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                      placeholder="उदा. वैष्णव महापुराण • पराशर मुनि प्रोक्त"
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Classification, Deity & Rishis */}
              <div className="card p-6 space-y-4">
                <h3 className="text-base font-bold text-charcoal-900 border-b border-cream-200 pb-2.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>२. वर्गीकरण, देवता एवं ऋषि (Classification & Tradition)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="label-field">
                      श्रेणी (Category) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category || "purana"}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as GranthaCategory })
                      }
                      className="input-field text-sm"
                    >
                      <option value="purana">१८ महापुराण (Mahapurana)</option>
                      <option value="itihasa">इतिहास एवं महाकाव्य (Itihasa & Epic)</option>
                      <option value="upapurana">१८ उपपुराण (Upapurana)</option>
                      <option value="mahakavya">महाकाव्य (Classical Epic)</option>
                    </select>
                  </div>

                  {/* Guna Classification */}
                  <div>
                    <label className="label-field">
                      त्रिगुण वर्गीकरण (Guna Classification) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.guna || "sattvika"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guna: e.target.value as GunaClassification,
                          badge:
                            e.target.value === "sattvika"
                              ? "सात्त्विक महापुराण"
                              : e.target.value === "rajasa"
                              ? "राजस महापुराण"
                              : e.target.value === "tamasa"
                              ? "तामस महापुराण"
                              : "सनातन ग्रंथ",
                        })
                      }
                      className="input-field text-sm font-semibold"
                    >
                      <option value="sattvika">सात्त्विक (Sattvika - श्रीविष्णु / कृष्ण परम्परा)</option>
                      <option value="rajasa">राजस (Rajasa - ब्रह्मा / सूर्य / प्रकृति परम्परा)</option>
                      <option value="tamasa">तामस (Tamasa - महादेव शिव / अग्नि / शक्ति परम्परा)</option>
                      <option value="nirguna">निर्गुण / अद्वैत (Nirguna / Vedantic)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Chief Deity */}
                  <div>
                    <label className="label-field">
                      प्रधान देवता (Chief Deity) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.chiefDeity || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, chiefDeity: e.target.value });
                        if (errors.chiefDeity) setErrors({ ...errors, chiefDeity: "" });
                      }}
                      placeholder="उदा. भगवान् विष्णु, देवाधिदेव महादेव शिव, श्रीकृष्ण"
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
                    <label className="label-field">प्रमुख ऋषि / वक्ता (Primary Rishis)</label>
                    <input
                      type="text"
                      value={formData.primaryRishis || ""}
                      onChange={(e) => setFormData({ ...formData, primaryRishis: e.target.value })}
                      placeholder="उदा. महर्षि पराशर एवं मैत्रेय मुनि, शुकदेव गोस्वामी"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Shloka & Adhyaya Stats */}
              <div className="card p-6 space-y-4">
                <h3 className="text-base font-bold text-charcoal-900 border-b border-cream-200 pb-2.5 flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-amber-600" />
                  <span>३. श्लोक व संरचना सांख्यिकी (Structural Counts & Metrics)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Shlokas Count */}
                  <div>
                    <label className="label-field">श्लोक संख्या (Shlokas)</label>
                    <input
                      type="text"
                      value={formData.shlokaCount || ""}
                      onChange={(e) => setFormData({ ...formData, shlokaCount: e.target.value })}
                      placeholder="उदा. २३,००० या १८,०००"
                      className="input-field font-semibold"
                    />
                  </div>

                  {/* Adhyayas Count */}
                  <div>
                    <label className="label-field">अध्याय / सर्ग संख्या</label>
                    <input
                      type="text"
                      value={formData.adhyayaCount || ""}
                      onChange={(e) => setFormData({ ...formData, adhyayaCount: e.target.value })}
                      placeholder="उदा. १२६ अध्याय या ५०० सर्ग"
                      className="input-field"
                    />
                  </div>

                  {/* Combined Stats Pill */}
                  <div>
                    <label className="label-field">सार सांख्यिकी (Stats Summary)</label>
                    <input
                      type="text"
                      value={formData.stats || ""}
                      onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                      placeholder="उदा. ६ अंश • १२६ अध्याय • ७,००० श्लोक"
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
                    <span>४. परिचय एवं विस्तृत अवलोकन (Intro & Overview)</span>
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
                      संपादक (Edit)
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
                      पूर्वावलोकन (Preview)
                    </button>
                  </div>
                </div>

                {/* Brief Intro */}
                <div>
                  <label className="label-field">संक्षिप्त परिचय (Brief Intro / Tagline)</label>
                  <input
                    type="text"
                    value={formData.intro || ""}
                    onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                    placeholder="सृष्टि उत्पत्ति, स्थिति, प्रलय तथा भगवान श्रीहरि विष्णु के अवतारों की पावन कथा।"
                    className="input-field text-sm"
                  />
                </div>

                {/* Detailed Overview */}
                <div>
                  <label className="label-field">
                    विस्तृत विहंगावलोकन (Detailed Overview / Shastric Significance)
                  </label>

                  {activePreviewTab === "edit" ? (
                    <div>
                      <textarea
                        rows={8}
                        value={formData.overviewText || ""}
                        onChange={(e) => setFormData({ ...formData, overviewText: e.target.value })}
                        placeholder="ग्रंथ का सम्पूर्ण शास्त्रीय इतिहास, प्रमुख आख्यान, वक्ता-श्रोता संवाद, दार्शनिक उपादेयता और सांस्कृतिक महत्त्व यहाँ लिखें..."
                        className="input-field font-sans text-sm leading-relaxed p-3.5"
                      />
                      <p className="text-[11px] text-charcoal-400 mt-1">
                        सुझाव: आप पैराग्राफ, बुलेट पॉइंट्स या मन्त्र सन्दर्भ जोड़ सकते हैं।
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 min-h-[200px] text-sm text-charcoal-800 leading-relaxed font-sans whitespace-pre-line">
                      {formData.overviewText || "कोई विवरण उपलब्ध नहीं है।"}
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
                  प्रकाशन नियंत्रण (Publishing)
                </h3>

                {/* Status */}
                <div>
                  <label className="label-field">प्रकाशन स्थिति (Status)</label>
                  <select
                    value={formData.status || "ACTIVE"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as GranthaStatus })
                    }
                    className="input-field font-semibold text-sm"
                  >
                    <option value="ACTIVE">सक्रिय (Active - दर्शनीय)</option>
                    <option value="DRAFT">प्रारूप (Draft - केवल एडमिन)</option>
                    <option value="INACTIVE">निष्क्रिय (Inactive - अप्रकाशित)</option>
                  </select>
                </div>

                {/* Order Index */}
                <div>
                  <label className="label-field">क्रम संख्या (Order Index)</label>
                  <input
                    type="number"
                    value={formData.orderIndex ?? 1}
                    onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                    className="input-field text-sm"
                  />
                  <p className="text-[11px] text-charcoal-400 mt-1">
                    सूची में प्रदर्शित करने का प्राथमिकता क्रम (१-२५)।
                  </p>
                </div>

                {/* Badge text */}
                <div>
                  <label className="label-field">बैज पाठ (Badge Text)</label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="उदा. सात्त्विक महापुराण"
                    className="input-field text-xs"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="card p-6 space-y-3 bg-gradient-to-b from-white to-cream-50 border-saffron-200">
                <div className="flex items-center justify-between border-b border-cream-200 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-saffron-600" />
                    लाइव कार्ड पूर्वावलोकन
                  </span>
                  <span className="text-[10px] text-charcoal-400 font-mono">Card View</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-cream-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-saffron-50 text-saffron-700 border border-saffron-200">
                      {formData.category === "purana"
                        ? "महापुराण"
                        : formData.category === "itihasa"
                        ? "इतिहास"
                        : formData.category}
                    </span>

                    {formData.guna === "sattvika" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        सात्त्विक
                      </span>
                    )}
                    {formData.guna === "rajasa" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        राजस
                      </span>
                    )}
                    {formData.guna === "tamasa" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        तामस
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-lg text-charcoal-900 font-devanagari">
                      {formData.name || "ग्रंथ का नाम"}
                    </h4>
                    <p className="text-xs text-charcoal-500 font-medium">
                      {formData.enName || "Grantha English Name"}
                    </p>
                  </div>

                  {formData.eyebrow && (
                    <p className="text-xs text-saffron-700 font-semibold line-clamp-1">
                      {formData.eyebrow}
                    </p>
                  )}

                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {formData.intro || "संक्षिप्त परिचय यहाँ प्रदर्शित होगा..."}
                  </p>

                  <div className="pt-2 border-t border-cream-100 flex items-center justify-between text-[11px] text-charcoal-500">
                    <span>{formData.chiefDeity || "प्रधान देव"}</span>
                    <span className="font-bold text-charcoal-800">
                      {formData.shlokaCount || "श्लोक संख्या"}
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
                  <span>{isEditing ? "परिवर्तन सहेजें (Update)" : "ग्रंथ जोड़ें (Save)"}</span>
                </button>

                <Link
                  to="/admin/purana-itihasa"
                  className="btn-secondary w-full text-center text-xs py-2"
                >
                  रद्द करें और वापस सूची पर जाएं
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
