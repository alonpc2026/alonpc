import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminPermanentEvents.css";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://alonpc02026.onrender.com";

const API_URL = `${API_BASE}/api/permanent-events`;

const emptyForm = {
  name: "",
  image: "",
  website: "",
  active: true,
};

function AdminPermanentEvents() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "טעינת הנתונים נכשלה");
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "לא ניתן לטעון את הרשימה");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const startEdit = (item) => {
    setForm({
      name: item.name || "",
      image: item.image || "",
      website: item.website || "",
      active: item.active !== false,
    });

    setEditingId(item._id);
    setMessage("מצב עריכה פעיל");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitForm = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("חובה להזין שם אתר");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "השמירה נכשלה");
      }

      const wasEditing = Boolean(editingId);
      resetForm();
      setMessage(
        wasEditing
          ? "האתר הקבוע עודכן בהצלחה"
          : "האתר הקבוע נוסף בהצלחה"
      );

      await loadItems();
    } catch (error) {
      setMessage(error.message || "לא ניתן לשמור");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id, name) => {
    if (!window.confirm(`למחוק את ${name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "המחיקה נכשלה");
      }

      setMessage("האתר הקבוע נמחק");
      await loadItems();
    } catch (error) {
      setMessage(error.message || "לא ניתן למחוק");
    }
  };

  return (
    <main className="ape-page" dir="rtl">
      <header className="ape-header">
        <div>
          <p>📌 אזור מנהל</p>
          <h1>ניהול אירועים קבועים</h1>
          <span>פשוט: שם אתר, תמונה וקישור לאתר.</span>
        </div>

        <div className="ape-header-actions">
          <Link to="/admin/events" className="ape-back">
            📅 ניהול אירועים רגילים
          </Link>

          <Link to="/admin" className="ape-back">
            חזרה לניהול
          </Link>
        </div>
      </header>

      {message && (
        <div className="ape-message" role="status">
          {message}
        </div>
      )}

      <form className="ape-form" onSubmit={submitForm}>
        <h2>
          {editingId
            ? "עריכת אתר קבוע"
            : "הוספת אתר קבוע"}
        </h2>

        <div className="ape-grid">
          <label>
            שם האתר *
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
            />
          </label>

          <label>
            קישור לאתר
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={updateField}
              placeholder="https://"
            />
          </label>

          <label className="ape-wide">
            קישור לתמונה
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={updateField}
              placeholder="https://"
            />
          </label>
        </div>

        <label className="ape-active">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={updateField}
          />
          פעיל ומוצג באתר
        </label>

        <div className="ape-form-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "שומר..."
              : editingId
              ? "שמור שינויים"
              : "הוסף אתר"}
          </button>

          <button
            type="button"
            className="ape-secondary"
            onClick={resetForm}
          >
            נקה טופס
          </button>
        </div>
      </form>

      <section className="ape-list">
        <h2>אתרים קבועים ({items.length})</h2>

        {loading ? (
          <p>טוען...</p>
        ) : items.length === 0 ? (
          <p>עדיין לא נוספו אתרים.</p>
        ) : (
          <div className="ape-cards">
            {items.map((item) => (
              <article className="ape-card" key={item._id}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="ape-image-placeholder">📌</div>
                )}

                <div className="ape-card-body">
                  <div className="ape-card-title">
                    <h3>{item.name}</h3>

                    <span
                      className={
                        item.active ? "ape-on" : "ape-off"
                      }
                    >
                      {item.active ? "פעיל" : "מוסתר"}
                    </span>
                  </div>

                  {item.website && (
                    <div className="ape-links">
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        🌐 אתר
                      </a>
                    </div>
                  )}

                  <div className="ape-actions">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                    >
                      ✏️ עריכה
                    </button>

                    <button
                      type="button"
                      className="ape-delete"
                      onClick={() =>
                        deleteItem(item._id, item.name)
                      }
                    >
                      🗑️ מחיקה
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

export default AdminPermanentEvents;
