import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./MobileApps.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const TEXT = {
  he: {
    title: "📱 אפליקציות סלולרי",
    subtitle: "האפליקציות שכבר נבנו אצלך עברו לכאן: iPhone, Galaxy ו-Android",
    search: "חיפוש אפליקציה...",
    loading: "טוען אפליקציות...",
    empty: "עדיין אין אפליקציות להצגה.",
    open: "פתיחת האפליקציה",
    back: "חזרה לכל סוגי האפליקציות",
  },
  en: {
    title: "📱 Mobile Apps",
    subtitle: "Your existing apps are now here: iPhone, Galaxy and Android",
    search: "Search apps...",
    loading: "Loading apps...",
    empty: "No apps to display yet.",
    open: "Open app",
    back: "Back to all app types",
  },
  ru: {
    title: "📱 Мобильные приложения",
    subtitle: "Ваши готовые приложения теперь находятся здесь: iPhone, Galaxy и Android",
    search: "Поиск приложения...",
    loading: "Загрузка приложений...",
    empty: "Пока нет приложений.",
    open: "Открыть приложение",
    back: "Назад ко всем типам приложений",
  },
  ar: {
    title: "📱 تطبيقات الهاتف",
    subtitle: "التطبيقات الموجودة أصبحت هنا: iPhone وGalaxy وAndroid",
    search: "بحث عن تطبيق...",
    loading: "جارٍ تحميل التطبيقات...",
    empty: "لا توجد تطبيقات للعرض بعد.",
    open: "فتح التطبيق",
    back: "العودة إلى جميع أنواع التطبيقات",
  },
  am: {
    title: "📱 የሞባይል መተግበሪያዎች",
    subtitle: "ቀድሞ የተዘጋጁት መተግበሪያዎች እዚህ ተዘዋውረዋል፦ iPhone፣ Galaxy እና Android",
    search: "መተግበሪያ ፈልግ...",
    loading: "መተግበሪያዎች በመጫን ላይ...",
    empty: "እስካሁን የሚታዩ መተግበሪያዎች የሉም።",
    open: "መተግበሪያውን ክፈት",
    back: "ወደ ሁሉም የመተግበሪያ አይነቶች ተመለስ",
  },
};

export default function MobileApps() {
  const { language, dir } = useLanguage();
  const t = TEXT[language] || TEXT.he;
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadApps() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/mobile-apps?type=mobile`);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data?.message || "Load failed");
        }

        if (active) {
          setApps(Array.isArray(data) ? data : data.apps || []);
          setMessage("");
        }
      } catch (error) {
        if (active) {
          setApps([]);
          setMessage(error.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadApps();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return apps;

    return apps.filter((app) =>
      `${app.name || ""} ${app.title || ""} ${app.description || ""} ${app.platform || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [apps, search]);

  return (
    <main className="mobile-apps-page" dir={dir}>
      <section className="mobile-apps-hero">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <div className="mobile-apps-tools">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
        />
        <Link to="/apps">{t.back}</Link>
      </div>

      {loading && <p className="mobile-apps-status">{t.loading}</p>}
      {message && <p className="mobile-apps-status">{message}</p>}
      {!loading && !message && filtered.length === 0 && (
        <p className="mobile-apps-status">{t.empty}</p>
      )}

      <section className="mobile-apps-grid">
        {filtered.map((app) => {
          const url =
            app.url ||
            app.link ||
            app.websiteUrl ||
            app.storeUrl ||
            app.androidUrl ||
            app.iosUrl ||
            "";

          return (
            <article className="mobile-app-card" key={app._id || app.name || app.title}>
              {app.imageUrl || app.logoUrl ? (
                <img src={app.imageUrl || app.logoUrl} alt={app.name || app.title || ""} />
              ) : (
                <div className="mobile-app-fallback">📱</div>
              )}

              <h2>{app.name || app.title || "App"}</h2>
              {app.platform && <strong>{app.platform}</strong>}
              {app.description && <p>{app.description}</p>}

              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {t.open}
                </a>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
