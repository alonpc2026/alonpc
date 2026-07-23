const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

async function resetAdmin() {
  try {
    const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGO_URI) {
      throw new Error("חסר MONGO_URI בקובץ .env");
    }

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("חסרים ADMIN_EMAIL או ADMIN_PASSWORD בקובץ .env");
    }

    await mongoose.connect(MONGO_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: "Alon Korkus",
          email,
          password: hashedPassword,
          role: "admin",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    console.log("✅ משתמש המנהל נוצר או עודכן בהצלחה");
    console.log("📧 אימייל:", admin.email);
    console.log("🔐 הרשאה:", admin.role);
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

resetAdmin();