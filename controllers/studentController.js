const Student=require("../models/studentModel");
const College=require("../models/collegeModel")

const addStudent=async(req,res)=>{
    const Email=req.body.email;
    try{
        const studentFound=await Student.findOne({Email:Email})
        if(studentFound){
            res.send("alreadyexist")
        }
        else{
            const createStudent=await Student.create({
                Name:req.body.name,
                Email:req.body.email,
                College:req.body.college,
                Birthday:req.body.birthDay,
                Department:req.body.department,   
            })
            
            const collegeId = req.body.college;
           
             await College.findByIdAndUpdate(collegeId, { $push: { Students:createStudent._id } });
            if(createStudent){
                console.log(createStudent);
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
}

const updateStudent=async(req,res)=>{
    const id=req.body.id
    console.log(req.body)
    try{
    const result=await Student.updateOne({_id:id},{
        $set:{
            Name:req.body.name,
            Email:req.body.email,
            Parent:req.body.parent,
            College:req.body.college,
            Department:req.body.department,
            Birthday:req.body.birthDay,
            Address:req.body.address
        }
        
    })
    const collegeId = req.body.college;
    const prevCollegeId=req.body.prevCollege;
    if(req.body.prevCollege!==collegeId){
        console.log("req.body.prevCollege"+req.body.prevCollege)
       const pullCollege= await College.findByIdAndUpdate(prevCollegeId,
            { $pull: { Students: id } },
            { new: true }
          );
        await College.findByIdAndUpdate(collegeId, { $push: { Students: id } }, { new: true });
    }
   
   
    res.send(result);
}
catch(err){
console.log(err);
}
}

const deleteStudent=async(req,res)=>{
    console.log(req.body);
    const Email=req.body.Email
    const id=req.body._id;
    const collegeId=req.body.College._id;
    const result=await Student.deleteOne({Email})
    const pullCollege= await College.findByIdAndUpdate(collegeId,
        { $pull: { Students: id } },
        { new: true }
      );
    console.log(result);
    res.status(200).send(result);
}

const fetchStudents=async(req,res)=>{
    const studentList=await Student.find().populate('College')
    res.send(studentList)
}

const fetchStudentToUpdate=async(req,res)=>{
    const id=req.body.id
    const student=await Student.findOne({_id:id}).populate("College")
    res.send(student)
}
module.exports={addStudent,updateStudent,deleteStudent,fetchStudents,fetchStudentToUpdate};