import { useEffect, useMemo, useState } from "react";
import "./HomeServices.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const API = `${API_BASE}/home-services`;

const REGIONS = ["צפון", "מרכז", "דרום"];

const SERVICE_TYPES = [
  "מטפלת חירום",
  "דוגסיטר",
  "קאטסיטר",
  "מנקה",
  "מסדרת בגדים",
  "טיפול בגינה",
  "ביביסיטר",
  "מנעולן",
  "חשמלאי",
  "שיפוץ",
];

function imageSrc(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) {
    return `${API_BASE.replace(/\/api\/?$/, "")}${url}`;
  }
  return url;
}

export default function HomeServices() {
  const [items, setItems] = useState([]);
  const [region, setRegion] = useState("צפון");
  const [serviceType, setServiceType] = useState("הכל");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(`${API}?active=true`);
        const data = await response.json().catch(() => []);
        if (!response.ok) {
          throw new Error(data.message || "לא ניתן לטעון את השירותים");
        }
        if (active) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (active) setMessage(`❌ ${error.message}`);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const visibleItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.region === region &&
          (serviceType === "הכל" || item.serviceType === serviceType)
      ),
    [items, region, serviceType]
  );

  return (
    <main className="home-services-page" dir="rtl">
      <section className="home-services-hero">
        <div className="home-services-hero-icon">🏠</div>
        <div>
          <h1>שירות לבית</h1>
          <p>
            חיפוש נותני שירות לבית לפי אזור וסוג שירות – צפון, מרכז ודרום.
          </p>
        </div>
      </section>

      <section className="home-services-region-box">
        <h2>בחרו אזור</h2>
        <div className="home-services-region-buttons">
          {REGIONS.map((item) => (
            <button
              key={item}
              type="button"
              className={region === item ? "active" : ""}
              onClick={() => setRegion(item)}
            >
              {item === "צפון" ? "⬆️" : item === "מרכז" ? "📍" : "⬇️"} {item}
            </button>
          ))}
        </div>
      </section>

      <section className="home-services-filter">
        <label htmlFor="home-service-type">סוג שירות</label>
        <select
          id="home-service-type"
          value={serviceType}
          onChange={(event) => setServiceType(event.target.value)}
        >
          <option value="הכל">כל השירותים</option>
          {SERVICE_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      {message && <p className="home-services-message">{message}</p>}

      <section className="home-services-grid" aria-live="polite">
        {visibleItems.map((item) => {
          const picture = imageSrc(item.imageUrl);
          return (
            <article className="home-service-card" key={item._id}>
              {picture ? (
                <img src={picture} alt={item.name || item.serviceType} />
              ) : (
                <div className="home-service-placeholder" aria-hidden="true">
                  🏠
                </div>
              )}

              <div className="home-service-card-body">
                <span className="home-service-type">{item.serviceType}</span>
                <h2>{item.name}</h2>
                <p className="home-service-region">📍 אזור {item.region}</p>

                {item.description && (
                  <p className="home-service-description">{item.description}</p>
                )}

                <p className="home-service-price">
                  💰 מחיר לשעה:{" "}
                  <strong>
                    {Number(item.hourlyPrice || 0).toLocaleString("he-IL")} ₪
                  </strong>
                </p>

                <a className="home-service-phone" href={`tel:${item.phone}`}>
                  📞 {item.phone}
                </a>
              </div>
            </article>
          );
        })}
      </section>

      {!message && visibleItems.length === 0 && (
        <section className="home-services-empty">
          עדיין לא נוספו נותני שירות באזור ובקטגוריה שבחרתם.
        </section>
      )}
    </main>
  );
}
