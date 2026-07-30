const mongoose = require("mongoose");

const mobileAppSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "שם האפליקציה הוא שדה חובה"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1200,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    hasAndroid: {
      type: Boolean,
      default: false,
    },
    androidUrl: {
      type: String,
      trim: true,
      default: "",
    },

    hasIphone: {
      type: Boolean,
      default: false,
    },
    iphoneUrl: {
      type: String,
      trim: true,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

mobileAppSchema.index({
  active: 1,
  featured: -1,
  displayOrder: 1,
  name: 1,
});

module.exports = mongoose.model("MobileApp", mobileAppSchema);
