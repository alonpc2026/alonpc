import { Link } from "react-router-dom";
import "./MobileApps.css";

export default function MobileApps() {
  return (
    <main className="mobile-apps-page" dir="rtl">
      <section className="mobile-apps-hero">
        <span className="hero-icon">📱</span>
        <div><h1>אפליקציות סלולרי</h1><p>בחרו Android או iPhone</p></div>
      </section>

      <section className="platform-grid">
        <Link to="/apps/android" className="platform-card android">
          <span className="platform-icon">🤖</span>
          <strong>Android / Galaxy</strong>
          <small>אפליקציות למכשירי Android</small>
          <b>←</b>
        </Link>

        <Link to="/apps/ios" className="platform-card iphone">
          <span className="platform-icon">🍎</span>
          <strong>iPhone / iOS</strong>
          <small>אפליקציות ל-iPhone ול-iPad</small>
          <b>←</b>
        </Link>
      </section>

      <Link to="/apps" className="back-link">→ חזרה לכל האפליקציות</Link>
    </main>
  );
}
