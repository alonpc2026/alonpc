const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "חובה להזין שם אירוע"],
      trim: true,
      maxlength: [180, "שם האירוע ארוך מדי"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [5000, "תיאור האירוע ארוך מדי"],
    },

    city: {
      type: String,
      trim: true,
      default: "",
      maxlength: [120, "שם העיר ארוך מדי"],
    },

    location: {
      type: String,
      trim: true,
      default: "",
      maxlength: [250, "מיקום האירוע ארוך מדי"],
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: String,
      required: [true, "חובה להזין תאריך התחלה"],
      trim: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "תאריך ההתחלה אינו תקין"],
      index: true,
    },

    endDate: {
      type: String,
      required: [true, "חובה להזין תאריך סיום"],
      trim: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "תאריך הסיום אינו תקין"],
      index: true,
    },

    startTime: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^$|^([01]\d|2[0-3]):([0-5]\d)$/,
        "שעת ההתחלה אינה תקינה",
      ],
    },

    endTime: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^$|^([01]\d|2[0-3]):([0-5]\d)$/,
        "שעת הסיום אינה תקינה",
      ],
    },

    allDay: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    // תאימות לאירועים ישנים
    date: {
      type: String,
      trim: true,
      default: "",
      match: [/^$|^\d{4}-\d{2}-\d{2}$/, "התאריך הישן אינו תקין"],
    },

    // תאימות לאירועים ישנים
    time: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^$|^([01]\d|2[0-3]):([0-5]\d)$/,
        "השעה הישנה אינה תקינה",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

eventSchema.pre("validate", function prepareEvent(next) {
  if (!this.startDate && this.date) {
    this.startDate = this.date;
  }

  if (!this.endDate) {
    this.endDate = this.startDate || this.date;
  }

  if (!this.startTime && this.time && !this.allDay) {
    this.startTime = this.time;
  }

  if (this.allDay) {
    this.startTime = "";
    this.endTime = "";
  }

  this.date = this.startDate || this.date || "";
  this.time = this.allDay ? "" : this.startTime || this.time || "";

  if (
    this.startDate &&
    this.endDate &&
    this.endDate < this.startDate
  ) {
    this.invalidate(
      "endDate",
      "תאריך הסיום לא יכול להיות לפני תאריך ההתחלה"
    );
  }

  if (
    !this.allDay &&
    this.startDate &&
    this.endDate &&
    this.startDate === this.endDate &&
    this.startTime &&
    this.endTime &&
    this.endTime < this.startTime
  ) {
    this.invalidate(
      "endTime",
      "שעת הסיום לא יכולה להיות לפני שעת ההתחלה"
    );
  }

  next();
});

eventSchema.index({
  startDate: 1,
  startTime: 1,
});

eventSchema.index({
  active: 1,
  startDate: 1,
});

module.exports =
  mongoose.models.Event || mongoose.model("Event", eventSchema);