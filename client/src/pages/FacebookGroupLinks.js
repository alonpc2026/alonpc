import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./FacebookGroupLinks.css";

const API = "https://alonpc02026.onrender.com/api/facebook-group-links";

const TEXT = {
  he: {
    title: "קישורים מעניינים לקבוצה בפייס",
    subtitle: "קישורים והערות שנוספו למאגר",
    disclaimer: "הקישורים מוצגים כמידע בלבד. רק הגולש מחליט אם הקישור מתאים, כדאי או שימושי עבורו. עצם הופעת הקישור אינה המלצה או אישור.",
    open: "פתיחת הקישור",
    note: "הערה",
    empty: "אין כרגע קישורים במאגר."
  },
  en: {
    title: "Interesting links for the Facebook group",
    subtitle: "Links and notes added to the collection",
    disclaimer: "Links are provided for information only. Each visitor decides whether a link is suitable or useful. Listing a link is not a recommendation or endorsement.",
    open: "Open link", note: "Note", empty: "No links are available yet."
  },
  ru: {
    title: "Интересные ссылки для группы Facebook",
    subtitle: "Ссылки и заметки из базы",
    disclaimer: "Ссылки приведены только для информации. Каждый посетитель сам решает, подходит ли ему ссылка и полезна ли она. Публикация не означает рекомендацию.",
    open: "Открыть ссылку", note: "Заметка", empty: "Пока ссылок нет."
  },
  ar: {
    title: "روابط مفيدة لمجموعة فيسبوك",
    subtitle: "روابط وملاحظات مضافة إلى القائمة",
    disclaimer: "تُعرض الروابط للمعلومات فقط. يقرر كل زائر بنفسه إن كان الرابط مناسبًا أو مفيدًا. عرض الرابط لا يعني التوصية به أو اعتماده.",
    open: "فتح الرابط", note: "ملاحظة", empty: "لا توجد روابط حاليًا."
  },
  am: {
    title: "ለFacebook ቡድን ጠቃሚ አገናኞች",
    subtitle: "ወደ ማውጫው የተጨመሩ አገናኞችና ማስታወሻዎች",
    disclaimer: "አገናኞቹ ለመረጃ ብቻ ይቀርባሉ። አገናኙ ተስማሚ ወይም ጠቃሚ መሆኑን ጎብኚው ራሱ ይወስናል።",
    open: "አገናኝ ክፈት", note: "ማስታወሻ", empty: "አሁን አገናኞች የሉም።"
  },
  fr: {
    title: "Liens intéressants pour le groupe Facebook",
    subtitle: "Liens et notes ajoutés à la liste",
    disclaimer: "Les liens sont fournis à titre informatif. Chaque visiteur décide s’ils lui conviennent ou lui sont utiles. Leur présence ne constitue pas une recommandation.",
    open: "Ouvrir le lien", note: "Remarque", empty: "Aucun lien pour le moment."
  },
  fil: {
    title: "Mga interesanteng link para sa Facebook group",
    subtitle: "Mga link at tala na idinagdag sa listahan",
    disclaimer: "Ang mga link ay para sa impormasyon lamang. Ang bawat bisita ang magpapasya kung ang link ay angkop o kapaki-pakinabang. Ang paglista ay hindi rekomendasyon.",
    open: "Buksan ang link", note: "Tala", empty: "Wala pang link."
  },
  hi: {
    title: "Facebook समूह के लिए रोचक लिंक",
    subtitle: "सूची में जोड़े गए लिंक और टिप्पणियाँ",
    disclaimer: "लिंक केवल जानकारी के लिए दिए गए हैं। हर आगंतुक स्वयं तय करेगा कि लिंक उसके लिए उपयुक्त या उपयोगी है या नहीं। सूची में होना कोई सिफारिश नहीं है।",
    open: "लिंक खोलें", note: "टिप्पणी", empty: "अभी कोई लिंक उपलब्ध नहीं है।"
  }
};

export default function FacebookGroupLinks() {
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
          throw new Error(data.message || "לא ניתן לטעון קישורים");
        }

        if (active) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) setError(err.message || "לא ניתן לטעון קישורים");
      }
    }

    load();
    return () => { active = false; };
  }, []);

  return (
    <main className="facebook-links-page" dir={dir}>
      <header className="facebook-links-hero">
        <span>📘</span>
        <div>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </header>

      <section className="facebook-links-disclaimer">
        ⚠️ {text.disclaimer}
      </section>

      {error && <section className="facebook-links-error">{error}</section>}

      {!error && items.length === 0 && (
        <section className="facebook-links-empty">{text.empty}</section>
      )}

      <section className="facebook-links-grid">
        {items.map((item) => (
          <article className="facebook-link-card" key={item._id}>
            <div className="facebook-link-icon">🔗</div>

            <div className="facebook-link-content">
              <h2>{item.title}</h2>

              {item.note && (
                <div className="facebook-link-note">
                  <strong>{text.note}:</strong> {item.note}
                </div>
              )}

              <a href={item.url} target="_blank" rel="noreferrer">
                📘 {text.open}
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
