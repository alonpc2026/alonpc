import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Apps.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3001/api"
    : "https://alonpc02026.onrender.com/api");

const API = `${API_BASE}/mobile-apps`;

export default function Apps() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(API);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן לטעון את האפליקציות");
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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        `${item.name || ""} ${item.description || ""}`
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "android" && item.hasAndroid) ||
        (filter === "iphone" && item.hasIphone);

      return matchesSearch && matchesFilter;
    });
  }, [items, filter, search]);

  return (
    <main className="apps-page" dir="rtl">
      <header className="apps-hero">
        <div>
          <p className="apps-kicker">ALONPC</p>
          <h1>📱 הורדת אפליקציות</h1>
          <p>
            בחרו אפליקציה ל־iPhone או ל־Galaxy ו־Android, והורידו אותה
            ישירות מהחנות המתאימה.
          </p>
        </div>

        <Link className="apps-home-link" to="/">
          חזרה למסך הראשי
        </Link>
      </header>

      <section className="apps-tools" aria-label="חיפוש וסינון אפליקציות">
        <label>
          חיפוש אפליקציה
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="כתבו שם אפליקציה"
          />
        </label>

        <div className="apps-filter-buttons">
          <button
            type="button"
            className={filter === "all" ? "selected" : ""}
            onClick={() => setFilter("all")}
          >
            🌍 הכל
          </button>
          <button
            type="button"
            className={filter === "iphone" ? "selected" : ""}
            onClick={() => setFilter("iphone")}
          >
            🍎 iPhone
          </button>
          <button
            type="button"
            className={filter === "android" ? "selected" : ""}
            onClick={() => setFilter("android")}
          >
            🤖 Galaxy / Android
          </button>
        </div>
      </section>

      {error && <p className="apps-message error">❌ {error}</p>}

      {loading ? (
        <p className="apps-message">טוען אפליקציות...</p>
      ) : filtered.length === 0 ? (
        <section className="apps-empty">
          <h2>עדיין אין אפליקציות להצגה</h2>
          <p>אפשר להוסיף אפליקציות דרך מרכז הניהול.</p>
        </section>
      ) : (
        <section className="apps-grid" aria-label="רשימת אפליקציות">
          {filtered.map((item) => (
            <article
              className={`app-card ${item.featured ? "featured" : ""}`}
              key={item._id}
            >
              <div className="app-image-wrap">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={`סמל ${item.name}`} />
                ) : (
                  <div className="app-placeholder" aria-hidden="true">
                    📱
                  </div>
                )}
              </div>

              <div className="app-card-content">
                <div className="app-card-title">
                  <h2>{item.name}</h2>
                  {item.featured && <span>⭐ מומלץ</span>}
                </div>

                {item.description && <p>{item.description}</p>}

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
                      🍎 הורדה ב־App Store
                    </a>
                  )}

                  {item.hasAndroid && item.androidUrl && (
                    <a
                      className="android-download"
                      href={item.androidUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🤖 הורדה ב־Google Play
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
