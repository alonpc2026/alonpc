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
 return <main className="lr-shell"><section className="lr-auth">
  <div className="lr-logo"><b>LR</b><span>🇮🇱 🇷🇺</span></div>
  <h1>לימוד עברית לדוברי רוסית</h1><h2>Иврит для русскоязычных</h2>
  <div className="lr-mode">
   <button onClick={()=>setMode("login")}>Вход</button><button onClick={()=>setMode("register")}>Регистрация</button><button onClick={()=>setMode("forgot")}>Забыли пароль?</button>
  </div>
  <form onSubmit={submit}>
   {mode==="register"&&<><label>Имя<input name="firstName" onChange={change} required/></label><label>Фамилия<input name="lastName" onChange={change} required/></label><label>Имя пользователя<input name="username" onChange={change} required/></label></>}
   {(mode==="register"||mode==="forgot"||mode==="reset")&&<label>E-mail для восстановления<input name="email" type="email" onChange={change} required/></label>}
   {mode==="login"&&<label>Имя пользователя или e-mail<input name="login" onChange={change} required/></label>}
   {(mode==="login"||mode==="register")&&<label>Пароль — 4 цифры<input name="password" inputMode="numeric" pattern="[0-9]{4}" maxLength="4" onChange={change} required/></label>}
   {mode==="reset"&&<><label>Код из письма<input name="code" inputMode="numeric" onChange={change} required/></label><label>Новый пароль — 4 цифры<input name="password" inputMode="numeric" pattern="[0-9]{4}" maxLength="4" onChange={change} required/></label></>}
   <button className="lr-primary">{mode==="login"?"Войти":mode==="register"?"Зарегистрироваться":mode==="forgot"?"Отправить код":"Изменить пароль"}</button>
  </form>
  {mode==="forgot"&&<button className="lr-link" onClick={()=>setMode("reset")}>У меня уже есть код</button>}
  <p className="lr-message">{msg}</p>
 </section></main>
}