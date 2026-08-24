import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminSignLanguageCourses.css";

const API = "https://alonpc02026.onrender.com/api/sign-language-courses";

const EMPTY = {
  placeName: "",
  address: "",
  imageUrl: "",
  city: "",
  phone: "",
  startDate: "",
  active: true
};

export default function AdminSignLanguageCourses() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}?admin=true`);
      const data = await r.json().catch(() => []);
      if (!r.ok) throw new Error(data.message || "טעינת הקורסים נכשלה");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function clear() {
    setEditingId("");
    setForm(EMPTY);
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      placeName: item.placeName || "",
      address: item.address || "",
      imageUrl: item.imageUrl || "",
      city: item.city || "",
      phone: item.phone || "",
      startDate: item.startDate || "",
      active: item.active !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();

    if (!form.placeName.trim()) {
      setMessage("❌ חובה להזין שם מקום");
      return;
    }

    try {
      const r = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "השמירה נכשלה");

      setMessage(editingId ? "✅ הקורס עודכן" : "✅ הקורס נוסף");
      clear();
      await load();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  async function remove(item) {
    if (!window.confirm(`למחוק את "${item.placeName}"?`)) return;

    try {
      const r = await fetch(`${API}/${item._id}`, { method: "DELETE" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "המחיקה נכשלה");
      setMessage("🗑️ הקורס נמחק");
      await load();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  return (
    <main className="admin-sign-courses-page" dir="rtl">
      <header>
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>🤟 ניהול קורס שפת סימנים</h1>
        </div>
        <div className="admin-sign-top-actions">
          <Link to="/sign-language-courses">👁️ תצוגה באתר</Link>
          <Link to="/admin">⚙️ חזרה לניהול</Link>
        </div>
      </header>

      {message && <div className="admin-sign-message">{message}</div>}

      <form className="admin-sign-form" onSubmit={save}>
        <label>
          <span>שם מקום *</span>
          <input
            value={form.placeName}
            onChange={(e) => change("placeName", e.target.value)}
            required
          />
        </label>

        <label>
          <span>כתובת</span>
          <input
            value={form.address}
            onChange={(e) => change("address", e.target.value)}
          />
        </label>

        <label>
          <span>קישור תמונה</span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => change("imageUrl", e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          <span>עיר</span>
          <input
            value={form.city}
            onChange={(e) => change("city", e.target.value)}
          />
        </label>

        <label>
          <span>טלפון</span>
          <input
            value={form.phone}
            onChange={(e) => change("phone", e.target.value)}
          />
        </label>

        <label>
          <span>תחילת קורס</span>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => change("startDate", e.target.value)}
          />
        </label>

        {form.imageUrl && (
          <div className="admin-sign-preview">
            <img src={form.imageUrl} alt="" />
          </div>
        )}

        <label className="admin-sign-check">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => change("active", e.target.checked)}
          />
          <span>להציג באתר</span>
        </label>

        <div className="admin-sign-actions">
          <button type="submit">
            {editingId ? "💾 שמירת שינויים" : "➕ הוספת קורס"}
          </button>

          {editingId && (
            <button type="button" className="secondary" onClick={clear}>
              ביטול
            </button>
          )}
        </div>
      </form>

      <section className="admin-sign-list">
        <h2>קורסים קיימים</h2>

        <div className="admin-sign-grid">
          {items.map((item) => (
            <article key={item._id}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.placeName} />}
              <h3>{item.placeName}</h3>
              {item.city && <p>🏙️ {item.city}</p>}
              {item.address && <p>📍 {item.address}</p>}
              {item.phone && <p>📞 {item.phone}</p>}
              {item.startDate && <p>📅 {item.startDate}</p>}

              <div className="admin-sign-card-actions">
                <button type="button" onClick={() => edit(item)}>✏️ עריכה</button>
                <button type="button" className="danger" onClick={() => remove(item)}>🗑️ מחיקה</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
