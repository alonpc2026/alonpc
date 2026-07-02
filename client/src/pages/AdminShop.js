import { useEffect, useState } from "react";

function AdminShop() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      setMessage("בחר תמונה");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          imageUrl: data.imageUrl,
        }));

        setMessage("התמונה הועלתה בהצלחה");
      } else {
        setMessage("שגיאה בהעלאת התמונה");
      }
    } catch (err) {
      console.error(err);
      setMessage("שגיאת שרת");
    }
  };

  const saveProduct = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (res.ok) {
        setMessage("המוצר נוסף בהצלחה");

        setForm({
          name: "",
          category: "",
          brand: "",
          price: "",
          stock: "",
          description: "",
          imageUrl: "",
        });

        setSelectedImage(null);

        loadProducts();
      } else {
        setMessage("שגיאה בשמירת המוצר");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("למחוק מוצר?")) return;

    await fetch(`http://localhost:3001/api/products/${id}`, {
      method: "DELETE",
    });

    loadProducts();
  };

  return (
    <section className="loginBox">

      <h2>🛒 ניהול חנות ALON PC</h2>

      <input
        placeholder="שם מוצר"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <input
        placeholder="קטגוריה"
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
      />

      <input
        placeholder="מותג"
        value={form.brand}
        onChange={(e) => updateField("brand", e.target.value)}
      />

      <input
        type="number"
        placeholder="מחיר"
        value={form.price}
        onChange={(e) => updateField("price", e.target.value)}
      />

      <input
        type="number"
        placeholder="מלאי"
        value={form.stock}
        onChange={(e) => updateField("stock", e.target.value)}
      />

      <textarea
        placeholder="תיאור"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <hr />

      <h3>🖼️ תמונת מוצר</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files[0])}
      />

      <button onClick={uploadImage}>
        ⬆️ העלה תמונה
      </button>

      {form.imageUrl && (
        <div style={{ marginTop: 15 }}>
          <img
            src={form.imageUrl}
            alt="preview"
            style={{
              width: 150,
              borderRadius: 12,
            }}
          />
        </div>
      )}

      <br />

      <button onClick={saveProduct}>
        💾 שמור מוצר
      </button>

      <p>{message}</p>

      <hr />

      <h2>📦 רשימת מוצרים</h2>

      {products.length === 0 && (
        <p>עדיין אין מוצרים.</p>
      )}

      {products.map((product) => (
        <div
          key={product._id}
          className="adminService"
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: 90,
                height: 90,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
          )}

          <h3>{product.name}</h3>

          <p>
            <strong>קטגוריה:</strong> {product.category}
          </p>

          <p>
            <strong>מותג:</strong> {product.brand}
          </p>

          <p>
            <strong>מחיר:</strong> ₪{product.price}
          </p>

          <p>
            <strong>מלאי:</strong> {product.stock}
          </p>

          <button
            onClick={() => deleteProduct(product._id)}
          >
            🗑️ מחק
          </button>
        </div>
      ))}
    </section>
  );
}

export default AdminShop;