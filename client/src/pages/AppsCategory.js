import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AppsCategory.css";

const API = "https://alonpc02026.onrender.com/api/apps";

const PLATFORM_META = {
  android: {
    title: "Android / Galaxy",
    icon: "🤖",
    aliases: ["android", "galaxy", "samsung"]
  },
  ios: {
    title: "iPhone / iOS",
    icon: "🍎",
    aliases: ["ios", "iphone", "apple"]
  },
  windows: {
    title: "Windows 10–11",
    icon: "🪟",
    aliases: ["windows", "windows10", "windows11", "pc"]
  },
  mac: {
    title: "Mac",
    icon: "💻",
    aliases: ["mac", "macos", "apple-mac"]
  },
  tv: {
    title: "טלוויזיה חכמה",
    icon: "📺",
    aliases: ["tv", "smart-tv", "smarttv", "television"]
  }
};

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

function getPlatformValues(app) {
  return [
    app.platform,
    app.type,
    app.deviceType,
    app.os,
    app.system,
    app.category,
    app.mobileType
  ]
    .filter(Boolean)
    .map(normalize);
}

function matchesPlatform(app, aliases) {
  const values = getPlatformValues(app);

  if (values.some((value) => aliases.includes(value))) {
    return true;
  }

  // Compatibility for older saved records where the platform was stored in text.
  const text = [
    app.name,
    app.title,
    app.description,
    app.platform,
    app.type,
    app.deviceType,
    app.os,
    app.system,
    app.category
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return aliases.some((alias) => text.includes(alias));
}

export default function AppsCategory() {
  const { type } = useParams();
  const requested = normalize(type);
  const meta =
    PLATFORM_META[requested] || {
      title: type || "אפליקציות",
      icon: "📱",
      aliases: [requested]
    };

  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadApps() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API, {
          signal: controller.signal
        });

        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(
            data.message || "לא ניתן לטעון את מאגר האפליקציות"
          );
        }

        setApps(Array.isArray(data) ? data : data.apps || []);
      } catch (requestError) {
        if (requestError.name === "AbortError") return;
        setApps([]);
        setError(
          requestError.message || "לא ניתן לטעון את מאגר האפליקציות"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadApps();

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return apps.filter((app) => {
      if (!matchesPlatform(app, meta.aliases)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const text = [
        app.name,
        app.title,
        app.description,
        app.publisher,
        app.company
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [apps, search, meta.aliases]);

  return (
    <main className="apps-category-page" dir="rtl">
      <header className="apps-category-hero">
        <span className="apps-category-icon" aria-hidden="true">
          {meta.icon}
        </span>

        <div>
          <h1>{meta.title}</h1>
          <p>מוצגות רק אפליקציות ששויכו למערכת הזו.</p>
        </div>
      </header>

      <section className="apps-category-tools">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`🔎 חיפוש בתוך ${meta.title}...`}
        />

        <Link to="/apps/mobile">
          📱 חזרה לאפליקציות סלולרי
        </Link>
      </section>

      {loading && (
        <p className="apps-category-status">
          טוען אפליקציות...
        </p>
      )}

      {error && (
        <p className="apps-category-status error">
          {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <section className="apps-category-empty">
          <h2>
            {meta.icon} {meta.title}
          </h2>
          <p>
            לא נמצאו כרגע אפליקציות ששויכו למערכת הזו.
          </p>
        </section>
      )}

      <section className="apps-category-grid">
        {filtered.map((app) => {
          const image =
            app.imageUrl ||
            app.logoUrl ||
            app.iconUrl ||
            "";

          const url =
            app.url ||
            app.websiteUrl ||
            app.storeUrl ||
            app.link ||
            "";

          return (
            <article
              className="apps-category-card"
              key={app._id || app.id || app.name || app.title}
            >
              <div className="apps-category-image">
                {image ? (
                  <img
                    src={image}
                    alt={app.name || app.title || ""}
                    loading="lazy"
                  />
                ) : (
                  <span aria-hidden="true">{meta.icon}</span>
                )}
              </div>

              <div className="apps-category-card-body">
                <h2>{app.name || app.title}</h2>

                {app.description && (
                  <p>{app.description}</p>
                )}

                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    פתיחת האפליקציה / החנות
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
