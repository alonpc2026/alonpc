import { useEffect, useState } from "react";

function AdminSecondHand() {
  const user = JSON.parse(localStorage.getItem("user"));
  const API = "http://localhost:3001/api/second-hand";

  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    condition: "",
    price: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    loadItems();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל יד שנייה.</p>
      </section>
    );
  }

  const loadItems = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setItems(data);
    } catch {
      setMessage("❌ שגיאה בטעינת מוצרי יד שנייה");
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const clearForm = () => {
    setEditId(null);
    setForm({
      name: "",
      category: "",
      brand: "",
      condition: "",
      price: "",
      imageUrl: "",
      description: "",
    });
  };

  const saveItem = async () => {
    if (!form.name || !form.price) {
      setMessage("נא למלא שם מוצר ומחיר");
      return;
    }

    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setMessage(editId ? "✅ מוצר יד שנייה עודכן" : "✅ מוצר יד שנייה נוסף");
      clearForm();
      loadItems();
    } catch {
      setMessage("❌ שגיאה בשמירת מוצר יד שנייה");
    }
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name || "",
      category: item.category || "",
      brand: item.brand || "",
      condition: item.condition || "",
      price: item.price || "",
      imageUrl: item.imageUrl || "",
      description: item.description || "",
    });
  };

  const deleteItem = async (id) => {
    if (!window.confirm("למחוק מוצר יד שנייה?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setMessage("🗑️ מוצר יד שנייה נמחק");
      loadItems();
    } catch {
      setMessage("❌ שגיאה במחיקה");
    }
  };

  return (
    <section className="loginBox">
      <h2>♻️ ניהול יד שנייה MongoDB</h2>

      <input
        placeholder="שם מוצר"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <select
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
      >
        <option value="">בחר קטגוריה</option>
        <option value="מחשב נייד">מחשב נייד</option>
        <option value="מחשב נייח">מחשב נייח</option>
        <option value="מסך">מסך</option>
        <option value="מדפסת">מדפסת</option>
        <option value="חלקי מחשב">חלקי מחשב</option>
        <option value="ציוד היקפי">ציוד היקפי</option>
        <option value="ציוד נגישות">ציוד נגישות</option>
        <option value="שונות">שונות</option>
      </select>

      <input
        placeholder="מותג"
        value={form.brand}
        onChange={(e) => updateField("brand", e.target.value)}
      />

      <select
        value={form.condition}
        onChange={(e) => updateField("condition", e.target.value)}
      >
        <option value="">מצב המוצר</option>
        <option value="חדש">חדש</option>
        <option value="כמו חדש">כמו חדש</option>
        <option value="טוב מאוד">טוב מאוד</option>
        <option value="טוב">טוב</option>
        <option value="דורש תיקון">דורש תיקון</option>
      </select>

      <input
        type="number"
        placeholder="מחיר"
        value={form.price}
        onChange={(e) => updateField("price", e.target.value)}
      />

      <input
        placeholder="קישור לתמונה"
        value={form.imageUrl}
        onChange={(e) => updateField("imageUrl", e.target.value)}
      />

      <textarea
        placeholder="תיאור קצר"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <button onClick={saveItem}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף מוצר יד שנייה"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h2>מוצרים קיימים ביד שנייה</h2>

      {items.length === 0 && <p>אין עדיין מוצרים ביד השנייה.</p>}

      {items.map((item) => (
        <div className="adminService" key={item._id}>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: 90,
                height: 90,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
          )}

          <h3>{item.name}</h3>
          <p>קטגוריה: {item.category}</p>
          <p>מותג: {item.brand}</p>
          <p>מצב: {item.condition}</p>
          <p>מחיר: ₪{item.price}</p>
          <p>{item.description}</p>

          <button onClick={() => startEdit(item)}>✏️ ערוך</button>
          <button onClick={() => deleteItem(item._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminSecondHand;