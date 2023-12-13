const express=require("express");
const router=express.Router()
const Department = require("../models/departmentModel")
const Student=require("../models/studentModel");

router.get("/fetchdepartments",async(req,res)=>{
    try{
        const result=await Department.find({}).populate("Students");
        res.send(result);
    }catch(err){

    }

})
router.post("/addnew",async(req,res)=>{
    console.log(req.body);
  const Name=req.body.Name;
    try{
       const DepartmentFound=await Department.findOne({Name:Name})
       if(DepartmentFound){
          res.send("DepartmentFound")
       }
       else{
           const createDepartment=await Department.create({
             Name 
           })
           if(createDepartment){
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
router.post("/fetchdepartmenttoupdate",async(req,res)=>{
    console.log("line 41"+req.body)
    const id=req.body.id;
    const result=await Department.findOne({_id:id})
    console.log(result);
    res.send(result);
   })
router.post("/update",async(req,res)=>{
    const id=req.body.id
    const result=await Department.updateOne({_id:id},{
        $set:{
            Name:req.body.Name,
         }
    })
    res.send(result);
})
router.post("/delete",async(req,res)=>{
    const id=req.body._id;
   
    const updateStudents= await Student.updateMany({Department:id}, { $set:{Department:null} } );
    const result=await Department.deleteOne({_id:id})

    console.log(result)
    res.send(result);
})
module.exports=router

