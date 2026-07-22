import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const services = [
  { title: "אתרים פופולריים", subtitle: "קישורים שימושיים לאתרים חשובים", icon: "🌐", color: "purple", path: "/services" },
  { title: "בריאות ורפואה", subtitle: "מידע רפואי ומוסדות רפואיים", icon: "❤", color: "red", path: "/services" },
  { title: "זכויות והטבות", subtitle: "קצבאות, זכויות והטבות", icon: "♿", color: "green", path: "/services" },
  { title: "תחבורה ונגישות", subtitle: "תחבורה ציבורית ומידע נגיש", icon: "🚌", color: "blue", path: "/services" },
  { title: "עבודה ולוח דרושים", subtitle: "משרות מותאמות והכוונה", icon: "💼", color: "orange", path: "/services" },
  { title: "קניות ומוצרים", subtitle: "מוצרים מומלצים ומבצעים", icon: "🛒", color: "cyan", path: "/shop" },
  { title: "לימודים והכשרות", subtitle: "קורסים והכשרות מקצועיות", icon: "🎓", color: "gold", path: "/services" },
  { title: "סיוע משפטי", subtitle: "מידע משפטי וייעוץ", icon: "⚖", color: "pink", path: "/services" },
  { title: "תמיכה טכנית", subtitle: "תיקון מחשבים ותמיכה מרחוק", icon: "🎧", color: "navy", path: "/services" },
  { title: "שירותים לבית ולעסק", subtitle: "תיקונים, תחזוקה ושירותים", icon: "🛠", color: "lime", path: "/services" },
  { title: "קהילה ושיתוף", subtitle: "קבוצות תמיכה וחדשות", icon: "👥", color: "violet", path: "/services" },
  { title: "פנאי ואירועים", subtitle: "אירועים ופעילויות נגישות", icon: "🎉", color: "sky", path: "/services" },
  { title: "תרומות וסיוע", subtitle: "אפשרויות לקבלת סיוע", icon: "🤲", color: "teal", path: "/services" },
  { title: "מועדפים", subtitle: "שמירת שירותים חשובים", icon: "★", color: "amber", path: "/dashboard" },
  { title: "עדכונים והודעות", subtitle: "חדשות והודעות חשובות", icon: "🔔", color: "royal", path: "/dashboard" }
];

function Home() {
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    const term = search.trim();
    if (!term) return services;

    return services.filter((service) =>
      `${service.title} ${service.subtitle}`.includes(term)
    );
  }, [search]);

  return (
    <main className="home-page" dir="rtl">
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="home-hero__badge">♿ אתר נגיש לכולם</span>
          <h1>מרכז השירותים של ALONPC</h1>
          <p>כל השירותים, המידע והסיוע במקום אחד — בצורה ברורה, נגישה ונוחה.</p>

          <div className="home-search">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="מה אתה מחפש?"
              aria-label="חיפוש שירות"
            />
            <button type="button" onClick={() => setSearch("")}>נקה</button>
          </div>
        </div>
      </section>

      <section className="home-services" aria-label="קטגוריות שירות">
        {filteredServices.map((service) => (
          <Link
            key={service.title}
            to={service.path}
            className={`service-card service-card--${service.color}`}
          >
            <span className="service-card__icon">{service.icon}</span>
            <h2>{service.title}</h2>
            <p>{service.subtitle}</p>
            <span className="service-card__arrow">←</span>
          </Link>
        ))}
      </section>

      {filteredServices.length === 0 && (
        <div className="home-empty">לא נמצאו תוצאות מתאימות לחיפוש.</div>
      )}

      <section className="home-stats" aria-label="נתוני האתר">
        <article><span>👥</span><strong>12,458</strong><small>חברי קהילה</small></article>
        <article><span>👁</span><strong>98,765</strong><small>צפיות באתר</small></article>
        <article><span>✓</span><strong>245</strong><small>שירותים זמינים</small></article>
        <article><span>📅</span><strong>48</strong><small>אירועים החודש</small></article>
        <article><span>❤</span><strong>1,256</strong><small>אנשים שקיבלו סיוע</small></article>
      </section>

      <section className="home-contact-bar" aria-label="יצירת קשר מהירה">
        <a href="https://wa.me/972545221809" target="_blank" rel="noreferrer">WhatsApp</a>
        <a href="tel:+972545221809">חייג לאלון</a>
        <Link to="/contact">צור קשר</Link>
        <Link to="/dashboard">לוח בקרה</Link>
      </section>
    </main>
  );
}

export default Home;
