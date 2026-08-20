import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminJudaism.css";

const API = "https://alonpc02026.onrender.com/api/judaism-content";
const categories = [
  ["torah-lessons","📖 שיעורי תורה נגישים"],
  ["help","🤝 עזרה ביהדות"],
  ["study-material","📚 חומר לימוד"],
  ["events","🕯️ אירועים יהדות"]
];
const empty = { category:"torah-lessons", title:"", description:"", imageUrl:"", url:"", active:true };

export default function AdminJudaism() {
  const [items,setItems] = useState([]);
  const [form,setForm] = useState(empty);
  const [editingId,setEditingId] = useState("");
  const [message,setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}?admin=true`);
      const data = await r.json().catch(() => []);
      if (!r.ok) throw new Error(data.message || "טעינה נכשלה");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { setMessage(`❌ ${e.message}`); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function change(field,value){ setForm((x)=>({...x,[field]:value})); }
  function clear(){ setEditingId(""); setForm(empty); }

  function edit(item){
    setEditingId(item._id);
    setForm({
      category:item.category || "torah-lessons",
      title:item.title || "",
      description:item.description || "",
      imageUrl:item.imageUrl || "",
      url:item.url || "",
      active:item.active !== false
    });
    window.scrollTo({top:0,behavior:"smooth"});
  }

  async function save(e){
    e.preventDefault();
    try{
      const r = await fetch(editingId ? `${API}/${editingId}` : API,{
        method:editingId ? "PUT" : "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      const data = await r.json().catch(()=>({}));
      if(!r.ok) throw new Error(data.message || "שמירה נכשלה");
      setMessage("✅ נשמר בהצלחה");
      clear();
      await load();
    }catch(e){ setMessage(`❌ ${e.message}`); }
  }

  async function remove(item){
    if(!window.confirm(`למחוק את "${item.title}"?`)) return;
    await fetch(`${API}/${item._id}`,{method:"DELETE"});
    await load();
  }

  return (
    <main className="admin-judaism-page" dir="rtl">
      <header>
        <div><p>🔒 אזור מנהל</p><h1>✡️ ניהול יהדות</h1></div>
        <Link to="/admin">חזרה לניהול</Link>
      </header>

      {message && <div className="admin-judaism-message">{message}</div>}

      <form onSubmit={save} className="admin-judaism-form">
        <label>תחום
          <select value={form.category} onChange={(e)=>change("category",e.target.value)}>
            {categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>שם / כותרת *
          <input value={form.title} onChange={(e)=>change("title",e.target.value)} required />
        </label>
        <label>קישור תמונה
          <input value={form.imageUrl} onChange={(e)=>change("imageUrl",e.target.value)} placeholder="https://..." />
        </label>
        <label>קישור
          <input value={form.url} onChange={(e)=>change("url",e.target.value)} placeholder="https://..." />
        </label>
        <label>תיאור
          <textarea rows="5" value={form.description} onChange={(e)=>change("description",e.target.value)} />
        </label>
        <button type="submit">{editingId ? "💾 שמירת שינויים" : "➕ הוספה"}</button>
        {editingId && <button type="button" onClick={clear}>ביטול</button>}
      </form>

      <section className="admin-judaism-list">
        {items.map((item)=>(
          <article key={item._id}>
            <strong>{item.title}</strong>
            <span>{categories.find(([v])=>v===item.category)?.[1]}</span>
            <div>
              <button onClick={()=>edit(item)}>✏️ עריכה</button>
              <button onClick={()=>remove(item)}>🗑️ מחיקה</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
