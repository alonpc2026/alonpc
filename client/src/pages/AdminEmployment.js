import { useEffect, useState } from "react";
import "./AdminEmployment.css";

const API = "https://alonpc02026.onrender.com/api/employment";
const EMPTY = { businessName: "", phone: "", whatsapp: "", businessUrl: "", logoUrl: "", active: true };

export default function AdminEmployment() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const r = await fetch(API);
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "לא ניתן לטעון");
      setItems(Array.isArray(d) ? d : []);
    } catch (e) { setMessage("❌ " + e.message); }
  }
  useEffect(() => { load(); }, []);

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm(old => ({ ...old, [name]: type === "checkbox" ? checked : value }));
  }

  async function save(e) {
    e.preventDefault();
    try {
      const r = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "לא ניתן לשמור");
      setForm(EMPTY); setEditingId(""); setMessage("✅ נשמר בהצלחה"); await load();
    } catch (e) { setMessage("❌ " + e.message); }
  }

  async function remove(id) {
    if (!window.confirm("למחוק את העסק?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    await load();
  }

  function edit(x) {
    setEditingId(x._id);
    setForm({
      businessName: x.businessName || "",
      phone: x.phone || "",
      whatsapp: x.whatsapp || "",
      businessUrl: x.businessUrl || "",
      logoUrl: x.logoUrl || "",
      active: x.active !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="employment-admin" dir="rtl">
      <h1>💼 ניהול תעסוקה</h1>
      <p className="employment-admin__lead">הוספת עסק לתחום התעסוקה</p>

      <form className="employment-form" onSubmit={save}>
        <label>🏢 שם העסק *
          <input required name="businessName" value={form.businessName} onChange={change} placeholder="לדוגמה: עסק לדוגמה" />
        </label>
        <label>📞 טלפון העסק
          <input name="phone" value={form.phone} onChange={change} placeholder="04-0000000" />
        </label>
        <label>💬 WhatsApp
          <input name="whatsapp" value={form.whatsapp} onChange={change} placeholder="972501234567" />
          <small>מומלץ מספר בינלאומי, לדוגמה 972501234567</small>
        </label>
        <label>🔗 קישור לעסק
          <input type="url" name="businessUrl" value={form.businessUrl} onChange={change} placeholder="https://example.com" />
        </label>
        <label className="employment-form__wide">🖼️ קישור ללוגו העסק
          <input type="url" name="logoUrl" value={form.logoUrl} onChange={change} placeholder="https://.../logo.jpg" />
        </label>

        {form.logoUrl && (
          <div className="employment-logo-preview">
            <span>תצוגה מקדימה:</span>
            <img src={form.logoUrl} alt="תצוגת לוגו" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        )}

        <label className="employment-active">
          <input type="checkbox" name="active" checked={form.active} onChange={change} />
          פעיל ומוצג באתר
        </label>

        <div className="employment-form__actions">
          <button className="employment-save" type="submit">{editingId ? "💾 שמור שינויים" : "➕ הוסף עסק"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(""); setForm(EMPTY); }}>ביטול עריכה</button>}
        </div>
      </form>

      {message && <div className="employment-message">{message}</div>}

      <h2>עסקים בתעסוקה</h2>
      <section className="employment-admin-list">
        {items.map(x => (
          <article className="employment-admin-card" key={x._id}>
            <div className="employment-admin-logo">
              {x.logoUrl ? <img src={x.logoUrl} alt={`לוגו ${x.businessName}`} /> : <span>🏢</span>}
            </div>
            <div className="employment-admin-info">
              <h3>{x.businessName}</h3>
              {x.phone && <p>📞 {x.phone}</p>}
              {x.whatsapp && <p>💬 {x.whatsapp}</p>}
              {x.businessUrl && <p>🔗 {x.businessUrl}</p>}
              <p>{x.active !== false ? "✅ פעיל" : "⛔ לא פעיל"}</p>
            </div>
            <div className="employment-admin-actions">
              <button type="button" onClick={() => edit(x)}>✏️ עריכה</button>
              <button type="button" onClick={() => remove(x._id)}>🗑️ מחיקה</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
