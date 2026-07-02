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

  const sendBooking = () => {
    if (!form.name || !form.phone || !form.serviceType) {
      setMessage("נא למלא שם, טלפון וסוג שירות ❌");
      return;
    }

    const text = `
הזמנת שירות חדשה מ־ALON PC
שם: ${form.name}
טלפון: ${form.phone}
כתובת: ${form.address}
סוג שירות: ${form.serviceType}
תאריך רצוי: ${form.preferredDate}
שעה רצויה: ${form.preferredTime}
פירוט: ${form.details}
`;

    const whatsappUrl =
      "https://wa.me/972521234567?text=" + encodeURIComponent(text);

    window.open(whatsappUrl, "_blank");
    setMessage("הבקשה נפתחה לשליחה ב־WhatsApp ✅");
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
        placeholder="כתובת לביקור"
        value={form.address}
        onChange={(e) => updateField("address", e.target.value)}
      />

      <select
        value={form.serviceType}
        onChange={(e) => updateField("serviceType", e.target.value)}
      >
        <option value="">בחר סוג שירות</option>
        <option value="תיקון מחשב">תיקון מחשב</option>
        <option value="התקנת תוכנה">התקנת תוכנה</option>
        <option value="מדפסת">מדפסת</option>
        <option value="אינטרנט ורשת">אינטרנט ורשת</option>
        <option value="סטרימר / טלוויזיה">סטרימר / טלוויזיה</option>
        <option value="תמיכה מרחוק">תמיכה מרחוק</option>
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
        placeholder="פירוט התקלה / מה צריך לעשות"
        value={form.details}
        onChange={(e) => updateField("details", e.target.value)}
      />

      <button onClick={sendBooking}>🟢 שלח הזמנה ב־WhatsApp</button>

      <p>{message}</p>
    </section>
  );
}

export default ServiceBooking;