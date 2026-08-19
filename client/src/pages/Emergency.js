import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./Emergency.css";

const API = "https://alonpc02026.onrender.com/api/emergency-contacts";

const EMERGENCY_TRANSLATIONS = {
  he: {
    title: "חירום", subtitle: "מספרי חירום בישראל",
    warning: "במקרה חירום אמיתי פנו מיד לשירות החירום המתאים.",
    police: "משטרה", fire: "כבאות והצלה", mada: "מגן דוד אדום", call: "חיוג",
    accessiblePhone: "טלפון נגיש למוגבלי שמיעה",
    policeNote: "משטרת ישראל", fireNote: "כבאות והצלה לישראל", madaNote: "שירותי רפואת חירום"
  },
  en: {
    title: "Emergency", subtitle: "Emergency numbers in Israel",
    warning: "In a real emergency, contact the appropriate emergency service immediately.",
    police: "Police", fire: "Fire and Rescue", mada: "Magen David Adom", call: "Call",
    accessiblePhone: "Accessible phone for people with hearing disabilities",
    policeNote: "Israel Police", fireNote: "Israel Fire and Rescue Services", madaNote: "Emergency medical services"
  },
  ru: {
    title: "Экстренная помощь", subtitle: "Экстренные номера в Израиле",
    warning: "В экстренной ситуации немедленно обратитесь в соответствующую службу.",
    police: "Полиция", fire: "Пожарно-спасательная служба", mada: "Маген Давид Адом", call: "Позвонить",
    accessiblePhone: "Доступный номер для людей с нарушением слуха",
    policeNote: "Полиция Израиля", fireNote: "Пожарно-спасательная служба Израиля", madaNote: "Экстренная медицинская помощь"
  },
  ar: {
    title: "الطوارئ", subtitle: "أرقام الطوارئ في إسرائيل",
    warning: "في حالة طوارئ حقيقية، اتصل فورًا بخدمة الطوارئ المناسبة.",
    police: "الشرطة", fire: "الإطفاء والإنقاذ", mada: "نجمة داود الحمراء", call: "اتصال",
    accessiblePhone: "هاتف متاح للأشخاص ذوي الإعاقة السمعية",
    policeNote: "شرطة إسرائيل", fireNote: "خدمات الإطفاء والإنقاذ في إسرائيل", madaNote: "خدمات الطوارئ الطبية"
  },
  am: {
    title: "ድንገተኛ አደጋ", subtitle: "በእስራኤል የድንገተኛ አደጋ ቁጥሮች",
    warning: "በእውነተኛ ድንገተኛ አደጋ ጊዜ ተገቢውን የአደጋ ጊዜ አገልግሎት ወዲያውኑ ያነጋግሩ።",
    police: "ፖሊስ", fire: "እሳትና ማዳን", mada: "ማጌን ዳቪድ አዶም", call: "ይደውሉ",
    accessiblePhone: "ለመስማት እክል ላላቸው ሰዎች ተደራሽ ስልክ",
    policeNote: "የእስራኤል ፖሊስ", fireNote: "የእስራኤል እሳትና ማዳን", madaNote: "የድንገተኛ ሕክምና አገልግሎት"
  }
};

const SERVICES = [
  { key: "police", note: "policeNote", icon: "👮", number: "100", className: "police" },
  { key: "fire", note: "fireNote", icon: "🚒", number: "102", className: "fire" },
  { key: "mada", note: "madaNote", icon: "🚑", number: "101", className: "mada" }
];

export default function Emergency() {
  const { language, dir } = useLanguage();
  const text = EMERGENCY_TRANSLATIONS[language] || EMERGENCY_TRANSLATIONS.he;
  const [accessiblePhones, setAccessiblePhones] = useState({});

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(API);
        const data = await response.json().catch(() => []);
        if (!response.ok || !active) return;

        const map = {};
        for (const item of Array.isArray(data) ? data : []) {
          map[item.key] = item.accessiblePhone || "";
        }
        setAccessiblePhones(map);
      } catch {}
    }

    load();
    return () => { active = false; };
  }, []);

  return (
    <main className="emergency-page" dir={dir}>
      <header className="emergency-hero">
        <span className="emergency-hero-icon">🚨</span>
        <div><h1>{text.title}</h1><p>{text.subtitle}</p></div>
      </header>

      <div className="emergency-warning">{text.warning}</div>

      <section className="emergency-grid">
        {SERVICES.map((service) => {
          const accessiblePhone = accessiblePhones[service.key] || "";

          return (
            <article className={`emergency-card emergency-card--${service.className}`} key={service.key}>
              <span className="emergency-card-icon">{service.icon}</span>
              <h2>{text[service.key]}</h2>
              <p>{text[service.note]}</p>
              <strong className="emergency-number">{service.number}</strong>

              <a href={`tel:${service.number}`}>📞 {text.call} {service.number}</a>

              {accessiblePhone && (
                <div className="accessible-public-phone">
                  <span>♿📱 {text.accessiblePhone}</span>
                  <strong>{accessiblePhone}</strong>
                  <a href={`tel:${accessiblePhone.replace(/[^\d+]/g, "")}`}>
                    📞 {text.call} {accessiblePhone}
                  </a>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
