const express = require("express");
const router = express.Router();
const SecondHand = require("../models/SecondHand");

const cleanText = (value) => typeof value === "string" ? value.trim() : "";
const cleanNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};
const cleanBoolean = (value, fallback = false) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return fallback;
};

const buildData = (body = {}) => ({
  name: cleanText(body.name),
  category: cleanText(body.category),
  brand: cleanText(body.brand),
  model: cleanText(body.model),
  condition: cleanText(body.condition) || "מצב טוב",
  price: cleanNumber(body.price),
  oldPrice: cleanNumber(body.oldPrice),
  stock: cleanNumber(body.stock, 1),
  description: cleanText(body.description),
  imageUrl: cleanText(body.imageUrl),
  websiteUrl: cleanText(body.websiteUrl),
  active: cleanBoolean(body.active, true),
  featured: cleanBoolean(body.featured, false),
});

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === "true") filter.active = true;

    const items = await SecondHand.find(filter).sort({
      featured: -1,
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "לא ניתן לטעון מוצרי יד 2", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await SecondHand.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "המוצר לא נמצא" });
    res.json(item);
  } catch {
    res.status(400).json({ message: "מזהה מוצר אינו תקין" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = buildData(req.body);
    if (!data.name) return res.status(400).json({ message: "חובה להזין שם מוצר" });

    const item = await SecondHand.create(data);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: "לא ניתן להוסיף מוצר יד 2", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const data = buildData(req.body);
    if (!data.name) return res.status(400).json({ message: "חובה להזין שם מוצר" });

    const item = await SecondHand.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!item) return res.status(404).json({ message: "המוצר לא נמצא" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "לא ניתן לעדכן מוצר יד 2", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await SecondHand.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "המוצר לא נמצא" });

    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch (error) {
    res.status(400).json({ message: "לא ניתן למחוק מוצר יד 2", error: error.message });
  }
});

module.exports = router;
