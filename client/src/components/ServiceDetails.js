import React from "react";
import { useParams, Link } from "react-router-dom";
import "./ServiceDetails.css";

export default function ServiceDetails() {
  const { id } = useParams();

  return (
    <main className="service-details" dir="rtl">
      <div className="service-card">
        <h1>פרטי השירות</h1>
        <h2>מזהה שירות: {id || "כללי"}</h2>

        <p>
          כאן ניתן להציג מידע מלא על השירות, תמונות, מסמכים,
          קישורים ופרטי יצירת קשר.
        </p>

        <div className="actions">
          <button>פנייה לשירות</button>
          <Link to="/services">חזרה לשירותים</Link>
        </div>
      </div>
    </main>
  );
}
