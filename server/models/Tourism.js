const mongoose = require("mongoose");

const tourismSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["world", "israel"],
      required: true,
      index: true,
    },
    countryName: { type: String, trim: true, default: "" },
    flagEmoji: { type: String, trim: true, default: "" },
    flagImageUrl: { type: String, trim: true, default: "" },
    category: {
      type: String,
      enum: ["app", "info", "place", "restaurant", "cafe", "fastFood"],
      required: true,
    },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

tourismSchema.index({ scope: 1, countryName: 1, category: 1, active: 1 });

module.exports =
  mongoose.models.Tourism || mongoose.model("Tourism", tourismSchema);
