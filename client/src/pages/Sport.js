import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Sport.css";

const API=(process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api")+"/sport-links";
const names={results:"תוצאות ספורט",links:"קישורים רגילים",apps:"אפליקציות"};

export default function Sport(){
  const [items,setItems]=useState([]);
  const [tab,setTab]=useState("results");
  useEffect(()=>{fetch(API).then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])).catch(()=>setItems([]))},[]);
  const shown=items.filter(x=>x.type===tab);
  return <main className="sport-page" dir="rtl">
    <header className="sport-hero">
      <div className="sport-ball">⚽</div>
      <div className="sport-hero-text"><div className="sport-kicker">ALONPC SPORT</div><h1>עולם הספורט</h1><p>תוצאות ספורט • קישורים שימושיים • אפליקציות ספורט</p></div>
      <Link className="sport-home" to="/">🏠 דף הבית</Link>
    </header>

    <section className="sport-feature-strip">
      <div><b>🏆 תוצאות</b><span>גישה מהירה לאתרי תוצאות</span></div>
      <div><b>🌍 ספורט בעולם</b><span>אתרים וקישורים נבחרים</span></div>
      <div><b>📱 אפליקציות</b><span>אפליקציות ספורט שימושיות</span></div>
    </section>

    <nav className="sport-tabs">{Object.entries(names).map(([k,v])=>
      <button type="button" className={tab===k?"active":""} onClick={()=>setTab(k)} key={k}>
        <span>{k==="results"?"🏆":k==="apps"?"📱":"🔗"}</span>{v}
      </button>)}
    </nav>

    <section className="sport-grid">
      {shown.length?shown.map(x=><a className="sport-card" href={x.url} target="_blank" rel="noreferrer" key={x._id}>
        <div className="sport-logo-box">
          {x.imageUrl?<img src={x.imageUrl} alt={`סמל ${x.title}`} onError={e=>{e.currentTarget.style.display="none";e.currentTarget.nextSibling.style.display="block"}}/>:null}
          <span style={{display:x.imageUrl?"none":"block"}}>{x.icon||"⚽"}</span>
        </div>
        <div className="sport-card-content"><div className="sport-card-label">{names[x.type]||"ספורט"}</div><h2>{x.title}</h2>{x.description&&<p>{x.description}</p>}<strong>כניסה לאתר ←</strong></div>
      </a>):<div className="sport-empty">⚽ עדיין אין פריטים בקטגוריה זו. ניתן להוסיף דרך הניהול.</div>}
    </section>
  </main>
}
