import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./GamesHub.css";

const TEXT = {
  he: {
    title: "משחקים",
    subtitle: "בחרו את סוג המשחקים המתאים לכם",
    computer: ["משחקים למחשב", "Windows 10-11 ומחשבים אישיים"],
    android: ["משחקים לאנדרואיד", "טלפונים וטאבלטים Android"],
    apple: ["משחקים לאפל", "iPhone, iPad ו-Apple"],
    tv: ["משחקים לטלוויזיה חכמה", "Smart TV ומסכים חכמים"],
    open: "כניסה",
  },
  en: {
    title: "Games",
    subtitle: "Choose the game category you need",
    computer: ["Computer Games", "Windows 10-11 and PCs"],
    android: ["Android Games", "Android phones and tablets"],
    apple: ["Apple Games", "iPhone, iPad and Apple"],
    tv: ["Smart TV Games", "Smart TV and smart screens"],
    open: "Open",
  },
  ru: {
    title: "Игры",
    subtitle: "Выберите нужную категорию игр",
    computer: ["Игры для компьютера", "Windows 10-11 и ПК"],
    android: ["Игры для Android", "Телефоны и планшеты Android"],
    apple: ["Игры для Apple", "iPhone, iPad и Apple"],
    tv: ["Игры для Smart TV", "Smart TV и умные экраны"],
    open: "Открыть",
  },
  ar: {
    title: "الألعاب",
    subtitle: "اختر فئة الألعاب المناسبة لك",
    computer: ["ألعاب الكمبيوتر", "Windows 10-11 وأجهزة الكمبيوتر"],
    android: ["ألعاب Android", "هواتف وأجهزة Android اللوحية"],
    apple: ["ألعاب Apple", "iPhone وiPad وApple"],
    tv: ["ألعاب التلفزيون الذكي", "Smart TV والشاشات الذكية"],
    open: "دخول",
  },
  am: {
    title: "ጨዋታዎች",
    subtitle: "የሚፈልጉትን የጨዋታ ምድብ ይምረጡ",
    computer: ["የኮምፒውተር ጨዋታዎች", "Windows 10-11 እና PC"],
    android: ["የAndroid ጨዋታዎች", "Android ስልኮችና ታብሌቶች"],
    apple: ["የApple ጨዋታዎች", "iPhone፣ iPad እና Apple"],
    tv: ["የSmart TV ጨዋታዎች", "Smart TV እና ስማርት ስክሪኖች"],
    open: "ግባ",
  },
};

const CATEGORIES = [
  { key: "computer", icon: "🖥️", path: "/games/computer", className: "game-card-computer" },
  { key: "android", icon: "🤖", path: "/games/android", className: "game-card-android" },
  { key: "apple", icon: "🍎", path: "/games/apple", className: "game-card-apple" },
  { key: "tv", icon: "📺", path: "/games/tv", className: "game-card-tv" },
];

export default function GamesHub() {
  const { language, dir } = useLanguage();
  const t = TEXT[language] || TEXT.he;

  return (
    <main className="games-hub-page" dir={dir}>
      <section className="games-graffiti-hero">
        <span className="games-spray" aria-hidden="true">GAME</span>
        <h1>🎮 {t.title}</h1>
        <p>{t.subtitle}</p>
      </section>

      <section className="games-hub-grid">
        {CATEGORIES.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`game-category-card ${item.className}`}
          >
            <span className="game-category-icon" aria-hidden="true">{item.icon}</span>
            <span className="game-category-text">
              <strong>{t[item.key][0]}</strong>
              <small>{t[item.key][1]}</small>
            </span>
            <span className="game-category-open">{t.open} ←</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
