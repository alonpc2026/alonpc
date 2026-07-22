import { useState } from "react";

export default function PortalSettings() {
  const [portalName, setPortalName] = useState("פורטל האתרים של אלון");
  const [showSearch, setShowSearch] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [message, setMessage] = useState("");

  function saveSettings() {
    localStorage.setItem(
      "portalSettings",
      JSON.stringify({
        portalName,
        showSearch,
        showCategories,
      })
    );

    setMessage("✅ ההגדרות נשמרו בהצלחה");
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>⚙️ הגדרות פורטל האתרים</h1>

      <div className="card">
        <label>שם הפורטל</label>
        <input
          value={portalName}
          onChange={(e) => setPortalName(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={showSearch}
            onChange={() => setShowSearch(!showSearch)}
          />
          הצג תיבת חיפוש
        </label>

        <label>
          <input
            type="checkbox"
            checked={showCategories}
            onChange={() => setShowCategories(!showCategories)}
          />
          הצג קטגוריות
        </label>

        <button className="detailsButton" onClick={saveSettings}>
          💾 שמור הגדרות
        </button>

        <p>{message}</p>
      </div>
    </main>
  );
}
