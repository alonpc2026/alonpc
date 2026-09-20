import { useEffect, useState } from "react";
import "./Sport.css";
const API=(process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api")+"/sport-links";
const empty={type:"results",title:"",description:"",url:"",imageUrl:"",icon:"⚽"};
const labels={results:"🏆 תוצאות ספורט",links:"🔗 קישורים רגילים",apps:"📱 אפליקציות"};

export default function AdminSport(){
 const token=localStorage.getItem("token"),[items,setItems]=useState([]),[f,setF]=useState(empty),[msg,setMsg]=useState("");
 const load=()=>fetch(API).then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])).catch(()=>setItems([]));
 useEffect(()=>{load()},[]);
 const save=async e=>{e.preventDefault();setMsg("שומר...");
   const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify(f)});
   if(r.ok){setF(empty);setMsg("✅ נשמר בהצלחה");load()}else setMsg("❌ השמירה נכשלה");
 };
 const del=async id=>{if(!window.confirm("למחוק פריט זה?"))return;await fetch(`${API}/${id}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}});load()};
 return <main className="sport-page sport-admin" dir="rtl">
   <header className="sport-hero"><div className="sport-ball">⚽</div><div className="sport-hero-text"><div className="sport-kicker">ALONPC ADMIN</div><h1>ניהול ספורט</h1><p>תוצאות ספורט • קישורים רגילים • אפליקציות</p></div></header>
   <form className="sport-admin-form" onSubmit={save}>
     <label><span>קטגוריה</span><select value={f.type} onChange={e=>setF({...f,type:e.target.value})}><option value="results">תוצאות ספורט</option><option value="links">קישורים רגילים</option><option value="apps">אפליקציות</option></select></label>
     <label><span>שם האתר / האפליקציה</span><input placeholder="לדוגמה: אתר תוצאות ספורט" value={f.title} onChange={e=>setF({...f,title:e.target.value})} required/></label>
     <label><span>תיאור</span><input placeholder="תיאור קצר וברור" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></label>
     <label><span>קישור לאתר</span><input type="url" placeholder="https://www.example.com" value={f.url} onChange={e=>setF({...f,url:e.target.value})} required/></label>
     <label className="wide"><span>קישור לסמל / תמונה של האתר</span><input type="url" placeholder="https://www.example.com/logo.png" value={f.imageUrl} onChange={e=>setF({...f,imageUrl:e.target.value})}/></label>
     <label><span>אייקון חלופי</span><input placeholder="⚽" value={f.icon} onChange={e=>setF({...f,icon:e.target.value})}/></label>
     <div className="sport-admin-preview"><span>תצוגה מקדימה</span>{f.imageUrl?<img src={f.imageUrl} alt="תצוגה מקדימה" onError={e=>e.currentTarget.style.opacity=".25"}/>:<b>{f.icon||"⚽"}</b>}</div>
     <button className="sport-save">➕ הוסף לספורט</button>
     {msg&&<div className="sport-message">{msg}</div>}
   </form>
   <section className="sport-admin-list">
    <h2>פריטים קיימים ({items.length})</h2>
    <div className="sport-grid">{items.map(x=><article className="sport-card admin-card" key={x._id}>
      <div className="sport-logo-box">{x.imageUrl?<img src={x.imageUrl} alt="" />:<span>{x.icon||"⚽"}</span>}</div>
      <div className="sport-card-content"><div className="sport-card-label">{labels[x.type]||x.type}</div><h2>{x.title}</h2><p>{x.description}</p><button className="sport-delete" type="button" onClick={()=>del(x._id)}>🗑️ מחק</button></div>
    </article>)}</div>
   </section>
 </main>
}
