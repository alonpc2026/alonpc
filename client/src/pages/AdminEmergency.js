import { Link } from "react-router-dom";
import "./AdminEmergency.css";

const SERVICES = [
  {
    name: "משטרה",
    icon: "👮",
    number: "100",
    description: "משטרת ישראל",
    className: "police"
  },
  {
    name: "מגן דוד אדום",
    icon: "🚑",
    number: "101",
    description: "שירותי רפואת חירום",
    className: "mada"
  },
  {
    name: "כבאות והצלה",
    icon: "🚒",
    number: "102",
    description: "כבאות והצלה לישראל",
    className: "fire"
  }
];

export default function AdminEmergency() {
  return (
    <main className="admin-emergency-page" dir="rtl">
      <header className="admin-emergency-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>🚨 ניהול חירום</h1>
          <span>בדיקה וניהול תצוגת שירותי החירום באתר.</span>
        </div>

        <div className="admin-emergency-top-actions">
          <Link to="/emergency">👁️ תצוגה באתר</Link>
          <Link to="/admin">⚙️ חזרה לפורטל ניהול</Link>
        </div>
      </header>

      <section className="admin-emergency-note">
        <strong>חשוב:</strong> מספרי החירום הלאומיים מוצגים כערכים קבועים כדי למנוע שינוי בטעות.
      </section>

      <section className="admin-emergency-grid">
        {SERVICES.map((service) => (
          <article
            key={service.number}
            className={`admin-emergency-card admin-emergency-card--${service.className}`}
          >
            <span className="admin-emergency-icon" aria-hidden="true">
              {service.icon}
            </span>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <strong className="admin-emergency-number">{service.number}</strong>
            <a href={`tel:${service.number}`}>📞 בדיקת חיוג {service.number}</a>
          </article>
        ))}
      </section>
    </main>
  );
}
