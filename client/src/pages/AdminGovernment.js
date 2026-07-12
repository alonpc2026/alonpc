import { useCallback, useEffect, useState } from "react";

const API = "https://alonpc02026.onrender.com/api/services";

const CATEGORIES = [
  "חירשים וכבדי שמיעה",
  "אוטיזם",
  "מוגבלות מוטורית",
  "מוגבלות נוירוקוגניטיבית",
  "מוגבלות שכלית התפתחותית",
  "עיוורון ולקות ראייה",
  "ילדים עם עיכוב התפתחותי",
];

const ICONS = [
  "🏛️",
  "🦻",
  "🧩",
  "♿",
  "🧠",
  "🤝",
  "🦯",
  "🧒",
];

const createEmptyForm = () => ({
  name: "",
  category: CATEGORIES[0],
  icon: "🏛️",
  link: "",
  description: "",
  businessName: "",
  address: "",
  city: "",
  phone: "",
});

function AdminGovernment() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const [services, setServices] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(createEmptyForm);

  const loadServices = useCallback(async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("שגיאה בקבלת השירותים");
      }

      const data = await response.json();

      const governmentServices = Array.isArray(data)
        ? data.filter((service) =>
            CATEGORIES.includes(
              String(service.category || "").trim()
            )
          )
        : [];

      setServices(governmentServices);
      setMessage("");
    } catch (error) {
      setServices([]);
      setMessage(
        `❌ שגיאה בטעינת שירותים: ${error.message}`
      );
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const clearForm = () => {
    setEditId(null);
    setForm(createEmptyForm());
  };

  const saveService = async () => {
    if (!form.name.trim()) {
      setMessage("נא למלא שם שירות ממשלתי");
      return;
    }

    try {
      const response = await fetch(
        editId ? `${API}/${editId}` : API,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            name: form.name.trim(),
            category: form.category.trim(),
            link: form.link.trim(),
            description: form.description.trim(),
            businessName: form.businessName.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            phone: form.phone.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "שגיאה בשמירה"
        );
      }

      setMessage(
        editId
          ? "✅ השירות עודכן בהצלחה"
          : "✅ השירות נשמר בהצלחה"
      );

      clearForm();
      await loadServices();
    } catch (error) {
      setMessage(
        `❌ לא ניתן לשמור שירות: ${error.message}`
      );
    }
  };

  const startEdit = (service) => {
    setEditId(service._id);

    setForm({
      name: service.name || "",
      category:
        service.category &&
        CATEGORIES.includes(service.category)
          ? service.category
          : CATEGORIES[0],
      icon: service.icon || "🏛️",
      link: service.link || "",
      description: service.description || "",
      businessName: service.businessName || "",
      address: service.address || "",
      city: service.city || "",
      phone: service.phone || "",
    });

    setMessage("✏️ מצב עריכה פעיל");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteService = async (id) => {
    const approved = window.confirm(
      "האם למחוק את השירות הממשלתי?"
    );

    if (!approved) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "שגיאה במחיקה"
        );
      }

      setMessage("🗑️ השירות נמחק בהצלחה");
      await loadServices();
    } catch (error) {
      setMessage(
        `❌ לא ניתן למחוק שירות: ${error.message}`
      );
    }
  };

  const normalizeLink = (link) => {
    if (!link) {
      return "";
    }

    if (
      link.startsWith("https://") ||
      link.startsWith("http://")
    ) {
      return link;
    }

    return `https://${link}`;
  };

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox" dir="rtl">
        <h2>🔐 אין הרשאה</h2>
        <p>
          רק מנהל מחובר יכול לנהל שירותים ממשלתיים.
        </p>
      </section>
    );
  }

  return (
    <section className="loginBox" dir="rtl">
      <h2>🏛️ ניהול שירותים ממשלתיים</h2>

      <input
        type="text"
        placeholder="שם השירות"
        value={form.name}
        onChange={(event) =>
          updateField("name", event.target.value)
        }
      />

      <select
        value={form.category}
        onChange={(event) =>
          updateField("category", event.target.value)
        }
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={form.icon}
        onChange={(event) =>
          updateField("icon", event.target.value)
        }
      >
        {ICONS.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="קישור לאתר הממשלתי"
        value={form.link}
        onChange={(event) =>
          updateField("link", event.target.value)
        }
      />

      <textarea
        placeholder="תיאור השירות"
        value={form.description}
        onChange={(event) =>
          updateField("description", event.target.value)
        }
      />

      <input
        type="text"
        placeholder="שם הגוף או המשרד"
        value={form.businessName}
        onChange={(event) =>
          updateField("businessName", event.target.value)
        }
      />

      <input
        type="text"
        placeholder="כתובת"
        value={form.address}
        onChange={(event) =>
          updateField("address", event.target.value)
        }
      />

      <input
        type="text"
        placeholder="עיר"
        value={form.city}
        onChange={(event) =>
          updateField("city", event.target.value)
        }
      />

      <input
        type="text"
        placeholder="טלפון"
        value={form.phone}
        onChange={(event) =>
          updateField("phone", event.target.value)
        }
      />

      <button type="button" onClick={saveService}>
        {editId
          ? "💾 שמור עריכה"
          : "➕ הוסף שירות ממשלתי"}
      </button>

      {editId && (
        <button type="button" onClick={clearForm}>
          ❌ ביטול עריכה
        </button>
      )}

      {message && <p>{message}</p>}

      <hr />

      <h2>שירותים ממשלתיים קיימים</h2>

      {services.length === 0 && (
        <p>עדיין אין שירותים ממשלתיים.</p>
      )}

      {services.map((service) => (
        <div className="adminService" key={service._id}>
          <h3>
            {service.icon || "🏛️"} {service.name}
          </h3>

          <p>
            <strong>קטגוריה:</strong>{" "}
            {service.category}
          </p>

          {service.description && (
            <p>{service.description}</p>
          )}

          {service.businessName && (
            <p>
              <strong>שם הגוף:</strong>{" "}
              {service.businessName}
            </p>
          )}

          {service.address && (
            <p>
              <strong>כתובת:</strong> {service.address}
            </p>
          )}

          {service.city && (
            <p>
              <strong>עיר:</strong> {service.city}
            </p>
          )}

          {service.phone && (
            <p>
              <strong>טלפון:</strong> {service.phone}
            </p>
          )}

          {service.link && (
            <a
              href={normalizeLink(service.link)}
              target="_blank"
              rel="noreferrer"
            >
              <button type="button">🔗 פתח אתר</button>
            </a>
          )}

          <button
            type="button"
            onClick={() => startEdit(service)}
          >
            ✏️ ערוך
          </button>

          <button
            type="button"
            onClick={() => deleteService(service._id)}
          >
            🗑️ מחק
          </button>
        </div>
      ))}
    </section>
  );
}

export default AdminGovernment;