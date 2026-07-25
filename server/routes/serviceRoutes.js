const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", auth, admin, addService);
router.put("/:id", auth, admin, updateService);
router.delete("/:id", auth, admin, deleteService);

module.exports = router;
