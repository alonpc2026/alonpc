import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const translations = {
  he: {
    language: "שפה",
    title: "כניסת מנהל ALONPC",
    subtitle: "הכניסה מיועדת למשתמש מנהל מורשה בלבד.",
    username: "שם משתמש או אימייל",
    usernamePlaceholder: "הקלד שם משתמש או אימייל",
    password: "סיסמה",
    passwordPlaceholder: "הקלד סיסמה",
    showPassword: "הצג סיסמה",
    hidePassword: "הסתר סיסמה",
    login: "כניסה לפורטל הניהול",
    loading: "מתחבר...",
    required: "נא למלא שם משתמש וסיסמה.",
    failed: "ההתחברות נכשלה",
    invalidResponse: "השרת לא החזיר פרטי התחברות תקינים",
    adminOnly: "לחשבון זה אין הרשאת מנהל",
    success: "התחברת כמנהל בהצלחה",
    backHome: "חזרה לדף הבית",
    security: "פרטי הכניסה נבדקים בצורה מאובטחת מול השרת.",
  },
  en: {
    language: "Language",
    title: "ALONPC Administrator Login",
    subtitle: "This login is for an authorized administrator only.",
    username: "Username or email",
    usernamePlaceholder: "Enter username or email",
    password: "Password",
    passwordPlaceholder: "Enter password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    login: "Enter administration portal",
    loading: "Signing in...",
    required: "Please enter a username and password.",
    failed: "Login failed",
    invalidResponse: "The server returned invalid login information",
    adminOnly: "This account does not have administrator permission",
    success: "Administrator login successful",
    backHome: "Back to home page",
    security: "Login details are checked securely by the server.",
  },
  ru: {
    language: "Язык",
    title: "Вход администратора ALONPC",
    subtitle: "Вход предназначен только для уполномоченного администратора.",
    username: "Имя пользователя или электронная почта",
    usernamePlaceholder: "Введите имя пользователя или электронную почту",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    showPassword: "Показать пароль",
    hidePassword: "Скрыть пароль",
    login: "Войти в панель управления",
    loading: "Вход...",
    required: "Введите имя пользователя и пароль.",
    failed: "Не удалось войти",
    invalidResponse: "Сервер вернул неверные данные входа",
    adminOnly: "У этой учетной записи нет прав администратора",
    success: "Вход администратора выполнен успешно",
    backHome: "Вернуться на главную",
    security: "Данные для входа безопасно проверяются сервером.",
  },
  ar: {
    language: "اللغة",
    title: "دخول مدير ALONPC",
    subtitle: "الدخول مخصص للمدير المخوّل فقط.",
    username: "اسم المستخدم أو البريد الإلكتروني",
    usernamePlaceholder: "اكتب اسم المستخدم أو البريد الإلكتروني",
    password: "كلمة المرور",
    passwordPlaceholder: "اكتب كلمة المرور",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    login: "الدخول إلى بوابة الإدارة",
    loading: "جارٍ تسجيل الدخول...",
    required: "يرجى إدخال اسم المستخدم وكلمة المرور.",
    failed: "فشل تسجيل الدخول",
    invalidResponse: "أعاد الخادم بيانات دخول غير صالحة",
    adminOnly: "هذا الحساب لا يملك صلاحية المدير",
    success: "تم دخول المدير بنجاح",
    backHome: "العودة إلى الصفحة الرئيسية",
    security: "يتم التحقق من بيانات الدخول بأمان بواسطة الخادم.",
  },
  am: {
    language: "ቋንቋ",
    title: "የALONPC አስተዳዳሪ መግቢያ",
    subtitle: "ይህ መግቢያ ለተፈቀደለት አስተዳዳሪ ብቻ ነው።",
    username: "የተጠቃሚ ስም ወይም ኢሜይል",
    usernamePlaceholder: "የተጠቃሚ ስም ወይም ኢሜይል ያስገቡ",
    password: "የይለፍ ቃል",
    passwordPlaceholder: "የይለፍ ቃል ያስገቡ",
    showPassword: "የይለፍ ቃል አሳይ",
    hidePassword: "የይለፍ ቃል ደብቅ",
    login: "ወደ አስተዳደር ገጽ ግባ",
    loading: "በመግባት ላይ...",
    required: "የተጠቃሚ ስምና የይለፍ ቃል ያስገቡ።",
    failed: "መግባት አልተሳካም",
    invalidResponse: "አገልጋዩ ትክክለኛ የመግቢያ መረጃ አልመለሰም",
    adminOnly: "ይህ መለያ የአስተዳዳሪ ፈቃድ የለውም",
    success: "የአስተዳዳሪ መግቢያ ተሳክቷል",
    backHome: "ወደ መነሻ ገጽ ተመለስ",
    security: "የመግቢያ መረጃዎች በአገልጋዩ ደህንነቱ ተጠብቆ ይረጋገጣሉ።",
  },
};

