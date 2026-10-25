import {useEffect,useState} from "react";import {Link} from "react-router-dom";import "./Sport.css";
const API=(process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api")+"/sport-links";
export default function Sport(){const [items,setItems]=useState([]),[tab,setTab]=useState("results");
useEffect(()=>{fetch(API).then(r=>r.json()).then(d=>setItems(Array.isArray(d)?d:[])).catch(()=>setItems([]))},[]);
const names={results:"תוצאות ספורט",links:"קישורים רגילים",apps:"אפליקציות"};
return <main className="sport-page" dir="rtl"><header><div className="sport-ball">⚽</div><div><h1>ספורט</h1><p>תוצאות ספורט, קישורים שימושיים ואפליקציות</p></div><Link to="/">🏠 דף הבית</Link></header>
<nav>{Object.entries(names).map(([k,v])=><button type="button" className={tab===k?"active":""} onClick={()=>setTab(k)} key={k}>{k==="results"?"🏆":k==="apps"?"📱":"🔗"} {v}</button>)}</nav>
<section className="sport-grid">{items.filter(x=>x.type===tab).length?items.filter(x=>x.type===tab).map(x=><a className="sport-card" href={x.url} target="_blank" rel="noreferrer" key={x._id}><span>{x.icon||"⚽"}</span><div><h2>{x.title}</h2><p>{x.description}</p></div></a>):<div className="sport-empty">עדיין אין פריטים בקטגוריה זו. ניתן להוסיף דרך הניהול.</div>}</section></main>}