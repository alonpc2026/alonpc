const router=require("express").Router();
const HealthProduct=require("../models/HealthProduct");

router.get("/",async(req,res)=>{
  try{
    const query={};
    if(req.query.category) query.category=req.query.category;
    if(req.query.active==="true") query.active=true;
    const rows=await HealthProduct.find(query).sort({createdAt:-1}).lean();
    res.json(rows);
  }catch(e){res.status(500).json({message:e.message})}
});

router.post("/",async(req,res)=>{
  try{res.status(201).json(await HealthProduct.create(req.body))}
  catch(e){res.status(400).json({message:e.message})}
});

router.put("/:id",async(req,res)=>{
  try{
    const row=await HealthProduct.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!row) return res.status(404).json({message:"הפריט לא נמצא"});
    res.json(row);
  }catch(e){res.status(400).json({message:e.message})}
});

router.delete("/:id",async(req,res)=>{
  try{
    await HealthProduct.findByIdAndDelete(req.params.id);
    res.json({success:true});
  }catch(e){res.status(400).json({message:e.message})}
});

module.exports=router;
