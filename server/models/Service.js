const mongoose = require("mongoose");

const daySchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    open: { type: String, default: "" },
    close: { type: String, default: "" },
  },
  { _id: false }
);

const openingHoursSchema = new mongoose.Schema(
  {
    sunday: { type: daySchema, default: () => ({}) },
    monday: { type: daySchema, default: () => ({}) },
    tuesday: { type: daySchema, default: () => ({}) },
    wednesday: { type: daySchema, default: () => ({}) },
    thursday: { type: daySchema, default: () => ({}) },
    friday: { type: daySchema, default: () => ({}) },
    saturday: { type: daySchema, default: () => ({}) },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ["business", "government"],
      default: "business",
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 180 },
    category: { type: String, required: true, trim: true, maxlength: 120 },
    businessName: { type: String, trim: true, default: "" },
    icon: { type: String, trim: true, default: "🏛️" },
    cardColor: { type: String, trim: true, default: "#0b5ed7" },
    displayOrder: { type: Number, default: 0 },
    logoUrl: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },

    accessiblePhone: { type: String, trim: true, default: "" },
    accessiblePhoneType: {
      type: String,
      enum: ["", "SMS", "WhatsApp", "טלפון", "וידאו", "צ׳אט", "אחר"],
      default: "",
    },
    accessibleEmail: { type: String, trim: true, lowercase: true, default: "" },
    accessibilityNote: { type: String, trim: true, default: "", maxlength: 1000 },

    acceptsWhatsApp: { type: Boolean, default: false },
    whatsapp: { type: String, trim: true, default: "" },
    acceptsEmail: { type: Boolean, default: false },
    email: { type: String, trim: true, lowercase: true, default: "" },
    hasInstagram: { type: Boolean, default: false },
    instagramUrl: { type: String, trim: true, default: "" },
    hasFacebook: { type: Boolean, default: false },
    facebookUrl: { type: String, trim: true, default: "" },
    hasTikTok: { type: Boolean, default: false },
    tiktokUrl: { type: String, trim: true, default: "" },
    hasWaze: { type: Boolean, default: false },
    wazeUrl: { type: String, trim: true, default: "" },
    link: { type: String, trim: true, default: "" },
    websiteUrl: { type: String, trim: true, default: "" },
    openingHours: { type: openingHoursSchema, default: () => ({}) },
    openingHoursNote: { type: String, trim: true, default: "", maxlength: 1000 },
    supportsSignLanguage: { type: Boolean, default: false },
    supportsTranscription: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.Service || mongoose.model("Service", serviceSchema);
