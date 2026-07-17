import { useCallback, useEffect, useState } from "react";

const API =
  "https://alonpc02026.onrender.com/api/products";

const EMPTY_FORM = {
  name: "",
  category: "מחשבים ניידים",
  brand: "",
  model: "",

  price: "",
  oldPrice: "",
  stock: "",

  condition: "חדש",
  warranty: "",
  sku: "",

  description: "",
  specifications: "",

  imageUrl: "",
  galleryText: "",

  videoUrl: "",
  websiteUrl: "",

  active: true,
  featured: false,
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
  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });
  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);

  const categories = [
    "מחשבים ניידים",
    "מחשבים נייחים",
    "מחשב מיני",
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
    } catch (error) {
      setProducts([]);
      setMessage(
        `❌ שגיאה בטעינת מוצרים: ${error.message}`
      );
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

    setForm({
      ...EMPTY_FORM,
    });

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

  const parseGallery = (galleryText) => {
    return String(galleryText || "")
      .split(/\r?\n|,/)
      .map((item) => normalizeUrl(item))
      .filter(Boolean);
  };

  const saveProduct = async () => {
    if (!form.name.trim()) {
      setMessage("❌ נא למלא שם מוצר");
      return;
    }

    if (!form.category.trim()) {
      setMessage("❌ נא לבחור קטגוריה");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setMessage("❌ נא למלא מחיר תקין");
      return;
    }

    const fixedImageUrl = normalizeUrl(form.imageUrl);
    const fixedVideoUrl = normalizeUrl(form.videoUrl);
    const fixedWebsiteUrl = normalizeUrl(
      form.websiteUrl
    );

    const productData = {
      name: form.name.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),

      price: Number(form.price),
      oldPrice: Number(form.oldPrice || 0),
      stock: Number(form.stock || 0),

      condition: form.condition,
      warranty: form.warranty.trim(),
      sku: form.sku.trim(),

      description: form.description.trim(),
      specifications: form.specifications.trim(),

      imageUrl: fixedImageUrl,
      gallery: parseGallery(form.galleryText),

      videoUrl: fixedVideoUrl,
      websiteUrl: fixedWebsiteUrl,

      active: Boolean(form.active),
      featured: Boolean(form.featured),
    };

    try {
      setSaving(true);
      setMessage("שומר את המוצר...");

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
      setMessage(
        `❌ לא ניתן לשמור מוצר: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditId(product._id);

    setForm({
      name: product.name || "",
      category:
        product.category || "מחשבים ניידים",
      brand: product.brand || "",
      model: product.model || "",

      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      stock: product.stock ?? "",

      condition: product.condition || "חדש",
      warranty: product.warranty || "",
      sku: product.sku || "",

      description: product.description || "",
      specifications:
        product.specifications ||
        product.specification ||
        product.technicalDetails ||
        "",

      imageUrl: product.imageUrl || "",

      galleryText: Array.isArray(product.gallery)
        ? product.gallery.join("\n")
        : "",

      videoUrl:
        product.videoUrl ||
        product.videoLink ||
        product.youtubeUrl ||
        product.video ||
        "",

      websiteUrl:
        product.websiteUrl ||
        product.productUrl ||
        product.manufacturerUrl ||
        product.website ||
        product.link ||
        "",

      active:
        product.active === undefined
          ? true
          : Boolean(product.active),

      featured: Boolean(product.featured),
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
      setMessage(
        `❌ לא ניתן למחוק מוצר: ${error.message}`
      );
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
      <h1>🛒 ניהול החנות</h1>

      <h2>
        {editId ? "✏️ עריכת מוצר" : "➕ הוספת מוצר"}
      </h2>

      <label htmlFor="product-name">
        שם המוצר *
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
        קטגוריה *
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

      <label htmlFor="product-brand">מותג</label>

      <input
        id="product-brand"
        type="text"
        placeholder="לדוגמה: Lenovo"
        value={form.brand}
        onChange={(event) =>
          updateField("brand", event.target.value)
        }
      />

      <label htmlFor="product-model">דגם</label>

      <input
        id="product-model"
        type="text"
        placeholder="לדוגמה: ThinkBook 16 G6"
        value={form.model}
        onChange={(event) =>
          updateField("model", event.target.value)
        }
      />

      <label htmlFor="product-price">
        מחיר נוכחי *
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

      <label htmlFor="product-old-price">
        מחיר קודם
      </label>

      <input
        id="product-old-price"
        type="number"
        min="0"
        step="0.01"
        placeholder="מחיר לפני המבצע"
        value={form.oldPrice}
        onChange={(event) =>
          updateField("oldPrice", event.target.value)
        }
      />

      <label htmlFor="product-stock">
        כמות במלאי
      </label>

      <input
        id="product-stock"
        type="number"
        min="0"
        step="1"
        placeholder="לדוגמה: 5"
        value={form.stock}
        onChange={(event) =>
          updateField("stock", event.target.value)
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
        <option value="מחודש">מחודש</option>
        <option value="דורש תיקון">
          דורש תיקון
        </option>
      </select>

      <label htmlFor="product-warranty">
        אחריות
      </label>

      <input
        id="product-warranty"
        type="text"
        placeholder="לדוגמה: שנה אחריות"
        value={form.warranty}
        onChange={(event) =>
          updateField("warranty", event.target.value)
        }
      />

      <label htmlFor="product-sku">
        מספר מוצר / מק"ט
      </label>

      <input
        id="product-sku"
        type="text"
        placeholder="לדוגמה: ALON-1001"
        value={form.sku}
        onChange={(event) =>
          updateField("sku", event.target.value)
        }
      />

      <label htmlFor="product-description">
        תיאור המוצר
      </label>

      <textarea
        id="product-description"
        rows="6"
        placeholder="כתוב תיאור מלא של המוצר"
        value={form.description}
        onChange={(event) =>
          updateField(
            "description",
            event.target.value
          )
        }
      />

      <label htmlFor="product-specifications">
        מפרט טכני
      </label>

      <textarea
        id="product-specifications"
        rows="8"
        placeholder={
          "לדוגמה:\nמעבד: Intel Core i5\nזיכרון: 16GB\nאחסון: 512GB SSD"
        }
        value={form.specifications}
        onChange={(event) =>
          updateField(
            "specifications",
            event.target.value
          )
        }
      />

      <label htmlFor="product-image">
        קישור לתמונה הראשית
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

      {form.imageUrl && !imageError && (
        <div
          style={{
            margin: "16px 0",
            textAlign: "center",
          }}
        >
          <img
            src={normalizeUrl(form.imageUrl)}
            alt="תצוגה מקדימה"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            style={{
              width: "100%",
              maxWidth: 360,
              height: 240,
              objectFit: "contain",
              borderRadius: 16,
              background: "#ffffff",
              border: "2px solid #d7e2ed",
              padding: 10,
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {form.imageUrl && imageError && (
        <p className="statusMessage">
          ❌ לא ניתן להציג את התמונה. בדוק שהקישור
          ישיר ותקין.
        </p>
      )}

      <label htmlFor="product-gallery">
        תמונות נוספות
      </label>

      <textarea
        id="product-gallery"
        rows="5"
        placeholder={
          "הדבק כל קישור לתמונה בשורה נפרדת"
        }
        value={form.galleryText}
        onChange={(event) =>
          updateField(
            "galleryText",
            event.target.value
          )
        }
      />

      <label htmlFor="product-video">
        קישור לסרטון YouTube
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

      <label htmlFor="product-website">
        קישור לאתר היצרן או הספק
      </label>

      <input
        id="product-website"
        type="url"
        placeholder="https://example.com/product"
        value={form.websiteUrl}
        onChange={(event) =>
          updateField(
            "websiteUrl",
            event.target.value
          )
        }
      />

      <label
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) =>
            updateField("active", event.target.checked)
          }
        />
        הצג את המוצר בחנות
      </label>

      <label
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) =>
            updateField(
              "featured",
              event.target.checked
            )
          }
        />
        מוצר מומלץ
      </label>

      <button
        type="button"
        onClick={saveProduct}
        disabled={saving}
        style={{
          marginTop: 22,
        }}
      >
        {saving
          ? "⏳ שומר..."
          : editId
          ? "💾 שמור עריכה"
          : "➕ הוסף מוצר"}
      </button>

      {editId && (
        <button
          type="button"
          onClick={clearForm}
          disabled={saving}
        >
          ❌ ביטול עריכה
        </button>
      )}

      {message && (
        <p className="statusMessage">{message}</p>
      )}

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
              referrerPolicy="no-referrer"
              style={{
                width: 170,
                height: 130,
                objectFit: "contain",
                borderRadius: 12,
                background: "#ffffff",
                border: "1px solid #d7e2ed",
                padding: 6,
              }}
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
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
              <strong>מותג:</strong>{" "}
              {product.brand}
            </p>
          )}

          {product.model && (
            <p>
              <strong>דגם:</strong> {product.model}
            </p>
          )}

          {Number(product.oldPrice) > 0 && (
            <p
              style={{
                textDecoration: "line-through",
              }}
            >
              מחיר קודם: ₪
              {Number(
                product.oldPrice
              ).toLocaleString("he-IL")}
            </p>
          )}

          <p>
            <strong>מחיר:</strong> ₪
            {Number(
              product.price || 0
            ).toLocaleString("he-IL")}
          </p>

          <p>
            <strong>מלאי:</strong>{" "}
            {product.stock ?? 0}
          </p>

          {product.condition && (
            <p>
              <strong>מצב:</strong>{" "}
              {product.condition}
            </p>
          )}

          <p>
            <strong>מוצג בחנות:</strong>{" "}
            {product.active ? "כן" : "לא"}
          </p>

          <p>
            <strong>מומלץ:</strong>{" "}
            {product.featured ? "כן" : "לא"}
          </p>

          {product.videoUrl && (
            <p>🎥 קיים סרטון למוצר</p>
          )}

          <button
            type="button"
            onClick={() => startEdit(product)}
          >
            ✏️ ערוך
          </button>

          <button
            type="button"
            onClick={() =>
              deleteProduct(product._id)
            }
          >
            🗑️ מחק
          </button>
        </article>
      ))}
    </section>
  );
}

export default AdminShop;