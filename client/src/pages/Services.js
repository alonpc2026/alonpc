import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [signOnly, setSignOnly] = useState(false);
  const [transcriptionOnly, setTranscriptionOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/services`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error("לא ניתן לטעון שירותים");
        setServices(Array.isArray(data) ? data.filter((item) => item.active !== false) : []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [...new Set(services.map((item) => item.category).filter(Boolean))].sort(),
    [services]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter((item) => {
      const text = `${item.name || ""} ${item.businessName || ""} ${item.category || ""} ${item.description || ""} ${item.city || ""}`.toLowerCase();
      return (!q || text.includes(q)) &&
        (!category || item.category === category) &&
        (!signOnly || item.supportsSignLanguage) &&
        (!transcriptionOnly || item.supportsTranscription);
    });
  }, [services, search, category, signOnly, transcriptionOnly]);

  return (
    <main className="services-accessible-page" dir="rtl">
      <header>
        <h1>מאגר שירותים נגישים</h1>
        <p>חיפוש עסקים ושירותים התומכים באנשים עם מוגבלות.</p>
      </header>

      <section className="services-accessible-filters">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש שירות, עסק או עיר" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">כל הקטגוריות</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <label><input type="checkbox" checked={signOnly} onChange={(e) => setSignOnly(e.target.checked)} /> שפת סימנים</label>
        <label><input type="checkbox" checked={transcriptionOnly} onChange={(e) => setTranscriptionOnly(e.target.checked)} /> תמלול</label>
      </section>

      {loading && <p className="services-accessible-status">טוען שירותים...</p>}
      {error && <p className="services-accessible-status error">{error}</p>}

      <section className="services-accessible-grid">
        {!loading && !error && filtered.map((item) => (
          <article key={item._id}>
            {(item.imageUrl || item.logoUrl) && <img src={item.imageUrl || item.logoUrl} alt={item.name} />}
            <div>
              <h2>{item.name}</h2>
              <p className="category">{item.category}</p>
              {item.businessName && <p><strong>שם העסק:</strong> {item.businessName}</p>}
              {item.description && <p className="description">{item.description}</p>}
              <p className="location">📍 {item.city || "ללא עיר"} {item.address && `· ${item.address}`}</p>
              {item.phone && <a className="phone" href={`tel:${item.phone}`}>📱 {item.phone}</a>}
              <div className="badges">
                {item.supportsSignLanguage && <span>🤟 תרגום לשפת סימנים</span>}
                {item.supportsTranscription && <span>📝 תמלול</span>}
              </div>
              <div className="actions">
                <Link to={`/service/${item._id}`}>פרטי השירות</Link>
                {(item.link || item.websiteUrl) && <a href={item.link || item.websiteUrl} target="_blank" rel="noreferrer">מעבר לעסק</a>}
              </div>
            </div>
          </article>
        ))}
      </section>

      {!loading && !error && filtered.length === 0 && (
        <p className="services-accessible-status">לא נמצאו שירותים מתאימים.</p>
      )}
    </main>
  );
}

export default Services;
