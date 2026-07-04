import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import translations from "../translations";

function Navbar() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "he");
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navText = {
    he: {
      home: "בית",
      services: "שירותים",
      shop: "חנות",
      about: "אודות",
      contact: "צור קשר",
      adminTitle: "כניסת מנהל",
      username: "שם משתמש",
      password: "סיסמה",
      login: "כניסה",
      cancel: "ביטול",
      wrong: "שם משתמש או סיסמה שגויים",
    },
    en: {
      home: "Home",
      services: "Services",
      shop: "Shop",
      about: "About",
      contact: "Contact",
      adminTitle: "Admin Login",
      username: "Username",
      password: "Password",
      login: "Login",
      cancel: "Cancel",
      wrong: "Wrong username or password",
    },
    ru: {
      home: "Главная",
      services: "Услуги",
      shop: "Магазин",
      about: "О нас",
      contact: "Контакты",
      adminTitle: "Вход администратора",
      username: "Имя пользователя",
      password: "Пароль",
      login: "Войти",
      cancel: "Отмена",
      wrong: "Неверное имя пользователя или пароль",
    },
    ar: {
      home: "الرئيسية",
      services: "الخدمات",
      shop: "المتجر",
      about: "من نحن",
      contact: "اتصل بنا",
      adminTitle: "دخول المدير",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "دخول",
      cancel: "إلغاء",
      wrong: "اسم المستخدم أو كلمة المرور غير صحيحة",
    },
    am: {
      home: "መነሻ",
      services: "አገልግሎቶች",
      shop: "ሱቅ",
      about: "ስለ እኛ",
      contact: "አግኙን",
      adminTitle: "የአስተዳዳሪ መግቢያ",
      username: "የተጠቃሚ ስም",
      password: "የይለፍ ቃል",
      login: "ግባ",
      cancel: "ሰርዝ",
      wrong: "የተጠቃሚ ስም ወይም የይለፍ ቃል ትክክል አይደለም",
    },
  };

  const t = translations[lang] || translations.he;
  const n = navText[lang] || navText.he;

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.body.dir = lang === "he" || lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const loginAdmin = () => {
    if (username === "korkusal" && password === "631892") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Alon Admin",
          email: "korkusal",
          role: "admin",
        })
      );

      window.location.href = "/dashboard";
    } else {
      alert(n.wrong);
    }
  };

  return (
    <header className="siteHeader">
      <div className="brandHero">
        <img src="/alonlogo.png" alt="ALON PC" className="brandLogo" />
        <div>
          <h1>ALON PC</h1>
          <p>{t.subtitle || "מרכז שירותים לאנשים עם מוגבלויות"}</p>
        </div>
      </div>

      <div className="topBar">
        <div className="contactInfo">
          <a href="tel:0545221809" className="phoneBtn">
            📞 054-5221809
          </a>

          <a
            href="https://wa.me/972545221809"
            target="_blank"
            rel="noreferrer"
            className="whatsappBtn"
          >
            🟢 WhatsApp
          </a>

          <select
            className="languageSelect"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="he">🇮🇱 עברית</option>
            <option value="en">🇺🇸 English</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="ar">🇸🇦 العربية</option>
            <option value="am">🇪🇹 አማርኛ</option>
          </select>
        </div>
      </div>

      <nav className="menu">
        <Link className="homeBtn" to="/">🏠 {n.home}</Link>
        <Link className="servicesBtn" to="/services">🛎️ {n.services}</Link>
        <Link className="shopBtn" to="/shop">🛍️ {n.shop}</Link>
        <Link className="aboutBtn" to="/about">ℹ️ {n.about}</Link>
        <Link className="contactBtn" to="/contact">✉️ {n.contact}</Link>

        <button className="adminBtn" onClick={() => setShowLogin(true)}>
          ⚙️
        </button>
      </nav>

      {showLogin && (
        <div className="modalOverlay">
          <div className="adminModal">
            <h2>🔐 {n.adminTitle}</h2>

            <input
              placeholder={n.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder={n.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={loginAdmin}>{n.login}</button>
            <button onClick={() => setShowLogin(false)}>{n.cancel}</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;