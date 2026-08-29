import { useEffect, useMemo, useState } from "react";
import "./Tourism.css";

const API = "https://alonpc02026.onrender.com/api/tourism";

const WORLD_CATEGORIES = [
  ["app", "📱 אפליקציה"],
  ["info", "ℹ️ מידע"],
  ["place", "📍 מקום מעניין"],
];

const ISRAEL_CATEGORIES = [
  ["app", "📱 אפליקציית תיירות"],
  ["restaurant", "🍽️ מסעדה"],
  ["cafe", "☕ בית קפה"],
  ["fastFood", "🍔 מזון מהיר"],
  ["place", "📍 מקום מעניין"],
  ["info", "ℹ️ מידע"],
];

function emptyForm(scope) {
  return {
    scope,
    countryName: scope === "world" ? "" : "ישראל",
    flagEmoji: scope === "world" ? "" : "🇮🇱",
    flagImageUrl: "",
    category: "app",
    title: "",
    description: "",
    city: "",
    imageUrl: "",
    url: "",
    active: true,
  };
}

export default function AdminTourism({ scope }) {
  const isWorld = scope === "world";
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(() => emptyForm(scope));
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const categories = isWorld ? WORLD_CATEGORIES : ISRAEL_CATEGORIES;

  async function load() {
    try {
      const response = await fetch(`${API}?scope=${scope}`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage("לא ניתן לטעון את הנתונים.");
    }
  }

  useEffect(() => {
    setForm(emptyForm(scope));
    setEditingId("");
    load();
  }, [scope]);

  function change(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setMessage("");

    if (isWorld && !form.countryName.trim()) {
      setMessage("חובה להזין שם מדינה.");
      return;
    }
    if (!form.title.trim()) {
      setMessage("חובה להזין שם/כותרת.");
      return;
    }

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, scope }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "שמירה נכשלה");

      setMessage(editingId ? "הרשומה עודכנה." : "הרשומה נוספה.");
      setEditingId("");
      setForm(emptyForm(scope));
      await load();
    } catch (error) {
      setMessage(error.message || "שמירה נכשלה.");
    }
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      scope,
      countryName: item.countryName || (isWorld ? "" : "ישראל"),
      flagEmoji: item.flagEmoji || (isWorld ? "" : "🇮🇱"),
      flagImageUrl: item.flagImageUrl || "",
      category: item.category || "app",
      title: item.title || "",
      description: item.description || "",
      city: item.city || "",
      imageUrl: item.imageUrl || "",
      url: item.url || "",
      active: item.active !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("למחוק את הרשומה?")) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      if (editingId === id) {
        setEditingId("");
        setForm(emptyForm(scope));
      }
      await load();
    } catch {
      setMessage("המחיקה נכשלה.");
    }
  }

  const groupedTitle = useMemo(
    () => (isWorld ? "🌍 ניהול תיירות עולם" : "🇮🇱 ניהול תיירות בארץ"),
    [isWorld]
  );

  return (
    <main className="tourism-page">
      <section className="tourism-hero">
        <h1>{groupedTitle}</h1>
        <p>
          {isWorld
            ? "ניהול מדינות ודגלים, אפליקציות, מידע ומקומות מעניינים."
            : "ניהול אפליקציות תיירות, מסעדות, בתי קפה, מזון מהיר ומקומות מעניינים."}
        </p>
      </section>

      <form className="tourism-admin-form" onSubmit={save}>
        {isWorld && (
          <>
            <label>
              שם מדינה
              <input value={form.countryName} onChange={(e) => change("countryName", e.target.value)} required />
            </label>
            <label>
              דגל לאומי
              <input
                value={form.flagEmoji}
                onChange={(e) => change("flagEmoji", e.target.value)}
                placeholder="לדוגמה 🇬🇷"
              />
            </label>
            <label className="tourism-admin-full">
              קישור לתמונת דגל (אופציונלי)
              <input
                type="url"
                value={form.flagImageUrl}
                onChange={(e) => change("flagImageUrl", e.target.value)}
                placeholder="https://..."
              />
            </label>
          </>
        )}

        <label>
          סוג
          <select value={form.category} onChange={(e) => change("category", e.target.value)}>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <label>
          שם / כותרת
          <input value={form.title} onChange={(e) => change("title", e.target.value)} required />
        </label>

        <label>
          עיר / אזור
          <input value={form.city} onChange={(e) => change("city", e.target.value)} />
        </label>

        <label>
          קישור לתמונה
          <input type="url" value={form.imageUrl} onChange={(e) => change("imageUrl", e.target.value)} />
        </label>

        <label className="tourism-admin-full">
          קישור לאפליקציה / אתר / מקום
          <input type="url" value={form.url} onChange={(e) => change("url", e.target.value)} />
        </label>

        <label className="tourism-admin-full">
          מידע / תיאור
          <textarea value={form.description} onChange={(e) => change("description", e.target.value)} />
        </label>

        <label>
          פעיל
          <select value={form.active ? "yes" : "no"} onChange={(e) => change("active", e.target.value === "yes")}>
            <option value="yes">כן</option>
            <option value="no">לא</option>
          </select>
        </label>

        <div className="tourism-admin-actions">
          <button className="tourism-save" type="submit">
            {editingId ? "💾 שמור שינוי" : "➕ הוסף"}
          </button>
          {editingId && (
            <button
              className="tourism-cancel"
              type="button"
              onClick={() => {
                setEditingId("");
                setForm(emptyForm(scope));
              }}
            >
              ביטול
            </button>
          )}
        </div>
      </form>

      {message && <p><strong>{message}</strong></p>}

      <section className="tourism-admin-list">
        <h2>רשומות קיימות ({items.length})</h2>
        {items.length === 0 ? (
          <div className="tourism-empty">אין עדיין רשומות.</div>
        ) : (
          items.map((item) => (
            <article className="tourism-admin-row" key={item._id}>
              <div>
                <strong>
                  {isWorld ? `${item.flagEmoji || "🌍"} ${item.countryName} · ` : ""}
                  {categories.find(([key]) => key === item.category)?.[1] || item.category} · {item.title}
                </strong>
                {item.city && <div>📍 {item.city}</div>}
                {item.description && <div>{item.description}</div>}
                <small>{item.active === false ? "לא פעיל" : "פעיל"}</small>
              </div>
              <div className="tourism-admin-row-actions">
                <button type="button" onClick={() => edit(item)}>✏️ עריכה</button>
                <button type="button" onClick={() => remove(item._id)}>🗑️ מחיקה</button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
