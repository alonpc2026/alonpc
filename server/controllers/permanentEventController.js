const PermanentEvent = require("../models/PermanentEvent");

function normalizeBody(body = {}) {
  return {
    name: String(body.name || "").trim(),
    city: String(body.city || "").trim(),
    address: String(body.address || "").trim(),
    website: String(body.website || "").trim(),
    document: String(body.document || "").trim(),
    image: String(body.image || "").trim(),
    description: String(body.description || "").trim(),
    accessibility: String(body.accessibility || "").trim(),
    languages: Array.isArray(body.languages)
      ? body.languages.map((item) => String(item).trim()).filter(Boolean)
      : [],
    openingHours: String(body.openingHours || "").trim(),
    active: body.active !== false,
  };
}

exports.getPermanentEvents = async (req, res) => {
  try {
    const items = await PermanentEvent.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error("Get permanent events error:", error);
    return res.status(500).json({ success: false, message: "לא ניתן לטעון אירועים קבועים" });
  }
};

exports.getActivePermanentEvents = async (req, res) => {
  try {
    const items = await PermanentEvent.find({ active: true }).sort({ name: 1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error("Get active permanent events error:", error);
    return res.status(500).json({ success: false, message: "לא ניתן לטעון מקומות פעילים" });
  }
};

exports.getPermanentEventById = async (req, res) => {
  try {
    const item = await PermanentEvent.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "המקום לא נמצא" });
    return res.status(200).json(item);
  } catch (error) {
    console.error("Get permanent event error:", error);
    return res.status(500).json({ success: false, message: "לא ניתן לטעון את המקום" });
  }
};

exports.createPermanentEvent = async (req, res) => {
  try {
    const data = normalizeBody(req.body);
    if (!data.name) return res.status(400).json({ success: false, message: "חובה להזין שם מקום" });
    const item = await PermanentEvent.create(data);
    return res.status(201).json({ success: true, message: "המקום נוסף בהצלחה", permanentEvent: item });
  } catch (error) {
    console.error("Create permanent event error:", error);
    return res.status(500).json({ success: false, message: "לא ניתן להוסיף את המקום" });
  }
};

exports.updatePermanentEvent = async (req, res) => {
  try {
    const data = normalizeBody(req.body);
    if (!data.name) return res.status(400).json({ success: false, message: "חובה להזין שם מקום" });
    const item = await PermanentEvent.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ success: false, message: "המקום לא נמצא" });
    return res.status(200).json({ success: true, message: "המקום עודכן בהצלחה", permanentEvent: item });
  } catch (error) {
    console.error("Update permanent event error:", error);
    return res.status(500).json({ success: false, message: "לא ניתן לעדכן את המקום" });
  }
};

exports.deletePermanentEvent = async (req, res) => {
  try {
    const item = await PermanentEvent.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "המקום לא נמצא" });
    return res.status(200).json({ success: true, message: "המקום נמחק בהצלחה" });
  } catch (error) {
    console.error("Delete permanent event error:", error);
    return res.status(500).json({ success: false, message: "לא ניתן למחוק את המקום" });
  }
};
