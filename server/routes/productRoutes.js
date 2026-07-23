const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const controller = require("../controllers/productController");

router.get("/", controller.getProducts);
router.get("/:id", controller.getProductById);
router.post("/", auth, admin, controller.addProduct);
router.put("/:id", auth, admin, controller.updateProduct);
router.delete("/:id", auth, admin, controller.deleteProduct);

module.exports = router;
