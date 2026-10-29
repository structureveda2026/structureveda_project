import React, { useState } from "react";
import {
  ListPlus,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface CompactListManagerProps {
  title: string;
  items: string[];
  placeholder?: string;
  isNumbered?: boolean;
  onUpdateItem: (idx: number, value: string) => void;
  onRemoveItem: (idx: number) => void;
  onAddItem: () => void;
  onOpenBulkModal: () => void;
  defaultExpanded?: boolean;
}

export default function CompactListManager({
  title,
  items,
  placeholder = "Enter item details...",
  isNumbered = false,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  onOpenBulkModal,
  defaultExpanded = true,
}: CompactListManagerProps) {
  // If list has more than 4 items, administrators can collapse it to save space
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const handleAdd = () => {
    onAddItem();
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const previewItems = items.slice(0, 3);
  const remainingCount = items.length - 3;

  return (
    <div className="rounded-xl border border-cream-200 bg-cream-50/40 p-3 transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-charcoal-800 uppercase tracking-wider mb-0">
            {title}
          </label>
          <span className="text-[11px] font-semibold text-charcoal-500 bg-white px-2 py-0.5 rounded-full border border-cream-200">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenBulkModal}
            className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 bg-white hover:bg-saffron-50 px-2.5 py-1 rounded-lg border border-saffron-200 transition flex items-center gap-1 shadow-2xs"
            title="Paste multiple items at once"
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Bulk Add</span>
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs font-semibold text-charcoal-700 hover:text-charcoal-900 bg-white hover:bg-cream-100 px-2.5 py-1 rounded-lg border border-cream-200 transition flex items-center gap-1 shadow-2xs"
            title="Add a single row"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          {items.length > 2 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-medium text-charcoal-500 hover:text-charcoal-800 p-1 rounded hover:bg-cream-100 transition"
              title={isExpanded ? "Collapse list" : "Expand all items"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-2.5 px-3 rounded-lg border border-dashed border-cream-300 bg-white/60 text-xs text-charcoal-400">
          No items added yet. Click{" "}
          <strong
            className="text-saffron-600 cursor-pointer hover:underline"
            onClick={onOpenBulkModal}
          >
            Bulk Add
          </strong>{" "}
          to paste multiple lines or{" "}
          <strong
            className="text-charcoal-700 cursor-pointer hover:underline"
            onClick={handleAdd}
          >
            + Add
          </strong>{" "}
          to enter one.
        </div>
      )}

      {/* Collapsed Compact Preview */}
      {!isExpanded && items.length > 0 && (
        <div className="space-y-1 bg-white p-2.5 rounded-lg border border-cream-200 text-xs text-charcoal-700">
          {previewItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 truncate">
              <span className="text-[11px] font-bold text-charcoal-400 w-5 shrink-0 text-center">
                {isNumbered ? `${idx + 1}.` : `•`}
              </span>
              <span className="truncate">{item || <em className="text-charcoal-400">Empty item</em>}</span>
            </div>
          ))}

          {remainingCount > 0 && (
            <div className="pt-1 border-t border-cream-100 flex items-center justify-between text-[11px] text-charcoal-500">
              <span>+{remainingCount} more items...</span>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="font-semibold text-saffron-600 hover:text-saffron-700 hover:underline"
              >
                Expand to Edit
              </button>
            </div>
          )}
        </div>
      )}

      {/* Expanded Editable Rows */}
      {isExpanded && items.length > 0 && (
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 group">
              <span className="text-[11px] font-bold text-charcoal-400 w-6 shrink-0 text-center select-none">
                {isNumbered ? `${idx + 1}.` : `•`}
              </span>
              <input
                type="text"
                className="input-field py-1 text-xs px-2.5 rounded-lg border-cream-200 focus:border-saffron-400 focus:ring-1 focus:ring-saffron-400 bg-white flex-1"
                value={item}
                onChange={(e) => onUpdateItem(idx, e.target.value)}
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => onRemoveItem(idx)}
                className="p-1 text-charcoal-300 hover:text-red-500 rounded transition shrink-0"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
