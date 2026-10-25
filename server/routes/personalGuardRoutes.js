const express=require("express");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const PersonalGuard=require("../models/PersonalGuard");
const User=require("../models/User");
const router=express.Router();
const clean=(v,max)=>typeof v==="string"?v.trim().slice(0,max):"";
router.post("/register",async(req,res)=>{
 try {
  const {firstName,lastName,address,phone,bank,consent,website}=req.body||{};
  if(website) return res.status(400).json({message:"בקשה לא תקינה"});
  const data={firstName:clean(firstName,80),lastName:clean(lastName,80),address:clean(address,200),phone:clean(phone,30),bank:clean(bank,80)};
  if(Object.values(data).some(v=>!v)||consent!==true||!/^[+0-9() .-]{7,30}$/.test(data.phone))return res.status(400).json({message:"נא למלא פרטים תקינים ולאשר הסכמה"});
  // Atomic counter for concurrent submissions; gaps may occur if a write fails.
  const counter=await mongoose.connection.collection("personal_guard_counters").findOneAndUpdate({_id:"registration"},{$inc:{seq:1}}, {upsert:true,returnDocument:"after"});
  const number=counter.seq;
  await PersonalGuard.create({...data,consent:true,number});
  res.status(201).json({success:true,number,message:"ההרשמה המוקדמת התקבלה"});
 }catch(e){console.error("PersonalGuard registration error",e);res.status(500).json({message:"לא ניתן להשלים הרשמה כעת"});}
});
async function adminOnly(req,res,next){
 try{
  const match=/^Bearer (.+)$/i.exec(req.headers.authorization||"");
  if(!match)return res.status(401).json({message:"נדרשת התחברות"});
  const payload=jwt.verify(match[1],process.env.JWT_SECRET);
  if(!payload.id)return res.status(403).json({message:"אין הרשאה"});
  const user=await User.findById(payload.id).select("role");
  if(!user||user.role!=="admin")return res.status(403).json({message:"אין הרשאה"});
  next();
 }catch(e){return res.status(401).json({message:"התחברות אינה תקפה"});}
}
router.get("/registrations",adminOnly,async(req,res)=>{
 try{
  const page=Math.min(Math.max(parseInt(req.query.page,10)||1,1),100000);
  const limit=50;
  const [items,total]=await Promise.all([PersonalGuard.find({}).sort({number:1}).skip((page-1)*limit).limit(limit).lean(),PersonalGuard.countDocuments()]);
  res.set("Cache-Control","no-store");res.json({items,total,page,pages:Math.ceil(total/limit)});
 }catch(e){res.status(500).json({message:"שגיאה בטעינת הרשמות"});}
});
module.exports=router;
