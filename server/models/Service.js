const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    icon: { type: String, default: "💻" },
    link: { type: String, default: "" },
    description: { type: String, default: "" },

    businessName: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    phone: { type: String, default: "" },

    email: { type: String, default: "" },
    hours: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);