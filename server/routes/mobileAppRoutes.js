const express = require("express");
const mongoose = require("mongoose");
const MobileApp = require("../models/MobileApp");

const router = express.Router();
const VALID_TYPES = new Set(["mobile", "android", "ios", "tv", "windows", "mac"]);
const ALIASES = { galaxy:"android", samsung:"android", iphone:"ios", apple:"ios", macos:"mac", "smart-tv":"tv", smarttv:"tv" };

function text(value) { return typeof value === "string" ? value.trim() : ""; }
function norm(value) {
  const v=text(value).toLowerCase();
  return ALIASES[v] || v;
}
function bool(value, fallback=true) {
  if (value===true || value==="true" || value===1 || value==="1") return true;
  if (value===false || value==="false" || value===0 || value==="0") return false;
  return fallback;
}
function clean(body={}, existing={}) {
  const requestedType=norm(body.type || body.platform || existing.type || existing.platform || "mobile");
  const type=VALID_TYPES.has(requestedType) ? requestedType : "mobile";
  return {
    ...existing, ...body,
    name:text(body.name ?? existing.name ?? existing.title),
    title:text(body.title ?? existing.title ?? body.name ?? existing.name),
    description:text(body.description ?? existing.description),
    type,
    platform:norm(body.platform ?? type ?? existing.platform),
    imageUrl:text(body.imageUrl ?? existing.imageUrl),
    logoUrl:text(body.logoUrl ?? existing.logoUrl),
    url:text(body.url ?? existing.url),
    link:text(body.link ?? existing.link),
    websiteUrl:text(body.websiteUrl ?? existing.websiteUrl),
    storeUrl:text(body.storeUrl ?? existing.storeUrl),
    androidUrl:text(body.androidUrl ?? existing.androidUrl),
    iosUrl:text(body.iosUrl ?? existing.iosUrl),
    active:body.active!==undefined ? bool(body.active,true) : existing.active!==false,
    order:Number.isFinite(Number(body.order)) ? Number(body.order) : Number(existing.order||0),
  };
}

router.get("/", async (req,res,next)=>{
  try {
    const filter={};
    if(req.query.admin!=="true") filter.active={$ne:false};
    if(req.query.type){
      const type=norm(req.query.type);
      if(type==="mobile"){
        filter.$or=[{type:"mobile"},{type:{$exists:false}},{type:""},{type:null}];
      } else if(VALID_TYPES.has(type)) filter.type=type;
    }
    res.json(await MobileApp.find(filter).sort({order:1,createdAt:-1}).lean());
  } catch(e){next(e)}
});
router.get("/:id",async(req,res,next)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:"מזהה אפליקציה לא תקין"});
    const a=await MobileApp.findById(req.params.id).lean();
    if(!a)return res.status(404).json({message:"האפליקציה לא נמצאה"});
    res.json(a);
  }catch(e){next(e)}
});
router.post("/",async(req,res,next)=>{
  try{
    const p=clean(req.body);
    if(!p.name&&!p.title)return res.status(400).json({message:"חובה להזין שם אפליקציה"});
    res.status(201).json(await MobileApp.create(p));
  }catch(e){next(e)}
});
router.put("/:id",async(req,res,next)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"מזהה אפליקציה לא תקין"});
    const existing=await MobileApp.findById(req.params.id).lean();
    if(!existing)return res.status(404).json({message:"האפליקציה לא נמצאה"});
    res.json(await MobileApp.findByIdAndUpdate(req.params.id,clean(req.body,existing),{new:true,runValidators:true}));
  }catch(e){next(e)}
});
router.delete("/:id",async(req,res,next)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"מזהה אפליקציה לא תקין"});
    const a=await MobileApp.findByIdAndDelete(req.params.id);
    if(!a)return res.status(404).json({message:"האפליקציה לא נמצאה"});
    res.json({success:true,message:"האפליקציה נמחקה"});
  }catch(e){next(e)}
});
module.exports=router;
