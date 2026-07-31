import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Apps.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3001/api"
    : "https://alonpc02026.onrender.com/api");

const API = `${API_BASE}/mobile-apps`;

const LANGUAGES = [
  { code: "he", label: "עברית", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "am", label: "አማርኛ", dir: "ltr" },
];

const UI = {
  he: {
    title: "📱 הורדת אפליקציות",
    subtitle: "בחרו אפליקציה ל־iPhone או ל־Galaxy ו־Android והורידו אותה ישירות מהחנות.",
    home: "חזרה למסך הראשי",
    searchLabel: "חיפוש אפליקציה",
    searchPlaceholder: "כתבו שם אפליקציה",
    all: "🌍 הכל",
    iphone: "🍎 iPhone",
    android: "🤖 Galaxy / Android",
    loading: "טוען אפליקציות...",
    emptyTitle: "עדיין אין אפליקציות להצגה",
    emptyText: "אפשר להוסיף אפליקציות דרך מרכז הניהול.",
    recommended: "⭐ מומלץ",
    appStore: "🍎 הורדה ב־App Store",
    googlePlay: "🤖 הורדה ב־Google Play",
    missingName: "שם האפליקציה עדיין לא תורגם",
    missingDescription: "תיאור האפליקציה עדיין לא תורגם לעברית",
  },
  en: {
    title: "📱 Download Apps",
    subtitle: "Choose an app for iPhone or Galaxy / Android and download it directly from the store.",
    home: "Back to Home",
    searchLabel: "Search Apps",
    searchPlaceholder: "Type an app name",
    all: "🌍 All",
    iphone: "🍎 iPhone",
    android: "🤖 Galaxy / Android",
    loading: "Loading apps...",
    emptyTitle: "No apps to display yet",
    emptyText: "Apps can be added from the admin portal.",
    recommended: "⭐ Recommended",
    appStore: "🍎 Download on App Store",
    googlePlay: "🤖 Download on Google Play",
    missingName: "App name is not translated yet",
    missingDescription: "The app description is not translated into English yet",
  },
  ru: {
    title: "📱 Скачать приложения",
    subtitle: "Выберите приложение для iPhone или Galaxy / Android и скачайте его из магазина.",
    home: "Назад на главную",
    searchLabel: "Поиск приложения",
    searchPlaceholder: "Введите название приложения",
    all: "🌍 Все",
    iphone: "🍎 iPhone",
    android: "🤖 Galaxy / Android",
    loading: "Загрузка приложений...",
    emptyTitle: "Приложений пока нет",
    emptyText: "Добавить приложения можно через панель управления.",
    recommended: "⭐ Рекомендуем",
    appStore: "🍎 Скачать в App Store",
    googlePlay: "🤖 Скачать в Google Play",
    missingName: "Название приложения ещё не переведено",
    missingDescription: "Описание приложения ещё не переведено на русский язык",
  },
  ar: {
    title: "📱 تنزيل التطبيقات",
    subtitle: "اختر تطبيقًا لـ iPhone أو Galaxy / Android وقم بتنزيله مباشرة من المتجر.",
    home: "العودة إلى الصفحة الرئيسية",
    searchLabel: "البحث عن تطبيق",
    searchPlaceholder: "اكتب اسم التطبيق",
    all: "🌍 الكل",
    iphone: "🍎 iPhone",
    android: "🤖 Galaxy / Android",
    loading: "جارٍ تحميل التطبيقات...",
    emptyTitle: "لا توجد تطبيقات للعرض بعد",
    emptyText: "يمكن إضافة التطبيقات من بوابة الإدارة.",
    recommended: "⭐ موصى به",
    appStore: "🍎 تنزيل من App Store",
    googlePlay: "🤖 تنزيل من Google Play",
    missingName: "اسم التطبيق لم يُترجم بعد",
    missingDescription: "وصف التطبيق لم يُترجم إلى العربية بعد",
  },
  am: {
    title: "📱 መተግበሪያዎችን ያውርዱ",
    subtitle: "ለ iPhone ወይም Galaxy / Android መተግበሪያ ይምረጡና ከመደብሩ ያውርዱ።",
    home: "ወደ መነሻ ተመለስ",
    searchLabel: "መተግበሪያ ፈልግ",
    searchPlaceholder: "የመተግበሪያውን ስም ይጻፉ",
    all: "🌍 ሁሉም",
    iphone: "🍎 iPhone",
    android: "🤖 Galaxy / Android",
    loading: "መተግበሪያዎች በመጫን ላይ...",
    emptyTitle: "እስካሁን መተግበሪያ የለም",
    emptyText: "መተግበሪያዎችን ከአስተዳደር ገጽ ማከል ይቻላል።",
    recommended: "⭐ የሚመከር",
    appStore: "🍎 ከ App Store ያውርዱ",
    googlePlay: "🤖 ከ Google Play ያውርዱ",
    missingName: "የመተግበሪያው ስም ገና አልተተረጎመም",
    missingDescription: "የመተግበሪያው መግለጫ ገና ወደ አማርኛ አልተተረጎመም",
  },
};

