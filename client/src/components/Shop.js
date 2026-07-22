import React, { useState } from "react";
import "./Shop.css";

const products = [
  {name:"מקלדת אלחוטית",price:"₪220",icon:"⌨️"},
  {name:"עכבר ארגונומי",price:"₪120",icon:"🖱️"},
  {name:"אוזניות",price:"₪180",icon:"🎧"},
  {name:"מצלמת רשת",price:"₪260",icon:"📷"},
  {name:"רמקול Bluetooth",price:"₪199",icon:"🔊"},
  {name:"ציוד נגישות",price:"₪350",icon:"♿"},
];

export default function Shop(){
  const [search,setSearch]=useState("");
  const filtered=products.filter(p=>p.name.includes(search));

  return(
    <main className="shop-page" dir="rtl">
      <h1>חנות ALONPC</h1>

      <input
        className="shop-search"
        placeholder="חיפוש מוצר..."
        value={search}
        onChange={e=>setSearch(e.target.value)}
      />

      <div className="shop-grid">
        {filtered.map(item=>(
          <article className="product-card" key={item.name}>
            <div className="product-icon">{item.icon}</div>
            <h2>{item.name}</h2>
            <strong>{item.price}</strong>
            <button>הוסף לסל</button>
          </article>
        ))}
      </div>
    </main>
  );
}
