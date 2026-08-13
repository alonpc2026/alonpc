import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./AppsHub.css";

const TITLES = {
  tv: {
    he: "📺 אפליקציות טלוויזיה חכמה",
    en: "📺 Smart TV Apps",
    ru: "📺 Приложения Smart TV",
    ar: "📺 تطبيقات التلفزيون الذكي",
    am: "📺 የSmart TV መተግበሪያዎች",
  },
  windows: {
    he: "💻 אפליקציות מחשב ל-Windows 10-11",
    en: "💻 Apps for Windows 10-11",
    ru: "💻 Программы для Windows 10-11",
    ar: "💻 تطبيقات Windows 10-11",
    am: "💻 ለWindows 10-11 መተግበሪያዎች",
  },
  mac: {
    he: "🍎 אפליקציות למק",
    en: "🍎 Mac Apps",
    ru: "🍎 Приложения для Mac",
    ar: "🍎 تطبيقات Mac",
    am: "🍎 የMac መተግበሪያዎች",
  },
};

const INFO = {
  he: "הקטגוריה מוכנה. בהמשך ניתן להוסיף כאן אפליקציות.",
  en: "This category is ready. Apps can be added here next.",
  ru: "Категория готова. Сюда можно добавить приложения.",
  ar: "الفئة جاهزة ويمكن إضافة التطبيقات هنا لاحقًا.",
  am: "ይህ ምድብ ዝግጁ ነው። ቀጥሎ መተግበሪያዎችን እዚህ ማከል ይቻላል።",
};

export default function AppCategoryPlaceholder() {
  const { type } = useParams();
  const { language, dir } = useLanguage();
  const title = TITLES[type]?.[language] || TITLES[type]?.he || "Apps";

  return (
    <main className="apps-hub-page" dir={dir}>
      <section className="apps-graffiti-hero">
        <h1>{title}</h1>
        <p>{INFO[language] || INFO.he}</p>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <Link className="apps-category-card apps-card-mobile" to="/apps">
          ← חזרה לאפליקציות
        </Link>
      </div>
    </main>
  );
}
