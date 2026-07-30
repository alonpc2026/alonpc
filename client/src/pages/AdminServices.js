import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminServices.css";

const API_BASE = process.env.REACT_APP_API_BASE ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3001/api"
    : "https://alonpc02026.onrender.com/api");
const API = `${API_BASE}/services`;
const CATEGORIES = ["מחשבים","נגישות","בריאות","משפטים","תחבורה","לימודים","עסקים","מסמכים","שונות"];
const DAYS = [
  ["sunday","יום ראשון"],["monday","יום שני"],["tuesday","יום שלישי"],
  ["wednesday","יום רביעי"],["thursday","יום חמישי"],["friday","יום שישי"],["saturday","יום שבת"]
];
const emptyHours = () => Object.fromEntries(DAYS.map(([key]) => [key, { enabled:false, open:"", close:"" }]));
const EMPTY = {
  name:"", category:"נגישות", businessName:"", logoUrl:"", imageUrl:"", description:"",
  address:"", city:"", phone:"", acceptsWhatsApp:false, whatsapp:"", acceptsEmail:false,
  email:"", hasInstagram:false, instagramUrl:"", hasFacebook:false, facebookUrl:"", hasTikTok:false, tiktokUrl:"", hasWaze:false, wazeUrl:"", link:"", openingHours:emptyHours(), openingHoursNote:"",
  supportsSignLanguage:false, supportsTranscription:false, active:true
};
const getToken = () => localStorage.getItem("token") || localStorage.getItem("authToken") || "";
const normalizeHours = (value) => {
  const base = emptyHours();
  if (!value || typeof value !== "object") return base;
  DAYS.forEach(([key]) => {
    const day = value[key] || {};
    base[key] = { enabled:Boolean(day.enabled), open:day.open || "", close:day.close || "" };
  });
  return base;
};

