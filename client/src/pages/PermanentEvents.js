import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./PermanentEvents.css";

const API_BASE = process.env.REACT_APP_API_URL || "https://alonpc02026.onrender.com";

function PermanentEvents() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/permanent-events/active`);
        if (!response.ok) throw new Error("לא ניתן לטעון אירועים קבועים");
        setItems(await response.json());
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
    return items.filter((item) => [item.name, item.city, item.address, item.description, item.accessibility]
      .filter(Boolean).join(" ").toLowerCase().includes(value));
  }, [items, search]);

  return (
    <main className="pe-page" dir="rtl">
      <nav className="permanent-type-switcher" aria-label="בחירת סוג אירועים">
        <Link className="permanent-type-button" to="/israel-events">📅 אירועים רגילים</Link>
        <Link className="permanent-type-button active" to="/permanent-events">📌 אירועים קבועים</Link>
      </nav>
      <header className="pe-hero">
        <span className="pe-icon">📌</span>
        <div>
          <h1>אירועים קבועים ומקומות נגישים</h1>
          <p>רשימת מקומות עם קישור לאתר, מסמך או תוכנייה ופרטי נגישות.</p>
        </div>
      </header>

      <label className="pe-search">חיפוש מקום או עיר
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="לדוגמה: חיפה, תיאטרון..." />
      </label>

      {loading && <p className="pe-status">טוען...</p>}
      {error && <p className="pe-status pe-error">{error}</p>}
      {!loading && !error && filtered.length === 0 && <p className="pe-status">לא נמצאו מקומות מתאימים.</p>}

      <section className="pe-grid" aria-label="אירועים קבועים">
        {filtered.map((item) => (
          <article className="pe-card" key={item._id}>
            {item.image && <img src={item.image} alt={item.name} />}
            <div className="pe-content">
              <h2>{item.name}</h2>
              {(item.city || item.address) && <p><strong>📍 מיקום:</strong> {[item.city, item.address].filter(Boolean).join(", ")}</p>}
              {item.openingHours && <p><strong>🕒 שעות:</strong> {item.openingHours}</p>}
              {item.description && <p>{item.description}</p>}
              {item.accessibility && <p className="pe-access"><strong>♿ נגישות:</strong> {item.accessibility}</p>}
              {item.languages?.length > 0 && <p><strong>🗣️ שפות:</strong> {item.languages.join(" • ")}</p>}
              <div className="pe-actions">
                {item.website && <a href={item.website} target="_blank" rel="noreferrer">🌐 אתר המקום</a>}
                {item.document && <a href={item.document} target="_blank" rel="noreferrer">📄 מסמך / תוכנייה</a>}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default PermanentEvents;
