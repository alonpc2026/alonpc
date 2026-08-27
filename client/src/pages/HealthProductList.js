import {useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";
import "./HealthInfo.css";

const API="https://alonpc02026.onrender.com/api/health-products";

const META={
  "product-warnings": {title:"⚠️ אזהרת מוצרים", category:"warning"},
  "new-products": {title:"🆕 מוצרים חדשים", category:"new"},
  "recommended-products": {title:"⭐ מוצרים מומלצים", category:"recommended"},
  "aliexpress-products": {title:"🛒 מוצרים מאליאקספרס", category:"aliexpress"},
};

export default function HealthProductList(){
  const {type}=useParams();
  const meta=META[type]||META["new-products"];
  const [items,setItems]=useState([]);
  const [error,setError]=useState("");

  useEffect(()=>{
    fetch(`${API}?category=${encodeURIComponent(meta.category)}&active=true`)
      .then(async r=>{
        const d=await r.json();
        if(!r.ok) throw Error(d.message||"לא ניתן לטעון");
        return d;
      })
      .then(d=>setItems(Array.isArray(d)?d:[]))
      .catch(e=>setError(e.message));
  },[meta.category]);

  return (
    <main className="health-info-page" dir="rtl">
      <div className="health-info-top">
        <h1>{meta.title}</h1>
        <Link to="/health">חזרה לבריאות</Link>
      </div>

      {error&&<p className="health-info-error">❌ {error}</p>}
      {!error&&items.length===0&&<p>אין כרגע פריטים בקטגוריה הזו.</p>}

      <section className="health-product-grid">
        {items.map(x=>(
          <article className="health-product-card" key={x._id}>
            {x.imageUrl&&<img src={x.imageUrl} alt={x.title}/>}
            <div className="health-product-body">
              <h2>{x.title}</h2>
              {x.description&&<p>{x.description}</p>}
              {x.source&&<p><b>מקור / חברה:</b> {x.source}</p>}
              {x.link&&<a href={x.link} target="_blank" rel="noreferrer">🔗 מידע נוסף</a>}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
