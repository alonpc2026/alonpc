import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminApps.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3001/api"
    : "https://alonpc02026.onrender.com/api");

const API = `${API_BASE}/mobile-apps`;

const EMPTY = {
  name: "",
  description: "",
  imageUrl: "",
  hasAndroid: false,
  androidUrl: "",
  hasIphone: false,
  iphoneUrl: "",
  featured: false,
  active: true,
  displayOrder: 0,
};

function authToken() {
  return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
}

export default function AdminApps() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const request = useCallback(async (path = "", options = {}) => {
    const token = authToken();

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "הפעולה נכשלה");
    }

    return data;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const data = await request("?admin=true");
      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) =>
      `${item.name || ""} ${item.description || ""}`
        .toLowerCase()
        .includes(query)
    );
  }, [items, search]);

  function change(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function reset() {
    setForm(EMPTY);
    setEditingId("");
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      ...EMPTY,
      ...item,
      hasAndroid: Boolean(item.hasAndroid),
      hasIphone: Boolean(item.hasIphone),
      featured: Boolean(item.featured),
      active: item.active !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      androidUrl: form.hasAndroid ? form.androidUrl.trim() : "",
      iphoneUrl: form.hasIphone ? form.iphoneUrl.trim() : "",
      displayOrder: Number(form.displayOrder) || 0,
    };

    try {
      await request(editingId ? `/${editingId}` : "", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setMessage(
        editingId ? "האפליקציה עודכנה בהצלחה" : "האפליקציה נוספה בהצלחה"
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
    if (!window.confirm(`למחוק את האפליקציה "${item.name}"?`)) {
      return;
    }

    try {
      await request(`/${item._id}`, { method: "DELETE" });
      setMessage("האפליקציה נמחקה");
      setError("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="admin-apps-page" dir="rtl">
      <header className="admin-apps-header">
        <div>
          <h1>📱 ניהול אפליקציות</h1>
          <p>הוספת אפליקציות ל־iPhone ול־Galaxy / Android ללא קטגוריות.</p>
        </div>

        <div className="admin-apps-header-links">
          <Link to="/apps">צפייה בדף האפליקציות</Link>
          <Link to="/admin">חזרה למרכז הניהול</Link>
        </div>
      </header>

      {message && <p className="admin-apps-message">✅ {message}</p>}
      {error && <p className="admin-apps-message error">❌ {error}</p>}

      <section className="admin-apps-card">
        <h2>{editingId ? "עריכת אפליקציה" : "הוספת אפליקציה חדשה"}</h2>

        <form onSubmit={submit}>
          <label>
            שם האפליקציה *
            <input
              name="name"
              value={form.name}
              onChange={change}
              required
              maxLength="120"
            />
          </label>

          <label>
            תיאור קצר
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows="4"
              maxLength="1200"
            />
          </label>

          <label>
            כתובת תמונת האפליקציה
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={change}
              placeholder="https://..."
            />
          </label>

          {form.imageUrl && (
            <div className="admin-apps-preview">
              <img src={form.imageUrl} alt="תצוגה מקדימה של האפליקציה" />
            </div>
          )}

          <fieldset>
            <legend>🤖 Galaxy / Android</legend>

            <label className="admin-apps-checkbox">
              <input
                type="checkbox"
                name="hasAndroid"
                checked={form.hasAndroid}
                onChange={change}
              />
              קיימת גרסה ל־Galaxy / Android
            </label>

            {form.hasAndroid && (
              <label>
                קישור להורדה ב־Google Play *
                <input
                  type="url"
                  name="androidUrl"
                  value={form.androidUrl}
                  onChange={change}
                  placeholder="https://play.google.com/..."
                  required
                />
              </label>
            )}
          </fieldset>

          <fieldset>
            <legend>🍎 iPhone</legend>

            <label className="admin-apps-checkbox">
              <input
                type="checkbox"
                name="hasIphone"
                checked={form.hasIphone}
                onChange={change}
              />
              קיימת גרסה ל־iPhone
            </label>

            {form.hasIphone && (
              <label>
                קישור להורדה ב־App Store *
                <input
                  type="url"
                  name="iphoneUrl"
                  value={form.iphoneUrl}
                  onChange={change}
                  placeholder="https://apps.apple.com/..."
                  required
                />
              </label>
            )}
          </fieldset>

          <div className="admin-apps-row">
            <label>
              סדר תצוגה
              <input
                type="number"
                name="displayOrder"
                value={form.displayOrder}
                onChange={change}
              />
            </label>

            <div className="admin-apps-settings">
              <label className="admin-apps-checkbox">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={change}
                />
                ⭐ אפליקציה מומלצת
              </label>

              <label className="admin-apps-checkbox">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={change}
                />
                👁️ פעילה ומוצגת באתר
              </label>
            </div>
          </div>

          <div className="admin-apps-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "שומר..."
                : editingId
                ? "💾 שמירת השינויים"
                : "➕ הוספת אפליקציה"}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={reset}>
                ביטול עריכה
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-apps-card">
        <h2>אפליקציות קיימות</h2>

        <label className="admin-apps-search">
          חיפוש
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש לפי שם או תיאור"
          />
        </label>

        {loading ? (
          <p>טוען...</p>
        ) : filtered.length === 0 ? (
          <p>עדיין אין אפליקציות שמורות.</p>
        ) : (
          <div className="admin-apps-grid">
            {filtered.map((item) => (
              <article key={item._id}>
                <div className="admin-apps-list-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <span>📱</span>
                  )}
                </div>

                <div className="admin-apps-list-content">
                  <h3>{item.name}</h3>

                  <div className="admin-apps-badges">
                    {item.hasIphone && <span>🍎 iPhone</span>}
                    {item.hasAndroid && <span>🤖 Android</span>}
                    {item.featured && <span>⭐ מומלץ</span>}
                    <span className={item.active ? "active" : "hidden"}>
                      {item.active ? "מוצגת" : "מוסתרת"}
                    </span>
                  </div>

                  {item.description && <p>{item.description}</p>}

                  <div className="admin-apps-actions">
                    <button type="button" onClick={() => edit(item)}>
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
