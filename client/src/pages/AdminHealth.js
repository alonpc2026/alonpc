import {useEffect,useState} from "react";
import "./AdminDomainDirectory.css";
const API="https://alonpc02026.onrender.com/api/health-directory",EMPTY={businessName:"",phone:"",whatsapp:"",businessUrl:"",logoUrl:"",active:true};
export default function Page(){
 const [items,setItems]=useState([]),[form,setForm]=useState(EMPTY),[id,setId]=useState(""),[msg,setMsg]=useState("");
 async function load(){try{const r=await fetch(API),d=await r.json();if(!r.ok)throw Error(d.message||"לא ניתן לטעון");setItems(Array.isArray(d)?d:[])}catch(e){setMsg("❌ "+e.message)}}
 useEffect(()=>{load()},[]);
 function ch(e){const{name,value,type,checked}=e.target;setForm(o=>({...o,[name]:type==="checkbox"?checked:value}))}
 async function save(e){e.preventDefault();try{const r=await fetch(id?`${API}/${id}`:API,{method:id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}),d=await r.json();if(!r.ok)throw Error(d.message||"לא ניתן לשמור");setForm(EMPTY);setId("");setMsg("✅ נשמר בהצלחה");load()}catch(e){setMsg("❌ "+e.message)}}
 async function del(i){if(window.confirm("למחוק?")){await fetch(`${API}/${i}`,{method:"DELETE"});load()}}
 function edit(x){setId(x._id);setForm({businessName:x.businessName||"",phone:x.phone||"",whatsapp:x.whatsapp||"",businessUrl:x.businessUrl||"",logoUrl:x.logoUrl||"",active:x.active!==false});window.scrollTo({top:0,behavior:"smooth"})}
 return <main className="domain-admin" dir="rtl">
  <h1>❤️ ניהול בריאות</h1>
  <form className="domain-form" onSubmit={save}>
   <label>🏢 שם העסק / הגוף *<input required name="businessName" value={form.businessName} onChange={ch}/></label>
   <label>📞 טלפון<input name="phone" value={form.phone} onChange={ch}/></label>
   <label>💬 WhatsApp<input name="whatsapp" value={form.whatsapp} onChange={ch} placeholder="972501234567"/></label>
   <label>🔗 קישור לאתר / מידע<input type="url" name="businessUrl" value={form.businessUrl} onChange={ch} placeholder="https://"/></label>
   <label className="wide">🖼️ קישור ללוגו<input type="url" name="logoUrl" value={form.logoUrl} onChange={ch} placeholder="https://.../logo.png"/></label>
   {form.logoUrl&&<div className="logo-preview"><img src={form.logoUrl} alt="תצוגת לוגו"/></div>}
   <label className="active"><input type="checkbox" name="active" checked={form.active} onChange={ch}/> פעיל ומוצג באתר</label>
   <div className="actions"><button type="submit">{id?"💾 שמור שינויים":"➕ הוסף"}</button>{id&&<button type="button" onClick={()=>{setId("");setForm(EMPTY)}}>ביטול</button>}</div>
  </form>
  {msg&&<p className="msg">{msg}</p>}
  <section>
   {items.map(x=><article className="admin-card" key={x._id}>
    <div className="admin-logo">{x.logoUrl?<img src={x.logoUrl} alt={x.businessName}/>:<span>🏢</span>}</div>
    <div><h3>{x.businessName}</h3>{x.phone&&<p>📞 {x.phone}</p>}{x.whatsapp&&<p>💬 {x.whatsapp}</p>}{x.businessUrl&&<p>🔗 {x.businessUrl}</p>}</div>
    <div className="card-actions"><button onClick={()=>edit(x)}>✏️ עריכה</button><button onClick={()=>del(x._id)}>🗑️ מחיקה</button></div>
   </article>)}
  </section>
 </main>
}