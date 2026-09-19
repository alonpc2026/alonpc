import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LR.css";
const API=(process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api")+"/lr-students";
export default function LRStudentAuth(){
 const nav=useNavigate(),[mode,setMode]=useState("login"),[f,setF]=useState({}),[msg,setMsg]=useState("");
 const change=e=>setF({...f,[e.target.name]:e.target.value});
 const submit=async e=>{e.preventDefault();setMsg("Подождите...");
  const path=mode==="login"?"login":mode==="register"?"register":mode==="forgot"?"forgot":"reset";
  try{const r=await fetch(`${API}/${path}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});const d=await r.json();if(!r.ok)throw Error(d.message);
   if(d.token){localStorage.setItem("lrToken",d.token);localStorage.setItem("lrStudent",JSON.stringify(d.student));nav("/learn-hebrew-russian/course");}
   else setMsg("✅ "+d.message);
  }catch(x){setMsg("❌ "+x.message)}
 };
 return <main className="lr-shell lr-auth-page">
  <section className="lr-auth">
   <div className="lr-auth-head">
    <div className="lr-logo"><b>LR</b><span>🇮🇱 🇷🇺</span></div>
    <div>
     <h1>לימוד עברית לדוברי רוסית</h1>
     <h2>Изучение иврита для русскоязычных</h2>
     <p>לומדים בקצב שלך • Учитесь в своём темпе</p>
    </div>
   </div>

   <div className="lr-mode">
    <button className={mode==="login"?"active":""} type="button" onClick={()=>{setMode("login");setMsg("")}}>כניסה<br/><span>Вход</span></button>
    <button className={mode==="register"?"active":""} type="button" onClick={()=>{setMode("register");setMsg("")}}>הרשמה<br/><span>Регистрация</span></button>
    <button className={mode==="forgot"||mode==="reset"?"active":""} type="button" onClick={()=>{setMode("forgot");setMsg("")}}>שכחתי סיסמה<br/><span>Забыли пароль?</span></button>
   </div>

   <form className="lr-auth-form" onSubmit={submit}>
    {mode==="register"&&<div className="lr-form-grid">
      <label><span>שם פרטי / Имя</span><input name="firstName" onChange={change} required/></label>
      <label><span>שם משפחה / Фамилия</span><input name="lastName" onChange={change} required/></label>
      <label className="wide"><span>שם משתמש / Имя пользователя</span><input name="username" onChange={change} required/></label>
    </div>}
    {(mode==="register"||mode==="forgot"||mode==="reset")&&<label><span>אימייל לשחזור / E-mail для восстановления</span><input name="email" type="email" onChange={change} required/></label>}
    {mode==="login"&&<label><span>שם משתמש או אימייל / Имя пользователя или e-mail</span><input name="login" autoComplete="username" onChange={change} required/></label>}
    {(mode==="login"||mode==="register")&&<label><span>סיסמה – 4 ספרות / Пароль — 4 цифры</span><input name="password" type="password" autoComplete={mode==="login"?"current-password":"new-password"} inputMode="numeric" pattern="[0-9]{4}" maxLength="4" onChange={change} required/></label>}
    {mode==="reset"&&<><label><span>קוד מהמייל / Код из письма</span><input name="code" inputMode="numeric" onChange={change} required/></label><label><span>סיסמה חדשה – 4 ספרות / Новый пароль — 4 цифры</span><input name="password" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength="4" onChange={change} required/></label></>}
    <button className="lr-primary">{mode==="login"?"כניסה / Войти":mode==="register"?"הרשמה / Зарегистрироваться":mode==="forgot"?"שליחת קוד / Отправить код":"שינוי סיסמה / Изменить пароль"}</button>
   </form>
   {mode==="forgot"&&<button className="lr-link" type="button" onClick={()=>setMode("reset")}>כבר יש לי קוד / У меня уже есть код</button>}
   <p className="lr-message" aria-live="polite">{msg}</p>

   <div className="lr-auth-benefits">
    <div><b>🔤 שיעורים מסודרים</b><span>Структурированные уроки</span></div>
    <div><b>🎯 תרגול ומבחנים</b><span>Упражнения и тесты</span></div>
    <div><b>⭐ שמירת התקדמות</b><span>Сохранение прогресса</span></div>
   </div>
  </section>
 </main>
}
