import { useEffect, useState } from "react";

function AdminDocuments() {
  const user = JSON.parse(localStorage.getItem("user"));

  const API = "http://localhost:3001/api/documents";
  const UPLOAD_API = "http://localhost:3001/api/documents/upload";

  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    fileUrl: "",
    description: "",
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל מסמכים.</p>
      </section>
    );
  }

  const loadDocuments = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch {
      setMessage("❌ שגיאה בטעינת מסמכים");
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const clearForm = () => {
    setEditId(null);
    setSelectedFile(null);
    setForm({
      title: "",
      category: "",
      fileUrl: "",
      description: "",
    });
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      setMessage("בחר קובץ קודם");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", selectedFile);

      const res = await fetch(UPLOAD_API, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error();

      updateField("fileUrl", result.fileUrl);
      setMessage("✅ הקובץ הועלה בהצלחה");
    } catch {
      setMessage("❌ שגיאה בהעלאת קובץ");
    }
  };

  const saveDocument = async () => {
    if (!form.title || !form.fileUrl) {
      setMessage("נא למלא שם מסמך ולהעלות קובץ");
      return;
    }

    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setMessage(editId ? "✅ המסמך עודכן" : "✅ המסמך נוסף");
      clearForm();
      loadDocuments();
    } catch {
      setMessage("❌ שגיאה בשמירת מסמך");
    }
  };

  const startEdit = (doc) => {
    setEditId(doc._id);
    setSelectedFile(null);

    setForm({
      title: doc.title || "",
      category: doc.category || "",
      fileUrl: doc.fileUrl || "",
      description: doc.description || "",
    });

    setMessage("✏️ מצב עריכה פעיל");
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("למחוק מסמך?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setMessage("🗑️ המסמך נמחק");
      loadDocuments();
    } catch {
      setMessage("❌ שגיאה במחיקת מסמך");
    }
  };

  return (
    <section className="loginBox">
      <h2>📄 ניהול מסמכים MongoDB + העלאה</h2>

      <input placeholder="שם המסמך" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
      <input placeholder="קטגוריה" value={form.category} onChange={(e) => updateField("category", e.target.value)} />
      <textarea placeholder="תיאור קצר" value={form.description} onChange={(e) => updateField("description", e.target.value)} />

      <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={uploadFile}>⬆️ העלה קובץ</button>

      <input placeholder="קישור קובץ" value={form.fileUrl} onChange={(e) => updateField("fileUrl", e.target.value)} />

      <button onClick={saveDocument}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף מסמך"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h2>מסמכים קיימים</h2>

      {documents.length === 0 && <p>אין מסמכים עדיין.</p>}

      {documents.map((doc) => (
        <div className="adminService" key={doc._id}>
          <h3>📄 {doc.title}</h3>
          <p>{doc.category}</p>
          <p>{doc.description}</p>

          <a href={doc.fileUrl} target="_blank" rel="noreferrer">
            <button>📂 פתח מסמך</button>
          </a>

          <button onClick={() => startEdit(doc)}>✏️ ערוך</button>
          <button onClick={() => deleteDocument(doc._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminDocuments;