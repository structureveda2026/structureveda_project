import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import type { VedaNode } from "../types/veda.types";
import VedaAdminService from "../services/veda.service";

interface VedaNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vedaId: string;
  parentId?: string | null;
  initialData?: VedaNode | null;
}

const NODE_TYPES = [
  { value: "SHAKHA", label: "शाखा (Shakha)" },
  { value: "SAMHITA", label: "संहिता (Samhita)" },
  { value: "SUKTA", label: "सूक्त (Sukta)" },
  { value: "ADHYAYA", label: "अध्याय (Adhyaya)" },
  { value: "MANDALA", label: "मण्डल (Mandala)" },
  { value: "KANDA", label: "काण्ड (Kanda)" },
  { value: "BRAHMANA", label: "ब्राह्मण (Brahmana)" },
  { value: "ARANYAKA", label: "आरण्यक (Aranyaka)" },
  { value: "UPANISHAD", label: "उपनिषद (Upanishad)" },
  { value: "SUTRA", label: "सूत्र ग्रंथ (Sutra / Pratishakhya)" },
  { value: "VARGA", label: "वर्ग / पर्व (Varga / Parva)" },
];

export const VedaNodeModal: React.FC<VedaNodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vedaId,
  parentId = null,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<Partial<VedaNode>>({
    id: "",
    slug: "",
    name: "",
    enName: "",
    nodeType: "SUKTA",
    desc: "",
    stats: "",
    priest: "",
    badge: "",
    imageKey: "",
    mantraId: "",
    orderIndex: 0,
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    } else {
      setFormData({
        id: "",
        slug: "",
        vedaId,
        parentId: parentId || null,
        name: "",
        enName: "",
        nodeType: parentId ? "SUKTA" : "SHAKHA",
        desc: "",
        stats: "",
        priest: "",
        badge: "",
        imageKey: "",
        mantraId: "",
        orderIndex: 0,
        status: "ACTIVE",
      });
    }
  }, [initialData, vedaId, parentId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!formData.name?.trim()) {
        throw new Error("नाम (Name in Hindi/Devanagari) आवश्यक है।");
      }

      const generatedSlug =
        formData.slug?.trim() ||
        formData.enName?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
        `node-${Date.now()}`;

      const generatedId =
        initialData?.id ||
        formData.id?.trim() ||
        `${vedaId}-${generatedSlug}`;

      const payload = {
        ...formData,
        id: generatedId,
        slug: generatedSlug,
        vedaId,
        parentId: initialData ? formData.parentId : parentId,
      };

      if (initialData?.id) {
        await VedaAdminService.updateNode(initialData.id, payload);
      } else {
        await VedaAdminService.createNode(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "नोड सहेजने में विफल।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "शाखा / सूक्त / नोड संपादित करें" : "नया उप-प्रकार / शाखा / सूक्त जोड़ें"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              प्रकार (Node Type) *
            </label>
            <select
              value={formData.nodeType}
              onChange={(e) =>
                setFormData({ ...formData, nodeType: e.target.value as any })
              }
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 bg-white focus:border-saffron-500 focus:outline-none"
            >
              {NODE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
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
            शीर्षक / नाम (Hindi / Devanagari) *
          </label>
          <input
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. १. अग्नि सूक्त (मण्डल १, सूक्त १) या शाकल शाखा"
            className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              English Name
            </label>
            <input
              type="text"
              value={formData.enName || ""}
              onChange={(e) => setFormData({ ...formData, enName: e.target.value })}
              placeholder="e.g. Agni Sukta (Mandala 1, Sukta 1)"
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              बैज (Badge)
            </label>
            <input
              type="text"
              value={formData.badge || ""}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. सूक्त, शाखा, संहिता"
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              सांख्यिकी / संक्षिप्त विवरण (Stats)
            </label>
            <input
              type="text"
              value={formData.stats || ""}
              onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
              placeholder="e.g. ९ मंत्र • गायत्री छंद"
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              प्रारंभिक मंत्र ID (Starting Mantra ID)
            </label>
            <input
              type="text"
              value={formData.mantraId || ""}
              onChange={(e) => setFormData({ ...formData, mantraId: e.target.value })}
              placeholder="e.g. rv-1-1-1 या vs-16-1"
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal-700 mb-1">
            विवरण (Description)
          </label>
          <textarea
            rows={2}
            value={formData.desc || ""}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="शाखा या सूक्त का प्रामाणिक परिचय..."
            className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-devanagari"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
          >
            रद्द करें
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-saffron-600 hover:bg-saffron-700 text-white shadow-xs transition-all disabled:opacity-50"
          >
            {loading ? "सहेजा जा रहा है..." : initialData ? "अपडेट करें" : "जोड़ें"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VedaNodeModal;
