const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180 },
    category: { type: String, required: true, trim: true, maxlength: 120 },
    businessName: { type: String, trim: true, default: "", maxlength: 180 },
    logoUrl: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "", maxlength: 5000 },
    address: { type: String, trim: true, default: "", maxlength: 250 },
    city: { type: String, trim: true, default: "", maxlength: 120 },
    phone: { type: String, trim: true, default: "", maxlength: 40 },
    link: { type: String, trim: true, default: "" },
    websiteUrl: { type: String, trim: true, default: "" },
    icon: { type: String, trim: true, default: "♿" },
    supportsSignLanguage: { type: Boolean, default: false, index: true },
    supportsTranscription: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

serviceSchema.pre("validate", function normalize(next) {
  this.websiteUrl = this.websiteUrl || this.link || "";
  this.link = this.link || this.websiteUrl || "";
  this.imageUrl = this.imageUrl || this.logoUrl || "";
  this.logoUrl = this.logoUrl || this.imageUrl || "";
  next();
});

module.exports =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
