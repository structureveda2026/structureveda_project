import React from "react";
import { Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
import type { PadapathaItem } from "../types/veda.types";

interface PadapathaEditorProps {
  items: PadapathaItem[];
  onChange: (items: PadapathaItem[]) => void;
}

export const PadapathaEditor: React.FC<PadapathaEditorProps> = ({
  items = [],
  onChange,
}) => {
  const handleAddItem = () => {
    onChange([...items, { word: "", meaning: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const handleChange = (
    index: number,
    field: "word" | "meaning",
    value: string
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-3 bg-cream-50/50 p-4 rounded-xl border border-cream-200">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-charcoal-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>पदच्छेद एवं पदार्थ (Word-by-Word Breakdown / Padapatha)</span>
          </label>
          <p className="text-[11px] text-charcoal-400 mt-0.5">
            मंत्र के प्रत्येक पद (शब्द) और उसका हिंदी अर्थ जोड़ें।
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold transition-all shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>नया पद जोड़ें</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center text-xs text-charcoal-400 border border-dashed border-cream-300 rounded-lg bg-white/70">
          कोई पदच्छेद नहीं जोड़ा गया। "नया पद जोड़ें" पर क्लिक करके शब्दार्थ दर्ज करें।
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-cream-200 shadow-2xs"
            >
              <span className="text-[11px] font-bold text-saffron-700 w-6 text-center">
                #{idx + 1}
              </span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={item.word}
                    onChange={(e) => handleChange(idx, "word", e.target.value)}
                    placeholder="पद / शब्द (e.g. अ॒ग्निम्)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={item.meaning}
                    onChange={(e) => handleChange(idx, "meaning", e.target.value)}
                    placeholder="अर्थ (e.g. अग्निदेव को)"
                    className="w-full px-3 py-1.5 rounded-lg text-xs border border-cream-200 focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-1.5 text-charcoal-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                title="हटाएं"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PadapathaEditor;
