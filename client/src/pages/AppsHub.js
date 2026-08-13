import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./AppsHub.css";

const TEXT = {
  he: {
    title: "אפליקציות",
    subtitle: "בחרו את סוג האפליקציות המתאים לכם",
    mobile: ["אפליקציות סלולרי", "iPhone, Galaxy ו-Android"],
    tv: ["אפליקציות טלוויזיה חכמה", "Smart TV ושירותי צפייה"],
    windows: ["אפליקציות מחשב", "למחשבים עם Windows 10 ו-Windows 11"],
    mac: ["אפליקציות למק", "אפליקציות למחשבי Apple Mac"],
    open: "כניסה",
  },
  en: {
    title: "Apps",
    subtitle: "Choose the type of apps you need",
    mobile: ["Mobile Apps", "iPhone, Galaxy and Android"],
    tv: ["Smart TV Apps", "Smart TV and viewing services"],
    windows: ["Computer Apps", "For Windows 10 and Windows 11"],
    mac: ["Mac Apps", "Apps for Apple Mac computers"],
    open: "Open",
  },
  ru: {
    title: "Приложения",
    subtitle: "Выберите нужный тип приложений",
    mobile: ["Мобильные приложения", "iPhone, Galaxy и Android"],
    tv: ["Приложения Smart TV", "Smart TV и сервисы просмотра"],
    windows: ["Программы для компьютера", "Для Windows 10 и Windows 11"],
    mac: ["Приложения для Mac", "Для компьютеров Apple Mac"],
    open: "Открыть",
  },
  ar: {
    title: "التطبيقات",
    subtitle: "اختر نوع التطبيقات المناسب لك",
    mobile: ["تطبيقات الهاتف", "iPhone وGalaxy وAndroid"],
    tv: ["تطبيقات التلفزيون الذكي", "Smart TV وخدمات المشاهدة"],
    windows: ["تطبيقات الكمبيوتر", "لـ Windows 10 وWindows 11"],
    mac: ["تطبيقات Mac", "لأجهزة Apple Mac"],
    open: "دخول",
  },
  am: {
    title: "መተግበሪያዎች",
    subtitle: "የሚፈልጉትን የመተግበሪያ አይነት ይምረጡ",
    mobile: ["የሞባይል መተግበሪያዎች", "iPhone፣ Galaxy እና Android"],
    tv: ["የSmart TV መተግበሪያዎች", "Smart TV እና የመመልከቻ አገልግሎቶች"],
    windows: ["የኮምፒውተር መተግበሪያዎች", "ለWindows 10 እና Windows 11"],
    mac: ["የMac መተግበሪያዎች", "ለApple Mac ኮምፒውተሮች"],
    open: "ግባ",
  },
};

const CATEGORIES = [
  { key: "tv", icon: "📺", path: "/apps/tv", className: "apps-card-tv" },
  { key: "mobile", icon: "📱", path: "/apps/mobile", className: "apps-card-mobile" },
  { key: "windows", icon: "💻", path: "/apps/windows", className: "apps-card-windows" },
  { key: "mac", icon: "🍎", path: "/apps/mac", className: "apps-card-mac" },
];

export default function AppsHub() {
  const { language, dir } = useLanguage();
  const t = TEXT[language] || TEXT.he;

  return (
    <main className="apps-hub-page" dir={dir}>
      <section className="apps-graffiti-hero">
        <span className="apps-spray" aria-hidden="true">APP</span>
        <h1>🎨 {t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="apps-hub-grid">
        {CATEGORIES.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`apps-category-card ${item.className}`}
          >
            <span className="apps-category-icon" aria-hidden="true">
              {item.icon}
            </span>

            <span className="apps-category-text">
              <strong>{t[item.key][0]}</strong>
              <small>{t[item.key][1]}</small>
            </span>

            <span className="apps-category-open">{t.open} ←</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
