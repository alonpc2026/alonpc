import { Link } from "react-router-dom";

function ProductDetails() {
  return (
    <div className="pageContainer" dir="rtl">
      <div className="card">
        <h1>🖥️ פרטי המוצר</h1>

        <p>
          דף זה מוכן להצגת פרטי המוצר.
        </p>

        <p>
          כאן יוצגו בהמשך:
        </p>

        <ul>
          <li>📷 תמונת המוצר</li>
          <li>📝 תיאור מלא</li>
          <li>💰 מחיר</li>
          <li>🎥 סרטון</li>
          <li>📞 יצירת קשר</li>
        </ul>

        <br />

        <Link to="/shop">
          <button>⬅ חזרה לחנות</button>
        </Link>
      </div>
    </div>
  );
}

export default ProductDetails;