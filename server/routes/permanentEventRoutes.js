const express = require("express");
const {
  getPermanentEvents,
  getActivePermanentEvents,
  getPermanentEventById,
  createPermanentEvent,
  updatePermanentEvent,
  deletePermanentEvent,
} = require("../controllers/permanentEventController");

const router = express.Router();
router.get("/", getPermanentEvents);
router.get("/active", getActivePermanentEvents);
router.get("/:id", getPermanentEventById);
router.post("/", createPermanentEvent);
router.put("/:id", updatePermanentEvent);
router.delete("/:id", deletePermanentEvent);

module.exports = router;
