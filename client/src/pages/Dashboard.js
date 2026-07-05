import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל מחובר יכול לראות את פורטל הניהול.</p>

        <Link to="/">
          <button>🏠 חזרה לאתר</button>
        </Link>
      </section>
    );
  }

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <section className="loginBox">
      <h2>⚙️ פורטל ניהול ALON PC</h2>

      <p>ברוך הבא {user.name || "מנהל"}</p>

      <div className="dashboardGrid">

        {/* שירותים */}
        <Link to="/admin" className="dashboardCard">
          📋 ניהול שירותים
        </Link>

        <Link to="/admin/service-categories" className="dashboardCard">
          📂 קטגוריות שירותים
        </Link>

        {/* חנות */}
        <Link to="/admin/shop" className="dashboardCard">
          🛒 ניהול חנות
        </Link>

        <Link to="/admin/shop" className="dashboardCard">
          📦 ניהול מוצרים
        </Link>

        <Link
          to="/admin/product-categories"
          className="dashboardCard"
        >
          🗂️ קטגוריות מוצרים
        </Link>

        <Link to="/admin/brands" className="dashboardCard">
          🏷️ מותגים
        </Link>

        <Link to="/admin/offers" className="dashboardCard">
          💰 מבצעים
        </Link>

        {/* הזמנות */}
        <Link to="/admin/bookings" className="dashboardCard">
          📅 ניהול הזמנות שירות
        </Link>

        <Link to="/admin/shop-orders" className="dashboardCard">
          🛍️ ניהול הזמנות חנות
        </Link>

        {/* משתמשים */}
        <Link to="/admin/users" className="dashboardCard">
          👥 ניהול משתמשים
        </Link>

        <Link to="/admin/permissions" className="dashboardCard">
          🔑 הרשאות
        </Link>

        {/* מדיה */}
        <Link to="/admin/gallery" className="dashboardCard">
          🖼️ גלריית תמונות
        </Link>

        <Link to="/admin/documents" className="dashboardCard">
          📄 מסמכים
        </Link>

        <Link to="/admin/uploads" className="dashboardCard">
          ⬆️ העלאת קבצים
        </Link>

        {/* מערכת */}
        <Link to="/admin/translations" className="dashboardCard">
          🌍 ניהול שפות
        </Link>

        <Link to="/admin/edit-translations" className="dashboardCard">
          ✏️ עריכת תרגומים
        </Link>

        <Link to="/admin/settings" className="dashboardCard">
          ⚙️ הגדרות האתר
        </Link>

        <Link to="/admin/statistics" className="dashboardCard">
          📊 סטטיסטיקות
        </Link>

        <Link to="/admin/backup" className="dashboardCard">
          💾 גיבוי
        </Link>

      </div>

      <br />

      <button className="logoutBtn" onClick={logout}>
        🚪 יציאה מהניהול
      </button>
    </section>
  );
}

export default Dashboard;