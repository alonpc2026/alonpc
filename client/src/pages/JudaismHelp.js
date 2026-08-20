import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./JudaismSection.css";

const API = "https://alonpc02026.onrender.com/api/judaism-content";

export default function JudaismHelp() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}?category=help`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  return (
    <main className="judaism-section-page" dir="rtl">
      <header>
        <h1>🤝 עזרה ביהדות</h1>
        <Link to="/judaism">← חזרה ליהדות</Link>
      </header>

      <section className="judaism-section-grid">
        {items.map((item) => (
          <article key={item._id} className="judaism-section-card">
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} />}
            <h2>{item.title}</h2>
            {item.description && <p>{item.description}</p>}
            {item.url && <a href={item.url} target="_blank" rel="noreferrer">פתיחת הקישור</a>}
          </article>
        ))}
      </section>
    </main>
  );
}
