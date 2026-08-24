const mongoose = require("mongoose");

const signLanguageCourseSchema = new mongoose.Schema(
  {
    placeName: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    startDate: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "sign_language_courses" }
);

module.exports =
  mongoose.models.SignLanguageCourse ||
  mongoose.model("SignLanguageCourse", signLanguageCourseSchema);
