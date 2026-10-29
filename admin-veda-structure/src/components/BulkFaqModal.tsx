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

export interface ParsedFaq {
  id: string;
  question: string;
  answer: string;
}

export interface BulkFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (faqs: Array<{ question: string; answer: string }>, mode: "append" | "replace") => void;
  existingCount?: number;
}

const SAMPLE_FAQ_TEXT = `Q: What is the significance of this Vedic Puja?
A: This ritual is conducted strictly according to traditional Vedic shastras to invoke divine blessings, purity, and spiritual elevation.

Q: Can I book this puja for remote participation?
A: Yes, personalized Sankalpa is invoked with your name and gotra, followed by prasad delivery and video updates.

Q: What items are included in the samagri?
A: Pure desi cow ghee, authentic herbs, flowers, fruits, and consecrated offerings are completely arranged.`;

export function parseFaqText(text: string): ParsedFaq[] {
  if (!text.trim()) return [];

  const lines = text.split(/\r?\n/);
  const results: ParsedFaq[] = [];

  let currentQ = "";
  let currentA: string[] = [];
  let isCapturingAnswer = false;

  const saveCurrent = () => {
    if (currentQ.trim() || currentA.length > 0) {
      results.push({
        id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: currentQ.trim(),
        answer: currentA.join("\n").trim(),
      });
      currentQ = "";
      currentA = [];
      isCapturingAnswer = false;
    }
  };

  const qRegex = /^(?:Q\d*[\.:\-]|Question\d*[\.:\-])\s*/i;
  const aRegex = /^(?:A\d*[\.:\-]|Answer\d*[\.:\-])\s*/i;
  const numberedQRegex = /^\d+[\.\)]\s*(.*?\?)\s*$/;
  const markdownHeadingQRegex = /^#+\s+(.*?\??)\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check for explicit "Q:" or "Question:" prefix
    if (qRegex.test(line)) {
      saveCurrent();
      currentQ = line.replace(qRegex, "").trim();
      isCapturingAnswer = false;
      continue;
    }

    // Check for explicit "A:" or "Answer:" prefix
    if (aRegex.test(line)) {
      isCapturingAnswer = true;
      currentA.push(line.replace(aRegex, "").trim());
      continue;
    }

    // Check for numbered question: "1. What is the puja...?"
    const numberedMatch = line.match(numberedQRegex);
    if (numberedMatch) {
      saveCurrent();
      currentQ = numberedMatch[1].trim();
      isCapturingAnswer = false;
      continue;
    }

    // Check for markdown heading question: "### What is the puja...?"
    if (markdownHeadingQRegex.test(line)) {
      saveCurrent();
      currentQ = line.replace(/^#+\s*/, "");
      continue;
    }

    // If currently capturing answer, append line to answer
    if (isCapturingAnswer) {
      currentA.push(rawLine);
    } else if (currentQ) {
      // If we have question text and next line is non-empty without explicit 'A:', start capturing answer
      if (line.length > 0) {
        isCapturingAnswer = true;
        currentA.push(rawLine);
      }
    }
  }

  saveCurrent();

  // Fallback: Double-newline separated blocks if Q/A prefixes were not matched
  if (results.length === 0) {
    const blocks = text.trim().split(/\n\s*\n+/);
    for (const block of blocks) {
      const blockLines = block
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (blockLines.length >= 2) {
        results.push({
          id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          question: blockLines[0]
            .replace(/^(?:Q\d*[\.:\-]|Question\d*[\.:\-])\s*/i, "")
            .trim(),
          answer: blockLines
            .slice(1)
            .join("\n")
            .replace(/^(?:A\d*[\.:\-]|Answer\d*[\.:\-])\s*/i, "")
            .trim(),
        });
      }
    }
  }

  return results;
}

