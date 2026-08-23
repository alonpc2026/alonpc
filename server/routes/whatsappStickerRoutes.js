const express = require("express");
const router = express.Router();
const WhatsAppSticker = require("../models/WhatsAppSticker");

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin === "true" ? {} : { active: true };
    const items = await WhatsAppSticker.find(filter).sort({
      category: 1,
      createdAt: -1
    });
    res.json(items);
  } catch (error) {
    console.error("Load WhatsApp stickers error:", error);
    res.status(500).json({ message: "לא ניתן לטעון מדבקות" });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = String(req.body.category || "").trim();
    const title = String(req.body.title || "").trim();
    const stickerImageUrl = String(req.body.stickerImageUrl || "").trim();

    if (!category) return res.status(400).json({ message: "חובה להזין קטגוריה" });
    if (!title) return res.status(400).json({ message: "חובה להזין שם" });
    if (!stickerImageUrl) return res.status(400).json({ message: "חובה להזין תמונת מדבקה" });

    const item = await WhatsAppSticker.create({
      category,
      title,
      description: String(req.body.description || "").trim(),
      stickerImageUrl,
      iconImageUrl: String(req.body.iconImageUrl || "").trim(),
      whatsappText: String(req.body.whatsappText || "").trim(),
      active: req.body.active !== false
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create WhatsApp sticker error:", error);
    res.status(500).json({ message: "לא ניתן להוסיף מדבקה", detail: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = String(req.body.category || "").trim();
    const title = String(req.body.title || "").trim();
    const stickerImageUrl = String(req.body.stickerImageUrl || "").trim();

    if (!category) return res.status(400).json({ message: "חובה להזין קטגוריה" });
    if (!title) return res.status(400).json({ message: "חובה להזין שם" });
    if (!stickerImageUrl) return res.status(400).json({ message: "חובה להזין תמונת מדבקה" });

    const item = await WhatsAppSticker.findByIdAndUpdate(
      req.params.id,
      {
        category,
        title,
        description: String(req.body.description || "").trim(),
        stickerImageUrl,
        iconImageUrl: String(req.body.iconImageUrl || "").trim(),
        whatsappText: String(req.body.whatsappText || "").trim(),
        active: req.body.active !== false
      },
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "המדבקה לא נמצאה" });
    res.json(item);
  } catch (error) {
    console.error("Update WhatsApp sticker error:", error);
    res.status(500).json({ message: "לא ניתן לעדכן מדבקה" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await WhatsAppSticker.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "המדבקה לא נמצאה" });
    res.json({ message: "המדבקה נמחקה" });
  } catch (error) {
    console.error("Delete WhatsApp sticker error:", error);
    res.status(500).json({ message: "לא ניתן למחוק מדבקה" });
  }
});

module.exports = router;
