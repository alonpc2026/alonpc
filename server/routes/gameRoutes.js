const express = require("express");
const mongoose = require("mongoose");
const Game = require("../models/Game");

const router = express.Router();
const TYPES = new Set(["computer", "android", "apple", "tv"]);

function cleanText(v){return typeof v==="string"?v.trim():"";}
function toBool(v,f=true){if(v===true||v==="true"||v===1||v==="1")return true;if(v===false||v==="false"||v===0||v==="0")return false;return f;}

function clean(body={}, existing={}){
  const requested=cleanText(body.type ?? existing.type ?? "computer");
  const type=TYPES.has(requested)?requested:"computer";
  return {
    name: cleanText(body.name ?? existing.name),
    description: cleanText(body.description ?? existing.description),
    type,
    platform: cleanText(body.platform ?? existing.platform),
    imageUrl: cleanText(body.imageUrl ?? existing.imageUrl),
    url: cleanText(body.url ?? existing.url),
    active: body.active!==undefined?toBool(body.active,true):existing.active!==false,
    order: Number.isFinite(Number(body.order))?Number(body.order):Number(existing.order||0),
  };
}

router.get("/",async(req,res,next)=>{
  try{
    const filter={};
    if(req.query.admin!=="true") filter.active={$ne:false};
    if(req.query.type && TYPES.has(req.query.type)) filter.type=req.query.type;
    const list=await Game.find(filter).sort({order:1,createdAt:-1}).lean();
    res.json(list);
  }catch(e){next(e)}
});

router.post("/",async(req,res,next)=>{
  try{
    const payload=clean(req.body);
    if(!payload.name) return res.status(400).json({message:"חובה להזין שם משחק"});
    const item=await Game.create(payload);
    res.status(201).json(item);
  }catch(e){next(e)}
});

router.put("/:id",async(req,res,next)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:"מזהה לא תקין"});
    const existing=await Game.findById(req.params.id).lean();
    if(!existing) return res.status(404).json({message:"המשחק לא נמצא"});
    const item=await Game.findByIdAndUpdate(req.params.id,clean(req.body,existing),{new:true,runValidators:true});
    res.json(item);
  }catch(e){next(e)}
});

router.delete("/:id",async(req,res,next)=>{
  try{
    if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:"מזהה לא תקין"});
    const item=await Game.findByIdAndDelete(req.params.id);
    if(!item) return res.status(404).json({message:"המשחק לא נמצא"});
    res.json({success:true});
  }catch(e){next(e)}
});

module.exports=router;
