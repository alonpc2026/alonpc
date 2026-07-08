import { useEffect, useState } from "react";

function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));
  const API = "https://alonpc-server.onrender.com/api/services";

  const categories = [
    "מחשבים",
    "נגישות",
    "בריאות",
    "משפטים",
    "תחבורה",
    "לימודים",
    "עסקים",
    "מסמכים",
    "שונות",
  ];

  const icons = ["💻", "♿", "🏥", "⚖️", "🚌", "📚", "🏪", "📄", "🛠️", "☎️"];

  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [showExtra, setShowExtra] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "מחשבים",
    icon: "💻",
    link: "",
    description: "",
    businessName: "",
    address: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל שירותים.</p>
      </section>
    );
  }

  const loadServices = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setMessage("❌ שגיאה בטעינת שירותים");
    }
  };

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const clearForm = () => {
    setEditId(null);
    setShowExtra(false);
    setForm({
      name: "",
      category: "מחשבים",
      icon: "💻",
      link: "",
      description: "",
      businessName: "",
      address: "",
      city: "",
      phone: "",
    });
  };

  const saveService = async () => {
    if (!form.name.trim()) {
      setMessage("נא למלא שם אתר / שירות");
      return;
    }

    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setMessage(editId ? "✅ השירות עודכן" : "✅ השירות נוסף");
      clearForm();
      loadServices();
    } catch {
      setMessage("❌ לא ניתן לשמור שירות");
    }
  };

  const startEdit = (service) => {
    setEditId(service._id);
    setShowExtra(
      Boolean(service.businessName || service.address || service.city || service.phone)
    );

    setForm({
      name: service.name || "",
      category: service.category || "מחשבים",
      icon: service.icon || "💻",
      link: service.link || "",
      description: service.description || "",
      businessName: service.businessName || "",
      address: service.address || "",
      city: service.city || "",
      phone: service.phone || "",
    });
  };

  const deleteService = async (id) => {
    if (!window.confirm("למחוק שירות?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      setMessage("🗑️ השירות נמחק");
      loadServices();
    } catch {
      setMessage("❌ שגיאה במחיקה");
    }
  };

  return (
    <section className="loginBox">
      <h2>📋 ניהול שירותים</h2>

      <input
        placeholder="שם אתר / שירות"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select value={form.icon} onChange={(e) => updateField("icon", e.target.value)}>
        {icons.map((icon) => (
          <option key={icon} value={icon}>{icon}</option>
        ))}
      </select>

      <input
        placeholder="כתובת קישור לאתר"
        value={form.link}
        onChange={(e) => updateField("link", e.target.value)}
      />

      <textarea
        placeholder="תיאור קצר"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
      />

      <h3>להוסיף עוד פרטים של האתר?</h3>

      <button type="button" onClick={() => setShowExtra(true)}>
        ✅ כן
      </button>

      <button type="button" onClick={() => setShowExtra(false)}>
        ❌ לא
      </button>

      {showExtra && (
        <>
          <input
            placeholder="שם עסק"
            value={form.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
          />

          <input
            placeholder="כתובת"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />

          <input
            placeholder="עיר"
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />

          <input
            placeholder="טלפון"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </>
      )}

      <button onClick={saveService}>
        {editId ? "💾 שמור עריכה" : "➕ הוסף שירות"}
      </button>

      {editId && <button onClick={clearForm}>❌ ביטול עריכה</button>}

      <p>{message}</p>

      <hr />

      <h2>שירותים קיימים</h2>

      {services.map((service) => (
        <div className="adminService" key={service._id}>
          <h3>{service.icon || "🛠️"} {service.name}</h3>
          <p>קטגוריה: {service.category}</p>
          <p>{service.description}</p>

          {service.businessName && <p>שם עסק: {service.businessName}</p>}
          {service.address && <p>כתובת: {service.address}</p>}
          {service.city && <p>עיר: {service.city}</p>}
          {service.phone && <p>טלפון: {service.phone}</p>}

          {service.link && (
            <a href={service.link} target="_blank" rel="noreferrer">
              <button>🔗 פתח אתר</button>
            </a>
          )}

          <button onClick={() => startEdit(service)}>✏️ ערוך</button>
          <button onClick={() => deleteService(service._id)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default Admin;