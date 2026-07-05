import { useEffect, useState } from "react";

function AdminSecondHand() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

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
    const saved = JSON.parse(localStorage.getItem("secondHandItems")) || [];
    setItems(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל יד שנייה.</p>
      </section>
    );
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const saveItems = (list) => {
    localStorage.setItem("secondHandItems", JSON.stringify(list));
    setItems(list);
  };

  const clearForm = () => {
    setEditIndex(-1);
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

  const saveItem = () => {
    if (!form.name || !form.price) {
      setMessage("נא למלא שם מוצר ומחיר");
      return;
    }

    if (editIndex >= 0) {
      const list = [...items];
      list[editIndex] = form;
      saveItems(list);
      setMessage("✅ המוצר עודכן");
    } else {
      saveItems([...items, form]);
      setMessage("✅ מוצר יד שנייה נוסף");
    }

    clearForm();
  };

  const editItem = (index) => {
    setEditIndex(index);
    setForm(items[index]);
  };

  const deleteItem = (index) => {
    if (!window.confirm("למחוק מוצר יד שנייה?")) return;

    const list = items.filter((_, i) => i !== index);
    saveItems(list);
    setMessage("🗑️ המוצר נמחק");
  };

  return (
    <section className="loginBox">
      <h2>♻️ ניהול היד השנייה של אלון</h2>

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
        {editIndex >= 0 ? "💾 שמור עריכה" : "➕ הוסף מוצר"}
      </button>

      {editIndex >= 0 && <button onClick={clearForm}>❌ ביטול</button>}

      <p>{message}</p>

      <hr />

      {items.length === 0 && <p>אין עדיין מוצרים ביד השנייה.</p>}

      {items.map((item, index) => (
        <div className="adminService" key={index}>
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
          <p>{item.category}</p>
          <p>מותג: {item.brand}</p>
          <p>מצב: {item.condition}</p>
          <p>מחיר: ₪{item.price}</p>

          <button onClick={() => editItem(index)}>✏️ ערוך</button>
          <button onClick={() => deleteItem(index)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminSecondHand;