const mongoose=require('mongoose');
const appSchema=new mongoose.Schema({name:{type:String,required:true,trim:true},description:{type:String,default:''},publisher:{type:String,default:''},platform:{type:String,enum:['android','ios','windows','mac','tv'],required:true,default:'android'},imageUrl:{type:String,default:''},url:{type:String,default:''},active:{type:Boolean,default:true}},{timestamps:true,collection:'apps'});
module.exports=mongoose.models.App||mongoose.model('App',appSchema);
