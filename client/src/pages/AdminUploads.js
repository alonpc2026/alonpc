import { useEffect, useState } from "react";

function AdminUploads() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [uploads, setUploads] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    fileUrl: "",
    fileType: "תמונה",
    description: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("uploads")) || [];
    setUploads(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל העלאות קבצים.</p>
      </section>
    );
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const saveUploads = (list) => {
    localStorage.setItem("uploads", JSON.stringify(list));
    setUploads(list);
  };

  const clearForm = () => {
    setForm({
      title: "",
      category: "",
      fileUrl: "",
      fileType: "תמונה",
      description: "",
    });
  };

  const addUpload = () => {
    if (!form.title || !form.fileUrl) {
      setMessage("נא למלא שם וקישור לקובץ");
      return;
    }

    const newUpload = {
      ...form,
      createdAt: new Date().toLocaleString("he-IL"),
    };

    saveUploads([...uploads, newUpload]);
    clearForm();
    setMessage("✅ הקובץ נוסף");
  };

  const deleteUpload = (index) => {
    if (!window.confirm("למחוק קובץ?")) return;

    const list = uploads.filter((_, i) => i !== index);
    saveUploads(list);
    setMessage("🗑️ הקובץ נמחק");
  };

  return (
    <section className="loginBox">
      <h2>⬆️ ניהול העלאת קבצים</h2>

      <input
        placeholder="שם הקובץ"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
      />

      <input
        placeholder="קטגוריה: שירותים / חנות / מסמכים / יד שנייה"
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
      />

      <select
        value={form.fileType}
        onChange={(e) => updateField("fileType", e.target.value)}
      >
        <option value="תמונה">תמונה</option>
        <option value="PDF">PDF</option>
        <option value="מסמך">מסמך</option>
        <option value="לוגו">לוגו</option>
        <option value="אחר">אחר</option>
      </select>

      <input
        placeholder="קישור לקובץ / תמונה / PDF"
        value={form.fileUrl}
        onChange={(e) => updateField("fileUrl", e.target.value)}
      />

      <textarea
        placeholder="תיאור קצר"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <button onClick={addUpload}>➕ הוסף קובץ</button>

      <p>{message}</p>

      <hr />

      {uploads.length === 0 && <p>אין קבצים עדיין.</p>}

      {uploads.map((file, index) => (
        <div className="adminService" key={index}>
          <h3>⬆️ {file.title}</h3>
          <p>קטגוריה: {file.category}</p>
          <p>סוג: {file.fileType}</p>
          <p>{file.description}</p>
          <small>{file.createdAt}</small>

          <br />

          {file.fileType === "תמונה" || file.fileType === "לוגו" ? (
            <img
              src={file.fileUrl}
              alt={file.title}
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 12,
                background: "white",
              }}
            />
          ) : (
            <a href={file.fileUrl} target="_blank" rel="noreferrer">
              <button>📂 פתח קובץ</button>
            </a>
          )}

          <br />

          <button onClick={() => deleteUpload(index)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminUploads;