import { useState } from "react";

export default function PortalUsers() {
  const [users] = useState([
    { name: "Alon Admin", role: "מנהל", status: "פעיל" },
    { name: "Demo User", role: "משתמש", status: "פעיל" }
  ]);

  return (
    <main className="pageContainer" dir="rtl">
      <h1>👥 ניהול משתמשי הפורטל</h1>

      <div className="grid">
        {users.map((user, index) => (
          <div className="card" key={index}>
            <h2>{user.name}</h2>
            <p>תפקיד: {user.role}</p>
            <p>סטטוס: {user.status}</p>

            <button className="detailsButton">
              ✏️ ערוך
            </button>

            <button className="detailsButton">
              🔒 הרשאות
            </button>

            <button className="detailsButton">
              🗑️ מחק
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <button className="detailsButton">
          ➕ הוסף משתמש חדש
        </button>
      </div>
    </main>
  );
}
