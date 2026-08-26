const router=require("express").Router();
const Course=require("../models/SignLanguageCourse");

router.get("/",async(req,res)=>{
 try{res.json(await Course.find({}).sort({date:1,startTime:1,createdAt:-1}).lean());}
 catch(e){res.status(500).json({message:"לא ניתן לטעון קורסים",detail:e.message});}
});
router.post("/",async(req,res)=>{
 try{
  if(Number(req.body.remainingPlaces)>Number(req.body.capacity) && Number(req.body.capacity)>0)
   return res.status(400).json({message:"כמות המקומות שנשארו לא יכולה להיות גדולה מהכמות הכוללת"});
  res.status(201).json(await Course.create(req.body));
 }catch(e){res.status(400).json({message:"לא ניתן להוסיף קורס",detail:e.message});}
});
router.put("/:id",async(req,res)=>{
 try{
  if(Number(req.body.remainingPlaces)>Number(req.body.capacity) && Number(req.body.capacity)>0)
   return res.status(400).json({message:"כמות המקומות שנשארו לא יכולה להיות גדולה מהכמות הכוללת"});
  const x=await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
  if(!x)return res.status(404).json({message:"הקורס לא נמצא"}); res.json(x);
 }catch(e){res.status(400).json({message:"לא ניתן לעדכן קורס",detail:e.message});}
});
router.delete("/:id",async(req,res)=>{
 try{await Course.findByIdAndDelete(req.params.id);res.json({success:true});}
 catch(e){res.status(400).json({message:"לא ניתן למחוק קורס",detail:e.message});}
});
module.exports=router;
