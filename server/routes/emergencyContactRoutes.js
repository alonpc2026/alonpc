const express = require("express");
const router = express.Router();
const EmergencyContact = require("../models/EmergencyContact");

const DEFAULTS = [
  { key: "police", number: "100", accessiblePhone: "" },
  { key: "mada", number: "101", accessiblePhone: "" },
  { key: "fire", number: "102", accessiblePhone: "" }
];

router.get("/", async (req, res) => {
  try {
    const saved = await EmergencyContact.find({}).lean();
    const map = Object.fromEntries(saved.map((item) => [item.key, item]));

    res.json(
      DEFAULTS.map((item) => ({
        ...item,
        accessiblePhone: map[item.key]?.accessiblePhone || ""
      }))
    );
  } catch (error) {
    console.error("Load emergency contacts error:", error);
    res.status(500).json({ message: "לא ניתן לטעון פרטי חירום נגישים" });
  }
});

router.put("/:key", async (req, res) => {
  try {
    const key = String(req.params.key || "").trim().toLowerCase();

    if (!["police", "mada", "fire"].includes(key)) {
      return res.status(400).json({ message: "שירות חירום לא תקין" });
    }

    const accessiblePhone = String(req.body.accessiblePhone || "").trim();

    const item = await EmergencyContact.findOneAndUpdate(
      { key },
      { key, accessiblePhone },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "המספר הנגיש נשמר", contact: item });
  } catch (error) {
    console.error("Save emergency contact error:", error);
    res.status(500).json({ message: "לא ניתן לשמור את המספר הנגיש" });
  }
});

module.exports = router;
