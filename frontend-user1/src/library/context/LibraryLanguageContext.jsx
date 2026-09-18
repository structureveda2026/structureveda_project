import { createContext, useState } from "react";
import { translations } from "../data/translations";

const LibraryLanguageContext = createContext(null);

const STORAGE_KEY = "veda_library_language";

export const LibraryLanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "hi" || saved === "en" ? saved : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = (lang) => {
    if (lang === "en" || lang === "hi") {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore local storage error
      }
    }
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "hi" : "en";
    setLanguage(next);
  };

  // Translation helper
  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LibraryLanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isHindi: language === "hi",
        t,
      }}
    >
      {children}
    </LibraryLanguageContext.Provider>
  );
};

export default LibraryLanguageContext;
