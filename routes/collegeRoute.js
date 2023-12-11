const express=require("express");
const College = require("../models/collegeModel");
const Student=require("../models/studentModel");
const router=express.Router();


 router.get("/",(req,res)=>{
    res.send("Hello College");
 })
 router.post("/addnew",async(req,res)=>{
   console.log(req.body);
 const Email=req.body.Email;
   try{
      const collegeFound=await College.findOne({Email:Email})
      if(collegeFound){
         res.send("alreadyexist")
      }
      else{
         const {Name,Email,State,City,Rating}=req.body;
          const createCollege=await College.create({
            Name,
            Email,
            State,
            City,
            Rating
          })
          if(createCollege){
              res.status(200).send("created");
          }
          else{
              res.status(400).send("Failed to create");
          }
      }
  }   
  catch(err){
      console.log("error in add new"+err);
  }

 })

 router.get("/fetchcolleges",async(req,res)=>{
   const result=await College.find({}).populate("Students");
   res.send(result);
 })
 router.post("/delete",async(req,res)=>{
  try{
   const Email=req.body.Email;
   const college =await College.findOne({Email:Email})
   console.log(college)
   const deleteStudents= await Student.deleteMany({ _id: { $in: college.Students } });
   const delteCollege = await College.deleteOne({ Email });
  res.status(200).json({ message: 'College and associated students deleted successfully' });
  }
  catch(err){
    console.log(err);
  }
 })
 router.post("/update",async(req,res)=>{
  const id=req.body.id
  console.log("-------------------------------------------"+id);
  const result=await College.updateOne({_id:id},{
      $set:{
          Name:req.body.Name,
          Email:req.body.Email,
          State:req.body.State,
          City:req.body.City,
          Rating:req.body.Rating
       }
  })
  console.log("---------------------------line 62"+result);
  res.send(result);
 })
 router.post("/fetchcollegetoupdate",async(req,res)=>{
  const id=req.body.id;
  const result=await College.findOne({_id:id})
  console.log(result);
  res.send(result);
 })
 router.get("/:name/getstudents",async(req,res)=>{
  // res.send("hello")
  let students=await College.find({Name:req.params.name}).populate("Students")
  res.send(students);
 })
 module.exports=router