import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AccessiblePortal.css";

const API_URL = "https://alonpc02026.onrender.com/api/services";

const translations = {
  he: {
    title: "מרכז שירותים לאנשים עם מוגבלות",
    subtitle: "חיפוש שירותים, מסמכים, סיוע ממשלתי ועסקים נגישים",
    search: "חיפוש שירות או עסק",
    allCategories: "כל הקטגוריות",
    allDisabilities: "כל סוגי המוגבלות",
    loading: "טוען שירותים...",
    noResults: "לא נמצאו שירותים מתאימים",
    phone: "טלפון",
    whatsapp: "WhatsApp",
    details: "פרטים נוספים",
    shop: "לחנות של אלון",
    home: "חזרה לדף הבית",
    error: "לא ניתן לטעון כרגע את השירותים. נסה שוב מאוחר יותר."
  },
  en: {
    title: "Service Center for People with Disabilities",
    subtitle: "Find services, documents, government assistance and accessible businesses",
    search: "Search for a service or business",
    allCategories: "All categories",
    allDisabilities: "All disability types",
    loading: "Loading services...",
    noResults: "No matching services were found",
    phone: "Phone",
    whatsapp: "WhatsApp",
    details: "More details",
    shop: "Alon's Shop",
    home: "Back to home",
    error: "Services cannot be loaded right now. Please try again later."
  },
  ru: {
    title: "Центр услуг для людей с инвалидностью",
    subtitle: "Поиск услуг, документов, государственной помощи и доступных предприятий",
    search: "Поиск услуги или организации",
    allCategories: "Все категории",
    allDisabilities: "Все виды инвалидности",
    loading: "Загрузка услуг...",
    noResults: "Подходящие услуги не найдены",
    phone: "Телефон",
    whatsapp: "WhatsApp",
    details: "Подробнее",
    shop: "Магазин Алона",
    home: "На главную",
    error: "Сейчас невозможно загрузить услуги. Повторите попытку позже."
  },
  ar: {
    title: "مركز خدمات للأشخاص ذوي الإعاقة",
    subtitle: "البحث عن خدمات ووثائق ومساعدة حكومية وأعمال متاحة",
    search: "ابحث عن خدمة أو مصلحة",
    allCategories: "جميع الفئات",
    allDisabilities: "جميع أنواع الإعاقة",
    loading: "جارٍ تحميل الخدمات...",
    noResults: "لم يتم العثور على خدمات مناسبة",
    phone: "هاتف",
    whatsapp: "WhatsApp",
    details: "مزيد من التفاصيل",
    shop: "متجر ألون",
    home: "العودة إلى الصفحة الرئيسية",
    error: "لا يمكن تحميل الخدمات الآن. حاول مرة أخرى لاحقًا."
  },
  am: {
    title: "ለአካል ጉዳተኞች የአገልግሎት ማዕከል",
    subtitle: "አገልግሎቶችን፣ ሰነዶችን፣ የመንግስት ድጋፍን እና ተደራሽ ንግዶችን ይፈልጉ",
    search: "አገልግሎት ወይም ንግድ ይፈልጉ",
    allCategories: "ሁሉም ምድቦች",
    allDisabilities: "ሁሉም የአካል ጉዳት ዓይነቶች",
    loading: "አገልግሎቶች በመጫን ላይ...",
    noResults: "ተስማሚ አገልግሎቶች አልተገኙም",
    phone: "ስልክ",
    whatsapp: "WhatsApp",
    details: "ተጨማሪ መረጃ",
    shop: "የአሎን ሱቅ",
    home: "ወደ መነሻ ተመለስ",
    error: "አገልግሎቶቹን አሁን መጫን አልተቻለም። ቆይተው ይሞክሩ።"
  }
};

const disabilityOptions = [
  "שמיעה",
  "ראייה",
  "ניידות",
  "קוגניטיבית",
  "נפשית",
  "כללית"
];

