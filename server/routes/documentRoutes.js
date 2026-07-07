onst express = require("express");
const router = express.Router();

const Document = require("../models/Document");

// קבלת כל המסמכים
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// הוספת מסמך
router.post("/", async (req, res) => {
  try {
    const document = new Document(req.body);
    await document.save();
    res.status(201).json(document);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// עדכון מסמך
router.put("/:id", async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: "המסמך לא נמצא" });
    }

    res.json(document);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// מחיקת מסמך
router.delete("/:id", async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "המסמך לא נמצא" });
    }

    res.json({ message: "המסמך נמחק בהצלחה" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;