const express = require("express");
const InterestingSite = require("../models/InterestingSite");

const router = express.Router();

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function normalizeUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function cleanPayload(body = {}) {
  const backgroundColor = HEX_COLOR.test(String(body.backgroundColor || ""))
    ? body.backgroundColor
    : "#0047AB";

  const textColor = HEX_COLOR.test(String(body.textColor || ""))
    ? body.textColor
    : "#FFF200";

  return {
    name: String(body.name || "").trim(),
    url: normalizeUrl(body.url),
    description: String(body.description || "").trim(),
    category: String(body.category || "אחר").trim() || "אחר",
    imageUrl: String(body.imageUrl || "").trim(),
    colorPreset: String(body.colorPreset || "blue-yellow").trim(),
    backgroundColor,
    textColor,
    isAccessiblePreset: Boolean(body.isAccessiblePreset),
    isFeatured: Boolean(body.isFeatured),
    isActive: body.isActive !== false,
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
  };
}

/* ציבורי: אתרים פעילים בלבד */
router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.admin !== "true") {
      filter.isActive = true;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const sites = await InterestingSite.find(filter)
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean();

    res.json(sites);
  } catch (error) {
    next(error);
  }
});

/* רשימת קטגוריות שנמצאות בפועל במאגר */
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await InterestingSite.distinct("category", {
      category: { $nin: ["", null] },
    });

    res.json(
      categories
        .map((item) => String(item).trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "he"))
    );
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const site = await InterestingSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({ message: "האתר לא נמצא" });
    }

    res.json(site);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = cleanPayload(req.body);

    if (!payload.name || !payload.url) {
      return res.status(400).json({
        message: "חובה להזין שם אתר וכתובת קישור",
      });
    }

    const site = await InterestingSite.create(payload);
    res.status(201).json(site);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const payload = cleanPayload(req.body);

    if (!payload.name || !payload.url) {
      return res.status(400).json({
        message: "חובה להזין שם אתר וכתובת קישור",
      });
    }

    const site = await InterestingSite.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!site) {
      return res.status(404).json({ message: "האתר לא נמצא" });
    }

    res.json(site);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const site = await InterestingSite.findByIdAndDelete(req.params.id);

    if (!site) {
      return res.status(404).json({ message: "האתר לא נמצא" });
    }

    res.json({ success: true, message: "האתר נמחק" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
