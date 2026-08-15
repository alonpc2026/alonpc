import { useLanguage } from "../context/LanguageContext";
import "./LanguageSwitcher.css";

const LANGUAGES = [
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "am", label: "አማርኛ", flag: "🇪🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "fil", label: "Filipino", flag: "🇵🇭" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      className="language-switcher"
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
      aria-label="Language"
    >
      {LANGUAGES.map((item) => (
        <option key={item.code} value={item.code}>
          {item.flag} {item.label}
        </option>
      ))}
    </select>
  );
}
