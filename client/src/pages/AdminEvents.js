import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminEvents.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const EMPTY_FORM = {
  title: "",
  date: "",
  time: "",
  city: "",
  location: "",
  description: "",
  website: "",
  imageUrl: "",
  active: true,
};

function getToken() {
  return localStorage.getItem("token") || "";
}

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const apiRequest = useCallback(async (path = "", options = {}) => {
    const response = await fetch(`${API_BASE}/events${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "הפעולה נכשלה");
    }

    return data;
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/admin");
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return [...events]
      .filter((event) => {
        const matchesSearch =
          !term ||
          `${event.title} ${event.city} ${event.location}`
            .toLowerCase()
            .includes(term);

        const matchesMonth =
          !monthFilter || String(event.date || "").startsWith(monthFilter);

        return matchesSearch && matchesMonth;
      })
      .sort((a, b) =>
        `${a.date || ""} ${a.time || ""}`.localeCompare(
          `${b.date || ""} ${b.time || ""}`
        )
      );
  }, [events, search, monthFilter]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId("");
  }

  function startEdit(eventItem) {
    setEditingId(eventItem._id);
    setForm({
      title: eventItem.title || "",
      date: eventItem.date || "",
      time: eventItem.time || "",
      city: eventItem.city || "",
      location: eventItem.location || "",
      description: eventItem.description || "",
      website: eventItem.website || "",
      imageUrl: eventItem.imageUrl || "",
      active: eventItem.active !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!form.title.trim() || !form.date) {
        throw new Error("יש למלא שם אירוע ותאריך");
      }

      const path = editingId ? `/${editingId}` : "";
      const method = editingId ? "PUT" : "POST";

      await apiRequest(path, {
        method,
        body: JSON.stringify(form),
      });

      setMessage(editingId ? "האירוע עודכן בהצלחה" : "האירוע נוסף בהצלחה");
      resetForm();
      await loadEvents();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(eventItem) {
    const approved = window.confirm(
      `למחוק את האירוע "${eventItem.title}"?`
    );

    if (!approved) return;

    setMessage("");
    setError("");

    try {
      await apiRequest(`/${eventItem._id}`, { method: "DELETE" });
      setMessage("האירוע נמחק");
      await loadEvents();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="admin-events-page" dir="rtl">
      <section className="admin-events-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>ניהול אירועים</h1>
          <span>
            כל אירוע פעיל שתשמור כאן יופיע אוטומטית בלוח החודשי באתר.
          </span>
        </div>

        <div className="admin-events-header-actions">
          <Link to="/israel-events">צפייה בלוח האירועים</Link>
          <Link to="/admin">חזרה לפורטל הניהול</Link>
        </div>
      </section>

      {message && <div className="admin-events-message">{message}</div>}
      {error && (
        <div className="admin-events-message admin-events-error" role="alert">
          {error}
        </div>
      )}

      <section className="admin-events-form-card">
        <h2>{editingId ? "עריכת אירוע" : "הוספת אירוע חדש"}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            שם האירוע *
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>

          <div className="admin-events-form-row">
            <label>
              תאריך *
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              שעה
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="admin-events-form-row">
            <label>
              עיר
              <input name="city" value={form.city} onChange={handleChange} />
            </label>

            <label>
              מקום
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </label>
          </div>

          <label>
            תיאור
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
            />
          </label>

          <label>
            קישור לאתר האירוע
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://"
            />
          </label>

          <label>
            קישור לתמונת האירוע
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://"
            />
          </label>

          <label className="admin-events-checkbox">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            אירוע פעיל ומוצג באתר
          </label>

          <div className="admin-events-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "שומר..."
                : editingId
                ? "שמירת השינויים"
                : "הוספת האירוע"}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                ביטול עריכה
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-events-list-card">
        <div className="admin-events-tools">
          <h2>כל האירועים</h2>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש לפי שם, עיר או מקום"
          />

          <input
            type="month"
            value={monthFilter}
            onChange={(event) => setMonthFilter(event.target.value)}
            aria-label="סינון לפי חודש"
          />

          {(search || monthFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setMonthFilter("");
              }}
            >
              ניקוי סינון
            </button>
          )}
        </div>

        {loading ? (
          <p>טוען אירועים...</p>
        ) : filteredEvents.length === 0 ? (
          <p>לא נמצאו אירועים.</p>
        ) : (
          <div className="admin-events-grid">
            {filteredEvents.map((eventItem) => (
              <article key={eventItem._id} className="admin-event-card">
                {eventItem.imageUrl && (
                  <img src={eventItem.imageUrl} alt={eventItem.title} />
                )}

                <div className="admin-event-card-content">
                  <div className="admin-event-card-top">
                    <strong>{eventItem.title}</strong>
                    <span className={eventItem.active ? "active" : "hidden"}>
                      {eventItem.active ? "מוצג" : "מוסתר"}
                    </span>
                  </div>

                  <p>
                    📅 {eventItem.date} {eventItem.time && `· ${eventItem.time}`}
                  </p>
                  <p>
                    📍 {eventItem.city || "ללא עיר"}
                    {eventItem.location && ` · ${eventItem.location}`}
                  </p>

                  <div className="admin-event-card-actions">
                    <button type="button" onClick={() => startEdit(eventItem)}>
                      עריכה
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => removeEvent(eventItem)}
                    >
                      מחיקה
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminEvents;
