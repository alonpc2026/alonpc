const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: "", trim: true },
  city: { type: String, required: true, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: "" },
  place: { type: String, default: "" },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  link: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.SignLanguageCourse ||
  mongoose.model("SignLanguageCourse", schema);
