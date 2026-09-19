import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LR.css";

const API = "https://alonpc02026.onrender.com/api/lr-students";

const letters = [
["א","Алеф","אבא"],["ב","Бет","בית"],["ג","Гимель","גן"],["ד","Далет","דלת"],
["ה","Хей","הר"],["ו","Вав","ורד"],["ז","Заин","זמן"],["ח","Хет","חלב"],
["ט","Тет","טלפון"],["י","Йод","ילד"],["כ","Каф","כדור"],["ל","Ламед","לחם"],
["מ","Мем","מים"],["נ","Нун","נר"],["ס","Самех","ספר"],["ע","Аин","עין"],
["פ","Пей","פה"],["צ","Цади","צבע"],["ק","Куф","קפה"],["ר","Реш","ראש"],
["ש","Шин","שלום"],["ת","Тав","תודה"]
];

const greetings = [
["שלום","Привет / Здравствуйте"],["בוקר טוב","Доброе утро"],["ערב טוב","Добрый вечер"],
["מה שלומך?","Как дела?"],["תודה","Спасибо"],["בבקשה","Пожалуйста"],["להתראות","До свидания"]
];

const stages = [
"אותיות / Буквы","מילים בסיסיות / Основные слова","ברכות והבעה / Приветствия",
"מספרים וזמן / Числа и время","ימים ותאריכים / Дни и даты","קניות ותחבורה / Покупки и транспорт",
"רופא וחיי יום-יום / Врач и быт","עבודה, בנק ומשרדים / Работа, банк, учреждения","מבחן סופי / Итоговый тест"
];

function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }
function makeLetterQuiz(){
 return shuffle(letters).slice(0,12).map((x,i)=>{
   const reverse=i%2===1;
   const wrong=shuffle(letters.filter(y=>y[0]!==x[0])).slice(0,3);
   return {q:reverse?`איזו אות היא ${x[1]}? / Какая буква — ${x[1]}?`:`מה שם האות ${x[0]}? / Как называется буква ${x[0]}?`,
   answer:reverse?x[0]:x[1], options:shuffle([x,...wrong].map(y=>reverse?y[0]:y[1]))};
 });
}

