const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// הגדרת שמירת הקבצים
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000000) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// העלאת תמונה
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "לא נבחר קובץ",
      });
    }

    res.json({
      success: true,
      message: "התמונה הועלתה בהצלחה",
      imageUrl: `http://localhost:3001/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;