const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ["police", "mada", "fire"],
      required: true,
      unique: true,
      index: true
    },
    accessiblePhone: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true,
    collection: "emergency_contacts"
  }
);

module.exports =
  mongoose.models.EmergencyContact ||
  mongoose.model("EmergencyContact", emergencyContactSchema);
