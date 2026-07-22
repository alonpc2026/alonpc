import { useState } from "react";

export default function PortalThemeManager() {
  const [primaryColor, setPrimaryColor] = useState("#0d6efd");
  const [secondaryColor, setSecondaryColor] = useState("#198754");
  const [logo, setLogo] = useState("");

  function saveTheme() {
    localStorage.setItem(
      "portalTheme",
      JSON.stringify({
        primaryColor,
        secondaryColor,
        logo
      })
    );

    alert("✅ ערכת העיצוב נשמרה");
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>🎨 ניהול עיצוב הפורטל</h1>

      <div className="card">
        <label>צבע ראשי</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e)=>setPrimaryColor(e.target.value)}
        />

        <label>צבע משני</label>
        <input
          type="color"
          value={secondaryColor}
          onChange={(e)=>setSecondaryColor(e.target.value)}
        />

        <label>לוגו</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setLogo(e.target.files?.[0]?.name || "")}
        />

        <p>{logo}</p>

        <button
          className="detailsButton"
          onClick={saveTheme}
        >
          💾 שמור עיצוב
        </button>
      </div>

      <div className="card">
        <h2>אפשרויות עתידיות</h2>
        <ul>
          <li>ערכת צבעים לכל שפה.</li>
          <li>בחירת גופנים.</li>
          <li>החלפת רקעים.</li>
          <li>תצוגה מקדימה בזמן אמת.</li>
        </ul>
      </div>
    </main>
  );
}
