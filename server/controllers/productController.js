const Product = require("../models/Product");

// הצגת כל המוצרים
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// הוספת מוצר
const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      model: req.body.model,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      gallery: req.body.gallery,
      warranty: req.body.warranty,
      sku: req.body.sku,
      active: req.body.active,
      featured: req.body.featured,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// עדכון מוצר
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        brand: req.body.brand,
        model: req.body.model,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        gallery: req.body.gallery,
        warranty: req.body.warranty,
        sku: req.body.sku,
        active: req.body.active,
        featured: req.body.featured,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// מחיקת מוצר
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "המוצר נמחק בהצלחה" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};