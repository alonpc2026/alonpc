import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./PermanentEvents.css";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://alonpc02026.onrender.com";

function PermanentEvents() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/permanent-events/active`
        );

        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(
            data.message || "לא ניתן לטעון אירועים קבועים"
          );
        }

        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "אירעה שגיאה");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return items;

    return items.filter((item) =>
      `${item.name || ""} ${item.website || ""}`
        .toLowerCase()
        .includes(value)
    );
  }, [items, search]);

  return (
    <main className="pe-page" dir="rtl">
      <header className="pe-hero">
        <span className="pe-icon" aria-hidden="true">📌</span>

        <div>
          <h1>אירועים קבועים</h1>
          <p>רשימה פשוטה: שם אתר, תמונה וקישור.</p>
        </div>
      </header>

      <div className="pe-top-actions">
        <Link to="/events">← חזרה לאירועים נגישים</Link>
      </div>

      <label className="pe-search">
        חיפוש לפי שם האתר
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="לדוגמה: תיאטרון חיפה"
        />
      </label>

      {loading && <p className="pe-status">טוען...</p>}
      {error && <p className="pe-status pe-error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="pe-status">לא נמצאו אתרים קבועים.</p>
      )}

      <section className="pe-grid" aria-label="אירועים קבועים">
        {filtered.map((item) => (
          <article className="pe-card" key={item._id}>
            {item.image ? (
              <img src={item.image} alt={item.name || "תמונת אתר"} />
            ) : (
              <div className="pe-image-placeholder" aria-hidden="true">
                📌
              </div>
            )}

            <div className="pe-content">
              <h2>{item.name}</h2>

              {item.website ? (
                <a
                  className="pe-site-button"
                  href={item.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  🌐 כניסה לאתר
                </a>
              ) : (
                <p className="pe-no-link">לא הוגדר קישור לאתר</p>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default PermanentEvents;
