import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminEmergency.css";

const API = "https://alonpc02026.onrender.com/api/emergency-contacts";

const SERVICES = [
  { key: "police", name: "משטרה", icon: "👮", number: "100", description: "משטרת ישראל", className: "police" },
  { key: "mada", name: "מגן דוד אדום", icon: "🚑", number: "101", description: "שירותי רפואת חירום", className: "mada" },
  { key: "fire", name: "כבאות והצלה", icon: "🚒", number: "102", description: "כבאות והצלה לישראל", className: "fire" }
];

export default function AdminEmergency() {
  const [phones, setPhones] = useState({ police: "", mada: "", fire: "" });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const response = await fetch(API);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "טעינת מספרים נגישים נכשלה");
        }

        if (!active) return;

        const next = { police: "", mada: "", fire: "" };
        for (const item of Array.isArray(data) ? data : []) {
          if (Object.prototype.hasOwnProperty.call(next, item.key)) {
            next[item.key] = item.accessiblePhone || "";
          }
        }
        setPhones(next);
      } catch (error) {
        if (active) setMessage(`❌ ${error.message}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  async function savePhone(key) {
    try {
      setSavingKey(key);
      setMessage("שומר...");

      const response = await fetch(`${API}/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessiblePhone: phones[key] })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "השמירה נכשלה");
      }

      setMessage("✅ מספר נגיש למוגבלי שמיעה נשמר בהצלחה");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSavingKey("");
    }
  }

  return (
    <main className="admin-emergency-page" dir="rtl">
      <header className="admin-emergency-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>🚨 ניהול חירום</h1>
          <span>כאן אפשר להוסיף לכל גוף מספר נגיש למוגבלי שמיעה.</span>
        </div>

        <div className="admin-emergency-top-actions">
          <Link to="/emergency">👁️ תצוגה באתר</Link>
          <Link to="/admin">⚙️ חזרה לפורטל ניהול</Link>
        </div>
      </header>

      {message && <div className="admin-emergency-message">{message}</div>}
      {loading && <div className="admin-emergency-message">טוען...</div>}

      <section className="admin-emergency-grid">
        {SERVICES.map((service) => (
          <article
            key={service.key}
            className={`admin-emergency-card admin-emergency-card--${service.className}`}
          >
            <span className="admin-emergency-icon" aria-hidden="true">{service.icon}</span>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <strong className="admin-emergency-number">{service.number}</strong>

            <label className="accessible-phone-field">
              <span>♿📱 טלפון נגיש למוגבלי שמיעה</span>
              <input
                type="text"
                inputMode="tel"
                value={phones[service.key]}
                onChange={(event) =>
                  setPhones((current) => ({
                    ...current,
                    [service.key]: event.target.value
                  }))
                }
                placeholder="לדוגמה: 050-0000000"
              />
            </label>

            <button
              type="button"
              className="save-accessible-phone"
              disabled={savingKey === service.key}
              onClick={() => savePhone(service.key)}
            >
              {savingKey === service.key ? "שומר..." : "💾 שמירת מספר נגיש"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
