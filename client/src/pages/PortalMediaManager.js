import { useState } from "react";

export default function PortalMediaManager() {
  const [files, setFiles] = useState([]);

  function uploadFiles(event) {
    const selected = Array.from(event.target.files || []).map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type || "Unknown"
    }));

    setFiles(prev => [...prev, ...selected]);
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>🖼️ ניהול מדיה</h1>

      <div className="card">
        <p>העלה תמונות, סרטונים, קבצי PDF וקבצים נוספים לשימוש באתר.</p>

        <input
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          onChange={uploadFiles}
        />

        <br /><br />

        <button className="detailsButton">
          ⬆️ העלה קבצים
        </button>
      </div>

      <div className="grid">
        {files.map((file, index) => (
          <div className="card" key={index}>
            <h3>📄 {file.name}</h3>
            <p>📦 {file.size}</p>
            <p>🏷️ {file.type}</p>

            <button className="detailsButton">
              👁️ תצוגה
            </button>

            <button className="detailsButton">
              ✏️ שנה שם
            </button>

            <button className="detailsButton">
              🗑️ מחק
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>אפשרויות עתידיות</h2>
        <ul>
          <li>☁️ שמירת הקבצים ב-MongoDB/GridFS או בענן.</li>
          <li>🖼️ יצירת גלריות.</li>
          <li>🎥 ניהול סרטונים.</li>
          <li>📄 ניהול מסמכי PDF.</li>
          <li>🔍 חיפוש וסינון קבצים.</li>
        </ul>
      </div>
    </main>
  );
}
