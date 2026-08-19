const express = require("express");
const router = express.Router();
const FacebookGroupLink = require("../models/FacebookGroupLink");

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin === "true" ? {} : { active: true };
    const items = await FacebookGroupLink.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Load Facebook links error:", error);
    res.status(500).json({ message: "לא ניתן לטעון קישורים" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const url = String(req.body.url || "").trim();

    if (!title) return res.status(400).json({ message: "חובה להזין שם/כותרת" });
    if (!url) return res.status(400).json({ message: "חובה להזין קישור" });

    const item = await FacebookGroupLink.create({
      title,
      url,
      note: String(req.body.note || "").trim(),
      active: req.body.active !== false
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create Facebook link error:", error);
    res.status(500).json({ message: "לא ניתן להוסיף קישור" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const url = String(req.body.url || "").trim();

    if (!title) return res.status(400).json({ message: "חובה להזין שם/כותרת" });
    if (!url) return res.status(400).json({ message: "חובה להזין קישור" });

    const item = await FacebookGroupLink.findByIdAndUpdate(
      req.params.id,
      {
        title,
        url,
        note: String(req.body.note || "").trim(),
        active: req.body.active !== false
      },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "הקישור לא נמצא" });
    res.json(item);
  } catch (error) {
    console.error("Update Facebook link error:", error);
    res.status(500).json({ message: "לא ניתן לעדכן קישור" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await FacebookGroupLink.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "הקישור לא נמצא" });
    res.json({ message: "הקישור נמחק" });
  } catch (error) {
    console.error("Delete Facebook link error:", error);
    res.status(500).json({ message: "לא ניתן למחוק קישור" });
  }
});

module.exports = router;
