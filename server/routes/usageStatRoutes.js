const router = require("express").Router();
const UsageStat = require("../models/UsageStat");

function israelDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric", month: "2-digit", day: "2-digit"
  }).format(date);
}

router.post("/track", async (req, res) => {
  try {
    const eventType = req.body.eventType === "visit" ? "visit" : "click";
    const key = String(req.body.key || (eventType === "visit" ? "site" : "")).trim().slice(0, 100);
    const label = String(req.body.label || "").trim().slice(0, 200);
    if (!key) return res.status(400).json({ message: "Missing event key" });

    await UsageStat.findOneAndUpdate(
      { day: israelDay(), eventType, key },
      { $inc: { count: 1 }, $set: { label } },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Usage track error:", error);
    res.status(500).json({ message: "לא ניתן לעדכן סטטיסטיקה" });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 1, 1), 30);
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    const startDay = israelDay(start);
    const endDay = israelDay(end);

    const rows = await UsageStat.find({ day: { $gte: startDay, $lte: endDay } }).lean();
    const visits = rows.filter(x => x.eventType === "visit").reduce((n,x) => n + x.count, 0);
    const clickMap = new Map();
    rows.filter(x => x.eventType === "click").forEach(x => {
      const old = clickMap.get(x.key) || { key:x.key, label:x.label || x.key, count:0 };
      old.count += x.count;
      if (x.label) old.label = x.label;
      clickMap.set(x.key, old);
    });
    const clicks = [...clickMap.values()].sort((a,b) => b.count - a.count);
    res.json({ days, startDay, endDay, visits, totalClicks: clicks.reduce((n,x)=>n+x.count,0), clicks });
  } catch (error) {
    console.error("Usage summary error:", error);
    res.status(500).json({ message: "לא ניתן לטעון סטטיסטיקה" });
  }
});

module.exports = router;
