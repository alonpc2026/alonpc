const mongoose = require("mongoose");
const Event = require("../models/Event");

const ACCESS_KEYS = [
  "transcription", "captions", "signLanguage", "hearingLoop",
  "wheelchairAccess", "accessibleParking", "accessibleRestrooms", "writtenContact",
];

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");
const toBool = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (["true", "1", 1].includes(value)) return true;
  if (["false", "0", 0].includes(value)) return false;
  return fallback;
};
const normalizeDate = (value) => {
  const text = cleanText(value);
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
const normalizeTime = (value) => {
  const text = cleanText(value);
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(text) ? text : "";
};
const normalizeArray = (value, fallback = []) => {
  const array = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : fallback;
  return [...new Set(array.map(cleanText).filter(Boolean))];
};
const validUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

function normalizeEventData(body = {}, existing = null) {
  const previous = existing || {};
  const startDate = normalizeDate(body.startDate ?? body.date) || normalizeDate(previous.startDate ?? previous.date);
  const endDate = normalizeDate(body.endDate) || startDate || normalizeDate(previous.endDate);
  const allDay = body.allDay !== undefined ? toBool(body.allDay) : toBool(previous.allDay);
  const startTime = allDay ? "" : normalizeTime(body.startTime ?? body.time) || normalizeTime(previous.startTime ?? previous.time);
  const endTime = allDay ? "" : normalizeTime(body.endTime) || normalizeTime(previous.endTime);
  const previousAccess = previous.accessibility || {};
  const incomingAccess = body.accessibility || {};
  const accessibility = {};
  ACCESS_KEYS.forEach((key) => {
    accessibility[key] = incomingAccess[key] !== undefined ? toBool(incomingAccess[key]) : toBool(previousAccess[key]);
  });

  return {
    title: body.title !== undefined ? cleanText(body.title) : cleanText(previous.title),
    description: body.description !== undefined ? cleanText(body.description) : cleanText(previous.description),
    city: body.city !== undefined ? cleanText(body.city) : cleanText(previous.city),
    location: body.location !== undefined ? cleanText(body.location) : cleanText(previous.location),
    website: body.website !== undefined ? cleanText(body.website) : cleanText(previous.website),
    imageUrl: body.imageUrl !== undefined ? cleanText(body.imageUrl) : cleanText(previous.imageUrl),
    startDate,
    endDate,
    startTime,
    endTime,
    allDay,
    active: body.active !== undefined ? toBool(body.active, true) : previous.active !== false,
    accessibility,
    languages: body.languages !== undefined ? normalizeArray(body.languages) : normalizeArray(previous.languages),
    captionLanguages: body.captionLanguages !== undefined ? normalizeArray(body.captionLanguages) : normalizeArray(previous.captionLanguages),
    signLanguages: body.signLanguages !== undefined ? normalizeArray(body.signLanguages) : normalizeArray(previous.signLanguages),
    date: startDate,
    time: startTime,
  };
}

function validate(data) {
  const errors = [];
  if (!data.title) errors.push("חובה להזין שם אירוע");
  if (!data.startDate) errors.push("חובה להזין תאריך התחלה");
  if (!data.endDate) errors.push("חובה להזין תאריך סיום");
  if (data.startDate && data.endDate && data.endDate < data.startDate) errors.push("תאריך הסיום לא יכול להיות לפני תאריך ההתחלה");
  if (!data.allDay && data.startDate === data.endDate && data.startTime && data.endTime && data.endTime < data.startTime) errors.push("שעת הסיום לא יכולה להיות לפני שעת ההתחלה");
  if (!validUrl(data.website)) errors.push("כתובת אתר האירוע אינה תקינה");
  if (!validUrl(data.imageUrl)) errors.push("כתובת תמונת האירוע אינה תקינה");
  return errors;
}

async function getEvents(req, res) {
  try {
    const filter = {};
    if (req.query.active !== undefined) filter.active = toBool(req.query.active);
    if (req.query.city) filter.city = { $regex: cleanText(req.query.city), $options: "i" };
    if (req.query.search) {
      const q = cleanText(req.query.search);
      filter.$or = ["title", "description", "city", "location"].map((field) => ({ [field]: { $regex: q, $options: "i" } }));
    }
    if (req.query.includePast === "false") {
      const today = new Date().toISOString().slice(0, 10);
      filter.$or = [...(filter.$or || []), { endDate: { $gte: today } }, { endDate: { $in: ["", null] }, startDate: { $gte: today } }];
    }
    const events = await Event.find(filter).sort({ startDate: 1, startTime: 1 }).lean();
    res.status(200).json(events.map((item) => ({ ...item, ...normalizeEventData({}, item) })));
  } catch (error) {
    console.error("getEvents error:", error);
    res.status(500).json({ message: "אירעה שגיאה בטעינת האירועים" });
  }
}

async function getEventById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "מזהה האירוע אינו תקין" });
    const item = await Event.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "האירוע לא נמצא" });
    res.json({ ...item, ...normalizeEventData({}, item) });
  } catch (error) {
    console.error("getEventById error:", error);
    res.status(500).json({ message: "אירעה שגיאה בטעינת האירוע" });
  }
}

async function createEvent(req, res) {
  try {
    const data = normalizeEventData(req.body);
    const errors = validate(data);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    const event = await Event.create(data);
    res.status(201).json({ message: "האירוע נוסף בהצלחה", event });
  } catch (error) {
    console.error("createEvent error:", error);
    res.status(500).json({ message: error.message || "אירעה שגיאה בהוספת האירוע" });
  }
}

async function updateEvent(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "מזהה האירוע אינו תקין" });
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "האירוע לא נמצא" });
    const data = normalizeEventData(req.body, event.toObject());
    const errors = validate(data);
    if (errors.length) return res.status(400).json({ message: errors[0], errors });
    Object.assign(event, data);
    await event.save();
    res.json({ message: "האירוע עודכן בהצלחה", event });
  } catch (error) {
    console.error("updateEvent error:", error);
    res.status(500).json({ message: error.message || "אירעה שגיאה בעדכון האירוע" });
  }
}

async function deleteEvent(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: "מזהה האירוע אינו תקין" });
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "האירוע לא נמצא" });
    res.json({ message: "האירוע נמחק בהצלחה" });
  } catch (error) {
    console.error("deleteEvent error:", error);
    res.status(500).json({ message: "אירעה שגיאה במחיקת האירוע" });
  }
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
