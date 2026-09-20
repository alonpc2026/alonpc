const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 title:{type:String,default:"ברכה מיוחדת"},
 enabled:{type:Boolean,default:true},
 messages:{he:{type:String,default:""},ru:{type:String,default:""},en:{type:String,default:""},ar:{type:String,default:""},am:{type:String,default:""},fr:{type:String,default:""},fil:{type:String,default:""},hi:{type:String,default:""}}
},{timestamps:true});
module.exports=mongoose.model("HomeGreeting",schema);
