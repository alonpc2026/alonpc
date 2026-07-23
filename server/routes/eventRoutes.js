const express = require("express");
const controller = require("../controllers/eventController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", controller.getPublicEvents);
router.get("/admin", auth, admin, controller.getAdminEvents);
router.post("/", auth, admin, controller.createEvent);
router.put("/:id", auth, admin, controller.updateEvent);
router.delete("/:id", auth, admin, controller.deleteEvent);

module.exports = router;
