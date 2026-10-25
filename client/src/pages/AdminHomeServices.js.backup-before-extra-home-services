import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeServices.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const API = `${API_BASE}/home-services`;
const UPLOAD_API = `${API_BASE}/upload`;

const REGIONS = ["צפון", "מרכז", "דרום"];

const SERVICE_TYPES = [
  "מטפלת חירום",
  "דוגסיטר",
  "קאטסיטר",
  "מנקה",
  "מסדרת בגדים",
  "טיפול בגינה",
  "ביביסיטר",
  "מנעולן",
  "חשמלאי",
  "שיפוץ",
];

const EMPTY = {
  name: "",
  serviceType: "מטפלת חירום",
  region: "צפון",
  phone: "",
  hourlyPrice: "",
  imageUrl: "",
  description: "",
  active: true,
};

function tokenHeaders(extra = {}) {
  const token = localStorage.getItem("token") || "";
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function imageSrc(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) {
    return `${API_BASE.replace(/\/api\/?$/, "")}${url}`;
  }
  return url;
}

export default function AdminHomeServices() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const forceLogin = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("alonpc-auth-change"));
    navigate("/login", {
      replace: true,
      state: { message: "פג תוקף ההתחברות. נא להתחבר מחדש כמנהל." },
    });
  }, [navigate]);

  const loadItems = useCallback(async () => {
    try {
      const response = await fetch(API);
      const data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error(data.message || "לא ניתן לטעון שירותים");
      }
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadImage() {
    if (!selectedImage) {
      setMessage("❌ יש לבחור קובץ תמונה קודם");
      return;
    }

    try {
      setUploading(true);
      setMessage("מעלה תמונה...");

      const body = new FormData();
      body.append("image", selectedImage);

      const response = await fetch(UPLOAD_API, {
        method: "POST",
        body,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "שגיאה בהעלאת תמונה");
      }

      const imageUrl =
        data.imageUrl || data.url || data.path || data.fileUrl || "";

      if (!imageUrl) {
        throw new Error("השרת לא החזיר קישור לתמונה");
      }

      updateField("imageUrl", imageUrl);
      setMessage("✅ התמונה הועלתה בהצלחה");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  async function save(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("❌ נא למלא שם");
      return;
    }
    if (!form.phone.trim()) {
      setMessage("❌ נא למלא טלפון");
      return;
    }
    if (form.hourlyPrice === "" || Number(form.hourlyPrice) < 0) {
      setMessage("❌ נא למלא מחיר לשעה");
      return;
    }

    try {
      setSaving(true);
      setMessage("שומר...");

      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: tokenHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({
            ...form,
            hourlyPrice: Number(form.hourlyPrice || 0),
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        forceLogin();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן לשמור");
      }

      setMessage(editingId ? "✅ השירות עודכן" : "✅ השירות נוסף");
      setForm(EMPTY);
      setEditingId("");
      setSelectedImage(null);
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      ...EMPTY,
      ...item,
      hourlyPrice: item.hourlyPrice ?? "",
    });
    setSelectedImage(null);
    setMessage("✏️ מצב עריכה");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id) {
    if (!window.confirm("האם למחוק את נותן השירות?")) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: tokenHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        forceLogin();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן למחוק");
      }

      setMessage("🗑️ השירות נמחק");
      await loadItems();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  return (
    <main className="home-services-page admin-home-services" dir="rtl">
      <section className="home-services-hero admin">
        <div className="home-services-hero-icon">⚙️</div>
        <div>
          <h1>ניהול שירות לבית</h1>
          <p>
            מטפלת חירום, דוגסיטר, קאטסיטר, מנקה, מסדרת בגדים, גינה,
            ביביסיטר, מנעולן, חשמלאי ושיפוץ.
          </p>
        </div>
      </section>

      <form className="home-services-admin-form" onSubmit={save}>
        <label>
          שם *
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="שם נותן/ת השירות"
          />
        </label>

        <label>
          סוג שירות *
          <select
            value={form.serviceType}
            onChange={(event) => updateField("serviceType", event.target.value)}
          >
            {SERVICE_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          אזור *
          <select
            value={form.region}
            onChange={(event) => updateField("region", event.target.value)}
          >
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          טלפון *
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="050-0000000"
            inputMode="tel"
          />
        </label>

        <label>
          מחיר לשעה *
          <input
            type="number"
            min="0"
            step="1"
            value={form.hourlyPrice}
            onChange={(event) =>
              updateField("hourlyPrice", event.target.value)
            }
            placeholder="לדוגמה: 80"
          />
        </label>

        <label className="full">
          קישור לתמונה
          <input
            type="url"
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>

        <div className="home-services-upload full">
          <label>
            או טעינת תמונה מהמחשב
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setSelectedImage(event.target.files?.[0] || null)
              }
            />
          </label>

          <button
            type="button"
            onClick={uploadImage}
            disabled={!selectedImage || uploading}
          >
            {uploading ? "⏳ מעלה..." : "📷 העלה תמונה"}
          </button>
        </div>

        {form.imageUrl && (
          <div className="home-services-admin-preview full">
            <img src={imageSrc(form.imageUrl)} alt="תצוגה מקדימה" />
          </div>
        )}

        <label className="full">
          תיאור קצר
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="מידע נוסף על השירות"
          />
        </label>

        <label className="home-services-active full">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => updateField("active", event.target.checked)}
          />
          הצג באתר
        </label>

        <div className="home-services-admin-actions full">
          <button type="submit" disabled={saving}>
            {saving
              ? "⏳ שומר..."
              : editingId
              ? "💾 שמור עריכה"
              : "➕ הוסף שירות"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel"
              onClick={() => {
                setEditingId("");
                setForm(EMPTY);
                setSelectedImage(null);
              }}
            >
              ביטול עריכה
            </button>
          )}
        </div>
      </form>

      {message && <p className="home-services-message">{message}</p>}

      <section className="home-services-admin-list">
        <h2>נותני שירות קיימים</h2>
        {items.map((item) => (
          <article key={item._id} className="home-services-admin-row">
            <div>
              <strong>
                {item.name} — {item.serviceType}
              </strong>
              <span>
                אזור {item.region} | {item.phone} |{" "}
                {Number(item.hourlyPrice || 0).toLocaleString("he-IL")} ₪ לשעה
              </span>
            </div>
            <div>
              <button type="button" onClick={() => edit(item)}>
                ✏️ ערוך
              </button>
              <button
                type="button"
                className="delete"
                onClick={() => remove(item._id)}
              >
                🗑️ מחק
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
