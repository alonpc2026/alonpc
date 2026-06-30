const Service = require("../models/Service");

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addService = async (req, res) => {
  try {
    const service = await Service.create({
      name: req.body.name,
      category: req.body.category,
      icon: req.body.icon,
      link: req.body.link,
      description: req.body.description,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      hours: req.body.hours,
      imageUrl: req.body.imageUrl,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        category: req.body.category,
        icon: req.body.icon,
        link: req.body.link,
        description: req.body.description,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        hours: req.body.hours,
        imageUrl: req.body.imageUrl,
      },
      { new: true }
    );

    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "השירות נמחק בהצלחה" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getServices,
  addService,
  updateService,
  deleteService,
};