const mongoose=require("mongoose");
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},city:{type:String,required:true,trim:true},wheelchairAccessible:{type:Boolean,default:true},active:{type:Boolean,default:true}},{timestamps:true});
module.exports=mongoose.models.AccessibleBeach||mongoose.model("AccessibleBeach",schema);