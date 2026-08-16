import { useMemo, useState } from "react";
import "./Government.css";

const GOVERNMENT_LINKS = [
  { title: "gov.il", category: "פורטל הממשלה", icon: "🏛️", url: "https://www.gov.il" },
  { title: "ביטוח לאומי", category: "זכויות וקצבאות", icon: "🏦", url: "https://www.btl.gov.il" },
  { title: "רשות המיסים", category: "מיסים", icon: "💰", url: "https://www.gov.il/he/departments/tax-authority" },
  { title: "רשות האוכלוסין וההגירה", category: "אוכלוסין והגירה", icon: "🆔", url: "https://www.gov.il/he/departments/population_and_immigration_authority" },
  { title: "משרד התחבורה והרישוי", category: "תחבורה ורישוי", icon: "🚗", url: "https://www.gov.il/he/departments/topics/driving_and_vehicles" },
  { title: "משטרת ישראל", category: "ביטחון ואכיפה", icon: "👮", url: "https://www.gov.il/he/departments/israel_police" },
  { title: "משרד הבריאות", category: "בריאות", icon: "🏥", url: "https://www.gov.il/he/departments/ministry_of_health" },
  { title: "משרד החינוך", category: "חינוך", icon: "📚", url: "https://www.gov.il/he/departments/ministry_of_education" },
  { title: "שירות התעסוקה", category: "תעסוקה", icon: "💼", url: "https://www.taasuka.gov.il" },
  { title: "נט המשפט", category: "מערכת המשפט", icon: "⚖️", url: "https://www.court.gov.il" }
];

export default function Government() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return GOVERNMENT_LINKS;

    return GOVERNMENT_LINKS.filter((item) =>
      `${item.title} ${item.category}`.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <main className="government-only-page" dir="rtl">
      <section className="government-only-hero">
        <span className="government-only-icon" aria-hidden="true">🏛️</span>
        <div>
          <h1>משרדי ממשלה</h1>
          <p>משרדי ממשלה, רשויות וגופים ציבוריים בלבד</p>
        </div>
      </section>

      <div className="government-only-search">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="🔎 חיפוש משרד ממשלתי, רשות או גוף ציבורי..."
        />
      </div>

      <section className="government-only-grid">
        {filtered.map((item) => (
          <article className="government-only-card" key={item.title}>
            <span aria-hidden="true">{item.icon}</span>
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