function AccessiblePortal() {
  const [language, setLanguage] = useState("he");
  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [disability, setDisability] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const t = translations[language];
  const isRtl = language === "he" || language === "ar";

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setServices(Array.isArray(data) ? data : data.services || []);
      } catch (loadError) {
        console.error("Failed to load services:", loadError);
        setError(translations[language].error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [language]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      )
    ].sort((a, b) => a.localeCompare(b));
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return services.filter((service) => {
      const searchableText = [
        service.name,
        service.businessName,
        service.description,
        service.category,
        service.city,
        service.address
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);
      const matchesCategory = !category || service.category === category;

      const disabilityText = [
        service.disabilityType,
        service.disability,
        service.accessibility
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesDisability =
        !disability ||
        disabilityText.includes(disability.toLowerCase());

      return matchesSearch && matchesCategory && matchesDisability;
    });
  }, [services, searchText, category, disability]);

  const normalizePhone = (phone) =>
    String(phone || "").replace(/[^\d]/g, "");

  return (
    <main
      className="accessible-portal"
      dir={isRtl ? "rtl" : "ltr"}
      lang={language}
    >
      <section className="portal-hero">
        <div className="portal-symbol" aria-hidden="true">
          ♿
        </div>

        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </section>

      <section className="portal-language-bar" aria-label="Language selection">
        <button onClick={() => setLanguage("he")}>עברית</button>
        <button onClick={() => setLanguage("en")}>English</button>
        <button onClick={() => setLanguage("ru")}>Русский</button>
        <button onClick={() => setLanguage("ar")}>العربية</button>
        <button onClick={() => setLanguage("am")}>አማርኛ</button>
      </section>

      <section className="portal-filters">
        <input
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={t.search}
          aria-label={t.search}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label={t.allCategories}
        >
          <option value="">{t.allCategories}</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={disability}
          onChange={(event) => setDisability(event.target.value)}
          aria-label={t.allDisabilities}
        >
          <option value="">{t.allDisabilities}</option>
          {disabilityOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      <section className="portal-actions">
        <Link className="portal-action-button" to="/">
          {t.home}
        </Link>

        <Link className="portal-action-button shop-button" to="/shop">
          {t.shop}
        </Link>
      </section>

      {loading && <p className="portal-status">{t.loading}</p>}

      {!loading && error && (
        <p className="portal-status portal-error">{error}</p>
      )}

      {!loading && !error && filteredServices.length === 0 && (
        <p className="portal-status">{t.noResults}</p>
      )}

      {!loading && !error && filteredServices.length > 0 && (
        <section className="services-grid">
          {filteredServices.map((service) => {
            const phone = normalizePhone(service.phone);
            const whatsappPhone = phone.startsWith("0")
              ? `972${phone.slice(1)}`
              : phone;

            return (
              <article className="service-card" key={service._id || service.id}>
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.name || service.businessName || "Service"}
                    className="service-image"
                  />
                ) : (
                  <div className="service-image-placeholder" aria-hidden="true">
                    ♿
                  </div>
                )}

                <div className="service-card-content">
                  <h2>{service.name || service.businessName}</h2>

                  {service.businessName &&
                    service.businessName !== service.name && (
                      <h3>{service.businessName}</h3>
                    )}

                  {service.category && (
                    <span className="service-category">
                      {service.category}
                    </span>
                  )}

                  {service.description && <p>{service.description}</p>}

                  {(service.address || service.city) && (
                    <p className="service-location">
                      {[service.address, service.city]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}

                  <div className="service-card-buttons">
                    {phone && (
                      <a href={`tel:${phone}`} className="service-button">
                        {t.phone}
                      </a>
                    )}

                    {whatsappPhone && (
                      <a
                        href={`https://wa.me/${whatsappPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="service-button whatsapp-button"
                      >
                        {t.whatsapp}
                      </a>
                    )}

                    {(service._id || service.id) && (
                      <Link
                        to={`/service/${service._id || service.id}`}
                        className="service-button details-button"
                      >
                        {t.details}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default AccessiblePortal;
