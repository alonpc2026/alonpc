const express = require("express");
const router = express.Router();
const WhatsAppSticker = require("../models/WhatsAppSticker");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 80,
    fileSize: 3 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("מותר להעלות רק PNG, JPG, WEBP או GIF"));
    }
    cb(null, true);
  }
});

function fileNameWithoutExtension(name = "") {
  return String(name)
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/\.[^.]+$/, "")
    .trim();
}

router.get("/", async (req, res) => {
  try {
    const filter = req.query.admin === "true" ? {} : { active: true };

    // Do not sort in MongoDB here.
    // Sticker documents may contain large image data, and server-side sorting
    // can exceed MongoDB's 32MB in-memory sort limit.
    const items = await WhatsAppSticker.find(filter).lean();

    // Sort after retrieval in Node.js instead.
    items.sort((a, b) => {
      const categoryCompare = String(a.category || "").localeCompare(
        String(b.category || ""),
        "he"
      );

      if (categoryCompare !== 0) return categoryCompare;

      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });

    res.json(items);
  } catch (error) {
    console.error("Load WhatsApp stickers error:", error);
    res.status(500).json({
      message: "לא ניתן לטעון מדבקות",
      detail: error.message,
      code: error.code || ""
    });
  }
});


router.post("/bulk-upload", upload.array("images", 80), async (req, res) => {
  try {
    const category = String(req.body.category || "").trim();
    const description = String(req.body.description || "").trim();
    const iconImageUrl = String(req.body.iconImageUrl || "").trim();
    const whatsappText = String(req.body.whatsappText || "").trim();
    const active = String(req.body.active || "true") !== "false";
    const files = Array.isArray(req.files) ? req.files : [];

    if (!category) {
      return res.status(400).json({ message: "חובה להזין קטגוריה" });
    }

    if (!files.length) {
      return res.status(400).json({ message: "לא נבחרו תמונות להעלאה" });
    }

    const docs = files.map((file, index) => {
      const mime = file.mimetype || "image/png";
      const dataUrl = `data:${mime};base64,${file.buffer.toString("base64")}`;
      const title =
        fileNameWithoutExtension(file.originalname) ||
        `מדבקה ${index + 1}`;

      return {
        category,
        title,
        description,
        stickerImageUrl: dataUrl,
        iconImageUrl,
        whatsappText,
        active
      };
    });

    const created = await WhatsAppSticker.insertMany(docs);

    res.status(201).json({
      message: `${created.length} מדבקות נוספו בהצלחה`,
      count: created.length,
      items: created
    });
  } catch (error) {
    console.error("Bulk WhatsApp sticker upload error:", error);
    res.status(500).json({
      message: "לא ניתן להעלות את קבוצת המדבקות",
      detail: error.message
    });
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