export default function BulkFaqModal({
  isOpen,
  onClose,
  onApply,
  existingCount = 0,
}: BulkFaqModalProps) {
  const [rawText, setRawText] = useState("");
  const [parsedFaqs, setParsedFaqs] = useState<ParsedFaq[]>([]);
  const [mode, setMode] = useState<"append" | "replace">("append");
  const [hasParsed, setHasParsed] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRawText("");
      setParsedFaqs([]);
      setHasParsed(false);
      setMode("append");
    }
  }, [isOpen]);

  // Real-time parsing when rawText changes
  useEffect(() => {
    if (rawText.trim()) {
      const parsed = parseFaqText(rawText);
      setParsedFaqs(parsed);
      setHasParsed(true);
    } else {
      setParsedFaqs([]);
      setHasParsed(false);
    }
  }, [rawText]);

  const handleLoadSample = () => {
    setRawText(SAMPLE_FAQ_TEXT);
  };

  const handleClear = () => {
    setRawText("");
    setParsedFaqs([]);
    setHasParsed(false);
  };

  const handleUpdateQuestion = (id: string, question: string) => {
    setParsedFaqs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, question } : faq))
    );
  };

  const handleUpdateAnswer = (id: string, answer: string) => {
    setParsedFaqs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, answer } : faq))
    );
  };

  const handleRemoveItem = (id: string) => {
    setParsedFaqs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddBlankItem = () => {
    setParsedFaqs((prev) => [
      ...prev,
      {
        id: `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: "",
        answer: "",
      },
    ]);
  };

  const validEntries = parsedFaqs.filter(
    (f) => f.question.trim().length > 0 && f.answer.trim().length > 0
  );

  const incompleteEntriesCount = parsedFaqs.filter(
    (f) =>
      (f.question.trim().length > 0 && !f.answer.trim().length) ||
      (!f.question.trim().length && f.answer.trim().length > 0)
  ).length;

  const handleApply = () => {
    if (validEntries.length === 0) return;

    const formatted = validEntries.map((f) => ({
      question: f.question.trim(),
      answer: f.answer.trim(),
    }));

    onApply(formatted, mode);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Add FAQs" size="lg">
      <div className="space-y-3.5">
        {/* Compact Helper Header & Sample Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-cream-50 rounded-lg border border-cream-200">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
            <span>
              Paste questions & answers using <strong>Q:</strong> / <strong>A:</strong> or numbered lines.
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

        {/* Textarea Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-0">
              Paste FAQ Text
            </label>
            {parsedFaqs.length > 0 && (
              <span className="text-[11px] font-semibold text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded-full border border-saffron-200">
                {validEntries.length} valid {validEntries.length === 1 ? "FAQ" : "FAQs"} detected
              </span>
            )}
          </div>
          <textarea
            rows={4}
            className="input-field text-xs font-mono leading-relaxed resize-y py-2"
            placeholder={`Q: What is the purpose of this puja?\nA: This puja is performed for spiritual well-being.\n\nQ: Can I book this puja online?\nA: Yes, you can book it through our website.`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {/* Validation Warning if unparseable */}
        {hasParsed && parsedFaqs.length === 0 && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to detect valid FAQ pairs</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Format each item with <strong>Q:</strong> and <strong>A:</strong> prefixes or numbered questions ending with ?.
              </p>
            </div>
          </div>
        )}

        {/* Incomplete items notice */}
        {incompleteEntriesCount > 0 && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>
              {incompleteEntriesCount} {incompleteEntriesCount === 1 ? "item has" : "items have"} a missing question or answer.
            </span>
          </div>
        )}

        {/* Compact Live Editable Preview Section */}
        {parsedFaqs.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                Parsed FAQs Preview ({parsedFaqs.length})
              </h4>
              <button
                type="button"
                onClick={handleAddBlankItem}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another
              </button>
            </div>

            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
              {parsedFaqs.map((faq, idx) => (
                <div
                  key={faq.id}
                  className="p-2.5 rounded-lg border border-cream-200 bg-cream-50/50 space-y-1.5 relative group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-charcoal-500 bg-white px-1.5 py-0.5 rounded border border-cream-200 shrink-0">
                      Q{idx + 1}
                    </span>
                    <input
                      type="text"
                      className={`input-field text-xs font-medium py-1 px-2.5 flex-1 rounded-md ${
                        !faq.question.trim() ? "border-amber-400 bg-amber-50/30" : ""
                      }`}
                      placeholder="Question..."
                      value={faq.question}
                      onChange={(e) =>
                        handleUpdateQuestion(faq.id, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(faq.id)}
                      className="text-charcoal-300 hover:text-red-500 p-1 rounded transition shrink-0"
                      title="Remove this FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="pl-7">
                    <textarea
                      rows={2}
                      className={`input-field text-xs py-1 px-2.5 rounded-md resize-y ${
                        !faq.answer.trim() ? "border-amber-400 bg-amber-50/30" : ""
                      }`}
                      placeholder="Answer details..."
                      value={faq.answer}
                      onChange={(e) =>
                        handleUpdateAnswer(faq.id, e.target.value)
                      }
                    />
                  </div>
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
                  name="faq-bulk-mode"
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
                  name="faq-bulk-mode"
                  checked={mode === "replace"}
                  onChange={() => setMode("replace")}
                  className="text-red-600 focus:ring-red-400"
                />
                <span>Replace all existing FAQs</span>
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
            disabled={validEntries.length === 0}
            className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
          >
            <ListPlus className="w-3.5 h-3.5" />
            Add {validEntries.length > 0 ? `${validEntries.length} ` : ""}to Form
          </button>
        </div>
      </div>
    </Modal>
  );
}
