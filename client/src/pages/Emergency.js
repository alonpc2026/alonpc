import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Emergency.css";

const API = "https://alonpc02026.onrender.com/api/emergency-contacts";

const TEXT = {
  he: { title:"חירום", subtitle:"שירותי חירום חשובים", accessible:"טלפון נגיש למוגבלי שמיעה", call:"חיוג", address:"כתובת" },
  en: { title:"Emergency", subtitle:"Important emergency services", accessible:"Accessible phone for people with hearing disabilities", call:"Call", address:"Address" },
  ru: { title:"Экстренная помощь", subtitle:"Важные экстренные службы", accessible:"Доступный номер для людей с нарушением слуха", call:"Позвонить", address:"Адрес" },
  ar: { title:"الطوارئ", subtitle:"خدمات طوارئ مهمة", accessible:"هاتف متاح للأشخاص ذوي الإعاقة السمعية", call:"اتصال", address:"العنوان" },
  am: { title:"ድንገተኛ አደጋ", subtitle:"አስፈላጊ የድንገተኛ አደጋ አገልግሎቶች", accessible:"ለመስማት እክል ላላቸው ሰዎች ተደራሽ ስልክ", call:"ይደውሉ", address:"አድራሻ" }
};

export default function Emergency() {
  const { language, dir } = useLanguage();
  const text = TEXT[language] || TEXT.he;
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(API);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "לא ניתן לטעון שירותי חירום");
        }

        if (active) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (active) setError(err.message || "לא ניתן לטעון שירותי חירום");
      }
    }

    load();
    return () => { active = false; };
  }, []);

  return (
    <main className="emergency-page" dir={dir}>
      <header className="emergency-hero">
        <span className="emergency-hero-icon">🚨</span>
        <div>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </header>

      {error && <div className="emergency-warning">{error}</div>}

      <section className="emergency-grid">
        {items.map((item) => (
          <article
            className={`emergency-card ${item.isCore ? "emergency-card--core" : "emergency-card--custom"}`}
            key={item._id}
          >
            <div className="emergency-public-image">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} />
              ) : (
                <span>🚨</span>
              )}
            </div>

            <h2>{item.name}</h2>

            {item.description && <p>{item.description}</p>}

            <strong className="emergency-number">{item.phone}</strong>

            <a href={`tel:${String(item.phone).replace(/[^\d+]/g, "")}`}>
              📞 {text.call} {item.phone}
            </a>

            {item.address && (
              <div className="emergency-extra-line">
                📍 <strong>{text.address}:</strong> {item.address}
              </div>
            )}

            {item.accessiblePhone && (
              <div className="accessible-public-phone">
                <span>♿📱 {text.accessible}</span>
                <strong>{item.accessiblePhone}</strong>
                <a href={`tel:${String(item.accessiblePhone).replace(/[^\d+]/g, "")}`}>
                  📞 {text.call} {item.accessiblePhone}
                </a>
              </div>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
