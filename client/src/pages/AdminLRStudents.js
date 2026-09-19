import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import "./LR.css";
const API=(process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api")+"/lr-students/admin/students";
export default function AdminLRStudents(){
 const [data,setData]=useState({count:0,students:[]}),[msg,setMsg]=useState("טוען...");
 useEffect(()=>{fetch(API,{headers:{Authorization:"Bearer "+localStorage.getItem("token")}}).then(r=>r.json()).then(d=>{setData(d);setMsg("")}).catch(()=>setMsg("שגיאה בטעינת תלמידים"))},[]);
 return <main className="lr-admin" dir="rtl"><Link to="/admin">← חזרה לניהול</Link><h1>🎓 תלמידי LR</h1><div className="lr-count">מספר תלמידים רשומים: <b>{data.count}</b></div>{msg&&<p>{msg}</p>}<div className="lr-table-wrap"><table><thead><tr><th>שם</th><th>שם משתמש</th><th>אימייל</th><th>שלב</th><th>ציון מסכם</th><th>הרשמה</th></tr></thead><tbody>{data.students.map(s=><tr key={s._id}><td>{s.firstName} {s.lastName}</td><td>{s.username}</td><td>{s.email}</td><td>{s.currentStage}/9</td><td>{s.finalScore||0}</td><td>{new Date(s.createdAt).toLocaleDateString("he-IL")}</td></tr>)}</tbody></table></div></main>
}