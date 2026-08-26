import { useEffect,useMemo,useState } from "react";
const API="https://alonpc02026.onrender.com/api/sign-language-courses";
export default function SignLanguageCourses(){
 const [rows,setRows]=useState([]),[city,setCity]=useState("הכול"),[loading,setLoading]=useState(true);
 useEffect(()=>{fetch(API).then(r=>r.json()).then(d=>setRows(Array.isArray(d)?d:[])).finally(()=>setLoading(false))},[]);
 const cities=useMemo(()=>["הכול",...new Set(rows.map(x=>x.city).filter(Boolean))],[rows]);
 const shown=rows.filter(x=>x.active!==false&&(city==="הכול"||x.city===city));
 return <main dir="rtl" style={{maxWidth:1100,margin:"auto",padding:20}}>
  <h1>🤟 קורס שפת סימנים ישראלי</h1>
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{cities.map(c=><button key={c} onClick={()=>setCity(c)}>{c}</button>)}</div>
  {loading?<p>אנא המתן לטעינת הקורסים...</p>:shown.length===0?<p>אין כרגע קורסים.</p>:shown.map(x=><article key={x._id} style={{border:"2px solid #4676a8",borderRadius:14,padding:16,margin:"14px 0"}}>
   {x.imageUrl&&<img src={x.imageUrl} alt={x.name} style={{maxWidth:260,maxHeight:180,objectFit:"contain"}}/>}
   <h2>{x.name}</h2>
   {x.category&&<p><b>קטגוריה:</b> {x.category}</p>}
   <p><b>עיר:</b> {x.city}</p><p><b>מיקום:</b> {x.location}</p>
   {x.address&&<p><b>כתובת:</b> {x.address}</p>}
   <p><b>תאריך:</b> {x.date} | <b>שעה:</b> {x.startTime}{x.endTime?`–${x.endTime}`:""}</p>
   {x.capacity>0&&<p><b>מקומות:</b> נשארו {x.remainingPlaces} מתוך {x.capacity}</p>}
   {x.contactName&&<p><b>איש קשר:</b> {x.contactName}</p>}
   {x.phone&&<p><b>טלפון:</b> {x.phone}</p>}
   {x.description&&<p>{x.description}</p>}
   {x.registrationUrl&&<a href={x.registrationUrl} target="_blank" rel="noreferrer">הרשמה / מידע</a>}
  </article>)}
 </main>
}
