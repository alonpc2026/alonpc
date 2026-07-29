const mongoose = require("mongoose");

const interestingSiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "חובה להזין שם אתר"],
      trim: true,
      maxlength: 120,
    },
    url: {
      type: String,
      required: [true, "חובה להזין קישור לאתר"],
      trim: true,
      maxlength: 1000,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 800,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "אחר",
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    colorPreset: {
      type: String,
      trim: true,
      default: "blue-yellow",
    },
    backgroundColor: {
      type: String,
      trim: true,
      default: "#0047AB",
    },
    textColor: {
      type: String,
      trim: true,
      default: "#FFF200",
    },
    isAccessiblePreset: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

interestingSiteSchema.index({ category: 1, order: 1, createdAt: -1 });

module.exports = mongoose.model("InterestingSite", interestingSiteSchema);
