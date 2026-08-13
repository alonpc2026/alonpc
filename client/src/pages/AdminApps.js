import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminApps.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const API = `${API_BASE}/mobile-apps`;

const TYPES = [
  { value: "mobile", label: "📱 אפליקציות סלולרי" },
  { value: "tv", label: "📺 אפליקציות טלוויזיה חכמה" },
  { value: "windows", label: "💻 אפליקציות Windows 10-11" },
  { value: "mac", label: "🍎 אפליקציות Mac" },
];

const EMPTY = {
  name: "",
  description: "",
  type: "mobile",
  platform: "",
  imageUrl: "",
  url: "",
  androidUrl: "",
  iosUrl: "",
  storeUrl: "",
  active: true,
  order: 0,
};

function AdminApps() {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadApps = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}?admin=true`);
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data?.message || "טעינת האפליקציות נכשלה");
      }
      setApps(Array.isArray(data) ? data : data.apps || []);
      setMessage("");
    } catch (error) {
      setApps([]);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return apps.filter((app) => {
      const appType = app.type || "mobile";
      const typeOk = filterType === "all" || appType === filterType;
      const text = `${app.name || app.title || ""} ${app.description || ""} ${app.platform || ""}`.toLowerCase();
      return typeOk && (!q || text.includes(q));
    });
  }, [apps, filterType, search]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const reset = () => {
    setEditingId("");
    setForm(EMPTY);
  };

  const edit = (app) => {
    setEditingId(app._id);
    setForm({
      name: app.name || app.title || "",
      description: app.description || "",
      type: app.type || "mobile",
      platform: app.platform || "",
      imageUrl: app.imageUrl || app.logoUrl || "",
      url: app.url || app.link || app.websiteUrl || "",
      androidUrl: app.androidUrl || "",
      iosUrl: app.iosUrl || "",
      storeUrl: app.storeUrl || "",
      active: app.active !== false,
      order: Number(app.order || 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("❌ חובה להזין שם אפליקציה.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");
      const response = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "שמירת האפליקציה נכשלה");
      }

      setMessage(editingId ? "✅ האפליקציה עודכנה." : "✅ האפליקציה נוספה.");
      reset();
      await loadApps();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (app) => {
    if (!window.confirm(`למחוק את "${app.name || app.title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/${app._id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "מחיקת האפליקציה נכשלה");
      }

      setMessage("🗑️ האפליקציה נמחקה.");
      if (editingId === app._id) reset();
      await loadApps();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <main className="admin-apps-page" dir="rtl">
      <section className="admin-apps-hero">
        <span className="admin-apps-spray" aria-hidden="true">APPS</span>
        <h1>🎨 ניהול כל האפליקציות</h1>
        <p>
          ניהול אפליקציות סלולרי, טלוויזיה חכמה, Windows 10-11 ו-Mac במקום אחד.
        </p>
      </section>

      {message && <div className="admin-apps-message">{message}</div>}

      <form className="admin-apps-form" onSubmit={save}>
        <h2>{editingId ? "✏️ עריכת אפליקציה" : "➕ הוספת אפליקציה"}</h2>

        <div className="admin-apps-fields">
          <label>
            <span>סוג אפליקציה</span>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
            >
              {TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>שם האפליקציה *</span>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </label>

          <label>
            <span>מערכת / פלטפורמה</span>
            <input
              value={form.platform}
              onChange={(e) => update("platform", e.target.value)}
              placeholder="לדוגמה Android / iPhone / Samsung TV"
            />
          </label>

          <label>
            <span>סדר הצגה</span>
            <input
              type="number"
              value={form.order}
              onChange={(e) => update("order", Number(e.target.value))}
            />
          </label>

          <label className="wide">
            <span>תיאור</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>

          <label className="wide">
            <span>קישור ללוגו / תמונה</span>
            <input
              dir="ltr"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="wide">
            <span>קישור ראשי</span>
            <input
              dir="ltr"
              value={form.url}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://..."
            />
          </label>

          {form.type === "mobile" && (
            <>
              <label>
                <span>קישור Android</span>
                <input
                  dir="ltr"
                  value={form.androidUrl}
                  onChange={(e) => update("androidUrl", e.target.value)}
                />
              </label>

              <label>
                <span>קישור iPhone / iOS</span>
                <input
                  dir="ltr"
                  value={form.iosUrl}
                  onChange={(e) => update("iosUrl", e.target.value)}
                />
              </label>
            </>
          )}

          <label className="admin-apps-check">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => update("active", e.target.checked)}
            />
            <span>פעיל ומוצג באתר</span>
          </label>
        </div>

        <div className="admin-apps-actions">
          <button type="submit" disabled={saving}>
            {saving ? "שומר..." : editingId ? "💾 שמירת שינויים" : "➕ הוספה"}
          </button>
          {editingId && (
            <button type="button" onClick={reset}>
              ביטול עריכה
            </button>
          )}
        </div>
      </form>

      <section className="admin-apps-list">
        <div className="admin-apps-toolbar">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש אפליקציה..."
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">כל סוגי האפליקציות</option>
            {TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <Link to="/apps">👁️ צפייה באזור האפליקציות</Link>
        </div>

        {loading && <p>טוען...</p>}

        <div className="admin-apps-grid">
          {filtered.map((app) => {
            const type = app.type || "mobile";
            const typeLabel =
              TYPES.find((item) => item.value === type)?.label ||
              "📱 אפליקציות סלולרי";

            return (
              <article key={app._id} className="admin-app-card">
                {app.imageUrl || app.logoUrl ? (
                  <img src={app.imageUrl || app.logoUrl} alt="" />
                ) : (
                  <div className="admin-app-placeholder">📲</div>
                )}

                <h3>{app.name || app.title}</h3>
                <strong>{typeLabel}</strong>
                {app.platform && <p>{app.platform}</p>}
                {app.description && <p>{app.description}</p>}

                <div className="admin-app-card-actions">
                  <button type="button" onClick={() => edit(app)}>
                    ✏️ עריכה
                  </button>
                  <button type="button" className="delete" onClick={() => remove(app)}>
                    🗑️ מחיקה
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default AdminApps;
