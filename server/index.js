const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// קבצים סטטיים
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===== Routes =====
const serviceRoutes = require("./routes/serviceRoutes");
const productRoutes = require("./routes/productRoutes");
const secondHandRoutes = require("./routes/secondHandRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const documentUploadRoutes = require("./routes/documentUploadRoutes");
const documentRoutes = require("./routes/documentRoutes");

app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/second-hand", secondHandRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/upload", uploadRoutes);
app.use("/api/documents/upload", documentUploadRoutes);
app.use("/api/documents", documentRoutes);

// דף הבית
app.get("/", (req, res) => {
  res.send("🚀 ALON PC API Server");
});

// בדיקת שרת
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    mongodb: "Connected",
    server: "ALON PC"
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});