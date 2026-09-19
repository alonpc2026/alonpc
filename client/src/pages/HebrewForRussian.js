import { useMemo, useState } from "react";
import "./HebrewForRussian.css";

const alphabet = [
["א","алеф","אבא","папа"],["ב","бет","בית","дом"],["ג","гимель","גן","сад"],["ד","далет","דג","рыба"],
["ה","хей","הר","гора"],["ו","вав","ורד","роза"],["ז","заин","זמן","время"],["ח","хет","חלב","молоко"],
["ט","тет","טלפון","телефон"],["י","йод","ילד","ребёнок"],["כ","каф","כלב","собака"],["ל","ламед","לחם","хлеб"],
["מ","мем","מים","вода"],["נ","нун","נעל","обувь"],["ס","самех","ספר","книга"],["ע","аин","עיר","город"],
["פ","пей","פה","рот"],["צ","цади","צבע","цвет"],["ק","куф","קפה","кофе"],["ר","реш","ראש","голова"],
["ש","шин","שלום","привет"],["ת","тав","תודה","спасибо"]
];

const words = [
["שלום","привет / мир"],["תודה","спасибо"],["בבקשה","пожалуйста"],["כן","да"],["לא","нет"],["מים","вода"],
["אוכל","еда"],["בית","дом"],["עבודה","работа"],["כסף","деньги"],["רופא","врач"],["תרופה","лекарство"],
["בית חולים","больница"],["עזרה","помощь"],["אוטובוס","автобус"],["תחנה","остановка"],["חנות","магазин"],
["משפחה","семья"],["בוקר","утро"],["ערב","вечер"],["היום","сегодня"],["מחר","завтра"],["ימין","направо"],["שמאל","налево"]
];

const sentences = [
["מה שלומך?","Как дела?"],["אני לא מבין/ה","Я не понимаю"],["אפשר לכתוב לי בבקשה?","Напишите мне, пожалуйста"],
["אפשר לעזור לי?","Можете мне помочь?"],["כמה זה עולה?","Сколько это стоит?"],["איפה התחנה?","Где остановка?"],
["אני צריך/ה רופא","Мне нужен врач"],["אני רוצה מים","Я хочу воды"],["אני מחפש/ת עבודה","Я ищу работу"],
["יש לי פגישה היום","У меня сегодня встреча"],["באיזו שעה זה מתחיל?","Во сколько это начинается?"],
["אני רוצה לקבוע תור","Я хочу записаться на приём"],["איפה אפשר לקנות כרטיס?","Где можно купить билет?"],
["תודה רבה","Большое спасибо"],["להתראות","До свидания"]
];

const quizzes = [
 {title:"מבחן 1 — מילים / Слова", items:[
  ["מה פירוש „מים”?",["вода","дом","работа"],0],["איך אומרים спасибо?",["שלום","תודה","בבקשה"],1],
  ["איך אומרים дом?",["בית","עיר","חנות"],0],["מה פירוש „רופא”?",["учитель","врач","водитель"],1]
 ]},
 {title:"מבחן 2 — משפטים / Фразы", items:[
  ["מה פירוש „כמה זה עולה?”",["Где это?","Сколько это стоит?","Когда это?"],1],
  ["איך אומרים „Я не понимаю”?",["אני לא מבין/ה","אני רוצה מים","מה שלומך?"],0],
  ["מה פירוש „איפה התחנה?”",["Где остановка?","Где врач?","Где дом?"],0],
  ["איך אומרים „Большое спасибо”?",["שלום","בבקשה","תודה רבה"],2]
 ]}
];

const spelling=[["вода","מים"],["спасибо","תודה"],["дом","בית"],["работа","עבודה"],["помощь","עזרה"],["врач","רופא"],["магазин","חנות"],["привет","שלום"]];

