import { useState } from "react";

export default function PortalBackup() {
  const [message, setMessage] = useState("");

  function createBackup() {
    const backup = {
      createdAt: new Date().toISOString(),
      version: "1.0",
      note: "Portal backup",
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portal-backup.json";
    a.click();
    URL.revokeObjectURL(url);

    setMessage("✅ הגיבוי נוצר בהצלחה");
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>💾 גיבוי פורטל האתרים</h1>

      <div className="card">
        <p>צור קובץ גיבוי של נתוני הפורטל.</p>

        <button
          className="detailsButton"
          onClick={createBackup}
        >
          💾 צור גיבוי
        </button>

        <p>{message}</p>
      </div>

      <div className="card">
        <h2>בעתיד</h2>
        <ul>
          <li>גיבוי מלא של כל הקטגוריות והקישורים.</li>
          <li>שחזור מגיבוי.</li>
          <li>גיבוי אוטומטי.</li>
        </ul>
      </div>
    </main>
  );
}
