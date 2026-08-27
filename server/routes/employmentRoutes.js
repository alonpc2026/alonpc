const router = require("express").Router();
const Employment = require("../models/Employment");

router.get("/", async (req, res) => {
  try {
    const rows = await Employment.find({}).sort({ createdAt: -1 }).lean();
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "לא ניתן לטעון תעסוקה",
      detail: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const row = await Employment.create(req.body);
    res.status(201).json(row);
  } catch (error) {
    res.status(400).json({
      message: "לא ניתן להוסיף עסק לתעסוקה",
      detail: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const row = await Employment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!row) {
      return res.status(404).json({ message: "העסק לא נמצא" });
    }

    res.json(row);
  } catch (error) {
    res.status(400).json({
      message: "לא ניתן לעדכן עסק",
      detail: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Employment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({
      message: "לא ניתן למחוק עסק",
      detail: error.message
    });
  }
});

module.exports = router;
