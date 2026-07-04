const express = require("express");

const {
  getBookings,
  addBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/", getBookings);
router.post("/", addBooking);
router.put("/:id", updateBookingStatus);
router.delete("/:id", deleteBooking);

module.exports = router;