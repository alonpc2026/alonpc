const router=require("express").Router();
const Visitor=require("../models/Visitor");

router.get("/",async(req,res)=>{
 const v=await Visitor.findOneAndUpdate(
 {name:"main-site"},
 {$setOnInsert:{count:0}},
 {new:true,upsert:true}
 );
 res.json({count:v.count});
});

router.post("/",async(req,res)=>{
 const v=await Visitor.findOneAndUpdate(
 {name:"main-site"},
 {$inc:{count:1}},
 {new:true,upsert:true}
 );
 res.json({count:v.count});
});

module.exports=router;
