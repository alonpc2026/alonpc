const mongoose = require("mongoose");
const Event = require("../models/Event");

function cleanText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeBoolean(value, defaultValue = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true" || value === "1" || value === 1) {
    return true;
  }

  if (value === "false" || value === "0" || value === 0) {
    return false;
  }

  return defaultValue;
}

function normalizeDate(value) {
  const text = cleanText(value);

  if (!text) {
    return "";
  }

  const simpleDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (simpleDatePattern.test(text)) {
    return text;
  }

  const parsedDate = new Date(text);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function normalizeTime(value) {
  const text = cleanText(value);

  if (!text) {
    return "";
  }

  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timePattern.test(text)) {
    return "";
  }

  return text;
}

function isValidUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeEventData(body = {}, existingEvent = null) {
  const legacyDate = normalizeDate(body.date);
  const legacyTime = normalizeTime(body.time);

  const previousStartDate = existingEvent
    ? normalizeDate(existingEvent.startDate || existingEvent.date)
    : "";

  const previousEndDate = existingEvent
    ? normalizeDate(
        existingEvent.endDate ||
          existingEvent.startDate ||
          existingEvent.date
      )
    : "";

  const previousStartTime = existingEvent
    ? normalizeTime(existingEvent.startTime || existingEvent.time)
    : "";

  const previousEndTime = existingEvent
    ? normalizeTime(existingEvent.endTime)
    : "";

  const startDate =
    normalizeDate(body.startDate) ||
    legacyDate ||
    previousStartDate;

  const endDate =
    normalizeDate(body.endDate) ||
    startDate ||
    previousEndDate;

  const allDay =
    body.allDay !== undefined
      ? normalizeBoolean(body.allDay)
      : normalizeBoolean(existingEvent?.allDay);

  const startTime = allDay
    ? ""
    : normalizeTime(body.startTime) ||
      legacyTime ||
      previousStartTime;

  const endTime = allDay
    ? ""
    : normalizeTime(body.endTime) || previousEndTime;

  const active =
    body.active !== undefined
      ? normalizeBoolean(body.active, true)
      : existingEvent?.active !== false;

  return {
    title:
      body.title !== undefined
        ? cleanText(body.title)
        : cleanText(existingEvent?.title),

    description:
      body.description !== undefined
        ? cleanText(body.description)
        : cleanText(existingEvent?.description),

    city:
      body.city !== undefined
        ? cleanText(body.city)
        : cleanText(existingEvent?.city),

    location:
      body.location !== undefined
        ? cleanText(body.location)
        : cleanText(existingEvent?.location),

    website:
      body.website !== undefined
        ? cleanText(body.website)
        : cleanText(existingEvent?.website),

    imageUrl:
      body.imageUrl !== undefined
        ? cleanText(body.imageUrl)
        : cleanText(existingEvent?.imageUrl),

    startDate,
    endDate,
    startTime,
    endTime,
    allDay,
    active,

    // תאימות לאירועים ישנים
    date: startDate,
    time: startTime,
  };
}

