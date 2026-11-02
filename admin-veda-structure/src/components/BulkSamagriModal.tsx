import React, { useState, useEffect } from "react";
import {
  ListPlus,
  Trash2,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Modal from "@/components/Modal";
import { cleanBulletPrefix } from "@/components/BulkStringListModal";
import { YagyaSamagriItem } from "@/services/yagyaServiceCatalogueService";

export interface ParsedSamagriPreviewItem {
  id: string;
  name: string;
  status: "included" | "optional" | "additional";
}

export interface BulkSamagriModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCount?: number;
  onApply: (items: YagyaSamagriItem[], mode: "append" | "replace") => void;
}

const SAMPLE_SAMAGRI_TEXT = `Pure Desi Cow Ghee (A2 Bilona)
Black Sesame Seeds (Kala Til)
Barley Grains (Jau)
Mango Wood Samidha (Dried)
Vedic Havan Samagri with Guggal & Camphor
Navadhanya (Nine Sacred Grains)
Pure Saffron & Sandalwood Powder
Dry Coconut (Gola) for Purnahuti`;

export function parseSamagriText(text: string): ParsedSamagriPreviewItem[] {
  if (!text.trim()) return [];

  const rawLines = text.split(/\r?\n/);
  const items: ParsedSamagriPreviewItem[] = [];
  const seen = new Set<string>();

  for (const rawLine of rawLines) {
    const cleaned = cleanBulletPrefix(rawLine);
    if (cleaned.length > 0) {
      const lower = cleaned.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        items.push({
          id: `samagri-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: cleaned,
          status: "included",
        });
      }
    }
  }

  return items;
}

export default function BulkSamagriModal({
  isOpen,
  onClose,
  existingCount = 0,
  onApply,
}: BulkSamagriModalProps) {
  const [rawText, setRawText] = useState("");
  const [items, setItems] = useState<ParsedSamagriPreviewItem[]>([]);
  const [mode, setMode] = useState<"append" | "replace">("append");
  const [hasInput, setHasInput] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setRawText("");
      setItems([]);
      setHasInput(false);
      setMode("append");
    }
  }, [isOpen]);

  // Synchronize parsing when raw text changes
  useEffect(() => {
    if (rawText.trim()) {
      const parsed = parseSamagriText(rawText);
      setItems(parsed);
      setHasInput(true);
    } else {
      setItems([]);
      setHasInput(false);
    }
  }, [rawText]);

  const handleLoadSample = () => {
    setRawText(SAMPLE_SAMAGRI_TEXT);
  };

  const handleClear = () => {
    setRawText("");
    setItems([]);
    setHasInput(false);
  };

  const handleUpdateName = (id: string, name: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  };

  const handleUpdateStatus = (
    id: string,
    status: "included" | "optional" | "additional"
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleSetAllStatus = (status: "included" | "optional" | "additional") => {
    setItems((prev) => prev.map((item) => ({ ...item, status })));
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `samagri-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: "",
        status: "included",
      },
    ]);
  };

  const validItems = items.filter((i) => i.name.trim().length > 0);

  const handleApply = () => {
    if (validItems.length === 0) return;

    const formatted: YagyaSamagriItem[] = validItems.map((item) => ({
      name: item.name.trim(),
      status: item.status,
    }));

    onApply(formatted, mode);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Add Samagri (Ritual Materials)" size="lg">
      <div className="space-y-3.5">
        {/* Compact helper info bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-cream-50 rounded-lg border border-cream-200">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
            <span>
              Paste materials list (one item per line). Bullet points & numbering are automatically stripped.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 underline"
            >
              Load Example
            </button>
            {rawText && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-charcoal-400 hover:text-red-500"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Compact Multiline Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-0">
              Paste Samagri Items
            </label>
            {items.length > 0 && (
              <span className="text-[11px] font-semibold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded-full border border-saffron-200">
                {validItems.length} valid {validItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <textarea
            rows={4}
            className="input-field text-xs font-mono leading-relaxed resize-y py-2"
            placeholder="Paste samagri items here (one per line)...&#10;e.g.&#10;Pure Desi Cow Ghee&#10;Black Sesame Seeds&#10;Mango Wood Samidha&#10;Havan Kund & Camphor"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {/* Warning if input provided but zero items extracted */}
        {hasInput && items.length === 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>No valid items detected. Please ensure each samagri item is on its own line.</span>
          </div>
        )}

        {/* Compact Live Preview & Editing List with Status Selection */}
        {items.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                Parsed Preview & Status ({items.length})
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-cream-100 rounded-md p-0.5 text-[11px] text-charcoal-600">
                  <span className="px-1 text-charcoal-400 font-medium">Set all:</span>
                  <button
                    type="button"
                    onClick={() => handleSetAllStatus("included")}
                    className="px-1.5 py-0.5 rounded hover:bg-white text-saffron-700 font-medium transition"
                  >
                    Included
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllStatus("optional")}
                    className="px-1.5 py-0.5 rounded hover:bg-white text-amber-700 font-medium transition"
                  >
                    Optional
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllStatus("additional")}
                    className="px-1.5 py-0.5 rounded hover:bg-white text-blue-700 font-medium transition"
                  >
                    Additional
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div className="max-h-[200px] overflow-y-auto space-y-1.5 pr-1">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-1.5 items-center">
                  <span className="col-span-1 text-xs font-bold text-charcoal-400 text-center shrink-0">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    className="input-field py-1 text-xs px-2.5 rounded-lg border-cream-200 col-span-7"
                    placeholder="Samagri name..."
                    value={item.name}
                    onChange={(e) => handleUpdateName(item.id, e.target.value)}
                  />
                  <select
                    className="input-field py-1 text-xs px-2 rounded-lg border-cream-200 col-span-3 font-medium"
                    value={item.status}
                    onChange={(e) =>
                      handleUpdateStatus(
                        item.id,
                        e.target.value as "included" | "optional" | "additional"
                      )
                    }
                  >
                    <option value="included">Included</option>
                    <option value="optional">Optional</option>
                    <option value="additional">Additional</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="col-span-1 p-1 text-charcoal-300 hover:text-red-500 rounded flex justify-center transition"
                    title="Remove this item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compact Append vs Replace Option */}
        {existingCount > 0 && (
          <div className="p-2.5 rounded-lg bg-cream-50 border border-cream-200">
            <span className="text-xs font-semibold text-charcoal-700 block mb-1">
              Apply mode:
            </span>
            <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bulk-mode-samagri"
                  checked={mode === "append"}
                  onChange={() => setMode("append")}
                  className="text-saffron-600 focus:ring-saffron-400"
                />
                <span>
                  Append to existing list ({existingCount} existing items preserved)
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-red-600">
                <input
                  type="radio"
                  name="bulk-mode-samagri"
                  checked={mode === "replace"}
                  onChange={() => setMode("replace")}
                  className="text-red-600 focus:ring-red-400"
                />
                <span>Replace all existing samagri</span>
              </label>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-cream-200">
          <button type="button" onClick={onClose} className="btn-secondary text-xs py-1.5 px-3">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={validItems.length === 0}
            className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
          >
            <ListPlus className="w-3.5 h-3.5" />
            Add {validItems.length > 0 ? `${validItems.length} ` : ""}to Samagri
          </button>
        </div>
      </div>
    </Modal>
  );
}
