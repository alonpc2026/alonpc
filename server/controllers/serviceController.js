const Service = require("../models/Service");

const cleanText = (value) =>
  typeof value === "string" ? value.trim() : "";

const cleanBoolean = (value, defaultValue = false) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return defaultValue;
};

const cleanCities = (value) => {
  if (Array.isArray(value)) {
    return value.map((city) => cleanText(city)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((city) => city.trim())
      .filter(Boolean);
  }

  return [];
};

const buildServiceData = (body) => {
  const serviceCities = cleanCities(body.serviceCities);
  const websiteUrl = cleanText(body.websiteUrl || body.link);

  return {
    name: cleanText(body.name),
    professionType: cleanText(body.professionType),
    category: cleanText(body.category) || "שונות",
    serviceType: cleanText(body.serviceType),
    businessName: cleanText(body.businessName),
    logoUrl: cleanText(body.logoUrl),
    websiteUrl,
    link: websiteUrl,
    address: cleanText(body.address),
    city: cleanText(body.city) || serviceCities[0] || "",
    serviceCities,
    phone: cleanText(body.phone),
    acceptsWhatsApp: cleanBoolean(body.acceptsWhatsApp, false),
    description: cleanText(body.description),
    email: cleanText(body.email),
    hours: cleanText(body.hours),
    imageUrl: cleanText(body.imageUrl),
    icon: cleanText(body.icon) || "🛎️",
    active: cleanBoolean(body.active, true),
  };
};

const validateService = (data) => {
  if (!data.name) return "חובה להזין שם שירות";
  if (!data.professionType) return "חובה להזין סוג מקצוע";
  if (!data.serviceType) return "חובה להזין סוג שירות";
  return "";
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: "לא ניתן לטעון את השירותים",
      error: error.message,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "השירות לא נמצא" });
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({
      message: "מזהה השירות אינו תקין",
      error: error.message,
    });
  }
};

const addService = async (req, res) => {
  try {
    const data = buildServiceData(req.body);
    const validationError = validateService(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const service = await Service.create(data);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({
      message: "לא ניתן להוסיף את השירות",
      error: error.message,
    });
  }
};

const updateService = async (req, res) => {
  try {
    const data = buildServiceData(req.body);
    const validationError = validateService(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "השירות לא נמצא" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message: "לא ניתן לעדכן את השירות",
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "השירות לא נמצא" });
    }

    res.json({ message: "השירות נמחק בהצלחה" });
  } catch (error) {
    res.status(500).json({
      message: "לא ניתן למחוק את השירות",
      error: error.message,
    });
  }
};

module.exports = {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};
