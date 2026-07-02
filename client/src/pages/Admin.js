import { useEffect, useState } from "react";

function AdminShop() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    warranty: "",
    sku: "",
    active: true,
    featured: false,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setMessage("שגיאה בטעינת מוצרים ❌"));
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      setMessage("בחר תמונה קודם ❌");
      return;
    }

    const imageData = new FormData();
    imageData.append("image", selectedImage);

    const response = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: imageData,
    });

    const data = await response.json();

    if (response.ok) {
      updateForm("imageUrl", data.imageUrl);
      setMessage("התמונה הועלתה בהצלחה ✅");
    } else {
      setMessage("שגיאה בהעלאת תמונה ❌");
    }
  };

  const clearForm = () => {
    setEditId(null);
    setSelectedImage(null);
    setForm({
      name: "",
      category: "",
      brand: "",
      model: "",
      price: "",
      stock: "",
      description: "",
      imageUrl: "",
      warranty: "",
      sku: "",
      active: true,
      featured: false,
    });
  };

  const saveProduct = async () => {
    const url = editId
      ? `http://localhost:3001/api/products/${editId}`
      : "http://localhost:3001/api/products";

    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });

    if (response.ok) {
      setMessage(editId ? "המוצר עודכן בהצלחה ✅" : "המוצר נוסף בהצלחה ✅");
      clearForm();
      loadProducts();
    } else {
      setMessage("שגיאה בשמירת מוצר ❌");
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name || "",
      category: product.category || "",
      brand: product.brand || "",
      model: product.model || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      warranty: product.warranty || "",
      sku: product.sku || "",
      active: product.active ?? true,
      featured: product.featured ?? false,
    });
    setMessage("מצב עריכה פעיל ✏️");
  };

  const deleteProduct = async (id) => {
    const response = await fetch(`http://localhost:3001/api/products/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMessage("המוצר נמחק בהצלחה 🗑️");
      loadProducts();
    }
  };

  return (
    <section className="loginBox">
      <h3>🛒 ניהול חנות אלון</h3>

      <input placeholder="שם מוצר" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
      <input placeholder="קטגוריה" value={form.category} onChange={(e) => updateForm("category", e.target.value)} />
      <input placeholder="מותג" value={form.brand} onChange={(e) => updateForm("brand", e.target.value)} />
      <input placeholder="דגם" value={form.model} onChange={(e) => updateForm("model", e.target.value)} />
      <input type="number" placeholder="מחיר" value={form.price} onChange={(e) => updateForm("price", e.target.value)} />
      <input type="number" placeholder="מלאי" value={form.stock} onChange={(e) => updateForm("stock", e.target.value)} />
      <input placeholder="אחריות" value={form.warranty} onChange={(e) => updateForm("warranty", e.target.value)} />
      <input placeholder="מק״ט" value={form.sku} onChange={(e) => updateForm("sku", e.target.value)} />
      <textarea placeholder="תיאור מוצר" value={form.description} onChange={(e) => updateForm("description", e.target.value)} />

      <label>
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => updateForm("featured", e.target.checked)}
        />
        ⭐ מוצר מומלץ
      </label>

      <hr />

      <h3>העלאת תמונת מוצר</h3>

      <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />

      <button onClick={uploadImage}>⬆️ העלה תמונה</button>

      {form.imageUrl && (
        <div>
          <p>תצוגה מקדימה:</p>
          <img src={form.imageUrl} alt="מוצר" style={{ maxWidth: "180px", borderRadius: "14px" }} />
        </div>
      )}

      <hr />

      <button onClick={saveProduct}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף מוצר"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h3>מוצרים קיימים</h3>

      {products.map((product) => (
        <div className="adminService" key={product._id}>
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} style={{ maxWidth: "90px", marginBottom: "8px" }} />
          )}

          <strong>{product.name}</strong>
          <br />
          <small>{product.category} | ₪{product.price} | מלאי: {product.stock}</small>
          <br />

          <button onClick={() => startEdit(product)}>✏️ ערוך</button>
          <button onClick={() => deleteProduct(product._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminShop;