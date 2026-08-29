const express = require("express");
const router = express.Router();
const Tourism = require("../models/Tourism");

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(body = {}) {
  const scope = body.scope === "israel" ? "israel" : "world";
  const allowedWorld = new Set(["app", "info", "place"]);
  const allowedIsrael = new Set(["app", "info", "place", "restaurant", "cafe", "fastFood"]);
  const allowed = scope === "world" ? allowedWorld : allowedIsrael;
  const category = allowed.has(body.category) ? body.category : "info";

  return {
    scope,
    countryName: scope === "world" ? cleanText(body.countryName) : "ישראל",
    flagEmoji: scope === "world" ? cleanText(body.flagEmoji) : "🇮🇱",
    flagImageUrl: scope === "world" ? cleanText(body.flagImageUrl) : "",
    category,
    title: cleanText(body.title),
    description: cleanText(body.description),
    city: cleanText(body.city),
    imageUrl: cleanText(body.imageUrl),
    url: cleanText(body.url),
    active: body.active !== false,
  };
}

router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.scope === "world" || req.query.scope === "israel") {
      query.scope = req.query.scope;
    }
    if (req.query.countryName) query.countryName = req.query.countryName;
    if (req.query.category) query.category = req.query.category;
    if (req.query.active === "true") query.active = true;

    const items = await Tourism.find(query).sort({
      countryName: 1,
      category: 1,
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    console.error("Tourism GET error:", error);
    res.status(500).json({ message: "שגיאה בטעינת נתוני התיירות" });
  }
});

router.post("/", async (req, res) => {
  try {
    const payload = normalize(req.body);
    if (!payload.title) {
      return res.status(400).json({ message: "חובה להזין שם/כותרת" });
    }
    if (payload.scope === "world" && !payload.countryName) {
      return res.status(400).json({ message: "חובה להזין שם מדינה" });
    }
    const item = await Tourism.create(payload);
    res.status(201).json(item);
  } catch (error) {
    console.error("Tourism POST error:", error);
    res.status(500).json({ message: "שגיאה בשמירת נתוני התיירות" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const existing = await Tourism.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "הרשומה לא נמצאה" });

    const payload = normalize({ ...existing.toObject(), ...req.body });
    if (!payload.title) {
      return res.status(400).json({ message: "חובה להזין שם/כותרת" });
    }
    if (payload.scope === "world" && !payload.countryName) {
      return res.status(400).json({ message: "חובה להזין שם מדינה" });
    }

    const item = await Tourism.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    res.json(item);
  } catch (error) {
    console.error("Tourism PUT error:", error);
    res.status(500).json({ message: "שגיאה בעדכון נתוני התיירות" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await Tourism.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "הרשומה לא נמצאה" });
    res.json({ success: true });
  } catch (error) {
    console.error("Tourism DELETE error:", error);
    res.status(500).json({ message: "שגיאה במחיקת הרשומה" });
  }
});

module.exports = router;
