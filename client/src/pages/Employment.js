import { useEffect, useState } from "react";

const API = "https://alonpc02026.onrender.com/api/employment";

export default function Employment() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "לא ניתן לטעון תעסוקה");
        return data;
      })
      .then((data) => setItems(Array.isArray(data) ? data.filter((x) => x.active !== false) : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main dir="rtl" style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <h1>💼 תעסוקה</h1>
      <p>מאגר עסקים ומקומות עבודה בתחום התעסוקה בלבד.</p>

      {loading && <p>טוען...</p>}
      {error && <p>❌ {error}</p>}

      {!loading && !error && items.length === 0 && <p>אין כרגע עסקים להצגה.</p>}

      {items.map((item) => (
        <article
          key={item._id}
          style={{
            border: "2px solid #4676a8",
            borderRadius: 12,
            padding: 16,
            marginBottom: 12
          }}
        >
          <h2>{item.businessName}</h2>

          {item.phone && (
            <p>
              <b>טלפון:</b>{" "}
              <a href={`tel:${item.phone}`}>{item.phone}</a>
            </p>
          )}

          {item.businessUrl && (
            <p>
              <a href={item.businessUrl} target="_blank" rel="noreferrer">
                🔗 קישור לעסק
              </a>
            </p>
          )}
        </article>
      ))}
    </main>
  );
}
