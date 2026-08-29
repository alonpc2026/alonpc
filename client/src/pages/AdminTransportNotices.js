import {useEffect,useState} from "react";
import "./AdminDomainDirectory.css";
const API="https://alonpc02026.onrender.com/api/transport-notices";
const EMPTY={title:"",description:"",link:"",date:"",active:true};

export default function AdminTransportNotices(){
 const [items,setItems]=useState([]),[form,setForm]=useState(EMPTY),[id,setId]=useState(""),[msg,setMsg]=useState("");
 async function load(){try{const r=await fetch(API),d=await r.json();if(!r.ok)throw Error(d.message||"לא ניתן לטעון");setItems(Array.isArray(d)?d:[])}catch(e){setMsg("❌ "+e.message)}}
 useEffect(()=>{load()},[]);
 function ch(e){const{name,value,type,checked}=e.target;setForm(o=>({...o,[name]:type==="checkbox"?checked:value}))}
 async function save(e){e.preventDefault();try{const r=await fetch(id?`${API}/${id}`:API,{method:id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}),d=await r.json();if(!r.ok)throw Error(d.message||"לא ניתן לשמור");setForm(EMPTY);setId("");setMsg("✅ ההודעה נשמרה");load()}catch(e){setMsg("❌ "+e.message)}}
 async function del(x){if(window.confirm("למחוק את ההודעה?")){await fetch(`${API}/${x}`,{method:"DELETE"});load()}}
 function edit(x){setId(x._id);setForm({title:x.title||"",description:x.description||"",link:x.link||"",date:x.date||"",active:x.active!==false});window.scrollTo({top:0,behavior:"smooth"})}
 return <main className="domain-admin" dir="rtl">
  <h1>📢 הודעות חשובות בתחבורה</h1>
  <form className="domain-form" onSubmit={save}>
   <label>כותרת ההודעה *<input required name="title" value={form.title} onChange={ch}/></label>
   <label>תאריך<input type="date" name="date" value={form.date} onChange={ch}/></label>
   <label className="wide">פירוט ההודעה<textarea rows="5" name="description" value={form.description} onChange={ch}/></label>
   <label className="wide">קישור למידע נוסף<input type="url" name="link" value={form.link} onChange={ch} placeholder="https://"/></label>
   <label className="active"><input type="checkbox" name="active" checked={form.active} onChange={ch}/> פעיל ומוצג באתר</label>
   <div className="actions"><button type="submit">{id?"💾 שמור שינויים":"➕ הוסף הודעה"}</button>{id&&<button type="button" onClick={()=>{setId("");setForm(EMPTY)}}>ביטול</button>}</div>
  </form>
  {msg&&<p className="msg">{msg}</p>}
  <section>{items.map(x=><article className="admin-card" key={x._id}>
   <div className="admin-logo"><span>📢</span></div>
   <div><h3>{x.title}</h3>{x.date&&<p>📅 {x.date}</p>}{x.description&&<p>{x.description}</p>}</div>
   <div className="card-actions"><button onClick={()=>edit(x)}>✏️ עריכה</button><button onClick={()=>del(x._id)}>🗑️ מחיקה</button></div>
  </article>)}</section>
 </main>
}
