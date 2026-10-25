const express = require("express");
const mongoose = require("mongoose");
const MobileApp = require("../models/MobileApp");

const router = express.Router();

const VALID_TYPES = new Set(["mobile", "tv", "windows", "mac"]);

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function bool(value, fallback = true) {
  if (value === true || value === "true" || value === 1 || value === "1") return true;
  if (value === false || value === "false" || value === 0 || value === "0") return false;
  return fallback;
}

function clean(body = {}, existing = {}) {
  const requestedType = text(body.type || existing.type || "mobile");
  const type = VALID_TYPES.has(requestedType) ? requestedType : "mobile";

  return {
    ...existing,
    ...body,
    name: text(body.name ?? existing.name ?? existing.title),
    title: text(body.title ?? existing.title ?? body.name ?? existing.name),
    description: text(body.description ?? existing.description),
    type,
    platform: text(body.platform ?? existing.platform),
    imageUrl: text(body.imageUrl ?? existing.imageUrl),
    logoUrl: text(body.logoUrl ?? existing.logoUrl),
    url: text(body.url ?? existing.url),
    link: text(body.link ?? existing.link),
    websiteUrl: text(body.websiteUrl ?? existing.websiteUrl),
    storeUrl: text(body.storeUrl ?? existing.storeUrl),
    androidUrl: text(body.androidUrl ?? existing.androidUrl),
    iosUrl: text(body.iosUrl ?? existing.iosUrl),
    active:
      body.active !== undefined
        ? bool(body.active, true)
        : existing.active !== false,
    order:
      Number.isFinite(Number(body.order))
        ? Number(body.order)
        : Number(existing.order || 0),
  };
}

router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.admin !== "true") {
      filter.active = { $ne: false };
    }

    if (req.query.type) {
      const type = text(req.query.type);

      if (type === "mobile") {
        filter.$or = [
          { type: "mobile" },
          { type: { $exists: false } },
          { type: "" },
          { type: null },
        ];
      } else if (VALID_TYPES.has(type)) {
        filter.type = type;
      }
    }

    const apps = await MobileApp.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json(apps);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "מזהה אפליקציה לא תקין" });
    }

    const app = await MobileApp.findById(req.params.id).lean();

    if (!app) {
      return res.status(404).json({ message: "האפליקציה לא נמצאה" });
    }

    res.json(app);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = clean(req.body);

    if (!payload.name && !payload.title) {
      return res.status(400).json({ message: "חובה להזין שם אפליקציה" });
    }

    const app = await MobileApp.create(payload);
    res.status(201).json(app);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "מזהה אפליקציה לא תקין" });
    }

    const existing = await MobileApp.findById(req.params.id).lean();

    if (!existing) {
      return res.status(404).json({ message: "האפליקציה לא נמצאה" });
    }

    const payload = clean(req.body, existing);

    const app = await MobileApp.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.json(app);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "מזהה אפליקציה לא תקין" });
    }

    const app = await MobileApp.findByIdAndDelete(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "האפליקציה לא נמצאה" });
    }

    res.json({ success: true, message: "האפליקציה נמחקה" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
