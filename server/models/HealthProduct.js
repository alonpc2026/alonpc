const mongoose=require("mongoose");
const schema=new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  description:{type:String,default:""},
  category:{type:String,enum:["warning","new","recommended","aliexpress"],required:true},
  source:{type:String,default:""},
  link:{type:String,default:""},
  imageUrl:{type:String,default:""},
  manufactureDate:{type:String,default:""},
  price:{type:String,default:""},
  active:{type:Boolean,default:true}
},{timestamps:true});
module.exports=mongoose.models.HealthProduct||mongoose.model("HealthProduct",schema);
