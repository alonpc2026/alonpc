const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// תיקיית תמונות
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// MongoDB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

// =======================
// Routes
// =======================
const serviceRoutes = require("./routes/serviceRoutes");
const productRoutes = require("./routes/productRoutes");
const secondHandRoutes = require("./routes/secondHandRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/services", serviceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/second-hand", secondHandRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/upload", uploadRoutes);

// =======================
// Home
// =======================
app.get("/", (req, res) => {
  res.send("🚀 ALON PC API Server עובד");
});

// =======================
// Health
// =======================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    server: "ALON PC",
    mongodb: "Connected",
    version: "1.0",
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});