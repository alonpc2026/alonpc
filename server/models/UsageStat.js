const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  day: { type: String, required: true, index: true },
  eventType: { type: String, required: true, enum: ["visit", "click"] },
  key: { type: String, required: true, default: "site" },
  label: { type: String, default: "" },
  count: { type: Number, default: 0 }
}, { timestamps: true, collection: "usage_stats" });

schema.index({ day: 1, eventType: 1, key: 1 }, { unique: true });

module.exports = mongoose.models.UsageStat || mongoose.model("UsageStat", schema);
