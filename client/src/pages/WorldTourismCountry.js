import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Tourism.css";

const API = "https://alonpc02026.onrender.com/api/tourism";
const LABELS = {
  app: ["📱 אפליקציות", "app"],
  info: ["ℹ️ מידע", "info"],
  place: ["📍 מקומות מעניינים", "place"],
};

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

export default function WorldTourismCountry() {
  const { countryName } = useParams();
  const country = decodeURIComponent(countryName || "");
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState("app");

  useEffect(() => {
    fetch(`${API}?scope=world&active=true&countryName=${encodeURIComponent(country)}`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [country]);

  const flag = items[0]?.flagEmoji || "🌍";
  const flagImageUrl = items[0]?.flagImageUrl || "";
  const filtered = useMemo(
    () => items.filter((item) => item.category === selected),
    [items, selected]
  );

  return (
    <main className="tourism-page">
      <Link className="tourism-back" to="/tourism-world">← חזרה לכל המדינות</Link>
      <section className="tourism-hero">
        {flagImageUrl ? (
          <img className="tourism-flag-img" src={flagImageUrl} alt={`דגל ${country}`} />
        ) : (
          <span className="tourism-flag" aria-hidden="true">{flag}</span>
        )}
        <h1>{country}</h1>
        <p>אפליקציות, מידע ומקומות מעניינים במדינה.</p>
      </section>

      <div className="tourism-tabs">
        {Object.entries(LABELS).map(([key, [label]]) => (
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
