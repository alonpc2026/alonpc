const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

function applySecurity(app) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: "יותר מדי בקשות. נסה שוב בעוד כמה דקות.",
      },
    })
  );

  app.use(
    "/api/auth",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        message: "יותר מדי ניסיונות התחברות. נסה שוב מאוחר יותר.",
      },
    })
  );
}

module.exports = applySecurity;
