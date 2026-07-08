const express = require("express");
const router = express.Router();

const Document = require("../models/Document");

// קבלת כל המסמכים
router.get("/", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// קבלת מסמך לפי מזהה
router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "המסמך לא נמצא",
      });
    }

    res.json(document);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// הוספת מסמך
router.post("/", async (req, res) => {
  try {
    const document = new Document({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      fileUrl: req.body.fileUrl,
    });

    const saved = await document.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// עדכון מסמך
router.put("/:id", async (req, res) => {
  try {
    const updated = await Document.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        fileUrl: req.body.fileUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "המסמך לא נמצא",
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// מחיקת מסמך
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "המסמך לא נמצא",
      });
    }

    res.json({
      success: true,
      message: "המסמך נמחק בהצלחה",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;