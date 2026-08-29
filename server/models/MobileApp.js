const mongoose = require("mongoose");

const mobileAppSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },

    // mobile (legacy) | android | ios | tv | windows | mac
    type: {
      type: String,
      enum: ["mobile", "android", "ios", "tv", "windows", "mac"],
      default: "mobile",
      index: true,
    },

    platform: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    logoUrl: { type: String, trim: true, default: "" },

    url: { type: String, trim: true, default: "" },
    link: { type: String, trim: true, default: "" },
    websiteUrl: { type: String, trim: true, default: "" },
    storeUrl: { type: String, trim: true, default: "" },
    androidUrl: { type: String, trim: true, default: "" },
    iosUrl: { type: String, trim: true, default: "" },

    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

module.exports =
  mongoose.models.MobileApp ||
  mongoose.model("MobileApp", mobileAppSchema);
