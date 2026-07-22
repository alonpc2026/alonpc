import React from "react";
import "./Dashboard.css";

const cards = [
  { title: "משתמשים", value: "1,248", icon: "👥" },
  { title: "שירותים", value: "245", icon: "🛠" },
  { title: "הודעות", value: "18", icon: "🔔" },
  { title: "מוצרים", value: "96", icon: "🛒" },
];

export default function Dashboard() {
  return (
    <main className="dashboard-page" dir="rtl">
      <h1>לוח הבקרה</h1>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div className="dashboard-card" key={card.title}>
            <div className="icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="dashboard-actions">
        <button>ניהול משתמשים</button>
        <button>ניהול שירותים</button>
        <button>ניהול חנות</button>
        <button>הגדרות</button>
      </div>
    </main>
  );
}
