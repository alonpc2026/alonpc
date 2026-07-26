const express = require("express");
const router = express.Router();
const controller = require("../controllers/serviceController");

// אם יש אצלך middleware של מנהל, הוסף אותו ל-POST/PUT/DELETE.
router.get("/", controller.getServices);
router.get("/:id", controller.getServiceById);
router.post("/", controller.createService);
router.put("/:id", controller.updateService);
router.delete("/:id", controller.deleteService);

module.exports = router;
