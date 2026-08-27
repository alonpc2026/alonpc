import { useEffect, useState } from "react";
import "./Employment.css";

const API = "https://alonpc02026.onrender.com/api/employment";
function wa(number) { return String(number || "").replace(/\D/g, ""); }

export default function Employment() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API).then(async r => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "לא ניתן לטעון תעסוקה");
      return d;
    }).then(d => setItems(Array.isArray(d) ? d.filter(x => x.active !== false) : []))
      .catch(e => setError(e.message));
  }, []);

  return (
    <main className="employment-page" dir="rtl">
      <h1>💼 תעסוקה</h1>
      {error && <p>❌ {error}</p>}
      {!error && items.length === 0 && <p>אין כרגע עסקים בתחום התעסוקה.</p>}
      <section className="employment-grid">
        {items.map(x => (
          <article className="employment-card" key={x._id}>
            <div className="employment-logo">
              {x.logoUrl ? <img src={x.logoUrl} alt={`לוגו ${x.businessName}`} /> : <span>🏢</span>}
            </div>
            <h2>{x.businessName}</h2>
            <div className="employment-links">
              {x.phone && <a href={`tel:${x.phone}`}>📞 טלפון</a>}
              {x.whatsapp && <a href={`https://wa.me/${wa(x.whatsapp)}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>}
              {x.businessUrl && <a href={x.businessUrl} target="_blank" rel="noreferrer">🔗 אתר העסק</a>}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
