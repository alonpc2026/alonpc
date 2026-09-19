const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const LRStudent = require("../models/LRStudent");
const router = express.Router();

const sign = (s) => jwt.sign({ id:s._id, type:"lr-student" }, process.env.JWT_SECRET, { expiresIn:"30d" });
const publicStudent = s => ({id:s._id,firstName:s.firstName,lastName:s.lastName,username:s.username,email:s.email,currentStage:s.currentStage,completedStages:s.completedStages,scores:Object.fromEntries(s.scores||[]),finalScore:s.finalScore});

function studentAuth(req,res,next){
  try{
    const token=(req.headers.authorization||"").replace(/^Bearer\s+/,"");
    const p=jwt.verify(token,process.env.JWT_SECRET);
    if(p.type!=="lr-student") throw new Error();
    req.studentId=p.id; next();
  }catch{res.status(401).json({message:"Необходимо войти в систему"});}
}
function adminAuth(req,res,next){
  try{
    const token=(req.headers.authorization||"").replace(/^Bearer\s+/,"");
    const p=jwt.verify(token,process.env.JWT_SECRET);
    if(p.role!=="admin") throw new Error();
    next();
  }catch{res.status(403).json({message:"Admin only"});}
}

router.post("/register", async(req,res)=>{
 try{
  let {firstName,lastName,username,email,password}=req.body;
  firstName=String(firstName||"").trim(); lastName=String(lastName||"").trim();
  username=String(username||"").trim().toLowerCase(); email=String(email||"").trim().toLowerCase();
  if(!firstName||!lastName||!username||!email||!/^\d{4}$/.test(String(password||"")))
    return res.status(400).json({message:"Заполните все поля. Пароль должен состоять из 4 цифр."});
  if(await LRStudent.findOne({$or:[{username},{email}]}))
    return res.status(400).json({message:"Имя пользователя или e-mail уже зарегистрированы."});
  const s=await LRStudent.create({firstName,lastName,username,email,password:await bcrypt.hash(password,10)});
  res.status(201).json({token:sign(s),student:publicStudent(s)});
 }catch(e){res.status(500).json({message:e.message});}
});

router.post("/login", async(req,res)=>{
 try{
  const login=String(req.body.login||"").trim().toLowerCase();
  const s=await LRStudent.findOne({$or:[{username:login},{email:login}]});
  if(!s || !(await bcrypt.compare(String(req.body.password||""),s.password)))
    return res.status(401).json({message:"Неверное имя пользователя или пароль."});
  s.lastLoginAt=new Date(); await s.save();
  res.json({token:sign(s),student:publicStudent(s)});
 }catch(e){res.status(500).json({message:e.message});}
});

router.get("/me",studentAuth,async(req,res)=>{
 const s=await LRStudent.findById(req.studentId); if(!s)return res.status(404).end();
 res.json(publicStudent(s));
});
router.put("/progress",studentAuth,async(req,res)=>{
 const s=await LRStudent.findById(req.studentId); if(!s)return res.status(404).end();
 const stage=Math.max(1,Math.min(9,Number(req.body.stage)||1));
 const score=Math.max(0,Math.min(100,Number(req.body.score)||0));
 s.currentStage=Math.max(s.currentStage,stage);
 if(req.body.completed && !s.completedStages.includes(stage)) s.completedStages.push(stage);
 s.scores.set(String(stage),score);
 if(stage===9) s.finalScore=score;
 await s.save(); res.json(publicStudent(s));
});

router.post("/forgot",async(req,res)=>{
 try{
  const email=String(req.body.email||"").trim().toLowerCase();
  const s=await LRStudent.findOne({email});
  // Same response even when address is unknown.
  if(!s) return res.json({message:"Если адрес зарегистрирован, код восстановления будет отправлен."});
  const code=String(Math.floor(100000+Math.random()*900000));
  s.resetCodeHash=crypto.createHash("sha256").update(code).digest("hex");
  s.resetCodeExpires=new Date(Date.now()+15*60*1000); await s.save();
  if(!process.env.SMTP_USER || !process.env.SMTP_PASS)
    return res.status(503).json({message:"Служба электронной почты ещё не настроена администратором."});
  const tr=nodemailer.createTransport({
    host:process.env.SMTP_HOST||"smtp.gmail.com",port:Number(process.env.SMTP_PORT||465),secure:String(process.env.SMTP_SECURE||"true")==="true",
    auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
  });
  await tr.sendMail({from:process.env.SMTP_FROM||process.env.SMTP_USER,to:s.email,
    subject:"LR — восстановление пароля",
    text:`Здравствуйте, ${s.firstName}.\nКод восстановления: ${code}\nКод действителен 15 минут.\nALONPC LR`});
  res.json({message:"Код восстановления отправлен на e-mail."});
 }catch(e){res.status(500).json({message:"Не удалось отправить письмо."});}
});
router.post("/reset",async(req,res)=>{
 const email=String(req.body.email||"").trim().toLowerCase(), code=String(req.body.code||"").trim(), password=String(req.body.password||"");
 if(!/^\d{4}$/.test(password)) return res.status(400).json({message:"Новый пароль должен состоять из 4 цифр."});
 const hash=crypto.createHash("sha256").update(code).digest("hex");
 const s=await LRStudent.findOne({email,resetCodeHash:hash,resetCodeExpires:{$gt:new Date()}});
 if(!s)return res.status(400).json({message:"Код неверный или срок его действия истёк."});
 s.password=await bcrypt.hash(password,10); s.resetCodeHash=undefined;s.resetCodeExpires=undefined;await s.save();
 res.json({message:"Пароль успешно изменён."});
});

router.get("/admin/students",adminAuth,async(req,res)=>{
 const students=await LRStudent.find().select("-password -resetCodeHash").sort({createdAt:-1}).lean();
 res.json({count:students.length,students});
});
module.exports=router;
