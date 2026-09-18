import { useContext } from "react";
import LibraryLanguageContext from "./LibraryLanguageContext";

export const useLibraryLanguage = () => {
  const context = useContext(LibraryLanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      isHindi: false,
      t: (k) => k,
    };
  }
  return context;
};

export default useLibraryLanguage;
