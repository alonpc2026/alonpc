import { useEffect, useMemo, useState } from "react";
import "./AdminInterestingSites.css";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:3001";
const API = `${API_BASE}/api/interesting-sites`;

const DEFAULT_CATEGORIES = [
  "נגישות",
  "ממשלה",
  "בריאות",
  "תחבורה",
  "תרבות ואירועים",
  "תעסוקה",
  "לימודים",
  "עמותות",
  "קניות",
  "שירותים",
  "טכנולוגיה",
  "חדשות",
  "אחר",
];

const COLOR_PRESETS = [
  {
    id: "blue-yellow",
    name: "כחול עם כיתוב צהוב",
    backgroundColor: "#0047AB",
    textColor: "#FFF200",
    accessible: false,
  },
  {
    id: "purple-lightblue",
    name: "סגול עם כיתוב תכלת",
    backgroundColor: "#5B168B",
    textColor: "#9FE8FF",
    accessible: false,
  },
  {
    id: "black-white",
    name: "שחור עם כיתוב לבן",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
    accessible: true,
  },
  {
    id: "darkbrown-lightgreen",
    name: "חום כהה עם כיתוב ירוק בהיר",
    backgroundColor: "#3B2416",
    textColor: "#B9FF9A",
    accessible: false,
  },
  {
    id: "black-yellow-accessible",
    name: "נגיש לקוצר ראייה: שחור עם צהוב",
    backgroundColor: "#000000",
    textColor: "#FFFF00",
    accessible: true,
  },
  {
    id: "navy-white-accessible",
    name: "נגיש לקוצר ראייה: כחול כהה עם לבן",
    backgroundColor: "#001A4D",
    textColor: "#FFFFFF",
    accessible: true,
  },
  {
    id: "white-black-accessible",
    name: "נגיש לקוצר ראייה: לבן עם שחור",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    accessible: true,
  },
  {
    id: "dark-cyan-accessible",
    name: "נגיש לקוצר ראייה: כהה עם תכלת",
    backgroundColor: "#071820",
    textColor: "#8FF3FF",
    accessible: true,
  },
  {
    id: "darkgreen-white-accessible",
    name: "נגיש לקוצר ראייה: ירוק כהה עם לבן",
    backgroundColor: "#003B2B",
    textColor: "#FFFFFF",
    accessible: true,
  },
  {
    id: "custom",
    name: "צבעים אישיים",
    backgroundColor: "#0047AB",
    textColor: "#FFFFFF",
    accessible: false,
  },
];

const EMPTY_FORM = {
  name: "",
  url: "",
  description: "",
  category: "נגישות",
  newCategory: "",
  imageUrl: "",
  colorPreset: "blue-yellow",
  backgroundColor: "#0047AB",
  textColor: "#FFF200",
  isAccessiblePreset: false,
  isFeatured: false,
  isActive: true,
  order: 0,
};

