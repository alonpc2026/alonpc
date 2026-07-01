import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="siteHeader">

      {/* שורת עליונה */}
      <div className="topBar">

        <div className="contactInfo">

          <a
            href="tel:0545221809"
            className="phoneBtn"
          >
            📞 054-5221809
          </a>

          <a
            href="https://wa.me/972521234567"
            target="_blank"
            rel="noreferrer"
            className="whatsappBtn"
          >
            🟢 WhatsApp
          </a>

        </div>

      </div>

      {/* תפריט */}
      <nav className="menu">

        <Link className="homeBtn" to="/">
          🏠 בית
        </Link>

        <Link className="servicesBtn" to="/services">
          🛎️ שירותים
        </Link>

        <Link className="dashboardBtn" to="/dashboard">
          📊 לוח
        </Link>

        <Link className="adminBtn" to="/admin">
          ⚙️ ניהול
        </Link>

        <Link className="shopBtn" to="/shop">
          🛒 חנות
        </Link>

        <Link className="loginBtn" to="/login">
          👤 כניסה
        </Link>

        <Link className="aboutBtn" to="/about">
          ℹ️ אודות
        </Link>

        <Link className="contactBtn" to="/contact">
          ✉️ קשר
        </Link>

      </nav>

      {/* לוגו */}
      <div className="brandHero">

        <img
          src="/alonlogo.png"
          alt="ALON PC"
          className="brandLogo"
        />

        <div>

          <h1>ALON PC</h1>

          <p>
            מרכז שירותים לאנשים עם מוגבלויות
          </p>

        </div>

      </div>

    </header>
  );
}

export default Navbar;