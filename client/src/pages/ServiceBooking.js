import { useState } from "react";

const API = "https://alonpc02026.onrender.com/api/bookings";
const WHATSAPP_NUMBER = "972545221809";

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
  const [sending, setSending] = useState(false);

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      address: "",
      serviceType: "",
      preferredDate: "",
      preferredTime: "",
      details: "",
    });
  };

  const createWhatsAppMessage = () => {
    return `
📅 הזמנת שירות חדשה - ALONPC

👤 שם: ${form.name}
📞 טלפון: ${form.phone}
📍 כתובת: ${form.address || "לא נמסרה"}
🛠️ סוג שירות: ${form.serviceType}
📅 תאריך רצוי: ${form.preferredDate || "לא נבחר"}
🕒 שעה רצויה: ${form.preferredTime || "לא נבחר"}

📝 פירוט:
${form.details || "לא נמסר פירוט נוסף"}

🌐 אתר:
https://alonpc.netlify.app/
`.trim();
  };

  const sendBooking = async () => {
    setMessage("");

    if (!form.name.trim() || !form.phone.trim() || !form.serviceType) {
      setMessage("נא למלא שם, טלפון וסוג שירות");
      return;
    }

    try {
      setSending(true);

      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("שמירת ההזמנה נכשלה");
      }

      const whatsappText = createWhatsAppMessage();

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          whatsappText
        )}`,
        "_blank",
        "noopener,noreferrer"
      );

      setMessage("✅ ההזמנה נשמרה. WhatsApp נפתח לשליחת ההודעה.");
      resetForm();
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(
        "❌ לא הצלחנו לשמור את ההזמנה. בדוק את החיבור ונסה שוב."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="pageContainer" dir="rtl">
      <section
        className="loginBox"
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          padding: "24px",
        }}
      >
        <h1>📅 הזמנת שירות / תיאום ביקור</h1>

        <p>
          מלא את הפרטים ושלח את הבקשה. לאחר השמירה תיפתח הודעת
          WhatsApp לאישור השליחה.
        </p>

        <label htmlFor="bookingName">שם מלא *</label>
        <input
          id="bookingName"
          type="text"
          placeholder="שם מלא"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          autoComplete="name"
        />

        <label htmlFor="bookingPhone">טלפון *</label>
        <input
          id="bookingPhone"
          type="tel"
          placeholder="טלפון"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          autoComplete="tel"
        />

        <label htmlFor="bookingAddress">כתובת</label>
        <input
          id="bookingAddress"
          type="text"
          placeholder="כתובת"
          value={form.address}
          onChange={(event) => updateField("address", event.target.value)}
          autoComplete="street-address"
        />

        <label htmlFor="bookingService">סוג שירות *</label>
        <select
          id="bookingService"
          value={form.serviceType}
          onChange={(event) =>
            updateField("serviceType", event.target.value)
          }
        >
          <option value="">בחר סוג שירות</option>
          <option value="תיקון מחשב">תיקון מחשב</option>
          <option value="מחשב נייד">מחשב נייד</option>
          <option value="מדפסת">מדפסת</option>
          <option value="רשת ואינטרנט">רשת ואינטרנט</option>
          <option value="סטרימר">סטרימר</option>
          <option value="התקנת תוכנה">התקנת תוכנה</option>
          <option value="שירות בבית הלקוח">שירות בבית הלקוח</option>
          <option value="תמיכה מרחוק">תמיכה מרחוק</option>
          <option value="אחר">אחר</option>
        </select>

        <label htmlFor="bookingDate">תאריך רצוי</label>
        <input
          id="bookingDate"
          type="date"
          value={form.preferredDate}
          onChange={(event) =>
            updateField("preferredDate", event.target.value)
          }
        />

        <label htmlFor="bookingTime">שעה רצויה</label>
        <input
          id="bookingTime"
          type="time"
          value={form.preferredTime}
          onChange={(event) =>
            updateField("preferredTime", event.target.value)
          }
        />

        <label htmlFor="bookingDetails">פירוט התקלה או הבקשה</label>
        <textarea
          id="bookingDetails"
          rows="6"
          placeholder="כתוב כאן את פירוט התקלה או השירות המבוקש"
          value={form.details}
          onChange={(event) =>
            updateField("details", event.target.value)
          }
        />

        <button
          type="button"
          onClick={sendBooking}
          disabled={sending}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "18px",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "שולח..." : "📅 שמור ושלח ב־WhatsApp"}
        </button>

        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{
              marginTop: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

export default ServiceBooking;
