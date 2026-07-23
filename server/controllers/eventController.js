const Event = require("../models/Event");

function cleanPayload(body = {}) {
  return {
    title: String(body.title || "").trim(),
    date: String(body.date || "").trim(),
    time: String(body.time || "").trim(),
    city: String(body.city || "").trim(),
    location: String(body.location || "").trim(),
    description: String(body.description || "").trim(),
    website: String(body.website || "").trim(),
    imageUrl: String(body.imageUrl || "").trim(),
    active: body.active !== false,
  };
}

exports.getPublicEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ active: true })
      .sort({ date: 1, time: 1, createdAt: 1 })
      .lean();

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

exports.getAdminEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .sort({ date: 1, time: 1, createdAt: 1 })
      .lean();

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const payload = cleanPayload(req.body);

    if (!payload.title || !payload.date) {
      return res.status(400).json({
        message: "יש למלא שם אירוע ותאריך",
      });
    }

    const event = await Event.create(payload);
    return res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const payload = cleanPayload(req.body);

    if (!payload.title || !payload.date) {
      return res.status(400).json({
        message: "יש למלא שם אירוע ותאריך",
      });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: "האירוע לא נמצא" });
    }

    return res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "האירוע לא נמצא" });
    }

    return res.status(200).json({
      success: true,
      message: "האירוע נמחק",
    });
  } catch (error) {
    next(error);
  }
};
