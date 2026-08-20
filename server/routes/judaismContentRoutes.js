const express = require("express");
const router = express.Router();
const JudaismContent = require("../models/JudaismContent");

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin === "true" ? {} : { active: true };
    if (req.query.category) filter.category = req.query.category;
    const items = await JudaismContent.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "לא ניתן לטעון תוכן יהדות" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.title) return res.status(400).json({ message: "חובה להזין כותרת" });
    const item = await JudaismContent.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "לא ניתן להוסיף תוכן יהדות" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const item = await JudaismContent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: "הפריט לא נמצא" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "לא ניתן לעדכן תוכן יהדות" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await JudaismContent.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "הפריט לא נמצא" });
    res.json({ message: "נמחק" });
  } catch (error) {
    res.status(500).json({ message: "לא ניתן למחוק תוכן יהדות" });
  }
});

module.exports = router;
