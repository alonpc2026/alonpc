const express = require("express");
const mongoose = require("mongoose");
const MobileApp = require("../models/MobileApp");
const App = require("../models/App");

const router = express.Router();
const VALID_TYPES = new Set(["mobile","android","ios","tv","windows","mac"]);
const ALIASES = {galaxy:"android",samsung:"android",iphone:"ios",apple:"ios",macos:"mac","smart-tv":"tv",smarttv:"tv"};

const text=v=>typeof v==="string"?v.trim():"";
const norm=v=>{const x=text(v).toLowerCase();return ALIASES[x]||x;};
const bool=(v,f=true)=>v===true||v==="true"||v===1||v==="1"?true:v===false||v==="false"||v===0||v==="0"?false:f;

function clean(body={},existing={}){
  const requested=norm(body.type||body.platform||existing.type||existing.platform||"mobile");
  const type=VALID_TYPES.has(requested)?requested:"mobile";
  return {...existing,...body,
    name:text(body.name??existing.name??existing.title),
    title:text(body.title??existing.title??body.name??existing.name),
    description:text(body.description??existing.description),
    type, platform:norm(body.platform??type??existing.platform),
    imageUrl:text(body.imageUrl??existing.imageUrl), logoUrl:text(body.logoUrl??existing.logoUrl),
    url:text(body.url??existing.url), link:text(body.link??existing.link),
    websiteUrl:text(body.websiteUrl??existing.websiteUrl), storeUrl:text(body.storeUrl??existing.storeUrl),
    androidUrl:text(body.androidUrl??existing.androidUrl), iosUrl:text(body.iosUrl??existing.iosUrl),
    active:body.active!==undefined?bool(body.active,true):existing.active!==false,
    order:Number.isFinite(Number(body.order))?Number(body.order):Number(existing.order||0)
  };
}
function legacyToClient(a){
  const o=a.toObject?a.toObject():a;
  return {...o,_source:"legacy-apps",type:o.platform||"mobile",platform:o.platform||"",link:o.url||"",title:o.name||""};
}
async function merged(admin){
  const mf=admin?{}:{active:{$ne:false}};
  const af=admin?{}:{active:{$ne:false}};
  const [modern,legacy]=await Promise.all([
    MobileApp.find(mf).sort({order:1,createdAt:-1}).lean(),
    App.find(af).sort({createdAt:-1}).lean()
  ]);
  const seen=new Set();
  const out=[];
  for(const item of modern){
    const key=(item.name||item.title||"").trim().toLowerCase()+"|"+norm(item.platform||item.type);
    if(key!=="|") seen.add(key);
    out.push({...item,_source:"mobile-apps"});
  }
  for(const item of legacy){
    const c=legacyToClient(item);
    const key=(c.name||c.title||"").trim().toLowerCase()+"|"+norm(c.platform||c.type);
    if(!seen.has(key)) out.push(c);
  }
  return out;
}

router.get("/",async(req,res,next)=>{
  try{
    let items=await merged(req.query.admin==="true");
    if(req.query.type){
      const t=norm(req.query.type);
      items=items.filter(x=>{
        const p=norm(x.platform||x.type);
        if(t==="mobile") return !p||p==="mobile";
        return p===t;
      });
    }
    res.json(items);
  }catch(e){next(e)}
});
router.get("/:id",async(req,res,next)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"מזהה אפליקציה לא תקין"});
    let a=await MobileApp.findById(req.params.id).lean();
    if(a)return res.json({...a,_source:"mobile-apps"});
    a=await App.findById(req.params.id).lean();
    if(a)return res.json(legacyToClient(a));
    res.status(404).json({message:"האפליקציה לא נמצאה"});
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
    const old=await MobileApp.findById(req.params.id).lean();
    if(old)return res.json(await MobileApp.findByIdAndUpdate(req.params.id,clean(req.body,old),{new:true,runValidators:true}));
    const legacy=await App.findById(req.params.id).lean();
    if(!legacy)return res.status(404).json({message:"האפליקציה לא נמצאה"});
    const p=clean(req.body,legacy);
    const created=await MobileApp.create(p);
    await App.findByIdAndDelete(req.params.id);
    res.json(created);
  }catch(e){next(e)}
});
router.delete("/:id",async(req,res,next)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:"מזהה אפליקציה לא תקין"});
    let a=await MobileApp.findByIdAndDelete(req.params.id);
    if(a)return res.json({success:true,message:"האפליקציה נמחקה"});
    a=await App.findByIdAndDelete(req.params.id);
    if(a)return res.json({success:true,message:"האפליקציה נמחקה"});
    res.status(404).json({message:"האפליקציה לא נמצאה"});
  }catch(e){next(e)}
});
module.exports=router;
