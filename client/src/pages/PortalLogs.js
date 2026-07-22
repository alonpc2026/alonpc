import { useState } from "react";

export default function PortalLogs() {
  const [logs] = useState([
    {
      date: "2026-07-20 10:15",
      user: "Alon Admin",
      action: "הוסיף קישור חדש"
    },
    {
      date: "2026-07-20 10:40",
      user: "Alon Admin",
      action: "ערך קטגוריה"
    },
    {
      date: "2026-07-20 11:05",
      user: "Alon Admin",
      action: "יצר גיבוי"
    }
  ]);

  return (
    <main className="pageContainer" dir="rtl">
      <h1>📝 יומן פעולות</h1>

      <div className="grid">
        {logs.map((log,index)=>(
          <div className="card" key={index}>
            <h2>{log.user}</h2>
            <p><strong>פעולה:</strong> {log.action}</p>
            <p><strong>תאריך:</strong> {log.date}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <button className="detailsButton">
          📄 ייצוא יומן פעולות
        </button>
      </div>
    </main>
  );
}
