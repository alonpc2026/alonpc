import { useState } from "react";

const categories = [
  {
    title: "🌐 פורטלים",
    items: [
      "חדשות",
      "ממשלה",
      "בנקים",
      "ביטוח",
      "בריאות",
      "תחבורה",
      "קניות",
      "מחשבים",
      "בינה מלאכותית",
      "רשתות חברתיות",
      "וידאו",
      "משחקים",
      "לימודים",
      "מפות",
      "מזג אוויר",
      "תיירות",
      "ספורט",
      "דואר אלקטרוני"
    ]
  }
];

export default function PortalLinks() {
  const [search, setSearch] = useState("");

  return (
    <main className="pageContainer" dir="rtl">
      <h1>🌐 פורטל האתרים של אלון</h1>

      <input
        className="searchInput"
        placeholder="חיפוש..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      {categories.map(category => (
        <section className="card" key={category.title}>
          <h2>{category.title}</h2>

          <div className="grid">
            {category.items
              .filter(item => item.includes(search))
              .map(item => (
                <button
                  key={item}
                  className="detailsButton"
                  onClick={() => alert("בהמשך יחוברו הקישורים עבור: " + item)}
                >
                  {item}
                </button>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}
