const express = require("express");
const router = express.Router();

const HomeService = require("../models/HomeService");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.active === "true") filter.active = true;
    if (req.query.region) filter.region = req.query.region;
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;

    const items = await HomeService.find(filter).sort({
      region: 1,
      serviceType: 1,
      name: 1,
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", auth, admin, async (req, res) => {
  try {
    const item = await HomeService.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", auth, admin, async (req, res) => {
  try {
    const item = await HomeService.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "השירות לא נמצא" });
    }

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const item = await HomeService.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "השירות לא נמצא" });
    }

    res.json({ message: "נמחק בהצלחה" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
