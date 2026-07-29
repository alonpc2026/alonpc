import { useEffect, useMemo, useState } from "react";
import "./InterestingSites.css";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:3001";

function InterestingSites() {
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("הכול");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSites() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/api/interesting-sites`
        );

        if (!response.ok) {
          throw new Error("טעינת האתרים נכשלה");
        }

        const data = await response.json();
        setSites(Array.isArray(data) ? data : []);
      } catch (error) {
        setMessage("לא ניתן לטעון כרגע את מאגר האתרים.");
      } finally {
        setLoading(false);
      }
    }

    loadSites();
  }, []);

  const categories = useMemo(() => {
    return [
      "הכול",
      ...Array.from(
        new Set(sites.map((site) => site.category).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b, "he")),
    ];
  }, [sites]);

  const filteredSites = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sites.filter((site) => {
      const matchesCategory =
        category === "הכול" || site.category === category;

      const text =
        `${site.name || ""} ${site.description || ""} ${
          site.category || ""
        }`.toLowerCase();

      return matchesCategory && (!term || text.includes(term));
    });
  }, [sites, search, category]);

  return (
    <main className="interesting-sites-page" dir="rtl">
      <header className="interesting-sites-hero">
        <span aria-hidden="true">🌐</span>
        <div>
          <h1>אתרים מעניינים ושימושיים</h1>
          <p>
            מאגר קישורים מסודר לפי קטגוריות, עם צבעים
            ברורים ונגישים.
          </p>
        </div>
      </header>

      <section
        className="interesting-sites-tools"
        aria-label="חיפוש וסינון"
      >
        <label>
          <span>חיפוש אתר</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="לדוגמה: בריאות, ממשלה או תחבורה"
          />
        </label>

        <label>
          <span>קטגוריה</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading && (
        <p className="interesting-sites-status">טוען אתרים...</p>
      )}

      {message && (
        <p className="interesting-sites-status error">{message}</p>
      )}

      {!loading && !message && filteredSites.length === 0 && (
        <p className="interesting-sites-status">
          לא נמצאו אתרים מתאימים.
        </p>
      )}

      <section className="interesting-sites-grid">
        {filteredSites.map((site) => (
          <article
            key={site._id}
            className={`interesting-site-card ${
              site.isAccessiblePreset ? "accessible-card" : ""
            }`}
            style={{
              backgroundColor: site.backgroundColor || "#0047AB",
              color: site.textColor || "#FFF200",
            }}
          >
            {site.isFeatured && (
              <span className="interesting-site-featured">
                ⭐ מומלץ
              </span>
            )}

            <div className="interesting-site-logo-wrap">
              {site.imageUrl ? (
                <img
                  src={site.imageUrl}
                  alt={`לוגו ${site.name}`}
                  className="interesting-site-logo"
                />
              ) : (
                <span
                  className="interesting-site-fallback"
                  aria-hidden="true"
                >
                  🌐
                </span>
              )}
            </div>

            <p className="interesting-site-category">
              {site.category || "אחר"}
            </p>

            <h2>{site.name}</h2>

            {site.description && <p>{site.description}</p>}

            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="interesting-site-open"
              style={{
                color: site.backgroundColor || "#0047AB",
                backgroundColor: site.textColor || "#FFF200",
              }}
            >
              כניסה לאתר
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

export default InterestingSites;
