import {useEffect,useState} from "react";
import "./DomainDirectory.css";
const API="https://alonpc02026.onrender.com/api/transport";
function wa(v){return String(v||"").replace(/\D/g,"");}
export default function Page(){
 const [items,setItems]=useState([]),[notices,setNotices]=useState([]),[error,setError]=useState("");
 useEffect(()=>{
  fetch(API).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.message||"לא ניתן לטעון");return d}).then(d=>setItems(Array.isArray(d)?d.filter(x=>x.active!==false):[])).catch(e=>setError(e.message));
  fetch("https://alonpc02026.onrender.com/api/transport-notices").then(r=>r.json()).then(d=>setNotices(Array.isArray(d)?d.filter(x=>x.active!==false):[])).catch(()=>{});
 },[]);
 return <main className="domain-page" dir="rtl">
  <h1>🚗 תחבורה</h1>
  {error&&<p>❌ {error}</p>}
  {!error&&items.length===0&&<p>אין כרגע שירותי תחבורה.</p>}
  <section className="domain-grid">
   {items.map(x=><article className="domain-card" key={x._id}>
    <div className="domain-logo">{x.logoUrl?<img src={x.logoUrl} alt={`לוגו ${x.businessName}`}/>:<span>🏢</span>}</div>
    <h2>{x.businessName}</h2>
    <div className="domain-links">
     {x.phone&&<a href={`tel:${x.phone}`}>📞 טלפון</a>}
     {x.whatsapp&&<a href={`https://wa.me/${wa(x.whatsapp)}`} target="_blank" rel="noreferrer">💬 WhatsApp</a>}
     {x.businessUrl&&<a href={x.businessUrl} target="_blank" rel="noreferrer">🔗 אתר / מידע</a>}
    </div>
   </article>)}
  </section>
 </main>
}