import { useMemo,useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LR.css";
const API=(process.env.REACT_APP_API_BASE||"https://alonpc02026.onrender.com/api")+"/lr-students";
const stages=[
["🔤","Алфавит / אלף־בית"],["🧩","Основные слова / מילים בסיסיות"],["💬","Важные фразы / משפטים חשובים"],
["🔢","Числа и время / מספרים ושעות"],["📅","Дни и даты / ימים ותאריכים"],["🛒","Магазин и транспорт / קניות ותחבורה"],
["🩺","Врач и повседневная жизнь / רופא וחיי יום־יום"],["💼","Работа, банк и учреждения / עבודה, בנק ומשרדים"],["🏆","Итоговый тест / מבחן מסכם"]];
const lessons=[
[["א","алеф"],["ב","бет"],["ג","гимель"],["ד","далет"],["ה","хей"],["ו","вав"],["ז","заин"],["ח","хет"],["ט","тет"],["י","йод"],["כ","каф"],["ל","ламед"],["מ","мем"],["נ","нун"],["ס","самех"],["ע","аин"],["פ","пей"],["צ","цади"],["ק","куф"],["ר","реш"],["ש","шин"],["ת","тав"]],
[["שלום","привет"],["תודה","спасибо"],["בבקשה","пожалуйста"],["מים","вода"],["אוכל","еда"],["בית","дом"],["עבודה","работа"],["עזרה","помощь"]],
[["מה שלומך?","Как дела?"],["אני לא מבין/ה","Я не понимаю"],["אפשר לעזור לי?","Можете мне помочь?"],["כמה זה עולה?","Сколько это стоит?"],["איפה התחנה?","Где остановка?"]],
[["אחד","один"],["שתיים","два"],["שלוש","три"],["עשר","десять"],["מאה","сто"],["מה השעה?","Который час?"],["השעה שמונה","Восемь часов"]],
[["היום","сегодня"],["מחר","завтра"],["אתמול","вчера"],["יום ראשון","воскресенье"],["יום שני","понедельник"],["באיזה תאריך?","Какого числа?"]],
[["כמה זה עולה?","Сколько стоит?"],["אני רוצה לקנות","Я хочу купить"],["איפה האוטובוס?","Где автобус?"],["כרטיס בבקשה","Билет, пожалуйста"],["ימין","направо"],["שמאל","налево"]],
[["אני צריך/ה רופא","Мне нужен врач"],["בית חולים","больница"],["בית מרקחת","аптека"],["כואב לי","У меня болит"],["איפה השירותים?","Где туалет?"]],
[["אני מחפש/ת עבודה","Я ищу работу"],["יש לי פגישה","У меня встреча"],["בנק","банк"],["חשבון","счёт"],["תעודה","документ"],["אפשר לכתוב לי?","Напишите мне, пожалуйста"]],
];
const finalQ=[
["Что означает „תודה”?",["спасибо","дом","врач"],0],["Как сказать «вода»?",["עבודה","מים","עזרה"],1],
["Что означает „כמה זה עולה?”",["Сколько стоит?","Где врач?","Как дела?"],0],["Как сказать «Мне нужен врач»?",["אני רוצה מים","אני צריך/ה רופא","איפה התחנה?"],1],
["Что означает „מחר”?",["вчера","сегодня","завтра"],2],["Как сказать «банк»?",["בנק","בית","חנות"],0],
["Что означает „עבודה”?",["работа","еда","вода"],0],["Как сказать «помощь»?",["עיר","עזרה","אוכל"],1],
["Что означает „איפה התחנה?”",["Где остановка?","Где дом?","Где магазин?"],0],["Как сказать «Большое спасибо»?",["תודה רבה","שלום","בבקשה"],0]];
export default function LRLearn(){
 const nav=useNavigate(),student=JSON.parse(localStorage.getItem("lrStudent")||"null"),[stage,setStage]=useState(student?.currentStage||1),[ans,setAns]=useState({});
 const score=useMemo(()=>Math.round(finalQ.reduce((n,q,i)=>n+(Number(ans[i])===q[2]?1:0),0)/finalQ.length*100),[ans]);
 if(!localStorage.getItem("lrToken")){setTimeout(()=>nav("/learn-hebrew-russian"),0);return null}
 const rating=score>=90?"מצוין / Отлично 🏆😄":score>=75?"טוב מאוד / Очень хорошо 🌟🙂":score>=60?"טוב / Хорошо 👍😊":"כדאי לתרגל עוד / Нужно ещё потренироваться 📚💪";
 const save=async(completed=false,s=100)=>{try{const r=await fetch(API+"/progress",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer "+localStorage.getItem("lrToken")},body:JSON.stringify({stage,score:s,completed})});const d=await r.json();if(r.ok)localStorage.setItem("lrStudent",JSON.stringify(d));}catch{}};
 const next=()=>{save(true,100);setStage(x=>Math.min(9,x+1));window.scrollTo(0,0)};
 return <main className="lr-course">
  <header className="lr-course-head"><div className="lr-logo small"><b>LR</b><span>🇮🇱 🇷🇺</span></div><div><h1>לימוד עברית לדוברי רוסית</h1><p>Иврит для русскоязычных</p></div><button onClick={()=>{localStorage.removeItem("lrToken");localStorage.removeItem("lrStudent");nav("/learn-hebrew-russian")}}>Выход</button></header>
  <div className="lr-stagebar">{stages.map((x,i)=><button className={stage===i+1?"on":""} onClick={()=>setStage(i+1)} key={i}>{x[0]}<b>{i+1}</b><small>{x[1]}</small></button>)}</div>
  <section className="lr-lesson"><h2>{stages[stage-1][0]} Этап {stage} — {stages[stage-1][1]}</h2>
   {stage<9?<><div className="lr-cards">{lessons[stage-1].map((x,i)=><article key={i}><strong dir="rtl">{x[0]}</strong><span>{x[1]}</span></article>)}</div><button className="lr-next" onClick={next}>Готово — следующий этап ←</button></>:
   <><p className="lr-explain">Итоговый тест / מבחן מסכם</p>{finalQ.map((q,i)=><div className="lr-q" key={i}><h3>{i+1}. {q[0]}</h3>{q[1].map((o,j)=><button className={Number(ans[i])===j?"chosen":""} onClick={()=>setAns({...ans,[i]:j})} key={j}>{o}</button>)}</div>)}<div className="lr-final"><b>{score}/100</b><span>{rating}</span><button onClick={()=>save(true,score)}>Сохранить результат / שמור ציון</button></div></>}
  </section>
 </main>
}