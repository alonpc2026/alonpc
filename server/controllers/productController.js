const Product = require("../models/Product");

const cleanText = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const cleanNumber = (value, defaultValue = 0) => {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return defaultValue;
  }

  return number;
};

const cleanBoolean = (value, defaultValue = false) => {
  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return defaultValue;
};

const cleanGallery = (gallery) => {
  if (!Array.isArray(gallery)) {
    return [];
  }

  return gallery
    .map((item) => cleanText(item))
    .filter(Boolean);
};

const buildProductData = (body) => {
  return {
    name: cleanText(body.name),
    category: cleanText(body.category),
    brand: cleanText(body.brand),
    model: cleanText(body.model),

    price: cleanNumber(body.price),
    oldPrice: cleanNumber(body.oldPrice),
    stock: cleanNumber(body.stock),

    description: cleanText(body.description),
    specifications: cleanText(body.specifications),

    imageUrl: cleanText(body.imageUrl),
    gallery: cleanGallery(body.gallery),

    videoUrl: cleanText(body.videoUrl),
    websiteUrl: cleanText(body.websiteUrl),

    condition: cleanText(body.condition) || "חדש",
    warranty: cleanText(body.warranty),
    sku: cleanText(body.sku),

    active: cleanBoolean(body.active, true),
    featured: cleanBoolean(body.featured, false),

    createdBy: cleanText(body.createdBy) || "admin",
  };
};

// הצגת כל המוצרים
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "לא ניתן לטעון את המוצרים",
      error: error.message,
    });
  }
};

// הצגת מוצר אחד לפי מזהה
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "המוצר לא נמצא",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);

    res.status(400).json({
      message: "מזהה המוצר אינו תקין",
      error: error.message,
    });
  }
};

// הוספת מוצר
const addProduct = async (req, res) => {
  try {
    const productData = buildProductData(req.body);

    if (!productData.name) {
      return res.status(400).json({
        message: "חובה להזין שם מוצר",
      });
    }

    if (!productData.category) {
      return res.status(400).json({
        message: "חובה לבחור קטגוריה",
      });
    }

    if (productData.price <= 0) {
      return res.status(400).json({
        message: "חובה להזין מחיר תקין",
      });
    }

    const product = await Product.create(productData);

    res.status(201).json(product);
  } catch (error) {
    console.error("Add product error:", error);

    res.status(400).json({
      message: "לא ניתן להוסיף את המוצר",
      error: error.message,
    });
  }
};

// עדכון מוצר
const updateProduct = async (req, res) => {
  try {
    const productData = buildProductData(req.body);

    if (!productData.name) {
      return res.status(400).json({
        message: "חובה להזין שם מוצר",
      });
    }

    if (!productData.category) {
      return res.status(400).json({
        message: "חובה לבחור קטגוריה",
      });
    }

    if (productData.price <= 0) {
      return res.status(400).json({
        message: "חובה להזין מחיר תקין",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "המוצר לא נמצא",
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);

    res.status(400).json({
      message: "לא ניתן לעדכן את המוצר",
      error: error.message,
    });
  }
};

// מחיקת מוצר
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProduct) {
      return res.status(404).json({
        message: "המוצר לא נמצא",
      });
    }

    res.json({
      message: "המוצר נמחק בהצלחה",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "לא ניתן למחוק את המוצר",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};