import { useEffect, useState } from "react";

function AdminGovernment() {
  const API = "https://alonpc02026.onrender.com/api/services";

  const categories = [
    "חירשים וכבדי שמיעה",
    "אוטיזם",
    "מוגבלות מוטורית",
    "מוגבלות נוירוקוגניטיבית",
    "מוגבלות שכלית התפתחותית",
    "עיוורון ולקות ראייה",
    "ילדים עם עיכוב התפתחותי",
  ];

  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    icon: "🏛️",
    link: "",
    description: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      setServices(
        Array.isArray(data)
          ? data.filter((s) => categories.includes(s.category))
          : []
      );
    } catch {
      setMessage("שגיאה בטעינת השירותים");
    }
  };

  const saveService = async () => {
    if (!form.name.trim()) {
      alert("יש להזין שם שירות");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setMessage("✅ השירות נשמר");
      setForm({
        name: "",
        category: categories[0],
        icon: "🏛️",
        link: "",
        description: "",
      });

      loadServices();
    } catch {
      setMessage("❌ שגיאה בשמירה");
    }
  };

  return (
    <div className="adminPage">
      <h1>🏛️ ניהול ממשלתי</h1>

      <input
        placeholder="שם השירות"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <select
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        placeholder="קישור"
        value={form.link}
        onChange={(e) =>
          setForm({ ...form, link: e.target.value })
        }
      />

      <textarea
        placeholder="תיאור"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button onClick={saveService}>
        💾 שמור שירות
      </button>

      <p>{message}</p>

      <hr />

      <h2>שירותים ממשלתיים</h2>

      {services.map((service) => (
        <div
          key={service._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h3>
            {service.icon} {service.name}
          </h3>

          <p>{service.category}</p>

          <p>{service.description}</p>

          {service.link && (
            <a
              href={service.link}
              target="_blank"
              rel="noreferrer"
            >
              מעבר לאתר
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminGovernment;