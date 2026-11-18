import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
];

const LanguageSelector = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white/5 px-3 py-1.5 text-xs sm:text-sm text-lightgold hover:bg-gold/10 hover:border-gold/50 transition-all"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{selected.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 rounded-xl border border-gold/25 bg-[#0b0817]/95 backdrop-blur-md py-1 z-40 animate-scaleIn shadow-xl shadow-purple/20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelected(lang);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  selected.code === lang.code
                    ? 'text-gold bg-gold/10'
                    : 'text-mutedtext hover:text-white hover:bg-white/5'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
