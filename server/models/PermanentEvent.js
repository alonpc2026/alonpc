const mongoose = require("mongoose");

const permanentEventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    document: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    accessibility: { type: String, default: "", trim: true },
    languages: { type: [String], default: [] },
    openingHours: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PermanentEvent", permanentEventSchema);
