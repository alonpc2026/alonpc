import { useState } from "react";

export default function PortalStatistics() {
  const [stats] = useState({
    categories: 18,
    links: 250,
    visits: 5420,
    favorites: 87
  });

  return (
    <main className="pageContainer" dir="rtl">
      <h1>📈 סטטיסטיקות פורטל האתרים</h1>

      <div className="grid">
        <div className="card">
          <h2>📂 קטגוריות</h2>
          <h1>{stats.categories}</h1>
        </div>

        <div className="card">
          <h2>🔗 קישורים</h2>
          <h1>{stats.links}</h1>
        </div>

        <div className="card">
          <h2>👁️ כניסות</h2>
          <h1>{stats.visits}</h1>
        </div>

        <div className="card">
          <h2>⭐ מועדפים</h2>
          <h1>{stats.favorites}</h1>
        </div>
      </div>

      <div className="card">
        <h2>דוחות עתידיים</h2>
        <ul>
          <li>הקישורים הנצפים ביותר</li>
          <li>קטגוריות פופולריות</li>
          <li>סטטיסטיקה לפי תאריך</li>
          <li>ייצוא דוחות ל-Excel ו-PDF</li>
        </ul>
      </div>
    </main>
  );
}
