import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminPermanentEvents.css";

const API_BASE = process.env.REACT_APP_API_URL || "https://alonpc02026.onrender.com";
const API_URL = `${API_BASE}/api/permanent-events`;
const LANGUAGE_OPTIONS = ["עברית", "אנגלית", "רוסית", "ערבית", "אמהרית", "שפת הסימנים הישראלית"];

const emptyForm = {
  name: "",
  city: "",
  address: "",
  website: "",
  document: "",
  image: "",
  description: "",
  accessibility: "",
  languages: [],
  openingHours: "",
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
      if (!response.ok) throw new Error("טעינת הנתונים נכשלה");
      setItems(await response.json());
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
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleLanguage = (language) => {
    setForm((current) => ({
      ...current,
      languages: current.languages.includes(language)
        ? current.languages.filter((item) => item !== language)
        : [...current.languages, language],
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
    setMessage("");
  };

  const startEdit = (item) => {
    setForm({
      name: item.name || "",
      city: item.city || "",
      address: item.address || "",
      website: item.website || "",
      document: item.document || "",
      image: item.image || "",
      description: item.description || "",
      accessibility: item.accessibility || "",
      languages: Array.isArray(item.languages) ? item.languages : [],
      openingHours: item.openingHours || "",
      active: item.active !== false,
    });
    setEditingId(item._id);
    setMessage("מצב עריכה פעיל");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const duplicateItem = (item) => {
    setForm({
      name: `${item.name || ""} - עותק`,
      city: item.city || "",
      address: item.address || "",
      website: item.website || "",
      document: item.document || "",
      image: item.image || "",
      description: item.description || "",
      accessibility: item.accessibility || "",
      languages: Array.isArray(item.languages) ? item.languages : [],
      openingHours: item.openingHours || "",
      active: item.active !== false,
    });
    setEditingId("");
    setMessage("נוצר עותק בטופס. לחץ שמירה כדי להוסיף אותו.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setMessage("חובה להזין שם מקום");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "השמירה נכשלה");
      resetForm();
      setMessage(editingId ? "המקום עודכן בהצלחה" : "המקום נוסף בהצלחה");
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
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "המחיקה נכשלה");
      setMessage("המקום נמחק");
      await loadItems();
    } catch (error) {
      setMessage(error.message || "לא ניתן למחוק");
    }
  };

  return (
    <main className="ape-page" dir="rtl">
      <nav className="admin-permanent-type-switcher" aria-label="בחירת ניהול אירועים">
        <Link className="admin-permanent-type-button" to="/admin/events">📅 ניהול אירועים רגילים</Link>
        <Link className="admin-permanent-type-button active" to="/admin/permanent-events">📌 ניהול אירועים קבועים</Link>
      </nav>
      <header className="ape-header">
        <div>
          <p>📌 אזור מנהל</p>
          <h1>ניהול אירועים קבועים</h1>
          <span>הוסף מקומות, קישורים, מסמכים ופרטי נגישות.</span>
        </div>
        <Link to="/admin" className="ape-back">חזרה לניהול</Link>
      </header>

      {message && <div className="ape-message" role="status">{message}</div>}

      <form className="ape-form" onSubmit={submitForm}>
        <h2>{editingId ? "עריכת מקום" : "הוספת מקום קבוע"}</h2>
        <div className="ape-grid">
          <label>שם המקום *<input name="name" value={form.name} onChange={updateField} required /></label>
          <label>עיר<input name="city" value={form.city} onChange={updateField} /></label>
          <label>כתובת<input name="address" value={form.address} onChange={updateField} /></label>
          <label>שעות פעילות<input name="openingHours" value={form.openingHours} onChange={updateField} /></label>
          <label>קישור לאתר<input type="url" name="website" value={form.website} onChange={updateField} placeholder="https://" /></label>
          <label>קישור למסמך / PDF<input type="url" name="document" value={form.document} onChange={updateField} placeholder="https://" /></label>
          <label className="ape-wide">קישור לתמונה<input type="url" name="image" value={form.image} onChange={updateField} placeholder="https://" /></label>
          <label className="ape-wide">תיאור<textarea name="description" value={form.description} onChange={updateField} rows="4" /></label>
          <label className="ape-wide">פרטי נגישות<textarea name="accessibility" value={form.accessibility} onChange={updateField} rows="3" /></label>
        </div>

        <fieldset className="ape-languages">
          <legend>שפות ונגישות תקשורתית</legend>
          {LANGUAGE_OPTIONS.map((language) => (
            <label key={language}>
              <input type="checkbox" checked={form.languages.includes(language)} onChange={() => toggleLanguage(language)} />
              {language}
            </label>
          ))}
        </fieldset>

        <label className="ape-active">
          <input type="checkbox" name="active" checked={form.active} onChange={updateField} />
          הצג את המקום באתר הציבורי
        </label>

        <div className="ape-form-actions">
          <button type="submit" disabled={saving}>{saving ? "שומר..." : editingId ? "שמור שינויים" : "הוסף מקום"}</button>
          <button type="button" className="ape-secondary" onClick={resetForm}>נקה טופס</button>
        </div>
      </form>

      <section className="ape-list">
        <h2>מקומות קיימים ({items.length})</h2>
        {loading ? <p>טוען...</p> : items.length === 0 ? <p>עדיין לא נוספו מקומות.</p> : (
          <div className="ape-cards">
            {items.map((item) => (
              <article className="ape-card" key={item._id}>
                {item.image && <img src={item.image} alt={item.name} />}
                <div className="ape-card-body">
                  <div className="ape-card-title"><h3>{item.name}</h3><span className={item.active ? "ape-on" : "ape-off"}>{item.active ? "פעיל" : "מוסתר"}</span></div>
                  {(item.city || item.address) && <p>📍 {[item.city, item.address].filter(Boolean).join(", ")}</p>}
                  {item.openingHours && <p>🕒 {item.openingHours}</p>}
                  {item.description && <p>{item.description}</p>}
                  {item.accessibility && <p>♿ {item.accessibility}</p>}
                  {item.languages?.length > 0 && <p>🗣️ {item.languages.join(" • ")}</p>}
                  <div className="ape-links">
                    {item.website && <a href={item.website} target="_blank" rel="noreferrer">אתר המקום</a>}
                    {item.document && <a href={item.document} target="_blank" rel="noreferrer">מסמך / תוכנייה</a>}
                  </div>
                  <div className="ape-actions">
                    <button type="button" onClick={() => startEdit(item)}>✏️ עריכה</button>
                    <button type="button" onClick={() => duplicateItem(item)}>📋 שכפל</button>
                    <button type="button" className="ape-delete" onClick={() => deleteItem(item._id, item.name)}>🗑️ מחיקה</button>
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