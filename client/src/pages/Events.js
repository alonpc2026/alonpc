import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const RAW_API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:3001/api";

const API_BASE = RAW_API_BASE.replace(/\/+$/, "").endsWith("/api")
  ? RAW_API_BASE.replace(/\/+$/, "")
  : `${RAW_API_BASE.replace(/\/+$/, "")}/api`;

function formatDate(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getEventStart(eventItem = {}) {
  return eventItem.startDate || eventItem.date || "";
}

function getEventEnd(eventItem = {}) {
  return (
    eventItem.endDate ||
    eventItem.startDate ||
    eventItem.date ||
    ""
  );
}

function getEventStartTime(eventItem = {}) {
  return eventItem.startTime || eventItem.time || "";
}

function normalizeEvent(eventItem = {}) {
  return {
    ...eventItem,
    title: eventItem.title || "אירוע ללא כותרת",
    startDate: getEventStart(eventItem),
    endDate: getEventEnd(eventItem),
    startTime: getEventStartTime(eventItem),
    endTime: eventItem.endTime || "",
    city: eventItem.city || "",
    location: eventItem.location || "",
    description: eventItem.description || "",
    website: eventItem.website || "",
    imageUrl: eventItem.imageUrl || eventItem.image || "",
    allDay: eventItem.allDay === true,
    active: eventItem.active !== false,
    languages: Array.isArray(eventItem.languages)
      ? eventItem.languages
      : [],
    captionLanguages: Array.isArray(eventItem.captionLanguages)
      ? eventItem.captionLanguages
      : [],
    signLanguages: Array.isArray(eventItem.signLanguages)
      ? eventItem.signLanguages
      : [],
    accessibility:
      eventItem.accessibility &&
      typeof eventItem.accessibility === "object"
        ? eventItem.accessibility
        : {},
  };
}

function accessibilityLabels(accessibility = {}) {
  const labels = {
    captions: "כתוביות",
    signLanguage: "שפת סימנים",
    hearingLoop: "לולאת השראה",
    wheelchairAccess: "גישה לכיסא גלגלים",
    accessibleParking: "חניה נגישה",
    accessibleRestrooms: "שירותים נגישים",
    writtenContact: "יצירת קשר בכתב / WhatsApp",
    audioDescription: "תיאור קולי",
  };

  return Object.entries(accessibility)
    .filter(([, enabled]) => enabled === true)
    .map(([key]) => labels[key] || key);
}

function eventDateText(eventItem) {
  const start = formatDate(eventItem.startDate);
  const end = formatDate(eventItem.endDate);

  if (!start) return "התאריך יעודכן בהמשך";
  if (!end || start === end) return start;

  return `${start} – ${end}`;
}

function eventTimeText(eventItem) {
  if (eventItem.allDay) return "כל היום";

  const start = eventItem.startTime;
  const end = eventItem.endTime;

  if (!start && !end) return "";
  if (start && end) return `${start} – ${end}`;

  return start || end;
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE}/events`);

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || `שגיאת שרת: ${response.status}`
          );
        }

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.events)
          ? data.events
          : [];

        if (!cancelled) {
          setEvents(
            list
              .map(normalizeEvent)
              .filter((eventItem) => eventItem.active)
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.message === "Failed to fetch"
              ? "לא ניתן להתחבר לשרת האירועים. ודא שהשרת פועל בפורט 3001."
              : requestError.message
          );
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(() => {
    return [...new Set(events.map((item) => item.city).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "he"));
  }, [events]);

  const filteredEvents = useMemo(() => {
    const text = search.trim().toLowerCase();

    return [...events]
      .filter((eventItem) => {
        const searchableText = [
          eventItem.title,
          eventItem.city,
          eventItem.location,
          eventItem.description,
          ...eventItem.languages,
          ...eventItem.captionLanguages,
          ...eventItem.signLanguages,
        ]
          .join(" ")
          .toLowerCase();

        const matchesText =
          !text || searchableText.includes(text);

        const matchesCity =
          !cityFilter || eventItem.city === cityFilter;

        return matchesText && matchesCity;
      })
      .sort((a, b) => {
        const aValue = `${a.startDate} ${a.startTime}`;
        const bValue = `${b.startDate} ${b.startTime}`;
        return aValue.localeCompare(bValue);
      });
  }, [events, search, cityFilter]);

  return (
    <main
      dir="rtl"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px 16px 50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "22px" }}>
        <h1 style={{ marginBottom: "8px", fontSize: "2rem" }}>
          אירועים נגישים קרובים
        </h1>

        <p style={{ margin: 0, fontSize: "1.08rem" }}>
          אירועים רגילים עם תאריך ושעה. אירועים קבועים נמצאים
          בעמוד נפרד.
        </p>

        <div style={{ marginTop: "14px" }}>
          <Link
            to="/permanent-events"
            style={{
              display: "inline-block",
              padding: "11px 18px",
              borderRadius: "10px",
              background: "#ffffff",
              border: "2px solid #222",
              color: "#111",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            מעבר לאירועים קבועים
          </Link>
        </div>
      </header>

      <section
        aria-label="חיפוש וסינון אירועים"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <label style={{ fontWeight: "700" }}>
          חיפוש
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="שם אירוע, מקום או שפה"
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: "6px",
              padding: "12px",
              border: "2px solid #555",
              borderRadius: "9px",
              fontSize: "1rem",
            }}
          />
        </label>

        <label style={{ fontWeight: "700" }}>
          עיר
          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              marginTop: "6px",
              padding: "12px",
              border: "2px solid #555",
              borderRadius: "9px",
              fontSize: "1rem",
              background: "#fff",
            }}
          >
            <option value="">כל הערים</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading && (
        <p role="status" style={{ fontSize: "1.15rem" }}>
          טוען אירועים...
        </p>
      )}

      {!loading && error && (
        <div
          role="alert"
          style={{
            padding: "16px",
            border: "2px solid #9b0000",
            borderRadius: "10px",
            background: "#fff4f4",
            fontWeight: "700",
          }}
        >
          ❌ {error}
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <div
          style={{
            padding: "22px",
            border: "2px dashed #777",
            borderRadius: "12px",
            textAlign: "center",
            fontSize: "1.1rem",
          }}
        >
          לא נמצאו אירועים מתאימים.
        </div>
      )}

      {!loading && !error && filteredEvents.length > 0 && (
        <section
          aria-label="רשימת אירועים"
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
          }}
        >
          {filteredEvents.map((eventItem) => {
            const accessItems = accessibilityLabels(
              eventItem.accessibility
            );

            return (
              <article
                key={eventItem._id || `${eventItem.title}-${eventItem.startDate}`}
                style={{
                  border: "2px solid #333",
                  borderRadius: "14px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                {eventItem.imageUrl && (
                  <img
                    src={eventItem.imageUrl}
                    alt={eventItem.title}
                    style={{
                      width: "100%",
                      height: "210px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div style={{ padding: "18px" }}>
                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "12px",
                      fontSize: "1.4rem",
                    }}
                  >
                    {eventItem.title}
                  </h2>

                  <p style={{ margin: "7px 0" }}>
                    <strong>📅 תאריך:</strong>{" "}
                    {eventDateText(eventItem)}
                  </p>

                  {eventTimeText(eventItem) && (
                    <p style={{ margin: "7px 0" }}>
                      <strong>🕒 שעה:</strong>{" "}
                      {eventTimeText(eventItem)}
                    </p>
                  )}

                  {(eventItem.city || eventItem.location) && (
                    <p style={{ margin: "7px 0" }}>
                      <strong>📍 מקום:</strong>{" "}
                      {[eventItem.city, eventItem.location]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  {eventItem.description && (
                    <p
                      style={{
                        margin: "12px 0",
                        lineHeight: "1.55",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {eventItem.description}
                    </p>
                  )}

                  {accessItems.length > 0 && (
                    <p style={{ margin: "8px 0" }}>
                      <strong>♿ נגישות:</strong>{" "}
                      {accessItems.join(" · ")}
                    </p>
                  )}

                  {eventItem.languages.length > 0 && (
                    <p style={{ margin: "8px 0" }}>
                      <strong>🌐 שפות:</strong>{" "}
                      {eventItem.languages.join(" · ")}
                    </p>
                  )}

                  {eventItem.captionLanguages.length > 0 && (
                    <p style={{ margin: "8px 0" }}>
                      <strong>💬 שפות כתוביות:</strong>{" "}
                      {eventItem.captionLanguages.join(" · ")}
                    </p>
                  )}

                  {eventItem.signLanguages.length > 0 && (
                    <p style={{ margin: "8px 0" }}>
                      <strong>🤟 שפות סימנים:</strong>{" "}
                      {eventItem.signLanguages.join(" · ")}
                    </p>
                  )}

                  {eventItem.website && (
                    <a
                      href={eventItem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "12px",
                        padding: "11px 16px",
                        borderRadius: "9px",
                        background: "#111",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: "700",
                      }}
                    >
                      פרטים והרשמה באתר
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
