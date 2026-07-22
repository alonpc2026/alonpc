import React from "react";
import "./Admin.css";

const actions = [
  "ניהול משתמשים",
  "ניהול שירותים",
  "ניהול חנות",
  "ניהול פרסומים",
  "הודעות מערכת",
  "הגדרות האתר"
];

export default function Admin() {
  return (
    <main className="admin-page" dir="rtl">
      <h1>ניהול האתר ALONPC</h1>

      <div className="admin-grid">
        {actions.map((action) => (
          <button key={action} className="admin-card">
            <span className="admin-icon">⚙️</span>
            <strong>{action}</strong>
          </button>
        ))}
      </div>

      <section className="admin-info">
        <h2>סטטוס מערכת</h2>
        <ul>
          <li>✅ השרת פעיל</li>
          <li>✅ מסד הנתונים מחובר</li>
          <li>✅ האתר זמין</li>
        </ul>
      </section>
    </main>
  );
}
