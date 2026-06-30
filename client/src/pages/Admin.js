import { useEffect, useState } from "react";

function Admin() {
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);

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

  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const loadServices = () => {
    fetch("http://localhost:3001/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => setMessage("שגיאה בטעינת שירותים ❌"));
  };

  useEffect(() => {
    loadServices();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h3>אין הרשאה</h3>
        <p>רק מנהל מחובר יכול להיכנס לדף זה.</p>
      </section>
    );
  }

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
    const url = editId
      ? `http://localhost:3001/api/services/${editId}`
      : "http://localhost:3001/api/services";

    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setMessage(editId ? "השירות עודכן בהצלחה ✅" : "השירות נוסף בהצלחה ✅");
      clearForm();
      loadServices();
    } else {
      setMessage("שגיאה בשמירה ❌");
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
    setMessage("מצב עריכה פעיל ✏️");
  };

  const deleteService = async (id) => {
    const response = await fetch(`http://localhost:3001/api/services/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMessage("השירות נמחק בהצלחה 🗑️");
      loadServices();
    }
  };

  return (
    <section className="loginBox">
      <h3>ניהול אתר ALONPC</h3>

      <input placeholder="שם השירות" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
      <input placeholder="קטגוריה" value={form.category} onChange={(e) => updateForm("category", e.target.value)} />
      <input placeholder="אייקון לדוגמה: ♿ ❤️ 💼" value={form.icon} onChange={(e) => updateForm("icon", e.target.value)} />
      <input placeholder="קישור לאתר" value={form.link} onChange={(e) => updateForm("link", e.target.value)} />
      <input placeholder="תיאור קצר" value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
      <input placeholder="טלפון" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} />
      <input placeholder="אימייל" value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
      <input placeholder="כתובת" value={form.address} onChange={(e) => updateForm("address", e.target.value)} />
      <input placeholder="שעות פעילות" value={form.hours} onChange={(e) => updateForm("hours", e.target.value)} />
      <input placeholder="קישור לתמונה / לוגו" value={form.imageUrl} onChange={(e) => updateForm("imageUrl", e.target.value)} />

      <button onClick={saveService}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף שירות"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h3>שירותים קיימים</h3>

      {services.map((service) => (
        <div className="adminService" key={service._id}>
          <strong>{service.icon} {service.name}</strong>
          <br />
          <small>{service.category}</small>
          <br />
          {service.phone && <small>📞 {service.phone}</small>}
          <br />
          <button onClick={() => startEdit(service)}>✏️ ערוך</button>
          <button onClick={() => deleteService(service._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default Admin;