const mongoose = require("mongoose");

const homeServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "מטפלת חירום",
        "דוגסיטר",
        "קאטסיטר",
        "מנקה",
        "מסדרת בגדים",
        "טיפול בגינה",
        "ביביסיטר",
        "מנעולן",
        "חשמלאי",
        "שיפוץ",
      ],
    },
    region: {
      type: String,
      required: true,
      enum: ["צפון", "מרכז", "דרום"],
    },
    phone: { type: String, required: true, trim: true },
    hourlyPrice: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.HomeService ||
  mongoose.model("HomeService", homeServiceSchema);
