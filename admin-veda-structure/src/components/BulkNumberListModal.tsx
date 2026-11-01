import React, { useState, useEffect } from "react";
import {
  ListPlus,
  Trash2,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Hash,
} from "lucide-react";
import Modal from "@/components/Modal";

export interface ParseNumberListResult {
  validNumbers: number[];
  invalidTokens: string[];
  hasInput: boolean;
}

export interface BulkNumberListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemLabel?: string;
  placeholder?: string;
  sampleNumbers?: number[];
  unitSuffix?: string;
  existingCount?: number;
  existingNumbers?: number[];
  onApply: (numbers: number[], mode: "append" | "replace") => void;
}

/**
 * Parses comma, newline, tab, semicolon, or space-separated tokens into positive integers.
 * - Extracts positive integers (> 0).
 * - Identifies non-numeric, decimal, negative, or zero values as invalidTokens.
 * - Deduplicates valid numbers and sorts them in ascending numerical order.
 */
export function parseNumberList(text: string): ParseNumberListResult {
  if (!text.trim()) {
    return { validNumbers: [], invalidTokens: [], hasInput: false };
  }

  // Split by newlines, commas, semicolons, tabs, and spaces
  const rawTokens = text
    .split(/[\r\n,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (rawTokens.length === 0) {
    return { validNumbers: [], invalidTokens: [], hasInput: false };
  }

  const seen = new Set<number>();
  const validNumbers: number[] = [];
  const invalidTokens: string[] = [];

  for (const token of rawTokens) {
    // Also handle space-separated values within a line (e.g. "108 1008 5000")
    const subTokens = token.split(/\s+/).filter((s) => s.length > 0);
    for (const sub of subTokens) {
      // Must be purely digits and greater than 0
      if (/^\d+$/.test(sub)) {
        const num = Number(sub);
        if (num > 0 && Number.isSafeInteger(num)) {
          if (!seen.has(num)) {
            seen.add(num);
            validNumbers.push(num);
          }
        } else {
          invalidTokens.push(sub);
        }
      } else {
        invalidTokens.push(sub);
      }
    }
  }

  validNumbers.sort((a, b) => a - b);

  return {
    validNumbers,
    invalidTokens,
    hasInput: true,
  };
}

export default function BulkNumberListModal({
  isOpen,
  onClose,
  title,
  itemLabel = "Count",
  placeholder = "Enter or paste counts here (separated by commas or new lines)...&#10;e.g.&#10;11000, 21000&#10;31000&#10;51000, 100000, 125000",
  sampleNumbers = [11000, 21000, 31000, 51000, 100000, 125000],
  unitSuffix = "Japa",
  existingCount = 0,
  existingNumbers = [],
  onApply,
}: BulkNumberListModalProps) {
  const [rawText, setRawText] = useState("");
  const [numbers, setNumbers] = useState<number[]>([]);
  const [invalidTokens, setInvalidTokens] = useState<string[]>([]);
  const [mode, setMode] = useState<"append" | "replace">("append");
  const [hasInput, setHasInput] = useState(false);
  const [manualInput, setManualInput] = useState("");

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setRawText("");
      setNumbers([]);
      setInvalidTokens([]);
      setHasInput(false);
      setManualInput("");
      setMode("append");
    }
  }, [isOpen]);

  // Synchronize parsing when raw text changes
  useEffect(() => {
    if (rawText.trim()) {
      const result = parseNumberList(rawText);
      setNumbers(result.validNumbers);
      setInvalidTokens(result.invalidTokens);
      setHasInput(true);
    } else {
      setNumbers([]);
      setInvalidTokens([]);
      setHasInput(false);
    }
  }, [rawText]);

  const handleLoadSample = () => {
    setRawText(sampleNumbers.join(", "));
  };

  const handleClear = () => {
    setRawText("");
    setNumbers([]);
    setInvalidTokens([]);
    setHasInput(false);
  };

  const handleRemoveNumber = (numToRemove: number) => {
    setNumbers((prev) => prev.filter((n) => n !== numToRemove));
  };

  const handleAddManual = () => {
    const trimmed = manualInput.trim();
    if (!trimmed) return;
    if (!/^\d+$/.test(trimmed)) {
      return;
    }
    const val = Number(trimmed);
    if (val <= 0 || !Number.isSafeInteger(val)) return;

    if (!numbers.includes(val)) {
      setNumbers((prev) => [...prev, val].sort((a, b) => a - b));
    }
    setManualInput("");
  };

  const canApply = numbers.length > 0 && invalidTokens.length === 0;

  const handleApply = () => {
    if (!canApply) return;
    onApply(numbers, mode);
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
              Enter numbers separated by <strong>commas</strong> or <strong>new lines</strong>. Duplicates are removed and sorted automatically.
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

        {/* Multiline Paste Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-0">
              Paste or Type Numbers
            </label>
            {numbers.length > 0 && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  canApply
                    ? "text-saffron-700 bg-saffron-50 border-saffron-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {numbers.length} valid {numbers.length === 1 ? itemLabel.toLowerCase() : `${itemLabel.toLowerCase()}s`}
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

        {/* Warning banner for invalid tokens */}
        {invalidTokens.length > 0 && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {invalidTokens.length} Invalid or non-positive value
                {invalidTokens.length === 1 ? "" : "s"} detected:
              </span>
            </div>
            <p className="text-[11px] text-amber-800 font-mono break-words">
              {invalidTokens.join(", ")}
            </p>
            <p className="text-[11px] text-amber-800">
              Only whole positive integers greater than zero are supported. Please remove or fix these values above before applying.
            </p>
          </div>
        )}

        {/* Empty input warning */}
        {hasInput && numbers.length === 0 && invalidTokens.length === 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>No valid positive integers found. Please check your input.</span>
          </div>
        )}

        {/* Parsed Preview Pills & Staging Area */}
        {numbers.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                Parsed & Sorted Preview ({numbers.length} {numbers.length === 1 ? itemLabel : `${itemLabel}s`})
              </h4>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  className="input-field py-1 text-xs font-mono w-28 px-2"
                  placeholder="e.g. 51000"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddManual();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddManual}
                  className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-saffron-50 border border-saffron-200 px-2 py-1 rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-2.5 rounded-lg bg-cream-50/70 border border-cream-200">
              {numbers.map((num) => {
                const isExisting = existingNumbers.includes(num);
                return (
                  <div
                    key={num}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border ${
                      isExisting && mode === "append"
                        ? "bg-cream-100 border-cream-300 text-charcoal-600"
                        : "bg-saffron-50 border-saffron-200 text-saffron-900"
                    }`}
                  >
                    <span>
                      {num.toLocaleString("en-IN")}
                      {unitSuffix ? ` ${unitSuffix}` : ""}
                    </span>
                    {isExisting && mode === "append" && (
                      <span className="text-[10px] text-charcoal-400 font-sans font-normal">
                        (already exists)
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveNumber(num)}
                      className="text-charcoal-400 hover:text-red-500 rounded transition ml-0.5"
                      title={`Remove ${num}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Append vs Replace Option */}
        {existingCount > 0 && (
          <div className="p-2.5 rounded-lg bg-cream-50 border border-cream-200">
            <span className="text-xs font-semibold text-charcoal-700 block mb-1">
              Apply mode:
            </span>
            <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bulk-mode-numbers"
                  checked={mode === "append"}
                  onChange={() => setMode("append")}
                  className="text-saffron-600 focus:ring-saffron-400"
                />
                <span>
                  Append to existing ({existingCount} existing {existingCount === 1 ? itemLabel.toLowerCase() : `${itemLabel.toLowerCase()}s`} preserved)
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-red-600">
                <input
                  type="radio"
                  name="bulk-mode-numbers"
                  checked={mode === "replace"}
                  onChange={() => setMode("replace")}
                  className="text-red-600 focus:ring-red-400"
                />
                <span>Replace entire existing list</span>
              </label>
            </div>
            {mode === "replace" && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-700 bg-red-50 p-2 rounded border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Warning: This will overwrite and remove all {existingCount} existing {itemLabel.toLowerCase()}{existingCount === 1 ? "" : "s"}.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-cream-200">
          <div className="text-[11px] text-charcoal-500">
            {invalidTokens.length > 0 && (
              <span className="text-amber-700">
                Fix invalid values above to enable apply.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!canApply}
              className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
            >
              <ListPlus className="w-3.5 h-3.5" />
              {mode === "replace" ? "Replace List with " : "Add "}
              {numbers.length > 0 ? `${numbers.length} ` : ""}
              {numbers.length === 1 ? itemLabel : `${itemLabel}s`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
