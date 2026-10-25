const mongoose = require("mongoose");
const schema = new mongoose.Schema({number:{type:Number,required:true,unique:true},firstName:{type:String,required:true,maxlength:80},lastName:{type:String,required:true,maxlength:80},address:{type:String,required:true,maxlength:200},phone:{type:String,required:true,maxlength:30},bank:{type:String,required:true,maxlength:80},consent:{type:Boolean,required:true},createdAt:{type:Date,default:Date.now}},{versionKey:false});
module.exports = mongoose.model("PersonalGuard",schema);
