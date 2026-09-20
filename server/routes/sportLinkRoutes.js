const express=require("express"),router=express.Router(),jwt=require("jsonwebtoken"),SportLink=require("../models/SportLink");
function admin(req,res,next){try{const h=req.headers.authorization||"";const t=h.startsWith("Bearer ")?h.slice(7):"";const d=jwt.verify(t,process.env.JWT_SECRET);if(d.role!=="admin")return res.status(403).json({message:"Admin only"});next()}catch(e){res.status(401).json({message:"Unauthorized"})}}
router.get("/",async(req,res)=>res.json(await SportLink.find().sort({createdAt:-1})));
router.post("/",admin,async(req,res)=>{try{res.status(201).json(await SportLink.create(req.body))}catch(e){res.status(400).json({message:e.message})}});
router.delete("/:id",admin,async(req,res)=>{await SportLink.findByIdAndDelete(req.params.id);res.json({message:"Deleted"})});
module.exports=router;