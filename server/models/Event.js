const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "שם האירוע הוא שדה חובה"],
      trim: true,
      maxlength: 180,
    },
    date: {
      type: String,
      required: [true, "תאריך האירוע הוא שדה חובה"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "התאריך חייב להיות בפורמט YYYY-MM-DD"],
      index: true,
    },
    time: {
      type: String,
      default: "",
      trim: true,
      match: [/^$|^\d{2}:\d{2}$/, "השעה חייבת להיות בפורמט HH:MM"],
    },
    city: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    location: {
      type: String,
      default: "",
      trim: true,
      maxlength: 220,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 3000,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model("Event", eventSchema);
