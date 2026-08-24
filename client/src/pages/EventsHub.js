import { Link } from "react-router-dom";
import "./EventsHub.css";

export default function EventsHub() {
  return (
    <main className="events-hub-page" dir="rtl">
      <header className="events-hub-hero">
        <span>📅</span>
        <div>
          <h1>אירועים נגישים</h1>
          <p>בחר בין אירועים רגילים לאירועים קבועים.</p>
        </div>
      </header>

      <section className="events-hub-grid">
        <Link to="/israel-events" className="events-hub-card regular">
          <span>🗓️</span>
          <strong>אירועים רגילים</strong>
          <small>אירועים עם תאריך ושעה</small>
        </Link>

        <Link to="/permanent-events" className="events-hub-card permanent">
          <span>📌</span>
          <strong>אירועים קבועים</strong>
          <small>אירועים ומקומות קבועים</small>
        </Link>
      </section>
    </main>
  );
}
