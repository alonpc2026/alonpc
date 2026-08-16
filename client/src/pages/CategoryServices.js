import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CategoryServices.css";

const API="https://alonpc02026.onrender.com/api/services";
const CONFIG={
"/national-insurance":{icon:"🏦",title:"ביטוח לאומי",sub:"קצבאות, זכויות, טפסים ושירותים של ביטוח לאומי",keys:["ביטוח לאומי","קצבה","קצבאות","זכויות","national insurance","btl"]},
"/health-services":{icon:"❤️",title:"בריאות",sub:"קופות חולים, בתי חולים ושירותי רפואה",keys:["בריאות","קופת חולים","קופות חולים","בית חולים","רפואה","health","medical","hospital"]},
"/accessibility-services":{icon:"♿",title:"נגישות",sub:"מידע, זכויות ושירותים לאנשים עם מוגבלות",keys:["נגישות","מוגבלות","נכים","חירשים","כבדי שמיעה","accessibility","disability"]},
"/transport-services":{icon:"🚗",title:"תחבורה",sub:"תחבורה ציבורית, ניידות ושירותים נגישים",keys:["תחבורה","אוטובוס","רכבת","ניידות","transport","bus","train"]},
"/employment-services":{icon:"💼",title:"תעסוקה",sub:"משרות, הכשרה וסיוע בעבודה",keys:["תעסוקה","עבודה","משרה","משרות","employment","job","work"]}
};

export default function CategoryServices(){
 const {pathname}=useLocation(); const cfg=CONFIG[pathname]||CONFIG["/accessibility-services"];
 const [items,setItems]=useState([]),[search,setSearch]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{const c=new AbortController();(async()=>{try{const r=await fetch(API,{signal:c.signal});const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error();setItems(Array.isArray(d)?d:[])}catch(e){if(e.name!=="AbortError")setError("לא ניתן לטעון את המידע כרגע.")}finally{if(!c.signal.aborted)setLoading(false)}})();return()=>c.abort()},[]);
 const filtered=useMemo(()=>items.filter(x=>{const t=[x.name,x.category,x.description,x.businessName,x.city].filter(Boolean).join(" ").toLowerCase();return cfg.keys.some(k=>t.includes(k.toLowerCase()))&&(!search||t.includes(search.toLowerCase()))}),[items,search,cfg]);
 return <main className="catPage" dir="rtl"><header className="catHero"><span>{cfg.icon}</span><div><h1>{cfg.title}</h1><p>{cfg.sub}</p></div></header><div className="catTools"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔎 חיפוש בתוך התחום..."/><Link to="/">🏠 חזרה לדף הבית</Link></div>{loading&&<p className="catStatus">טוען...</p>}{error&&<p className="catStatus">{error}</p>}{!loading&&!error&&filtered.length===0&&<section className="catStatus"><b>{cfg.title}</b><p>כרגע לא נמצאו פריטים מתאימים במאגר, אבל הכפתור הגיע לתחום הנכון ולא לרשימת עסקים כללית.</p></section>}<section className="catGrid">{filtered.map(s=><article className="catCard" key={s._id}>{s.imageUrl&&<img src={s.imageUrl} alt={s.name||""}/>}<div><h2>{s.icon||cfg.icon} {s.name}</h2>{s.category&&<strong>{s.category}</strong>}{s.description&&<p>{s.description}</p>}<Link to={`/service/${s._id}`}>לפרטים נוספים</Link></div></article>)}</section></main>
}