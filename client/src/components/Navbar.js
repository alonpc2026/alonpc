import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

import "./Navbar.css";
import "../AdminGlobal.css";

const NAV_TEXT = {
  he: { brand: "מרכז שירותים לאנשים עם מוגבלות", phone: "טלפון", menu: "תפריט", services: "עסקים נותני שירות", government: "משרדי ממשלה", open: "פתיחת תפריט", close: "סגירת תפריט", navigation: "ניווט ראשי" },
  en: { brand: "Accessible services for people with disabilities", phone: "Phone", menu: "Menu", services: "Service providers", government: "Government offices", open: "Open menu", close: "Close menu", navigation: "Main navigation" },
  ru: { brand: "Доступные услуги для людей с инвалидностью", phone: "Телефон", menu: "Меню", services: "Поставщики услуг", government: "Госучреждения", open: "Открыть меню", close: "Закрыть меню", navigation: "Основная навигация" },
  ar: { brand: "خدمات ميسرة للأشخاص ذوي الإعاقة", phone: "هاتف", menu: "القائمة", services: "مقدمو الخدمات", government: "المكاتب الحكومية", open: "فتح القائمة", close: "إغلاق القائمة", navigation: "التنقل الرئيسي" },
  am: { brand: "ለአካል ጉዳተኞች ተደራሽ አገልግሎቶች", phone: "ስልክ", menu: "ምናሌ", services: "አገልግሎት ሰጪዎች", government: "የመንግስት ቢሮዎች", open: "ምናሌ ክፈት", close: "ምናሌ ዝጋ", navigation: "ዋና አሰሳ" },
  fr: { brand: "Services accessibles aux personnes handicapées", phone: "Téléphone", menu: "Menu", services: "Prestataires de services", government: "Services gouvernementaux", open: "Ouvrir le menu", close: "Fermer le menu", navigation: "Navigation principale" },
  fil: { brand: "Mga serbisyong naa-access para sa may kapansanan", phone: "Telepono", menu: "Menu", services: "Mga tagapagbigay ng serbisyo", government: "Mga tanggapan ng gobyerno", open: "Buksan ang menu", close: "Isara ang menu", navigation: "Pangunahing nabigasyon" },
  hi: { brand: "दिव्यांग व्यक्तियों के लिए सुलभ सेवाएँ", phone: "फ़ोन", menu: "मेनू", services: "सेवा प्रदाता", government: "सरकारी कार्यालय", open: "मेनू खोलें", close: "मेनू बंद करें", navigation: "मुख्य नेविगेशन" }
};

function readUser() {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function Navbar() {
  const { itemCount } = useCart();
  const { t, dir, language } = useLanguage();
  const ui = NAV_TEXT[language] || NAV_TEXT.he;

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(readUser());

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(readUser());
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const refreshUser = () => setUser(readUser());

    window.addEventListener("storage", refreshUser);
    window.addEventListener("alonpc-auth-change", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("alonpc-auth-change", refreshUser);
    };
  }, []);

  const isAdmin = user?.role === "admin";

  const closeMenu = () => setMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("alonpc-auth-change"));
    navigate("/");
  };

  const navClass = (type) => ({ isActive }) =>
    `alonpc-nav-item alonpc-nav-item--${type} ${isActive ? "active" : ""}`;

  return (
    <header className="alonpc-navbar" dir={dir}>
      <div className="alonpc-navbar__top">
        <Link to="/" className="alonpc-brand" onClick={closeMenu}>
          <img
            className="alonpc-brand__logo"
            src="/alon-profile.png"
            alt="ALONPC"
          />

          <span className="alonpc-brand__content">
            <strong>ALONPC</strong>
            <small>{ui.brand}</small>
          </span>
        </Link>

        <div className="alonpc-contact">
          <a className="alonpc-contact__button alonpc-contact__phone" href="tel:+972545221809">
            <span aria-hidden="true">📞</span>
            <span>
              <small>{ui.phone}</small>
              054-5221809
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
              <small>WhatsApp</small>
              {t("whatsapp")}
            </span>
          </a>
        </div>

        <div className="alonpc-navbar__controls">
          <div className="alonpc-language">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className="alonpc-menu-toggle"
            aria-label={menuOpen ? ui.close : ui.open}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span>
            <strong>{ui.menu}</strong>
          </button>
        </div>
      </div>

      <nav
        className={`alonpc-navbar__menu ${menuOpen ? "alonpc-navbar__menu--open" : ""}`}
        aria-label={ui.navigation}
      >
        <NavLink to="/" end className={navClass("home")} onClick={closeMenu}>
          <span className="alonpc-nav-item__icon" aria-hidden="true">🏠</span>
          <span>{t("home")}</span>
        </NavLink>

        <NavLink to="/services" className={navClass("services")} onClick={closeMenu}>
          <span className="alonpc-nav-item__icon" aria-hidden="true">🏢</span>
          <span>{ui.services}</span>
        </NavLink>

        <NavLink to="/government" className={navClass("government")} onClick={closeMenu}>
          <span className="alonpc-nav-item__icon" aria-hidden="true">🏛️</span>
          <span>{ui.government}</span>
        </NavLink>

        <NavLink to="/shop" className={navClass("shop")} onClick={closeMenu}>
          <span className="alonpc-nav-item__icon" aria-hidden="true">🛍️</span>
          <span>{t("shop")}</span>
        </NavLink>

        <NavLink to="/cart" className={navClass("cart")} onClick={closeMenu}>
          <span className="alonpc-nav-item__icon" aria-hidden="true">🛒</span>
          <span>{t("cart")} ({itemCount})</span>
        </NavLink>

        <NavLink to="/about" className={navClass("about")} onClick={closeMenu}>
          <span className="alonpc-nav-item__icon" aria-hidden="true">ℹ️</span>
          <span>{t("about")}</span>
        </NavLink>

        <NavLink to="/contact" className={navClass("contact")} onClick={closeMenu}>
          <span className="alonpc-nav-item__icon" aria-hidden="true">✉️</span>
          <span>{t("contact")}</span>
        </NavLink>

        {isAdmin ? (
          <NavLink to="/admin" className={navClass("admin")} onClick={closeMenu}>
            <span className="alonpc-nav-item__icon" aria-hidden="true">⚙️</span>
            <span>{t("admin")}</span>
          </NavLink>
        ) : !user ? (
          <NavLink to="/login" className={navClass("login")} onClick={closeMenu}>
            <span className="alonpc-nav-item__icon" aria-hidden="true">🔐</span>
            <span>{t("login")}</span>
          </NavLink>
        ) : null}

        {user && (
          <button
            type="button"
            className="alonpc-nav-item alonpc-nav-item--logout"
            onClick={logout}
          >
            <span className="alonpc-nav-item__icon" aria-hidden="true">🚪</span>
            <span>{t("logout")}</span>
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
