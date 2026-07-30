const mongoose = require("mongoose");
const Service = require("../models/Service");

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function bool(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1" || value === 1) return true;
  if (value === "false" || value === "0" || value === 0) return false;
  return fallback;
}


function normalizeOpeningHours(value, fallback = {}) {
  const keys = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const source = value && typeof value === "object" ? value : fallback || {};
  const result = {};
  for (const key of keys) {
    const day = source[key] || {};
    result[key] = { enabled: bool(day.enabled), open: text(day.open), close: text(day.close) };
  }
  return result;
}

function validUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalize(body = {}, existing = null) {
  const current = existing || {};
  const link =
    body.link !== undefined
      ? text(body.link)
      : text(current.link || current.websiteUrl);

  const websiteUrl =
    body.websiteUrl !== undefined
      ? text(body.websiteUrl)
      : text(current.websiteUrl || current.link || link);

  const imageUrl =
    body.imageUrl !== undefined
      ? text(body.imageUrl)
      : text(current.imageUrl || current.logoUrl);

  const logoUrl =
    body.logoUrl !== undefined
      ? text(body.logoUrl)
      : text(current.logoUrl || current.imageUrl || imageUrl);

  return {
    name: body.name !== undefined ? text(body.name) : text(current.name),
    category:
      body.category !== undefined
        ? text(body.category)
        : text(current.category),
    businessName:
      body.businessName !== undefined
        ? text(body.businessName)
        : text(current.businessName),
    logoUrl,
    imageUrl,
    description:
      body.description !== undefined
        ? text(body.description)
        : text(current.description),
    address:
      body.address !== undefined ? text(body.address) : text(current.address),
    city: body.city !== undefined ? text(body.city) : text(current.city),
    phone: body.phone !== undefined ? text(body.phone) : text(current.phone),
    openingHours: body.openingHours !== undefined ? normalizeOpeningHours(body.openingHours) : normalizeOpeningHours(current.openingHours),
    openingHoursNote: body.openingHoursNote !== undefined ? text(body.openingHoursNote) : text(current.openingHoursNote),
    acceptsWhatsApp:
      body.acceptsWhatsApp !== undefined ? bool(body.acceptsWhatsApp) : bool(current.acceptsWhatsApp),
    whatsapp:
      body.whatsapp !== undefined ? text(body.whatsapp) : text(current.whatsapp),
    acceptsEmail:
      body.acceptsEmail !== undefined ? bool(body.acceptsEmail) : bool(current.acceptsEmail),
    email: body.email !== undefined ? text(body.email).toLowerCase() : text(current.email).toLowerCase(),
    link: link || websiteUrl,
    websiteUrl: websiteUrl || link,
    icon: body.icon !== undefined ? text(body.icon) || "♿" : text(current.icon) || "♿",
    supportsSignLanguage:
      body.supportsSignLanguage !== undefined
        ? bool(body.supportsSignLanguage)
        : bool(current.supportsSignLanguage),
    supportsTranscription:
      body.supportsTranscription !== undefined
        ? bool(body.supportsTranscription)
        : bool(current.supportsTranscription),
    active:
      body.active !== undefined ? bool(body.active, true) : current.active !== false,
  };
}

function validate(data) {
  const errors = [];
  if (!data.name) errors.push("חובה להזין שם שירות");
  if (!data.category) errors.push("חובה לבחור קטגוריה");
  if (!validUrl(data.imageUrl)) errors.push("קישור התמונה אינו תקין");
  if (!validUrl(data.logoUrl)) errors.push("קישור הלוגו אינו תקין");
  if (!validUrl(data.link)) errors.push("קישור העסק אינו תקין");
  if (data.acceptsWhatsApp && !data.whatsapp) errors.push("חובה להזין מספר WhatsApp");
  for (const [key, day] of Object.entries(data.openingHours || {})) { if (day.enabled && (!/^([01]\d|2[0-3]):[0-5]\d$/.test(day.open) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(day.close))) errors.push(`שעות פתיחה אינן תקינות עבור ${key}`); }
  if (data.acceptsEmail && !/^\S+@\S+\.\S+$/.test(data.email)) errors.push("כתובת הדואר האלקטרוני אינה תקינה");
  return errors;
}

async function getServices(req, res) {
  try {
    const filter = {};
    if (req.query.active !== undefined) filter.active = bool(req.query.active);
    if (req.query.category) filter.category = new RegExp(text(req.query.category), "i");
    if (req.query.city) filter.city = new RegExp(text(req.query.city), "i");
    if (req.query.supportsSignLanguage !== undefined) {
      filter.supportsSignLanguage = bool(req.query.supportsSignLanguage);
    }
    if (req.query.supportsTranscription !== undefined) {
      filter.supportsTranscription = bool(req.query.supportsTranscription);
    }
    if (req.query.search) {
      const q = text(req.query.search);
      filter.$or = ["name", "businessName", "category", "description", "city", "address"]
        .map((field) => ({ [field]: { $regex: q, $options: "i" } }));
    }
    const services = await Service.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(services);
  } catch (error) {
    console.error("getServices:", error);
    return res.status(500).json({ message: "שגיאה בטעינת השירותים" });
  }
}

async function getServiceById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "מזהה שירות אינו תקין" });
    }
    const service = await Service.findById(req.params.id).lean();
    if (!service) return res.status(404).json({ message: "השירות לא נמצא" });
    return res.json(service);
  } catch (error) {
    return res.status(500).json({ message: "שגיאה בטעינת השירות" });
  }
}

async function createService(req, res) {
  try {
    const data = normalize(req.body);
    const errors = validate(data);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    const service = await Service.create(data);
    return res.status(201).json({ message: "השירות נוסף בהצלחה", service });
  } catch (error) {
    console.error("createService:", error);
    return res.status(500).json({ message: "שגיאה בהוספת השירות" });
  }
}

async function updateService(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "מזהה שירות אינו תקין" });
    }
    const existing = await Service.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "השירות לא נמצא" });
    const data = normalize(req.body, existing.toObject());
    const errors = validate(data);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    Object.assign(existing, data);
    await existing.save();
    return res.json({ message: "השירות עודכן בהצלחה", service: existing });
  } catch (error) {
    console.error("updateService:", error);
    return res.status(500).json({ message: "שגיאה בעדכון השירות" });
  }
}

async function deleteService(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "מזהה שירות אינו תקין" });
    }
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "השירות לא נמצא" });
    return res.json({ message: "השירות נמחק בהצלחה" });
  } catch (error) {
    return res.status(500).json({ message: "שגיאה במחיקת השירות" });
  }
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
