import { useCallback, useEffect, useState } from "react";

const API = "https://alonpc02026.onrender.com/api/products";

const EMPTY_FORM = {
  name: "",
  category: "מחשבים ניידים",
  brand: "",
  price: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
  condition: "חדש",
};

function AdminShop() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageError, setImageError] = useState(false);

  const categories = [
    "מחשבים ניידים",
    "מחשבים נייחים",
    "מסכים",
    "מדפסות",
    "טלפונים",
    "טאבלטים",
    "אביזרי מחשב",
    "ציוד נגישות",
    "אחר",
  ];

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("לא ניתן לקבל את המוצרים");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setProducts([]);
      setMessage(`❌ שגיאה בטעינת מוצרים: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (field === "imageUrl") {
      setImageError(false);
    }
  };

  const clearForm = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setImageError(false);
  };

  const normalizeUrl = (url) => {
    const cleanUrl = String(url || "").trim();

    if (!cleanUrl) {
      return "";
    }

    if (
      cleanUrl.startsWith("https://") ||
      cleanUrl.startsWith("http://")
    ) {
      return cleanUrl;
    }

    return `https://${cleanUrl}`;
  };

  const saveProduct = async () => {
    if (!form.name.trim()) {
      setMessage("נא למלא שם מוצר");
      return;
    }

    if (!form.category.trim()) {
      setMessage("נא לבחור קטגוריה");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setMessage("נא למלא מחיר תקין");
      return;
    }

    const fixedImageUrl = normalizeUrl(form.imageUrl);
    const fixedVideoUrl = normalizeUrl(form.videoUrl);

    if (
      fixedImageUrl &&
      !fixedImageUrl.startsWith("https://")
    ) {
      setMessage(
        "❌ כתובת התמונה חייבת להתחיל ב־https://"
      );
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      imageUrl: fixedImageUrl,
      videoUrl: fixedVideoUrl,
      condition: form.condition,
    };

    try {
      const response = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "שגיאה בשמירת המוצר"
        );
      }

      setMessage(
        editId
          ? "✅ המוצר עודכן בהצלחה"
          : "✅ המוצר נוסף בהצלחה"
      );

      clearForm();
      await loadProducts();
    } catch (error) {
      setMessage(`❌ לא ניתן לשמור מוצר: ${error.message}`);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);

    setForm({
      name: product.name || "",
      category: product.category || "מחשבים ניידים",
      brand: product.brand || "",
      price: product.price ?? "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      videoUrl:
        product.videoUrl ||
        product.videoLink ||
        product.youtubeUrl ||
        "",
      condition: product.condition || "חדש",
    });

    setImageError(false);
    setMessage("✏️ מצב עריכה פעיל");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = async (id) => {
    const approved = window.confirm(
      "האם למחוק את המוצר?"
    );

    if (!approved) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "שגיאה במחיקה"
        );
      }

      setMessage("🗑️ המוצר נמחק בהצלחה");
      await loadProducts();
    } catch (error) {
      setMessage(`❌ לא ניתן למחוק מוצר: ${error.message}`);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox" dir="rtl">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל מחובר יכול לנהל את החנות.</p>
      </section>
    );
  }

  return (
    <section className="loginBox" dir="rtl">
      <h2>🛒 ניהול החנות</h2>

      <label htmlFor="product-name">
        שם המוצר
      </label>

      <input
        id="product-name"
        type="text"
        placeholder="לדוגמה: Lenovo ThinkBook 16"
        value={form.name}
        onChange={(event) =>
          updateField("name", event.target.value)
        }
      />

      <label htmlFor="product-category">
        קטגוריה
      </label>

      <select
        id="product-category"
        value={form.category}
        onChange={(event) =>
          updateField("category", event.target.value)
        }
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label htmlFor="product-brand">
        מותג
      </label>

      <input
        id="product-brand"
        type="text"
        placeholder="לדוגמה: Lenovo"
        value={form.brand}
        onChange={(event) =>
          updateField("brand", event.target.value)
        }
      />

      <label htmlFor="product-price">
        מחיר
      </label>

      <input
        id="product-price"
        type="number"
        min="0"
        step="0.01"
        placeholder="מחיר בשקלים"
        value={form.price}
        onChange={(event) =>
          updateField("price", event.target.value)
        }
      />

      <label htmlFor="product-condition">
        מצב המוצר
      </label>

      <select
        id="product-condition"
        value={form.condition}
        onChange={(event) =>
          updateField("condition", event.target.value)
        }
      >
        <option value="חדש">חדש</option>
        <option value="כמו חדש">כמו חדש</option>
        <option value="יד שנייה">יד שנייה</option>
        <option value="דורש תיקון">דורש תיקון</option>
      </select>

      <label htmlFor="product-description">
        תיאור המוצר
      </label>

      <textarea
        id="product-description"
        placeholder="כתוב מפרט ותיאור מלא של המוצר"
        value={form.description}
        onChange={(event) =>
          updateField("description", event.target.value)
        }
      />

      <label htmlFor="product-image">
        קישור ישיר לתמונה
      </label>

      <input
        id="product-image"
        type="url"
        placeholder="https://example.com/computer.jpg"
        value={form.imageUrl}
        onChange={(event) =>
          updateField("imageUrl", event.target.value)
        }
      />

      <p>
        יש להשתמש בקישור ישיר לתמונה שמתחיל ב־
        <strong>https://</strong> ומומלץ שיסתיים ב־
        <strong>.jpg</strong>, <strong>.png</strong> או{" "}
        <strong>.webp</strong>.
      </p>

      {form.imageUrl && !imageError && (
        <div
          style={{
            margin: "16px 0",
            textAlign: "center",
          }}
        >
          <img
            src={normalizeUrl(form.imageUrl)}
            alt="תצוגה מקדימה של המוצר"
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              maxWidth: 320,
              height: 220,
              objectFit: "contain",
              borderRadius: 16,
              background: "#ffffff",
              border: "2px solid #d7e2ed",
              padding: 10,
            }}
          />
        </div>
      )}

      {form.imageUrl && imageError && (
        <p className="statusMessage">
          ❌ הקישור אינו מציג תמונה. יש להדביק כתובת
          ישירה ותקינה לתמונה.
        </p>
      )}

      <label htmlFor="product-video">
        קישור לסרטון
      </label>

      <input
        id="product-video"
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={form.videoUrl}
        onChange={(event) =>
          updateField("videoUrl", event.target.value)
        }
      />

      <button type="button" onClick={saveProduct}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף מוצר"}
      </button>

      {editId && (
        <button type="button" onClick={clearForm}>
          ❌ ביטול עריכה
        </button>
      )}

      {message && <p>{message}</p>}

      <hr />

      <h2>מוצרים קיימים</h2>

      {products.length === 0 && (
        <p>עדיין אין מוצרים בחנות.</p>
      )}

      {products.map((product) => (
        <article
          className="adminService"
          key={product._id}
        >
          {product.imageUrl ? (
            <img
              src={normalizeUrl(product.imageUrl)}
              alt={product.name || "תמונת מוצר"}
              style={{
                width: 150,
                height: 120,
                objectFit: "contain",
                borderRadius: 12,
                background: "#ffffff",
                border: "1px solid #d7e2ed",
                padding: 6,
              }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                fontSize: "4rem",
                textAlign: "center",
              }}
            >
              🖥️
            </div>
          )}

          <h3>{product.name}</h3>

          <p>
            <strong>קטגוריה:</strong>{" "}
            {product.category}
          </p>

          {product.brand && (
            <p>
              <strong>מותג:</strong> {product.brand}
            </p>
          )}

          <p>
            <strong>מחיר:</strong> ₪
            {Number(product.price || 0).toLocaleString(
              "he-IL"
            )}
          </p>

          {product.condition && (
            <p>
              <strong>מצב:</strong>{" "}
              {product.condition}
            </p>
          )}

          <button
            type="button"
            onClick={() => startEdit(product)}
          >
            ✏️ ערוך
          </button>

          <button
            type="button"
            onClick={() => deleteProduct(product._id)}
          >
            🗑️ מחק
          </button>
        </article>
      ))}
    </section>
  );
}

export default AdminShop;