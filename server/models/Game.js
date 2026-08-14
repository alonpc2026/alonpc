const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ["computer", "android", "apple", "tv"],
      default: "computer",
      index: true,
    },
    platform: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    url: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Game ||
  mongoose.model("Game", gameSchema);
