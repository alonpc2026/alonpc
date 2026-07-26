import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminServices.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";
const API = `${API_BASE}/services`;

const CATEGORIES = [
  "מחשבים",
  "נגישות",
  "בריאות",
  "משפטים",
  "תחבורה",
  "לימודים",
  "עסקים",
  "מסמכים",
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
  return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
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
    if (!response.ok) throw new Error(data.message || "הפעולה נכשלה");
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
      const haystack = `${item.name || ""} ${item.businessName || ""} ${item.category || ""} ${item.city || ""} ${item.description || ""}`.toLowerCase();
      return (!q || haystack.includes(q)) &&
        (!categoryFilter || item.category === categoryFilter);
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
      if (!form.name.trim()) throw new Error("חובה להזין שם שירות");
      if (!form.category) throw new Error("חובה לבחור קטגוריה");
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
      setMessage(editingId ? "השירות עודכן בהצלחה" : "השירות נוסף בהצלחה");
      reset();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`האם למחוק את "${item.name}"?`)) return;
    setError("");
    setMessage("");
    try {
      await request(`/${item._id}`, { method: "DELETE" });
      setMessage("השירות נמחק בהצלחה");
      if (editingId === item._id) reset();
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
          <h1>ניהול שירותים נגישים</h1>
          <span>קטגוריה, עסק, תמונה, פרטי קשר וסימוני נגישות.</span>
        </div>
        <div>
          <Link to="/services">צפייה בשירותים</Link>
          <Link to="/admin">חזרה לניהול</Link>
        </div>
      </header>

      {message && <div className="admin-services-message" role="status">{message}</div>}
      {error && <div className="admin-services-message error" role="alert">{error}</div>}

      <section className="admin-services-form-card">
        <h2>{editingId ? "עריכת שירות" : "הוספת שירות נגיש"}</h2>
        <form onSubmit={submit}>
          <div className="admin-services-row">
            <label>שם השירות *
              <input name="name" value={form.name} onChange={change} required />
            </label>
            <label>קטגוריה *
              <select name="category" value={form.category} onChange={change}>
                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
          </div>

          <label>שם העסק
            <input name="businessName" value={form.businessName} onChange={change} />
          </label>

          <div className="admin-services-row">
            <label>קישור לוגו
              <input type="url" name="logoUrl" value={form.logoUrl} onChange={change} placeholder="https://" />
            </label>
            <label>קישור תמונה
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={change} placeholder="https://" />
            </label>
          </div>

          {(form.imageUrl || form.logoUrl) && (
            <div className="admin-services-preview">
              <img src={form.imageUrl || form.logoUrl} alt="תצוגה מקדימה" />
            </div>
          )}

          <label>תיאור העסק
            <textarea name="description" value={form.description} onChange={change} rows="6" />
          </label>

          <div className="admin-services-row">
            <label>כתובת העסק
              <input name="address" value={form.address} onChange={change} />
            </label>
            <label>עיר
              <input name="city" value={form.city} onChange={change} />
            </label>
          </div>

          <div className="admin-services-row">
            <label>פלאפון
              <input type="tel" name="phone" value={form.phone} onChange={change} />
            </label>
            <label>קישור העסק
              <input type="url" name="link" value={form.link} onChange={change} placeholder="https://" />
            </label>
          </div>

          <fieldset>
            <legend>סימוני נגישות</legend>
            <label className="admin-services-checkbox">
              <input type="checkbox" name="supportsSignLanguage" checked={form.supportsSignLanguage} onChange={change} />
              תומך בתרגום לשפת סימנים
            </label>
            <label className="admin-services-checkbox">
              <input type="checkbox" name="supportsTranscription" checked={form.supportsTranscription} onChange={change} />
              תומך בתמלול
            </label>
            <label className="admin-services-checkbox">
              <input type="checkbox" name="active" checked={form.active} onChange={change} />
              שירות פעיל ומוצג באתר
            </label>
          </fieldset>

          <div className="admin-services-actions">
            <button type="submit" disabled={saving}>{saving ? "שומר..." : editingId ? "שמירת שינויים" : "הוספת השירות"}</button>
            {editingId && <button type="button" className="secondary" onClick={reset}>ביטול עריכה</button>}
          </div>
        </form>
      </section>

      <section className="admin-services-list-card">
        <div className="admin-services-tools">
          <h2>כל השירותים ({filtered.length})</h2>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש עסק, שירות, עיר או תיאור" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">כל הקטגוריות</option>
            {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>

        {loading ? <p className="admin-services-empty">טוען...</p> :
          filtered.length === 0 ? <p className="admin-services-empty">לא נמצאו שירותים.</p> :
          <div className="admin-services-grid">
            {filtered.map((item) => (
              <article key={item._id}>
                {(item.imageUrl || item.logoUrl) && <img src={item.imageUrl || item.logoUrl} alt={item.name} />}
                <div>
                  <h3>{item.name}</h3>
                  <p className="category">{item.category}</p>
                  {item.businessName && <p><strong>עסק:</strong> {item.businessName}</p>}
                  <p>📍 {item.city || "ללא עיר"} {item.address && `· ${item.address}`}</p>
                  {item.phone && <p>📱 {item.phone}</p>}
                  <div className="admin-services-badges">
                    {item.supportsSignLanguage && <span>🤟 שפת סימנים</span>}
                    {item.supportsTranscription && <span>📝 תמלול</span>}
                    <span className={item.active === false ? "hidden" : "active"}>{item.active === false ? "מוסתר" : "מוצג"}</span>
                  </div>
                  <div className="admin-services-actions">
                    <button type="button" onClick={() => edit(item)}>עריכה</button>
                    <button type="button" className="danger" onClick={() => remove(item)}>מחיקה</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        }
      </section>
    </main>
  );
}

export default AdminServices;
