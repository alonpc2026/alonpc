import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminEvents.css";

const API_BASE = process.env.REACT_APP_API_BASE || "https://alonpc02026.onrender.com/api";
const LANGUAGES = ["עברית", "אנגלית", "רוסית", "אמהרית", "ערבית"];
const SIGN_LANGUAGES = ["שפת סימנים ישראלית", "שפת סימנים רוסית", "שפת סימנים אמריקאית", "שפת סימנים ערבית"];
const ACCESS_OPTIONS = [
  ["transcription", "תמלול בזמן אמת"], ["captions", "כתוביות"], ["signLanguage", "תרגום לשפת סימנים"],
  ["hearingLoop", "לולאת השראה / מערכת עזר לשמיעה"], ["wheelchairAccess", "נגיש לכיסא גלגלים"],
  ["accessibleParking", "חניה נגישה"], ["accessibleRestrooms", "שירותים נגישים"], ["writtenContact", "יצירת קשר בכתב / WhatsApp"],
];
const emptyAccess = Object.fromEntries(ACCESS_OPTIONS.map(([key]) => [key, false]));
const EMPTY_FORM = {
  title: "", startDate: "", endDate: "", startTime: "", endTime: "", allDay: false,
  city: "", location: "", description: "", website: "", imageUrl: "", active: true,
  accessibility: emptyAccess, languages: [], captionLanguages: [], signLanguages: [],
};

