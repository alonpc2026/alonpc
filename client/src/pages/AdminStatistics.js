import { useEffect, useState } from "react";

function AdminStatistics() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    services: 0,
    products: 0,
    secondHand: 0,
    documents: 0,
    gallery: 0,
    uploads: 0,
    users: 0,
    brands: 0,
    offers: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    setStats({
      services: (JSON.parse(localStorage.getItem("services")) || []).length,
      products: (JSON.parse(localStorage.getItem("products")) || []).length,
      secondHand: (JSON.parse(localStorage.getItem("secondHandItems")) || []).length,
      documents: (JSON.parse(localStorage.getItem("documents")) || []).length,
      gallery: (JSON.parse(localStorage.getItem("galleryImages")) || []).length,
      uploads: (JSON.parse(localStorage.getItem("uploads")) || []).length,
      users: (JSON.parse(localStorage.getItem("siteUsers")) || []).length,
      brands: (JSON.parse(localStorage.getItem("brands")) || []).length,
      offers: (JSON.parse(localStorage.getItem("offers")) || []).length,
    });
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לצפות בסטטיסטיקות.</p>
      </section>
    );
  }

  return (
    <section className="loginBox">
      <h2>📊 סטטיסטיקות האתר</h2>

      <div className="dashboardGrid">

        <div className="dashboardCard">
          <h3>📋 שירותים</h3>
          <h2>{stats.services}</h2>
        </div>

        <div className="dashboardCard">
          <h3>🛍️ מוצרים</h3>
          <h2>{stats.products}</h2>
        </div>

        <div className="dashboardCard">
          <h3>♻️ יד שנייה</h3>
          <h2>{stats.secondHand}</h2>
        </div>

        <div className="dashboardCard">
          <h3>📄 מסמכים</h3>
          <h2>{stats.documents}</h2>
        </div>

        <div className="dashboardCard">
          <h3>🖼️ תמונות</h3>
          <h2>{stats.gallery}</h2>
        </div>

        <div className="dashboardCard">
          <h3>⬆️ קבצים</h3>
          <h2>{stats.uploads}</h2>
        </div>

        <div className="dashboardCard">
          <h3>👥 משתמשים</h3>
          <h2>{stats.users}</h2>
        </div>

        <div className="dashboardCard">
          <h3>🏷️ מותגים</h3>
          <h2>{stats.brands}</h2>
        </div>

        <div className="dashboardCard">
          <h3>💰 מבצעים</h3>
          <h2>{stats.offers}</h2>
        </div>

      </div>

      <br />

      <button
        onClick={() => window.location.reload()}
      >
        🔄 רענן נתונים
      </button>
    </section>
  );
}

export default AdminStatistics;