export default function AdminServices() {
  const [services,setServices]=useState([]), [form,setForm]=useState(EMPTY), [editingId,setEditingId]=useState("");
  const [search,setSearch]=useState(""), [categoryFilter,setCategoryFilter]=useState("");
  const [loading,setLoading]=useState(true), [saving,setSaving]=useState(false), [message,setMessage]=useState(""), [error,setError]=useState("");

  const request=useCallback(async(path="",options={})=>{
    const response=await fetch(`${API}${path}`,{...options,headers:{...(options.body?{"Content-Type":"application/json"}:{}),...(getToken()?{Authorization:`Bearer ${getToken()}`}:{})}});
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.message||"הפעולה נכשלה");
    return data;
  },[]);
  const load=useCallback(async()=>{setLoading(true);try{const data=await request();setServices(Array.isArray(data)?data:data.services||[]);setError("")}catch(e){setError(e.message);setServices([])}finally{setLoading(false)}},[request]);
  useEffect(()=>{load()},[load]);
  const filtered=useMemo(()=>{const q=search.trim().toLowerCase();return services.filter(i=>{const h=`${i.name||""} ${i.businessName||""} ${i.category||""} ${i.city||""} ${i.description||""}`.toLowerCase();return(!q||h.includes(q))&&(!categoryFilter||i.category===categoryFilter)})},[services,search,categoryFilter]);
  const change=e=>{const{name,value,checked,type}=e.target;setForm(f=>({...f,[name]:type==="checkbox"?checked:value}))};
  const changeDay=(key,field,value)=>setForm(f=>({...f,openingHours:{...f.openingHours,[key]:{...f.openingHours[key],[field]:value}}}));
  const reset=()=>{setEditingId("");setForm({...EMPTY,openingHours:emptyHours()})};
  const edit=i=>{setEditingId(i._id);setForm({...EMPTY,...i,openingHours:normalizeHours(i.openingHours),acceptsWhatsApp:Boolean(i.acceptsWhatsApp),acceptsEmail:Boolean(i.acceptsEmail),hasInstagram:Boolean(i.hasInstagram),hasFacebook:Boolean(i.hasFacebook),hasTikTok:Boolean(i.hasTikTok),hasWaze:Boolean(i.hasWaze),supportsSignLanguage:Boolean(i.supportsSignLanguage),supportsTranscription:Boolean(i.supportsTranscription),active:i.active!==false});window.scrollTo({top:0,behavior:"smooth"})};
  const submit=async e=>{e.preventDefault();setSaving(true);setMessage("");setError("");try{
    if(!form.name.trim()) throw new Error("חובה להזין שם שירות");
    for(const [key,label] of DAYS){const d=form.openingHours[key];if(d.enabled&&(!d.open||!d.close))throw new Error(`יש לבחור שעת פתיחה וסגירה עבור ${label}`)}
    const payload={...form,name:form.name.trim(),businessName:form.businessName.trim(),description:form.description.trim(),address:form.address.trim(),city:form.city.trim(),phone:form.phone.trim(),whatsapp:form.acceptsWhatsApp?form.whatsapp.trim():"",email:form.acceptsEmail?form.email.trim():"",instagramUrl:form.hasInstagram?form.instagramUrl.trim():"",facebookUrl:form.hasFacebook?form.facebookUrl.trim():"",tiktokUrl:form.hasTikTok?form.tiktokUrl.trim():"",wazeUrl:form.hasWaze?form.wazeUrl.trim():"",link:form.link.trim(),openingHoursNote:form.openingHoursNote.trim(),imageUrl:(form.imageUrl||form.logoUrl).trim(),logoUrl:(form.logoUrl||form.imageUrl).trim()};
    await request(editingId?`/${editingId}`:"",{method:editingId?"PUT":"POST",body:JSON.stringify(payload)});setMessage(editingId?"השירות עודכן בהצלחה":"השירות נוסף בהצלחה");reset();await load()
  }catch(e){setError(e.message)}finally{setSaving(false)}};
  const remove=async i=>{if(!window.confirm(`האם למחוק את "${i.name}"?`))return;try{await request(`/${i._id}`,{method:"DELETE"});setMessage("השירות נמחק בהצלחה");await load()}catch(e){setError(e.message)}};

  return <main className="admin-services-page" dir="rtl">
    <header className="admin-services-header"><div><p>♿ אזור מנהל</p><h1>ניהול עסקים נותני שירות</h1><span>פרטי העסק, קשר, נגישות וימי ושעות פתיחה.</span></div><div><Link to="/services">צפייה בשירותים</Link><Link to="/admin">חזרה לניהול</Link></div></header>
    {message&&<div className="admin-services-message">{message}</div>}{error&&<div className="admin-services-message error">{error}</div>}
    <section className="admin-services-form-card"><h2>{editingId?"עריכת שירות":"הוספת שירות נגיש"}</h2><form onSubmit={submit}>
      <div className="admin-services-row"><label>שם השירות *<input name="name" value={form.name} onChange={change} required/></label><label>קטגוריה *<select name="category" value={form.category} onChange={change}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label></div>
      <label>שם העסק<input name="businessName" value={form.businessName} onChange={change}/></label>
      <div className="admin-services-row"><label>קישור לוגו<input type="url" name="logoUrl" value={form.logoUrl} onChange={change}/></label><label>קישור תמונה<input type="url" name="imageUrl" value={form.imageUrl} onChange={change}/></label></div>
      <label>תיאור העסק<textarea name="description" value={form.description} onChange={change}/></label>
      <div className="admin-services-row"><label>כתובת<input name="address" value={form.address} onChange={change}/></label><label>עיר<input name="city" value={form.city} onChange={change}/></label></div>
      <div className="admin-services-row"><label>טלפון<input name="phone" value={form.phone} onChange={change}/></label><label>כתובת אתר<input type="url" name="link" value={form.link} onChange={change}/></label></div>
      <fieldset><legend>ימי ושעות פתיחה</legend><div className="opening-hours-editor">{DAYS.map(([key,label])=><div className="opening-hours-row" key={key}><label className="admin-services-checkbox"><input type="checkbox" checked={form.openingHours[key].enabled} onChange={e=>changeDay(key,"enabled",e.target.checked)}/>{label}</label><label>פתיחה<input type="time" disabled={!form.openingHours[key].enabled} value={form.openingHours[key].open} onChange={e=>changeDay(key,"open",e.target.value)}/></label><label>סגירה<input type="time" disabled={!form.openingHours[key].enabled} value={form.openingHours[key].close} onChange={e=>changeDay(key,"close",e.target.value)}/></label></div>)}</div><label>הערה לשעות פתיחה<textarea name="openingHoursNote" value={form.openingHoursNote} onChange={change} placeholder="לדוגמה: בערבי חג יש לבדוק באתר"/></label></fieldset>
      <fieldset><legend>אפשרויות קשר ונגישות</legend><label className="admin-services-checkbox"><input type="checkbox" name="acceptsWhatsApp" checked={form.acceptsWhatsApp} onChange={change}/>מקבל WhatsApp</label>{form.acceptsWhatsApp&&<input name="whatsapp" value={form.whatsapp} onChange={change} placeholder="מספר WhatsApp"/>}<label className="admin-services-checkbox"><input type="checkbox" name="acceptsEmail" checked={form.acceptsEmail} onChange={change}/>מקבל דואר אלקטרוני</label>{form.acceptsEmail&&<input type="email" name="email" value={form.email} onChange={change} placeholder="דואר אלקטרוני"/>}<label className="admin-services-checkbox"><input type="checkbox" name="supportsSignLanguage" checked={form.supportsSignLanguage} onChange={change}/>שפת סימנים</label><label className="admin-services-checkbox"><input type="checkbox" name="supportsTranscription" checked={form.supportsTranscription} onChange={change}/>תמלול</label><label className="admin-services-checkbox"><input type="checkbox" name="active" checked={form.active} onChange={change}/>פעיל ומוצג באתר</label></fieldset>
      <fieldset className="admin-services-social-fieldset">
        <legend>רשתות חברתיות וניווט</legend>

        <div className="admin-services-social-option instagram-option">
          <label className="admin-services-checkbox">
            <input type="checkbox" name="hasInstagram" checked={form.hasInstagram} onChange={change}/>
            יש לעסק Instagram
          </label>
          {form.hasInstagram&&<label>קישור Instagram<input type="url" name="instagramUrl" value={form.instagramUrl} onChange={change} placeholder="https://www.instagram.com/..."/></label>}
        </div>

        <div className="admin-services-social-option facebook-option">
          <label className="admin-services-checkbox">
            <input type="checkbox" name="hasFacebook" checked={form.hasFacebook} onChange={change}/>
            יש לעסק Facebook
          </label>
          {form.hasFacebook&&<label>קישור Facebook<input type="url" name="facebookUrl" value={form.facebookUrl} onChange={change} placeholder="https://www.facebook.com/..."/></label>}
        </div>

        <div className="admin-services-social-option tiktok-option">
          <label className="admin-services-checkbox">
            <input type="checkbox" name="hasTikTok" checked={form.hasTikTok} onChange={change}/>
            יש לעסק TikTok
          </label>
          {form.hasTikTok&&<label>קישור TikTok<input type="url" name="tiktokUrl" value={form.tiktokUrl} onChange={change} placeholder="https://www.tiktok.com/@..."/></label>}
        </div>

        <div className="admin-services-social-option waze-option">
          <label className="admin-services-checkbox">
            <input type="checkbox" name="hasWaze" checked={form.hasWaze} onChange={change}/>
            יש לעסק קישור Waze
          </label>
          {form.hasWaze&&<label>קישור Waze<input type="url" name="wazeUrl" value={form.wazeUrl} onChange={change} placeholder="https://waze.com/ul?..."/></label>}
        </div>
      </fieldset>

      <div className="admin-services-actions"><button disabled={saving}>{saving?"שומר...":editingId?"💾 שמור עריכה":"➕ הוסף שירות"}</button>{editingId&&<button type="button" className="secondary" onClick={reset}>ביטול</button>}</div>
    </form></section>
    <section className="admin-services-list-card"><h2>שירותים קיימים</h2><div className="admin-services-tools"><input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="חיפוש"/><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option value="">כל הקטגוריות</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>{loading?<p>טוען...</p>:<div className="admin-services-grid">{filtered.map(i=><article key={i._id}><div><h3>{i.name}</h3><p>{i.businessName}</p><p>📍 {i.city}</p><div className="admin-services-actions"><button onClick={()=>edit(i)}>עריכה</button><button className="danger" onClick={()=>remove(i)}>מחיקה</button></div></div></article>)}</div>}</section>
  </main>;
}