function AdminInterestingSites() {
  const [sites, setSites] = useState([]);
  const [databaseCategories, setDatabaseCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("הכול");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const categories = useMemo(() => {
    return Array.from(
      new Set([...DEFAULT_CATEGORIES, ...databaseCategories])
    ).sort((a, b) => a.localeCompare(b, "he"));
  }, [databaseCategories]);

  const filteredSites = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sites.filter((site) => {
      const text =
        `${site.name || ""} ${site.category || ""} ${
          site.description || ""
        }`.toLowerCase();

      const categoryMatch =
        filterCategory === "הכול" ||
        site.category === filterCategory;

      return categoryMatch && (!term || text.includes(term));
    });
  }, [sites, search, filterCategory]);

  async function loadData() {
    try {
      const [sitesResponse, categoriesResponse] = await Promise.all([
        fetch(`${API}?admin=true`),
        fetch(`${API}/categories`),
      ]);

      if (!sitesResponse.ok || !categoriesResponse.ok) {
        throw new Error("טעינת הנתונים נכשלה");
      }

      const sitesData = await sitesResponse.json();
      const categoriesData = await categoriesResponse.json();

      setSites(Array.isArray(sitesData) ? sitesData : []);
      setDatabaseCategories(
        Array.isArray(categoriesData) ? categoriesData : []
      );
    } catch (error) {
      setMessage("❌ לא ניתן לטעון את מאגר האתרים.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function selectPreset(presetId) {
    const preset = COLOR_PRESETS.find(
      (item) => item.id === presetId
    );

    if (!preset) return;

    setForm((current) => ({
      ...current,
      colorPreset: preset.id,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      isAccessiblePreset: preset.accessible,
    }));
  }

  function readLogoFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("❌ יש לבחור קובץ תמונה בלבד.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("❌ גודל התמונה המרבי הוא 2MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("imageUrl", String(reader.result || ""));
      setMessage("✅ הלוגו נטען ומוכן לשמירה.");
    };
    reader.onerror = () => {
      setMessage("❌ קריאת התמונה נכשלה.");
    };
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditId("");
  }

  function startEdit(site) {
    setEditId(site._id);
    setForm({
      name: site.name || "",
      url: site.url || "",
      description: site.description || "",
      category: site.category || "אחר",
      newCategory: "",
      imageUrl: site.imageUrl || "",
      colorPreset: site.colorPreset || "custom",
      backgroundColor: site.backgroundColor || "#0047AB",
      textColor: site.textColor || "#FFFFFF",
      isAccessiblePreset: Boolean(site.isAccessiblePreset),
      isFeatured: Boolean(site.isFeatured),
      isActive: site.isActive !== false,
      order: Number(site.order || 0),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveSite(event) {
    event.preventDefault();

    const finalCategory =
      form.newCategory.trim() || form.category.trim();

    if (!form.name.trim() || !form.url.trim()) {
      setMessage("❌ חובה להזין שם אתר וכתובת קישור.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          body: JSON.stringify({
            ...form,
            category: finalCategory || "אחר",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "שמירת האתר נכשלה");
      }

      setMessage(
        editId ? "✅ האתר עודכן בהצלחה." : "✅ האתר נוסף בהצלחה."
      );
      resetForm();
      await loadData();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSite(site) {
    const approved = window.confirm(
      `למחוק את האתר "${site.name}" לצמיתות?`
    );

    if (!approved) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/${site._id}`, {
        method: "DELETE",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "מחיקת האתר נכשלה");
      }

      setMessage("🗑️ האתר נמחק.");
      if (editId === site._id) resetForm();
      await loadData();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  return (
    <main className="admin-interesting-page" dir="rtl">
      <header className="admin-interesting-header">
        <h1>🌐 ניהול אתרים מעניינים</h1>
        <p>
          הוספת שם, לוגו, קישור, קטגוריה וצבע פרסום
          נגיש.
        </p>
      </header>

      {message && (
        <div className="admin-interesting-message" role="status">
          {message}
        </div>
      )}

      <form
        className="admin-interesting-form"
        onSubmit={saveSite}
      >
        <h2>{editId ? "עריכת אתר" : "הוספת אתר חדש"}</h2>

        <div className="admin-interesting-fields">
          <label>
            <span>שם האתר *</span>
            <input
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              required
            />
          </label>

          <label>
            <span>כתובת קישור *</span>
            <input
              type="text"
              value={form.url}
              onChange={(event) =>
                updateField("url", event.target.value)
              }
              placeholder="https://example.com"
              required
              dir="ltr"
            />
          </label>

          <label>
            <span>קטגוריה קיימת</span>
            <select
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>קטגוריה חדשה, רק כאשר צריך</span>
            <input
              value={form.newCategory}
              onChange={(event) =>
                updateField("newCategory", event.target.value)
              }
              placeholder="לדוגמה: ספורט נגיש"
            />
          </label>

          <label className="admin-interesting-wide">
            <span>תיאור קצר</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows="4"
            />
          </label>

          <label className="admin-interesting-wide">
            <span>קישור ישיר ללוגו או לתמונה</span>
            <input
              type="text"
              value={
                form.imageUrl.startsWith("data:")
                  ? ""
                  : form.imageUrl
              }
              onChange={(event) =>
                updateField("imageUrl", event.target.value)
              }
              placeholder="https://..."
              dir="ltr"
            />
          </label>

          <label className="admin-interesting-wide">
            <span>או העלאת לוגו מהמחשב, עד 2MB</span>
            <input
              type="file"
              accept="image/*"
              onChange={readLogoFile}
            />
          </label>
        </div>

        {form.imageUrl && (
          <div className="admin-interesting-logo-preview">
            <img src={form.imageUrl} alt="תצוגה מקדימה ללוגו" />
            <button
              type="button"
              onClick={() => updateField("imageUrl", "")}
            >
              הסרת תמונה
            </button>
          </div>
        )}

        <fieldset className="admin-interesting-colors">
          <legend>בחירת צבע פרסום</legend>

          <div className="admin-interesting-color-grid">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={
                  form.colorPreset === preset.id
                    ? "selected"
                    : ""
                }
                style={{
                  backgroundColor: preset.backgroundColor,
                  color: preset.textColor,
                }}
                onClick={() => selectPreset(preset.id)}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {form.colorPreset === "custom" && (
            <div className="admin-interesting-custom-colors">
              <label>
                <span>צבע רקע</span>
                <input
                  type="color"
                  value={form.backgroundColor}
                  onChange={(event) =>
                    updateField(
                      "backgroundColor",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>צבע כיתוב</span>
                <input
                  type="color"
                  value={form.textColor}
                  onChange={(event) =>
                    updateField("textColor", event.target.value)
                  }
                />
              </label>
            </div>
          )}
        </fieldset>

        <div
          className="admin-interesting-card-preview"
          style={{
            backgroundColor: form.backgroundColor,
            color: form.textColor,
          }}
        >
          <strong>{form.name || "שם האתר לדוגמה"}</strong>
          <span>{form.newCategory || form.category}</span>
          <small>כך ייראה צבע הפרסום באתר</small>
        </div>

        <div className="admin-interesting-fields">
          <label>
            <span>סדר הצגה</span>
            <input
              type="number"
              value={form.order}
              onChange={(event) =>
                updateField("order", Number(event.target.value))
              }
            />
          </label>

          <label className="admin-interesting-check">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) =>
                updateField("isFeatured", event.target.checked)
              }
            />
            <span>אתר מומלץ ⭐</span>
          </label>

          <label className="admin-interesting-check">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                updateField("isActive", event.target.checked)
              }
            />
            <span>פרסום פעיל ומוצג באתר</span>
          </label>
        </div>

        <div className="admin-interesting-actions">
          <button type="submit" disabled={saving}>
            {saving
              ? "שומר..."
              : editId
              ? "💾 שמירת שינויים"
              : "➕ הוספת האתר"}
          </button>

          {editId && (
            <button type="button" onClick={resetForm}>
              ביטול עריכה
            </button>
          )}
        </div>
      </form>

      <section className="admin-interesting-list">
        <h2>אתרים במאגר: {sites.length}</h2>

        <div className="admin-interesting-list-tools">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש לפי שם, קטגוריה או תיאור"
          />

          <select
            value={filterCategory}
            onChange={(event) =>
              setFilterCategory(event.target.value)
            }
          >
            <option value="הכול">כל הקטגוריות</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-interesting-items">
          {filteredSites.map((site) => (
            <article
              key={site._id}
              className="admin-interesting-item"
            >
              {site.imageUrl ? (
                <img src={site.imageUrl} alt="" />
              ) : (
                <span className="admin-interesting-no-logo">
                  🌐
                </span>
              )}

              <div>
                <h3>{site.name}</h3>
                <p>
                  {site.category || "אחר"} ·{" "}
                  {site.isActive ? "פעיל" : "מוסתר"}
                </p>
                <div
                  className="admin-interesting-mini-color"
                  style={{
                    backgroundColor: site.backgroundColor,
                    color: site.textColor,
                  }}
                >
                  צבע הפרסום
                </div>
              </div>

              <div className="admin-interesting-item-actions">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  פתיחה
                </a>
                <button
                  type="button"
                  onClick={() => startEdit(site)}
                >
                  עריכה
                </button>
                <button
                  type="button"
                  className="delete"
                  onClick={() => deleteSite(site)}
                >
                  מחיקה
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AdminInterestingSites;
