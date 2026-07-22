import { useState } from "react";

const languages = [
  { code: "he", name: "עברית" },
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "am", name: "አማርኛ" }
];

export default function PortalLanguageManager() {
  const [selected, setSelected] = useState("he");
  const [keyName, setKeyName] = useState("");
  const [translation, setTranslation] = useState("");

  function saveTranslation() {
    alert("✅ התרגום נשמר (גרסת בסיס)");
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>🌍 ניהול שפות</h1>

      <div className="card">
        <label>בחר שפה</label>
        <select
          value={selected}
          onChange={(e)=>setSelected(e.target.value)}
        >
          {languages.map(lang=>(
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <label>מפתח תרגום</label>
        <input
          value={keyName}
          onChange={(e)=>setKeyName(e.target.value)}
          placeholder="home.title"
        />

        <label>טקסט מתורגם</label>
        <textarea
          rows="5"
          value={translation}
          onChange={(e)=>setTranslation(e.target.value)}
          placeholder="הקלד את התרגום..."
        />

        <button
          className="detailsButton"
          onClick={saveTranslation}
        >
          💾 שמור תרגום
        </button>
      </div>

      <div className="card">
        <h2>שפות נתמכות</h2>
        <ul>
          <li>🇮🇱 עברית</li>
          <li>🇺🇸 English</li>
          <li>🇷🇺 Русский</li>
          <li>🇸🇦 العربية</li>
          <li>🇪🇹 አማርኛ</li>
        </ul>
      </div>
    </main>
  );
}