const languageOptions = [
  { value: "he", label: "עברית" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
  { value: "ar", label: "العربية" },
  { value: "am", label: "አማርኛ" },
];

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("alonpc-login-language") || "he"
  );
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(
    location.state?.message || ""
  );
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const text = translations[language] || translations.he;
  const direction = language === "he" || language === "ar" ? "rtl" : "ltr";

  const loginPayload = useMemo(() => {
    const cleanLoginId = loginId.trim();

    return {
      email: cleanLoginId.toLowerCase(),
      username: cleanLoginId,
      password,
    };
  }, [loginId, password]);

  useEffect(() => {
    localStorage.setItem("alonpc-login-language", language);
  }, [language]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (token && user?.role === "admin") {
        navigate("/admin", { replace: true });
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [navigate]);

  const loginUser = async (event) => {
    event.preventDefault();

    if (!loginId.trim() || !password) {
      setMessage(text.required);
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(text.loading);
    setMessageType("info");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || text.failed);
      }

      if (!data.token || !data.user) {
        throw new Error(text.invalidResponse);
      }

      if (data.user.role !== "admin") {
        throw new Error(text.adminOnly);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("alonpc-auth-change"));

      setMessage(`✅ ${text.success}`);
      setMessageType("success");

      const destination =
        location.state?.from &&
        String(location.state.from).startsWith("/")
          ? location.state.from
          : "/admin";

      navigate(destination, { replace: true });
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setMessage(`❌ ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page" dir={direction} lang={language}>
      <section className="admin-login-card">
        <div className="admin-login-logo" aria-hidden="true">
          A
        </div>

        <div className="admin-login-language">
          <label htmlFor="login-language">{text.language}</label>

          <select
            id="login-language"
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setMessage("");
              setMessageType("");
            }}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <header className="admin-login-header">
          <h1>🔐 {text.title}</h1>
          <p>{text.subtitle}</p>
        </header>

        <form className="admin-login-form" onSubmit={loginUser}>
          <label htmlFor="login-id">
            {text.username}
          </label>

          <input
            id="login-id"
            type="text"
            autoComplete="username"
            inputMode="email"
            placeholder={text.usernamePlaceholder}
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            disabled={loading}
            required
          />

          <label htmlFor="login-password">
            {text.password}
          </label>

          <div className="admin-password-field">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={text.passwordPlaceholder}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              required
            />

            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword ? text.hidePassword : text.showPassword
              }
              title={
                showPassword ? text.hidePassword : text.showPassword
              }
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? text.loading : text.login}
          </button>
        </form>

        <p
          className={`admin-login-message ${
            messageType ? `admin-login-message--${messageType}` : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>

        <p className="admin-login-security">
          🛡️ {text.security}
        </p>

        <Link className="admin-login-home-link" to="/">
          ← {text.backHome}
        </Link>
      </section>
    </main>
  );
}

export default Login;
