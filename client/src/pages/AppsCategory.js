import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./AppsCategory.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const TYPES = {
  mobile: { he:"📱 אפליקציות סלולרי", en:"📱 Mobile Apps", ru:"📱 Мобильные приложения", ar:"📱 تطبيقات الهاتف", am:"📱 የሞባይል መተግበሪያዎች" },
  tv: { he:"📺 אפליקציות טלוויזיה חכמה", en:"📺 Smart TV Apps", ru:"📺 Приложения Smart TV", ar:"📺 تطبيقات التلفزيون الذكي", am:"📺 የSmart TV መተግበሪያዎች" },
  windows: { he:"💻 אפליקציות Windows 10-11", en:"💻 Windows 10-11 Apps", ru:"💻 Приложения Windows 10-11", ar:"💻 تطبيقات Windows 10-11", am:"💻 የWindows 10-11 መተግበሪያዎች" },
  mac: { he:"🍎 אפליקציות Mac", en:"🍎 Mac Apps", ru:"🍎 Приложения Mac", ar:"🍎 تطبيقات Mac", am:"🍎 የMac መተግበሪያዎች" },
};

const TEXT = {
  he:{search:"חיפוש אפליקציה...",loading:"טוען אפליקציות...",empty:"עדיין אין אפליקציות בקטגוריה זו.",open:"פתיחת האפליקציה",back:"חזרה לכל האפליקציות"},
  en:{search:"Search apps...",loading:"Loading apps...",empty:"No apps in this category yet.",open:"Open app",back:"Back to all apps"},
  ru:{search:"Поиск приложения...",loading:"Загрузка приложений...",empty:"В этой категории пока нет приложений.",open:"Открыть приложение",back:"Назад ко всем приложениям"},
  ar:{search:"بحث عن تطبيق...",loading:"جارٍ تحميل التطبيقات...",empty:"لا توجد تطبيقات في هذه الفئة بعد.",open:"فتح التطبيق",back:"العودة إلى جميع التطبيقات"},
  am:{search:"መተግበሪያ ፈልግ...",loading:"መተግበሪያዎች በመጫን ላይ...",empty:"በዚህ ምድብ መተግበሪያዎች ገና የሉም።",open:"መተግበሪያውን ክፈት",back:"ወደ ሁሉም መተግበሪያዎች ተመለስ"},
};

export default function AppsCategory() {
  const { type } = useParams();
  const { language, dir } = useLanguage();
  const t = TEXT[language] || TEXT.he;
  const title = TYPES[type]?.[language] || TYPES[type]?.he || "Apps";

  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadApps() {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/mobile-apps?type=${encodeURIComponent(type)}`
        );
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
  }, [type]);

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
    <main className="apps-category-page" dir={dir}>
      <section className="apps-category-hero">
        <h1>{title}</h1>
      </section>

      <div className="apps-category-tools">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.search}
        />
        <Link to="/apps">{t.back}</Link>
      </div>

      {loading && <p className="apps-category-status">{t.loading}</p>}
      {message && <p className="apps-category-status">{message}</p>}
      {!loading && !message && filtered.length === 0 && (
        <p className="apps-category-status">{t.empty}</p>
      )}

      <section className="apps-category-grid">
        {filtered.map((app) => {
          const image = app.imageUrl || app.logoUrl || "";
          const url =
            app.url ||
            app.link ||
            app.websiteUrl ||
            app.storeUrl ||
            app.androidUrl ||
            app.iosUrl ||
            "";

          return (
            <article
              className="apps-category-card"
              key={app._id || app.name || app.title}
            >
              {image ? (
                <img src={image} alt={app.name || app.title || ""} />
              ) : (
                <div className="apps-category-fallback">📲</div>
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
