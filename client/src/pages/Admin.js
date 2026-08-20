import { Link } from "react-router-dom";
import "./Admin.css";
import "./AdminEmergencyPortalFix.css";

const adminSections = [
  {
    title: "🚨 ניהול חירום",
    description: "משטרה 100 • מגן דוד אדום 101 • כבאות והצלה 102",
    icon: "🚨",
    path: "/admin/emergency",
    className: "admin-card-red",
  },

  {
    title: "ניהול מוצרים וחנות",
    description: "הוספה, עריכה, מחיקה, מחירים, מלאי ותמונות",
    icon: "🛍️",
    path: "/admin/shop",
    className: "admin-card-blue",
  },
  {
    title: "ניהול קטגוריות מוצרים",
    description: "יצירה ועדכון של קטגוריות החנות",
    icon: "🗂️",
    path: "/admin/product-categories",
    className: "admin-card-purple",
  },
  {
    title: "ניהול מותגים",
    description: "הוספה ועריכה של מותגים",
    icon: "🏷️",
    path: "/admin/brands",
    className: "admin-card-orange",
  },
  {
    title: "ניהול מבצעים",
    description: "יצירת מבצעים ועדכון מבצעים קיימים",
    icon: "🎁",
    path: "/admin/offers",
    className: "admin-card-red",
  },
  {
    title: "ניהול עסקים נותני שירות",
    description:
      "הוספה, תיקון ומחיקה של עסקים, בעלי מקצוע ופרטי נגישות",
    icon: "🏢",
    path: "/admin/services",
    className: "admin-card-green",
  },
  {
    title: "גופים ממשלתיים וציבוריים",
    description:
      "משטרה, כבאות, מד״א, ביטוח לאומי ומשרדי ממשלה",
    icon: "🏛️",
    path: "/admin/government",
    className: "admin-card-navy",
  },
  {
    title: "ניהול יד שנייה",
    description: "פרסום, עריכה והסרה של מוצרים יד שנייה",
    icon: "♻️",
    path: "/admin/second-hand",
    className: "admin-card-teal",
  },
  {
    title: "ניהול מסמכים",
    description: "העלאה, עריכה ומחיקה של מסמכים",
    icon: "📄",
    path: "/admin/documents",
    className: "admin-card-brown",
  },
  {
    title: "ניהול גלריה",
    description: "ניהול תמונות ותצוגת הגלריה",
    icon: "🖼️",
    path: "/admin/gallery",
    className: "admin-card-pink",
  },
  {
    title: "ניהול העלאות",
    description: "צפייה וניהול של קבצים שהועלו",
    icon: "📤",
    path: "/admin/uploads",
    className: "admin-card-cyan",
  },
  {
    title: "ניהול משתמשים",
    description: "צפייה במשתמשים ועדכון הרשאות",
    icon: "👥",
    path: "/admin/users",
    className: "admin-card-indigo",
  },
  {
    title: "הרשאות מנהלים",
    description: "ניהול הרשאות וגישה למסכי הניהול",
    icon: "🔐",
    path: "/admin/permissions",
    className: "admin-card-dark",
  },
  {
    title: "ניהול אירועים רגילים",
    description: "אירועים עם תאריך ושעה: הוספה, עריכה ומחיקה",
    icon: "📅",
    path: "/admin/events",
    className: "admin-card-blue",
  },
  {
    title: "ניהול אירועים קבועים",
    description: "מקומות קבועים, שעות פעילות, מסמכים ופרטי נגישות",
    icon: "📌",
    path: "/admin/permanent-events",
    className: "admin-card-violet",
  },
  {
    title: "ניהול יהדות",
    description: "שיעורי תורה נגישים, עזרה ביהדות, חומר לימוד ואירועים",
    icon: "✡️",
    path: "/admin/judaism",
    className: "admin-card-indigo",
  },
  {
    title: "ניהול קישורים לקבוצה בפייס",
    description: "הוספה, עריכה ומחיקה של קישורים והערות לגולשים",
    icon: "📘",
    path: "/admin/facebook-group-links",
    className: "admin-card-indigo",
  },
  {
    title: "ניהול אתרים מעניינים",
    description: "שם, לוגו, קישור, קטגוריה וצבעי פרסום נגישים",
    icon: "🌐",
    path: "/admin/interesting-sites",
    className: "admin-card-indigo",
  },
  {
    title: "הזמנות ובקשות שירות",
    description: "צפייה בבקשות, טיפול ועדכון מצב",
    icon: "📅",
    path: "/admin/bookings",
    className: "admin-card-yellow",
  },
  {
    title: "ניהול כל האפליקציות",
    description: "ניהול אפליקציות סלולרי, טלוויזיה חכמה, Windows 10-11 ו-Mac",
    icon: "📱",
    path: "/admin/apps",
    className: "admin-card-teal",
  },

  {
    title: "ניהול כל המשחקים",
    description: "מחשב, Android, Apple וטלוויזיה חכמה",
    icon: "🎮",
    path: "/admin/games",
    className: "admin-card-violet",
  },
  {
    title: "סטטיסטיקות",
    description: "צפייה בנתוני שימוש ופעילות באתר",
    icon: "📊",
    path: "/admin/statistics",
    className: "admin-card-violet",
  },
  {
    title: "הגדרות האתר",
    description: "פרטי קשר, טקסטים והגדרות כלליות",
    icon: "⚙️",
    path: "/admin/settings",
    className: "admin-card-gray",
  },
  {
    title: "גיבוי ושחזור",
    description: "יצירת גיבוי ושחזור נתוני האתר",
    icon: "💾",
    path: "/admin/backup",
    className: "admin-card-lime",
  },
  {
    title: "לוח בקרה פנימי",
    description: "מידע פנימי למנהל בלבד",
    icon: "📈",
    path: "/dashboard",
    className: "admin-card-dashboard",
  },
];

function Admin() {
  return (
    <main className="admin-portal-page" dir="rtl">
      <section className="admin-portal-header">
        <div className="admin-portal-logo" aria-hidden="true">
          A
        </div>

        <div>
          <p className="admin-private-label">
            🔒 אזור מנהל בלבד
          </p>

          <h1>פורטל ניהול ALONPC</h1>

          <p>
            בחר את תחום הניהול הרצוי. כפתורי שינוי, עריכה
            ומחיקה זמינים למנהל מורשה בלבד.
          </p>
        </div>
      </section>

      <section
        className="admin-portal-grid"
        aria-label="כפתורי פורטל הניהול"
      >
        {adminSections.map((section) => (
          <Link
            key={section.path}
            to={section.path}
            className={`admin-portal-card ${section.className}`}
          >
            <span
              className="admin-portal-icon"
              aria-hidden="true"
            >
              {section.icon}
            </span>

            <span className="admin-portal-content">
              <strong>{section.title}</strong>
              <small>{section.description}</small>
            </span>

            <span
              className="admin-portal-arrow"
              aria-hidden="true"
            >
              ←
            </span>
          </Link>
        ))}
      </section>

      <section
        className="admin-portal-warning"
        role="note"
      >
        <strong>חשוב:</strong> אין לשתף את פרטי הכניסה.
        לאחר סיום העבודה יש ללחוץ על כפתור היציאה בתפריט
        העליון.
      </section>

      <div className="admin-portal-bottom-actions">
        <Link to="/" className="admin-home-button">
          🏠 חזרה לאתר
        </Link>
      </div>
    </main>
  );
}

export default Admin;
