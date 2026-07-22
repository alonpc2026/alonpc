import { useState } from "react";

const links = [
  { title:"ביטוח לאומי", url:"https://www.btl.gov.il", icon:"🏛️" },
  { title:"רשות המיסים", url:"https://www.gov.il/he/departments/tax-authority", icon:"💰" },
  { title:"רשות האוכלוסין וההגירה", url:"https://www.gov.il/he/departments/population_and_immigration_authority", icon:"🆔" },
  { title:"משרד הרישוי", url:"https://www.gov.il/he/departments/topics/driving_and_vehicles", icon:"🚗" },
  { title:"נט המשפט", url:"https://www.court.gov.il", icon:"⚖️" },
  { title:"משטרת ישראל", url:"https://www.gov.il/he/departments/israel_police", icon:"👮" },
  { title:"משרד הבריאות", url:"https://www.gov.il/he/departments/ministry_of_health", icon:"🏥" },
  { title:"משרד החינוך", url:"https://www.gov.il/he/departments/ministry_of_education", icon:"📚" },
  { title:"שירות התעסוקה", url:"https://www.taasuka.gov.il", icon:"💼" },
  { title:"רכבת ישראל", url:"https://www.rail.co.il", icon:"🚆" }
];

export default function Government() {
  const [search,setSearch]=useState("");

  const filtered=links.filter(l=>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="pageContainer" dir="rtl">
      <section className="heroBanner">
        <h1>🏛️ שירותים ממשלתיים</h1>
        <p>גישה מהירה לאתרים רשמיים</p>
      </section>

      <div className="searchBox">
        <input
          placeholder="חיפוש..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      <section className="grid">
        {filtered.map(item=>(
          <article className="card" key={item.title}>
            <h2>{item.icon} {item.title}</h2>
            <a
              className="detailsButton"
              href={item.url}
              target="_blank"
              rel="noreferrer"
            >
              🌐 פתח אתר
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
