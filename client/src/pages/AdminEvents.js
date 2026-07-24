import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminEvents.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const EMPTY_FORM = {
  title: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  allDay: false,
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

function normalizeEvent(eventItem = {}) {
  return {
    ...eventItem,
    startDate: eventItem.startDate || eventItem.date || "",
    endDate:
      eventItem.endDate ||
      eventItem.startDate ||
      eventItem.date ||
      "",
    startTime:
      eventItem.startTime ||
      eventItem.time ||
      "",
    endTime: eventItem.endTime || "",
    allDay: eventItem.allDay === true,
  };
}

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  async function apiRequest(path = "", options = {}) {
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
  }

  async function loadEvents() {
    setLoading(true);

    try {
      const data = await apiRequest("/admin");

      const list = Array.isArray(data)
        ? data
        : data.events || [];

      setEvents(list.map(normalizeEvent));

      setError("");
    } catch (err) {
      setError(err.message);
      setEvents([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const text = search.trim().toLowerCase();

    return [...events]
      .filter((event) => {
        const searchText = `${event.title} ${event.city} ${event.location} ${event.description}`
          .toLowerCase();

        const okSearch =
          !text || searchText.includes(text);

        const okMonth =
          !monthFilter ||
          event.startDate.startsWith(monthFilter) ||
          event.endDate.startsWith(monthFilter);

        return okSearch && okMonth;
      })
      .sort((a, b) =>
        `${a.startDate} ${a.startTime}`.localeCompare(
          `${b.startDate} ${b.startTime}`
        )
      );
  }, [events, search, monthFilter]);

  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setForm((current) => {
      const next = {
        ...current,
        [name]:
          type === "checkbox"
            ? checked
            : value,
      };

      if (
        name === "startDate" &&
        !current.endDate
      ) {
        next.endDate = value;
      }

      if (
        name === "allDay" &&
        checked
      ) {
        next.startTime = "";
        next.endTime = "";
      }

      return next;
    });
  }

  function resetForm() {
    setEditingId("");
    setForm(EMPTY_FORM);
  }

  function startEdit(event) {
    setEditingId(event._id);

    setForm({
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      city: event.city,
      location: event.location,
      description: event.description,
      website: event.website,
      imageUrl: event.imageUrl,
      active: event.active,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!form.title.trim()) {
        throw new Error("יש למלא שם אירוע");
      }

      if (!form.startDate) {
        throw new Error("יש למלא תאריך התחלה");
      }

      if (!form.endDate) {
        throw new Error("יש למלא תאריך סיום");
      }

      if (form.endDate < form.startDate) {
        throw new Error(
          "תאריך הסיום לא יכול להיות לפני תאריך ההתחלה"
        );
      }

      if (
        !form.allDay &&
        form.startDate === form.endDate &&
        form.startTime &&
        form.endTime &&
        form.endTime < form.startTime
      ) {
        throw new Error(
          "שעת הסיום לא יכולה להיות לפני שעת ההתחלה"
        );
      }

      const payload = {
        title: form.title.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: form.allDay
          ? ""
          : form.startTime,
        endTime: form.allDay
          ? ""
          : form.endTime,
        allDay: form.allDay,
        city: form.city.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        website: form.website.trim(),
        imageUrl: form.imageUrl.trim(),
        active: form.active,

        date: form.startDate,
        time: form.allDay
          ? ""
          : form.startTime,
      };

      const path = editingId
        ? `/${editingId}`
        : "";

      const method = editingId
        ? "PUT"
        : "POST";

      await apiRequest(path, {
        method,
        body: JSON.stringify(payload),
      });

      setMessage(
        editingId
          ? "האירוע עודכן בהצלחה"
          : "האירוע נוסף בהצלחה"
      );

      resetForm();

      await loadEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(eventItem) {
    const approved = window.confirm(
      `האם למחוק את האירוע "${eventItem.title}"?`
    );

    if (!approved) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await apiRequest(
        `/${eventItem._id}`,
        {
          method: "DELETE",
        }
      );

      setMessage("האירוע נמחק בהצלחה");

      if (editingId === eventItem._id) {
        resetForm();
      }

      await loadEvents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main
      className="admin-events-page"
      dir="rtl"
    >
      <section className="admin-events-header">
        <div>
          <p>🔒 אזור מנהל</p>

          <h1>ניהול אירועים</h1>

          <span>
            הוספה, עריכה ומחיקה של אירועים,
            כולל אירועים של יום אחד או מספר ימים.
          </span>
        </div>

        <div className="admin-events-header-actions">
          <Link to="/israel-events">
            צפייה בלוח האירועים
          </Link>

          <Link to="/admin">
            חזרה לפורטל הניהול
          </Link>
        </div>
      </section>

      {message && (
        <div
          className="admin-events-message"
          role="status"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          className="admin-events-message admin-events-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <section className="admin-events-form-card">
        <h2>
          {editingId
            ? "עריכת אירוע"
            : "הוספת אירוע חדש"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>
            שם האירוע *

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength="180"
              placeholder="לדוגמה: הרצאה מיוחדת בחיפה"
            />
          </label>

          <div className="admin-events-form-row">
            <label>
              תאריך התחלה *

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              תאריך סיום *

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={
                  form.startDate ||
                  undefined
                }
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="admin-events-checkbox">
            <input
              type="checkbox"
              name="allDay"
              checked={form.allDay}
              onChange={handleChange}
            />

            אירוע של כל היום
          </label>

          {!form.allDay && (
            <div className="admin-events-form-row">
              <label>
                שעת התחלה

                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                />
              </label>

              <label>
                שעת סיום

                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                />
              </label>
            </div>
          )}

          <div className="admin-events-form-row">
            <label>
              עיר

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                maxLength="120"
                placeholder="לדוגמה: חיפה"
              />
            </label>

            <label>
              מקום

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                maxLength="250"
                placeholder="שם האולם, המתנ״ס או הכתובת"
              />
            </label>
          </div>

          <label>
            תיאור האירוע

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="6"
              maxLength="5000"
              placeholder="פרטים מלאים על האירוע"
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

          {form.imageUrl && (
            <div className="admin-events-image-preview">
              <span>
                תצוגה מקדימה:
              </span>

              <img
                src={form.imageUrl}
                alt="תצוגה מקדימה של תמונת האירוע"
              />
            </div>
          )}

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
            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? "שומר..."
                : editingId
                ? "שמירת השינויים"
                : "הוספת האירוע"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
                disabled={saving}
              >
                ביטול עריכה
              </button>
            )}
          </div>
        </form>
      </section>