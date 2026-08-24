const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true,
      default: ""
    },

    // true for the three national emergency services; false for custom services.
    isCore: {
      type: Boolean,
      default: false
    },

    name: {
      type: String,
      trim: true,
      default: ""
    },

    address: {
      type: String,
      trim: true,
      default: ""
    },

    imageUrl: {
      type: String,
      trim: true,
      default: ""
    },

    phone: {
      type: String,
      trim: true,
      default: ""
    },

    emergencyRequestUrl: {
      type: String,
      trim: true,
      default: ""
    },

    specialContactUrl: {
      type: String,
      trim: true,
      default: ""
    },

    emergencyHours: {
      type: String,
      trim: true,
      default: ""
    },

    accessiblePhone: {
      type: String,
      trim: true,
      default: ""
    },

    whatsappPhone: {
      type: String,
      trim: true,
      default: ""
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    active: {
      type: Boolean,
      default: true
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
