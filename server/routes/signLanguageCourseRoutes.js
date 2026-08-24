const express = require("express");
const router = express.Router();
const SignLanguageCourse = require("../models/SignLanguageCourse");

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin === "true" ? {} : { active: true };
    const items = await SignLanguageCourse.find(filter).lean();

    items.sort((a, b) =>
      String(a.startDate || "").localeCompare(String(b.startDate || ""))
    );

    res.json(items);
  } catch (error) {
    console.error("Load sign language courses error:", error);
    res.status(500).json({
      message: "לא ניתן לטעון קורסי שפת סימנים",
      detail: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const placeName = String(req.body.placeName || "").trim();

    if (!placeName) {
      return res.status(400).json({ message: "חובה להזין שם מקום" });
    }

    const item = await SignLanguageCourse.create({
      placeName,
      address: String(req.body.address || "").trim(),
      imageUrl: String(req.body.imageUrl || "").trim(),
      city: String(req.body.city || "").trim(),
      phone: String(req.body.phone || "").trim(),
      startDate: String(req.body.startDate || "").trim(),
      active: req.body.active !== false
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create sign language course error:", error);
    res.status(500).json({
      message: "לא ניתן להוסיף קורס",
      detail: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const placeName = String(req.body.placeName || "").trim();

    if (!placeName) {
      return res.status(400).json({ message: "חובה להזין שם מקום" });
    }

    const item = await SignLanguageCourse.findByIdAndUpdate(
      req.params.id,
      {
        placeName,
        address: String(req.body.address || "").trim(),
        imageUrl: String(req.body.imageUrl || "").trim(),
        city: String(req.body.city || "").trim(),
        phone: String(req.body.phone || "").trim(),
        startDate: String(req.body.startDate || "").trim(),
        active: req.body.active !== false
      },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "הקורס לא נמצא" });
    res.json(item);
  } catch (error) {
    console.error("Update sign language course error:", error);
    res.status(500).json({ message: "לא ניתן לעדכן קורס" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await SignLanguageCourse.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "הקורס לא נמצא" });
    res.json({ message: "הקורס נמחק" });
  } catch (error) {
    console.error("Delete sign language course error:", error);
    res.status(500).json({ message: "לא ניתן למחוק קורס" });
  }
});

module.exports = router;
