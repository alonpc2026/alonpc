import { useMemo, useState } from "react";
import "./Government.css";

const links = [
  { title: "ביטוח לאומי", url: "https://www.btl.gov.il", icon: "🏦", category: "זכויות וקצבאות" },
  { title: "רשות המיסים", url: "https://www.gov.il/he/departments/tax-authority", icon: "💰", category: "מיסים" },
  { title: "רשות האוכלוסין וההגירה", url: "https://www.gov.il/he/departments/population_and_immigration_authority", icon: "🆔", category: "אוכלוסין והגירה" },
  { title: "משרד התחבורה והרישוי", url: "https://www.gov.il/he/departments/topics/driving_and_vehicles", icon: "🚗", category: "תחבורה" },
  { title: "נט המשפט", url: "https://www.court.gov.il", icon: "⚖️", category: "משפט" },
  { title: "משטרת ישראל", url: "https://www.gov.il/he/departments/israel_police", icon: "👮", category: "ביטחון" },
  { title: "משרד הבריאות", url: "https://www.gov.il/he/departments/ministry_of_health", icon: "🏥", category: "בריאות" },
  { title: "משרד החינוך", url: "https://www.gov.il/he/departments/ministry_of_education", icon: "📚", category: "חינוך" },
  { title: "שירות התעסוקה", url: "https://www.taasuka.gov.il", icon: "💼", category: "תעסוקה" },
  { title: "רכבת ישראל", url: "https://www.rail.co.il", icon: "🚆", category: "תחבורה ציבורית" },
  { title: "gov.il", url: "https://www.gov.il", icon: "🏛️", category: "ממשל" }
];

export default function Government() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return links;

    return links.filter((item) =>
      `${item.title} ${item.category}`.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <main className="gov-page" dir="rtl">
      <section className="gov-hero">
        <span aria-hidden="true">🏛️</span>
        <div>
          <h1>שירותי ממשלה</h1>
          <p>משרדי ממשלה, רשויות וגופים ציבוריים במקום אחד.</p>
        </div>
      </section>

      <div className="gov-search">
        <input
          type="search"
          placeholder="🔎 חיפוש משרד, רשות או גוף ציבורי..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section className="gov-grid">
        {filtered.map((item) => (
          <article className="gov-card" key={item.title}>
            <span className="gov-icon" aria-hidden="true">{item.icon}</span>
            <h2>{item.title}</h2>
            <p>{item.category}</p>
            <a href={item.url} target="_blank" rel="noreferrer">
              🌐 כניסה לאתר הרשמי
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
