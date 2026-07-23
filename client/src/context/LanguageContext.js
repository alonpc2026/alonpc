import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LanguageContext = createContext(null);
const STORAGE_KEY = "alonpc-language";

export const LANGUAGES = {
  he: { label: "🇮🇱 עברית", dir: "rtl", locale: "he-IL" },
  en: { label: "🇺🇸 English", dir: "ltr", locale: "en-US" },
  ru: { label: "🇷🇺 Русский", dir: "ltr", locale: "ru-RU" },
  ar: { label: "🇸🇦 العربية", dir: "rtl", locale: "ar" },
  am: { label: "🇪🇹 አማርኛ", dir: "ltr", locale: "am-ET" },
};

const translations = {
  he: {
    language: "שפה",
    home: "דף הבית",
    services: "שירותים",
    dashboard: "לוח בקרה",
    admin: "ניהול",
    shop: "החנות של אלון",
    cart: "עגלה",
    about: "אודות",
    contact: "צור קשר",
    login: "כניסת מנהל",
    logout: "יציאה",
    whatsapp: "WhatsApp",
    phone: "טלפון",
    email: "דוא״ל",
    address: "כתובת",
    hours: "שעות פעילות",
    website: "אתר",
    video: "סרטון",
    call: "התקשר",
    back: "חזרה",
    loading: "טוען...",
    servicesTitle: "🛎️ שירותים",
    servicesIntro: "כל השירותים, העסקים והסיוע במקום אחד",
    servicesSearch: "🔍 חפש שירות...",
    servicesLoadError: "לא ניתן לטעון שירותים כרגע",
    servicesDetails: "לפרטים נוספים",
    servicesNoResults: "לא נמצאו שירותים מתאימים.",
    serviceNotFound: "השירות לא נמצא",
    backToServices: "חזרה לשירותים",
    aboutTitle: "אודות ALONPC",
    aboutText:
      "מרכז שירותים לאנשים עם מוגבלות, שירותי מחשבים, מידע נגיש וחנות טכנולוגית.",
    contactTitle: "צור קשר",
    contactText: "ניתן ליצור קשר עם אלון בכתב באמצעות WhatsApp.",
    openWhatsapp: "פתיחת שיחה ב־WhatsApp",
    notFoundTitle: "העמוד לא נמצא",
    notFoundText: "הקישור אינו תקין או שהעמוד הועבר.",
    loginTitle: "כניסת מנהל",
    loginWelcome: "ברוכים הבאים למערכת הניהול של ALONPC",
    username: "שם משתמש",
    password: "סיסמה",
    loginButton: "כניסה",
    loggingIn: "מתחבר...",
    loginSuccess: "התחברת בהצלחה",
    loginError: "שם המשתמש או הסיסמה אינם נכונים",
    serverError: "לא ניתן להתחבר לשרת כרגע",
    requiredFields: "יש למלא שם משתמש וסיסמה",
  },
  en: {
    language: "Language",
    home: "Home",
    services: "Services",
    dashboard: "Dashboard",
    admin: "Admin",
    shop: "Alon's Shop",
    cart: "Cart",
    about: "About",
    contact: "Contact",
    login: "Admin Login",
    logout: "Logout",
    whatsapp: "WhatsApp",
    phone: "Phone",
    email: "Email",
    address: "Address",
    hours: "Opening hours",
    website: "Website",
    video: "Video",
    call: "Call",
    back: "Back",
    loading: "Loading...",
    servicesTitle: "🛎️ Services",
    servicesIntro: "All services, businesses and assistance in one place",
    servicesSearch: "🔍 Search services...",
    servicesLoadError: "Services cannot be loaded right now",
    servicesDetails: "More details",
    servicesNoResults: "No matching services were found.",
    serviceNotFound: "Service not found",
    backToServices: "Back to services",
    aboutTitle: "About ALONPC",
    aboutText:
      "A service center for people with disabilities, computer services, accessible information and a technology shop.",
    contactTitle: "Contact",
    contactText: "You can contact Alon in writing through WhatsApp.",
    openWhatsapp: "Open WhatsApp chat",
    notFoundTitle: "Page not found",
    notFoundText: "The link is invalid or the page has moved.",
    loginTitle: "Admin Login",
    loginWelcome: "Welcome to the ALONPC management system",
    username: "Username",
    password: "Password",
    loginButton: "Login",
    loggingIn: "Logging in...",
    loginSuccess: "Login successful",
    loginError: "Incorrect username or password",
    serverError: "Unable to connect to the server",
    requiredFields: "Enter a username and password",
  },
  ru: {
    language: "Язык",
    home: "Главная",
    services: "Услуги",
    dashboard: "Панель",
    admin: "Управление",
    shop: "Магазин Алона",
    cart: "Корзина",
    about: "О нас",
    contact: "Контакты",
    login: "Вход администратора",
    logout: "Выйти",
    whatsapp: "WhatsApp",
    phone: "Телефон",
    email: "Эл. почта",
    address: "Адрес",
    hours: "Часы работы",
    website: "Сайт",
    video: "Видео",
    call: "Позвонить",
    back: "Назад",
    loading: "Загрузка...",
    servicesTitle: "🛎️ Услуги",
    servicesIntro: "Все услуги, предприятия и помощь в одном месте",
    servicesSearch: "🔍 Поиск услуги...",
    servicesLoadError: "Сейчас не удаётся загрузить услуги",
    servicesDetails: "Подробнее",
    servicesNoResults: "Подходящие услуги не найдены.",
    serviceNotFound: "Услуга не найдена",
    backToServices: "Назад к услугам",
    aboutTitle: "О ALONPC",
    aboutText:
      "Центр услуг для людей с инвалидностью, компьютерные услуги, доступная информация и магазин техники.",
    contactTitle: "Контакты",
    contactText: "С Алоном можно связаться письменно через WhatsApp.",
    openWhatsapp: "Открыть чат WhatsApp",
    notFoundTitle: "Страница не найдена",
    notFoundText: "Ссылка неверна или страница была перемещена.",
    loginTitle: "Вход администратора",
    loginWelcome: "Добро пожаловать в систему управления ALONPC",
    username: "Имя пользователя",
    password: "Пароль",
    loginButton: "Войти",
    loggingIn: "Вход...",
    loginSuccess: "Вход выполнен",
    loginError: "Неверное имя пользователя или пароль",
    serverError: "Не удается подключиться к серверу",
    requiredFields: "Введите имя пользователя и пароль",
  },
  ar: {
    language: "اللغة",
    home: "الرئيسية",
    services: "الخدمات",
    dashboard: "لوحة التحكم",
    admin: "الإدارة",
    shop: "متجر ألون",
    cart: "السلة",
    about: "من نحن",
    contact: "اتصل بنا",
    login: "دخول المدير",
    logout: "تسجيل الخروج",
    whatsapp: "واتساب",
    phone: "هاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    hours: "ساعات العمل",
    website: "الموقع",
    video: "فيديو",
    call: "اتصال",
    back: "رجوع",
    loading: "جارٍ التحميل...",
    servicesTitle: "🛎️ الخدمات",
    servicesIntro: "جميع الخدمات والأعمال والمساعدة في مكان واحد",
    servicesSearch: "🔍 ابحث عن خدمة...",
    servicesLoadError: "تعذر تحميل الخدمات الآن",
    servicesDetails: "مزيد من التفاصيل",
    servicesNoResults: "لم يتم العثور على خدمات مطابقة.",
    serviceNotFound: "الخدمة غير موجودة",
    backToServices: "العودة إلى الخدمات",
    aboutTitle: "حول ALONPC",
    aboutText:
      "مركز خدمات للأشخاص ذوي الإعاقة، وخدمات حاسوب، ومعلومات ميسّرة ومتجر تقني.",
    contactTitle: "اتصل بنا",
    contactText: "يمكن التواصل مع ألون كتابيًا عبر واتساب.",
    openWhatsapp: "فتح محادثة واتساب",
    notFoundTitle: "الصفحة غير موجودة",
    notFoundText: "الرابط غير صحيح أو تم نقل الصفحة.",
    loginTitle: "دخول المدير",
    loginWelcome: "مرحبًا بكم في نظام إدارة ALONPC",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    loginButton: "دخول",
    loggingIn: "جارٍ الدخول...",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    loginError: "اسم المستخدم أو كلمة المرور غير صحيحة",
    serverError: "تعذر الاتصال بالخادم",
    requiredFields: "أدخل اسم المستخدم وكلمة المرور",
  },
  am: {
    language: "ቋንቋ",
    home: "መነሻ",
    services: "አገልግሎቶች",
    dashboard: "መቆጣጠሪያ",
    admin: "አስተዳደር",
    shop: "የአሎን ሱቅ",
    cart: "ጋሪ",
    about: "ስለ እኛ",
    contact: "ያግኙን",
    login: "የአስተዳዳሪ መግቢያ",
    logout: "ውጣ",
    whatsapp: "WhatsApp",
    phone: "ስልክ",
    email: "ኢሜይል",
    address: "አድራሻ",
    hours: "የስራ ሰዓት",
    website: "ድረ ገጽ",
    video: "ቪዲዮ",
    call: "ደውል",
    back: "ተመለስ",
    loading: "በመጫን ላይ...",
    servicesTitle: "🛎️ አገልግሎቶች",
    servicesIntro: "ሁሉም አገልግሎቶች፣ ንግዶችና እርዳታ በአንድ ቦታ",
    servicesSearch: "🔍 አገልግሎት ፈልግ...",
    servicesLoadError: "አገልግሎቶችን አሁን መጫን አልተቻለም",
    servicesDetails: "ተጨማሪ ዝርዝር",
    servicesNoResults: "ተዛማጅ አገልግሎት አልተገኘም።",
    serviceNotFound: "አገልግሎቱ አልተገኘም",
    backToServices: "ወደ አገልግሎቶች ተመለስ",
    aboutTitle: "ስለ ALONPC",
    aboutText:
      "ለአካል ጉዳተኞች የአገልግሎት ማዕከል፣ የኮምፒውተር አገልግሎቶች፣ ተደራሽ መረጃ እና የቴክኖሎጂ ሱቅ።",
    contactTitle: "ያግኙን",
    contactText: "አሎንን በWhatsApp በጽሑፍ ማግኘት ይቻላል።",
    openWhatsapp: "WhatsApp ውይይት ክፈት",
    notFoundTitle: "ገጹ አልተገኘም",
    notFoundText: "አገናኙ ትክክል አይደለም ወይም ገጹ ተዘዋውሯል።",
    loginTitle: "የአስተዳዳሪ መግቢያ",
    loginWelcome: "ወደ ALONPC አስተዳደር ስርዓት እንኳን ደህና መጡ",
    username: "የተጠቃሚ ስም",
    password: "የይለፍ ቃል",
    loginButton: "ግባ",
    loggingIn: "በመግባት ላይ...",
    loginSuccess: "በተሳካ ሁኔታ ገብተዋል",
    loginError: "የተጠቃሚ ስም ወይም የይለፍ ቃል ትክክል አይደለም",
    serverError: "ከአገልጋዩ ጋር መገናኘት አልተቻለም",
    requiredFields: "የተጠቃሚ ስምና የይለፍ ቃል ያስገቡ",
  },
};

