const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    businessUrl: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Employment ||
  mongoose.model("Employment", schema);
