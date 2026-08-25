import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminUsageStats.css";

const API = "https://alonpc02026.onrender.com/api/usage-stats/summary";

export default function AdminUsageStats() {
  const [days,setDays] = useState(1);
  const [data,setData] = useState(null);
  const [error,setError] = useState("");

  useEffect(() => {
    setError("");
    fetch(`${API}?days=${days}`)
      .then(async r => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.message || "שגיאה");
        return d;
      })
      .then(setData)
      .catch(e => setError(e.message));
  }, [days]);

  return <main className="usage-admin" dir="rtl">
    <header>
      <div><p>🔒 אזור מנהל</p><h1>📊 סטטיסטיקת מבקרים ולחיצות</h1></div>
      <Link to="/admin">⚙️ חזרה לניהול</Link>
    </header>

    <div className="usage-tabs">
      <button onClick={()=>setDays(1)} className={days===1?"active":""}>היום</button>
      <button onClick={()=>setDays(7)} className={days===7?"active":""}>7 ימים</button>
      <button onClick={()=>setDays(30)} className={days===30?"active":""}>30 ימים</button>
    </div>

    {error && <div className="usage-error">❌ {error}</div>}
    {!data && !error && <div className="usage-loading">⏳ טוען נתונים...</div>}

    {data && <>
      <section className="usage-summary">
        <article><span>👥 כניסות</span><strong>{data.visits.toLocaleString()}</strong></article>
        <article><span>👆 סך לחיצות</span><strong>{data.totalClicks.toLocaleString()}</strong></article>
      </section>
      <section className="usage-table">
        <h2>איזה כפתורים נלחצו?</h2>
        {data.clicks.length===0 ? <p>אין עדיין לחיצות בתקופה זו.</p> :
          data.clicks.map((x,i)=><div className="usage-row" key={x.key}>
            <span>{i+1}. {x.label || x.key}</span><strong>{x.count}</strong>
          </div>)
        }
      </section>
      <p className="usage-privacy">🔐 נשמרים רק ספירות מצטברות לפי יום וכפתור — ללא שם, טלפון או כתובת IP.</p>
    </>}
  </main>;
}
