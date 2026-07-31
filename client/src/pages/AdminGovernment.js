import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminGovernment.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001/api"
    : "https://alonpc02026.onrender.com/api");

const API_URLS = [
  `${API_BASE}/government-services`,
  `${API_BASE}/government`,
];

const CATEGORIES = [
  "משרדי ממשלה",
  "ביטוח לאומי",
  "בריאות",
  "נגישות",
  "תחבורה",
  "תעסוקה",
  "משפטים",
  "חינוך",
  "דיור",
  "אזרחים ותיקים",
  "משפחה",
  "הגירה ואוכלוסין",
  "מיסים",
  "חירום והצלה",
  "משטרה",
  "טפסים ומידע",
  "אחר",
];

const DAYS = [
  ["sunday", "יום ראשון"],
  ["monday", "יום שני"],
  ["tuesday", "יום שלישי"],
  ["wednesday", "יום רביעי"],
  ["thursday", "יום חמישי"],
  ["friday", "יום שישי"],
  ["saturday", "יום שבת"],
];

function emptyHours() {
  return Object.fromEntries(
    DAYS.map(([key]) => [
      key,
      { enabled: false, open: "", close: "" },
    ])
  );
}

const EMPTY = {
  bodyName: "",
  department: "",
  category: "משרדי ממשלה",
  description: "",
  imageUrl: "",
  websiteUrl: "",
  formsUrl: "",
  appointmentUrl: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "",
  openingHours: emptyHours(),
  openingHoursNote: "",
  contactPerson: "",
  branchNumber: "",
  mapUrl: "",
  videoUrl: "",
  featured: false,
  active: true,
  displayOrder: 0,
};

function authToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || `שגיאת שרת ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

/*
  ניסיון ראשון מול government-services.
  אם השרת הישן מחזיר 404, ניסיון נוסף מול government.
*/
async function apiRequest(path = "", options = {}) {
  let lastError;

  for (const baseUrl of API_URLS) {
    try {
      const token = authToken();
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          ...(options.body
            ? { "Content-Type": "application/json" }
            : {}),
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
          ...(options.headers || {}),
        },
      });

      return await parseResponse(response);
    } catch (error) {
      lastError = error;

      if (error.status !== 404) {
        throw error;
      }
    }
  }

  throw new Error(
    lastError?.message ||
      "נתיב ניהול ממשלתי לא נמצא בשרת. יש להעלות גם את תיקיית server."
  );
}

export default function AdminGovernment() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    ...EMPTY,
    openingHours: emptyHours(),
  });
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest();
      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const text =
        `${item.bodyName || ""} ${item.department || ""} ` +
        `${item.category || ""} ${item.city || ""} ` +
        `${item.description || ""}`;

      return (
        (!query || text.toLowerCase().includes(query)) &&
        (!filter || item.category === filter)
      );
    });
  }, [items, search, filter]);

  function change(event) {
    const { name, value, checked, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function changeDay(day, field, value) {
    setForm((current) => ({
      ...current,
      openingHours: {
        ...current.openingHours,
        [day]: {
          ...current.openingHours[day],
          [field]: value,
        },
      },
    }));
  }

  function reset() {
    setEditingId("");
    setForm({
      ...EMPTY,
      openingHours: emptyHours(),
    });
  }

  function edit(item) {
    const hours = emptyHours();

    DAYS.forEach(([key]) => {
      hours[key] = {
        ...hours[key],
        ...(item.openingHours?.[key] || {}),
      };
    });

    setEditingId(item._id);
    setForm({
      ...EMPTY,
      ...item,
      openingHours: hours,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      for (const [key, label] of DAYS) {
        const day = form.openingHours[key];

        if (day.enabled && (!day.open || !day.close)) {
          throw new Error(`יש לבחור שעת פתיחה וסגירה עבור ${label}`);
        }
      }

      await apiRequest(editingId ? `/${editingId}` : "", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify({
          ...form,
          displayOrder: Number(form.displayOrder) || 0,
        }),
      });

      setMessage(
        editingId
          ? "הגוף הממשלתי או הציבורי עודכן בהצלחה"
          : "הגוף הממשלתי או הציבורי נוסף בהצלחה"
      );
      reset();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`למחוק את "${item.bodyName}"?`)) {
      return;
    }

    try {
      await apiRequest(`/${item._id}`, {
        method: "DELETE",
      });

      setMessage("הגוף נמחק בהצלחה");
      setError("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="admin-government-page" dir="rtl">
      <header>
        <div>
          <h1>🏛️ ניהול ממשלתי וציבורי</h1>
          <p>הוספה, עריכה ומחיקה של גופים ממשלתיים וציבוריים</p>
        </div>

        <div>
          <Link to="/government">צפייה באתר</Link>
          <Link to="/admin">חזרה לניהול</Link>
        </div>
      </header>

      {message && <p className="msg">✅ {message}</p>}
      {error && <p className="msg error">❌ {error}</p>}

      <section className="card">
        <h2>{editingId ? "עריכת גוף" : "הוספת גוף חדש"}</h2>

        <form onSubmit={submit}>
          <div className="row">
            <label>
              שם הגוף *
              <input
                name="bodyName"
                value={form.bodyName}
                onChange={change}
                required
              />
            </label>

            <label>
              מחלקה
              <input
                name="department"
                value={form.department}
                onChange={change}
              />
            </label>
          </div>

          <div className="row">
            <label>
              קטגוריה *
              <select
                name="category"
                value={form.category}
                onChange={change}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              סדר תצוגה
              <input
                type="number"
                name="displayOrder"
                value={form.displayOrder}
                onChange={change}
              />
            </label>
          </div>

          <label>
            תיאור
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows="4"
            />
          </label>

          <div className="row">
            <label>
              כתובת תמונה
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={change}
                placeholder="https://..."
              />
            </label>

            <label>
              כתובת אתר
              <input
                type="url"
                name="websiteUrl"
                value={form.websiteUrl}
                onChange={change}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="row">
            <label>
              קישור לטפסים
              <input
                type="url"
                name="formsUrl"
                value={form.formsUrl}
                onChange={change}
                placeholder="https://..."
              />
            </label>

            <label>
              קישור לזימון תור
              <input
                type="url"
                name="appointmentUrl"
                value={form.appointmentUrl}
                onChange={change}
                placeholder="https://..."
              />
            </label>
          </div>

          <div className="row">
            <label>
              דואר אלקטרוני
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={change}
              />
            </label>

            <label>
              טלפון
              <input
                name="phone"
                value={form.phone}
                onChange={change}
              />
            </label>
          </div>

          <div className="row">
            <label>
              WhatsApp
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={change}
              />
            </label>

            <label>
              עיר
              <input
                name="city"
                value={form.city}
                onChange={change}
              />
            </label>
          </div>

          <label>
            כתובת
            <input
              name="address"
              value={form.address}
              onChange={change}
            />
          </label>

          <fieldset>
            <legend>ימי ושעות פתיחה / קבלת קהל</legend>

            <div className="opening-hours-editor">
              {DAYS.map(([key, label]) => (
                <div className="opening-hours-row" key={key}>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={form.openingHours[key].enabled}
                      onChange={(event) =>
                        changeDay(key, "enabled", event.target.checked)
                      }
                    />
                    {label}
                  </label>

                  <label>
                    פתיחה
                    <input
                      type="time"
                      disabled={!form.openingHours[key].enabled}
                      value={form.openingHours[key].open}
                      onChange={(event) =>
                        changeDay(key, "open", event.target.value)
                      }
                    />
                  </label>

                  <label>
                    סגירה
                    <input
                      type="time"
                      disabled={!form.openingHours[key].enabled}
                      value={form.openingHours[key].close}
                      onChange={(event) =>
                        changeDay(key, "close", event.target.value)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>

            <label>
              הערה לשעות הפתיחה
              <textarea
                name="openingHoursNote"
                value={form.openingHoursNote}
                onChange={change}
                rows="3"
                placeholder="לדוגמה: קבלת קהל בתיאום מראש"
              />
            </label>
          </fieldset>

          <div className="row">
            <label>
              איש קשר
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={change}
              />
            </label>

            <label>
              מספר סניף
              <input
                name="branchNumber"
                value={form.branchNumber}
                onChange={change}
              />
            </label>
          </div>

          <div className="row">
            <label>
              קישור למפה
              <input
                type="url"
                name="mapUrl"
                value={form.mapUrl}
                onChange={change}
                placeholder="https://..."
              />
            </label>

            <label>
              קישור לסרטון
              <input
                type="url"
                name="videoUrl"
                value={form.videoUrl}
                onChange={change}
                placeholder="https://..."
              />
            </label>
          </div>

          <fieldset>
            <legend>הגדרות תצוגה</legend>

            <label className="check">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={change}
              />
              ⭐ מומלץ / מוצג בראש
            </label>

            <label className="check">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={change}
              />
              👁️ פעיל ומוצג באתר
            </label>
          </fieldset>

          {form.imageUrl && (
            <div className="preview">
              <img
                src={form.imageUrl}
                alt="תצוגה מקדימה"
              />
            </div>
          )}

          <div className="actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "שומר..."
                : editingId
                ? "💾 שמירת השינויים"
                : "➕ הוספת גוף"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={reset}
              >
                ביטול עריכה
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>גופים קיימים</h2>

        <div className="tools">
          <input
            type="search"
            placeholder="חיפוש גוף, מחלקה או עיר"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="">כל הקטגוריות</option>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>טוען...</p>
        ) : filtered.length === 0 ? (
          <p>עדיין אין גופים להצגה.</p>
        ) : (
          <div className="grid">
            {filtered.map((item) => (
              <article key={item._id}>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.bodyName}
                  />
                )}

                <div>
                  <h3>{item.bodyName}</h3>
                  <p className="category">{item.category}</p>

                  {item.department && (
                    <p>
                      <strong>מחלקה:</strong> {item.department}
                    </p>
                  )}

                  <p>
                    📍 {item.city || "ללא עיר"}
                    {item.address ? ` · ${item.address}` : ""}
                  </p>

                  <div className="badges">
                    {item.featured && <span>⭐ מומלץ</span>}
                    <span className={item.active ? "active" : "hidden"}>
                      {item.active ? "מוצג" : "מוסתר"}
                    </span>
                  </div>

                  <div className="actions">
                    <button
                      type="button"
                      onClick={() => edit(item)}
                    >
                      עריכה
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() => remove(item)}
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
