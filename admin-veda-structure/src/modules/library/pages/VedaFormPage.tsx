import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookOpen,
  Sparkles,
  Layers,
  Scroll,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  Eye,
  Shield,
  HelpCircle,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import type { Veda } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";

export const VedaFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Veda>>({
    id: "",
    slug: "",
    name: "",
    enName: "",
    eyebrow: "",
    intro: "",
    overviewText: "",
    desc: "",
    stats: "",
    priest: "",
    badge: "श्रुति",
    imageKey: "",
    bannerImage: "",
    quickInfo: {
      type: "Veda (श्रुति)",
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
                type: data.quickInfo?.type || "Veda (श्रुति)",
                language: data.quickInfo?.language || "Vedic Sanskrit",
                chiefPriest: data.quickInfo?.chiefPriest || data.priest || "",
                mandalCount: data.quickInfo?.mandalCount || "",
                suktaCount: data.quickInfo?.suktaCount || "",
                chiefRishis: data.quickInfo?.chiefRishis || "",
              },
            });
          }
        } catch (err: any) {
          showToast(err.message || "वेद डेटा लोड करने में विफल", "error");
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
        throw new Error("वेद का नाम (हिंदी व अंग्रेजी) अनिवार्य है।");
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
        showToast("वेद सफलतापूर्वक अपडेट किया गया", "success");
      } else {
        await VedaAdminService.createVeda(payload);
        showToast("नया वेद सफलतापूर्वक जोड़ा गया", "success");
      }
      navigate("/admin/library/vedas");
    } catch (err: any) {
      showToast(err.message || "सहेजने में विफल", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-charcoal-500 font-medium">वेद डेटा लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Header with Back button */}
      <PageHeader
        title={isEditing ? `वेद संपादन: ${formData.name}` : "नया वेद जोड़ें (Add New Veda)"}
        subtitle="वैदिक संहिता, मुख्य ऋत्विक, परिचय, शास्त्रीय विवरण एवं दृश्य विन्यास"
        actions={
          <Link
            to="/admin/library/vedas"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-cream-300 text-charcoal-700 text-xs font-bold hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वेद सूची पर वापस जाएं</span>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: मूल सामान्य जानकारी (General Information) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-saffron-600" />
              <span>१. सामान्य जानकारी (General Identification)</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              * चिह्नित क्षेत्र अनिवार्य हैं
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                वेद का नाम (Devanagari / Hindi) *
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100 focus:outline-none font-devanagari transition-all font-semibold"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                देवनागरी लिपि में वेद का मुख्य नाम
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                English Name (Roman Script) *
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
                अंतर्राष्ट्रीय पाठकों व यूआरएल के लिए
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
                विशिष्ट पहचानकर्ता (संपादन के समय अपरिवर्तनीय)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                शीर्ष पंक्ति (Eyebrow Tagline)
              </label>
              <input
                type="text"
                value={formData.eyebrow || ""}
                onChange={(e) =>
                  setFormData({ ...formData, eyebrow: e.target.value })
                }
                placeholder="e.g. प्राचीनतम श्रुति ज्ञान • संहिता"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari transition-all"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                शीर्षक के ऊपर प्रदर्शित होने वाला सूक्ष्म परिचय
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                प्रदर्शन क्रम (Order Index)
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
                प्रकाशन स्थिति (Status)
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
                <option value="ACTIVE">सक्रिय (ACTIVE - प्रकाशित)</option>
                <option value="DRAFT">ड्राफ्ट (DRAFT - अप्रकाशित)</option>
                <option value="INACTIVE">निष्क्रिय (INACTIVE)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              प्रस्तावना / संक्षिप्त परिचय (Intro / Subtitle)
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
              placeholder="ऋचाओं और सूक्तों का प्राचीनतम वैदिक संग्रह। स्तुति, ज्ञान, विज्ञान और आध्यात्मिक चेतना का मूल स्रोत..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 2: वर्गीकरण एवं वैदिक ऋत्विक परंपरा (Classification & Priest Tradition) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <span>२. वर्गीकरण एवं ऋत्विक परंपरा (Classification & Priest Tradition)</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              शास्त्रीय वैदिक मानदंड
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                प्रधान ऋत्विक (Chief Priest)
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
                placeholder="e.g. होतृ (Hotri), अध्वर्यु (Adhvaryu), उद्गातृ (Udgatri), ब्रह्मा (Brahma)"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari font-semibold"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                यज्ञीय कर्मकांड में संबंधित मुख्य ऋत्विक
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                विशिष्ट बैज (Badge Tag)
              </label>
              <input
                type="text"
                value={formData.badge || ""}
                onChange={(e) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                placeholder="e.g. प्रधान श्रुति, कर्मकाण्ड एवं ज्ञान, संगीत एवं उपासना"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
              />
              <span className="text-[10px] text-charcoal-400 mt-1 block">
                कार्ड व हेडर पर प्रदर्शित होने वाला बैज
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                मण्डल / काण्ड संख्या (Mandal / Kanda Count)
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
                placeholder="e.g. १० मण्डल या ४० अध्याय या २० काण्ड"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                सूक्त संख्या (Sukta Count)
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
                placeholder="e.g. १०२८ सूक्त या १९७५ मंत्र"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              प्रमुख द्रष्टा ऋषि (Chief Rishis)
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
              placeholder="e.g. मधुच्छन्दा, विश्वामित्र, वामदेव, अत्रि, भारद्वाज, वसिष्ठ, याज्ञवल्क्य"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
            />
            <span className="text-[10px] text-charcoal-400 mt-1 block">
              इस वेद से सम्बद्ध प्रमुख वैदिक ऋषि परंपरा
            </span>
          </div>
        </div>

        {/* SECTION 3: विस्तृत शास्त्रीय विवरण व सांख्यिकी (Classical Overview & Descriptions) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-emerald-600" />
              <span>३. विस्तृत शास्त्रीय विवरण व सांख्यिकी (Classical Overview & Stats)</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              गहन दार्शनिक संदर्भ
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              सांख्यिकी सारांश (Stats Line)
            </label>
            <input
              type="text"
              value={formData.stats || ""}
              onChange={(e) =>
                setFormData({ ...formData, stats: e.target.value })
              }
              placeholder="e.g. १० मण्डल • १०२८ सूक्त • १०,५५२ मंत्र"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari font-semibold"
            />
            <span className="text-[10px] text-charcoal-400 mt-1 block">
              कार्ड के सांख्यिकी बॉक्स में प्रदर्शित संक्षिप्त सारांश
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
              विस्तृत अवलोकन (Overview Text)
            </label>
            <textarea
              rows={4}
              value={formData.overviewText || ""}
              onChange={(e) =>
                setFormData({ ...formData, overviewText: e.target.value })
              }
              placeholder="वेद के बारे में संपूर्ण परिचय, ऋषि परंपरा, देवगण, याज्ञिक एवं दार्शनिक महत्व..."
              className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 4: दृश्य पूर्वावलोकन व मीडिया (Visual Media & Live Card Preview) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-cream-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-cream-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <span>४. दृश्य पूर्वावलोकन व मीडिया (Visual Previews)</span>
            </h2>
            <span className="text-[11px] text-charcoal-400 font-medium">
              लाइव कार्ड प्रिव्यू
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                कार्ड छवि कुंजी (Card Image Key)
              </label>
              <input
                type="text"
                value={formData.imageKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageKey: e.target.value })
                }
                placeholder="e.g. card-rigveda.jpg या URL"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                बैनर छवि कुंजी / URL (Banner Image)
              </label>
              <input
                type="text"
                value={formData.bannerImage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bannerImage: e.target.value })
                }
                placeholder="e.g. banner-rigveda.jpg या URL"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Interactive Live Card Preview */}
          <div className="mt-4 pt-4 border-t border-cream-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-charcoal-600">
              <Eye className="w-4 h-4 text-saffron-600" />
              <span>कार्ड का सजीव पूर्वावलोकन (Live Card Preview):</span>
            </div>

            <div className="max-w-md mx-auto sm:mx-0 bg-white rounded-3xl border border-cream-200/90 shadow-soft overflow-hidden">
              <div className="h-2.5 bg-gradient-to-r from-amber-600 via-saffron-600 to-orange-700" />
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-devanagari">
                      {formData.badge || "श्रुति"}
                    </span>
                    {formData.priest && (
                      <span className="text-[11px] font-semibold text-charcoal-600">
                        ऋत्विक: {formData.priest}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                    {formData.status || "ACTIVE"}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-900 font-devanagari">
                    {formData.name || "वेद का नाम"}
                  </h3>
                  <p className="text-xs font-semibold text-saffron-700">
                    {formData.enName || "Veda English Name"}
                  </p>
                </div>

                <p className="text-xs text-charcoal-600 font-devanagari line-clamp-2 leading-relaxed">
                  {formData.intro ||
                    "ऋचाओं और सूक्तों का सनातन संग्रह। स्तुति, ज्ञान, विज्ञान और आध्यात्मिक चेतना का मूल स्रोत।"}
                </p>

                <div className="p-2.5 rounded-xl bg-cream-50 text-xs flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-charcoal-700">
                    {formData.stats || "१० मण्डल • १०२८ सूक्त • १०,५५२ मंत्र"}
                  </span>
                  <span className="text-[10px] text-charcoal-400 font-bold uppercase">
                    संरचना
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
                ? `संशोधन सहेजने के लिए तैयार (${formData.name})`
                : "नया वेद पंजीकृत करने के लिए तैयार"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/library/vedas"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
            >
              रद्द करें
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-500 hover:to-amber-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "सहेजा जा रहा है..." : isEditing ? "अपडेट सहेजें (Update Veda)" : "नया वेद जोड़ें (Save Veda)"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VedaFormPage;
