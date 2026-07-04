import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל מחובר יכול לראות את פורטל הניהול.</p>
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
      <p>שלום {user.name || user.email}</p>

      <div className="dashboardGrid">
        <Link to="/admin" className="dashboardCard">📋 ניהול שירותים</Link>
        <Link to="/admin" className="dashboardCard">➕ הוסף שירות</Link>
        <Link to="/admin" className="dashboardCard">📂 קטגוריות שירותים</Link>

        <Link to="/admin/shop" className="dashboardCard">🛒 ניהול חנות</Link>
        <Link to="/admin/shop" className="dashboardCard">📦 ניהול מוצרים</Link>
        <Link to="/admin/shop" className="dashboardCard">🗂️ קטגוריות מוצרים</Link>
        <Link to="/admin/shop" className="dashboardCard">🏷️ מותגים</Link>
        <Link to="/admin/shop" className="dashboardCard">💰 מבצעים</Link>

        <Link to="/admin/bookings" className="dashboardCard">📅 ניהול הזמנות שירות</Link>
        <Link to="/admin/bookings" className="dashboardCard">🛍️ ניהול הזמנות חנות</Link>

        <Link to="/dashboard" className="dashboardCard">👥 ניהול משתמשים</Link>
        <Link to="/dashboard" className="dashboardCard">🔑 הרשאות</Link>
        <Link to="/dashboard" className="dashboardCard">🖼️ גלריית תמונות</Link>
        <Link to="/dashboard" className="dashboardCard">📄 מסמכים</Link>
        <Link to="/dashboard" className="dashboardCard">⬆️ העלאת קבצים</Link>
        <Link to="/dashboard" className="dashboardCard">🌍 ניהול שפות</Link>
        <Link to="/dashboard" className="dashboardCard">✏️ עריכת תרגומים</Link>
        <Link to="/dashboard" className="dashboardCard">⚙️ הגדרות האתר</Link>
        <Link to="/dashboard" className="dashboardCard">📊 סטטיסטיקות</Link>
        <Link to="/dashboard" className="dashboardCard">💾 גיבוי</Link>
      </div>

      <button onClick={logout}>🚪 יציאה מהניהול</button>
    </section>
  );
}

export default Dashboard;