const express = require("express");
const router = express.Router();

const SecondHand = require("../models/SecondHand");

// קבלת כל המוצרים
router.get("/", async (req, res) => {
  try {
    const items = await SecondHand.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// קבלת מוצר לפי מזהה
router.get("/:id", async (req, res) => {
  try {
    const item = await SecondHand.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "המוצר לא נמצא" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// הוספת מוצר
router.post("/", async (req, res) => {
  try {
    const item = new SecondHand(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// עדכון מוצר
router.put("/:id", async (req, res) => {
  try {
    const item = await SecondHand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "המוצר לא נמצא" });
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// מחיקת מוצר
router.delete("/:id", async (req, res) => {
  try {
    const item = await SecondHand.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "המוצר לא נמצא" });
    }

    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;