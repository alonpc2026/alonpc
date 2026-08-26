import { useEffect, useState } from "react";

const API="https://alonpc02026.onrender.com/api/sign-language-courses";
const EMPTY={
  name:"", contactName:"", category:"", city:"חיפה", location:"", address:"",
  date:"", startTime:"", endTime:"", capacity:"", remainingPlaces:"",
  imageUrl:"", registrationUrl:"", phone:"", description:"", active:true
};

export default function AdminSignLanguageCourses(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState(EMPTY);
  const [editId,setEditId]=useState("");
  const [message,setMessage]=useState("");

  const load=async()=>{
    try{
      const r=await fetch(API); const d=await r.json();
      setRows(Array.isArray(d)?d:[]);
    }catch(e){setMessage("לא ניתן לטעון קורסים");}
  };
  useEffect(()=>{load()},[]);

  const change=e=>{
    const {name,value,type,checked}=e.target;
    setForm(f=>({...f,[name]:type==="checkbox"?checked:value}));
  };

  async function save(e){
    e.preventDefault(); setMessage("");
    const body={...form,
      capacity: form.capacity===""?0:Number(form.capacity),
      remainingPlaces: form.remainingPlaces===""?0:Number(form.remainingPlaces)
    };
    const r=await fetch(editId?`${API}/${editId}`:API,{
      method:editId?"PUT":"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    const d=await r.json();
    if(!r.ok){setMessage(d.message||"לא ניתן לשמור");return;}
    setMessage(editId?"הקורס עודכן בהצלחה":"הקורס נוסף בהצלחה");
    setForm(EMPTY); setEditId(""); load();
  }

  function edit(x){
    setEditId(x._id);
    setForm({...EMPTY,...x,capacity:x.capacity??"",remainingPlaces:x.remainingPlaces??""});
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function remove(id){
    if(!window.confirm("האם למחוק את הקורס?"))return;
    await fetch(`${API}/${id}`,{method:"DELETE"}); load();
  }

  const field=(label,name,type="text",required=false,placeholder="")=>
    <label style={{display:"grid",gap:6,fontWeight:800}}>{label}
      <input type={type} name={name} value={form[name]} onChange={change}
        required={required} placeholder={placeholder}
        style={{padding:11,borderRadius:8,border:"1px solid #aaa"}}/>
    </label>;

  return <main dir="rtl" style={{maxWidth:1050,margin:"auto",padding:20}}>
    <h1>🤟 ניהול קורס שפת סימנים ישראלי</h1>
    <form onSubmit={save} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14}}>
      {field("שם הקורס *","name","text",true)}
      {field("שם איש קשר","contactName")}
      {field("קטגוריה","category","text",false,"מתחילים / מתקדמים / אחר")}
      {field("עיר *","city","text",true)}
      {field("מיקום הקורס / שם המקום *","location","text",true)}
      {field("כתובת","address")}
      {field("תאריך הקורס *","date","date",true)}
      {field("שעת התחלה *","startTime","time",true)}
      {field("שעת סיום","endTime","time")}
      {field("כמות מקומות כוללת","capacity","number")}
      {field("כמה מקומות נשארו","remainingPlaces","number")}
      {field("טלפון","phone","tel")}
      {field("קישור לתמונת הקורס","imageUrl","url")}
      {field("קישור להרשמה / מידע","registrationUrl","url")}
      <label style={{gridColumn:"1/-1",display:"grid",gap:6,fontWeight:800}}>תיאור
        <textarea name="description" value={form.description} onChange={change} rows="4" style={{padding:11}}/>
      </label>
      <label style={{fontWeight:800}}><input type="checkbox" name="active" checked={form.active} onChange={change}/> פעיל ומוצג לגולשים</label>
      <div style={{gridColumn:"1/-1",display:"flex",gap:10}}>
        <button type="submit" style={{padding:"12px 24px",fontWeight:900}}>{editId?"💾 שמור שינויים":"➕ הוסף קורס"}</button>
        {editId&&<button type="button" onClick={()=>{setEditId("");setForm(EMPTY)}}>ביטול עריכה</button>}
      </div>
    </form>
    {message&&<p style={{fontWeight:900}}>{message}</p>}
    <hr style={{margin:"28px 0"}}/>
    <h2>כל הקורסים</h2>
    {rows.length===0?<p>אין עדיין קורסים.</p>:rows.map(x=>
      <article key={x._id} style={{border:"2px solid #4676a8",borderRadius:12,padding:14,marginBottom:12}}>
        <h3>{x.name}</h3>
        <p><b>עיר:</b> {x.city} | <b>מיקום:</b> {x.location}</p>
        <p><b>תאריך:</b> {x.date} | <b>שעה:</b> {x.startTime}{x.endTime?`–${x.endTime}`:""}</p>
        <p><b>מקומות:</b> נשארו {x.remainingPlaces??0} מתוך {x.capacity??0}</p>
        <button onClick={()=>edit(x)}>✏️ עריכה</button>{" "}
        <button onClick={()=>remove(x._id)}>🗑️ מחיקה</button>
      </article>)}
  </main>;
}
