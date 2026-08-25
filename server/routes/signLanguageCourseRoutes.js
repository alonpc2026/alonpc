const router = require("express").Router();
const Course = require("../models/SignLanguageCourse");

router.get("/", async (req,res)=>{
  try {
    const rows = await Course.find({}).sort({ startDate: 1, createdAt: -1 }).lean();
    res.json(rows);
  } catch(e) {
    res.status(500).json({message:"לא ניתן לטעון קורסים", detail:e.message});
  }
});

router.post("/", async (req,res)=>{
  try {
    const row = await Course.create(req.body);
    res.status(201).json(row);
  } catch(e) {
    res.status(400).json({message:"לא ניתן להוסיף קורס", detail:e.message});
  }
});

router.put("/:id", async (req,res)=>{
  try {
    const row = await Course.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
    if(!row) return res.status(404).json({message:"הקורס לא נמצא"});
    res.json(row);
  } catch(e) {
    res.status(400).json({message:"לא ניתן לעדכן קורס", detail:e.message});
  }
});

router.delete("/:id", async (req,res)=>{
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({success:true});
  } catch(e) {
    res.status(400).json({message:"לא ניתן למחוק קורס", detail:e.message});
  }
});

module.exports = router;
