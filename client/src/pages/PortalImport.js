import { useState } from "react";

export default function PortalImport() {
  const [status, setStatus] = useState("");

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus(`נבחר קובץ: ${file.name}`);
    // בהמשך ניתן לייבא CSV / Excel / JSON ולשלוח לשרת.
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>📥 ייבוא קישורים לפורטל</h1>

      <div className="card">
        <p>בחר קובץ CSV, Excel או JSON לייבוא קישורים.</p>

        <input
          type="file"
          accept=".csv,.xlsx,.xls,.json"
          onChange={handleFile}
        />

        <p>{status}</p>

        <button className="detailsButton">
          🚀 התחל ייבוא
        </button>
      </div>

      <div className="card">
        <h2>פורמטים נתמכים</h2>
        <ul>
          <li>CSV</li>
          <li>Excel (.xlsx)</li>
          <li>JSON</li>
        </ul>
      </div>
    </main>
  );
}
