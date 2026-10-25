import {useEffect,useState} from "react";
import "./AdminDomainDirectory.css";

const API="https://alonpc02026.onrender.com/api/health-products";
const EMPTY={title:"",description:"",category:"warning",source:"",link:"",imageUrl:"",active:true};

const CATEGORY_OPTIONS=[
  ["warning","⚠️ אזהרת מוצרים"],
  ["new","🆕 מוצרים חדשים"],
  ["recommended","⭐ מוצרים מומלצים"],
  ["aliexpress","🛒 מוצרים מאליאקספרס"],
];

export default function AdminHealthProducts(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState(EMPTY);
  const [id,setId]=useState("");
  const [msg,setMsg]=useState("");

  async function load(){
    try{
      const r=await fetch(API);
      const d=await r.json();
      if(!r.ok) throw Error(d.message||"לא ניתן לטעון");
      setItems(Array.isArray(d)?d:[]);
    }catch(e){setMsg("❌ "+e.message)}
  }

  useEffect(()=>{load()},[]);

  function ch(e){
    const{name,value,type,checked}=e.target;
    setForm(o=>({...o,[name]:type==="checkbox"?checked:value}));
  }

  async function save(e){
    e.preventDefault();
    try{
      const r=await fetch(id?`${API}/${id}`:API,{
        method:id?"PUT":"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      const d=await r.json();
      if(!r.ok) throw Error(d.message||"לא ניתן לשמור");
      setForm(EMPTY);
      setId("");
      setMsg("✅ נשמר בהצלחה");
      load();
    }catch(e){setMsg("❌ "+e.message)}
  }

  async function del(x){
    if(!window.confirm("למחוק?")) return;
    await fetch(`${API}/${x}`,{method:"DELETE"});
    load();
  }

  function edit(x){
    setId(x._id);
    setForm({
      title:x.title||"",
      description:x.description||"",
      category:x.category||"warning",
      source:x.source||"",
      link:x.link||"",
      imageUrl:x.imageUrl||"",
      active:x.active!==false
    });
    window.scrollTo({top:0,behavior:"smooth"});
  }

  return (
    <main className="domain-admin" dir="rtl">
      <h1>❤️ ניהול מידע ומוצרים בבריאות</h1>

      <form className="domain-form" onSubmit={save}>
        <label>כותרת *
          <input required name="title" value={form.title} onChange={ch}/>
        </label>

        <label>קטגוריה *
          <select name="category" value={form.category} onChange={ch}>
            {CATEGORY_OPTIONS.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </label>

        <label className="wide">תיאור
          <textarea name="description" value={form.description} onChange={ch} rows="5"/>
        </label>

        <label>מקור / חברה
          <input name="source" value={form.source} onChange={ch}/>
        </label>

        <label>קישור
          <input type="url" name="link" value={form.link} onChange={ch} placeholder="https://"/>
        </label>

        <label className="wide">קישור לתמונה
          <input type="url" name="imageUrl" value={form.imageUrl} onChange={ch} placeholder="https://..."/>
        </label>

        <label className="active">
          <input type="checkbox" name="active" checked={form.active} onChange={ch}/>
          פעיל ומוצג באתר
        </label>

        <div className="actions">
          <button type="submit">{id?"💾 שמור שינויים":"➕ הוסף פריט"}</button>
          {id&&<button type="button" onClick={()=>{setId("");setForm(EMPTY)}}>ביטול</button>}
        </div>
      </form>

      {msg&&<p className="msg">{msg}</p>}

      <section>
        {items.map(x=>(
          <article className="admin-card" key={x._id}>
            <div className="admin-logo">
              {x.imageUrl?<img src={x.imageUrl} alt={x.title}/>:<span>🩺</span>}
            </div>
            <div>
              <h3>{x.title}</h3>
              <p>{CATEGORY_OPTIONS.find(([v])=>v===x.category)?.[1]||x.category}</p>
              {x.source&&<p>{x.source}</p>}
            </div>
            <div className="card-actions">
              <button onClick={()=>edit(x)}>✏️ עריכה</button>
              <button onClick={()=>del(x._id)}>🗑️ מחיקה</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
