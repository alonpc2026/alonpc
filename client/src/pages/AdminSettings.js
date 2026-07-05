import { useEffect, useState } from "react";

function AdminSettings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [settings, setSettings] = useState({
    siteName: "ALON PC",
    slogan: "מרכז שירותים לאנשים עם מוגבלויות",
    phone: "0545221809",
    whatsapp: "972545221809",
    email: "",
    website: "",
    address: "",
    logo: "/alonlogo.png",
    language: "he",
    footer: "© ALON PC",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("siteSettings"));
    if (saved) {
      setSettings(saved);
    }
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל את הגדרות האתר.</p>
      </section>
    );
  }

  const saveSettings = () => {
    localStorage.setItem(
      "siteSettings",
      JSON.stringify(settings)
    );

    setMessage("✅ ההגדרות נשמרו בהצלחה");
  };

  return (
    <section className="loginBox">
      <h2>⚙️ הגדרות האתר</h2>

      <input
        placeholder="שם האתר"
        value={settings.siteName}
        onChange={(e) =>
          setSettings({
            ...settings,
            siteName: e.target.value,
          })
        }
      />

      <input
        placeholder="סלוגן"
        value={settings.slogan}
        onChange={(e) =>
          setSettings({
            ...settings,
            slogan: e.target.value,
          })
        }
      />

      <input
        placeholder="טלפון"
        value={settings.phone}
        onChange={(e) =>
          setSettings({
            ...settings,
            phone: e.target.value,
          })
        }
      />

      <input
        placeholder="WhatsApp"
        value={settings.whatsapp}
        onChange={(e) =>
          setSettings({
            ...settings,
            whatsapp: e.target.value,
          })
        }
      />

      <input
        placeholder="אימייל"
        value={settings.email}
        onChange={(e) =>
          setSettings({
            ...settings,
            email: e.target.value,
          })
        }
      />

      <input
        placeholder="כתובת האתר"
        value={settings.website}
        onChange={(e) =>
          setSettings({
            ...settings,
            website: e.target.value,
          })
        }
      />

      <input
        placeholder="כתובת העסק"
        value={settings.address}
        onChange={(e) =>
          setSettings({
            ...settings,
            address: e.target.value,
          })
        }
      />

      <input
        placeholder="לוגו"
        value={settings.logo}
        onChange={(e) =>
          setSettings({
            ...settings,
            logo: e.target.value,
          })
        }
      />

      <select
        value={settings.language}
        onChange={(e) =>
          setSettings({
            ...settings,
            language: e.target.value,
          })
        }
      >
        <option value="he">עברית</option>
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="ar">العربية</option>
        <option value="am">አማርኛ</option>
      </select>

      <textarea
        placeholder="טקסט תחתון"
        value={settings.footer}
        onChange={(e) =>
          setSettings({
            ...settings,
            footer: e.target.value,
          })
        }
      />

      <button onClick={saveSettings}>
        💾 שמור הגדרות
      </button>

      <p>{message}</p>
    </section>
  );
}

export default AdminSettings;