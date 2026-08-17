import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminApps.css";

const API = "https://alonpc02026.onrender.com/api/mobile-apps";

const TABS = [
  { value: "legacy", label: "📦 מאגר אפליקציות ישן" },
  { value: "android", label: "🤖 Android / Galaxy" },
  { value: "ios", label: "🍎 iPhone / iOS" },
  { value: "windows", label: "🪟 Windows 10–11" },
  { value: "mac", label: "💻 Mac" },
  { value: "tv", label: "📺 טלוויזיה חכמה" }
];

const KNOWN = ["android", "ios", "windows", "mac", "tv"];

const EMPTY = {
  name: "",
  imageUrl: "",
  link: "",
  description: ""
};

function normalizePlatform(value) {
  const v = String(value || "").trim().toLowerCase();

  if (["android", "galaxy", "samsung", "אנדרואיד", "סמסונג"].includes(v)) return "android";
  if (["ios", "iphone", "apple", "אייפון", "אפל"].includes(v)) return "ios";
  if (["windows", "windows10", "windows11", "pc"].includes(v)) return "windows";
  if (["mac", "macos", "apple-mac"].includes(v)) return "mac";
  if (["tv", "smarttv", "smart-tv", "television", "טלוויזיה"].includes(v)) return "tv";

  return v;
}

function getPlatform(item) {
  const values = [
    item.platform,
    item.type,
    item.deviceType,
    item.os,
    item.system,
    item.mobileType,
    item.category
  ].filter(Boolean);

  for (const value of values) {
    const normalized = normalizePlatform(value);
    if (KNOWN.includes(normalized)) return normalized;
  }

  return "";
}

function getImage(item) {
  return (
    item.imageUrl ||
    item.logoUrl ||
    item.iconUrl ||
    item.image ||
    item.imageLink ||
    item.logo ||
    ""
  );
}

function getLink(item) {
  return (
    item.link ||
    item.url ||
    item.appUrl ||
    item.storeUrl ||
    item.websiteUrl ||
    item.downloadUrl ||
    ""
  );
}

function guessPlatform(item) {
  const text = [
    item.name,
    item.title,
    item.description,
    getLink(item),
    item.publisher,
    item.company
  ].filter(Boolean).join(" ").toLowerCase();

  if (
    text.includes("apps.apple.com") ||
    text.includes("app store") ||
    text.includes("iphone") ||
    text.includes("ios") ||
    text.includes("אייפון") ||
    text.includes("אפל")
  ) return "ios";

  if (
    text.includes("play.google.com") ||
    text.includes("google play") ||
    text.includes("android") ||
    text.includes("galaxy") ||
    text.includes("samsung") ||
    text.includes("אנדרואיד") ||
    text.includes("סמסונג")
  ) return "android";

  return "";
}

function cleanPayload(item, targetPlatform) {
  const name = item.name || item.title || "";
  const imageUrl = getImage(item);
  const link = getLink(item);

  return {
    ...item,
    name,
    title: name,
    imageUrl,
    logoUrl: imageUrl,
    link,
    url: link,
    appUrl: link,
    description: item.description || "",

    // שיוך חדש. שומרים כמה שמות שדות כדי להיות תואמים למבנה הישן.
    platform: targetPlatform,
    type: targetPlatform,
    deviceType: targetPlatform,
    os: targetPlatform,
    system: targetPlatform,
    mobileType: targetPlatform,
    category: targetPlatform,
    active: item.active !== false
  };
}

