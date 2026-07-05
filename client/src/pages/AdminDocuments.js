import { useEffect, useState } from "react";

function AdminDocuments() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [documents, setDocuments] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    fileUrl: "",
    description: "",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("documents")) || [];
    setDocuments(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל מסמכים.</p>
      </section>
    );
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const saveDocuments = (list) => {
    localStorage.setItem("documents", JSON.stringify(list));
    setDocuments(list);
  };

  const clearForm = () => {
    setEditIndex(-1);
    setForm({
      title: "",
      category: "",
      fileUrl: "",
      description: "",
    });
  };

  const saveDocument = () => {
    if (!form.title || !form.fileUrl) {
      setMessage("נא למלא שם מסמך וקישור לקובץ");
      return;
    }

    if (editIndex >= 0) {
      const list = [...documents];
      list[editIndex] = form;
      saveDocuments(list);
      setMessage("✅ המסמך עודכן");
    } else {
      saveDocuments([...documents, form]);
      setMessage("✅ המסמך נוסף");
    }

    clearForm();
  };

  const editDocument = (index) => {
    setEditIndex(index);
    setForm(documents[index]);
  };

  const deleteDocument = (index) => {
    if (!window.confirm("למחוק מסמך?")) return;

    const list = documents.filter((_, i) => i !== index);
    saveDocuments(list);
    setMessage("🗑️ המסמך נמחק");
  };

  return (
    <section className="loginBox">
      <h2>📄 ניהול מסמכים</h2>

      <input
        placeholder="שם המסמך"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
      />

      <input
        placeholder="קטגוריה"
        value={form.category}
        onChange={(e) => updateField("category", e.target.value)}
      />

      <input
        placeholder="קישור לקובץ / PDF"
        value={form.fileUrl}
        onChange={(e) => updateField("fileUrl", e.target.value)}
      />

      <textarea
        placeholder="תיאור קצר"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <button onClick={saveDocument}>
        {editIndex >= 0 ? "💾 שמור עריכה" : "➕ הוסף מסמך"}
      </button>

      {editIndex >= 0 && <button onClick={clearForm}>❌ ביטול</button>}

      <p>{message}</p>

      <hr />

      {documents.length === 0 && <p>אין מסמכים עדיין.</p>}

      {documents.map((doc, index) => (
        <div className="adminService" key={index}>
          <h3>📄 {doc.title}</h3>
          <p>{doc.category}</p>
          <p>{doc.description}</p>

          <a href={doc.fileUrl} target="_blank" rel="noreferrer">
            <button>📂 פתח מסמך</button>
          </a>

          <button onClick={() => editDocument(index)}>✏️ ערוך</button>
          <button onClick={() => deleteDocument(index)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminDocuments;