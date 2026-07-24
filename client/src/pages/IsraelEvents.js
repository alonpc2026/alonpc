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
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
}

function getStartDate(eventItem) {
  return eventItem.startDate || eventItem.date || "";
}

function getEndDate(eventItem) {
  return eventItem.endDate || getStartDate(eventItem);
}

function getStartTime(eventItem) {
  return eventItem.startTime || eventItem.time || "";
}

function getEndTime(eventItem) {
  return eventItem.endTime || "";
}

function eventOccursOnDate(eventItem, dateKey) {
  const startDate = getStartDate(eventItem);
  const endDate = getEndDate(eventItem);

  if (!startDate) {
    return false;
  }

  return dateKey >= startDate && dateKey <= endDate;
}

function formatSingleDate(dateValue) {
  if (!dateValue) {
    return "לא נמסר תאריך";
  }

  const parts = dateValue.split("-");

  if (parts.length !== 3) {
    return dateValue;
  }

  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

function formatEventDate(eventItem) {
  const startDate = getStartDate(eventItem);
  const endDate = getEndDate(eventItem);

  if (!startDate) {
    return "לא נמסר תאריך";
  }

  if (endDate && endDate !== startDate) {
    return `${formatSingleDate(startDate)} עד ${formatSingleDate(
      endDate
    )}`;
  }

  return formatSingleDate(startDate);
}

function formatEventTime(eventItem) {
  if (eventItem.allDay) {
    return "כל היום";
  }

  const startTime = getStartTime(eventItem);
  const endTime = getEndTime(eventItem);

  if (startTime && endTime) {
    return `${startTime}–${endTime}`;
  }

  if (startTime) {
    return startTime;
  }

  if (endTime) {
    return `עד ${endTime}`;
  }

  return "לא נמסרה שעה";
}

function getEventDateTimeValue(eventItem) {
  const date = getStartDate(eventItem);
  const time = getStartTime(eventItem) || "00:00";

  return `${date} ${time}`;
}

function IsraelEvents() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const todayKey = toDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(`${API_BASE}/events`);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "טעינת האירועים נכשלה");
        }

        if (active) {
          const receivedEvents = Array.isArray(data)
            ? data
            : data.events || [];

          setEvents(
            receivedEvents.filter(
              (eventItem) => eventItem.active !== false
            )
          );
        }
      } catch (error) {
        if (active) {
          setMessage(
            error.message || "לא ניתן לטעון את האירועים כרגע"
          );
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

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const cities = useMemo(() => {
    return [...new Set(events.map((item) => item.city).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "he"));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return events.filter((eventItem) => {
      const matchesCity =
        !cityFilter || eventItem.city === cityFilter;

      const searchableText = `${eventItem.title || ""} ${
        eventItem.city || ""
      } ${eventItem.location || ""} ${
        eventItem.description || ""
      }`.toLowerCase();

      const matchesSearch =
        !searchTerm || searchableText.includes(searchTerm);

      return matchesCity && matchesSearch;
    });
  }, [events, cityFilter, search]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push({
        type: "empty",
        key: `empty-${index}`,
      });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const dateKey = toDateKey(year, month, day);

      const dayEvents = filteredEvents
        .filter((eventItem) =>
          eventOccursOnDate(eventItem, dateKey)
        )
        .sort((a, b) =>
          getEventDateTimeValue(a).localeCompare(
            getEventDateTimeValue(b)
          )
        );

      cells.push({
        type: "day",
        key: dateKey,
        day,
        dateKey,
        events: dayEvents,
      });
    }

    return cells;
  }, [year, month, filteredEvents]);

  const upcomingEvents = useMemo(() => {
    return [...filteredEvents]
      .filter((eventItem) => getEndDate(eventItem) >= todayKey)
      .sort((a, b) =>
        getEventDateTimeValue(a).localeCompare(
          getEventDateTimeValue(b)
        )
      );
  }, [filteredEvents, todayKey]);

  function goToPreviousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((currentYear) => currentYear - 1);
      return;
    }

    setMonth((currentMonth) => currentMonth - 1);
  }

  function goToNextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((currentYear) => currentYear + 1);
      return;
    }

    setMonth((currentMonth) => currentMonth + 1);
  }

  function goToToday() {
    const current = new Date();

    setYear(current.getFullYear());
    setMonth(current.getMonth());
  }

  function clearFilters() {
    setCityFilter("");
    setSearch("");
  }

  return (
    <main className="israel-events-page" dir="rtl">
      <section className="events-hero">
        <span className="events-hero-icon" aria-hidden="true">
          📅
        </span>

        <div>
          <h1>לוח אירועים בישראל</h1>

          <p>
            לוח אירועים נגיש לאנשים עם מוגבלות. לחיצה על אירוע
            מציגה את כל הפרטים.
          </p>
        </div>
      </section>

      {message && (
        <div
          className="events-status events-status-error"
          role="alert"
        >
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
              onChange={(event) =>
                setMonth(Number(event.target.value))
              }
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
              onChange={(event) =>
                setYear(Number(event.target.value))
              }
            />
          </label>

          <label>
            עיר
            <select
              value={cityFilter}
              onChange={(event) =>
                setCityFilter(event.target.value)
              }
            >
              <option value="">כל הערים</option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label>
            חיפוש אירוע
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="שם, עיר או מקום"
            />
          </label>

          {(cityFilter || search) && (
            <button type="button" onClick={clearFilters}>
              ניקוי סינון
            </button>
          )}
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

            const isToday = cell.dateKey === todayKey;

            return (
              <article
                key={cell.key}
                className={`calendar-day ${
                  isToday ? "calendar-day-today" : ""
                }`}
              >
                <span
                  className="calendar-day-number"
                  aria-label={
                    isToday ? `${cell.day}, היום` : `${cell.day}`
                  }
                >
                  {cell.day}
                </span>

                <div className="calendar-events-list">
                  {cell.events.map((eventItem) => (
                    <button
                      key={`${eventItem._id || eventItem.id}-${
                        cell.dateKey
                      }`}
                      type="button"
                      className="calendar-event-button"
                      onClick={() => setSelectedEvent(eventItem)}
                    >
                      <span>{formatEventTime(eventItem)}</span>
                      <strong>{eventItem.title}</strong>
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="upcoming-events-section">
        <h2>אירועים קרובים</h2>

        {!loading && upcomingEvents.length === 0 ? (
          <p>לא נמצאו אירועים קרובים.</p>
        ) : (
          <div className="upcoming-events-grid">
            {upcomingEvents.map((eventItem) => (
              <button
                key={eventItem._id || eventItem.id}
                type="button"
                className="upcoming-event-card"
                onClick={() => setSelectedEvent(eventItem)}
              >
                {eventItem.imageUrl && (
                  <img
                    className="upcoming-event-image"
                    src={eventItem.imageUrl}
                    alt={eventItem.title}
                  />
                )}

                <span className="upcoming-event-date">
                  {formatEventDate(eventItem)}
                </span>

                <strong>{eventItem.title}</strong>

                <small>
                  📍 {eventItem.city || "ללא עיר"}
                  {eventItem.location
                    ? ` · ${eventItem.location}`
                    : ""}
                </small>

                <small>🕒 {formatEventTime(eventItem)}</small>

                <span className="upcoming-event-more">
                  לפרטים ←
                </span>
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

            <h2 id="event-modal-title">
              {selectedEvent.title}
            </h2>

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
                <dd>{formatEventDate(selectedEvent)}</dd>
              </div>

              <div>
                <dt>שעה</dt>
                <dd>{formatEventTime(selectedEvent)}</dd>
              </div>

              <div>
                <dt>עיר</dt>
                <dd>
                  {selectedEvent.city || "לא נמסרה עיר"}
                </dd>
              </div>

              <div>
                <dt>מקום</dt>
                <dd>
                  {selectedEvent.location || "לא נמסר מקום"}
                </dd>
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

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
              >
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