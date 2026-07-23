import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Home.css";

const MANUAL_VISITOR_COUNT = 12580;

const HOME_TRANSLATIONS = {
  he: {
    accessibilityBadge: "♿ אתר נגיש וברור לכולם",
    heroTitle: "מרכז השירותים של ALONPC",
    heroSubtitle: "כל השירותים, החנות, המסמכים והסיוע במקום אחד.",
    searchPlaceholder: "חיפוש כפתור או שירות",
    clear: "נקה",
    buttonsAria: "כל הכפתורים הראשיים",
    noResults: "לא נמצאו כפתורים מתאימים לחיפוש.",
    quickContact: "יצירת קשר מהירה",
    writeToAlon: "כתבו לאלון",
    visitorCounter: "מונה מבקרים",
    visitorCounterNote: "המספר מתעדכן ידנית על ידי מנהל האתר",
    buttons: {
      accessiblePortal: ["מרכז השירותים", "כל השירותים במקום אחד"],
      government: ["משרדי ממשלה", "שירותים ממשלתיים וטפסים"],
      nationalInsurance: ["ביטוח לאומי", "קצבאות, זכויות וטפסים"],
      health: ["בריאות", "קופות חולים ושירותי רפואה"],
      accessibility: ["נגישות", "מידע וסיוע לאנשים עם מוגבלות"],
      transport: ["תחבורה", "תחבורה ציבורית וניידות"],
      employment: ["תעסוקה", "משרות, הכשרה וסיוע בעבודה"],
      documents: ["מסמכים", "טפסים, אישורים ומידע שימושי"],
      shop: ["חנות של אלון", "מחשבים, ציוד ומוצרים נגישים"],
      secondHand: ["יד שנייה", "מוצרים יד שנייה"],
      booking: ["הזמנת שירות", "פתיחת בקשה לשירות או טיפול"],
      events: ["לוח אירועים בישראל", "אירועים, הופעות, כנסים ופעילויות לפי חודשים"],
      interestingSites: ["אתרים מעניינים של אלון", "קישורים לאתרים מומלצים ושימושיים"],
      about: ["אודות", "מידע על ALONPC"],
      contact: ["צור קשר", "פנייה לאלון בכתב"]
    }
  },
  en: {
    accessibilityBadge: "♿ An accessible and clear website for everyone",
    heroTitle: "ALONPC Service Center",
    heroSubtitle: "All services, the shop, documents and assistance in one place.",
    searchPlaceholder: "Search for a button or service",
    clear: "Clear",
    buttonsAria: "All main buttons",
    noResults: "No matching buttons were found.",
    quickContact: "Quick contact",
    writeToAlon: "Write to Alon",
    visitorCounter: "Visitor counter",
    visitorCounterNote: "The number is updated manually by the site administrator",
    buttons: {
      accessiblePortal: ["Service Center", "All services in one place"],
      government: ["Government Offices", "Government services and forms"],
      nationalInsurance: ["National Insurance", "Allowances, rights and forms"],
      health: ["Health", "Health funds and medical services"],
      accessibility: ["Accessibility", "Information and assistance for people with disabilities"],
      transport: ["Transportation", "Public transportation and mobility"],
      employment: ["Employment", "Jobs, training and work assistance"],
      documents: ["Documents", "Forms, certificates and useful information"],
      shop: ["Alon's Shop", "Computers, equipment and accessible products"],
      secondHand: ["Second Hand", "Second-hand products"],
      booking: ["Book a Service", "Open a service or support request"],
      events: ["Events in Israel", "Events, shows, conferences and activities by month"],
      interestingSites: ["Alon's Interesting Sites", "Recommended and useful website links"],
      about: ["About", "Information about ALONPC"],
      contact: ["Contact", "Write to Alon"]
    }
  },
  ru: {
    accessibilityBadge: "♿ Доступный и понятный сайт для всех",
    heroTitle: "Центр услуг ALONPC",
    heroSubtitle: "Все услуги, магазин, документы и помощь в одном месте.",
    searchPlaceholder: "Поиск кнопки или услуги",
    clear: "Очистить",
    buttonsAria: "Все основные кнопки",
    noResults: "Подходящие кнопки не найдены.",
    quickContact: "Быстрая связь",
    writeToAlon: "Написать Алону",
    visitorCounter: "Счётчик посетителей",
    visitorCounterNote: "Число обновляется администратором сайта вручную",
    buttons: {
      accessiblePortal: ["Центр услуг", "Все услуги в одном месте"],
      government: ["Государственные учреждения", "Государственные услуги и формы"],
      nationalInsurance: ["Национальное страхование", "Пособия, права и формы"],
      health: ["Здоровье", "Больничные кассы и медицинские услуги"],
      accessibility: ["Доступность", "Информация и помощь людям с инвалидностью"],
      transport: ["Транспорт", "Общественный транспорт и мобильность"],
      employment: ["Трудоустройство", "Работа, обучение и помощь в трудоустройстве"],
      documents: ["Документы", "Формы, справки и полезная информация"],
      shop: ["Магазин Алона", "Компьютеры, оборудование и доступные товары"],
      secondHand: ["Секонд-хенд", "Подержанные товары"],
      booking: ["Заказ услуги", "Открыть заявку на услугу или помощь"],
      events: ["События в Израиле", "События, концерты, конференции и мероприятия по месяцам"],
      interestingSites: ["Интересные сайты Алона", "Рекомендуемые и полезные ссылки"],
      about: ["О нас", "Информация об ALONPC"],
      contact: ["Контакты", "Написать Алону"]
    }
  },
  ar: {
    accessibilityBadge: "♿ موقع واضح ومتاح للجميع",
    heroTitle: "مركز خدمات ALONPC",
    heroSubtitle: "جميع الخدمات والمتجر والمستندات والمساعدة في مكان واحد.",
    searchPlaceholder: "ابحث عن زر أو خدمة",
    clear: "مسح",
    buttonsAria: "جميع الأزرار الرئيسية",
    noResults: "لم يتم العثور على أزرار مطابقة.",
    quickContact: "اتصال سريع",
    writeToAlon: "اكتب إلى ألون",
    visitorCounter: "عداد الزوار",
    visitorCounterNote: "يتم تحديث الرقم يدويًا بواسطة مدير الموقع",
    buttons: {
      accessiblePortal: ["مركز الخدمات", "جميع الخدمات في مكان واحد"],
      government: ["الدوائر الحكومية", "خدمات حكومية ونماذج"],
      nationalInsurance: ["التأمين الوطني", "مخصصات وحقوق ونماذج"],
      health: ["الصحة", "صناديق المرضى والخدمات الطبية"],
      accessibility: ["إتاحة الوصول", "معلومات ومساعدة للأشخاص ذوي الإعاقة"],
      transport: ["المواصلات", "المواصلات العامة والتنقل"],
      employment: ["التوظيف", "وظائف وتدريب ومساعدة في العمل"],
      documents: ["المستندات", "نماذج وشهادات ومعلومات مفيدة"],
      shop: ["متجر ألون", "أجهزة كمبيوتر ومعدات ومنتجات متاحة"],
      secondHand: ["مستعمل", "منتجات مستعملة"],
      booking: ["حجز خدمة", "فتح طلب خدمة أو مساعدة"],
      events: ["فعاليات في إسرائيل", "فعاليات وعروض ومؤتمرات وأنشطة حسب الأشهر"],
      interestingSites: ["مواقع ألون المميزة", "روابط لمواقع موصى بها ومفيدة"],
      about: ["من نحن", "معلومات عن ALONPC"],
      contact: ["اتصل بنا", "مراسلة ألون كتابيًا"]
    }
  },
  am: {
    accessibilityBadge: "♿ ለሁሉም ተደራሽና ግልጽ የሆነ ድረ ገጽ",
    heroTitle: "የALONPC አገልግሎት ማዕከል",
    heroSubtitle: "ሁሉም አገልግሎቶች፣ ሱቅ፣ ሰነዶችና እርዳታ በአንድ ቦታ።",
    searchPlaceholder: "ቁልፍ ወይም አገልግሎት ፈልግ",
    clear: "አጽዳ",
    buttonsAria: "ሁሉም ዋና ቁልፎች",
    noResults: "ተዛማጅ ቁልፎች አልተገኙም።",
    quickContact: "ፈጣን ግንኙነት",
    writeToAlon: "ለአሎን ይጻፉ",
    visitorCounter: "የጎብኚዎች ቆጣሪ",
    visitorCounterNote: "ቁጥሩ በድረ ገጹ አስተዳዳሪ በእጅ ይዘምናል",
    buttons: {
      accessiblePortal: ["የአገልግሎት ማዕከል", "ሁሉም አገልግሎቶች በአንድ ቦታ"],
      government: ["የመንግስት ቢሮዎች", "የመንግስት አገልግሎቶችና ቅጾች"],
      nationalInsurance: ["ብሔራዊ መድን", "ድጎማዎች፣ መብቶችና ቅጾች"],
      health: ["ጤና", "የጤና ድርጅቶችና የሕክምና አገልግሎቶች"],
      accessibility: ["ተደራሽነት", "ለአካል ጉዳተኞች መረጃና እርዳታ"],
      transport: ["ትራንስፖርት", "የህዝብ መጓጓዣና እንቅስቃሴ"],
      employment: ["ሥራ", "የሥራ ዕድሎች፣ ስልጠናና እርዳታ"],
      documents: ["ሰነዶች", "ቅጾች፣ ማረጋገጫዎችና ጠቃሚ መረጃ"],
      shop: ["የአሎን ሱቅ", "ኮምፒውተሮች፣ መሳሪያዎችና ተደራሽ ምርቶች"],
      secondHand: ["ያገለገሉ ምርቶች", "ሁለተኛ እጅ ምርቶች"],
      booking: ["አገልግሎት ይዘዙ", "የአገልግሎት ወይም ድጋፍ ጥያቄ ይክፈቱ"],
      events: ["በእስራኤል ያሉ ዝግጅቶች", "ዝግጅቶች፣ ትርዒቶችና ጉባኤዎች በወር"],
      interestingSites: ["የአሎን ጠቃሚ ድረ ገጾች", "የሚመከሩና ጠቃሚ አገናኞች"],
      about: ["ስለ እኛ", "ስለ ALONPC መረጃ"],
      contact: ["ያግኙን", "ለአሎን በጽሑፍ ይላኩ"]
    }
  }
};

