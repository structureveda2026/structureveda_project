import React, { useState, useEffect } from "react";
import {
  Calendar,
  ListPlus,
  Trash2,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import Modal from "@/components/Modal";
import { YagyaDailyScheduleItem } from "@/services/yagyaServiceCatalogueService";

export interface ParsedSchedulePreviewItem {
  id: string;
  day: number | string;
  title: string;
  details: string;
}

export interface ParseDailyScheduleResult {
  items: ParsedSchedulePreviewItem[];
  warnings: string[];
  unrecognizedLines: string[];
}

export interface BulkDailyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCount?: number;
  onApply: (items: YagyaDailyScheduleItem[], mode: "append" | "replace") => void;
}

const SAMPLE_DAILY_SCHEDULE_TEXT = `Day 1: Sankalpa and Preparation
Preparation of the ritual area, collection of materials, and initial sankalpa.

Day 2: Main Yagya
Performance of the principal Vedic rituals and sacred fire offerings.

Day 3: Purnahuti and Blessings
Completion of the ritual, purnahuti, and concluding prayers.`;

export interface MatchDayHeadingOptions {
  /** True if the parser is currently buffering details inside an active day item */
  isInsideDay?: boolean;
  /** True if the overall input contains explicit "Day <id>" or "Final Day" headings */
  hasExplicitDayHeadings?: boolean;
  /** True if shorthand numbered headings like "1. Title" are explicitly allowed outside day items */
  allowBareNumber?: boolean;
}

/**
 * Matches explicit day headings such as:
 * - "Day 1: Title", "Day 1 - Title", "Day 1. Title", "Day 1 Title", "Day 1"
 * - "Day Final: Title", "Day One: Title"
 * - "Final Day: Title", "Final Day - Title", "Final Day"
 *
 * Ordinary numbered detail lines (e.g. "1. Light lamp", "2. Chant mantras")
 * appearing inside day details or when explicit Day headings are present are NOT
 * treated as day headings, ensuring numbered detail lists are preserved in order.
 */
