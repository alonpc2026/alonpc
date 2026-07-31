import { useEffect, useMemo, useState } from "react";
import "./Government.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001/api"
    : "https://alonpc02026.onrender.com/api");

function whatsappUrl(number) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits.startsWith("0") ? `972${digits.slice(1)}` : digits}`;
}

function accessibleHref(item) {
  if (!item.accessiblePhone) return "";
  if (item.accessiblePhoneType === "WhatsApp") return whatsappUrl(item.accessiblePhone);
  if (item.accessiblePhoneType === "SMS") return `sms:${item.accessiblePhone}`;
  return `tel:${item.accessiblePhone}`;
}

export default function Government() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/services?serviceType=government&active=true`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(data.message || "לא ניתן לטעון את הרשימה");
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        `${item.name} ${item.category} ${item.phone} ${item.accessiblePhone} ${item.accessibleEmail}`
          .toLowerCase()
          .includes(query);
      return matchesSearch && (!category || item.category === category);
    });
  }, [items, search, category]);

  return (
    <main className="government-page" dir="rtl">
      <header className="government-header">
        <span aria-hidden="true">🏛️</span>
        <div>
          <h1>ניהול ממשלתי וציבורי</h1>
          <p>מספרים ראשיים, מספרים נגישים ודוא״ל נגיש של גופים בישראל.</p>
        </div>
      </header>

      <section className="government-filters" aria-label="חיפוש וסינון">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="חיפוש גוף, מספר או דוא״ל"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">כל הקטגוריות</option>
          {categories.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </section>

      {loading && <p className="government-status">טוען...</p>}
      {error && <p className="government-status error">❌ {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="government-status">לא נמצאו גופים מתאימים.</p>
      )}

      <section className="government-grid" aria-label="גופים ממשלתיים וציבוריים">
        {filtered.map((item) => {
          const accessHref = accessibleHref(item);
          return (
            <article
              className="government-card"
              key={item._id}
              style={{ "--card-color": item.cardColor || "#0b5ed7" }}
            >
              <div className="government-card-top">
                {item.logoUrl || item.imageUrl ? (
                  <img src={item.logoUrl || item.imageUrl} alt={`לוגו ${item.name}`} />
                ) : (
                  <span className="government-card-icon" aria-hidden="true">
                    {item.icon || "🏛️"}
                  </span>
                )}
                <h2>{item.name}</h2>
                <p>{item.category}</p>
              </div>

              <div className="government-card-contact">
                {item.phone && (
                  <a className="government-main-phone" href={`tel:${item.phone}`}>
                    <small>☎️ מספר ראשי</small>
                    <strong>{item.phone}</strong>
                  </a>
                )}

                {item.accessiblePhone && (
                  <a
                    className="government-accessible-phone"
                    href={accessHref}
                    target={item.accessiblePhoneType === "WhatsApp" ? "_blank" : undefined}
                    rel={item.accessiblePhoneType === "WhatsApp" ? "noreferrer" : undefined}
                  >
                    <small>♿ מספר נגיש {item.accessiblePhoneType ? `– ${item.accessiblePhoneType}` : ""}</small>
                    <strong>{item.accessiblePhone}</strong>
                  </a>
                )}

                {item.accessibleEmail && (
                  <a className="government-accessible-email" href={`mailto:${item.accessibleEmail}`}>
                    <small>📧 דוא״ל נגיש</small>
                    <strong>{item.accessibleEmail}</strong>
                  </a>
                )}

                {item.accessibilityNote && (
                  <p className="government-accessibility-note">ℹ️ {item.accessibilityNote}</p>
                )}

                {(item.websiteUrl || item.link) && (
                  <a
                    className="government-website"
                    href={item.websiteUrl || item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    🌐 כניסה לאתר הרשמי
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