const BUTTON_DEFINITIONS = [
  { key: "accessiblePortal", icon: "♿", color: "blue", path: "/accessible-portal" },
  { key: "government", icon: "🏛️", color: "navy", path: "/government" },
  { key: "nationalInsurance", icon: "🏦", color: "royal", path: "/services" },
  { key: "health", icon: "❤️", color: "green", path: "/services" },
  { key: "accessibility", icon: "♿", color: "cyan", path: "/services" },
  { key: "transport", icon: "🚗", color: "lime", path: "/services" },
  { key: "employment", icon: "💼", color: "purple", path: "/services" },
  { key: "documents", icon: "📄", color: "orange", path: "/documents" },
  { key: "shop", icon: "🛒", color: "amber", path: "/shop" },
  { key: "secondHand", icon: "♻️", color: "teal", path: "/second-hand" },
  { key: "booking", icon: "🗓️", color: "pink", path: "/booking" },
  { key: "events", icon: "📅", color: "royal", path: "/israel-events" },
  { key: "interestingSites", icon: "🌐", color: "indigo", path: "/interesting-sites" },
  { key: "about", icon: "ℹ️", color: "sky", path: "/about" },
  { key: "contact", icon: "📞", color: "red", path: "/contact" }
];

function Home() {
  const { language, dir, locale } = useLanguage();
  const [search, setSearch] = useState("");

  const text = HOME_TRANSLATIONS[language] || HOME_TRANSLATIONS.he;

  const mainButtons = useMemo(
    () =>
      BUTTON_DEFINITIONS.map((button) => ({
        ...button,
        title: text.buttons[button.key][0],
        subtitle: text.buttons[button.key][1]
      })),
    [text]
  );

  const filteredButtons = useMemo(() => {
    const term = search.trim().toLocaleLowerCase(locale);

    if (!term) return mainButtons;

    return mainButtons.filter((button) =>
      `${button.title} ${button.subtitle}`
        .toLocaleLowerCase(locale)
        .includes(term)
    );
  }, [search, mainButtons, locale]);

  const arrow = dir === "rtl" ? "←" : "→";

  return (
    <main className="home-page" dir={dir}>
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-accessibility-badge">
            {text.accessibilityBadge}
          </span>

          <h1>{text.heroTitle}</h1>
          <p>{text.heroSubtitle}</p>

          <div className="home-search">
            <span aria-hidden="true">🔍</span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={text.searchPlaceholder}
              aria-label={text.searchPlaceholder}
            />

            <button
              type="button"
              onClick={() => setSearch("")}
              disabled={!search}
            >
              {text.clear}
            </button>
          </div>
        </div>
      </section>

      <section className="home-main-buttons" aria-label={text.buttonsAria}>
        {filteredButtons.map((button) => (
          <Link
            key={button.key}
            to={button.path}
            className={`home-main-button home-main-button--${button.color}`}
          >
            <span className="home-main-button-icon" aria-hidden="true">
              {button.icon}
            </span>

            <span className="home-main-button-text">
              <strong>{button.title}</strong>
              <small>{button.subtitle}</small>
            </span>

            <span className="home-main-button-arrow" aria-hidden="true">
              {arrow}
            </span>
          </Link>
        ))}
      </section>

      {filteredButtons.length === 0 && (
        <section className="home-empty">{text.noResults}</section>
      )}

      <section className="home-contact-strip" aria-label={text.quickContact}>
        <a
          href="https://wa.me/972545221809"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

        <a href="tel:+972545221809">054-5221809</a>

        <Link to="/contact">{text.writeToAlon}</Link>
      </section>

      <section
        className="manual-visitor-counter"
        aria-label={text.visitorCounter}
      >
        <div className="visitor-counter-image" aria-hidden="true">
          <svg viewBox="0 0 220 160" role="img">
            <circle cx="75" cy="55" r="28" />
            <circle cx="145" cy="55" r="28" />
            <path d="M25 142c4-38 25-57 50-57s46 19 50 57" />
            <path d="M95 142c4-38 25-57 50-57s46 19 50 57" />
          </svg>
        </div>

        <div className="visitor-counter-content">
          <span>{text.visitorCounter}</span>
          <strong>{MANUAL_VISITOR_COUNT.toLocaleString(locale)}</strong>
          <small>{text.visitorCounterNote}</small>
        </div>
      </section>
    </main>
  );
}

export default Home;
