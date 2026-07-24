const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// אם יש אצלך middleware של התחברות מנהל,
// אפשר להוסיף אותו לנתיבי POST / PUT / DELETE בהמשך.

// קבלת כל האירועים
router.get("/", getEvents);

// קבלת אירוע אחד לפי מזהה
router.get("/:id", getEventById);

// יצירת אירוע חדש
router.post("/", createEvent);

// עדכון אירוע קיים
router.put("/:id", updateEvent);

// תמיכה גם בעדכון חלקי
router.patch("/:id", updateEvent);

// מחיקת אירוע
router.delete("/:id", deleteEvent);

module.exports = router;