import { useEffect, useState } from "react";

function AdminShop() {
  const user = JSON.parse(localStorage.getItem("user"));
  const API = "https://alonpc02026.onrender.com/api/products";
  const UPLOAD_API = "https://alonpc02026.onrender.com/api/upload";

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    oldPrice: "",
    imageUrl: "",
    description: "",
    stock: "",
    condition: "חדש",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל מחובר יכול לנהל חנות.</p>
      </section>
    );
  }

  const loadProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setMessage("❌ שגיאה בטעינת מוצרים");
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
      price: "",
      oldPrice: "",
      imageUrl: "",
      description: "",
      stock: "",
      condition: "חדש",
    });
  };

  const saveProduct = async () => {
    if (!form.name || !form.category || !form.price) {
      setMessage("נא למלא שם מוצר, קטגוריה ומחיר");
      return;
    }

    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setMessage(editId ? "✅ המוצר עודכן" : "✅ המוצר נוסף");
      clearForm();
      loadProducts();
    } catch {
      setMessage("❌ שגיאה בשמירת מוצר");
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setSelectedImage(null);

    setForm({
      name: product.name || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      oldPrice: product.oldPrice || "",
      imageUrl: product.imageUrl || "",
      description: product.description || "",
      stock: product.stock || "",
      condition: product.condition || "חדש",
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("למחוק מוצר?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setMessage("🗑️ המוצר נמחק");
      loadProducts();
    } catch {
      setMessage("❌ שגיאה במחיקה");
    }
  };

  return (
    <section className="loginBox">
      <h2>🛒 ניהול חנות + העלאת תמונה</h2>

      <input placeholder="שם מוצר" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
      <input placeholder="קטגוריה" value={form.category} onChange={(e) => updateField("category", e.target.value)} />
      <input placeholder="מותג" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />
      <input type="number" placeholder="מחיר" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
      <input type="number" placeholder="מחיר לפני מבצע" value={form.oldPrice} onChange={(e) => updateField("oldPrice", e.target.value)} />
      <input placeholder="מלאי" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} />

      <select value={form.condition} onChange={(e) => updateField("condition", e.target.value)}>
        <option value="חדש">חדש</option>
        <option value="כמו חדש">כמו חדש</option>
        <option value="יד שנייה">יד שנייה</option>
        <option value="דורש תיקון">דורש תיקון</option>
      </select>

      <textarea placeholder="תיאור מוצר" value={form.description} onChange={(e) => updateField("description", e.target.value)} />

      <hr />

      <h3>🖼️ תמונת מוצר</h3>
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

      <button onClick={saveProduct}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף מוצר"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h2>מוצרים קיימים</h2>

      {products.map((product) => (
        <div className="adminService" key={product._id}>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10 }}
            />
          )}

          <h3>{product.name}</h3>
          <p>קטגוריה: {product.category}</p>
          <p>מותג: {product.brand}</p>
          <p>מחיר: ₪{product.price}</p>
          <p>מצב: {product.condition}</p>

          <button onClick={() => startEdit(product)}>✏️ ערוך</button>
          <button onClick={() => deleteProduct(product._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminShop;
