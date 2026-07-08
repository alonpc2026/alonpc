import { useState } from "react";

function AdminBackup() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לבצע גיבוי.</p>
      </section>
    );
  }

  const createBackup = () => {
    const backup = {
      createdAt: new Date().toLocaleString("he-IL"),

      siteSettings: JSON.parse(localStorage.getItem("siteSettings")) || {},
      services: JSON.parse(localStorage.getItem("services")) || [],
      serviceCategories:
        JSON.parse(localStorage.getItem("serviceCategories")) || [],
      products: JSON.parse(localStorage.getItem("products")) || [],
      productCategories:
        JSON.parse(localStorage.getItem("productCategories")) || [],
      brands: JSON.parse(localStorage.getItem("brands")) || [],
      offers: JSON.parse(localStorage.getItem("offers")) || [],
      secondHandItems:
        JSON.parse(localStorage.getItem("secondHandItems")) || [],
      galleryImages:
        JSON.parse(localStorage.getItem("galleryImages")) || [],
      documents: JSON.parse(localStorage.getItem("documents")) || [],
      uploads: JSON.parse(localStorage.getItem("uploads")) || [],
      users: JSON.parse(localStorage.getItem("siteUsers")) || [],
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ALONPC_Backup_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    setMessage("✅ קובץ הגיבוי הורד בהצלחה.");
  };

  return (
    <section className="loginBox">
      <h2>💾 גיבוי מערכת</h2>

      <p>
        הורד קובץ גיבוי הכולל את כל הנתונים השמורים במערכת.
      </p>

      <button onClick={createBackup}>
        💾 הורד גיבוי
      </button>

      {message && (
        <p
          style={{
            marginTop: 20,
            color: "green",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      <hr />

      <h3>הגיבוי כולל:</h3>

      <ul style={{ textAlign: "right" }}>
        <li>📋 שירותים</li>
        <li>📂 קטגוריות שירותים</li>
        <li>🛍️ חנות</li>
        <li>🗂️ קטגוריות מוצרים</li>
        <li>🏷️ מותגים</li>
        <li>💰 מבצעים</li>
        <li>♻️ יד שנייה</li>
        <li>🖼️ גלריה</li>
        <li>📄 מסמכים</li>
        <li>⬆️ העלאות קבצים</li>
        <li>👥 משתמשים</li>
        <li>⚙️ הגדרות האתר</li>
      </ul>
    </section>
  );
}

export default AdminBackup;
