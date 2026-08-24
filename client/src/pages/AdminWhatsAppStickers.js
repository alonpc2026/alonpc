import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminWhatsAppStickers.css";

const API = "https://alonpc02026.onrender.com/api/whatsapp-stickers";

const EMPTY = {
  category: "",
  title: "",
  description: "",
  stickerImageUrl: "",
  iconImageUrl: "",
  whatsappText: "",
  active: true
};

export default function AdminWhatsAppStickers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState("");
  const [bulk, setBulk] = useState({
    category: "",
    description: "",
    iconImageUrl: "",
    whatsappText: "",
    active: true
  });

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}?admin=true`);
      const data = await r.json().catch(() => []);
      if (!r.ok) throw new Error(data.message || "טעינת המדבקות נכשלה");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function clear() {
    setEditingId("");
    setForm(EMPTY);
  }

  function edit(item) {
    setEditingId(item._id);
    setForm({
      category: item.category || "",
      title: item.title || "",
      description: item.description || "",
      stickerImageUrl: item.stickerImageUrl || "",
      iconImageUrl: item.iconImageUrl || "",
      whatsappText: item.whatsappText || "",
      active: item.active !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event) {
    event.preventDefault();

    if (!form.category.trim()) {
      setMessage("❌ חובה להזין קטגוריה");
      return;
    }
    if (!form.title.trim()) {
      setMessage("❌ חובה להזין שם");
      return;
    }
    if (!form.stickerImageUrl.trim()) {
      setMessage("❌ חובה להזין קישור תמונת מדבקה");
      return;
    }

    try {
      const r = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "השמירה נכשלה");

      setMessage(editingId ? "✅ המדבקה עודכנה" : "✅ המדבקה נוספה");
      clear();
      await load();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  async function remove(item) {
    if (!window.confirm(`למחוק את "${item.title}"?`)) return;

    try {
      const r = await fetch(`${API}/${item._id}`, { method: "DELETE" });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || "המחיקה נכשלה");
      setMessage("🗑️ המדבקה נמחקה");
      await load();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }


  function changeBulk(field, value) {
    setBulk((current) => ({ ...current, [field]: value }));
  }

  function chooseBulkFiles(event) {
    const files = Array.from(event.target.files || []).filter((file) =>
      ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)
    );

    setBulkFiles(files);
    setBulkProgress(
      files.length
        ? `נבחרו ${files.length} תמונות`
        : "לא נבחרו תמונות"
    );
  }

  async function uploadBulk(event) {
    event.preventDefault();

    if (!bulk.category.trim()) {
      setMessage("❌ חובה להזין קטגוריה לקבוצה");
      return;
    }

    if (!bulkFiles.length) {
      setMessage("❌ יש לבחור תיקייה או מספר תמונות");
      return;
    }

    try {
      setBulkUploading(true);
      setMessage("");
      setBulkProgress(`מעלה ${bulkFiles.length} תמונות...`);

      const formData = new FormData();
      formData.append("category", bulk.category.trim());
      formData.append("description", bulk.description.trim());
      formData.append("iconImageUrl", bulk.iconImageUrl.trim());
      formData.append("whatsappText", bulk.whatsappText.trim());
      formData.append("active", String(bulk.active));

      bulkFiles.forEach((file) => {
        formData.append("images", file, file.webkitRelativePath || file.name);
      });

      const response = await fetch(`${API}/bulk-upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "העלאת קבוצת המדבקות נכשלה");
      }

      setMessage(`✅ ${data.message || `${bulkFiles.length} מדבקות נוספו`}`);
      setBulkProgress("ההעלאה הסתיימה בהצלחה");
      setBulkFiles([]);
      setBulk({
        category: "",
        description: "",
        iconImageUrl: "",
        whatsappText: "",
        active: true
      });
      await load();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setBulkProgress("ההעלאה נכשלה");
    } finally {
      setBulkUploading(false);
    }
  }

  return (
    <main className="admin-wa-page" dir="rtl">
      <header className="admin-wa-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>💬 ניהול מדבקות WhatsApp</h1>
          <span>הוספת מדבקות לפי קטגוריה עם תיאור, תמונה וסמל.</span>
        </div>

        <div className="admin-wa-top-actions">
          <Link to="/whatsapp-stickers">👁️ תצוגה באתר</Link>
          <Link to="/admin">⚙️ חזרה לניהול</Link>
        </div>
      </header>

      {message && <div className="admin-wa-message">{message}</div>}


      <section className="admin-wa-bulk">
        <div className="admin-wa-bulk-title">
          <div>
            <h2>📁 העלאת קבוצה / תיקיית מדבקות</h2>
            <p>
              בחר קטגוריה אחת, ואז בחר תיקייה שלמה או מספר תמונות יחד.
              שם כל מדבקה יילקח אוטומטית משם הקובץ.
            </p>
          </div>
        </div>

        <form className="admin-wa-bulk-form" onSubmit={uploadBulk}>
          <label>
            <span>קטגוריה לקבוצה *</span>
            <input
              value={bulk.category}
              onChange={(e) => changeBulk("category", e.target.value)}
              placeholder="לדוגמה: ברכות / חגים / בוקר טוב"
              required
            />
          </label>

          <label>
            <span>תיאור משותף לכל התמונות</span>
            <textarea
              rows="3"
              value={bulk.description}
              onChange={(e) => changeBulk("description", e.target.value)}
              placeholder="אפשר להשאיר ריק"
            />
          </label>

          <label>
            <span>קישור תמונת סמל משותפת לקטגוריה</span>
            <input
              type="url"
              value={bulk.iconImageUrl}
              onChange={(e) => changeBulk("iconImageUrl", e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label>
            <span>טקסט משותף לשיתוף ב־WhatsApp</span>
            <textarea
              rows="3"
              value={bulk.whatsappText}
              onChange={(e) => changeBulk("whatsappText", e.target.value)}
              placeholder="אפשר להשאיר ריק"
            />
          </label>

          <div className="admin-wa-bulk-pickers">
            <label className="admin-wa-file-button">
              <span>📁 בחירת תיקייה שלמה</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                webkitdirectory=""
                directory=""
                onChange={chooseBulkFiles}
              />
            </label>

            <label className="admin-wa-file-button secondary">
              <span>🖼️ בחירת כמה תמונות</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                onChange={chooseBulkFiles}
              />
            </label>
          </div>

          <div className="admin-wa-bulk-status">
            <strong>{bulkProgress || "טרם נבחרו תמונות"}</strong>

            {bulkFiles.length > 0 && (
              <div className="admin-wa-bulk-file-list">
                {bulkFiles.slice(0, 12).map((file) => (
                  <span key={`${file.name}-${file.size}`}>
                    {file.webkitRelativePath || file.name}
                  </span>
                ))}
                {bulkFiles.length > 12 && (
                  <span>ועוד {bulkFiles.length - 12} תמונות...</span>
                )}
              </div>
            )}
          </div>

          <label className="admin-wa-check">
            <input
              type="checkbox"
              checked={bulk.active}
              onChange={(e) => changeBulk("active", e.target.checked)}
            />
            <span>להציג את כל הקבוצה באתר</span>
          </label>

          <button
            type="submit"
            className="admin-wa-bulk-upload-button"
            disabled={bulkUploading}
          >
            {bulkUploading
              ? "⏳ מעלה את קבוצת המדבקות..."
              : `📤 העלאת ${bulkFiles.length || ""} מדבקות`}
          </button>
        </form>
      </section>

      <form className="admin-wa-form" onSubmit={save}>
        <h2>➕ הוספת מדבקה בודדת</h2>
        <label>
          <span>קטגוריה *</span>
          <input
            value={form.category}
            onChange={(e) => change("category", e.target.value)}
            placeholder="לדוגמה: ברכות / חגים / נגישות / מצחיק"
            required
          />
        </label>

        <label>
          <span>שם המדבקה *</span>
          <input
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            required
          />
        </label>

        <label>
          <span>תיאור תמונה</span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
            placeholder="תיאור קצר של המדבקה"
          />
        </label>

        <label>
          <span>קישור תמונת המדבקה *</span>
          <input
            type="url"
            value={form.stickerImageUrl}
            onChange={(e) => change("stickerImageUrl", e.target.value)}
            placeholder="https://..."
            required
          />
        </label>

        <label>
          <span>קישור תמונת סמל</span>
          <input
            type="url"
            value={form.iconImageUrl}
            onChange={(e) => change("iconImageUrl", e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          <span>טקסט שיופיע בשיתוף ל־WhatsApp</span>
          <textarea
            rows="3"
            value={form.whatsappText}
            onChange={(e) => change("whatsappText", e.target.value)}
            placeholder="אפשר להשאיר ריק"
          />
        </label>

        {form.stickerImageUrl && (
          <div className="admin-wa-preview">
            <strong>תצוגה מקדימה:</strong>
            <img src={form.stickerImageUrl} alt="" />
          </div>
        )}

        <label className="admin-wa-check">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => change("active", e.target.checked)}
          />
          <span>להציג באתר</span>
        </label>

        <div className="admin-wa-actions">
          <button type="submit">
            {editingId ? "💾 שמירת שינויים" : "➕ הוספת מדבקה"}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={clear}>
              ביטול
            </button>
          )}
        </div>
      </form>

      <section className="admin-wa-list">
        <h2>מדבקות קיימות</h2>

        <div className="admin-wa-grid">
          {items.map((item) => (
            <article key={item._id} className="admin-wa-card">
              <img src={item.stickerImageUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <small>{item.category}</small>
              {item.description && <p>{item.description}</p>}

              <div className="admin-wa-card-actions">
                <button type="button" onClick={() => edit(item)}>✏️ עריכה</button>
                <button type="button" className="danger" onClick={() => remove(item)}>🗑️ מחיקה</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
