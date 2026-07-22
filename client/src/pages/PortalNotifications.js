import { useState } from "react";

export default function PortalBannerManager() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [image, setImage] = useState("");

  function saveBanner() {
    alert("✅ הבאנר נשמר (גרסת דוגמה)");
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>🖼️ ניהול באנרים</h1>

      <div className="card">

        <input
          placeholder="כותרת ראשית"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <input
          placeholder="כותרת משנה"
          value={subtitle}
          onChange={(e)=>setSubtitle(e.target.value)}
        />

        <input
          placeholder="טקסט הכפתור"
          value={buttonText}
          onChange={(e)=>setButtonText(e.target.value)}
        />

        <input
          placeholder="קישור הכפתור"
          value={buttonLink}
          onChange={(e)=>setButtonLink(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setImage(e.target.files?.[0]?.name || "")}
        />

        <p>{image}</p>

        <button
          className="detailsButton"
          onClick={saveBanner}
        >
          💾 שמור באנר
        </button>

      </div>

      <div className="card">
        <h2>אפשרויות עתידיות</h2>
        <ul>
          <li>תזמון תאריך התחלה וסיום.</li>
          <li>מספר באנרים מתחלפים.</li>
          <li>באנר שונה לכל שפה.</li>
          <li>שמירה ב-MongoDB.</li>
        </ul>
      </div>

    </main>
  );
}
