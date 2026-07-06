import { useEffect, useState } from "react";

function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    icon: "",
    link: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    hours: "",
    imageUrl: "",
  });

  const API = "http://localhost:3001/api/services";

  useEffect(() => {
    loadServices();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל מחובר יכול לנהל שירותים.</p>
      </section>
    );
  }

  const loadServices = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setServices(data);
    } catch (error) {
      setMessage("❌ שגיאה בטעינת שירותים מהשרת");
    }
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const clearForm = () => {
    setEditId(null);
    setForm({
      name: "",
      category: "",
      icon: "",
      link: "",
      description: "",
      phone: "",
      email: "",
      address: "",
      hours: "",
      imageUrl: "",
    });
  };

  const saveService = async () => {
    if (!form.name || !form.category) {
      setMessage("נא למלא שם שירות וקטגוריה");
      return;
    }

    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("save failed");
      }

      setMessage(editId ? "✅ השירות עודכן ב־MongoDB" : "✅ השירות נוסף ל־MongoDB");
      clearForm();
      loadServices();
    } catch (error) {
      setMessage("❌ שגיאה בשמירת שירות");
    }
  };

  const startEdit = (service) => {
    setEditId(service._id);

    setForm({
      name: service.name || "",
      category: service.category || "",
      icon: service.icon || "",
      link: service.link || "",
      description: service.description || "",
      phone: service.phone || "",
      email: service.email || "",
      address: service.address || "",
      hours: service.hours || "",
      imageUrl: service.imageUrl || "",
    });

    setMessage("✏️ מצב עריכה פעיל");
  };

  const deleteService = async (id) => {
    if (!window.confirm("למחוק שירות?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("delete failed");
      }

      setMessage("🗑️ השירות נמחק מ־MongoDB");
      loadServices();
    } catch (error) {
      setMessage("❌ שגיאה במחיקת שירות");
    }
  };

  return (
    <section className="loginBox">
      <h2>📋 ניהול שירותים MongoDB</h2>

      <input
        placeholder="שם השירות"
        value={form.name}
        onChange={(e) => updateForm("name", e.target.value)}
      />

      <input
        placeholder="קטגוריה"
        value={form.category}
        onChange={(e) => updateForm("category", e.target.value)}
      />

      <input
        placeholder="אייקון לדוגמה: 🦷 🏥 💻 ♿"
        value={form.icon}
        onChange={(e) => updateForm("icon", e.target.value)}
      />

      <input
        placeholder="קישור לאתר"
        value={form.link}
        onChange={(e) => updateForm("link", e.target.value)}
      />

      <input
        placeholder="תיאור קצר"
        value={form.description}
        onChange={(e) => updateForm("description", e.target.value)}
      />

      <input
        placeholder="טלפון"
        value={form.phone}
        onChange={(e) => updateForm("phone", e.target.value)}
      />

      <input
        placeholder="אימייל"
        value={form.email}
        onChange={(e) => updateForm("email", e.target.value)}
      />

      <input
        placeholder="כתובת"
        value={form.address}
        onChange={(e) => updateForm("address", e.target.value)}
      />

      <input
        placeholder="שעות פעילות"
        value={form.hours}
        onChange={(e) => updateForm("hours", e.target.value)}
      />

      <input
        placeholder="קישור לתמונה / לוגו"
        value={form.imageUrl}
        onChange={(e) => updateForm("imageUrl", e.target.value)}
      />

      <button onClick={saveService}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף שירות"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h2>שירותים קיימים</h2>

      {services.length === 0 && <p>אין שירותים עדיין.</p>}

      {services.map((service) => (
        <div className="adminService" key={service._id}>
          {service.imageUrl ? (
            <img
              src={service.imageUrl}
              alt={service.name}
              style={{
                width: 90,
                height: 90,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
          ) : (
            <div style={{ fontSize: 38 }}>{service.icon}</div>
          )}

          <h3>{service.name}</h3>
          <p>{service.category}</p>
          <p>{service.description}</p>

          <button onClick={() => startEdit(service)}>✏️ ערוך</button>
          <button onClick={() => deleteService(service._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default Admin;