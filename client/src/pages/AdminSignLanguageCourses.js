import { useEffect, useState } from "react";

const API="https://alonpc02026.onrender.com/api/sign-language-courses";
const empty={name:"",category:"",city:"חיפה",startDate:"",endDate:"",place:"",address:"",phone:"",link:"",imageUrl:"",description:"",active:true};

export default function AdminSignLanguageCourses(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState(empty);
  const [editId,setEditId]=useState("");

  const load=()=>fetch(API).then(r=>r.json()).then(d=>setRows(Array.isArray(d)?d:[]));
  useEffect(()=>{load()},[]);

  const change=e=>{
    const {name,value,type,checked}=e.target;
    setForm(f=>({...f,[name]:type==="checkbox"?checked:value}));
  };

  async function save(e){
    e.preventDefault();
    const r=await fetch(editId?`${API}/${editId}`:API,{
      method:editId?"PUT":"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(form)
    });
    const d=await r.json();
    if(!r.ok) return alert(d.message || "לא ניתן לשמור");
    setForm(empty); setEditId(""); load();
  }

  function edit(x){
    setEditId(x._id);
    setForm({...empty,...x});
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function remove(id){
    if(!window.confirm("למחוק את הקורס?")) return;
    await fetch(`${API}/${id}`,{method:"DELETE"});
    load();
  }

  return <main dir="rtl" style={{maxWidth:1100,margin:"auto",padding:20}}>
    <h1>🤟 ניהול קורס שפת סימנים ישראלי</h1>
    <form onSubmit={save} style={{display:"grid",gap:12}}>
      <label>שם קורס *<input required name="name" value={form.name} onChange={change}/></label>
      <label>קטגוריה<input name="category" placeholder="מתחילים / מתקדמים / ילדים..." value={form.category} onChange={change}/></label>
      <label>עיר *<input required name="city" list="course-cities" value={form.city} onChange={change}/></label>
      <datalist id="course-cities"><option value="חיפה"/><option value="תל אביב"/><option value="ירושלים"/></datalist>
      <label>תאריך התחלה *<input required type="date" name="startDate" value={form.startDate} onChange={change}/></label>
      <label>תאריך סיום<input type="date" name="endDate" value={form.endDate} onChange={change}/></label>
      <label>שם מקום<input name="place" value={form.place} onChange={change}/></label>
      <label>כתובת<input name="address" value={form.address} onChange={change}/></label>
      <label>טלפון<input name="phone" value={form.phone} onChange={change}/></label>
      <label>קישור<input type="url" name="link" value={form.link} onChange={change}/></label>
      <label>כתובת תמונה<input type="url" name="imageUrl" value={form.imageUrl} onChange={change}/></label>
      <label>תיאור<textarea name="description" value={form.description} onChange={change}/></label>
      <label><input type="checkbox" name="active" checked={form.active} onChange={change}/> פעיל</label>
      <button type="submit">{editId?"שמור שינויים":"הוסף קורס"}</button>
      {editId && <button type="button" onClick={()=>{setEditId("");setForm(empty)}}>ביטול עריכה</button>}
    </form>

    <hr/>
    <h2>כל הקורסים</h2>
    {rows.map(x=><article key={x._id} style={{border:"2px solid #315f91",borderRadius:12,padding:14,margin:"10px 0"}}>
      <h3>{x.name}</h3>
      <p>{x.category || "ללא קטגוריה"} | {x.city} | {x.startDate}{x.endDate?` עד ${x.endDate}`:""}</p>
      <button onClick={()=>edit(x)}>✏️ עריכה</button>{" "}
      <button onClick={()=>remove(x._id)}>🗑️ מחיקה</button>
    </article>)}
  </main>;
}
