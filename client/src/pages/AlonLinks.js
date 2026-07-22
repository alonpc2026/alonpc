import { useNavigate } from "react-router-dom";

function AlonLinks() {
  const navigate = useNavigate();

  const links = [
    {
      icon: "🛎️",
      title: "שירותים",
      description: "כל השירותים שמציע ALON PC במקום אחד.",
      path: "/services",
    },
    {
      icon: "🛍️",
      title: "חנות אלון",
      description: "מחשבים, ציוד נגישות, אביזרים ומוצרים נוספים.",
      path: "/shop",
    },
    {
      icon: "♻️",
      title: "יד שנייה",
      description: "מוצרים משומשים ומחודשים במחירים נוחים.",
      path: "/second-hand",
    },
    {
      icon: "🏛️",
      title: "שירותים ממשלתיים",
      description: "קישורים ומידע שימושי לשירותים ממשלתיים.",
      path: "/government",
    },
    {
      icon: "📄",
      title: "מסמכים",
      description: "טפסים, מסמכים וקבצים חשובים להורדה או צפייה.",
      path: "/documents",
    },
    {
      icon: "📅",
      title: "הזמנת שירות",
      description: "שליחת בקשה מסודרת לקבלת שירות.",
      path: "/booking",
    },
    {
      icon: "ℹ️",
      title: "אודות",
      description: "מידע על אלון, הניסיון והשירותים.",
      path: "/about",
    },
    {
      icon: "✉️",
      title: "צור קשר",
      description: "יצירת קשר בקלות ובדרך נגישה.",
      path: "/contact",
    },
  ];

  return (
    <main className="alonLinksPage" dir="rtl">
      <section className="alonLinksHero">
        <div className="alonLinksHeroIcon">🌐</div>

        <h1>אוסף האתרים של אלון</h1>

        <p>
          כאן מרוכזים כל השירותים, הקישורים והדפים החשובים
          של ALON PC במקום אחד, בצורה ברורה ונגישה.
        </p>
      </section>

      <section className="alonLinksGrid">
        {links.map((item) => (
          <button
            key={item.path}
            type="button"
            className="alonLinkCard"
            onClick={() => navigate(item.path)}
          >
            <span className="alonLinkIcon">{item.icon}</span>

            <span className="alonLinkContent">
              <strong>{item.title}</strong>
              <small>{item.description}</small>
            </span>

            <span className="alonLinkArrow">←</span>
          </button>
        ))}
      </section>

      <section className="alonLinksContact">
        <h2>צריך עזרה?</h2>

        <p>
          אפשר ליצור קשר ישירות עם אלון באמצעות WhatsApp.
        </p>

        <a
          href="https://wa.me/972545221809"
          target="_blank"
          rel="noreferrer"
          className="alonWhatsappButton"
        >
          🟢 מעבר ל־WhatsApp
        </a>
      </section>

      <div className="alonLinksBottomActions">
        <button
          type="button"
          className="alonBackButton"
          onClick={() => navigate("/")}
        >
          🏠 חזרה לדף הבית
        </button>
      </div>
    </main>
  );
}

export default AlonLinks;
