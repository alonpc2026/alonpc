const express=require("express");
const jwt=require("jsonwebtoken");
const HomeGreeting=require("../models/HomeGreeting");
const router=express.Router();
function admin(req,res,next){
 try{
  const raw=req.headers.authorization||"";
  const token=raw.startsWith("Bearer ")?raw.slice(7):"";
  const d=jwt.verify(token,process.env.JWT_SECRET);
  if(d.role!=="admin") return res.status(403).json({message:"Admin only"});
  next();
 }catch(e){return res.status(401).json({message:"Unauthorized"});}
}
router.get("/",async(req,res)=>{try{const x=await HomeGreeting.findOne().lean();res.json(x||{title:"ברכה מיוחדת",enabled:false,messages:{}})}catch(e){res.status(500).json({message:e.message})}});
router.put("/",admin,async(req,res)=>{try{
 const data={title:String(req.body.title||"ברכה מיוחדת").slice(0,120),enabled:req.body.enabled!==false,messages:req.body.messages||{}};
 const x=await HomeGreeting.findOneAndUpdate({},data,{new:true,upsert:true,setDefaultsOnInsert:true});
 res.json(x);
}catch(e){res.status(500).json({message:e.message})}});
module.exports=router;
