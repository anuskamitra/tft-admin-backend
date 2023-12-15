const express=require("express");
const College = require("../models/collegeModel");
const Department= require("../models/departmentModel")
const Student=require("../models/studentModel");

const router=express.Router();


 router.get("/",(req,res)=>{
    res.send("Hello College");
 })
 router.post("/addnew",async(req,res)=>{
 const Email=req.body.Email;
   try{
      const collegeFound=await College.findOne({Email:Email})
      if(collegeFound){
         res.send("alreadyexist")
      }
      else{
         const {Name,Email,State,City,Rating,Departments}=req.body;
         console.log(Departments);
          const createCollege=await College.create({
            Name,
            Email,
            State,
            City,
            Rating,
            Departments:req.body.departments
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
   const result=await College.find({}).populate("Students").populate("Departments");
   res.send(result);
 })
 router.post("/delete",async(req,res)=>{
  try{
   const Email=req.body.Email;
   const college =await College.findOne({Email:Email})
   console.log(college)
   const deleteStudents= await Student.deleteMany({ _id: { $in: college.Students } });
   const deleteCollege = await College.deleteOne({ Email });
  res.status(200).json({ message: 'College and associated students deleted successfully' });
  }
  catch(err){
    console.log(err);
  }
 })
 router.post("/update",async(req,res)=>{
  const id=req.body.id;
  // RemovedDepartments=req.body.RemovedDepartments
  const currentCollege = await College.findById(id);
  const newDepartments=req.body.Departments;
  const departmentsToAdd = newDepartments.filter(dep => !currentCollege.Departments.includes(dep));
  const departmentsToRemove = req.body.RemovedDepartments
  console.log("-------------------------------------------"+req.body.RemovedDepartments);
  const result=await College.updateOne({_id:id},{
      $set:{
          Name:req.body.Name,
          Email:req.body.Email,
          State:req.body.State,
          City:req.body.City,
          Rating:req.body.Rating,
          Departments:newDepartments
       }
  })
  if (departmentsToRemove.length > 0) {
    // Find students associated with the college and the removed departments
    const studentsToUpdate = await Student.find({ College: id, Department: { $in: departmentsToRemove } });
   console.log("-----------------Line 80"+studentsToUpdate)
    // Update the Department field to null for each student
    const updatePromises = await studentsToUpdate.map(student => {
           return Student.findByIdAndUpdate(student._id, { $set: { Department: null } });
    });

    await Promise.all(updatePromises);
    await Department.updateMany(
      { _id: { $in: departmentsToRemove } },
      { $pull: { Students: { $in: studentsToUpdate.map(student => student._id) } } }
    );
  }

    
  
   
  res.send(result);
 })
 router.post("/fetchcollegetoupdate",async(req,res)=>{
  const id=req.body.id;
  const result=await College.findOne({_id:id})
  res.send(result);
 })
 router.get("/:name/getstudents",async(req,res)=>{
  // res.send("hello")
  let students=await College.find({Name:req.params.name}).populate("Students")
  res.send(students);
 })
 module.exports=router