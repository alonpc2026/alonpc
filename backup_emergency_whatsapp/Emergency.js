import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Emergency.css";

const API = "https://alonpc02026.onrender.com/api/emergency-contacts";

const TEXT = {
  he: { title:"חירום", subtitle:"שירותי חירום חשובים", accessible:"טלפון נגיש למוגבלי שמיעה", call:"חיוג", address:"כתובת", request:"פנייה בחירום", whatsapp:"WhatsApp ישיר למוקד", special:"פנייה מיוחדת למוקד", hours:"שעות פנייה בחירום" },
  en: { title:"Emergency", subtitle:"Important emergency services", accessible:"Accessible phone for people with hearing disabilities", call:"Call", address:"Address", request:"Emergency request", whatsapp:"Direct WhatsApp to the center", special:"Special contact request", hours:"Emergency contact hours" },
  ru: { title:"Экстренная помощь", subtitle:"Важные экстренные службы", accessible:"Доступный номер для людей с нарушением слуха", call:"Позвонить", address:"Адрес", request:"Экстренное обращение", whatsapp:"WhatsApp прямо в центр", hours:"Часы экстренного обращения" },
  ar: { title:"الطوارئ", subtitle:"خدمات طوارئ مهمة", accessible:"هاتف متاح للأشخاص ذوي الإعاقة السمعية", call:"اتصال", address:"العنوان", request:"طلب طوارئ", whatsapp:"WhatsApp مباشر إلى المركز", hours:"ساعات طلب الطوارئ" },
  am: { title:"ድንገተኛ አደጋ", subtitle:"አስፈላጊ የድንገተኛ አደጋ አገልግሎቶች", accessible:"ለመስማት እክል ላላቸው ሰዎች ተደራሽ ስልክ", call:"ይደውሉ", address:"አድራሻ", request:"የድንገተኛ ጊዜ ጥያቄ", whatsapp:"ቀጥታ WhatsApp ወደ ማዕከሉ", hours:"የድንገተኛ ጊዜ መገናኛ ሰዓት" }
};


function normalizeWhatsAppPhone(value = "") {
  let digits = String(value).replace(/\D/g, "");
  if (!digits) return "";

  // Israeli local mobile/phone numbers: 05..., 04..., etc.
  if (digits.startsWith("0")) {
    digits = `972${digits.slice(1)}`;
  }

  return digits;
}

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

            {item.phone && (
              <>
                <strong className="emergency-number">{item.phone}</strong>
                <a href={`tel:${String(item.phone).replace(/[^\d+]/g, "")}`}>
                  📞 {text.call} {item.phone}
                </a>
              </>
            )}

            {item.emergencyHours && (
              <div className="emergency-hours">
                🕐 {text.hours || "שעות פנייה בחירום"}: {item.emergencyHours}
              </div>
            )}

            {!item.isCore && item.whatsappPhone && (
              <a
                className="emergency-whatsapp-link"
                href={`https://wa.me/${normalizeWhatsAppPhone(item.whatsappPhone)}`}
                target="_blank"
                rel="noreferrer"
              >
                💬 {text.whatsapp || "WhatsApp ישיר למוקד"}
              </a>
            )}

            {item.emergencyRequestUrl && (
              <a
                className="emergency-request-link"
                href={item.emergencyRequestUrl}
                target="_blank"
                rel="noreferrer"
              >
                🔗 {text.request}
              </a>
            )}

            {item.specialContactUrl && (
              <a
                className="emergency-special-link"
                href={item.specialContactUrl}
                target="_blank"
                rel="noreferrer"
              >
                ♿ 🔗 {text.special || "פנייה מיוחדת למוקד"}
              </a>
            )}

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
