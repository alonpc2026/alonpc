import {Link} from "react-router-dom";
import "./HealthInfo.css";

export default function ImportantInfo(){
  return (
    <main className="health-info-page" dir="rtl">
      <h1>ℹ️ מידע חשוב לדעת</h1>
      <p>מידע ועדכונים שימושיים במקום אחד.</p>
      <section className="health-info-menu">
        <Link className="health-info-button warning" to="/health/product-warnings">⚠️ אזהרת מוצרים</Link>
        <Link className="health-info-button new" to="/health/new-products">🆕 מוצרים חדשים</Link>
        <Link className="health-info-button recommended" to="/health/recommended-products">⭐ מוצרים מומלצים</Link>
        <Link className="health-info-button aliexpress" to="/health/aliexpress-products">🛒 מוצרים מאליאקספרס</Link>
      </section>
    </main>
  );
}
