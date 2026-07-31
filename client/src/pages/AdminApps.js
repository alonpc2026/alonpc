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
  translations: {
    en: { name: "", description: "" },
    ru: { name: "", description: "" },
    ar: { name: "", description: "" },
    am: { name: "", description: "" },
  },
  hasAndroid: false,
  androidUrl: "",
  hasIphone: false,
  iphoneUrl: "",
  featured: false,
  active: true,
  displayOrder: 0,
};

const LANGUAGE_FIELDS = [
  { code: "he", title: "🇮🇱 עברית", dir: "rtl" },
  { code: "en", title: "🇬🇧 English", dir: "ltr" },
  { code: "ru", title: "🇷🇺 Русский", dir: "ltr" },
  { code: "ar", title: "🇸🇦 العربية", dir: "rtl" },
  { code: "am", title: "🇪🇹 አማርኛ", dir: "ltr" },
];

function authToken() {
  return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
}

function normalizedTranslations(value = {}) {
  return {
    en: { name: value.en?.name || "", description: value.en?.description || "" },
    ru: { name: value.ru?.name || "", description: value.ru?.description || "" },
    ar: { name: value.ar?.name || "", description: value.ar?.description || "" },
    am: { name: value.am?.name || "", description: value.am?.description || "" },
  };
}

export default function AdminApps() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [activeLanguage, setActiveLanguage] = useState("he");
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

    return items.filter((item) => {
      const translations = Object.values(item.translations || {})
        .map((value) => `${value?.name || ""} ${value?.description || ""}`)
        .join(" ");

      return `${item.name || ""} ${item.description || ""} ${translations}`
        .toLowerCase()
        .includes(query);
    });
  }, [items, search]);

  function change(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function changeTranslation(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLanguage]: {
          ...current.translations[activeLanguage],
          [name]: value,
        },
      },
    }));
  }

  function reset() {
    setForm(EMPTY);
    setEditingId("");
    setActiveLanguage("he");
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      ...EMPTY,
      ...item,
      translations: normalizedTranslations(item.translations),
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
      translations: {
        en: {
          name: form.translations.en.name.trim(),
          description: form.translations.en.description.trim(),
        },
        ru: {
          name: form.translations.ru.name.trim(),
          description: form.translations.ru.description.trim(),
        },
        ar: {
          name: form.translations.ar.name.trim(),
          description: form.translations.ar.description.trim(),
        },
        am: {
          name: form.translations.am.name.trim(),
          description: form.translations.am.description.trim(),
        },
      },
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
        editingId ? "האפליקציה והתרגומים עודכנו בהצלחה" : "האפליקציה נוספה בהצלחה"
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
    if (!window.confirm(`למחוק את האפליקציה "${item.name}"?`)) return;

    try {
      await request(`/${item._id}`, { method: "DELETE" });
      setMessage("האפליקציה נמחקה");
      setError("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const activeInfo =
    LANGUAGE_FIELDS.find((item) => item.code === activeLanguage) ||
    LANGUAGE_FIELDS[0];

  return (
    <main className="admin-apps-page" dir="rtl">
      <header className="admin-apps-header">
        <div>
          <h1>📱 ניהול אפליקציות רב־לשוני</h1>
          <p>עברית, אנגלית, רוסית, ערבית ואמהרית.</p>
        </div>

        <div className="admin-apps-header-links">
          <Link to="/apps">צפייה בדף האפליקציות</Link>
          <Link to="/admin">חזרה למרכז הניהול</Link>
        </div>
      </header>

      {message && <p className="admin-apps-message">✅ {message}</p>}
      {error && <p className="admin-apps-message error">❌ {error}</p>}

      <section className="admin-apps-card">
        <h2>{editingId ? "עריכת אפליקציה ותרגומים" : "הוספת אפליקציה חדשה"}</h2>

        <form onSubmit={submit}>
          <div className="admin-apps-language-tabs">
            {LANGUAGE_FIELDS.map((item) => (
              <button
                key={item.code}
                type="button"
                className={activeLanguage === item.code ? "selected" : ""}
                onClick={() => setActiveLanguage(item.code)}
              >
                {item.title}
              </button>
            ))}
          </div>

          <section className="admin-apps-language-panel" dir={activeInfo.dir}>
            <h3>{activeInfo.title}</h3>

            {activeLanguage === "he" ? (
              <>
                <label>
                  שם האפליקציה בעברית *
                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    required
                    maxLength="120"
                    placeholder="לדוגמה: ביטוח לאומי"
                  />
                </label>

                <label className="admin-apps-description-field">
                  תיאור האפליקציה בעברית
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={change}
                    rows="5"
                    maxLength="1200"
                    placeholder="כתוב תיאור קצר וברור של האפליקציה ומה אפשר לעשות בה"
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  שם האפליקציה בשפה שנבחרה
                  <input
                    name="name"
                    value={form.translations[activeLanguage].name}
                    onChange={changeTranslation}
                    maxLength="120"
                    placeholder="שם האפליקציה בשפה זו"
                  />
                </label>

                <label className="admin-apps-description-field">
                  תיאור האפליקציה בשפה שנבחרה
                  <textarea
                    name="description"
                    value={form.translations[activeLanguage].description}
                    onChange={changeTranslation}
                    rows="5"
                    maxLength="1200"
                    placeholder="כתוב כאן את תיאור האפליקציה בשפה זו"
                  />
                </label>
              </>
            )}
          </section>

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
              <img src={form.imageUrl} alt="תצוגה מקדימה" />
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
                קישור Google Play *
                <input
                  type="url"
                  name="androidUrl"
                  value={form.androidUrl}
                  onChange={change}
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
                קישור App Store *
                <input
                  type="url"
                  name="iphoneUrl"
                  value={form.iphoneUrl}
                  onChange={change}
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
                ⭐ מומלצת
              </label>

              <label className="admin-apps-checkbox">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={change}
                />
                👁️ מוצגת באתר
              </label>
            </div>
          </div>

          <div className="admin-apps-actions">
            <button type="submit" disabled={saving}>
              {saving ? "שומר..." : editingId ? "💾 שמירת השינויים" : "➕ הוספה"}
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
          חיפוש בכל השפות
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <span>📱</span>}
                </div>

                <div className="admin-apps-list-content">
                  <h3>{item.name}</h3>
                  <div className="admin-apps-translation-status">
                    <strong>מצב תרגומים:</strong>
                    <span>
                      EN שם {item.translations?.en?.name ? "✅" : "❌"} /
                      תיאור {item.translations?.en?.description ? "✅" : "❌"}
                    </span>
                    <span>
                      RU שם {item.translations?.ru?.name ? "✅" : "❌"} /
                      תיאור {item.translations?.ru?.description ? "✅" : "❌"}
                    </span>
                    <span>
                      AR שם {item.translations?.ar?.name ? "✅" : "❌"} /
                      תיאור {item.translations?.ar?.description ? "✅" : "❌"}
                    </span>
                    <span>
                      AM שם {item.translations?.am?.name ? "✅" : "❌"} /
                      תיאור {item.translations?.am?.description ? "✅" : "❌"}
                    </span>
                  </div>

                  <div className="admin-apps-actions">
                    <button type="button" onClick={() => edit(item)}>עריכה ותרגום</button>
                    <button type="button" className="danger" onClick={() => remove(item)}>מחיקה</button>
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
