const r=require("express").Router(),M=require("../models/TransportNotice");
r.get("/",async(q,s)=>{try{s.json(await M.find({}).sort({createdAt:-1}).lean())}catch(e){s.status(500).json({message:e.message})}});
r.post("/",async(q,s)=>{try{s.status(201).json(await M.create(q.body))}catch(e){s.status(400).json({message:e.message})}});
r.put("/:id",async(q,s)=>{try{s.json(await M.findByIdAndUpdate(q.params.id,q.body,{new:true,runValidators:true}))}catch(e){s.status(400).json({message:e.message})}});
r.delete("/:id",async(q,s)=>{try{await M.findByIdAndDelete(q.params.id);s.json({success:true})}catch(e){s.status(400).json({message:e.message})}});
module.exports=r;