export default function LRLearn(){
 const nav=useNavigate();
 const token=localStorage.getItem("lrToken");
 const student=JSON.parse(localStorage.getItem("lrStudent")||"{}");
 const [stage,setStage]=useState(Number(student.currentStage||1));
 const [mode,setMode]=useState("learn");
 const [quiz,setQuiz]=useState([]);
 const [answers,setAnswers]=useState({});
 const [result,setResult]=useState(null);

 useEffect(()=>{ if(!token) nav("/learn-hebrew-russian",{replace:true}); },[token,nav]);
 const progress=useMemo(()=>Math.round(((stage-1)/9)*100),[stage]);
 if(!token) return null;

 const saveProgress=async(nextStage,score)=>{
   try{
    const r=await fetch(`${API}/progress`,{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
      body:JSON.stringify({currentStage:nextStage,completedStage:stage,score})});
    const d=await r.json();
    if(r.ok && d.student) localStorage.setItem("lrStudent",JSON.stringify(d.student));
   }catch(e){}
 };

 const startQuiz=()=>{setQuiz(makeLetterQuiz());setAnswers({});setResult(null);setMode("test");};
 const finishQuiz=async()=>{
   let good=0; quiz.forEach((q,i)=>{if(answers[i]===q.answer) good++;});
   const score=Math.round(good/quiz.length*100); setResult(score);
   if(score>=75){await saveProgress(Math.max(stage+1,2),score);}
 };
 const next=async()=>{ const n=Math.min(9,stage+1); await saveProgress(n,100); setStage(n);setMode("learn"); };

 return <div className="lr-shell" dir="rtl">
  <header className="lr-hero">
   <div className="lr-logo">LR <span>🇮🇱 🇷🇺</span></div>
   <div><h1>עברית לדוברי רוסית</h1><p>Иврит для русскоязычных</p></div>
   <button className="lr-logout" onClick={()=>{localStorage.removeItem("lrToken");localStorage.removeItem("lrStudent");nav("/learn-hebrew-russian")}}>יציאה / Выход</button>
  </header>
  <section className="lr-progress-card">
   <b>{student.firstName} {student.lastName}</b><span>שלב {stage} מתוך 9 / Этап {stage} из 9</span>
   <div className="lr-progress"><i style={{width:`${progress}%`}} /></div>
  </section>

  <div className="lr-stage-strip">{stages.map((s,i)=><button key={s} disabled={i+1>stage} className={i+1===stage?"active":""}
   onClick={()=>{if(i+1<=stage){setStage(i+1);setMode("learn");}}}>{i+1>stage?"🔒":"✓"} {i+1}. {s}</button>)}</div>

  {stage===1 && mode==="learn" && <main className="lr-card">
   <h2>🔤 לימוד האותיות / Изучение букв</h2>
   <p>עברו על האותיות, השם ברוסית ודוגמה בעברית.</p>
   <div className="lr-letter-grid">{letters.map(x=><div className="lr-letter" key={x[0]}><strong>{x[0]}</strong><b>{x[1]}</b><span>{x[2]}</span></div>)}</div>
   <button className="lr-primary" onClick={()=>setMode("practice1")}>תרגול 1 / Упражнение 1</button>
  </main>}

  {stage===1 && mode==="practice1" && <PracticeOne onNext={()=>setMode("practice2")} />}
  {stage===1 && mode==="practice2" && <PracticeTwo onNext={startQuiz} />}

  {stage===1 && mode==="test" && <main className="lr-card">
   <h2>🧠 מבחן תפיסה – אותיות / Тест на распознавание букв</h2>
   <p>12 שאלות משתנות. צריך לפחות 75 כדי לפתוח את השלב הבא.</p>
   {quiz.map((q,i)=><div className="lr-question" key={i}><h3>{i+1}. {q.q}</h3>
    <div className="lr-options">{q.options.map(o=><button key={o} className={answers[i]===o?"selected":""} onClick={()=>setAnswers({...answers,[i]:o})}>{o}</button>)}</div>
   </div>)}
   {!result && <button disabled={Object.keys(answers).length<quiz.length} className="lr-primary" onClick={finishQuiz}>סיום מבחן / Завершить тест</button>}
   {result!==null && <div className={result>=75?"lr-success":"lr-retry"}><h2>ציון: {result}/100</h2>
    <p>{result>=75?"כל הכבוד! Отлично! שלב 2 נפתח.":"כדאי לתרגל שוב. Попробуйте ещё раз."}</p>
    {result>=75?<button className="lr-primary" onClick={()=>{setStage(2);setMode("learn")}}>לשלב 2 / Этап 2</button>:<button className="lr-primary" onClick={()=>setMode("learn")}>חזרה ללימוד / Повторить</button>}
   </div>}
  </main>}

  {stage>1 && <main className="lr-card">
   <h2>{stages[stage-1]}</h2>
   {stage===3?<><h3>👋 ברכות / Приветствия</h3><div className="lr-phrase-grid">{greetings.map(g=><div><b>{g[0]}</b><span>{g[1]}</span></div>)}</div>
   <h3>❓ שאלה / Вопрос</h3><div className="lr-question"><b>מה אומרים כשפוגשים מישהו?</b><div className="lr-options"><button>שלום</button><button>לילה טוב</button><button>סליחה</button></div></div></>
   :<><p>📚 לימוד → ✍️ תרגול → ❓ שאלות → 📝 מבחן קצר</p><p>התוכן בשלב זה מוצג בעברית וברוסית ונשמר בחשבון התלמיד.</p></>}
   {stage<9 && <button className="lr-primary" onClick={next}>סיימתי – לשלב הבא / Далее</button>}
  </main>}
 </div>
}

function PracticeOne({onNext}){
 const items=useMemo(()=>shuffle(letters).slice(0,10),[]);
 const [i,setI]=useState(0); const [pick,setPick]=useState("");
 const x=items[i]; const opts=useMemo(()=>shuffle([x,...shuffle(letters.filter(y=>y[0]!==x[0])).slice(0,3)]).map(y=>y[1]),[x]);
 return <main className="lr-card"><h2>🎯 תרגול 1 – זיהוי אות / Узнай букву</h2><div className="lr-big-letter">{x[0]}</div>
 <p>בחר את שם האות / Выберите название буквы</p><div className="lr-options">{opts.map(o=><button className={pick===o?(o===x[1]?"correct":"wrong"):""} onClick={()=>setPick(o)}>{o}</button>)}</div>
 {pick===x[1] && (i<items.length-1?<button className="lr-primary" onClick={()=>{setI(i+1);setPick("")}}>הבא / Далее</button>:<button className="lr-primary" onClick={onNext}>לתרגול 2 / Упражнение 2</button>)}</main>
}
function PracticeTwo({onNext}){
 const items=useMemo(()=>shuffle(letters).slice(0,10),[]);
 const [i,setI]=useState(0); const [pick,setPick]=useState(""); const x=items[i];
 const opts=useMemo(()=>shuffle([x,...shuffle(letters.filter(y=>y[0]!==x[0])).slice(0,3)]).map(y=>y[0]),[x]);
 return <main className="lr-card"><h2>⚡ תרגול 2 – תפיסה מהירה / Быстрое распознавание</h2><div className="lr-russian-name">{x[1]}</div>
 <p>מצא את האות העברית / Найдите букву</p><div className="lr-options lr-letter-options">{opts.map(o=><button className={pick===o?(o===x[0]?"correct":"wrong"):""} onClick={()=>setPick(o)}>{o}</button>)}</div>
 {pick===x[0] && (i<items.length-1?<button className="lr-primary" onClick={()=>{setI(i+1);setPick("")}}>הבא / Далее</button>:<button className="lr-primary" onClick={onNext}>למבחן / К тесту</button>)}</main>
}
