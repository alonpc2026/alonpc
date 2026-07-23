import { useEffect, useMemo, useState } from "react";
import "./IsraelEvents.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const WEEK_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

function IsraelEvents() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(`${API_BASE}/events`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "טעינת האירועים נכשלה");
        }

        if (active) {
          setEvents(Array.isArray(data) ? data : data.events || []);
        }
      } catch (error) {
        if (active) {
          setMessage(error.message || "לא ניתן לטעון את האירועים");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, []);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push({ type: "empty", key: `empty-${index}` });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const key = toDateKey(year, month, day);
      const dayEvents = events
        .filter((event) => event.date === key)
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

      cells.push({
        type: "day",
        key,
        day,
        events: dayEvents,
      });
    }

    return cells;
  }, [year, month, events]);

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => {
        const first = `${a.date || ""} ${a.time || ""}`;
        const second = `${b.date || ""} ${b.time || ""}`;
        return first.localeCompare(second);
      }),
    [events]
  );

  const goToPreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((current) => current - 1);
      return;
    }

    setMonth((current) => current - 1);
  };

  const goToNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((current) => current + 1);
      return;
    }

    setMonth((current) => current + 1);
  };

  const goToToday = () => {
    const current = new Date();
    setYear(current.getFullYear());
    setMonth(current.getMonth());
  };

  return (
    <main className="israel-events-page" dir="rtl">
      <section className="events-hero">
        <span className="events-hero-icon" aria-hidden="true">
          📅
        </span>

        <div>
          <h1>לוח אירועים בישראל</h1>
          <p>
            לוח חודשי ברור ונגיש. לחיצה על אירוע מציגה פרטים וקישור לאתר
            האירוע.
          </p>
        </div>
      </section>

      {message && (
        <div className="events-status events-status-error" role="alert">
          {message}
        </div>
      )}

      {loading && (
        <div className="events-status" role="status">
          טוען אירועים...
        </div>
      )}

      <section className="calendar-card">
        <div className="calendar-toolbar">
          <button type="button" onClick={goToPreviousMonth}>
            → חודש קודם
          </button>

          <h2>
            {MONTHS[month]} {year}
          </h2>

          <button type="button" onClick={goToNextMonth}>
            חודש הבא ←
          </button>
        </div>

        <div className="calendar-secondary-actions">
          <button type="button" onClick={goToToday}>
            היום
          </button>

          <label>
            בחירת חודש
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
            >
              {MONTHS.map((monthName, index) => (
                <option key={monthName} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
          </label>

          <label>
            שנה
            <input
              type="number"
              min="2020"
              max="2100"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="calendar-weekdays" aria-hidden="true">
          {WEEK_DAYS.map((dayName) => (
            <div key={dayName}>{dayName}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((cell) => {
            if (cell.type === "empty") {
              return (
                <div
                  key={cell.key}
                  className="calendar-day calendar-day-empty"
                  aria-hidden="true"
                />
              );
            }

            return (
              <article key={cell.key} className="calendar-day">
                <span className="calendar-day-number">{cell.day}</span>

                <div className="calendar-events-list">
                  {cell.events.map((event) => (
                    <button
                      key={event._id || event.id}
                      type="button"
                      className="calendar-event-button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <span>{event.time || "ללא שעה"}</span>
                      <strong>{event.title}</strong>
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="upcoming-events-section">
        <h2>אירועים רשומים</h2>

        {!loading && sortedEvents.length === 0 ? (
          <p>עדיין לא נרשמו אירועים.</p>
        ) : (
          <div className="upcoming-events-grid">
            {sortedEvents.map((event) => (
              <button
                key={event._id || event.id}
                type="button"
                className="upcoming-event-card"
                onClick={() => setSelectedEvent(event)}
              >
                <span className="upcoming-event-date">{event.date}</span>
                <strong>{event.title}</strong>
                <small>
                  {event.city || "ללא עיר"} · {event.time || "ללא שעה"}
                </small>
                <span className="upcoming-event-more">לפרטים ←</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedEvent && (
        <div
          className="event-modal-overlay"
          role="presentation"
          onClick={() => setSelectedEvent(null)}
        >
          <section
            className="event-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="event-modal-close"
              onClick={() => setSelectedEvent(null)}
              aria-label="סגירת פרטי האירוע"
            >
              ✕
            </button>

            <span className="event-modal-icon" aria-hidden="true">
              📌
            </span>

            <h2 id="event-modal-title">{selectedEvent.title}</h2>

            {selectedEvent.imageUrl && (
              <img
                className="event-modal-image"
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
              />
            )}

            <dl className="event-details-list">
              <div>
                <dt>תאריך</dt>
                <dd>{selectedEvent.date}</dd>
              </div>

              <div>
                <dt>שעה</dt>
                <dd>{selectedEvent.time || "לא נמסרה שעה"}</dd>
              </div>

              <div>
                <dt>עיר</dt>
                <dd>{selectedEvent.city || "לא נמסרה עיר"}</dd>
              </div>

              <div>
                <dt>מקום</dt>
                <dd>{selectedEvent.location || "לא נמסר מקום"}</dd>
              </div>
            </dl>

            <p className="event-modal-description">
              {selectedEvent.description || "לא נמסר תיאור"}
            </p>

            <div className="event-modal-actions">
              {selectedEvent.website && (
                <a
                  href={selectedEvent.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  🌐 מעבר לאתר האירוע
                </a>
              )}

              <button type="button" onClick={() => setSelectedEvent(null)}>
                סגירה
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default IsraelEvents;
