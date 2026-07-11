import { useEffect, useState } from "react";

function Government() {
  const API = "https://alonpc02026.onrender.com/api/services";

  const categories = [
    "חירשים וכבדי שמיעה",
    "אוטיזם",
    "מוגבלות מוטורית",
    "מוגבלות נוירוקוגניטיבית",
    "מוגבלות שכלית התפתחותית",
    "עיוורון ולקות ראייה",
    "ילדים עם עיכוב התפתחותי",
  ];

  const categoryIcons = {
    "חירשים וכבדי שמיעה": "🦻",
    אוטיזם: "🧩",
    "מוגבלות מוטורית": "♿",
    "מוגבלות נוירוקוגניטיבית": "🧠",
    "מוגבלות שכלית התפתחותית": "🤝",
    "עיוורון ולקות ראייה": "🦯",
    "ילדים עם עיכוב התפתחותי": "🧒",
  };

  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("טוען שירותים...");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("שגיאה בקבלת השירותים");
      }

      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      console.error(error);
      setServices([]);
      setMessage("לא ניתן לטעון שירותים כרגע");
    }
  };

  const filteredServices = services.filter((service) => {
    const serviceCategory = service.category || "";
    const searchText = search.trim().toLowerCase();

    const matchesCategory =
      !selectedCategory || serviceCategory === selectedCategory;

    const combinedText = `
      ${service.name || ""}
      ${service.businessName || ""}
      ${service.description || ""}
      ${service.category || ""}
      ${service.city || ""}
    `.toLowerCase();

    const matchesSearch =
      !searchText || combinedText.includes(searchText);

    return matchesCategory && matchesSearch;
  });

  const openServiceLink = (link) => {
    if (!link) return;

    const fixedLink =
      link.startsWith("http://") || link.startsWith("https://")
        ? link
        : `https://${link}`;

    window.open(fixedLink, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="governmentPage">
      <section className="heroBanner">
        <h1>🏛️ שירותים ממשלתיים</h1>
        <p>
          מידע וקישורים ממשלתיים עבור אנשים עם מוגבלויות ובני משפחותיהם
        </p>
      </section>

      <section className="governmentContent">
        <h2>בחרו נושא</h2>

        <div className="governmentCategories">
          <button
            type="button"
            className={!selectedCategory ? "categoryButton active" : "categoryButton"}
            onClick={() => setSelectedCategory("")}
          >
            📋 כל הנושאים
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                selectedCategory === category
                  ? "categoryButton active"
                  : "categoryButton"
              }
              onClick={() => setSelectedCategory(category)}
            >
              <span className="categoryIcon">
                {categoryIcons[category]}
              </span>

              <span>{category}</span>
            </button>
          ))}
        </div>

        <div className="searchBox">
          <input
            type="text"
            placeholder="🔍 חיפוש שירות ממשלתי..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {selectedCategory && (
          <div className="selectedCategoryTitle">
            <h2>
              {categoryIcons[selectedCategory]} {selectedCategory}
            </h2>

            <button
              type="button"
              onClick={() => setSelectedCategory("")}
            >
              הצג את כל הנושאים
            </button>
          </div>
        )}

        {message && <p className="statusMessage">{message}</p>}

        {!message && filteredServices.length === 0 && (
          <section className="emptyState">
            <h3>עדיין אין שירותים בנושא זה</h3>
            <p>
              אפשר להוסיף שירותים דרך לוח הניהול ולבחור באותה קטגוריה.
            </p>
          </section>
        )}

        <section className="governmentGrid">
          {filteredServices.map((service) => (
            <article className="governmentCard" key={service._id}>
              <div className="governmentCardIcon">
                {service.icon || categoryIcons[service.category] || "🏛️"}
              </div>

              <h3>{service.name}</h3>

              {service.category && (
                <p className="governmentCategoryLabel">
                  {service.category}
                </p>
              )}

              {service.description && (
                <p>{service.description}</p>
              )}

              {service.businessName && (
                <p>
                  <strong>שם הגוף:</strong> {service.businessName}
                </p>
              )}

              {service.address && (
                <p>
                  <strong>כתובת:</strong> {service.address}
                </p>
              )}

              {service.city && (
                <p>
                  <strong>עיר:</strong> {service.city}
                </p>
              )}

              {service.phone && (
                <p>
                  <strong>טלפון:</strong>{" "}
                  <a href={`tel:${service.phone}`}>
                    {service.phone}
                  </a>
                </p>
              )}

              {service.link && (
                <button
                  type="button"
                  onClick={() => openServiceLink(service.link)}
                >
                  🔗 מעבר לאתר הממשלתי
                </button>
              )}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

export default Government;