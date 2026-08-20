import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminEmergency.css";

const API = "https://alonpc02026.onrender.com/api/emergency-contacts";

const EMPTY = {
  name: "",
  address: "",
  imageUrl: "",
  phone: "",
  emergencyRequestUrl: "",
  emergencyHours: "",
  accessiblePhone: "",
  description: "",
  active: true
};

export default function AdminEmergency() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}?admin=true`);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "טעינת שירותי החירום נכשלה");
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

  function clearForm() {
    setEditingId("");
    setForm(EMPTY);
  }

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      address: item.address || "",
      imageUrl: item.imageUrl || "",
      phone: item.phone || "",
      emergencyRequestUrl: item.emergencyRequestUrl || "",
      emergencyHours: item.emergencyHours || "",
      accessiblePhone: item.accessiblePhone || "",
      description: item.description || "",
      active: item.active !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("❌ חובה להזין שם");
      return;
    }

    if (!form.phone.trim() && !form.emergencyRequestUrl.trim()) {
      setMessage("❌ חובה להזין לפחות טלפון או קישור לפנייה בחירום");
      return;
    }

    try {
      setSaving(true);
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

      setMessage(editingId ? "✅ השירות עודכן" : "✅ שירות חירום נוסף");
      clearForm();
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function saveCore(item) {
    try {
      setSaving(true);
      setMessage("שומר...");

      const response = await fetch(`${API}/${item.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessiblePhone: item.accessiblePhone || "",
          emergencyRequestUrl: item.emergencyRequestUrl || "",
          emergencyHours: item.emergencyHours || "",
          address: item.address || "",
          imageUrl: item.imageUrl || "",
          description: item.description || ""
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "השמירה נכשלה");
      }

      setMessage("✅ פרטי השירות נשמרו");
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`למחוק את "${item.name}"?`)) return;

    try {
      const response = await fetch(`${API}/${item._id}`, {
        method: "DELETE"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "המחיקה נכשלה");
      }

      setMessage("🗑️ שירות החירום נמחק");
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  function updateItemLocal(id, field, value) {
    setItems((current) =>
      current.map((item) =>
        item._id === id ? { ...item, [field]: value } : item
      )
    );
  }

  return (
    <main className="admin-emergency-page" dir="rtl">
      <header className="admin-emergency-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>🚨 ניהול חירום</h1>
          <span>אפשר להוסיף שירותי חירום עם טלפון או עם קישור ישיר לפנייה בחירום.</span>
        </div>

        <div className="admin-emergency-top-actions">
          <Link to="/emergency">👁️ תצוגה באתר</Link>
          <Link to="/admin">⚙️ חזרה לניהול</Link>
        </div>
      </header>

      {message && <div className="admin-emergency-message">{message}</div>}

      <section className="admin-emergency-add-form">
        <h2>{editingId ? "✏️ עריכת שירות חירום" : "➕ הוספת שירות חירום נוסף"}</h2>

        <form onSubmit={save}>
          <label>
            <span>שם *</span>
            <input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              placeholder="לדוגמה: מוקד עירוני"
              required
            />
          </label>

          <label>
            <span>כתובת</span>
            <input
              value={form.address}
              onChange={(e) => change("address", e.target.value)}
              placeholder="רחוב, עיר"
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
            <span>טלפון</span>
            <input
              value={form.phone}
              onChange={(e) => change("phone", e.target.value)}
              placeholder="04-0000000"
            />
          </label>

          <label>
            <span>🔗 קישור לפנייה בחירום</span>
            <input
              type="url"
              value={form.emergencyRequestUrl}
              onChange={(e) => change("emergencyRequestUrl", e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label>
            <span>🕐 שעות פנייה בחירום</span>
            <input
              value={form.emergencyHours}
              onChange={(e) => change("emergencyHours", e.target.value)}
              placeholder="לדוגמה: 24/7 או א׳–ה׳ 08:00–22:00"
            />
          </label>

          <label>
            <span>♿📱 טלפון נגיש למוגבלי שמיעה</span>
            <input
              value={form.accessiblePhone}
              onChange={(e) => change("accessiblePhone", e.target.value)}
              placeholder="050-0000000"
            />
          </label>

          <label className="wide">
            <span>תיאור</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) => change("description", e.target.value)}
              placeholder="מידע קצר על השירות"
            />
          </label>

          {form.imageUrl && (
            <div className="emergency-image-preview wide">
              <img src={form.imageUrl} alt="תצוגה מקדימה" />
            </div>
          )}

          <div className="admin-emergency-form-actions wide">
            <button type="submit" disabled={saving}>
              {editingId ? "💾 שמירת שינויים" : "➕ הוספת שירות"}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={clearForm}>
                ביטול
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-emergency-list">
        <h2>שירותי חירום קיימים</h2>

        {loading && <p>טוען...</p>}

        <div className="admin-emergency-grid">
          {items.map((item) => (
            <article
              key={item._id}
              className={`admin-emergency-card ${item.isCore ? "core" : "custom"}`}
            >
              {item.imageUrl ? (
                <img className="emergency-admin-image" src={item.imageUrl} alt={item.name} />
              ) : (
                <div className="emergency-admin-fallback">🚨</div>
              )}

              <h2>{item.name}</h2>

              {item.isCore && (
                <span className="core-badge">שירות לאומי קבוע</span>
              )}

              <strong className="admin-emergency-number">{item.phone}</strong>

              {item.isCore ? (
                <>
                  <label className="accessible-phone-field">
                    <span>♿📱 טלפון נגיש למוגבלי שמיעה</span>
                    <input
                      value={item.accessiblePhone || ""}
                      onChange={(e) =>
                        updateItemLocal(item._id, "accessiblePhone", e.target.value)
                      }
                    />
                  </label>

                  <label className="accessible-phone-field">
                    <span>🔗 קישור לפנייה בחירום</span>
                    <input
                      type="url"
                      value={item.emergencyRequestUrl || ""}
                      onChange={(e) =>
                        updateItemLocal(item._id, "emergencyRequestUrl", e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </label>

                  <label className="accessible-phone-field">
                    <span>🕐 שעות פנייה בחירום</span>
                    <input
                      value={item.emergencyHours || ""}
                      onChange={(e) =>
                        updateItemLocal(item._id, "emergencyHours", e.target.value)
                      }
                      placeholder="לדוגמה: 24/7"
                    />
                  </label>

                  <label className="accessible-phone-field">
                    <span>כתובת</span>
                    <input
                      value={item.address || ""}
                      onChange={(e) =>
                        updateItemLocal(item._id, "address", e.target.value)
                      }
                    />
                  </label>

                  <label className="accessible-phone-field">
                    <span>קישור תמונה</span>
                    <input
                      value={item.imageUrl || ""}
                      onChange={(e) =>
                        updateItemLocal(item._id, "imageUrl", e.target.value)
                      }
                    />
                  </label>

                  <button
                    type="button"
                    className="save-accessible-phone"
                    onClick={() => saveCore(item)}
                  >
                    💾 שמירת פרטים
                  </button>
                </>
              ) : (
                <div className="custom-emergency-details">
                  {item.address && <p>📍 {item.address}</p>}
                  {item.accessiblePhone && <p>♿📱 {item.accessiblePhone}</p>}
                  {item.emergencyRequestUrl && (
                    <p>
                      🔗 <a href={item.emergencyRequestUrl} target="_blank" rel="noreferrer">
                        קישור לפנייה בחירום
                      </a>
                    </p>
                  )}
                  {item.emergencyHours && <p>🕐 שעות פנייה בחירום: {item.emergencyHours}</p>}
                  {item.description && <p>{item.description}</p>}

                  <div className="custom-emergency-actions">
                    <button type="button" onClick={() => startEdit(item)}>
                      ✏️ עריכה
                    </button>
                    <button type="button" className="danger" onClick={() => remove(item)}>
                      🗑️ מחיקה
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
