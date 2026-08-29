import { useEffect, useMemo, useState } from "react";
import "./Tourism.css";

const API = "https://alonpc02026.onrender.com/api/tourism";
const CATEGORIES = [
  ["app", "📱 אפליקציות תיירות בארץ"],
  ["restaurant", "🍽️ מסעדות"],
  ["cafe", "☕ בתי קפה"],
  ["fastFood", "🍔 מזון מהיר"],
  ["place", "📍 מקומות מעניינים"],
  ["info", "ℹ️ מידע"],
];

function ItemCard({ item }) {
  return (
    <article className="tourism-item-card">
      {item.imageUrl && <img className="tourism-item-image" src={item.imageUrl} alt="" />}
      <h3>{item.title}</h3>
      {item.city && <div className="tourism-city">📍 {item.city}</div>}
      {item.description && <p>{item.description}</p>}
      {item.url && (
        <a className="tourism-link" href={item.url} target="_blank" rel="noopener noreferrer">
          פתיחה
        </a>
      )}
    </article>
  );
}

export default function IsraelTourism() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("app");

  useEffect(() => {
    fetch(`${API}?scope=israel&active=true`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => item.category === selected),
    [items, selected]
  );

  return (
    <main className="tourism-page">
      <section className="tourism-hero">
        <span className="tourism-flag" aria-hidden="true">🇮🇱</span>
        <h1>תיירות בארץ</h1>
        <p>אפליקציות, אוכל, מקומות מעניינים ומידע שימושי לתיירות בישראל.</p>
      </section>

      <div className="tourism-tabs">
        {CATEGORIES.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`tourism-tab ${selected === key ? "active" : ""}`}
            onClick={() => setSelected(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="tourism-empty">אין עדיין פריטים בקטגוריה הזו.</div>
      ) : (
        <section className="tourism-item-grid">
          {filtered.map((item) => <ItemCard key={item._id} item={item} />)}
        </section>
      )}
    </main>
  );
}
