const express = require("express");

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// הצגת כל המוצרים
router.get("/", getProducts);

// הצגת מוצר אחד לפי מזהה
router.get("/:id", getProductById);

// הוספת מוצר חדש
router.post("/", addProduct);

// עדכון מוצר קיים
router.put("/:id", updateProduct);

// מחיקת מוצר
router.delete("/:id", deleteProduct);

module.exports = router;