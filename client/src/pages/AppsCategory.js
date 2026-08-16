import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AdminAccessButton from "../components/AdminAccessButton";
import "./AppsCategory.css";

// חשוב: משתמשים במאגר הישן הקיים כדי לא לאבד את הנתונים שהוזנו בעבר.
const API = "https://alonpc02026.onrender.com/api/mobile-apps";

const META = {
  android: {
    title: "Android / Galaxy",
    icon: "🤖",
    aliases: ["android","galaxy","samsung","סמסונג","אנדרואיד"]
  },
  ios: {
    title: "iPhone / iOS",
    icon: "🍎",
    aliases: ["ios","iphone","apple","אפל","אייפון"]
  },
  windows: {
    title: "Windows 10–11",
    icon: "🪟",
    aliases: ["windows","windows10","windows11","pc"]
  },
  mac: {
    title: "Mac",
    icon: "💻",
    aliases: ["mac","macos","apple-mac"]
  },
  tv: {
    title: "טלוויזיה חכמה",
    icon: "📺",
    aliases: ["tv","smart-tv","smarttv","television","טלוויזיה"]
  }
};

function norm(value) {
  return String(value || "").trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function textOf(item) {
  return [
    item.platform,
    item.type,
    item.deviceType,
    item.os,
    item.system,
    item.category,
    item.mobileType,
    item.name,
    item.title,
    item.description,
    item.publisher,
    item.company
  ].filter(Boolean).join(" ").toLowerCase();
}

function belongs(item, aliases) {
  const direct = [
    item.platform,
    item.type,
    item.deviceType,
    item.os,
    item.system,
    item.category,
    item.mobileType
  ].filter(Boolean).map(norm);

  if (direct.some((value) => aliases.includes(value))) return true;

  const text = textOf(item);
  return aliases.some((alias) => text.includes(alias.toLowerCase()));
}

export default function AppsCategory() {
  const { type } = useParams();
  const requested = norm(type);
  const meta = META[requested] || { title: type || "אפליקציות", icon: "📱", aliases: [requested] };

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API, { signal: controller.signal });
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "לא ניתן לטעון את מאגר האפליקציות הישן");
        }

        setItems(Array.isArray(data) ? data : data.apps || data.items || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        setItems([]);
        setError(err.message || "לא ניתן לטעון אפליקציות");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      if (!belongs(item, meta.aliases)) return false;
      return !q || textOf(item).includes(q);
    });
  }, [items, search, meta.aliases]);

  return (
    <main className="apps-category-page" dir="rtl">
      <AdminAccessButton />

      <header className="apps-category-hero">
        <span>{meta.icon}</span>
        <div>
          <h1>{meta.title}</h1>
          <p>נתונים מהמאגר הקיים של אפליקציות הסלולרי.</p>
        </div>
      </header>

      <section className="apps-category-tools">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`🔎 חיפוש בתוך ${meta.title}...`}
        />
        <Link to="/apps/mobile">📱 חזרה לאפליקציות סלולרי</Link>
      </section>

      {loading && <p className="apps-category-status">טוען את הנתונים הישנים...</p>}
      {error && <p className="apps-category-status error">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <section className="apps-category-empty">
          <h2>{meta.icon} {meta.title}</h2>
          <p>המאגר נטען, אבל לא נמצא פריט שמשויך לקטגוריה הזו.</p>
          <p>אפשר להיכנס ל־⚙️ ניהול אפליקציות ולערוך את הפריט הקיים ולבחור Android או iPhone.</p>
        </section>
      )}

      <section className="apps-category-grid">
        {filtered.map((item) => {
          const image = item.imageUrl || item.logoUrl || item.iconUrl || "";
          const url = item.url || item.link || item.websiteUrl || item.storeUrl || item.downloadUrl || "";

          return (
            <article className="apps-category-card" key={item._id || item.id || item.name || item.title}>
              <div className="apps-category-image">
                {image ? <img src={image} alt={item.name || item.title || ""} /> : <span>{meta.icon}</span>}
              </div>

              <div className="apps-category-card-body">
                <h2>{item.name || item.title || "אפליקציה"}</h2>
                {item.description && <p>{item.description}</p>}
                {url && <a href={url} target="_blank" rel="noreferrer">פתיחת האפליקציה / החנות</a>}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
