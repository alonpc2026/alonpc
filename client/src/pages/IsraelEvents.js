import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./IsraelEvents.css";

const API_BASE = process.env.REACT_APP_API_BASE || "https://alonpc02026.onrender.com/api";
const LANGUAGES = ["עברית", "אנגלית", "רוסית", "אמהרית", "ערבית"];
const ACCESS_LABELS = {
  transcription: "תמלול בזמן אמת", captions: "כתוביות", signLanguage: "שפת סימנים",
  hearingLoop: "מערכת עזר לשמיעה", wheelchairAccess: "נגיש לכיסא גלגלים",
  accessibleParking: "חניה נגישה", accessibleRestrooms: "שירותים נגישים", writtenContact: "קשר בכתב / WhatsApp",
};

export default function IsraelEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [access, setAccess] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/events?active=true&includePast=false`)
      .then(async (response) => {
        const data = await response.json().catch(() => ([]));
        if (!response.ok) throw new Error(data.message || "לא ניתן לטעון אירועים");
        return data;
      })
      .then((data) => setEvents(Array.isArray(data) ? data : data.events || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    return events.filter((event) => {
      const haystack = `${event.title || ""} ${event.city || ""} ${event.location || ""} ${event.description || ""}`.toLowerCase();
      return (!text || haystack.includes(text)) && (!language || (event.languages || []).includes(language)) && (!access || event.accessibility?.[access]);
    });
  }, [events, search, language, access]);

  return (
    <main className="israel-events-page" dir="rtl">
      <header className="israel-events-hero">
        <h1>אירועים רגילים</h1>
        <p>אירועים עם תאריך, שעה, מקום ופרטי נגישות.</p>
        <Link className="events-back-to-hub" to="/events">← חזרה לאירועים נגישים</Link>
      </header>
      <section className="events-filters" aria-label="סינון אירועים">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש לפי שם, עיר או מקום" />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}><option value="">כל השפות</option>{LANGUAGES.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={access} onChange={(e) => setAccess(e.target.value)}><option value="">כל סוגי הנגישות</option>{Object.entries(ACCESS_LABELS).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select>
        {(search || language || access) && <button type="button" onClick={() => { setSearch(""); setLanguage(""); setAccess(""); }}>ניקוי סינון</button>}
      </section>
      {loading && <p className="events-status">טוען אירועים...</p>}
      {error && <p className="events-status error">{error}</p>}
      {!loading && !error && filtered.length === 0 && <p className="events-status">לא נמצאו אירועים מתאימים.</p>}
      <section className="events-grid">
        {filtered.map((event) => {
          const accessItems = Object.entries(ACCESS_LABELS).filter(([key]) => event.accessibility?.[key]);
          return <article className="event-public-card" key={event._id}>
            {event.imageUrl && <img src={event.imageUrl} alt={event.title} loading="lazy" />}
            <div className="event-public-content"><h2>{event.title}</h2><p><strong>📅</strong> {event.startDate || event.date}{event.endDate && event.endDate !== event.startDate ? ` עד ${event.endDate}` : ""}</p><p><strong>🕒</strong> {event.allDay ? "כל היום" : event.startTime || event.time || "ללא שעה"}{event.endTime ? ` עד ${event.endTime}` : ""}</p><p><strong>📍</strong> {event.city || "ללא עיר"}{event.location ? ` · ${event.location}` : ""}</p>
              {event.description && <p className="event-description">{event.description}</p>}
              {(event.languages || []).length > 0 && <div><h3>שפות האירוע</h3><div className="event-tags">{event.languages.map((item) => <span key={item}>{item}</span>)}</div></div>}
              {accessItems.length > 0 && <div><h3>נגישות</h3><div className="event-tags access">{accessItems.map(([key, label]) => <span key={key}>{label}</span>)}</div></div>}
              {(event.captionLanguages || []).length > 0 && <p><strong>שפות כתוביות:</strong> {event.captionLanguages.join(", ")}</p>}
              {(event.signLanguages || []).length > 0 && <p><strong>שפות סימנים:</strong> {event.signLanguages.join(", ")}</p>}
              {event.website && <a className="event-link" href={event.website} target="_blank" rel="noreferrer">פרטים נוספים</a>}
            </div>
          </article>;
        })}
      </section>
    </main>
  );
}
