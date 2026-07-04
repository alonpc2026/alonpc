const Booking = require("../models/Booking");

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      serviceType: req.body.serviceType,
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime,
      details: req.body.details,
      status: "חדש",
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "ההזמנה נמחקה בהצלחה" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  addBooking,
  updateBookingStatus,
  deleteBooking,
};