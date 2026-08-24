import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./SignLanguageCourses.css";

const API = "https://alonpc02026.onrender.com/api/sign-language-courses";

const TEXT = {
  he: {
    title: "קורס שפת סימנים",
    subtitle: "קורסים ומקומות ללימוד שפת סימנים",
    loading: "אנא המתן לטעינת הקורסים...",
    empty: "אין כרגע קורסים להצגה.",
    place: "שם מקום",
    address: "כתובת",
    city: "עיר",
    phone: "טלפון",
    start: "תחילת קורס",
    call: "חיוג"
  },
  en: {
    title: "Sign Language Courses",
    subtitle: "Courses and places to learn sign language",
    loading: "Please wait while the courses are loading...",
    empty: "There are currently no courses to display.",
    place: "Place",
    address: "Address",
    city: "City",
    phone: "Phone",
    start: "Course start",
    call: "Call"
  },
  ru: {
    title: "Курсы жестового языка",
    subtitle: "Курсы и места для изучения жестового языка",
    loading: "Пожалуйста, подождите, курсы загружаются...",
    empty: "Сейчас нет курсов для отображения.",
    place: "Место",
    address: "Адрес",
    city: "Город",
    phone: "Телефон",
    start: "Начало курса",
    call: "Позвонить"
  },
  ar: {
    title: "دورات لغة الإشارة",
    subtitle: "دورات وأماكن لتعلم لغة الإشارة",
    loading: "يرجى الانتظار أثناء تحميل الدورات...",
    empty: "لا توجد دورات للعرض حاليًا.",
    place: "اسم المكان",
    address: "العنوان",
    city: "المدينة",
    phone: "الهاتف",
    start: "بداية الدورة",
    call: "اتصال"
  },
  am: {
    title: "የምልክት ቋንቋ ኮርሶች",
    subtitle: "የምልክት ቋንቋ ለመማር ኮርሶችና ቦታዎች",
    loading: "እባክዎ ኮርሶቹ እስኪጫኑ ድረስ ይጠብቁ...",
    empty: "አሁን የሚታዩ ኮርሶች የሉም።",
    place: "ቦታ",
    address: "አድራሻ",
    city: "ከተማ",
    phone: "ስልክ",
    start: "የኮርስ መጀመሪያ",
    call: "ይደውሉ"
  },
  fr: {
    title: "Cours de langue des signes",
    subtitle: "Cours et lieux pour apprendre la langue des signes",
    loading: "Veuillez patienter pendant le chargement des cours...",
    empty: "Aucun cours à afficher pour le moment.",
    place: "Lieu",
    address: "Adresse",
    city: "Ville",
    phone: "Téléphone",
    start: "Début du cours",
    call: "Appeler"
  },
  fil: {
    title: "Mga Kurso sa Sign Language",
    subtitle: "Mga kurso at lugar para matuto ng sign language",
    loading: "Mangyaring maghintay habang nilo-load ang mga kurso...",
    empty: "Wala pang kursong maipapakita sa ngayon.",
    place: "Lugar",
    address: "Address",
    city: "Lungsod",
    phone: "Telepono",
    start: "Simula ng kurso",
    call: "Tumawag"
  },
  hi: {
    title: "सांकेतिक भाषा पाठ्यक्रम",
    subtitle: "सांकेतिक भाषा सीखने के पाठ्यक्रम और स्थान",
    loading: "कृपया पाठ्यक्रम लोड होने तक प्रतीक्षा करें...",
    empty: "अभी प्रदर्शित करने के लिए कोई पाठ्यक्रम नहीं है।",
    place: "स्थान",
    address: "पता",
    city: "शहर",
    phone: "फ़ोन",
    start: "पाठ्यक्रम प्रारंभ",
    call: "कॉल"
  }
};

function formatDate(value, locale) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(locale || "he-IL");
}

export default function SignLanguageCourses() {
  const { language, dir, locale } = useLanguage();
  const text = TEXT[language] || TEXT.he;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (active) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) =>
      String(a.startDate || "").localeCompare(String(b.startDate || ""))
    );
  }, [items]);

  return (
    <main className="sign-courses-page" dir={dir}>
      <header className="sign-courses-hero">
        <span>🤟</span>
        <div>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </header>

      {loading && (
        <section className="sign-courses-message">⏳ {text.loading}</section>
      )}

      {!loading && sorted.length === 0 && (
        <section className="sign-courses-message">{text.empty}</section>
      )}

      {!loading && sorted.length > 0 && (
        <section className="sign-courses-grid">
          {sorted.map((item) => (
            <article className="sign-course-card" key={item._id}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.placeName || text.title} />
              )}

              <h2>{item.placeName}</h2>

              <div className="sign-course-details">
                {item.address && <p>📍 <strong>{text.address}:</strong> {item.address}</p>}
                {item.city && <p>🏙️ <strong>{text.city}:</strong> {item.city}</p>}
                {item.startDate && (
                  <p>📅 <strong>{text.start}:</strong> {formatDate(item.startDate, locale)}</p>
                )}
                {item.phone && (
                  <p>
                    📞 <strong>{text.phone}:</strong> {item.phone}
                  </p>
                )}
              </div>

              {item.phone && (
                <a
                  className="sign-course-call"
                  href={`tel:${String(item.phone).replace(/[^\d+]/g, "")}`}
                >
                  📞 {text.call}
                </a>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
