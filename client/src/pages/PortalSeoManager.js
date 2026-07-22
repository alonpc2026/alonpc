import { useState } from "react";

export default function PortalSeoManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [message, setMessage] = useState("");

  function saveSeo() {
    localStorage.setItem(
      "portalSeo",
      JSON.stringify({ title, description, keywords })
    );
    setMessage("✅ הגדרות ה-SEO נשמרו");
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>🔍 ניהול SEO</h1>

      <div className="card">
        <label>כותרת האתר</label>
        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="ALON PC"
        />

        <label>תיאור האתר</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <label>מילות מפתח</label>
        <textarea
          rows="3"
          value={keywords}
          onChange={(e)=>setKeywords(e.target.value)}
          placeholder="נגישות, מחשבים..."
        />

        <button className="detailsButton" onClick={saveSeo}>
          💾 שמור SEO
        </button>

        <p>{message}</p>
      </div>

      <div className="card">
        <h2>בהמשך ניתן להוסיף</h2>
        <ul>
          <li>Open Graph לרשתות חברתיות</li>
          <li>Twitter Cards</li>
          <li>Sitemap.xml</li>
          <li>Robots.txt</li>
          <li>Google Search Console</li>
        </ul>
      </div>
    </main>
  );
}
