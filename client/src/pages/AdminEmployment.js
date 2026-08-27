import { useEffect, useState } from "react";

const API = "https://alonpc02026.onrender.com/api/employment";

const EMPTY = {
  businessName: "",
  phone: "",
  businessUrl: "",
  active: true
};

export default function AdminEmployment() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const response = await fetch(API);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "לא ניתן לטעון נתונים");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function save(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "לא ניתן לשמור");

      setMessage(editingId ? "✅ העסק עודכן" : "✅ העסק נוסף");
      setForm(EMPTY);
      setEditingId("");
      await load();
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      businessName: item.businessName || "",
      phone: item.phone || "",
      businessUrl: item.businessUrl || "",
      active: item.active !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("למחוק את העסק?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main dir="rtl" style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <h1>💼 ניהול תעסוקה</h1>

      <form
        onSubmit={save}
        style={{
          display: "grid",
          gap: 14,
          maxWidth: 700,
          padding: 18,
          border: "2px solid #4676a8",
          borderRadius: 12
        }}
      >
        <label>
          שם עסק *
          <input
            required
            name="businessName"
            value={form.businessName}
            onChange={change}
          />
        </label>

        <label>
          טלפון
          <input
            name="phone"
            value={form.phone}
            onChange={change}
          />
        </label>

        <label>
          קישור לעסק
          <input
            type="url"
            name="businessUrl"
            value={form.businessUrl}
            onChange={change}
            placeholder="https://"
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={change}
          />
          {" "}פעיל ומוצג באתר
        </label>

        <div>
          <button type="submit">
            {editingId ? "💾 שמור שינויים" : "➕ הוסף עסק"}
          </button>
          {editingId && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => {
                  setEditingId("");
                  setForm(EMPTY);
                }}
              >
                ביטול
              </button>
            </>
          )}
        </div>
      </form>

      {message && <p><b>{message}</b></p>}

      <h2>כל העסקים בתעסוקה</h2>

      {items.map((item) => (
        <article
          key={item._id}
          style={{
            border: "2px solid #4676a8",
            borderRadius: 12,
            padding: 14,
            marginBottom: 10
          }}
        >
          <h3>{item.businessName}</h3>
          {item.phone && <p>{item.phone}</p>}
          {item.businessUrl && <p>{item.businessUrl}</p>}
          <button type="button" onClick={() => edit(item)}>✏️ עריכה</button>{" "}
          <button type="button" onClick={() => remove(item._id)}>🗑️ מחיקה</button>
        </article>
      ))}
    </main>
  );
}