export default function HebrewForRussian(){
 const [tab,setTab]=useState("alphabet");
 const [quizNo,setQuizNo]=useState(0);
 const [answers,setAnswers]=useState({});
 const [spell,setSpell]=useState({});
 const quiz=quizzes[quizNo];
 const qScore=useMemo(()=>quiz.items.reduce((n,x,i)=>n+(Number(answers[i])===x[2]?1:0),0),[answers,quiz]);
 const sScore=useMemo(()=>spelling.reduce((n,x,i)=>n+((spell[i]||"").trim()===x[1]?1:0),0),[spell]);

 return <main className="hr-page" dir="rtl">
  <header className="hr-hero"><div>🇮🇱 🇷🇺</div><h1>לימוד עברית לדוברי רוסית</h1><p>Изучение иврита для русскоязычных</p><strong>מהאלף־בית ועד עברית שימושית ומבחנים</strong></header>
  <div className="hr-tabs">
   <button className={tab==="alphabet"?"active":""} onClick={()=>setTab("alphabet")}>🔤 <b>שלב 1</b><small>אלף־בית<br/>Алфавит</small></button>
   <button className={tab==="words"?"active":""} onClick={()=>setTab("words")}>🧩 <b>שלב 2</b><small>מילים בסיסיות<br/>Основные слова</small></button>
   <button className={tab==="sentences"?"active":""} onClick={()=>setTab("sentences")}>💬 <b>שלב 3</b><small>משפטים חשובים<br/>Важные фразы</small></button>
   <button className={tab==="quiz"?"active":""} onClick={()=>setTab("quiz")}>📝 <b>שלב 4</b><small>מבחני ידע<br/>Тесты</small></button>
   <button className={tab==="spelling"?"active":""} onClick={()=>setTab("spelling")}>✍️ <b>שלב 5</b><small>מבחן איות<br/>Правописание</small></button>
  </div>

  {tab==="alphabet" && <section className="hr-panel"><h2>🔤 אלף־בית / Алфавит</h2><div className="hr-grid alphabet">{alphabet.map((x,i)=><article key={i}><strong>{x[0]}</strong><b>{x[1]}</b><span>{x[2]} — {x[3]}</span></article>)}</div></section>}
  {tab==="words" && <section className="hr-panel"><h2>🧩 מילים בסיסיות / Основные слова</h2><div className="hr-grid">{words.map((x,i)=><article key={i}><strong>{x[0]}</strong><span>{x[1]}</span></article>)}</div></section>}
  {tab==="sentences" && <section className="hr-panel"><h2>💬 משפטים חשובים / Важные фразы</h2><div className="hr-grid sentences">{sentences.map((x,i)=><article key={i}><strong>{x[0]}</strong><span>{x[1]}</span></article>)}</div></section>}
  {tab==="quiz" && <section className="hr-panel">
    <div className="hr-test-switch">{quizzes.map((q,i)=><button className={quizNo===i?"selected":""} onClick={()=>{setQuizNo(i);setAnswers({})}} key={i}>מבחן {i+1}</button>)}</div>
    <h2>{quiz.title}</h2>
    {quiz.items.map((q,i)=><div className="hr-question" key={i}><h3>{i+1}. {q[0]}</h3><div>{q[1].map((o,j)=><button key={j} className={Number(answers[i])===j?"selected":""} onClick={()=>setAnswers(a=>({...a,[i]:j}))}>{o}</button>)}</div></div>)}
    <div className="hr-score">ציון / Оценка: {qScore} / {quiz.items.length}</div>
  </section>}
  {tab==="spelling" && <section className="hr-panel"><h2>✍️ מבחן איות / Тест правописания</h2><p className="hr-help">כתוב את המילה בעברית לפי המילה ברוסית.</p>
   {spelling.map((x,i)=><label className="hr-spell" key={i}><b>{i+1}. {x[0]}</b><input value={spell[i]||""} onChange={e=>setSpell(s=>({...s,[i]:e.target.value}))} placeholder="כתוב בעברית"/></label>)}
   <div className="hr-score">ציון / Оценка: {sScore} / {spelling.length}</div>
  </section>}
 </main>;
}
