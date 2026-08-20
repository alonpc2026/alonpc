const mongoose = require("mongoose");

const judaismContentSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["torah-lessons", "help", "study-material", "events"],
      required: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    url: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "judaism_content" }
);

module.exports =
  mongoose.models.JudaismContent ||
  mongoose.model("JudaismContent", judaismContentSchema);