function initialLanguage() {
  const saved =
    localStorage.getItem("language") ||
    localStorage.getItem("lang") ||
    localStorage.getItem("alonpc-language");

  return LANGUAGES.some((item) => item.code === saved) ? saved : "he";
}

function localized(item, language, ui) {
  if (language === "he") {
    return {
      name: item.name || ui.missingName,
      description: item.description || ui.missingDescription,
      descriptionMissing: !item.description,
    };
  }

  const translated = item.translations?.[language] || {};

  return {
    name: translated.name || ui.missingName,
    description: translated.description || ui.missingDescription,
    descriptionMissing: !translated.description,
  };
}

export default function Apps() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState(initialLanguage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const languageInfo =
    LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];
  const t = UI[language] || UI.he;

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(API);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "Unable to load apps");
      }

      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function selectLanguage(code) {
    setLanguage(code);
    localStorage.setItem("alonpc-language", code);
    localStorage.setItem("language", code);
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const content = localized(item, language, t);

      const matchesSearch =
        !query ||
        `${content.name} ${content.description}`.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "android" && item.hasAndroid) ||
        (filter === "iphone" && item.hasIphone);

      return matchesSearch && matchesFilter;
    });
  }, [items, filter, search, language, t]);

  return (
    <main className="apps-page" dir={languageInfo.dir}>
      <nav className="apps-language-bar" aria-label="Language">
        {LANGUAGES.map((item) => (
          <button
            key={item.code}
            type="button"
            className={language === item.code ? "selected" : ""}
            onClick={() => selectLanguage(item.code)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <header className="apps-hero">
        <div>
          <p className="apps-kicker">ALONPC</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <Link className="apps-home-link" to="/">
          {t.home}
        </Link>
      </header>

      <section className="apps-tools" aria-label={t.searchLabel}>
        <label>
          {t.searchLabel}
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.searchPlaceholder}
          />
        </label>

        <div className="apps-filter-buttons">
          <button
            type="button"
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            {t.all}
          </button>
          <button
            type="button"
            className={filter === "iphone" ? "selected" : ""}
            onClick={() => setFilter("iphone")}
          >
            {t.iphone}
          </button>
          <button
            type="button"
            className={filter === "android" ? "selected" : ""}
            onClick={() => setFilter("android")}
          >
            {t.android}
          </button>
        </div>
      </section>

      {error && <p className="apps-message error">❌ {error}</p>}

      {loading ? (
        <p className="apps-message">{t.loading}</p>
      ) : filtered.length === 0 ? (
        <section className="apps-empty">
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyText}</p>
        </section>
      ) : (
        <section className="apps-grid" aria-label={t.title}>
          {filtered.map((item) => {
            const content = localized(item, language, t);

            return (
              <article
                className={`app-card ${item.featured ? "featured" : ""}`}
                key={item._id}
              >
                <div className="app-image-wrap">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={content.name} />
                  ) : (
                    <div className="app-placeholder" aria-hidden="true">
                      📱
                    </div>
                  )}
                </div>

                <div className="app-card-content">
                  <div className="app-card-title">
                    <h2>{content.name}</h2>
                    {item.featured && <span>{t.recommended}</span>}
                  </div>

                  {content.description && (
                    <p className={content.descriptionMissing ? "translation-missing" : ""}>
                      {content.description}
                    </p>
                  )}

                  <div className="app-platforms">
                    {item.hasIphone && <span>🍎 iPhone</span>}
                    {item.hasAndroid && <span>🤖 Android</span>}
                  </div>

                  <div className="app-download-buttons">
                    {item.hasIphone && item.iphoneUrl && (
                      <a
                        className="iphone-download"
                        href={item.iphoneUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.appStore}
                      </a>
                    )}

                    {item.hasAndroid && item.androidUrl && (
                      <a
                        className="android-download"
                        href={item.androidUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.googlePlay}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