const getToken = () => localStorage.getItem("token") || "";
const normalizeEvent = (item = {}) => ({
  ...EMPTY_FORM, ...item,
  startDate: item.startDate || item.date || "",
  endDate: item.endDate || item.startDate || item.date || "",
  startTime: item.startTime || item.time || "",
  accessibility: { ...emptyAccess, ...(item.accessibility || {}) },
  languages: Array.isArray(item.languages) ? item.languages : [],
  captionLanguages: Array.isArray(item.captionLanguages) ? item.captionLanguages : [],
  signLanguages: Array.isArray(item.signLanguages) ? item.signLanguages : [],
});

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const apiRequest = useCallback(async (path = "", options = {}) => {
    const response = await fetch(`${API_BASE}/events${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, ...(options.headers || {}) },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "הפעולה נכשלה");
    return data;
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest("");
      setEvents((Array.isArray(data) ? data : data.events || []).map(normalizeEvent));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const text = search.trim().toLowerCase();
    return events.filter((event) => !text || `${event.title} ${event.city} ${event.location} ${event.description}`.toLowerCase().includes(text));
  }, [events, search]);

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const toggleArrayValue = (field, value) => setForm((current) => ({
    ...current,
    [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value],
  }));
  const toggleAccess = (key) => setForm((current) => ({
    ...current,
    accessibility: { ...current.accessibility, [key]: !current.accessibility[key] },
  }));
  const resetForm = () => { setEditingId(""); setForm(EMPTY_FORM); };

  const startEdit = (event) => {
    setEditingId(event._id);
    setForm(normalizeEvent(event));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setMessage(""); setError("");
    try {
      if (!form.title.trim()) throw new Error("יש למלא שם אירוע");
      if (!form.startDate || !form.endDate) throw new Error("יש למלא תאריך התחלה וסיום");
      await apiRequest(editingId ? `/${editingId}` : "", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify({ ...form, title: form.title.trim(), date: form.startDate, time: form.allDay ? "" : form.startTime }),
      });
      setMessage(editingId ? "האירוע עודכן בהצלחה" : "האירוע נוסף בהצלחה");
      resetForm();
      await loadEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(event) {
    if (!window.confirm(`האם למחוק את האירוע "${event.title}"?`)) return;
    try {
      await apiRequest(`/${event._id}`, { method: "DELETE" });
      setMessage("האירוע נמחק בהצלחה");
      await loadEvents();
    } catch (err) { setError(err.message); }
  }

  return (
    <main className="admin-events-page" dir="rtl">
      <header className="admin-events-header">
        <div><p>🔒 אזור מנהל</p><h1>ניהול אירועים נגישים</h1><span>הוספה, עריכה, שפות והתאמות נגישות.</span></div>
        <nav><Link to="/israel-events">צפייה בלוח האירועים</Link><Link to="/admin">חזרה לניהול</Link></nav>
      </header>

      {message && <div className="admin-events-notice success">{message}</div>}
      {error && <div className="admin-events-notice error">{error}</div>}

      <section className="admin-events-panel">
        <h2>{editingId ? "עריכת אירוע" : "הוספת אירוע חדש"}</h2>
        <form onSubmit={handleSubmit}>
          <label>שם האירוע *<input value={form.title} onChange={(e) => updateField("title", e.target.value)} required /></label>
          <div className="admin-events-row">
            <label>תאריך התחלה *<input type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} required /></label>
            <label>תאריך סיום *<input type="date" min={form.startDate || undefined} value={form.endDate} onChange={(e) => updateField("endDate", e.target.value)} required /></label>
          </div>
          <label className="check"><input type="checkbox" checked={form.allDay} onChange={(e) => setForm((c) => ({ ...c, allDay: e.target.checked, startTime: e.target.checked ? "" : c.startTime, endTime: e.target.checked ? "" : c.endTime }))} />אירוע של כל היום</label>
          {!form.allDay && <div className="admin-events-row">
            <label>שעת התחלה<input type="time" value={form.startTime} onChange={(e) => updateField("startTime", e.target.value)} /></label>
            <label>שעת סיום<input type="time" value={form.endTime} onChange={(e) => updateField("endTime", e.target.value)} /></label>
          </div>}
          <div className="admin-events-row"><label>עיר<input value={form.city} onChange={(e) => updateField("city", e.target.value)} /></label><label>מקום<input value={form.location} onChange={(e) => updateField("location", e.target.value)} /></label></div>
          <label>תיאור<textarea rows="5" value={form.description} onChange={(e) => updateField("description", e.target.value)} /></label>
          <div className="admin-events-row"><label>קישור לאתר<input type="url" value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://" /></label><label>קישור לתמונה<input type="url" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} placeholder="https://" /></label></div>

          <fieldset><legend>נגישות באירוע</legend><div className="options-grid">{ACCESS_OPTIONS.map(([key, label]) => <label className="check" key={key}><input type="checkbox" checked={form.accessibility[key]} onChange={() => toggleAccess(key)} />{label}</label>)}</div></fieldset>
          <fieldset><legend>שפות האירוע</legend><div className="options-grid">{LANGUAGES.map((language) => <label className="check" key={language}><input type="checkbox" checked={form.languages.includes(language)} onChange={() => toggleArrayValue("languages", language)} />{language}</label>)}</div></fieldset>
          <fieldset><legend>שפות כתוביות</legend><div className="options-grid">{LANGUAGES.map((language) => <label className="check" key={language}><input type="checkbox" checked={form.captionLanguages.includes(language)} onChange={() => toggleArrayValue("captionLanguages", language)} />{language}</label>)}</div></fieldset>
          <fieldset><legend>שפות סימנים</legend><div className="options-grid">{SIGN_LANGUAGES.map((language) => <label className="check" key={language}><input type="checkbox" checked={form.signLanguages.includes(language)} onChange={() => toggleArrayValue("signLanguages", language)} />{language}</label>)}</div></fieldset>
          <label className="check"><input type="checkbox" checked={form.active} onChange={(e) => updateField("active", e.target.checked)} />אירוע פעיל ומוצג באתר</label>
          <div className="admin-events-actions"><button type="submit" disabled={saving}>{saving ? "שומר..." : editingId ? "שמירת שינויים" : "הוספת האירוע"}</button>{editingId && <button type="button" className="secondary" onClick={resetForm}>ביטול עריכה</button>}</div>
        </form>
      </section>

      <section className="admin-events-panel"><div className="admin-events-tools"><h2>כל האירועים ({filteredEvents.length})</h2><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש אירוע" /></div>
        {loading ? <p>טוען...</p> : <div className="admin-events-grid">{filteredEvents.map((event) => <article className="admin-event-card" key={event._id}>{event.imageUrl && <img src={event.imageUrl} alt={event.title} />}<div><h3>{event.title}</h3><p>📅 {event.startDate}{event.endDate !== event.startDate ? ` עד ${event.endDate}` : ""}</p><p>📍 {event.city || "ללא עיר"}{event.location ? ` · ${event.location}` : ""}</p><div className="chips">{event.languages.map((x) => <span key={x}>{x}</span>)}{ACCESS_OPTIONS.filter(([key]) => event.accessibility[key]).map(([key, label]) => <span key={key}>{label}</span>)}</div><div className="card-actions"><button onClick={() => startEdit(event)}>עריכה</button><button className="danger" onClick={() => removeEvent(event)}>מחיקה</button></div></div></article>)}</div>}
      </section>
    </main>
  );
}
