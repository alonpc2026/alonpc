import { Link } from "react-router-dom";
import "./EventsHub.css";

export default function EventsHub() {
  return (
    <main className="events-hub-page" dir="rtl">
      <section className="events-hub-hero">
        <span className="events-hub-icon" aria-hidden="true">📅</span>
        <div>
          <h1>אירועים נגישים</h1>
          <p>בחרו את סוג האירועים הרצוי</p>
        </div>
      </section>

      <section className="events-hub-grid" aria-label="סוגי אירועים">
        <Link to="/regular-events" className="events-hub-card regular">
          <span className="events-hub-card-icon" aria-hidden="true">🗓️</span>
          <span className="events-hub-card-text">
            <strong>אירועים רגילים</strong>
            <small>אירועים עם תאריך, שעה, מקום וכל פרטי האירוע</small>
          </span>
          <span className="events-hub-arrow" aria-hidden="true">←</span>
        </Link>

        <Link to="/permanent-events" className="events-hub-card permanent">
          <span className="events-hub-card-icon" aria-hidden="true">📌</span>
          <span className="events-hub-card-text">
            <strong>אירועים קבועים</strong>
            <small>רק שם האתר, תמונה וקישור לאתר</small>
          </span>
          <span className="events-hub-arrow" aria-hidden="true">←</span>
        </Link>
      </section>

      <div className="events-hub-back">
        <Link to="/">🏠 חזרה לדף הבית</Link>
      </div>
    </main>
  );
}
