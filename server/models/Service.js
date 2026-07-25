const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    professionType: { type: String, required: true, trim: true },
    category: { type: String, default: "שונות", trim: true },
    serviceType: { type: String, required: true, trim: true },
    businessName: { type: String, default: "", trim: true },
    logoUrl: { type: String, default: "", trim: true },
    websiteUrl: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    serviceCities: [{ type: String, trim: true }],
    phone: { type: String, default: "", trim: true },
    acceptsWhatsApp: { type: Boolean, default: false },
    description: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    hours: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    icon: { type: String, default: "🛎️", trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
