import { useEffect, useMemo, useState } from "react";

const API="https://alonpc02026.onrender.com/api/sign-language-courses";
const CITIES=["הכול","חיפה","תל אביב","ירושלים"];

export default function SignLanguageCourses(){
  const [rows,setRows]=useState([]);
  const [city,setCity]=useState("הכול");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch(API).then(r=>r.json()).then(d=>setRows(Array.isArray(d)?d:[])).finally(()=>setLoading(false));
  },[]);

  const visible=useMemo(()=>rows.filter(x=>x.active!==false && (city==="הכול" || x.city===city)),[rows,city]);

  return <main dir="rtl" style={{maxWidth:1100,margin:"auto",padding:20}}>
    <h1>🤟 קורס שפת סימנים ישראלי</h1>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
      {CITIES.map(c=><button key={c} onClick={()=>setCity(c)} style={{padding:"12px 20px",fontWeight:900}}>{c}</button>)}
    </div>
    {loading ? <p>טוען קורסים...</p> : visible.length===0 ? <p>אין כרגע קורסים בעיר שנבחרה.</p> :
      visible.map(x=><article key={x._id} style={{border:"2px solid #315f91",borderRadius:14,padding:16,marginBottom:14}}>
        {x.imageUrl && <img src={x.imageUrl} alt={x.name} style={{maxWidth:220,maxHeight:150,objectFit:"contain"}} />}
        <h2>{x.name}</h2>
        {x.category && <p><b>קטגוריה:</b> {x.category}</p>}
        <p><b>עיר:</b> {x.city}</p>
        <p><b>תאריך:</b> {x.startDate}{x.endDate && x.endDate!==x.startDate ? ` עד ${x.endDate}`:""}</p>
        {x.place && <p><b>מקום:</b> {x.place}</p>}
        {x.address && <p><b>כתובת:</b> {x.address}</p>}
        {x.phone && <p><b>טלפון:</b> {x.phone}</p>}
        {x.description && <p>{x.description}</p>}
        {x.link && <a href={x.link} target="_blank" rel="noreferrer">מידע / הרשמה</a>}
      </article>)
    }
  </main>;
}
