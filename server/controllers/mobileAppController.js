const MobileApp = require("../models/MobileApp");

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function bool(value) {
  return value === true || value === "true";
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function validUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function buildData(body = {}, current = {}) {
  return {
    name: body.name !== undefined ? text(body.name) : text(current.name),
    description:
      body.description !== undefined
        ? text(body.description)
        : text(current.description),
    imageUrl:
      body.imageUrl !== undefined ? text(body.imageUrl) : text(current.imageUrl),

    hasAndroid:
      body.hasAndroid !== undefined
        ? bool(body.hasAndroid)
        : bool(current.hasAndroid),
    androidUrl:
      body.androidUrl !== undefined
        ? text(body.androidUrl)
        : text(current.androidUrl),

    hasIphone:
      body.hasIphone !== undefined
        ? bool(body.hasIphone)
        : bool(current.hasIphone),
    iphoneUrl:
      body.iphoneUrl !== undefined
        ? text(body.iphoneUrl)
        : text(current.iphoneUrl),

    featured:
      body.featured !== undefined ? bool(body.featured) : bool(current.featured),
    active: body.active !== undefined ? bool(body.active) : current.active !== false,
    displayOrder:
      body.displayOrder !== undefined
        ? number(body.displayOrder)
        : number(current.displayOrder),
  };
}

function validate(data) {
  const errors = [];

  if (!data.name) errors.push("חובה להזין שם אפליקציה");
  if (!validUrl(data.imageUrl)) errors.push("כתובת תמונת האפליקציה אינה תקינה");

  if (data.hasAndroid && !data.androidUrl) {
    errors.push("סימנת Android ולכן חובה להזין קישור להורדה");
  }
  if (data.hasAndroid && !validUrl(data.androidUrl)) {
    errors.push("קישור Google Play אינו תקין");
  }

  if (data.hasIphone && !data.iphoneUrl) {
    errors.push("סימנת iPhone ולכן חובה להזין קישור להורדה");
  }
  if (data.hasIphone && !validUrl(data.iphoneUrl)) {
    errors.push("קישור App Store אינו תקין");
  }

  return errors;
}

exports.getAll = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.admin !== "true") {
      query.active = true;
    }

    const items = await MobileApp.find(query).sort({
      featured: -1,
      displayOrder: 1,
      name: 1,
    });

    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const item = await MobileApp.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "האפליקציה לא נמצאה" });
    }

    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = buildData(req.body);
    const errors = validate(data);

    if (errors.length) {
      return res.status(400).json({ message: errors.join(" · ") });
    }

    const item = await MobileApp.create(data);
    return res.status(201).json(item);
  } catch (error) {
    return next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const current = await MobileApp.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: "האפליקציה לא נמצאה" });
    }

    const data = buildData(req.body, current);
    const errors = validate(data);

    if (errors.length) {
      return res.status(400).json({ message: errors.join(" · ") });
    }

    Object.assign(current, data);
    await current.save();

    return res.json(current);
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await MobileApp.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "האפליקציה לא נמצאה" });
    }

    return res.json({ success: true, message: "האפליקציה נמחקה" });
  } catch (error) {
    return next(error);
  }
};
