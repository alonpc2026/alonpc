const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

// כל האירועים לניהול:
// חשוב שהנתיב /admin יופיע לפני /:id,
// אחרת Express מפרש את המילה "admin" כאילו היא מזהה אירוע.
router.get("/admin", getEvents);

// רשימת אירועים ציבורית
router.get("/", getEvents);

// אירוע אחד לפי מזהה
router.get("/:id", getEventById);

// יצירת אירוע
router.post("/", createEvent);

// עדכון אירוע
router.put("/:id", updateEvent);
router.patch("/:id", updateEvent);

// מחיקת אירוע
router.delete("/:id", deleteEvent);

module.exports = router;
