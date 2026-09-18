import { Globe } from "lucide-react";
import { useLibraryLanguage } from "../context/useLibraryLanguage";

const LanguageSwitcher = ({ variant = "default", className = "" }) => {
  const { setLanguage, isHindi } = useLibraryLanguage();

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center rounded-full border border-[#e5d8c0] bg-white/90 p-0.5 shadow-sm backdrop-blur-sm ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider transition-all ${
            !isHindi
              ? "bg-[#c88918] text-white shadow-sm"
              : "text-[#6b5e4f] hover:text-[#2b241d]"
          }`}
          title="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider transition-all ${
            isHindi
              ? "bg-[#c88918] text-white shadow-sm"
              : "text-[#6b5e4f] hover:text-[#2b241d]"
          }`}
          title="हिन्दी में पढ़ें"
        >
          हिन्दी
        </button>
      </div>
    );
  }

  // Premium Pill button with icon
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#e2cca4] bg-[#fffaf0] p-1 shadow-sm transition-all hover:border-[#c88918] ${className}`}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#faedd4] text-[#a46c10]">
        <Globe size={13} strokeWidth={2.2} />
      </div>

      <div className="flex items-center gap-1 pr-1">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`rounded-full px-3 py-1 text-[12px] font-medium transition-all ${
            !isHindi
              ? "bg-[#c88918] font-semibold text-white shadow-[0_2px_8px_rgba(200,137,24,0.3)]"
              : "text-[#6b5e4f] hover:text-[#2b241d]"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`rounded-full px-3 py-1 text-[12px] font-medium transition-all ${
            isHindi
              ? "bg-[#c88918] font-semibold text-white shadow-[0_2px_8px_rgba(200,137,24,0.3)]"
              : "text-[#6b5e4f] hover:text-[#2b241d]"
          }`}
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
