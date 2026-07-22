import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="alon-footer" dir="rtl">
      <div className="alon-footer-container">
        <div>
          <h3>ALONPC</h3>
          <p>מרכז שירותים לאנשים עם מוגבלות</p>
        </div>

        <div className="alon-footer-links">
          <a href="tel:+972545221809">📞 054-5221809</a>
          <a href="https://wa.me/972545221809" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="mailto:alonpc@example.com">אימייל</a>
        </div>

        <div className="alon-footer-copy">
          © 2026 ALONPC - כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
}

export default Footer;
