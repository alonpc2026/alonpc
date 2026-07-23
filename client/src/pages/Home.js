import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const MANUAL_VISITOR_COUNT = 12580;

const mainButtons = [
  {
    title: "מרכז השירותים",
    subtitle: "כל השירותים במקום אחד",
    icon: "♿",
    color: "blue",
    path: "/accessible-portal",
  },
  {
    title: "משרדי ממשלה",
    subtitle: "שירותים ממשלתיים וטפסים",
    icon: "🏛️",
    color: "navy",
    path: "/government",
  },
  {
    title: "ביטוח לאומי",
    subtitle: "קצבאות, זכויות וטפסים",
    icon: "🏦",
    color: "royal",
    path: "/services",
  },
  {
    title: "בריאות",
    subtitle: "קופות חולים ושירותי רפואה",
    icon: "❤️",
    color: "green",
    path: "/services",
  },
  {
    title: "נגישות",
    subtitle: "מידע וסיוע לאנשים עם מוגבלות",
    icon: "♿",
    color: "cyan",
    path: "/services",
  },
  {
    title: "תחבורה",
    subtitle: "תחבורה ציבורית וניידות",
    icon: "🚗",
    color: "lime",
    path: "/services",
  },
  {
    title: "תעסוקה",
    subtitle: "משרות, הכשרה וסיוע בעבודה",
    icon: "💼",
    color: "purple",
    path: "/services",
  },
  {
    title: "מסמכים",
    subtitle: "טפסים, אישורים ומידע שימושי",
    icon: "📄",
    color: "orange",
    path: "/documents",
  },
  {
    title: "חנות של אלון",
    subtitle: "מחשבים, ציוד ומוצרים נגישים",
    icon: "🛒",
    color: "amber",
    path: "/shop",
  },
  {
    title: "יד שנייה",
    subtitle: "מוצרים יד שנייה",
    icon: "♻️",
    color: "teal",
    path: "/second-hand",
  },
  {
    title: "הזמנת שירות",
    subtitle: "פתיחת בקשה לשירות או טיפול",
    icon: "🗓️",
    color: "pink",
    path: "/booking",
  },

  {
    title: "לוח אירועים בישראל",
    subtitle: "אירועים, הופעות, כנסים ופעילויות לפי חודשים",
    icon: "📅",
    color: "royal",
    path: "/israel-events",
  },
  {
    title: "אתרים מעניינים של אלון",
    subtitle: "קישורים לאתרים מומלצים ושימושיים",
    icon: "🌐",
    color: "indigo",
    path: "/interesting-sites",
  },
  {
    title: "אודות",
    subtitle: "מידע על ALONPC",
    icon: "ℹ️",
    color: "sky",
    path: "/about",
  },
  {
    title: "צור קשר",
    subtitle: "פנייה לאלון בכתב",
    icon: "📞",
    color: "red",
    path: "/contact",
  },
];

function Home() {
  const [search, setSearch] = useState("");

  const filteredButtons = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return mainButtons;
    }

    return mainButtons.filter((button) =>
      `${button.title} ${button.subtitle}`.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <main className="home-page" dir="rtl">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-accessibility-badge">
            ♿ אתר נגיש וברור לכולם
          </span>

          <h1>מרכז השירותים של ALONPC</h1>

          <p>
            כל השירותים, החנות, המסמכים והסיוע במקום אחד.
          </p>

          <div className="home-search">
            <span aria-hidden="true">🔍</span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="חיפוש כפתור או שירות"
              aria-label="חיפוש כפתור או שירות"
            />

            <button
              type="button"
              onClick={() => setSearch("")}
              disabled={!search}
            >
              נקה
            </button>
          </div>
        </div>
      </section>

      <section className="home-main-buttons" aria-label="כל הכפתורים הראשיים">
        {filteredButtons.map((button) => (
          <Link
            key={button.title}
            to={button.path}
            className={`home-main-button home-main-button--${button.color}`}
          >
            <span className="home-main-button-icon" aria-hidden="true">
              {button.icon}
            </span>

            <span className="home-main-button-text">
              <strong>{button.title}</strong>
              <small>{button.subtitle}</small>
            </span>

            <span className="home-main-button-arrow" aria-hidden="true">
              ←
            </span>
          </Link>
        ))}
      </section>

      {filteredButtons.length === 0 && (
        <section className="home-empty">
          לא נמצאו כפתורים מתאימים לחיפוש.
        </section>
      )}

      <section className="home-contact-strip" aria-label="יצירת קשר מהירה">
        <a
          href="https://wa.me/972545221809"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <a href="tel:+972545221809">
          054-5221809
        </a>

        <Link to="/contact">
          כתבו לאלון
        </Link>
      </section>

      <section className="manual-visitor-counter" aria-label="מונה מבקרים">
        <div className="visitor-counter-image" aria-hidden="true">
          <svg viewBox="0 0 220 160" role="img">
            <circle cx="75" cy="55" r="28" />
            <circle cx="145" cy="55" r="28" />
            <path d="M25 142c4-38 25-57 50-57s46 19 50 57" />
            <path d="M95 142c4-38 25-57 50-57s46 19 50 57" />
          </svg>
        </div>

        <div className="visitor-counter-content">
          <span>מונה מבקרים</span>
          <strong>
            {MANUAL_VISITOR_COUNT.toLocaleString("he-IL")}
          </strong>
          <small>המספר מתעדכן ידנית על ידי מנהל האתר</small>
        </div>
      </section>
    </main>
  );
}

export default Home;
