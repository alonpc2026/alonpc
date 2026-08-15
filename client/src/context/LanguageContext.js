import { createContext, useContext, useEffect, useMemo, useState } from "react";
import translations from "../translations";

const LanguageContext = createContext(null);

const LOCALES = {
  he: "he-IL",
  en: "en-US",
  ru: "ru-RU",
  ar: "ar",
  am: "am-ET",
  fr: "fr-FR",
  fil: "fil-PH",
  hi: "hi-IN",
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem("language") ||
    localStorage.getItem("lang") ||
    "he"
  );

  const setLanguage = (code) => {
    const next = translations[code] ? code : "he";
    setLanguageState(next);
    localStorage.setItem("language", next);
    localStorage.setItem("lang", next);
    window.dispatchEvent(
      new CustomEvent("alonpc-language-change", {
        detail: { language: next },
      })
    );
  };

  useEffect(() => {
    const onLanguageChange = (event) => {
      const code = event?.detail?.language;
      if (code && translations[code]) {
        setLanguageState(code);
        localStorage.setItem("language", code);
        localStorage.setItem("lang", code);
      }
    };

    window.addEventListener("alonpc-language-change", onLanguageChange);
    return () => window.removeEventListener("alonpc-language-change", onLanguageChange);
  }, []);

  const current = translations[language] || translations.he;
  const dir = current.dir || (language === "he" || language === "ar" ? "rtl" : "ltr");
  const locale = LOCALES[language] || "en-US";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    document.body.dir = dir;
  }, [language, dir]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dir,
      locale,
      t: (key) => current[key] ?? translations.he[key] ?? key,
    }),
    [language, dir, locale, current]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return value;
}
