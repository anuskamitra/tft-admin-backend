const express=require("express");
const SamplePaper =require("../models/samplePaperModel");
const router=express.Router();

const multer=require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + '-' +file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post("/addPaper",upload.single("paper"),async(req,res)=>{
  const {CollegeID,Semester,DepartmentID,SubjectName}=req.body
  const PDF=req.file?.filename;
  console.log( {CollegeID,Semester,DepartmentID,SubjectName,PDF});
  const response=await SamplePaper.create({CollegeID,Semester,DepartmentID,SubjectName,PDF})

  res.send({CollegeID,Semester,DepartmentID,SubjectName,PDF})
   
})
router.post("/getPapers",async(req,res)=>{
    const{CollegeID,Semester,DepartmentID}=req.body;
    console.log("---------------------------------------22"+CollegeID);
    const result= await SamplePaper.find({CollegeID,Semester,DepartmentID});
    res.send(result)

})
router.post("/deletePaper",async(req,res)=>{
    const id=req.body.id;
    console.log(id);
    const response=await SamplePaper.deleteOne({_id:id});
    console.log(response);
    res.send(response)
})

router.post("/uploadPaper",async(req,res)=>{
    let responseToBeSent="";
    console.log("-----------------------------------------------"+req.body.id);
    console.log(req.file)
    const id=req.body.id
  
    console.log(PDF)
   try{
    responseToBeSent =await SamplePaper.updateOne({_id:id},
      { $set: { PDF: PDF } }
  
      )
      console.log(responseToBeSent)
     
  
   }catch(err){
    console.log(err)
    }

})
module.exports=router