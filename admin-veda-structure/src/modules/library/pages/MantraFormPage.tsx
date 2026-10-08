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
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useToast } from "@/context/ToastContext";
import type { VedaMantra, PadapathaItem } from "../types/veda.types";
import VedaMantraAdminService from "../services/vedaMantra.service";
import PadapathaEditor from "../components/PadapathaEditor";

export const MantraFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "translations" | "padapatha" | "shastric">("content");

  const [formData, setFormData] = useState<Partial<VedaMantra>>({
    id: "",
    slug: "",
    vedaId: "rigveda",
    nodeId: "",
    vedaName: "ऋग्वेद (Rigveda)",
    shakha: "शाकल शाखा",
    textName: "ऋग्वेद संहिता",
    sectionRef: "मण्डल १, सूक्त १",
    mantraNumber: "१.१.१",
    rishi: "",
    devata: "",
    chhanda: "गायत्री",
    svara: "सस्वर वैदिक पाठ (उदात्त, अनुदात्त, स्वरित)",
    sanskrit: "",
    transliteration: "",
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
        } catch (err: any) {
          showToast(err.message || "मंत्र लोड करने में विफल", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchMantra();
    }
  }, [id, isEditing]);

  const handleVedaChange = (vId: string) => {
    let vName = "ऋग्वेद (Rigveda)";
    let shakha = "शाकल शाखा";
    let textName = "ऋग्वेद संहिता";

    if (vId === "yajurveda") {
      vName = "यजुर्वेद (Yajurveda)";
      shakha = "माध्यन्दिना वाजसनेयि शाखा";
      textName = "वाजसनेयि संहिता (शुक्ल यजुर्वेद)";
    } else if (vId === "samaveda") {
      vName = "सामवेद (Samaveda)";
      shakha = "कौथुम शाखा";
      textName = "कौथुम सामवेद संहिता";
    } else if (vId === "atharvaveda") {
      vName = "अथर्ववेद (Atharvaveda)";
      shakha = "शौनक शाखा";
      textName = "शौनक अथर्ववेद संहिता";
    }

    setFormData((prev) => ({
      ...prev,
      vedaId: vId,
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
        throw new Error("संस्कृत मूल मंत्र अनिवार्य है। (चरण 1: मूल मंत्र)");
      }
      if (!formData.hindiTranslation?.trim()) {
        setActiveTab("translations");
        throw new Error("प्रामाणिक हिंदी भावार्थ अनिवार्य है। (चरण 2: बहुभाषी भावार्थ)");
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
        showToast("मंत्र सफलतापूर्वक अपडेट किया गया", "success");
      } else {
        await VedaMantraAdminService.createMantra(payload);
        showToast("नया मंत्र सफलतापूर्वक जोड़ा गया", "success");
      }
      navigate(`/admin/library/mantras`);
    } catch (err: any) {
      showToast(err.message || "सहेजने में विफल", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-charcoal-500">
        मंत्र डेटा लोड हो रहा है...
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
            ? `मंत्र संपादित करें (${formData.mantraNumber || formData.id})`
            : "नया वेदमंत्र जोड़ें (Add Vedic Mantra)"
        }
        subtitle="संस्कृत मूल मंत्र, पदच्छेद (Padapatha), हिंदी, अंग्रेजी एवं हिंग्लिश भावार्थ"
        actions={
          <Link
            to="/admin/library/mantras"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cream-300 text-charcoal-700 text-xs font-bold hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>मंत्र सूची पर लौटें</span>
          </Link>
        }
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cream-200 pb-2 text-xs font-bold">
        {[
          {
            id: "content",
            label: "1. मूल मंत्र एवं संदर्भ",
            icon: Scroll,
            badge: formData.sanskrit?.trim() ? "✓" : undefined,
          },
          {
            id: "translations",
            label: "2. बहुभाषी भावार्थ (3 Languages)",
            icon: Languages,
            badge: `${translationsCount}/3 भाषाएँ`,
            badgeColor: formData.hindiTranslation?.trim() ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
          },
          {
            id: "padapatha",
            label: "3. पदच्छेद व पदार्थ (Word Meanings)",
            icon: Sparkles,
            badge: formData.padapatha && formData.padapatha.length > 0 ? `${formData.padapatha.length} पद` : undefined,
          },
          {
            id: "shastric",
            label: "4. शास्त्रीय व्याख्या व विनियोग",
            icon: Flame,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
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
                <span>वैदिक वर्गीकरण एवं संदर्भ (Classification)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    वेद का चयन (Veda) *
                  </label>
                  <select
                    value={formData.vedaId}
                    onChange={(e) => handleVedaChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 bg-white focus:border-saffron-500 focus:outline-none"
                  >
                    <option value="rigveda">ऋग्वेद (Rigveda)</option>
                    <option value="yajurveda">यजुर्वेद (Yajurveda - शुक्ल/कृष्ण)</option>
                    <option value="samaveda">सामवेद (Samaveda)</option>
                    <option value="atharvaveda">अथर्ववेद (Atharvaveda)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    शाखा (Shakha)
                  </label>
                  <input
                    type="text"
                    value={formData.shakha || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, shakha: e.target.value })
                    }
                    placeholder="e.g. शाकल शाखा या माध्यन्दिना वाजसनेयि शाखा"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    ग्रंथ का नाम (Text Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.textName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, textName: e.target.value })
                    }
                    placeholder="e.g. ऋग्वेद संहिता (अग्नि सूक्त)"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    मण्डल / काण्ड / सूक्त संदर्भ (Section Ref) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sectionRef || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, sectionRef: e.target.value })
                    }
                    placeholder="e.g. मण्डल १, सूक्त १ (अग्नि सूक्त) या अध्याय १६"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    मंत्र संख्या (Mantra Number) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mantraNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, mantraNumber: e.target.value })
                    }
                    placeholder="e.g. १.१.१ या १६.१"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    मंत्र ID (Unique ID)
                  </label>
                  <input
                    type="text"
                    value={formData.id || ""}
                    disabled={isEditing}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    placeholder="e.g. rv-1-1-1 या vs-16-1"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono disabled:bg-cream-50"
                  />
                </div>
              </div>

              {/* Shastric Meta Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-cream-100">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    ऋषि (Sage)
                  </label>
                  <input
                    type="text"
                    value={formData.rishi || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, rishi: e.target.value })
                    }
                    placeholder="e.g. मधुच्छन्दा वैश्वामित्र"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    देवता (Deity)
                  </label>
                  <input
                    type="text"
                    value={formData.devata || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, devata: e.target.value })
                    }
                    placeholder="e.g. अग्नि (Agni)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    छंद (Meter)
                  </label>
                  <input
                    type="text"
                    value={formData.chhanda || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, chhanda: e.target.value })
                    }
                    placeholder="e.g. गायत्री (२४ वर्ण)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1">
                    स्वर प्रक्रिया (Svara)
                  </label>
                  <input
                    type="text"
                    value={formData.svara || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, svara: e.target.value })
                    }
                    placeholder="e.g. सस्वर वैदिक पाठ"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>
              </div>
            </div>

            {/* Sacred Sanskrit Text */}
            <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
              <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-saffron-600" />
                <span>मूल संस्कृत एवं रोमन लिप्यंतरण (Sanskrit & IAST)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  संस्कृत मूल मंत्र (सस्वर वैदिक पाठ / Devanagari) *
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

              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1">
                  IAST रोमन लिप्यंतरण (Roman Transliteration)
                </label>
                <textarea
                  rows={2}
                  value={formData.transliteration || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, transliteration: e.target.value })
                  }
                  placeholder="oṃ agnim īḷe purohitaṃ yajñasya devam ṛtvijam |&#10;hotāraṃ ratnadhātamam || 1 ||"
                  className="w-full p-3 rounded-xl text-xs font-serif italic border border-cream-300 focus:border-saffron-500 focus:outline-none bg-[#fffdfa]"
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
                <span>अगला चरण: बहुभाषी भावार्थ (Hindi, English, Hinglish)</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MULTILINGUAL TRANSLATIONS (HINDI / ENGLISH / HINGLISH) */}
        {activeTab === "translations" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-5">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Languages className="w-4 h-4 text-saffron-600" />
              <span>त्रिभाषी भावार्थ (Hindi, English & Hinglish Translations)</span>
            </h3>

            {/* Language Status Bar */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-medium">
                यहाँ हिंदी (अनिवार्य), English एवं Hinglish तीनों भाषाओं में भावार्थ संपादित करें।
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span
                  className={`px-2 py-0.5 rounded ${
                    formData.hindiTranslation?.trim()
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  हिंदी: {formData.hindiTranslation?.trim() ? "भरी है ✓" : "आवश्यक *"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    formData.englishTranslation?.trim()
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  English: {formData.englishTranslation?.trim() ? "भरी है ✓" : "वैकल्पिक"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded ${
                    formData.hinglishTranslation?.trim()
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  Hinglish: {formData.hinglishTranslation?.trim() ? "भरी है ✓" : "वैकल्पिक"}
                </span>
              </div>
            </div>

            {/* 1. Hindi Meaning */}
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                  1. हिंदी भावार्थ
                </span>
                <span>प्रामाणिक हिंदी व्याख्या (Hindi Translation) *</span>
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
                <span>सरल हिंग्लिश भावार्थ (Hinglish Romanized Explanation)</span>
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
                <span>⬅ पिछला चरण: मूल मंत्र</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("padapatha")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>अगला चरण: पदच्छेद व पदार्थ (Word Meanings)</span>
                <span>➔</span>
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
                <span>⬅ पिछला चरण: बहुभाषी भावार्थ</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shastric")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-50 hover:bg-saffron-100 border border-saffron-300 text-saffron-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>अगला चरण: शास्त्रीय संदर्भ व विनियोग</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SHASTRIC CONTEXT & AUDIO */}
        {activeTab === "shastric" && (
          <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
              <Flame className="w-4 h-4 text-saffron-600" />
              <span>शास्त्रीय संदर्भ, विनियोग एवं ऑडियो</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                शास्त्रीय व्याख्या, विनियोग एवं याज्ञिक प्रयोग (Shastric Context)
              </label>
              <textarea
                rows={4}
                value={formData.shastricContext || ""}
                onChange={(e) =>
                  setFormData({ ...formData, shastricContext: e.target.value })
                }
                placeholder="ऋग्वेद का प्रथम मंगलाचरण मंत्र। समस्त वैदिक वांग्मय का यह प्रथम मंगलाचरण मंत्र है जिसमें भौतिक एवं आध्यात्मिक अग्नि दोनों की सर्वव्यापकता प्रतिपादित की गई है..."
                className="w-full p-3 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 mb-1 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-saffron-600" />
                  <span>ऑडियो पाठ URL (Audio Chanting URL)</span>
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
                  क्रमबद्धता (Order Index)
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
                  पिछला मंत्र ID (Previous Mantra ID)
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
                  अगला मंत्र ID (Next Mantra ID)
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
                <span>⬅ पिछला चरण: पदच्छेद व पदार्थ</span>
              </button>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-cream-200">
          <div className="text-xs text-charcoal-400">
            * आवश्यक फ़ील्ड्स
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/library/mantras"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
            >
              रद्द करें
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "सहेजा जा रहा है..." : "मंत्र सहेजें (Save Mantra)"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MantraFormPage;
