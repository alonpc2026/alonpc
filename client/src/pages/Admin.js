import { useEffect, useState } from "react";

function Admin() {
  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    loadServices();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>אין הרשאה</h2>
        <p>רק מנהל מחובר יכול להוסיף או לערוך שירותים.</p>
      </section>
    );
  }

  const loadServices = () => {
    fetch("http://localhost:3001/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => setMessage("שגיאה בטעינת שירותים"));
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const clearForm = () => {
    setEditId(null);
    setSelectedImage(null);
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

  const uploadImage = async () => {
    if (!selectedImage) {
      setMessage("בחר תמונה קודם");
      return;
    }

    const imageData = new FormData();
    imageData.append("image", selectedImage);

    const response = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: imageData,
    });

    const data = await response.json();

    if (response.ok) {
      updateForm("imageUrl", data.imageUrl);
      setMessage("התמונה הועלתה בהצלחה");
    } else {
      setMessage("שגיאה בהעלאת תמונה");
    }
  };

  const saveService = async () => {
    if (!form.name || !form.category) {
      setMessage("נא למלא שם שירות וקטגוריה");
      return;
    }

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
      setMessage(editId ? "השירות עודכן בהצלחה" : "השירות נוסף בהצלחה");
      clearForm();
      loadServices();
    } else {
      setMessage("שגיאה בשמירת שירות");
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
    setMessage("מצב עריכה פעיל");
  };

  const deleteService = async (id) => {
    if (!window.confirm("למחוק שירות?")) return;

    const response = await fetch(`http://localhost:3001/api/services/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMessage("השירות נמחק");
      loadServices();
    }
  };

  return (
    <section className="loginBox">
      <h2>📋 ניהול שירותים</h2>

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
        placeholder="אייקון לדוגמה: ♿ 🏥 💻"
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

      <hr />

      <h3>🖼️ תמונת שירות / לוגו</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files[0])}
      />

      <button onClick={uploadImage}>⬆️ העלה תמונה</button>

      {form.imageUrl && (
        <div>
          <p>תצוגה מקדימה:</p>
          <img
            src={form.imageUrl}
            alt="preview"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        </div>
      )}

      <hr />

      <button onClick={saveService}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף שירות"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h2>שירותים קיימים</h2>

      {services.map((service) => (
        <div className="adminService" key={service._id}>
          {service.imageUrl ? (
            <img
              src={service.imageUrl}
              alt={service.name}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ) : (
            <div style={{ fontSize: "40px" }}>{service.icon}</div>
          )}

          <h3>{service.name}</h3>
          <p>{service.category}</p>

          {service.phone && <p>📞 {service.phone}</p>}
          {service.address && <p>📍 {service.address}</p>}

          <button onClick={() => startEdit(service)}>✏️ ערוך</button>
          <button onClick={() => deleteService(service._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default Admin;