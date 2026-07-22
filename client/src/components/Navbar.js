import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-logo">A</span>
          <span className="brand-text">ALONPC</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="פתיחת תפריט"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <nav className={`navbar-menu ${menuOpen ? "open" : ""}`} aria-label="תפריט ראשי">
          <Link to="/" className="nav-button home-button" onClick={closeMenu}>דף הבית</Link>
          <Link to="/services" className="nav-button services-button" onClick={closeMenu}>שירותים</Link>
          <Link to="/dashboard" className="nav-button dashboard-button" onClick={closeMenu}>לוח בקרה</Link>
          <Link to="/admin" className="nav-button admin-button" onClick={closeMenu}>ניהול</Link>
          <Link to="/shop" className="nav-button shop-button" onClick={closeMenu}>החנות של אלון</Link>
          <Link to="/login" className="nav-button login-button" onClick={closeMenu}>כניסת מנויים</Link>
          <Link to="/about" className="nav-button about-button" onClick={closeMenu}>אודות</Link>
          <Link to="/contact" className="nav-button contact-button" onClick={closeMenu}>צור קשר</Link>
        </nav>

        <div className="navbar-contact">
          <a className="contact-link phone-link" href="tel:+972545221809">📞 054-522-1809</a>
          <a
            className="contact-link whatsapp-link"
            href="https://wa.me/972545221809"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
