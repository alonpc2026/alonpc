import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AppsCategory.css";

const API = "https://alonpc02026.onrender.com/api/mobile-apps";

const META = {
  android: { title: "Android / Galaxy", icon: "🤖", aliases: ["android","galaxy","samsung","אנדרואיד","סמסונג"] },
  ios: { title: "iPhone / iOS", icon: "🍎", aliases: ["ios","iphone","apple","אייפון","אפל"] },
  windows: { title: "Windows 10–11", icon: "🪟", aliases: ["windows","windows10","windows11","pc"] },
  mac: { title: "Mac", icon: "💻", aliases: ["mac","macos","apple-mac"] },
  tv: { title: "טלוויזיה חכמה", icon: "📺", aliases: ["tv","smart-tv","smarttv","television","טלוויזיה"] }
};

function norm(value) {
  return String(value || "").trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function getPlatform(item) {
  const raw = norm(
    item.platform || item.type || item.deviceType || item.os ||
    item.system || item.category || item.mobileType || ""
  );

  if (["galaxy","samsung","אנדרואיד","סמסונג"].includes(raw)) return "android";
  if (["iphone","apple","אייפון","אפל"].includes(raw)) return "ios";
  if (["macos","apple-mac"].includes(raw)) return "mac";
  if (["smarttv","smart-tv","television","טלוויזיה"].includes(raw)) return "tv";
  return raw;
}

function getImage(item) {
  return (
    item.imageUrl || item.logoUrl || item.iconUrl ||
    item.image || item.imageLink || item.logo || ""
  );
}

function getLink(item) {
  return (
    item.link || item.url || item.appUrl ||
    item.storeUrl || item.websiteUrl || item.downloadUrl || ""
  );
}

export default function AppsCategory() {
  const { type } = useParams();
  const requested = norm(type);
  const meta = requested === "mobile"
    ? { title: "אפליקציות סלולרי", icon: "📱" }
    : (META[requested] || { title: type || "אפליקציות", icon: "📱" });

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API, { signal: controller.signal });
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "לא ניתן לטעון אפליקציות");
        }

        setItems(Array.isArray(data) ? data : data.apps || data.items || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "לא ניתן לטעון אפליקציות");
        setItems([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      const platform = getPlatform(item);
      if (requested === "mobile") {
        if (!["android", "ios"].includes(platform)) return false;
      } else if (platform !== requested) {
        return false;
      }

      const text = [
        item.name, item.title, item.description
      ].filter(Boolean).join(" ").toLowerCase();

      return !q || text.includes(q);
    });
  }, [items, requested, search]);

  return (
    <main className="apps-category-page" dir="rtl">
      <header className="apps-category-hero">
        <span>{meta.icon}</span>
        <div>
          <h1>{meta.title}</h1>
          <p>אפליקציות ששויכו למערכת הזו.</p>
        </div>
      </header>

      <section className="apps-category-tools">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`🔎 חיפוש בתוך ${meta.title}...`}
        />
        {requested !== "mobile" && (
          <Link to="/apps/mobile">📱 חזרה לאפליקציות סלולרי</Link>
        )}
      </section>

      {loading && <p className="apps-category-status">טוען...</p>}
      {error && <p className="apps-category-status error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <section className="apps-category-empty">
          <h2>{meta.icon} {meta.title}</h2>
          <p>אין כרגע אפליקציות בתחום הזה.</p>
        </section>
      )}

      <section className="apps-category-grid">
        {filtered.map((item) => {
          const image = getImage(item);
          const link = getLink(item);

          return (
            <article className="apps-category-card" key={item._id || item.id || item.name}>
              <div className="apps-category-image">
                {image ? (
                  <img
                    src={image}
                    alt={item.name || item.title || ""}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.nextElementSibling;
                      if (fallback) fallback.style.display = "grid";
                    }}
                  />
                ) : null}

                <div
                  className="apps-category-image-fallback"
                  style={{ display: image ? "none" : "grid" }}
                >
                  {meta.icon}
                </div>
              </div>

              <div className="apps-category-card-body">
                <h2>{item.name || item.title || "אפליקציה"}</h2>
                {item.description && <p>{item.description}</p>}

                {link && (
                  <a href={link} target="_blank" rel="noreferrer">
                    🔗 פתיחת האפליקציה
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