const FIELD_SUFFIX = {
  he: "He",
  en: "En",
  ru: "Ru",
  ar: "Ar",
  am: "Am",
};

export function getLocalizedField(item, field, language) {
  if (!item) return "";

  const suffix = FIELD_SUFFIX[language] || FIELD_SUFFIX.he;
  const localizedValue = item[`${field}${suffix}`];

  if (
    localizedValue !== undefined &&
    localizedValue !== null &&
    String(localizedValue).trim() !== ""
  ) {
    return localizedValue;
  }

  if (
    item[field] !== undefined &&
    item[field] !== null &&
    String(item[field]).trim() !== ""
  ) {
    return item[field];
  }

  const hebrewValue = item[`${field}He`];
  return hebrewValue ?? "";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES[saved] ? saved : "he";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = LANGUAGES[language].dir;
    document.body.dir = LANGUAGES[language].dir;
  }, [language]);

  const value = useMemo(() => {
    const selected = LANGUAGES[language];

    return {
      language,
      setLanguage,
      languages: LANGUAGES,
      dir: selected.dir,
      locale: selected.locale,
      t(key) {
        return translations[language]?.[key] ?? translations.he?.[key] ?? key;
      },
      localize(item, field) {
        return getLocalizedField(item, field, language);
      },
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage חייב להיות בתוך LanguageProvider");
  }

  return context;
}
