const mongoose = require("mongoose");

const accessibilitySchema = new mongoose.Schema(
  {
    transcription: { type: Boolean, default: false },
    captions: { type: Boolean, default: false },
    signLanguage: { type: Boolean, default: false },
    hearingLoop: { type: Boolean, default: false },
    wheelchairAccess: { type: Boolean, default: false },
    accessibleParking: { type: Boolean, default: false },
    accessibleRestrooms: { type: Boolean, default: false },
    writtenContact: { type: Boolean, default: false },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "חובה להזין שם אירוע"], trim: true, maxlength: 180 },
    description: { type: String, trim: true, default: "", maxlength: 5000 },
    city: { type: String, trim: true, default: "", maxlength: 120 },
    location: { type: String, trim: true, default: "", maxlength: 250 },
    website: { type: String, trim: true, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    startDate: { type: String, required: true, trim: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true },
    endDate: { type: String, required: true, trim: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true },
    startTime: { type: String, trim: true, default: "", match: /^$|^([01]\d|2[0-3]):([0-5]\d)$/ },
    endTime: { type: String, trim: true, default: "", match: /^$|^([01]\d|2[0-3]):([0-5]\d)$/ },
    allDay: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    accessibility: { type: accessibilitySchema, default: () => ({}) },
    languages: [{ type: String, trim: true }],
    captionLanguages: [{ type: String, trim: true }],
    signLanguages: [{ type: String, trim: true }],
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
  },
  { timestamps: true, versionKey: false }
);

eventSchema.pre("validate", function (next) {
  if (!this.startDate && this.date) this.startDate = this.date;
  if (!this.endDate) this.endDate = this.startDate || this.date;
  if (!this.startTime && this.time && !this.allDay) this.startTime = this.time;
  if (this.allDay) {
    this.startTime = "";
    this.endTime = "";
  }
  this.date = this.startDate || "";
  this.time = this.allDay ? "" : this.startTime || "";
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "תאריך הסיום לא יכול להיות לפני תאריך ההתחלה");
  }
  if (!this.allDay && this.startDate === this.endDate && this.startTime && this.endTime && this.endTime < this.startTime) {
    this.invalidate("endTime", "שעת הסיום לא יכולה להיות לפני שעת ההתחלה");
  }
  next();
});

eventSchema.index({ active: 1, startDate: 1, startTime: 1 });

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
