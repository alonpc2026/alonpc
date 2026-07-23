חבילה 4 — שינויים בקובץ server/index.js

אין למחוק את index.js הקיים.

1. בראש הקובץ, ליד שאר ה-require, הוסף:

const applySecurity = require("./middleware/security");

2. אחרי יצירת app:

const app = express();

הוסף מיד:

applySecurity(app);

3. ודא שה-CORS שלך מגביל את המקורות המותרים:

const allowedOrigins = [
  "http://localhost:3000",
  "https://alonpc.netlify.app"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);

חשוב:
אל תשאיר גם app.use(cors()) פתוח בנוסף לקוד המוגבל.
