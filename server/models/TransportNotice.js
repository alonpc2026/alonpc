const mongoose=require("mongoose");
const s=new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  description:{type:String,default:""},
  link:{type:String,default:""},
  date:{type:String,default:""},
  active:{type:Boolean,default:true}
},{timestamps:true});
module.exports=mongoose.models.TransportNotice||mongoose.model("TransportNotice",s);
