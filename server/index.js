require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

/* מקורות מורשים */
const allowedOrigins = [
  "http://localhost:3000",
  "https://alonpc.netlify.app",
];

/* CORS */
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

/* קריאת JSON וטפסים */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* תיקיית העלאות */
app.use("/uploads", express.static("uploads"));

/* בדיקת שרת */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ALONPC server is running",
  });
});

/* טעינת נתיבים קיימים */
function mountRoute(routePath, urlPath) {
  try {
    const route = require(routePath);
    app.use(urlPath, route);
    console.log(`✅ Route loaded: ${urlPath}`);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      console.warn(`⚠️ Route not found and was skipped: ${routePath}`);
      return;
    }

    console.error(`❌ Error loading route ${routePath}:`, error);
    throw error;
  }
}

/*
  הנתיבים הבאים נטענים רק אם הקבצים קיימים.
  כך השרת לא יקרוס בגלל קובץ נתיב שחסר.
*/
mountRoute("./routes/authRoutes", "/api/auth");
mountRoute("./routes/serviceRoutes", "/api/services");
mountRoute("./routes/uploadRoutes", "/api/upload");
mountRoute("./routes/productRoutes", "/api/products");
mountRoute("./routes/userRoutes", "/api/users");

/* נתיב שלא נמצא */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "הכתובת המבוקשת לא נמצאה",
  });
});

/* טיפול בשגיאות */
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "הגישה ממקור זה אינה מורשית",
    });
  }

  return res.status(500).json({
    success: false,
    message: "אירעה שגיאה בשרת",
  });
});

/* חיבור למסד הנתונים והפעלת השרת */
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from Environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ ALONPC server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
