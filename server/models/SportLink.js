const mongoose=require("mongoose");
module.exports=mongoose.model("SportLink",new mongoose.Schema({
 type:{type:String,enum:["results","links","apps"],required:true},
 title:{type:String,required:true,trim:true},
 description:{type:String,default:""},
 url:{type:String,required:true,trim:true},
 imageUrl:{type:String,default:"",trim:true},
 icon:{type:String,default:"⚽"}
},{timestamps:true}));
