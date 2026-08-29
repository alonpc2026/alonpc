import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Tourism.css";

const API = "https://alonpc02026.onrender.com/api/tourism";

export default function WorldTourism() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}?scope=world&active=true`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const countries = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      const name = (item.countryName || "").trim();
      if (!name) return;
      if (!map.has(name)) {
        map.set(name, {
          name,
          flagEmoji: item.flagEmoji || "🌍",
          flagImageUrl: item.flagImageUrl || "",
          count: 0,
        });
      }
      map.get(name).count += 1;
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "he"));
  }, [items]);

  return (
    <main className="tourism-page">
      <section className="tourism-hero">
        <h1>🌍 תיירות עולם</h1>
        <p>בחרו מדינה וקבלו אפליקציות, מידע ומקומות מעניינים.</p>
      </section>

      {loading ? (
        <div className="tourism-empty">טוען...</div>
      ) : countries.length === 0 ? (
        <div className="tourism-empty">עדיין לא נוספו מדינות.</div>
      ) : (
        <section className="tourism-country-grid">
          {countries.map((country) => (
            <Link
              key={country.name}
              to={`/tourism-world/${encodeURIComponent(country.name)}`}
              className="tourism-country-card"
            >
              {country.flagImageUrl ? (
                <img className="tourism-flag-img" src={country.flagImageUrl} alt={`דגל ${country.name}`} />
              ) : (
                <span className="tourism-flag" aria-hidden="true">{country.flagEmoji || "🌍"}</span>
              )}
              <strong>{country.name}</strong>
              <small>{country.count} פריטים</small>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
