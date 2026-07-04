require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const serviceRoutes = require("./routes/serviceRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const productRoutes = require("./routes/productRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// חיבור למסד הנתונים
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// הצגת קבצים שהועלו
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// דף ראשי
app.get("/", (req, res) => {
  res.send("ברוכים הבאים לשרת ALONPC");
});

// Routes
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);

// בדיקת שרת
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ALONPC Server עובד",
    mongodb: "Connected",
  });
});

// הפעלת השרת
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});