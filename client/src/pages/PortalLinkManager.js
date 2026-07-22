import { useState } from "react";

export default function PortalLinkManager() {
  const [category, setCategory] = useState("חדשות");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [links, setLinks] = useState([]);

  function addLink() {
    if (!title.trim() || !url.trim()) return;

    setLinks([
      ...links,
      {
        category,
        title,
        url,
      },
    ]);

    setTitle("");
    setUrl("");
  }

  function removeLink(index) {
    setLinks(links.filter((_, i) => i !== index));
  }

  return (
    <main className="pageContainer" dir="rtl">
      <h1>🌐 ניהול קישורי הפורטל</h1>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>חדשות</option>
        <option>ממשלה</option>
        <option>בנקים</option>
        <option>בריאות</option>
        <option>תחבורה</option>
      </select>

      <input
        placeholder="שם הקישור"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button className="detailsButton" onClick={addLink}>
        ➕ הוסף קישור
      </button>

      <div className="grid">
        {links.map((item, index) => (
          <div className="card" key={index}>
            <h2>{item.title}</h2>
            <p>קטגוריה: {item.category}</p>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.url}
            </a>
            <br />
            <button
              className="detailsButton"
              onClick={() => removeLink(index)}
            >
              🗑️ מחק
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
