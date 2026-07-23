const mongoose=require("mongoose");

module.exports=mongoose.model("Visitor",
new mongoose.Schema({
name:{type:String,default:"main-site"},
count:{type:Number,default:0}
}));
