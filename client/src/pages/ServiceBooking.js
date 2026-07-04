import { useState } from "react";

function ServiceBooking() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    details: "",
  });

  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const sendBooking = async () => {
    if (!form.name || !form.phone || !form.serviceType) {
      setMessage("נא למלא שם, טלפון וסוג שירות");
      return;
    }

    try {
      // שמירה במסד הנתונים
      const response = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("שמירת ההזמנה נכשלה");
      }

      // יצירת הודעת WhatsApp
      const text = `
📅 הזמנת שירות חדשה

👤 שם: ${form.name}

📞 טלפון: ${form.phone}

📍 כתובת: ${form.address}

🛠️ סוג שירות: ${form.serviceType}

📅 תאריך רצוי: ${form.preferredDate}

🕒 שעה רצויה: ${form.preferredTime}

📝 פירוט:
${form.details}
`;

      // החלף למספר ה-WhatsApp שלך
      const whatsappNumber = "972545521809";

      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
        "_blank"
      );

      setMessage("✅ ההזמנה נשמרה ונשלחה ל-WhatsApp");

      // ניקוי הטופס
      setForm({
        name: "",
        phone: "",
        address: "",
        serviceType: "",
        preferredDate: "",
        preferredTime: "",
        details: "",
      });

    } catch (err) {
      console.error(err);
      setMessage("❌ שגיאה בשמירת ההזמנה");
    }
  };

  return (
    <section className="loginBox">
      <h2>📅 הזמנת שירות / תיאום ביקור</h2>

      <input
        placeholder="שם מלא"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <input
        placeholder="טלפון"
        value={form.phone}
        onChange={(e) => updateField("phone", e.target.value)}
      />

      <input
        placeholder="כתובת"
        value={form.address}
        onChange={(e) => updateField("address", e.target.value)}
      />

      <select
        value={form.serviceType}
        onChange={(e) => updateField("serviceType", e.target.value)}
      >
        <option value="">בחר סוג שירות</option>
        <option value="תיקון מחשב">תיקון מחשב</option>
        <option value="מחשב נייד">מחשב נייד</option>
        <option value="מדפסת">מדפסת</option>
        <option value="רשת ואינטרנט">רשת ואינטרנט</option>
        <option value="סטרימר">סטרימר</option>
        <option value="התקנת תוכנה">התקנת תוכנה</option>
        <option value="שירות בבית הלקוח">שירות בבית הלקוח</option>
        <option value="אחר">אחר</option>
      </select>

      <input
        type="date"
        value={form.preferredDate}
        onChange={(e) => updateField("preferredDate", e.target.value)}
      />

      <input
        type="time"
        value={form.preferredTime}
        onChange={(e) => updateField("preferredTime", e.target.value)}
      />

      <textarea
        rows="5"
        placeholder="פירוט התקלה או הבקשה"
        value={form.details}
        onChange={(e) => updateField("details", e.target.value)}
      />

      <button onClick={sendBooking}>
        📅 שלח הזמנת שירות
      </button>

      {message && (
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          {message}
        </p>
      )}
    </section>
  );
}

export default ServiceBooking;