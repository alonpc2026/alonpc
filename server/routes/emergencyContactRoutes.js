const express = require("express");
const router = express.Router();
const EmergencyContact = require("../models/EmergencyContact");

const DEFAULTS = [
  {
    key: "police",
    isCore: true,
    name: "משטרה",
    phone: "100",
    emergencyRequestUrl: "",
    specialContactUrl: "",
    emergencyHours: "24/7",
    accessiblePhone: "",
    address: "",
    imageUrl: "",
    description: "משטרת ישראל",
    active: true
  },
  {
    key: "mada",
    isCore: true,
    name: "מגן דוד אדום",
    phone: "101",
    emergencyRequestUrl: "",
    specialContactUrl: "",
    emergencyHours: "24/7",
    accessiblePhone: "",
    address: "",
    imageUrl: "",
    description: "שירותי רפואת חירום",
    active: true
  },
  {
    key: "fire",
    isCore: true,
    name: "כבאות והצלה",
    phone: "102",
    emergencyRequestUrl: "",
    specialContactUrl: "",
    emergencyHours: "24/7",
    accessiblePhone: "",
    address: "",
    imageUrl: "",
    description: "כבאות והצלה לישראל",
    active: true
  }
];

async function ensureCoreServices() {
  for (const item of DEFAULTS) {
    await EmergencyContact.findOneAndUpdate(
      { key: item.key },
      { $setOnInsert: item },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

router.get("/", async (req, res) => {
  try {
    await ensureCoreServices();

    const filter = req.query.admin === "true" ? {} : { active: true };
    const items = await EmergencyContact.find(filter).sort({
      isCore: -1,
      createdAt: 1
    });

    res.json(items);
  } catch (error) {
    console.error("Load emergency contacts error:", error);
    res.status(500).json({ message: "לא ניתן לטעון פרטי חירום" });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const emergencyRequestUrl = String(req.body.emergencyRequestUrl || "").trim();

    if (!name) {
      return res.status(400).json({ message: "חובה להזין שם שירות" });
    }

    if (!phone && !emergencyRequestUrl) {
      return res.status(400).json({
        message: "חובה להזין לפחות טלפון או קישור לפנייה בחירום"
      });
    }

    const customKey =
      `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const item = await EmergencyContact.create({
      key: customKey,
      isCore: false,
      name,
      address: String(req.body.address || "").trim(),
      imageUrl: String(req.body.imageUrl || "").trim(),
      phone,
      emergencyRequestUrl,
      specialContactUrl: String(req.body.specialContactUrl || "").trim(),
      emergencyHours: String(req.body.emergencyHours || "").trim(),
      accessiblePhone: String(req.body.accessiblePhone || "").trim(),
      description: String(req.body.description || "").trim(),
      active: req.body.active !== false
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Create emergency contact error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        message: "התנגשות במסד הנתונים. נסה שוב לאחר רענון."
      });
    }

    res.status(500).json({
      message: "לא ניתן להוסיף שירות חירום",
      detail: error.message
    });
  }
});

router.put("/:idOrKey", async (req, res) => {
  try {
    const idOrKey = String(req.params.idOrKey || "").trim();

    let item = await EmergencyContact.findOne({ key: idOrKey });

    if (!item && idOrKey.match(/^[a-fA-F0-9]{24}$/)) {
      item = await EmergencyContact.findById(idOrKey);
    }

    if (!item) {
      return res.status(404).json({ message: "שירות החירום לא נמצא" });
    }

    if (item.isCore) {
      // Core services keep their fixed national phone numbers and names.
      item.accessiblePhone = String(req.body.accessiblePhone || "").trim();
      item.emergencyRequestUrl = String(req.body.emergencyRequestUrl || "").trim();
      item.specialContactUrl = String(req.body.specialContactUrl || "").trim();
      item.emergencyHours = String(req.body.emergencyHours || "").trim();
      item.address = String(req.body.address || item.address || "").trim();
      item.imageUrl = String(req.body.imageUrl || item.imageUrl || "").trim();
      item.description = String(req.body.description || item.description || "").trim();
    } else {
      item.name = String(req.body.name || "").trim();
      item.address = String(req.body.address || "").trim();
      item.imageUrl = String(req.body.imageUrl || "").trim();
      item.phone = String(req.body.phone || "").trim();
      item.emergencyRequestUrl = String(req.body.emergencyRequestUrl || "").trim();
      item.specialContactUrl = String(req.body.specialContactUrl || "").trim();
      item.emergencyHours = String(req.body.emergencyHours || "").trim();
      item.accessiblePhone = String(req.body.accessiblePhone || "").trim();
      item.description = String(req.body.description || "").trim();
      item.active = req.body.active !== false;

      if (!item.name) {
        return res.status(400).json({ message: "חובה להזין שם שירות" });
      }
      if (!item.phone && !item.emergencyRequestUrl) {
        return res.status(400).json({
          message: "חובה להזין לפחות טלפון או קישור לפנייה בחירום"
        });
      }
    }

    await item.save();
    res.json(item);
  } catch (error) {
    console.error("Update emergency contact error:", error);
    res.status(500).json({ message: "לא ניתן לעדכן שירות חירום" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await EmergencyContact.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "שירות החירום לא נמצא" });
    }

    if (item.isCore) {
      return res.status(400).json({ message: "לא ניתן למחוק שירות חירום לאומי קבוע" });
    }

    await item.deleteOne();
    res.json({ message: "שירות החירום נמחק" });
  } catch (error) {
    console.error("Delete emergency contact error:", error);
    res.status(500).json({ message: "לא ניתן למחוק שירות חירום" });
  }
});

module.exports = router;
