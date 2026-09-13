import { Link } from "react-router-dom";
import AdminAccessButton from "../components/AdminAccessButton";
import "./MobileApps.css";

export default function MobileApps() {
  return (
    <main className="mobile-apps-page" dir="rtl">
      <AdminAccessButton />
      <section className="mobile-apps-hero">
        <div className="mobile-apps-hero-icon">📱</div>
        <div><h1>אפליקציות סלולרי</h1><p>בחרו את סוג המכשיר שלכם</p></div>
      </section>

      <section className="mobile-platform-grid">
        <Link to="/apps/android" className="mobile-platform-card android-card">
          <div className="mobile-platform-logo">🤖</div>
          <h2>Android / Galaxy</h2>
          <p>אפליקציות למכשירי Samsung Galaxy ומכשירי Android</p>
          <span>פתח אפליקציות Android ←</span>
        </Link>

        <Link to="/apps/ios" className="mobile-platform-card iphone-card">
          <div className="mobile-platform-logo">🍎</div>
          <h2>iPhone / iOS</h2>
          <p>אפליקציות למכשירי Apple iPhone ו־iOS</p>
          <span>פתח אפליקציות iPhone ←</span>
        </Link>
      </section>

      <Link to="/apps" className="mobile-apps-back">→ חזרה לכל האפליקציות</Link>
    </main>
  );
}
