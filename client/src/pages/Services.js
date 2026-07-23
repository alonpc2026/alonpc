import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const translations = {
  he: {
    title: "🛎️ שירותים",
    intro: "כל השירותים, העסקים והסיוע במקום אחד",
    search: "🔍 חפש שירות...",
    loadError: "לא ניתן לטעון שירותים כרגע",
    details: "לפרטים נוספים",
    noResults: "לא נמצאו שירותים מתאימים."
  },
  en: {
    title: "🛎️ Services",
    intro: "All services, businesses and assistance in one place",
    search: "🔍 Search services...",
    loadError: "Services cannot be loaded right now",
    details: "More details",
    noResults: "No matching services were found."
  },
  ru: {
    title: "🛎️ Услуги",
    intro: "Все услуги, предприятия и помощь в одном месте",
    search: "🔍 Поиск услуги...",
    loadError: "Сейчас не удаётся загрузить услуги",
    details: "Подробнее",
    noResults: "Подходящие услуги не найдены."
  },
  ar: {
    title: "🛎️ الخدمات",
    intro: "جميع الخدمات والأعمال والمساعدة في مكان واحد",
    search: "🔍 ابحث عن خدمة...",
    loadError: "تعذر تحميل الخدمات الآن",
    details: "مزيد من التفاصيل",
    noResults: "لم يتم العثور على خدمات مطابقة."
  },
  am: {
    title: "🛎️ አገልግሎቶች",
    intro: "ሁሉም አገልግሎቶች፣ ንግዶችና እርዳታ በአንድ ቦታ",
    search: "🔍 አገልግሎት ፈልግ...",
    loadError: "አገልግሎቶችን አሁን መጫን አልተቻለም",
    details: "ተጨማሪ ዝርዝር",
    noResults: "ተዛማጅ አገልግሎት አልተገኘም።"
  }
};

function Services() {
  const API = "https://alonpc02026.onrender.com/api/services";
  const { language, dir } = useLanguage();
  const text = translations[language] || translations.he;
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        const res = await fetch(API, { signal: controller.signal });
        const data = await res.json().catch(() => []);

        if (!res.ok) throw new Error(text.loadError);

        setServices(Array.isArray(data) ? data : []);
        setMessage("");
      } catch (error) {
        if (error.name === "AbortError") return;
        setServices([]);
        setMessage(text.loadError);
      }
    }

    loadServices();
    return () => controller.abort();
  }, [text.loadError]);

  const filteredServices = services.filter((service) => {
    const value = `${service.name || ""} ${service.category || ""} ${service.description || ""}`.toLocaleLowerCase();
    return value.includes(search.trim().toLocaleLowerCase());
  });

  return (
    <div className="servicesPage" dir={dir}>
      <section className="heroBanner">
        <h2>{text.title}</h2>
        <p>{text.intro}</p>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder={text.search}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {message && <p className="statusMessage">{message}</p>}

      {!message && filteredServices.length === 0 && (
        <p className="statusMessage">{text.noResults}</p>
      )}

      <main className="grid">
        {filteredServices.map((service) => (
          <article className="card" key={service._id}>
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.name || ""}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />
            )}

            <h3>{service.icon || "🛎️"} {service.name}</h3>
            <p><b>{service.category}</b></p>
            <small>{service.description}</small>

            <button
              type="button"
              style={{ marginTop: 15 }}
              onClick={() => navigate(`/service/${service._id}`)}
            >
              {text.details}
            </button>
          </article>
        ))}
      </main>
    </div>
  );
}

export default Services;
