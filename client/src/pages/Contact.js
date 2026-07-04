import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "בקשת הצטרפות",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const sendToWhatsApp = () => {
    const text = `
פנייה חדשה מאתר ALON PC

שם: ${form.name}
טלפון: ${form.phone}
סוג פנייה: ${form.type}

הודעה:
${form.message}
`;

    window.open(
      `https://wa.me/972545221809?text=${encodeURIComponent(text)}`,
      "_blank"
    );

    setSent(true);
  };

  return (
    <section className="loginBox">
      <h2>✉️ צור קשר</h2>

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

      <select
        value={form.type}
        onChange={(e) => updateField("type", e.target.value)}
      >
        <option>בקשת הצטרפות</option>
        <option>הצעת קישור</option>
        <option>הצעת מסמך</option>
        <option>שאלה כללית</option>
        <option>שיתוף פעולה</option>
      </select>

      <textarea
        rows="6"
        placeholder="כתוב כאן הודעה / קישור / פרטי מסמך"
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
      />

      <button onClick={sendToWhatsApp}>🟢 שלח פנייה ב־WhatsApp</button>

      {sent && <p>✅ תודה, הפנייה נפתחה לשליחה ב־WhatsApp.</p>}
    </section>
  );
}

export default Contact;