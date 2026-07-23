import React from "react";
import { useLanguage } from "../context/LanguageContext";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const {
    language,
    setLanguage,
    languages,
    t,
  } = useLanguage();

  return (
    <label className="language-switcher">
      <span>{t("language")}</span>

      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value)
        }
        aria-label={t("language")}
      >
        {Object.entries(languages).map(
          ([code, languageItem]) => (
            <option key={code} value={code}>
              {languageItem.label}
            </option>
          )
        )}
      </select>
    </label>
  );
}

export default LanguageSwitcher;
