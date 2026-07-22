import React, { useState } from "react";
import "./Services.css";

const items = [
  { icon:"💻", title:"תמיכה מרחוק", desc:"סיוע למחשבים" },
  { icon:"📱", title:"טלפונים", desc:"סיוע בסמארטפונים" },
  { icon:"♿", title:"נגישות", desc:"שירותים לאנשים עם מוגבלות" },
  { icon:"🛒", title:"חנות", desc:"ציוד ומוצרים מומלצים" },
  { icon:"📄", title:"מסמכים", desc:"עזרה בטפסים" },
  { icon:"🌐", title:"אתרי ממשלה", desc:"קישורים שימושיים" },
  { icon:"⚖️", title:"סיוע משפטי", desc:"מידע כללי" },
  { icon:"🏥", title:"בריאות", desc:"מרפאות ושירותים" }
];

export default function Services(){
  const [search,setSearch]=useState("");

  const filtered=items.filter(i=>
    (i.title+i.desc).includes(search)
  );

  return(
    <main className="services-page" dir="rtl">
      <h1>השירותים שלנו</h1>

      <input
        className="services-search"
        placeholder="חיפוש..."
        value={search}
        onChange={e=>setSearch(e.target.value)}
      />

      <div className="services-grid">
        {filtered.map(item=>(
          <div className="service-box" key={item.title}>
            <div className="icon">{item.icon}</div>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <button>כניסה</button>
          </div>
        ))}
      </div>
    </main>
  );
}
