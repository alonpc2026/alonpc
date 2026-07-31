const express = require("express");
const router = express.Router();
const controller = require("../controllers/governmentServiceController");

/*
  כתובות פעילות:
  GET    /api/government-services
  POST   /api/government-services
  GET    /api/government-services/:id
  PUT    /api/government-services/:id
  PATCH  /api/government-services/:id
  DELETE /api/government-services/:id

  אותו Router מחובר גם ל:
  /api/government
*/

router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
