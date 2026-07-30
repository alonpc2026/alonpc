import { Link, useLocation } from "react-router-dom";
import "./AppsHomeButton.css";

export default function AppsHomeButton() {
  const location = useLocation();

  if (location.pathname !== "/") {
    return null;
  }

  return (
    <section className="apps-home-button-wrap" dir="rtl">
      <Link className="apps-home-button" to="/apps">
        <span className="apps-home-button-icon" aria-hidden="true">
          📱
        </span>
        <span>
          <strong>הורדת אפליקציות</strong>
          <small>iPhone או Galaxy / Android</small>
        </span>
      </Link>
    </section>
  );
}
