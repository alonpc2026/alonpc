import { Link } from "react-router-dom";
import "./SecondHand.css";

export default function SecondHand() {
  return (
    <main className="second-hand-page" dir="rtl">
      <header className="second-hand-header">
        <h1>יד שנייה</h1>
        <p>מוצרים יד שנייה באתר ALONPC</p>
      </header>

      <section className="second-hand-box">
        <h2>העמוד בבנייה</h2>

        <p>
          בקרוב יהיה ניתן לפרסם ולקנות מוצרים יד שנייה:
        </p>

        <ul>
          <li>💻 מחשבים</li>
          <li>🖥️ מסכים</li>
          <li>⌨️ מקלדות ועכברים</li>
          <li>🖨️ מדפסות</li>
          <li>📱 טלפונים</li>
          <li>♿ ציוד נגישות</li>
          <li>📦 מוצרים נוספים</li>
        </ul>

        <Link className="back-button" to="/shop">
          מעבר לחנות
        </Link>
      </section>
    </main>
  );
}