function validateEventData(eventData) {
  const errors = [];

  if (!eventData.title) {
    errors.push("חובה להזין שם אירוע");
  }

  if (!eventData.startDate) {
    errors.push("חובה להזין תאריך התחלה");
  }

  if (!eventData.endDate) {
    errors.push("חובה להזין תאריך סיום");
  }

  if (
    eventData.startDate &&
    eventData.endDate &&
    eventData.endDate < eventData.startDate
  ) {
    errors.push("תאריך הסיום לא יכול להיות לפני תאריך ההתחלה");
  }

  if (
    !eventData.allDay &&
    eventData.startDate === eventData.endDate &&
    eventData.startTime &&
    eventData.endTime &&
    eventData.endTime < eventData.startTime
  ) {
    errors.push("שעת הסיום לא יכולה להיות לפני שעת ההתחלה");
  }

  if (!isValidUrl(eventData.website)) {
    errors.push("כתובת אתר האירוע אינה תקינה");
  }

  if (!isValidUrl(eventData.imageUrl)) {
    errors.push("כתובת תמונת האירוע אינה תקינה");
  }

  return errors;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getEvents(req, res) {
  try {
    const {
      city,
      search,
      active,
      startDate,
      endDate,
      includePast,
    } = req.query;

    const filter = {};

    if (city) {
      filter.city = {
        $regex: cleanText(city),
        $options: "i",
      };
    }

    if (active !== undefined) {
      filter.active = normalizeBoolean(active);
    }

    if (search) {
      const searchText = cleanText(search);

      filter.$or = [
        {
          title: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          city: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          location: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    const requestedStartDate = normalizeDate(startDate);
    const requestedEndDate = normalizeDate(endDate);

    if (requestedStartDate || requestedEndDate) {
      filter.$and = filter.$and || [];

      if (requestedStartDate) {
        filter.$and.push({
          $or: [
            {
              endDate: {
                $gte: requestedStartDate,
              },
            },
            {
              endDate: {
                $in: ["", null],
              },
              startDate: {
                $gte: requestedStartDate,
              },
            },
            {
              startDate: {
                $in: ["", null],
              },
              date: {
                $gte: requestedStartDate,
              },
            },
          ],
        });
      }

      if (requestedEndDate) {
        filter.$and.push({
          $or: [
            {
              startDate: {
                $lte: requestedEndDate,
              },
            },
            {
              startDate: {
                $in: ["", null],
              },
              date: {
                $lte: requestedEndDate,
              },
            },
          ],
        });
      }
    }

    if (includePast === "false") {
      const today = new Date().toISOString().slice(0, 10);

      filter.$and = filter.$and || [];

      filter.$and.push({
        $or: [
          {
            endDate: {
              $gte: today,
            },
          },
          {
            endDate: {
              $in: ["", null],
            },
            startDate: {
              $gte: today,
            },
          },
          {
            startDate: {
              $in: ["", null],
            },
            date: {
              $gte: today,
            },
          },
        ],
      });
    }

    const events = await Event.find(filter).lean();

    const normalizedEvents = events
      .map((eventItem) => {
        const normalized = normalizeEventData({}, eventItem);

        return {
          ...eventItem,
          ...normalized,
        };
      })
      .sort((firstEvent, secondEvent) => {
        const firstValue = `${
          firstEvent.startDate || firstEvent.date || ""
        } ${firstEvent.startTime || firstEvent.time || "00:00"}`;

        const secondValue = `${
          secondEvent.startDate || secondEvent.date || ""
        } ${secondEvent.startTime || secondEvent.time || "00:00"}`;

        return firstValue.localeCompare(secondValue);
      });

    return res.status(200).json(normalizedEvents);
  } catch (error) {
    console.error("getEvents error:", error);

    return res.status(500).json({
      message: "אירעה שגיאה בטעינת האירועים",
    });
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "מזהה האירוע אינו תקין",
      });
    }

    const eventItem = await Event.findById(id).lean();

    if (!eventItem) {
      return res.status(404).json({
        message: "האירוע לא נמצא",
      });
    }

    const normalized = normalizeEventData({}, eventItem);

    return res.status(200).json({
      ...eventItem,
      ...normalized,
    });
  } catch (error) {
    console.error("getEventById error:", error);

    return res.status(500).json({
      message: "אירעה שגיאה בטעינת האירוע",
    });
  }
}

async function createEvent(req, res) {
  try {
    const eventData = normalizeEventData(req.body);
    const validationErrors = validateEventData(eventData);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    const createdEvent = await Event.create(eventData);

    return res.status(201).json({
      message: "האירוע נוסף בהצלחה",
      event: createdEvent,
    });
  } catch (error) {
    console.error("createEvent error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "חלק מפרטי האירוע אינם תקינים",
        errors: Object.values(error.errors).map(
          (validationError) => validationError.message
        ),
      });
    }

    return res.status(500).json({
      message: "אירעה שגיאה בהוספת האירוע",
    });
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "מזהה האירוע אינו תקין",
      });
    }

    const existingEvent = await Event.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        message: "האירוע לא נמצא",
      });
    }

    const eventData = normalizeEventData(
      req.body,
      existingEvent.toObject()
    );

    const validationErrors = validateEventData(eventData);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: validationErrors[0],
        errors: validationErrors,
      });
    }

    Object.assign(existingEvent, eventData);

    const updatedEvent = await existingEvent.save();

    return res.status(200).json({
      message: "האירוע עודכן בהצלחה",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("updateEvent error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "חלק מפרטי האירוע אינם תקינים",
        errors: Object.values(error.errors).map(
          (validationError) => validationError.message
        ),
      });
    }

    return res.status(500).json({
      message: "אירעה שגיאה בעדכון האירוע",
    });
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "מזהה האירוע אינו תקין",
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        message: "האירוע לא נמצא",
      });
    }

    return res.status(200).json({
      message: "האירוע נמחק בהצלחה",
    });
  } catch (error) {
    console.error("deleteEvent error:", error);

    return res.status(500).json({
      message: "אירעה שגיאה במחיקת האירוע",
    });
  }
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};