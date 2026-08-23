const mongoose = require("mongoose");

const whatsAppStickerSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    stickerImageUrl: { type: String, required: true, trim: true },
    iconImageUrl: { type: String, default: "", trim: true },
    whatsappText: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "whatsapp_stickers" }
);

module.exports =
  mongoose.models.WhatsAppSticker ||
  mongoose.model("WhatsAppSticker", whatsAppStickerSchema);
