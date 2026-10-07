import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, BookOpen } from "lucide-react";
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
    orderIndex: 0,
    status: "ACTIVE",
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchVeda = async () => {
        try {
          setLoading(true);
          const data = await VedaAdminService.getVedaById(id);
          if (data) {
            setFormData(data);
          }
        } catch (err: any) {
          showToast(err.message || "वेद डेटा लोड करने में विफल", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchVeda();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (!formData.name || !formData.enName) {
        throw new Error("वेद का नाम (हिंदी व अंग्रेजी) अनिवार्य है।");
      }

      const slug =
        formData.slug ||
        formData.id ||
        formData.enName?.toLowerCase().replace(/\s+/g, "-");
      const vedaId = formData.id || slug;

      const payload = {
        ...formData,
        id: vedaId,
        slug,
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
      <div className="p-12 text-center text-xs text-charcoal-500">
        डेटा लोड हो रहा है...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={isEditing ? `संपादित करें: ${formData.name}` : "नया वेद जोड़ें"}
        subtitle="वेद का सामान्य विवरण, ऋत्विक, परिचय एवं शास्त्रीय संदर्भ"
        actions={
          <Link
            to="/admin/library/vedas"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-cream-300 text-charcoal-700 text-xs font-bold hover:bg-cream-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस जाएं</span>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-cream-200 shadow-2xs space-y-4">
          <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-cream-100 pb-2.5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-saffron-600" />
            <span>मूल जानकारी (Core Identification)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                नाम (Hindi / Devanagari) *
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. ऋग्वेद या यजुर्वेद"
                className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                English Name *
              </label>
              <input
                type="text"
                required
                value={formData.enName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, enName: e.target.value })
                }
                placeholder="e.g. Rigveda or Yajurveda"
                className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                ID / Slug *
              </label>
              <input
                type="text"
                required
                disabled={isEditing}
                value={formData.id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    id: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
                placeholder="e.g. rigveda or yajurveda"
                className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono disabled:bg-cream-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                प्रधान ऋत्विक (Chief Priest)
              </label>
              <input
                type="text"
                value={formData.priest || ""}
                onChange={(e) =>
                  setFormData({ ...formData, priest: e.target.value })
                }
                placeholder="e.g. होतृ (Hotri) या अध्वर्यु (Adhvaryu)"
                className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                बैज (Badge)
              </label>
              <input
                type="text"
                value={formData.badge || ""}
                onChange={(e) =>
                  setFormData({ ...formData, badge: e.target.value })
                }
                placeholder="e.g. प्रधान श्रुति"
                className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                सांख्यिकी (Stats)
              </label>
              <input
                type="text"
                value={formData.stats || ""}
                onChange={(e) =>
                  setFormData({ ...formData, stats: e.target.value })
                }
                placeholder="e.g. १० मण्डल • १०२८ सूक्त • १०,५५२ मंत्र"
                className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                स्थिति (Status)
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 bg-white focus:border-saffron-500 focus:outline-none"
              >
                <option value="ACTIVE">सक्रिय (Active)</option>
                <option value="DRAFT">ड्राफ्ट (Draft)</option>
                <option value="INACTIVE">निष्क्रिय (Inactive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              प्रस्तावना / संक्षिप्त परिचय (Intro)
            </label>
            <textarea
              rows={2}
              value={formData.intro || ""}
              onChange={(e) =>
                setFormData({ ...formData, intro: e.target.value })
              }
              placeholder="ऋचाओं और सूक्तों का प्राचीनतम वैदिक संग्रह..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              विस्तृत अवलोकन (Overview Text)
            </label>
            <textarea
              rows={4}
              value={formData.overviewText || ""}
              onChange={(e) =>
                setFormData({ ...formData, overviewText: e.target.value })
              }
              placeholder="वेद के बारे में संपूर्ण परिचय, ऋषि परंपरा, देवगण एवं दार्शनिक महत्व..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/admin/library/vedas"
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
            <span>{saving ? "सहेजा जा रहा है..." : "वेद सहेजें (Save Veda)"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VedaFormPage;
