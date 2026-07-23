import React, {
  useEffect,
  useState,
} from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

import "./Navbar.css";

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
  const { t, dir } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(readUser());

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(readUser());
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const refreshUser = () => {
      setUser(readUser());
    };

    window.addEventListener("storage", refreshUser);
    window.addEventListener(
      "alonpc-auth-change",
      refreshUser
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshUser
      );
      window.removeEventListener(
        "alonpc-auth-change",
        refreshUser
      );
    };
  }, []);

  const isAdmin = user?.role === "admin";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMenuOpen(false);

    window.dispatchEvent(
      new Event("alonpc-auth-change")
    );

    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `nav-button ${isActive ? "active" : ""}`;

  return (
    <header
      className="site-navbar"
      dir={dir}
    >
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
        >
          <span
            className="brand-logo"
            aria-hidden="true"
          >
            A
          </span>

          <span className="brand-text">
            ALONPC
          </span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen((current) => !current)
          }
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`navbar-menu ${
            menuOpen ? "open" : ""
          }`}
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            end
            className={navClass}
            onClick={closeMenu}
          >
            🏠 {t("home")}
          </NavLink>

          <NavLink
            to="/services"
            className={navClass}
            onClick={closeMenu}
          >
            🛎️ {t("services")}
          </NavLink>

          <NavLink
            to="/shop"
            className={navClass}
            onClick={closeMenu}
          >
            🛍️ {t("shop")}
          </NavLink>

          <NavLink
            to="/cart"
            className={navClass}
            onClick={closeMenu}
          >
            🛒 {t("cart")} ({itemCount})
          </NavLink>

          <NavLink
            to="/about"
            className={navClass}
            onClick={closeMenu}
          >
            ℹ️ {t("about")}
          </NavLink>

          <NavLink
            to="/contact"
            className={navClass}
            onClick={closeMenu}
          >
            ✉️ {t("contact")}
          </NavLink>

          {isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-button admin-gear-button ${
                  isActive ? "active" : ""
                }`
              }
              onClick={closeMenu}
            >
              ⚙️ {t("admin")}
            </NavLink>
          ) : !user ? (
            <NavLink
              to="/login"
              className={navClass}
              onClick={closeMenu}
            >
              🔐 {t("login")}
            </NavLink>
          ) : null}

          {user && (
            <button
              type="button"
              className="nav-button logout-button"
              onClick={logout}
            >
              🚪 {t("logout")}
            </button>
          )}
        </nav>

        <div className="navbar-actions">
          <LanguageSwitcher />

          <a
            className="contact-link phone-link"
            href="tel:+972545221809"
          >
            📞 054-5221809
          </a>

          <a
            className="contact-link whatsapp-link"
            href="https://wa.me/972545221809"
            target="_blank"
            rel="noreferrer"
          >
            💬 {t("whatsapp")}
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
