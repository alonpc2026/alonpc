import { useEffect, useMemo, useState } from "react";
import "./AccessibleBeaches.css";
const API_BASE=process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api";
const API=`${API_BASE}/accessible-beaches`;
export default function AccessibleBeaches(){
 const [items,setItems]=useState([]),[city,setCity]=useState("הכל"),[message,setMessage]=useState("");
 useEffect(()=>{let active=true;fetch(`${API}?active=true`).then(async r=>{const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d.message||"לא ניתן לטעון חופים");if(active)setItems(Array.isArray(d)?d:[])}).catch(e=>active&&setMessage(`❌ ${e.message}`));return()=>{active=false}},[]);
 const cities=useMemo(()=>[...new Set(items.map(x=>x.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"he")),[items]);
 const visible=city==="הכל"?items:items.filter(x=>x.city===city);
 return <main className="beaches-page" dir="rtl">
  <section className="beaches-hero"><span>🏖️♿</span><div><h1>חופים נגישים לכיסא גלגלים</h1><p>מאגר חופים לפי שם החוף והעיר</p></div></section>
  <section className="beaches-filter"><label>בחר עיר</label><select value={city} onChange={e=>setCity(e.target.value)}><option value="הכל">כל הערים</option>{cities.map(x=><option key={x}>{x}</option>)}</select></section>
  {message&&<p className="beaches-message">{message}</p>}
  <section className="beaches-grid">{visible.map(x=><article className="beach-card" key={x._id}><div className="beach-icon">🏖️ ♿</div><h2>{x.name}</h2><p>📍 {x.city}</p><strong>{x.wheelchairAccessible?"✅ נגיש לכיסא גלגלים":"⚠️ נגישות לכיסא גלגלים לא אושרה"}</strong></article>)}</section>
  {!message&&visible.length===0&&<section className="beaches-empty">עדיין לא נוספו חופים.</section>}
 </main>
}