const mongoose = require("mongoose");

const secondHandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "", trim: true },
    brand: { type: String, default: "", trim: true },
    model: { type: String, default: "", trim: true },
    condition: { type: String, default: "מצב טוב", trim: true },
    price: { type: Number, default: 0, min: 0 },
    oldPrice: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 1, min: 0 },
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    websiteUrl: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true, collection: "secondhands" }
);

module.exports =
  mongoose.models.SecondHand ||
  mongoose.model("SecondHand", secondHandSchema);
