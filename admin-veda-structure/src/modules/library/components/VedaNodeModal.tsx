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
  { value: "SHAKHA", label: "Shakha" },
  { value: "SAMHITA", label: "Samhita" },
  { value: "SUKTA", label: "Sukta" },
  { value: "ADHYAYA", label: "Adhyaya" },
  { value: "MANDALA", label: "Mandala" },
  { value: "KANDA", label: "Kanda" },
  { value: "BRAHMANA", label: "Brahmana" },
  { value: "ARANYAKA", label: "Aranyaka" },
  { value: "UPANISHAD", label: "Upanishad" },
  { value: "SUTRA", label: "Sutra / Pratishakhya" },
  { value: "VARGA", label: "Varga / Parva" },
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
        throw new Error("Title / Name (Sanskrit / Hindi) is required.");
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save node.";
      setError(msg || "Failed to save node.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Shakha / Sukta / Node" : "Add New Sub-Type / Shakha / Sukta"}
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
              Node Type *
            </label>
            <select
              value={formData.nodeType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nodeType: e.target.value as NonNullable<VedaNode["nodeType"]>,
                })
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
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as NonNullable<VedaNode["status"]>,
                })
              }
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 bg-white focus:border-saffron-500 focus:outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal-700 mb-1">
            Title / Name (Sanskrit / Hindi) *
          </label>
          <input
            type="text"
            required
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. 1. Agni Sukta (Mandala 1, Sukta 1) or Shakala Shakha"
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
              Badge
            </label>
            <input
              type="text"
              value={formData.badge || ""}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Sukta, Shakha, Samhita"
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              Stats / Summary
            </label>
            <input
              type="text"
              value={formData.stats || ""}
              onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
              placeholder="e.g. 9 Mantras • Gayatri Meter"
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              Starting Mantra ID
            </label>
            <input
              type="text"
              value={formData.mantraId || ""}
              onChange={(e) => setFormData({ ...formData, mantraId: e.target.value })}
              placeholder="e.g. rv-1-1-1 or vs-16-1"
              className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal-700 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={formData.desc || ""}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            placeholder="Authentic description of this branch or sukta..."
            className="w-full px-3 py-2 rounded-xl text-xs border border-cream-300 focus:border-saffron-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-charcoal-600 hover:bg-cream-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-saffron-600 hover:bg-saffron-700 text-white shadow-xs transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : initialData ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VedaNodeModal;
