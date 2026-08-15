import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminSecondHand.css";

const API = (process.env.REACT_APP_API_BASE || "https://alonpc02026.onrender.com/api") + "/second-hand";

const CATEGORIES = ["מחשב נייד","מחשב נייח","מסך","מדפסת","טלפון / טאבלט","חלקי מחשב","ציוד היקפי","ציוד נגישות","שונות"];
const CONDITIONS = ["כמו חדש","מצב טוב מאוד","מצב טוב","משומש","לחלקים"];

const EMPTY_FORM = {
  name:"", category:"", brand:"", model:"", condition:"מצב טוב",
  price:"", oldPrice:"", stock:1, description:"",
  imageUrl:"", websiteUrl:"", active:true, featured:false,
};

function AdminSecondHand() {
  const [items,setItems] = useState([]);
  const [form,setForm] = useState(EMPTY_FORM);
  const [editId,setEditId] = useState("");
  const [search,setSearch] = useState("");
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    try {
      const response = await fetch(`${API}?admin=true`);
      const data = await response.json().catch(()=>[]);
      if (!response.ok) throw new Error(data.message || "טעינת המוצרים נכשלה");
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ loadItems(); },[]);

  const filtered = useMemo(()=>{
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item =>
      `${item.name||""} ${item.category||""} ${item.brand||""} ${item.model||""} ${item.condition||""}`
        .toLowerCase().includes(q)
    );
  },[items,search]);

  const update = (name,value) => setForm(current=>({...current,[name]:value}));

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(""); };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      name:item.name||"", category:item.category||"", brand:item.brand||"",
      model:item.model||"", condition:item.condition||"מצב טוב",
      price:item.price??"", oldPrice:item.oldPrice??"", stock:item.stock??1,
      description:item.description||"", imageUrl:item.imageUrl||"",
      websiteUrl:item.websiteUrl||"", active:item.active!==false,
      featured:Boolean(item.featured),
    });
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const saveItem = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return setMessage("❌ חובה להזין שם מוצר");
    if (!form.category) return setMessage("❌ חובה לבחור קטגוריה");
    if (form.price === "" || Number(form.price) < 0) return setMessage("❌ נא להזין מחיר תקין");

    try {
      setSaving(true);
      const payload = {...form, price:Number(form.price||0), oldPrice:Number(form.oldPrice||0), stock:Number(form.stock||0)};
      const response = await fetch(editId ? `${API}/${editId}` : API,{
        method:editId ? "PUT" : "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
      });
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(data.message || "השמירה נכשלה");
      setMessage(editId ? "✅ המוצר עודכן בהצלחה" : "✅ המוצר נוסף בהצלחה");
      resetForm();
      await loadItems();
    } catch(error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`למחוק את "${item.name}"?`)) return;
    try {
      const response = await fetch(`${API}/${item._id}`,{method:"DELETE"});
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(data.message || "המחיקה נכשלה");
      setMessage("🗑️ המוצר נמחק");
      await loadItems();
    } catch(error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <main className="ash-page" dir="rtl">
      <header className="ash-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>♻️ ניהול לוח יד 2</h1>
          <span>הוספה, עריכה, מחיקה, מחירים, מצב ותמונות — כמו בחנות.</span>
        </div>
        <div className="ash-header-actions">
          <Link to="/second-hand">צפייה בלוח יד 2</Link>
          <Link to="/admin">חזרה לפורטל הניהול</Link>
        </div>
      </header>

      {message && <div className="ash-message">{message}</div>}

      <section className="ash-form-card">
        <h2>{editId ? "✏️ עריכת מוצר יד 2" : "➕ הוספת מוצר יד 2"}</h2>
        <form onSubmit={saveItem}>
          <div className="ash-grid">
            <label>שם המוצר *<input value={form.name} onChange={e=>update("name",e.target.value)} required /></label>
            <label>קטגוריה *<select value={form.category} onChange={e=>update("category",e.target.value)} required>
              <option value="">בחר קטגוריה</option>
              {CATEGORIES.map(item=><option key={item}>{item}</option>)}
            </select></label>
            <label>מותג<input value={form.brand} onChange={e=>update("brand",e.target.value)} placeholder="למשל Lenovo" /></label>
            <label>דגם<input value={form.model} onChange={e=>update("model",e.target.value)} placeholder="למשל ThinkPad T14" /></label>
            <label>מצב<select value={form.condition} onChange={e=>update("condition",e.target.value)}>
              {CONDITIONS.map(item=><option key={item}>{item}</option>)}
            </select></label>
            <label>מחיר ₪ *<input type="number" min="0" value={form.price} onChange={e=>update("price",e.target.value)} required /></label>
            <label>מחיר קודם ₪<input type="number" min="0" value={form.oldPrice} onChange={e=>update("oldPrice",e.target.value)} /></label>
            <label>כמות / מלאי<input type="number" min="0" value={form.stock} onChange={e=>update("stock",e.target.value)} /></label>
            <label className="ash-wide">תיאור<textarea rows="4" value={form.description} onChange={e=>update("description",e.target.value)} /></label>
            <label className="ash-wide">קישור לתמונה<input type="url" value={form.imageUrl} onChange={e=>update("imageUrl",e.target.value)} placeholder="https://" /></label>
            {form.imageUrl && <div className="ash-preview ash-wide"><img src={form.imageUrl} alt="תצוגה מקדימה" /></div>}
            <label className="ash-wide">קישור חיצוני / פרטים נוספים<input type="url" value={form.websiteUrl} onChange={e=>update("websiteUrl",e.target.value)} placeholder="https://" /></label>
          </div>

          <div className="ash-checks">
            <label><input type="checkbox" checked={form.active} onChange={e=>update("active",e.target.checked)} /> מוצג בלוח</label>
            <label><input type="checkbox" checked={form.featured} onChange={e=>update("featured",e.target.checked)} /> ⭐ מוצר מומלץ</label>
          </div>

          <div className="ash-form-actions">
            <button type="submit" disabled={saving}>{saving ? "שומר..." : editId ? "💾 שמירת שינויים" : "➕ הוספת מוצר"}</button>
            {editId && <button type="button" className="secondary" onClick={resetForm}>ביטול עריכה</button>}
          </div>
        </form>
      </section>

      <section className="ash-list-card">
        <div className="ash-list-head">
          <h2>מוצרים קיימים ({items.length})</h2>
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="חיפוש ברשימה..." />
        </div>
        {loading && <p className="ash-status">טוען...</p>}
        {!loading && filtered.length===0 && <p className="ash-status">אין מוצרים להצגה.</p>}
        <div className="ash-list-grid">
          {filtered.map(item=>(
            <article className="ash-item" key={item._id}>
              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : <div className="ash-placeholder">♻️</div>}
              <div className="ash-item-body">
                <div className="ash-item-title">
                  <h3>{item.name}</h3>
                  <span className={item.active ? "on" : "off"}>{item.active ? "מוצג" : "מוסתר"}</span>
                </div>
                <p><strong>קטגוריה:</strong> {item.category||"—"}</p>
                {(item.brand||item.model) && <p><strong>מותג / דגם:</strong> {[item.brand,item.model].filter(Boolean).join(" • ")}</p>}
                <p><strong>מצב:</strong> {item.condition||"—"}</p>
                <p><strong>מחיר:</strong> ₪{Number(item.price||0).toLocaleString("he-IL")}</p>
                <p><strong>מלאי:</strong> {item.stock??0}</p>
                {item.featured && <p>⭐ מוצר מומלץ</p>}
                <div className="ash-item-actions">
                  <button type="button" onClick={()=>startEdit(item)}>✏️ עריכה</button>
                  <button type="button" className="delete" onClick={()=>deleteItem(item)}>🗑️ מחיקה</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AdminSecondHand;
