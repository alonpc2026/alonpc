import { Link } from "react-router-dom";
import "./Judaism.css";

const sections = [
  { title: "שיעורי תורה נגישים", icon: "📖", path: "/judaism/torah-lessons" },
  { title: "עזרה ביהדות", icon: "🤝", path: "/judaism/help" },
  { title: "חומר לימוד", icon: "📚", path: "/judaism/study-material" },
  { title: "אירועים יהדות", icon: "🕯️", path: "/judaism/events" }
];

export default function Judaism() {
  return (
    <main className="judaism-page" dir="rtl">
      <header className="judaism-hero">
        <span>✡️</span>
        <div>
          <h1>יהדות</h1>
          <p>שיעורים, עזרה, חומרי לימוד ואירועים בתחום היהדות.</p>
        </div>
      </header>

      <section className="judaism-grid">
        {sections.map((item) => (
          <Link key={item.path} to={item.path} className="judaism-card">
            <span>{item.icon}</span>
            <strong>{item.title}</strong>
            <b>←</b>
          </Link>
        ))}
      </section>
    </main>
  );
}
