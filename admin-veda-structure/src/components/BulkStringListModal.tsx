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

export interface ParsedStringItem {
  id: string;
  text: string;
}

export interface BulkStringListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemLabel?: string;
  placeholder?: string;
  sampleItems?: string[];
  isNumbered?: boolean;
  existingCount?: number;
  onApply: (items: string[], mode: "append" | "replace") => void;
}

export function cleanBulletPrefix(line: string): string {
  let cleaned = line.trim();

  // Strip common numbering / step prefixes: "1. ", "1) ", "1: ", "[1] ", "Phase 1: ", "Step 1 - ", "Step 1:"
  cleaned = cleaned.replace(/^(?:Phase\s*\d+\s*[:\-.]?\s*|Step\s*\d+\s*[:\-.]?\s*|\d+[\.\)\:\-]\s*|\[\d+\]\s*)/i, "");

  // Strip common bullet characters: •, -, *, ◦, ▪, ▫, ✓, ✔, –, —, >
  cleaned = cleaned.replace(/^[•\-\*\u2022\u25E6\u25AA\u25AB\u2713\u2714\u2013\u2014>]\s*/, "");

  // Repeat once more in case of combined prefix like "1. • Item" or "• 1. Item"
  cleaned = cleaned.replace(/^(?:Phase\s*\d+\s*[:\-.]?\s*|Step\s*\d+\s*[:\-.]?\s*|\d+[\.\)\:\-]\s*|\[\d+\]\s*)/i, "");
  cleaned = cleaned.replace(/^[•\-\*\u2022\u25E6\u25AA\u25AB\u2713\u2714\u2013\u2014>]\s*/, "");

  return cleaned.trim();
}

export function parseStringList(text: string): ParsedStringItem[] {
  if (!text.trim()) return [];

  const rawLines = text.split(/\r?\n/);
  const items: ParsedStringItem[] = [];

  for (const rawLine of rawLines) {
    const cleaned = cleanBulletPrefix(rawLine);
    if (cleaned.length > 0) {
      items.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: cleaned,
      });
    }
  }

  return items;
}

export default function BulkStringListModal({
  isOpen,
  onClose,
  title,
  itemLabel = "Item",
  placeholder = "Paste your list here (one item per line)...",
  sampleItems,
  isNumbered = false,
  existingCount = 0,
  onApply,
}: BulkStringListModalProps) {
  const [rawText, setRawText] = useState("");
  const [items, setItems] = useState<ParsedStringItem[]>([]);
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
      const parsed = parseStringList(rawText);
      setItems(parsed);
      setHasInput(true);
    } else {
      setItems([]);
      setHasInput(false);
    }
  }, [rawText]);

  const handleLoadSample = () => {
    if (sampleItems && sampleItems.length > 0) {
      setRawText(sampleItems.join("\n"));
    } else {
      setRawText(`Pure Desi Cow Ghee & Puja Samagri\nAcharya Dakshina Included\nPersonalized Gotra & Family Sankalp\nPrasad Delivery to Registered Address`);
    }
  };

  const handleClear = () => {
    setRawText("");
    setItems([]);
    setHasInput(false);
  };

  const handleUpdateItemText = (id: string, text: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: "",
      },
    ]);
  };

  const validItems = items.filter((i) => i.text.trim().length > 0);

  const handleApply = () => {
    if (validItems.length === 0) return;
    const finalStrings = validItems.map((i) => i.text.trim());
    onApply(finalStrings, mode);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-3.5">
        {/* Compact helper info bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-cream-50 rounded-lg border border-cream-200">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
            <span>
              Paste lines from a document. Bullet points & numbers are automatically stripped.
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
              Paste Multiple {itemLabel}s
            </label>
            {items.length > 0 && (
              <span className="text-[11px] font-semibold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded-full border border-saffron-200">
                {validItems.length} valid {validItems.length === 1 ? itemLabel.toLowerCase() : `${itemLabel.toLowerCase()}s`}
              </span>
            )}
          </div>
          <textarea
            rows={4}
            className="input-field text-xs font-mono leading-relaxed resize-y py-2"
            placeholder={placeholder}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {/* Warning if input provided but zero items extracted */}
        {hasInput && items.length === 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>No valid entries found. Please ensure each item is on its own line.</span>
          </div>
        )}

        {/* Compact Live Preview & Editing List */}
        {items.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                Parsed Preview & Edit ({items.length})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="max-h-[190px] overflow-y-auto space-y-1.5 pr-1">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-charcoal-400 w-6 text-center shrink-0">
                    {isNumbered ? `${idx + 1}.` : `•`}
                  </span>
                  <input
                    type="text"
                    className="input-field py-1 text-xs px-2.5 rounded-lg border-cream-200 flex-1"
                    placeholder={`${itemLabel} text...`}
                    value={item.text}
                    onChange={(e) => handleUpdateItemText(item.id, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 text-charcoal-300 hover:text-red-500 rounded shrink-0 transition"
                    title={`Remove this ${itemLabel}`}
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
                  name={`bulk-mode-${itemLabel.toLowerCase()}`}
                  checked={mode === "append"}
                  onChange={() => setMode("append")}
                  className="text-saffron-600 focus:ring-saffron-400"
                />
                <span>
                  Append to existing list ({existingCount} existing)
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-red-600">
                <input
                  type="radio"
                  name={`bulk-mode-${itemLabel.toLowerCase()}`}
                  checked={mode === "replace"}
                  onChange={() => setMode("replace")}
                  className="text-red-600 focus:ring-red-400"
                />
                <span>Replace all existing items</span>
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
            Add {validItems.length > 0 ? `${validItems.length} ` : ""}to Form
          </button>
        </div>
      </div>
    </Modal>
  );
}
