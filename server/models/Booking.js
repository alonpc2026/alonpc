const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    serviceType: {
      type: String,
      required: true,
    },

    preferredDate: {
      type: String,
      default: "",
    },

    preferredTime: {
      type: String,
      default: "",
    },

    details: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "חדש",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);