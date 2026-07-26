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
  const [transcriptionOnly, setTranscriptionOnly] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE}/services`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(
            "לא ניתן לטעון את העסקים נותני השירות"
          );
        }

        setServices(
          Array.isArray(data)
            ? data.filter((item) => item.active !== false)
            : []
        );
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          services
            .map((item) => item.category)
            .filter(Boolean)
        ),
      ].sort(),
    [services]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return services.filter((item) => {
      const text =
        `${item.name || ""} ${item.businessName || ""} ` +
        `${item.category || ""} ${item.description || ""} ` +
        `${item.city || ""}`.toLowerCase();

      return (
        (!q || text.includes(q)) &&
        (!category || item.category === category) &&
        (!signOnly || item.supportsSignLanguage) &&
        (!transcriptionOnly || item.supportsTranscription)
      );
    });
  }, [
    services,
    search,
    category,
    signOnly,
    transcriptionOnly,
  ]);

  return (
    <main className="services-accessible-page" dir="rtl">
      <header>
        <h1>🏢 עסקים נותני שירות</h1>
        <p>
          מאגר עסקים ובעלי מקצוע שנותנים שירות לאנשים עם
          מוגבלות ולציבור הרחב.
        </p>
        <p className="services-separation-note">
          משטרה, כבאות, מד״א ומשרדי ממשלה נמצאים בעמוד
          גופים ממשלתיים וציבוריים.
        </p>
      </header>

      <section
        className="services-accessible-filters"
        aria-label="חיפוש וסינון עסקים"
      >
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="חיפוש עסק, בעל מקצוע, קטגוריה או עיר"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="בחירת קטגוריה"
        >
          <option value="">כל הקטגוריות</option>

          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={signOnly}
            onChange={(event) =>
              setSignOnly(event.target.checked)
            }
          />
          שפת סימנים
        </label>

        <label>
          <input
            type="checkbox"
            checked={transcriptionOnly}
            onChange={(event) =>
              setTranscriptionOnly(event.target.checked)
            }
          />
          תמלול
        </label>
      </section>

      {loading && (
        <p className="services-accessible-status">
          טוען עסקים נותני שירות...
        </p>
      )}

      {error && (
        <p className="services-accessible-status error">
          {error}
        </p>
      )}

      <section className="services-accessible-grid">
        {!loading &&
          !error &&
          filtered.map((item) => (
            <article key={item._id}>
              {(item.imageUrl || item.logoUrl) && (
                <img
                  src={item.imageUrl || item.logoUrl}
                  alt={item.businessName || item.name}
                />
              )}

              <div>
                <h2>{item.businessName || item.name}</h2>

                {item.businessName && item.name && (
                  <p>
                    <strong>שירות עיקרי:</strong> {item.name}
                  </p>
                )}

                <p className="category">{item.category}</p>

                {item.description && (
                  <p className="description">
                    {item.description}
                  </p>
                )}

                <p className="location">
                  📍 {item.city || "ללא עיר"}{" "}
                  {item.address && `· ${item.address}`}
                </p>

                {item.phone && (
                  <a
                    className="phone"
                    href={`tel:${item.phone}`}
                  >
                    📱 {item.phone}
                  </a>
                )}

                <div className="badges">
                  {item.supportsSignLanguage && (
                    <span>🤟 שירות בשפת סימנים</span>
                  )}

                  {item.supportsTranscription && (
                    <span>📝 שירות עם תמלול</span>
                  )}
                </div>

                <div className="actions">
                  <Link to={`/service/${item._id}`}>
                    פרטי העסק והשירות
                  </Link>

                  {(item.link || item.websiteUrl) && (
                    <a
                      href={item.link || item.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      מעבר לאתר העסק
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
      </section>

      {!loading && !error && filtered.length === 0 && (
        <p className="services-accessible-status">
          לא נמצאו עסקים נותני שירות מתאימים.
        </p>
      )}
    </main>
  );
}

export default Services;
