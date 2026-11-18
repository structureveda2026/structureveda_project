import { useState } from 'react';
import { Lightbulb, X, Sparkles } from 'lucide-react';
import { promptLibrary } from '../data/prompts';

const PromptLibrary = ({ onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (question) => {
    onSelect(question);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/5 px-4 py-2 text-sm font-medium text-lightgold hover:bg-gold/15 hover:border-gold transition-all duration-300"
      >
        <Lightbulb className="h-4 w-4" />
        Prompt Library
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-2xl border border-gold/30 bg-[#0b0817]/95 p-6 shadow-2xl shadow-purple/30 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <h2 className="font-display text-lg font-semibold text-white">Prompt Library</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-mutedtext hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {promptLibrary.map((prompt) => (
                <button
                  key={prompt.category}
                  onClick={() => handleSelect(prompt.question)}
                  className="w-full text-left rounded-xl border border-gold/20 bg-white/5 px-4 py-3 hover:border-gold/60 hover:bg-gold/10 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-lightgold text-sm">{prompt.category}</span>
                    <span className="text-xs text-mutedtext group-hover:text-gold transition-colors">Use →</span>
                  </div>
                  <p className="mt-1 text-xs text-mutedtext leading-relaxed line-clamp-2">{prompt.question}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptLibrary;