export default function AdminApps() {
  const [platform, setPlatform] = useState("legacy");
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState("");

  const loadApps = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(API);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "טעינת האפליקציות נכשלה");
      }

      setApps(Array.isArray(data) ? data : data.apps || data.items || []);
      setMessage("");
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const legacyApps = useMemo(
    () =>
      apps.filter((item) => {
        const p = getPlatform(item);
        const raw = String(
          item.platform ||
          item.type ||
          item.deviceType ||
          item.os ||
          item.system ||
          item.mobileType ||
          item.category ||
          ""
        ).trim().toLowerCase();

        // Records from the old mobile repository often used "mobile"/"phone"
        // or had no platform at all. Keep all of them in the legacy box.
        return (
          !p ||
          raw === "mobile" ||
          raw === "phone" ||
          raw === "cellular" ||
          raw === "smartphone" ||
          raw === "סלולרי" ||
          raw === "נייד"
        );
      }),
    [apps]
  );

  const visibleApps = useMemo(() => {
    if (platform === "legacy") return legacyApps;
    return apps.filter((item) => getPlatform(item) === platform);
  }, [apps, platform, legacyApps]);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function clearForm() {
    setEditingId("");
    setForm(EMPTY);
  }

  function startEdit(item) {
    const itemPlatform = getPlatform(item);

    if (itemPlatform) {
      setPlatform(itemPlatform);
    }

    setEditingId(item._id);
    setForm({
      name: item.name || item.title || "",
      imageUrl: getImage(item),
      link: getLink(item),
      description: item.description || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function moveExisting(item, targetPlatform) {
    const targetLabel =
      targetPlatform === "ios" ? "iPhone / iOS" : "Android / Galaxy";

    if (
      !window.confirm(
        `להעביר את "${item.name || item.title || "האפליקציה"}" אל ${targetLabel}?`
      )
    ) {
      return;
    }

    try {
      setMovingId(item._id);
      setMessage(`מעביר אל ${targetLabel}...`);

      const response = await fetch(`${API}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload(item, targetPlatform))
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "העברת האפליקציה נכשלה");
      }

      setMessage(`✅ האפליקציה הועברה אל ${targetLabel}`);
      await loadApps();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setMovingId("");
    }
  }

  async function save(event) {
    event.preventDefault();

    if (platform === "legacy") {
      setMessage("❌ להוספת אפליקציה חדשה יש לבחור Android, iPhone, Windows, Mac או TV");
      return;
    }

    if (!form.name.trim()) {
      setMessage("❌ חובה להזין שם אפליקציה");
      return;
    }

    if (!form.link.trim()) {
      setMessage("❌ חובה להזין קישור אפליקציה");
      return;
    }

    try {
      setMessage("שומר...");

      const payload = {
        name: form.name.trim(),
        title: form.name.trim(),
        imageUrl: form.imageUrl.trim(),
        logoUrl: form.imageUrl.trim(),
        link: form.link.trim(),
        url: form.link.trim(),
        appUrl: form.link.trim(),
        description: form.description.trim(),
        platform,
        type: platform,
        deviceType: platform,
        os: platform,
        system: platform,
        mobileType: platform,
        category: platform,
        active: true
      };

      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "השמירה נכשלה");
      }

      setMessage(editingId ? "✅ האפליקציה עודכנה" : "✅ האפליקציה נוספה");
      clearForm();
      await loadApps();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  async function remove(item) {
    if (!window.confirm(`למחוק את "${item.name || item.title || "האפליקציה"}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API}/${item._id}`, {
        method: "DELETE"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "המחיקה נכשלה");
      }

      setMessage("🗑️ האפליקציה נמחקה");
      await loadApps();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  return (
    <main className="admin-apps-page" dir="rtl">
      <header className="admin-apps-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>ניהול אפליקציות</h1>
          <span>
            אפליקציות ישנות אפשר להעביר בלחיצה ל־Android או ל־iPhone.
          </span>
        </div>

        <Link to="/admin">⚙️ חזרה לפורטל ניהול</Link>
      </header>

      <button
        type="button"
        className="legacy-main-button"
        onClick={() => {
          setPlatform("legacy");
          clearForm();
        }}
      >
        📦 מאגר אפליקציות ישן
        <span>{legacyApps.length} אפליקציות ממתינות לשיוך</span>
      </button>

      <nav className="admin-apps-tabs admin-apps-tabs-six" aria-label="סוג אפליקציה">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.value}
            className={platform === tab.value ? "active" : ""}
            onClick={() => {
              setPlatform(tab.value);
              clearForm();
            }}
          >
            {tab.label}
            {tab.value === "legacy" && (
              <span className="legacy-count">{legacyApps.length}</span>
            )}
          </button>
        ))}
      </nav>

      {message && <div className="admin-apps-message">{message}</div>}

      {platform !== "legacy" && (
        <form className="admin-apps-form" onSubmit={save}>
          <h2>
            {editingId ? "✏️ עריכת אפליקציה" : "➕ הוספת אפליקציה"} —{" "}
            {TABS.find((tab) => tab.value === platform)?.label}
          </h2>

          <label>
            <span>1. שם אפליקציה *</span>
            <input
              value={form.name}
              onChange={(event) => change("name", event.target.value)}
              placeholder="לדוגמה: WhatsApp"
              required
            />
          </label>

          <label>
            <span>2. קישור תמונה</span>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(event) => change("imageUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>

          {form.imageUrl && (
            <div className="admin-apps-image-preview">
              <strong>תצוגה מקדימה:</strong>
              <img
                src={form.imageUrl}
                alt="תצוגה מקדימה"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <label>
            <span>3. קישור אפליקציה *</span>
            <input
              type="url"
              value={form.link}
              onChange={(event) => change("link", event.target.value)}
              placeholder="https://..."
              required
            />
          </label>

          <label>
            <span>4. תיאור אפליקציה</span>
            <textarea
              rows="5"
              value={form.description}
              onChange={(event) => change("description", event.target.value)}
              placeholder="תיאור קצר וברור..."
            />
          </label>

          <div className="admin-apps-form-actions">
            <button type="submit">
              {editingId ? "💾 שמירת שינויים" : "➕ הוספת אפליקציה"}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={clearForm}>
                ביטול עריכה
              </button>
            )}
          </div>
        </form>
      )}

      {platform === "legacy" && (
        <section className="legacy-help-box">
          <h2>📦 מאגר אפליקציות ישן</h2>
          <p>
            כאן מופיעות אפליקציות שכבר נמצאות במאגר אבל עדיין לא שויכו למערכת.
            אין צורך להקליד אותן מחדש.
          </p>
          <p>
            לכל אפליקציה בחר: <strong>🤖 העבר ל־Android</strong> או{" "}
            <strong>🍎 העבר ל־iPhone</strong>.
          </p>
        </section>
      )}

      <section className="admin-apps-list">
        <h2>
          {TABS.find((tab) => tab.value === platform)?.label} —{" "}
          {visibleApps.length} אפליקציות
        </h2>

        {loading && <p>טוען...</p>}

        {!loading && visibleApps.length === 0 && (
          <p className="admin-apps-empty">
            {platform === "legacy"
              ? "מצוין — אין כרגע אפליקציות ישנות שממתינות לשיוך."
              : "אין כרגע אפליקציות בתחום הזה."}
          </p>
        )}

        <div className="admin-apps-cards">
          {visibleApps.map((item) => {
            const image = getImage(item);
            const link = getLink(item);
            const guess = guessPlatform(item);

            return (
              <article className="admin-app-card" key={item._id}>
                <div className="admin-app-card-image">
                  {image ? (
                    <img
                      src={image}
                      alt={item.name || item.title || ""}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        const fallback = event.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = "grid";
                      }}
                    />
                  ) : null}

                  <div
                    className="admin-app-image-fallback"
                    style={{ display: image ? "none" : "grid" }}
                  >
                    📱
                  </div>
                </div>

                <div className="admin-app-card-body">
                  <h3>{item.name || item.title || "ללא שם"}</h3>

                  {item.description && <p>{item.description}</p>}

                  {platform === "legacy" && guess && (
                    <div className="platform-suggestion">
                      💡 נראה שזו אפליקציית{" "}
                      <strong>
                        {guess === "ios" ? "iPhone / iOS" : "Android / Galaxy"}
                      </strong>
                    </div>
                  )}

                  {link && (
                    <a href={link} target="_blank" rel="noreferrer">
                      🔗 פתיחת הקישור הקיים
                    </a>
                  )}

                  {platform === "legacy" ? (
                    <div className="legacy-move-actions">
                      <button
                        type="button"
                        className={guess === "android" ? "suggested" : ""}
                        disabled={movingId === item._id}
                        onClick={() => moveExisting(item, "android")}
                      >
                        🤖 העבר ל־Android
                      </button>

                      <button
                        type="button"
                        className={`move-ios ${guess === "ios" ? "suggested" : ""}`}
                        disabled={movingId === item._id}
                        onClick={() => moveExisting(item, "ios")}
                      >
                        🍎 העבר ל־iPhone
                      </button>
                    </div>
                  ) : (
                    <div className="admin-app-card-actions">
                      <button type="button" onClick={() => startEdit(item)}>
                        ✏️ עריכה
                      </button>

                      <button
                        type="button"
                        className="danger"
                        onClick={() => remove(item)}
                      >
                        🗑️ מחיקה
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
