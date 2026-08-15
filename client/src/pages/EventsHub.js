import { Link } from "react-router-dom";
import "./EventsHub.css";

export default function EventsHub() {
  return (
    <main className="events-choice-page" dir="rtl">
      <section className="events-choice-header">
        <span aria-hidden="true">📅</span>
        <div>
          <h1>אירועים נגישים</h1>
          <p>בחרו סוג אירוע</p>
        </div>
      </section>

      <section className="events-choice-grid">
        <Link to="/israel-events" className="events-choice-card regular">
          <span className="events-choice-icon" aria-hidden="true">🗓️</span>
          <span>
            <strong>אירועים רגילים</strong>
            <small>אירועים עם תאריך, שעה, מקום וכל פרטי האירוע</small>
          </span>
          <b aria-hidden="true">←</b>
        </Link>

        <Link to="/permanent-events" className="events-choice-card permanent">
          <span className="events-choice-icon" aria-hidden="true">📌</span>
          <span>
            <strong>אירועים קבועים</strong>
            <small>שם אתר, תמונה וקישור לאתר</small>
          </span>
          <b aria-hidden="true">←</b>
        </Link>
      </section>

      <div className="events-choice-back">
        <Link to="/">🏠 חזרה לדף הבית</Link>
      </div>
    </main>
  );
}
