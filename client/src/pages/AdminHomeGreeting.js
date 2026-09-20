import { useEffect, useState } from "react";
import "./AdminHomeGreeting.css";
const API=(process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api")+"/home-greeting";
const languages=[["he","🇮🇱 עברית"],["ru","🇷🇺 Русский"],["en","🇬🇧 English"],["ar","🇸🇦 العربية"],["am","🇪🇹 አማርኛ"],["fr","🇫🇷 Français"],["fil","🇵🇭 Filipino"],["hi","🇮🇳 हिन्दी"]];
const blank={title:"ברכה מיוחדת",enabled:true,messages:{he:"",ru:"",en:"",ar:"",am:"",fr:"",fil:"",hi:""}};
export default function AdminHomeGreeting(){
 const [form,setForm]=useState(blank),[msg,setMsg]=useState("");
 const token=localStorage.getItem("token");
 useEffect(()=>{fetch(API).then(r=>r.json()).then(d=>{if(d&&d.messages)setForm({...blank,...d,messages:{...blank.messages,...d.messages}})}).catch(()=>{})},[]);
 const save=async e=>{e.preventDefault();setMsg("שומר...");
  const r=await fetch(API,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
  setMsg(r.ok?"✅ הברכה נשמרה בהצלחה":"❌ השמירה נכשלה");
 };
 return <main className="greeting-admin" dir="rtl">
  <header><div>🎉</div><section><small>ALONPC</small><h1>ניהול ברכות בדף הבית</h1><p>כל שפה נכתבת בנפרד ומוצגת בכותרת גדולה, מודגשת ומקצועית.</p></section></header>
  <form onSubmit={save}>
   <div className="greeting-admin-top">
    <label><b>כותרת הברכה</b><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="לדוגמה: גמר חתימה טובה"/></label>
    <label className="switch"><input type="checkbox" checked={form.enabled} onChange={e=>setForm({...form,enabled:e.target.checked})}/><b>{form.enabled?"הברכה מוצגת בדף הבית":"הברכה מוסתרת"}</b></label>
   </div>
   <div className="language-grid">{languages.map(([code,label])=><label className="language-card" key={code}><b>{label}</b><textarea rows="4" value={form.messages?.[code]||""} onChange={e=>setForm({...form,messages:{...form.messages,[code]:e.target.value}})} placeholder={`כתוב ברכה ב-${label}`}/></label>)}</div>
   <button className="greeting-save">💾 שמור ופרסם ברכה</button>{msg&&<strong className="greeting-msg">{msg}</strong>}
  </form>
 </main>
}