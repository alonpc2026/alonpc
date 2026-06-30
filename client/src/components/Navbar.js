import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">🏠 דף הבית</Link>

      <Link to="/services">♿ שירותים</Link>

      <Link to="/dashboard">📊 לוח בקרה</Link>

      <Link to="/admin">⚙️ ניהול</Link>

      <Link to="/login">👤 כניסת מנויים</Link>

      <Link to="/about">ℹ️ אודות</Link>

      <Link to="/contact">📞 צור קשר</Link>
    </nav>
  );
}

export default Navbar;