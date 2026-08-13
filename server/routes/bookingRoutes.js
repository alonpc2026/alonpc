const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// קבלת כל ההזמנות והבקשות
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ספירת הודעות/בקשות חדשות למנהל
router.get("/new-count", async (req, res) => {
  try {
    const count = await Booking.countDocuments({ status: "חדש" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// הוספת הזמנה / בקשת שירות
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// עדכון הזמנה / סטטוס
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }

    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// מחיקת הזמנה
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }

    res.json({ message: "ההזמנה נמחקה בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
