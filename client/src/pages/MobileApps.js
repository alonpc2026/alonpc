import { Link } from "react-router-dom";
import AdminAccessButton from "../components/AdminAccessButton";
import "./MobileApps.css";

export default function MobileApps() {
  return (
    <main className="mobile-apps-page" dir="rtl">
      <AdminAccessButton />

      <section className="mobile-apps-hero">
        <span className="hero-icon">📱</span>
        <div>
          <h1>אפליקציות סלולרי</h1>
          <p>בחרו Android / Galaxy או iPhone / iOS</p>
        </div>
      </section>

      <section className="platform-grid">
        <Link to="/apps/android" className="platform-card android">
          <span className="platform-icon">🤖</span>
          <strong>Android / Galaxy</strong>
          <small>כולל נתוני הסלולרי הישנים של Samsung / Galaxy / Android</small>
          <b>←</b>
        </Link>

        <Link to="/apps/ios" className="platform-card iphone">
          <span className="platform-icon">🍎</span>
          <strong>iPhone / iOS</strong>
          <small>כולל אפליקציות Apple / iPhone שהוזנו בעבר</small>
          <b>←</b>
        </Link>
      </section>

      <Link to="/apps" className="back-link">
        → חזרה לכל האפליקציות
      </Link>
    </main>
  );
}
