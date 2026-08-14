import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminGames.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";
const API = `${API_BASE}/games`;

const TYPES = [
  { value: "computer", label: "🖥️ משחקים למחשב" },
  { value: "android", label: "🤖 משחקים לאנדרואיד" },
  { value: "apple", label: "🍎 משחקים לאפל" },
  { value: "tv", label: "📺 משחקים לטלוויזיה חכמה" },
];

const EMPTY = {
  name: "",
  description: "",
  type: "computer",
  platform: "",
  imageUrl: "",
  url: "",
  active: true,
  order: 0,
};

export default function AdminGames() {
  const [items,setItems]=useState([]);
  const [form,setForm]=useState(EMPTY);
  const [editingId,setEditingId]=useState("");
  const [filterType,setFilterType]=useState("all");
  const [search,setSearch]=useState("");
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);

  const load = useCallback(async()=>{
    setLoading(true);
    try{
      const r=await fetch(`${API}?admin=true`);
      const d=await r.json().catch(()=>[]);
      if(!r.ok) throw new Error(d?.message||"טעינת המשחקים נכשלה");
      setItems(Array.isArray(d)?d:d.games||[]);
      setMessage("");
    }catch(e){
      setItems([]);
      setMessage(`❌ ${e.message}`);
    }finally{setLoading(false)}
  },[]);

  useEffect(()=>{load()},[load]);

  const filtered=useMemo(()=>{
    const q=search.trim().toLowerCase();
    return items.filter(i=>{
      const okType=filterType==="all"||i.type===filterType;
      const txt=`${i.name||""} ${i.description||""} ${i.platform||""}`.toLowerCase();
      return okType&&(!q||txt.includes(q));
    });
  },[items,filterType,search]);

  const update=(k,v)=>setForm(f=>({...f,[k]:v}));
  const reset=()=>{setEditingId("");setForm(EMPTY)};

  const edit=(i)=>{
    setEditingId(i._id);
    setForm({
      name:i.name||"",
      description:i.description||"",
      type:i.type||"computer",
      platform:i.platform||"",
      imageUrl:i.imageUrl||"",
      url:i.url||"",
      active:i.active!==false,
      order:Number(i.order||0),
    });
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const save=async(e)=>{
    e.preventDefault();
    if(!form.name.trim()){setMessage("❌ חובה להזין שם משחק");return}
    setSaving(true);setMessage("");
    try{
      const token=localStorage.getItem("token");
      const r=await fetch(editingId?`${API}/${editingId}`:API,{
        method:editingId?"PUT":"POST",
        headers:{"Content-Type":"application/json",...(token?{Authorization:`Bearer ${token}`}:{})},
        body:JSON.stringify(form),
      });
      const d=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(d?.message||"שמירת המשחק נכשלה");
      setMessage(editingId?"✅ המשחק עודכן":"✅ המשחק נוסף");
      reset();await load();
    }catch(err){setMessage(`❌ ${err.message}`)}
    finally{setSaving(false)}
  };

  const remove=async(i)=>{
    if(!window.confirm(`למחוק את "${i.name}"?`)) return;
    try{
      const token=localStorage.getItem("token");
      const r=await fetch(`${API}/${i._id}`,{method:"DELETE",headers:token?{Authorization:`Bearer ${token}`}:{}}); 
      const d=await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(d?.message||"מחיקת המשחק נכשלה");
      setMessage("🗑️ המשחק נמחק");
      await load();
    }catch(err){setMessage(`❌ ${err.message}`)}
  };

  return (
    <main className="admin-games-page" dir="rtl">
      <section className="admin-games-hero">
        <span aria-hidden="true">GAME</span>
        <h1>🎮 ניהול כל המשחקים</h1>
        <p>מחשב, Android, Apple וטלוויזיה חכמה במקום אחד</p>
      </section>

      {message&&<div className="admin-games-message">{message}</div>}

      <form className="admin-games-form" onSubmit={save}>
        <h2>{editingId?"✏️ עריכת משחק":"➕ הוספת משחק"}</h2>
        <div className="admin-games-fields">
          <label><b>סוג משחק</b><select value={form.type} onChange={e=>update("type",e.target.value)}>{TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
          <label><b>שם המשחק *</b><input value={form.name} onChange={e=>update("name",e.target.value)} required/></label>
          <label><b>מערכת / פלטפורמה</b><input value={form.platform} onChange={e=>update("platform",e.target.value)}/></label>
          <label><b>סדר הצגה</b><input type="number" value={form.order} onChange={e=>update("order",Number(e.target.value))}/></label>
          <label className="wide"><b>תיאור</b><textarea rows="4" value={form.description} onChange={e=>update("description",e.target.value)}/></label>
          <label className="wide"><b>קישור לתמונה</b><input dir="ltr" value={form.imageUrl} onChange={e=>update("imageUrl",e.target.value)} placeholder="https://..."/></label>
          <label className="wide"><b>קישור למשחק</b><input dir="ltr" value={form.url} onChange={e=>update("url",e.target.value)} placeholder="https://..."/></label>
          <label className="check"><input type="checkbox" checked={form.active} onChange={e=>update("active",e.target.checked)}/><span>פעיל ומוצג באתר</span></label>
        </div>
        <div className="admin-games-actions">
          <button type="submit" disabled={saving}>{saving?"שומר...":editingId?"💾 שמור שינויים":"➕ הוסף משחק"}</button>
          {editingId&&<button type="button" onClick={reset}>ביטול</button>}
        </div>
      </form>

      <section className="admin-games-list">
        <div className="admin-games-toolbar">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="חיפוש משחק..."/>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)}>
            <option value="all">כל סוגי המשחקים</option>
            {TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <Link to="/games">👁️ צפייה באזור המשחקים</Link>
        </div>

        {loading&&<p>טוען...</p>}
        <div className="admin-games-grid">
          {filtered.map(i=>(
            <article key={i._id} className="admin-game-card">
              {i.imageUrl?<img src={i.imageUrl} alt=""/>:<div className="admin-game-placeholder">🎮</div>}
              <h3>{i.name}</h3>
              <strong>{TYPES.find(t=>t.value===i.type)?.label||i.type}</strong>
              {i.platform&&<p>{i.platform}</p>}
              {i.description&&<p>{i.description}</p>}
              <div className="admin-game-card-actions">
                <button type="button" onClick={()=>edit(i)}>✏️ עריכה</button>
                <button type="button" className="delete" onClick={()=>remove(i)}>🗑️ מחיקה</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
