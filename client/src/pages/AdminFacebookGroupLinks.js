import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminFacebookGroupLinks.css";

const API = "https://alonpc02026.onrender.com/api/facebook-group-links";

const EMPTY = {
  title: "",
  url: "",
  note: "",
  active: true
};

export default function AdminFacebookGroupLinks() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}?admin=true`);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "טעינת הקישורים נכשלה");
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function clearForm() {
    setEditingId("");
    setForm(EMPTY);
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      url: item.url || "",
      note: item.note || "",
      active: item.active !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage("❌ חובה להזין שם/כותרת");
      return;
    }

    if (!form.url.trim()) {
      setMessage("❌ חובה להזין קישור");
      return;
    }

    try {
      setMessage("שומר...");

      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "השמירה נכשלה");
      }

      setMessage(editingId ? "✅ הקישור עודכן" : "✅ הקישור נוסף");
      clearForm();
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  async function remove(item) {
    if (!window.confirm(`למחוק את "${item.title}"?`)) return;

    try {
      const response = await fetch(`${API}/${item._id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "המחיקה נכשלה");
      }

      setMessage("🗑️ הקישור נמחק");
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  return (
    <main className="admin-facebook-links-page" dir="rtl">
      <header className="admin-facebook-links-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>📘 ניהול קישורים לקבוצה בפייס</h1>
          <span>הוספת קישורים והערות. באתר מוצגת הודעה שהגולש מחליט בעצמו אם כדאי להשתמש בקישור.</span>
        </div>

        <div className="admin-facebook-top-actions">
          <Link to="/facebook-group-links">👁️ תצוגה באתר</Link>
          <Link to="/admin">⚙️ חזרה לניהול</Link>
        </div>
      </header>

      {message && <div className="admin-facebook-message">{message}</div>}

      <form className="admin-facebook-form" onSubmit={save}>
        <h2>{editingId ? "✏️ עריכת קישור" : "➕ הוספת קישור חדש"}</h2>

        <label>
          <span>שם / כותרת *</span>
          <input
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            placeholder="שם הקישור או הקבוצה"
            required
          />
        </label>

        <label>
          <span>קישור *</span>
          <input
            type="url"
            value={form.url}
            onChange={(e) => change("url", e.target.value)}
            placeholder="https://..."
            required
          />
        </label>

        <label>
          <span>הערות</span>
          <textarea
            rows="5"
            value={form.note}
            onChange={(e) => change("note", e.target.value)}
            placeholder="הערה לגולשים על הקישור"
          />
        </label>

        <label className="admin-facebook-check">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => change("active", e.target.checked)}
          />
          <span>להציג באתר</span>
        </label>

        <div className="admin-facebook-actions">
          <button type="submit">
            {editingId ? "💾 שמירת שינויים" : "➕ הוספת קישור"}
          </button>

          {editingId && (
            <button type="button" className="secondary" onClick={clearForm}>
              ביטול
            </button>
          )}
        </div>
      </form>

      <section className="admin-facebook-list">
        <h2>קישורים קיימים</h2>

        {loading && <p>טוען...</p>}

        <div className="admin-facebook-grid">
          {items.map((item) => (
            <article key={item._id} className="admin-facebook-card">
              <h3>{item.title}</h3>
              {item.note && <p>{item.note}</p>}
              <a href={item.url} target="_blank" rel="noreferrer">🔗 פתיחת הקישור</a>

              <div className="admin-facebook-card-actions">
                <button type="button" onClick={() => startEdit(item)}>✏️ עריכה</button>
                <button type="button" className="danger" onClick={() => remove(item)}>🗑️ מחיקה</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
