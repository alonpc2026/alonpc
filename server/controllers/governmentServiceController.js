const mongoose = require("mongoose");
const GovernmentService = require("../models/GovernmentService");

const text = (v) => (typeof v === "string" ? v.trim() : "");
const bool = (v, fallback = false) => {
  if (typeof v === "boolean") return v;
  if (["true", "1", 1].includes(v)) return true;
  if (["false", "0", 0].includes(v)) return false;
  return fallback;
};
const number = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeOpeningHours = (value, fallback = {}) => {
  const keys=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]; const src=value&&typeof value==="object"?value:fallback||{}; const out={};
  keys.forEach(k=>{const d=src[k]||{};out[k]={enabled:bool(d.enabled),open:text(d.open),close:text(d.close)}}); return out;
};

const validUrl = (v) => {
  if (!v) return true;
  try { const u = new URL(v); return ["http:", "https:"].includes(u.protocol); } catch { return false; }
};
const validEmail = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function normalize(body = {}, existing = {}) {
  return {
    bodyName: body.bodyName !== undefined ? text(body.bodyName) : text(existing.bodyName),
    department: body.department !== undefined ? text(body.department) : text(existing.department),
    category: body.category !== undefined ? text(body.category) : text(existing.category),
    description: body.description !== undefined ? text(body.description) : text(existing.description),
    imageUrl: body.imageUrl !== undefined ? text(body.imageUrl) : text(existing.imageUrl),
    websiteUrl: body.websiteUrl !== undefined ? text(body.websiteUrl) : text(existing.websiteUrl),
    formsUrl: body.formsUrl !== undefined ? text(body.formsUrl) : text(existing.formsUrl),
    appointmentUrl: body.appointmentUrl !== undefined ? text(body.appointmentUrl) : text(existing.appointmentUrl),
    email: body.email !== undefined ? text(body.email) : text(existing.email),
    phone: body.phone !== undefined ? text(body.phone) : text(existing.phone),
    whatsapp: body.whatsapp !== undefined ? text(body.whatsapp) : text(existing.whatsapp),
    address: body.address !== undefined ? text(body.address) : text(existing.address),
    city: body.city !== undefined ? text(body.city) : text(existing.city),
    openingHours: body.openingHours !== undefined ? normalizeOpeningHours(body.openingHours) : normalizeOpeningHours(existing.openingHours),
    openingHoursNote: body.openingHoursNote !== undefined ? text(body.openingHoursNote) : text(existing.openingHoursNote),
    contactPerson: body.contactPerson !== undefined ? text(body.contactPerson) : text(existing.contactPerson),
    branchNumber: body.branchNumber !== undefined ? text(body.branchNumber) : text(existing.branchNumber),
    mapUrl: body.mapUrl !== undefined ? text(body.mapUrl) : text(existing.mapUrl),
    videoUrl: body.videoUrl !== undefined ? text(body.videoUrl) : text(existing.videoUrl),
    featured: body.featured !== undefined ? bool(body.featured) : bool(existing.featured),
    active: body.active !== undefined ? bool(body.active, true) : existing.active !== false,
    displayOrder: body.displayOrder !== undefined ? number(body.displayOrder) : number(existing.displayOrder),
  };
}

function validate(data) {
  const errors = [];
  if (!data.bodyName) errors.push("חובה להזין שם גוף");
  if (!data.category) errors.push("חובה לבחור סוג קטגוריה");
  ["imageUrl","websiteUrl","formsUrl","appointmentUrl","mapUrl","videoUrl"].forEach((k) => {
    if (!validUrl(data[k])) errors.push(`כתובת ${k} אינה תקינה`);
  });
  if (!validEmail(data.email)) errors.push("כתובת הדואר האלקטרוני אינה תקינה");
  return errors;
}

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== undefined) filter.active = bool(req.query.active);
    if (req.query.category) filter.category = text(req.query.category);
    const items = await GovernmentService.find(filter).sort({ featured: -1, displayOrder: 1, bodyName: 1 });
    res.json(items);
  } catch (e) { res.status(500).json({ message: "שגיאה בטעינת הגופים" }); }
};
exports.getOne = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "מזהה לא תקין" });
  const item = await GovernmentService.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "הגוף לא נמצא" });
  res.json(item);
};
exports.create = async (req, res) => {
  try {
    const data = normalize(req.body);
    const errors = validate(data);
    if (errors.length) return res.status(400).json({ message: errors.join(". ") });
    const item = await GovernmentService.create(data);
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ message: "שגיאה ביצירת הגוף" }); }
};
exports.update = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "מזהה לא תקין" });
    const existing = await GovernmentService.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "הגוף לא נמצא" });
    const data = normalize(req.body, existing.toObject());
    const errors = validate(data);
    if (errors.length) return res.status(400).json({ message: errors.join(". ") });
    Object.assign(existing, data);
    await existing.save();
    res.json(existing);
  } catch (e) { res.status(500).json({ message: "שגיאה בעדכון הגוף" }); }
};
exports.remove = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "מזהה לא תקין" });
    const item = await GovernmentService.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "הגוף לא נמצא" });
    res.json({ message: "הגוף נמחק" });
  } catch (e) { res.status(500).json({ message: "שגיאה במחיקה" }); }
};
