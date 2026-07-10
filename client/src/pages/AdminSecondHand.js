import { useEffect, useState } from "react";

function AdminSecondHand() {
  const user = JSON.parse(localStorage.getItem("user"));
  const API = "https://alonpc02026.onrender.com/api/second-hand";
  const UPLOAD_API = "https://alonpc02026.onrender.com/api/upload";

  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage("❌ שגיאה בטעינת מוצרי יד שנייה");
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      setMessage("בחר תמונה קודם");
      return;
    }

    try {
      const imageData = new FormData();
      imageData.append("image", selectedImage);

      const res = await fetch(UPLOAD_API, {
        method: "POST",
        body: imageData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      updateField("imageUrl", data.imageUrl);
      setMessage("✅ התמונה הועלתה בהצלחה");
    } catch {
      setMessage("❌ שגיאה בהעלאת תמונה");
    }
  };

  const clearForm = () => {
    setEditId(null);
    setSelectedImage(null);
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
    setSelectedImage(null);

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
      <h2>♻️ ניהול יד שנייה + העלאת תמונה</h2>

      <input placeholder="שם מוצר" value={form.name} onChange={(e) => updateField("name", e.target.value)} />

      <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
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

      <input placeholder="מותג" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />

      <select value={form.condition} onChange={(e) => updateField("condition", e.target.value)}>
        <option value="">מצב המוצר</option>
        <option value="חדש">חדש</option>
        <option value="כמו חדש">כמו חדש</option>
        <option value="טוב מאוד">טוב מאוד</option>
        <option value="טוב">טוב</option>
        <option value="דורש תיקון">דורש תיקון</option>
      </select>

      <input type="number" placeholder="מחיר" value={form.price} onChange={(e) => updateField("price", e.target.value)} />

      <textarea placeholder="תיאור קצר" value={form.description} onChange={(e) => updateField("description", e.target.value)} />

      <hr />

      <h3>🖼️ תמונת מוצר יד שנייה</h3>

      <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
      <button onClick={uploadImage}>⬆️ העלה תמונה</button>

      <input placeholder="קישור תמונה" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} />

      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="preview"
          style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 14, background: "white" }}
        />
      )}

      <hr />

      <button onClick={saveItem}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף מוצר יד שנייה"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h2>מוצרים קיימים ביד שנייה</h2>

      {items.map((item) => (
        <div className="adminService" key={item._id}>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10 }}
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
