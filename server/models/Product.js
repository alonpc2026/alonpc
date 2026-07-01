const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    model: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    gallery: [
      {
        type: String,
      },
    ],

    warranty: {
      type: String,
      default: "",
    },

    sku: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);