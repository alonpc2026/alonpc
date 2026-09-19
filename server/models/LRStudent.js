const mongoose = require("mongoose");

const lrStudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  currentStage: { type: Number, default: 1, min: 1, max: 9 },
  completedStages: { type: [Number], default: [] },
  scores: { type: Map, of: Number, default: {} },
  finalScore: { type: Number, default: 0 },
  resetCodeHash: String,
  resetCodeExpires: Date,
  lastLoginAt: Date
}, { timestamps: true });

module.exports = mongoose.model("LRStudent", lrStudentSchema);
