import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminServices.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";
const API = `${API_BASE}/services`;

const CATEGORIES = [
  "מחשבים וטכנולוגיה",
  "נגישות",
  "בריאות ורפואה",
  "משפטים",
  "תחבורה והובלות",
  "לימודים והדרכה",
  "שיפוצים ובעלי מקצוע",
  "חנויות ורשתות",
  "מסעדות ואוכל",
  "תיירות ומלונות",
  "תרגום ושפת סימנים",
  "שירותים פיננסיים",
  "שונות",
];

const EMPTY = {
  name: "",
  category: "נגישות",
  businessName: "",
  logoUrl: "",
  imageUrl: "",
  description: "",
  address: "",
  city: "",
  phone: "",
  link: "",
  supportsSignLanguage: false,
  supportsTranscription: false,
  active: true,
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const request = useCallback(async (path = "", options = {}) => {
    const token = getToken();
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
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
      const data = await request();
      setServices(Array.isArray(data) ? data : data.services || []);
      setError("");
    } catch (err) {
      setError(err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return services.filter((item) => {
      const haystack =
        `${item.name || ""} ${item.businessName || ""} ` +
        `${item.category || ""} ${item.city || ""} ` +
        `${item.description || ""}`.toLowerCase();

      return (
        (!q || haystack.includes(q)) &&
        (!categoryFilter || item.category === categoryFilter)
      );
    });
  }, [services, search, categoryFilter]);

  function change(event) {
    const { name, value, checked, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function reset() {
    setEditingId("");
    setForm(EMPTY);
  }

  function edit(item) {
    setEditingId(item._id);

    setForm({
      name: item.name || "",
      category: item.category || "נגישות",
      businessName: item.businessName || "",
      logoUrl: item.logoUrl || item.imageUrl || "",
      imageUrl: item.imageUrl || item.logoUrl || "",
      description: item.description || "",
      address: item.address || "",
      city: item.city || "",
      phone: item.phone || "",
      link: item.link || item.websiteUrl || "",
      supportsSignLanguage: Boolean(item.supportsSignLanguage),
      supportsTranscription: Boolean(item.supportsTranscription),
      active: item.active !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (!form.name.trim()) {
        throw new Error("חובה להזין את שם העסק או נותן השירות");
      }

      if (!form.category) {
        throw new Error("חובה לבחור קטגוריה");
      }

      const payload = {
        ...form,
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
        link: form.link.trim(),
        imageUrl: (form.imageUrl || form.logoUrl).trim(),
        logoUrl: (form.logoUrl || form.imageUrl).trim(),
      };

      await request(editingId ? `/${editingId}` : "", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      setMessage(
        editingId
          ? "✅ העסק נותן השירות עודכן בהצלחה"
          : "✅ העסק נותן השירות נוסף בהצלחה"
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
    const businessTitle =
      item.businessName || item.name || "העסק";

    if (
      !window.confirm(
        `האם למחוק את העסק נותן השירות "${businessTitle}"?`
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await request(`/${item._id}`, { method: "DELETE" });
      setMessage("🗑️ העסק נותן השירות נמחק בהצלחה");

      if (editingId === item._id) {
        reset();
      }

      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="admin-services-page" dir="rtl">
      <header className="admin-services-header">
        <div>
          <p>♿ אזור מנהל</p>
          <h1>ניהול עסקים נותני שירות</h1>
          <span>
            הוספה, תיקון ומחיקה של עסקים, פרטי קשר וסימוני נגישות.
          </span>
        </div>

        <div>
          <Link to="/services">צפייה בעסקים נותני שירות</Link>
          <Link to="/admin">חזרה לניהול</Link>
        </div>
      </header>

      {message && (
        <div className="admin-services-message" role="status">
          {message}
        </div>
      )}

      {error && (
        <div
          className="admin-services-message error"
          role="alert"
        >
          {error}
        </div>
      )}

      <section className="admin-services-form-card">
        <h2>
          {editingId
            ? "✏️ תיקון עסק נותן שירות"
            : "➕ הוספת עסק נותן שירות"}
        </h2>

        <form onSubmit={submit}>
          <div className="admin-services-row">
            <label>
              שם העסק או נותן השירות *
              <input
                name="name"
                value={form.name}
                onChange={change}
                required
              />
            </label>

            <label>
              קטגוריה *
              <select
                name="category"
                value={form.category}
                onChange={change}
              >
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            שם העסק הרשמי
            <input
              name="businessName"
              value={form.businessName}
              onChange={change}
            />
          </label>

          <div className="admin-services-row">
            <label>
              קישור ללוגו
              <input
                type="url"
                name="logoUrl"
                value={form.logoUrl}
                onChange={change}
                placeholder="https://"
              />
            </label>

            <label>
              קישור לתמונה
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={change}
                placeholder="https://"
              />
            </label>
          </div>

          {(form.imageUrl || form.logoUrl) && (
            <div className="admin-services-preview">
              <img
                src={form.imageUrl || form.logoUrl}
                alt="תצוגה מקדימה"
              />
            </div>
          )}

          <label>
            תיאור העסק והשירותים שהוא נותן
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows="6"
            />
          </label>

          <div className="admin-services-row">
            <label>
              כתובת העסק
              <input
                name="address"
                value={form.address}
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

          <div className="admin-services-row">
            <label>
              טלפון או פלאפון
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={change}
              />
            </label>

            <label>
              קישור לאתר העסק
              <input
                type="url"
                name="link"
                value={form.link}
                onChange={change}
                placeholder="https://"
              />
            </label>
          </div>

          <fieldset>
            <legend>סימוני נגישות</legend>

            <label className="admin-services-checkbox">
              <input
                type="checkbox"
                name="supportsSignLanguage"
                checked={form.supportsSignLanguage}
                onChange={change}
              />
              העסק נותן שירות בשפת סימנים
            </label>

            <label className="admin-services-checkbox">
              <input
                type="checkbox"
                name="supportsTranscription"
                checked={form.supportsTranscription}
                onChange={change}
              />
              העסק נותן שירות עם תמלול
            </label>

            <label className="admin-services-checkbox">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={change}
              />
              העסק פעיל ומוצג באתר
            </label>
          </fieldset>

          <div className="admin-services-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "שומר..."
                : editingId
                ? "💾 שמירת תיקון העסק"
                : "➕ הוספת העסק"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={reset}
              >
                ביטול תיקון
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-services-list-card">
        <div className="admin-services-tools">
          <h2>כל העסקים נותני השירות ({filtered.length})</h2>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש עסק, קטגוריה, עיר או תיאור"
          />

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >
            <option value="">כל הקטגוריות</option>

            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="admin-services-empty">טוען עסקים...</p>
        ) : filtered.length === 0 ? (
          <p className="admin-services-empty">
            לא נמצאו עסקים נותני שירות.
          </p>
        ) : (
          <div className="admin-services-grid">
            {filtered.map((item) => (
              <article key={item._id}>
                {(item.imageUrl || item.logoUrl) && (
                  <img
                    src={item.imageUrl || item.logoUrl}
                    alt={item.businessName || item.name}
                  />
                )}

                <div>
                  <h3>{item.businessName || item.name}</h3>

                  {item.businessName && item.name && (
                    <p>
                      <strong>שירות עיקרי:</strong> {item.name}
                    </p>
                  )}

                  <p className="category">{item.category}</p>

                  <p>
                    📍 {item.city || "ללא עיר"}{" "}
                    {item.address && `· ${item.address}`}
                  </p>

                  {item.phone && <p>📱 {item.phone}</p>}

                  <div className="admin-services-badges">
                    {item.supportsSignLanguage && (
                      <span>🤟 שפת סימנים</span>
                    )}

                    {item.supportsTranscription && (
                      <span>📝 תמלול</span>
                    )}

                    <span
                      className={
                        item.active === false ? "hidden" : "active"
                      }
                    >
                      {item.active === false ? "מוסתר" : "מוצג"}
                    </span>
                  </div>

                  <div className="admin-services-actions">
                    <button
                      type="button"
                      onClick={() => edit(item)}
                    >
                      ✏️ תקן עסק
                    </button>

                    <button
                      type="button"
                      className="danger"
                      onClick={() => remove(item)}
                    >
                      🗑️ מחק עסק
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

export default AdminServices;