export function matchDayHeading(
  line: string,
  options?: MatchDayHeadingOptions
): { day: number | string; title: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // 1. "Day <digits> [:.-] <Title>" or "Day <digits> <Title>" or "Day <digits>"
  const dayNumMatch = trimmed.match(/^Day\s+(\d+)(?:\s*[:\-\.]\s*(.*)|\s+(.*)|$)/i);
  if (dayNumMatch) {
    const day = Number(dayNumMatch[1]);
    const rawTitle = (dayNumMatch[2] !== undefined ? dayNumMatch[2] : dayNumMatch[3] || "").trim();
    return { day, title: rawTitle };
  }

  // 2. "Day <identifier> [:.-] <Title>" (requires separator for words so normal prose like "Day by day" isn't a heading)
  const dayWordMatch = trimmed.match(/^Day\s+([A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?)\s*[:\-\.]\s*(.*)$/i);
  if (dayWordMatch) {
    const rawDay = dayWordMatch[1].trim();
    const rawTitle = dayWordMatch[2].trim();
    const num = Number(rawDay);
    const day = !isNaN(num) && /^\d+$/.test(rawDay) ? num : rawDay;
    return { day, title: rawTitle };
  }

  // 3. "Final Day [:.-] <Title>" or "Final Day <Title>" or "Final Day"
  const finalDayMatch = trimmed.match(/^Final\s+Day(?:\s*[:\-\.]\s*(.*)|\s+(.*)|$)/i);
  if (finalDayMatch) {
    const rawTitle = (finalDayMatch[1] !== undefined ? finalDayMatch[1] : finalDayMatch[2] || "").trim();
    return { day: "Final", title: rawTitle };
  }

  // 4. Shorthand numbered headings like "1. Title", "1: Title", "1 - Title"
  // Never match if inside an existing day item or if the document uses explicit Day headings.
  if (options?.allowBareNumber && !options?.isInsideDay && !options?.hasExplicitDayHeadings) {
    const numberedMatch = trimmed.match(/^(\d+)[\.\:\-]\s+(.*)$/);
    if (numberedMatch) {
      const num = Number(numberedMatch[1]);
      return { day: num, title: numberedMatch[2].trim() };
    }
  }

  return null;
}

/**
 * Parses multiline daily schedule text into schedule items.
 * Safeguards:
 * - Explicit Day headings ("Day N: Title", "Final Day: Title") take precedence.
 * - Numbered detail lines inside day items remain associated with the day item's details.
 * - Non-empty lines before the first day heading trigger an explicit warning.
 * - Blank lines between records are ignored.
 * - Missing titles on day headings trigger warnings.
 * - Multiple detail lines are preserved and combined.
 */
export function parseDailyScheduleText(text: string): ParseDailyScheduleResult {
  if (!text.trim()) {
    return { items: [], warnings: [], unrecognizedLines: [] };
  }

  const rawLines = text.split(/\r?\n/);
  const items: ParsedSchedulePreviewItem[] = [];
  const warnings: string[] = [];
  const unrecognizedLines: string[] = [];

  // Determine if input contains any explicit "Day <digits|word>" or "Final Day" headings
  const hasExplicitDayHeadings = rawLines.some((l) => {
    const t = l.trim();
    return Boolean(
      t.match(/^Day\s+(\d+|[A-Za-z0-9]+)/i) ||
      t.match(/^Final\s+Day/i)
    );
  });

  let currentItem: ParsedSchedulePreviewItem | null = null;
  let currentDetails: string[] = [];

  const commitCurrentItem = () => {
    if (currentItem) {
      currentItem.details = currentDetails.join("\n").trim();
      items.push(currentItem);
      currentItem = null;
      currentDetails = [];
    }
  };

  for (let idx = 0; idx < rawLines.length; idx++) {
    const rawLine = rawLines[idx];
    const trimmed = rawLine.trim();

    if (!trimmed) continue;

    const heading = matchDayHeading(trimmed, {
      isInsideDay: currentItem !== null,
      hasExplicitDayHeadings,
    });

    if (heading) {
      commitCurrentItem();
      if (!heading.title) {
        warnings.push(`Day ${heading.day} heading is missing a title.`);
      }
      currentItem = {
        id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        day: heading.day,
        title: heading.title,
        details: "",
      };
    } else {
      if (currentItem) {
        currentDetails.push(trimmed);
      } else {
        unrecognizedLines.push(trimmed);
        warnings.push(
          `Unrecognized text before first day heading: "${
            trimmed.length > 60 ? trimmed.substring(0, 57) + "..." : trimmed
          }"`
        );
      }
    }
  }

  commitCurrentItem();

  return { items, warnings, unrecognizedLines };
}

export default function BulkDailyScheduleModal({
  isOpen,
  onClose,
  existingCount = 0,
  onApply,
}: BulkDailyScheduleModalProps) {
  const [rawText, setRawText] = useState("");
  const [items, setItems] = useState<ParsedSchedulePreviewItem[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [unrecognizedLines, setUnrecognizedLines] = useState<string[]>([]);
  const [mode, setMode] = useState<"append" | "replace">("append");
  const [hasInput, setHasInput] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setRawText("");
      setItems([]);
      setWarnings([]);
      setUnrecognizedLines([]);
      setHasInput(false);
      setMode("append");
    }
  }, [isOpen]);

  // Synchronize parsing when raw text changes
  useEffect(() => {
    if (rawText.trim()) {
      const result = parseDailyScheduleText(rawText);
      setItems(result.items);
      setWarnings(result.warnings);
      setUnrecognizedLines(result.unrecognizedLines);
      setHasInput(true);
    } else {
      setItems([]);
      setWarnings([]);
      setUnrecognizedLines([]);
      setHasInput(false);
    }
  }, [rawText]);

  const handleLoadSample = () => {
    setRawText(SAMPLE_DAILY_SCHEDULE_TEXT);
  };

  const handleClear = () => {
    setRawText("");
    setItems([]);
    setWarnings([]);
    setUnrecognizedLines([]);
    setHasInput(false);
  };

  const handleUpdateDay = (id: string, val: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const num = Number(val);
        const day = !isNaN(num) && /^\d+$/.test(val.trim()) ? num : val;
        return { ...item, day };
      })
    );
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title } : item))
    );
  };

  const handleUpdateDetails = (id: string, details: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, details } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = () => {
    const nextDayNum = items.length + 1;
    setItems((prev) => [
      ...prev,
      {
        id: `sched-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        day: nextDayNum,
        title: "",
        details: "",
      },
    ]);
  };

  // Validation
  const hasMissingTitles = items.some((i) => !i.title.trim());
  const hasMissingDays = items.some((i) => String(i.day).trim().length === 0);
  const hasUnrecognized = unrecognizedLines.length > 0;
  const canApply =
    items.length > 0 &&
    !hasMissingTitles &&
    !hasMissingDays &&
    !hasUnrecognized;

  const validCount = items.filter(
    (i) => i.title.trim().length > 0 && String(i.day).trim().length > 0
  ).length;

  const handleApply = () => {
    if (!canApply) return;

    const formatted: YagyaDailyScheduleItem[] = items.map((item) => {
      const num = Number(item.day);
      return {
        day: !isNaN(num) && /^\d+$/.test(String(item.day).trim()) ? num : String(item.day).trim(),
        title: item.title.trim(),
        details: item.details.trim(),
      };
    });

    onApply(formatted, mode);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Add Daily Schedule (Itinerary)"
      size="lg"
    >
      <div className="space-y-3.5">
        {/* Compact helper info bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-cream-50 rounded-lg border border-cream-200">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
            <span>
              Format: <strong>Day N: Title</strong> followed by details. Multi-line details and blank lines are handled automatically.
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
              Paste Schedule Text
            </label>
            {items.length > 0 && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  canApply
                    ? "text-saffron-700 bg-saffron-50 border-saffron-200"
                    : "text-amber-700 bg-amber-50 border-amber-200"
                }`}
              >
                {validCount} of {items.length} valid {items.length === 1 ? "day" : "days"}
              </span>
            )}
          </div>
          <textarea
            rows={4}
            className="input-field text-xs font-mono leading-relaxed resize-y py-2"
            placeholder={`Paste schedule text here...&#10;e.g.&#10;Day 1: Sankalpa and Preparation&#10;Preparation of the ritual area and initial sankalpa.&#10;&#10;Day 2: Main Yagya&#10;Performance of the principal sacred fire offerings.`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        </div>

        {/* Warnings / Error feedback box */}
        {hasInput && (hasUnrecognized || warnings.length > 0) && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {hasUnrecognized
                  ? "Parsing Warning: Unassociated text detected"
                  : "Parsing Notifications"}
              </span>
            </div>
            {hasUnrecognized && (
              <p className="text-[11px] text-amber-800">
                Text was found before the first <strong>Day N:</strong> heading. Please add a valid day heading before it or remove it from the paste box before applying.
              </p>
            )}
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 pl-1">
              {warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Warning if input provided but zero items extracted */}
        {hasInput && items.length === 0 && !hasUnrecognized && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              No schedule days detected. Please ensure headings follow <strong>Day 1: Title</strong> format.
            </span>
          </div>
        )}

        {/* Parsed Preview & Staging Area */}
        {items.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-cream-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                Parsed Schedule Preview ({items.length} {items.length === 1 ? "Day" : "Days"})
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Day
              </button>
            </div>

            <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-cream-50/70 border border-cream-200 space-y-1.5"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-24 shrink-0">
                      <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-0.5">
                        Day
                      </label>
                      <input
                        type="text"
                        className="input-field py-1 text-xs px-2 rounded-lg"
                        placeholder='e.g. 1, "Final"'
                        value={String(item.day)}
                        onChange={(e) => handleUpdateDay(item.id, e.target.value)}
                      />
                    </div>
                    <div className="flex-1 min-w-[160px]">
                      <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-0.5">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`input-field py-1 text-xs px-2.5 rounded-lg ${
                          !item.title.trim()
                            ? "border-amber-400 bg-amber-50/60 focus:border-amber-500"
                            : ""
                        }`}
                        placeholder="Schedule title..."
                        value={item.title}
                        onChange={(e) => handleUpdateTitle(item.id, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-charcoal-300 hover:text-red-500 rounded mt-4 shrink-0 transition"
                      title="Remove this day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-charcoal-500 uppercase tracking-wider block mb-0.5">
                      Details
                    </label>
                    <textarea
                      rows={2}
                      className="input-field py-1 text-xs px-2.5 rounded-lg resize-y font-normal leading-relaxed"
                      placeholder="Activities, rituals, timings, or offerings for this day..."
                      value={item.details}
                      onChange={(e) => handleUpdateDetails(item.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
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
                  name="bulk-mode-daily-schedule"
                  checked={mode === "append"}
                  onChange={() => setMode("append")}
                  className="text-saffron-600 focus:ring-saffron-400"
                />
                <span>
                  Append to existing schedule ({existingCount} existing {existingCount === 1 ? "day" : "days"} preserved)
                </span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-red-600">
                <input
                  type="radio"
                  name="bulk-mode-daily-schedule"
                  checked={mode === "replace"}
                  onChange={() => setMode("replace")}
                  className="text-red-600 focus:ring-red-400"
                />
                <span>Replace entire existing schedule</span>
              </label>
            </div>
            {mode === "replace" && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-700 bg-red-50 p-2 rounded border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Warning: This will overwrite and remove all {existingCount} existing schedule item{existingCount === 1 ? "" : "s"}.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-cream-200">
          <div className="text-[11px] text-charcoal-500">
            {!canApply && items.length > 0 && (
              <span className="text-amber-700">
                {hasUnrecognized
                  ? "Resolve unrecognized text above to enable apply."
                  : hasMissingTitles
                  ? "Provide titles for all schedule items."
                  : hasMissingDays
                  ? "Provide day identifiers for all items."
                  : ""}
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
              {mode === "replace" ? "Replace Schedule with " : "Add "}
              {validCount > 0 ? `${validCount} ` : ""}
              {validCount === 1 ? "Day" : "Days"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

