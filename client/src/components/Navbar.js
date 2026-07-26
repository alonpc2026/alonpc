import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo.png";

const NAV_ITEMS = [
  { to: "/", icon: "🏠", text: "דף הבית", color: "home" },
  { to: "/services", icon: "♿", text: "שירותים", color: "services" },
  { to: "/israel-events", icon: "📅", text: "לוח אירועים", color: "events" },
  { to: "/dashboard", icon: "📊", text: "לוח בקרה", color: "dashboard" },
  { to: "/admin", icon: "⚙️", text: "ניהול", color: "admin" },
  { to: "/shop", icon: "🛒", text: "החנות של אלון", color: "shop" },
  { to: "/login", icon: "👤", text: "כניסת מנויים", color: "login" },
  { to: "/about", icon: "ℹ️", text: "אודות", color: "about" },
  { to: "/contact", icon: "✉️", text: "צור קשר", color: "contact" },
];

const LANGUAGES = [
  { code: "he", label: "עברית", flag: "🇮🇱" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "am", label: "አማርኛ", flag: "🇪🇹" },
];

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "he"
  );

  useEffect(() => {
    setMenuOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  function closeMenus() {
    setMenuOpen(false);
    setLanguageOpen(false);
  }

  function changeLanguage(code) {
    setLanguage(code);
    localStorage.setItem("language", code);
    window.dispatchEvent(
      new CustomEvent("alonpc-language-change", {
        detail: { language: code },
      })
    );
    setLanguageOpen(false);
  }

  const currentLanguage =
    LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  return (
    <header className="alonpc-navbar" dir="rtl">
      <div className="alonpc-navbar__top">
        <Link
          to="/"
          className="alonpc-brand"
          onClick={closeMenus}
          aria-label="ALONPC - מעבר לדף הבית"
        >
          <img
            src={logo}
            alt="לוגו ALONPC"
            className="alonpc-brand__logo"
          />

          <span className="alonpc-brand__content">
            <strong>ALONPC</strong>
            <small>מרכז שירותים לאנשים עם מוגבלות</small>
          </span>
        </Link>

        <div className="alonpc-contact">
          <a
            className="alonpc-contact__button alonpc-contact__phone"
            href="tel:+972545221809"
          >
            <span aria-hidden="true">📞</span>
            <span>
              <small>טלפון</small>
              <strong>054-522-1809</strong>
            </span>
          </a>

          <a
            className="alonpc-contact__button alonpc-contact__whatsapp"
            href="https://wa.me/972545221809"
            target="_blank"
            rel="noreferrer"
          >
            <span aria-hidden="true">💬</span>
            <span>
              <small>יצירת קשר בכתב</small>
              <strong>WhatsApp</strong>
            </span>
          </a>
        </div>

        <div className="alonpc-navbar__controls">
          <div className="alonpc-language">
            <button
              type="button"
              className="alonpc-language__toggle"
              aria-haspopup="true"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((current) => !current)}
            >
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.label}</span>
              <span aria-hidden="true">▾</span>
            </button>

            {languageOpen && (
              <div className="alonpc-language__menu" role="menu">
                {LANGUAGES.map((item) => (
                  <button
                    type="button"
                    key={item.code}
                    className={
                      item.code === language
                        ? "alonpc-language__option active"
                        : "alonpc-language__option"
                    }
                    onClick={() => changeLanguage(item.code)}
                    role="menuitem"
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="alonpc-menu-toggle"
            aria-label={menuOpen ? "סגירת התפריט" : "פתיחת התפריט"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            <strong>{menuOpen ? "סגור" : "תפריט"}</strong>
          </button>
        </div>
      </div>

      <nav
        className={
          menuOpen
            ? "alonpc-navbar__menu alonpc-navbar__menu--open"
            : "alonpc-navbar__menu"
        }
        aria-label="תפריט ראשי"
      >
        {NAV_ITEMS.map((item) => {
          const active =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname === item.to ||
                location.pathname.startsWith(`${item.to}/`);

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMenus}
              className={`alonpc-nav-item alonpc-nav-item--${item.color}${
                active ? " active" : ""
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className="alonpc-nav-item__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.text}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export default Navbar;
