import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GovernmentAdmin.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001/api"
    : "https://alonpc02026.onrender.com/api");

const EMPTY_FORM = {
  name: "",
  category: "חירום וביטחון",
  icon: "🏛️",
  cardColor: "#0b5ed7",
  displayOrder: 0,
  logoUrl: "",
  phone: "",
  accessiblePhone: "",
  accessiblePhoneType: "SMS",
  accessibleEmail: "",
  accessibilityNote: "",
  websiteUrl: "",
  active: true,
};

const CATEGORIES = [
  "חירום וביטחון",
  "משרדי ממשלה",
  "בריאות",
  "תחבורה",
  "רשויות מקומיות",
  "ביטוח וזכויות",
  "תשתיות ושירותים",
  "בנקים ופיננסים",
  "אחר",
];

export default function GovernmentAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadItems() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/services?serviceType=government`);
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data.message || "טעינת הרשימה נכשלה");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      `${item.name} ${item.category} ${item.phone} ${item.accessiblePhone} ${item.accessibleEmail}`
        .toLowerCase()
        .includes(query)
    );
  }, [items, search]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId("");
    setMessage("");
  }

  function editItem(item) {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      category: item.category || "חירום וביטחון",
      icon: item.icon || "🏛️",
      cardColor: item.cardColor || "#0b5ed7",
      displayOrder: item.displayOrder || 0,
      logoUrl: item.logoUrl || item.imageUrl || "",
      phone: item.phone || "",
      accessiblePhone: item.accessiblePhone || "",
      accessiblePhoneType: item.accessiblePhoneType || "SMS",
      accessibleEmail: item.accessibleEmail || "",
      accessibilityNote: item.accessibilityNote || "",
      websiteUrl: item.websiteUrl || item.link || "",
      active: item.active !== false,
    });
    setMessage(`✏️ עריכת ${item.name}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        serviceType: "government",
        businessName: "",
        displayOrder: Number(form.displayOrder) || 0,
      };
      const url = editingId
        ? `${API_BASE}/services/${editingId}`
        : `${API_BASE}/services`;
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "שמירת הגוף נכשלה");
      setMessage(editingId ? "✅ הגוף עודכן בהצלחה" : "✅ הגוף נוסף בהצלחה");
      resetForm();
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    if (!window.confirm(`למחוק את ${item.name}?`)) return;
    try {
      const response = await fetch(`${API_BASE}/services/${item._id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "המחיקה נכשלה");
      setMessage("✅ הגוף נמחק");
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  return (
    <main className="government-admin-page" dir="rtl">
      <header className="government-admin-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>🏛️ ניהול ממשלתי וציבורי</h1>
          <span>הוספה ושינוי של מספר ראשי, מספר נגיש ודוא״ל נגיש.</span>
        </div>
        <div className="government-admin-header-links">
          <Link to="/government">👁️ תצוגה באתר</Link>
          <Link to="/admin">↩️ פורטל ניהול</Link>
        </div>
      </header>

      <form className="government-admin-form" onSubmit={saveItem}>
        <h2>{editingId ? "עריכת גוף קיים" : "הוספת גוף חדש"}</h2>
        <div className="government-admin-fields">
          <label>שם הגוף *<input name="name" value={form.name} onChange={updateField} required /></label>
          <label>קטגוריה *
            <select name="category" value={form.category} onChange={updateField} required>
              {CATEGORIES.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
          <label>סמל קצר<input name="icon" value={form.icon} onChange={updateField} placeholder="🏛️" /></label>
          <label>צבע המשבצת<input name="cardColor" type="color" value={form.cardColor} onChange={updateField} /></label>
          <label>סדר תצוגה<input name="displayOrder" type="number" value={form.displayOrder} onChange={updateField} /></label>
          <label className="wide-field">קישור ללוגו<input name="logoUrl" type="url" value={form.logoUrl} onChange={updateField} placeholder="https://..." /></label>
          <label>☎️ מספר ראשי<input name="phone" value={form.phone} onChange={updateField} placeholder="100 או *1234" /></label>
          <label>♿ מספר נגיש<input name="accessiblePhone" value={form.accessiblePhone} onChange={updateField} placeholder="מספר SMS / WhatsApp" /></label>
          <label>סוג המספר הנגיש
            <select name="accessiblePhoneType" value={form.accessiblePhoneType} onChange={updateField}>
              <option value="SMS">SMS</option><option value="WhatsApp">WhatsApp</option><option value="טלפון">טלפון</option><option value="וידאו">וידאו</option><option value="צ׳אט">צ׳אט</option><option value="אחר">אחר</option>
            </select>
          </label>
          <label className="wide-field">📧 דוא״ל נגיש<input name="accessibleEmail" type="email" value={form.accessibleEmail} onChange={updateField} placeholder="accessibility@example.gov.il" /></label>
          <label className="wide-field">🌐 אתר רשמי<input name="websiteUrl" type="url" value={form.websiteUrl} onChange={updateField} placeholder="https://..." /></label>
          <label className="wide-field">הערת נגישות<textarea name="accessibilityNote" value={form.accessibilityNote} onChange={updateField} rows="3" placeholder="למשל: השירות פעיל בימים א׳–ה׳" /></label>
          <label className="checkbox-field"><input name="active" type="checkbox" checked={form.active} onChange={updateField} /> הצג באתר</label>
        </div>
        <div className="government-admin-actions">
          <button type="submit" disabled={saving}>{saving ? "שומר..." : editingId ? "💾 שמור שינויים" : "➕ הוסף גוף"}</button>
          {editingId && <button type="button" className="cancel" onClick={resetForm}>ביטול עריכה</button>}
        </div>
        {message && <p className="government-admin-message" role="status">{message}</p>}
      </form>

      <section className="government-admin-list">
        <div className="government-admin-list-title">
          <h2>גופים קיימים ({items.length})</h2>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="חיפוש ברשימה" />
        </div>
        {loading ? <p>טוען...</p> : (
          <div className="government-admin-table-wrap">
            <table>
              <thead><tr><th>לוגו</th><th>שם</th><th>מספר ראשי</th><th>מספר נגיש</th><th>דוא״ל נגיש</th><th>מצב</th><th>פעולות</th></tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td>{item.logoUrl ? <img src={item.logoUrl} alt="" /> : <span>{item.icon || "🏛️"}</span>}</td>
                    <td><strong>{item.name}</strong><small>{item.category}</small></td>
                    <td>{item.phone || "—"}</td>
                    <td>{item.accessiblePhone || "—"}<small>{item.accessiblePhoneType}</small></td>
                    <td>{item.accessibleEmail || "—"}</td>
                    <td>{item.active !== false ? "✅ פעיל" : "⛔ מוסתר"}</td>
                    <td><button type="button" onClick={() => editItem(item)}>✏️ עריכה</button><button type="button" className="delete" onClick={() => deleteItem(item)}>🗑️ מחיקה</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
