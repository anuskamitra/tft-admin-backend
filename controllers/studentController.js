const Student=require("../models/studentModel");
const College=require("../models/collegeModel")
const Department = require("../models/departmentModel")

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
                Photo:req.body.photo||"avatar.png"
            })
            
            const collegeId = req.body.college;
            const departmentId=req.body.department;
           
             await College.findByIdAndUpdate(collegeId, { $push: { Students:createStudent._id } });
             await Department.findByIdAndUpdate(departmentId, { $push: { Students:createStudent._id }});
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
            Address:req.body.address,
            Photo:req.body.photo
        }
        
    })
    console.log("page  58"+req.body.prevDepartment)
    const collegeId = req.body.college;
    const prevCollegeId=req.body.prevCollege;
    const departmentId = req.body.department;
    const prevDepartmentId=req.body.prevDepartment;
    if(req.body.prevCollege!==collegeId){
        console.log("req.body.prevCollege"+req.body.prevCollege)
       const pullCollege= await College.findByIdAndUpdate(prevCollegeId,
            { $pull: { Students: id } },
            { new: true }
          );
        await College.findByIdAndUpdate(collegeId, { $push: { Students: id } }, { new: true });
    }
    if(req.body.prevDepartment!==departmentId){
       const pulldepartment= await Department.findByIdAndUpdate(prevDepartmentId,
            { $pull: { Students: id } },
            { new: true }
          );
        await Department.findByIdAndUpdate(departmentId, { $push: { Students: id } }, { new: true });
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
    const departmentId=req.body.Department._id
    const result=await Student.deleteOne({Email})
    const pullCollege= await College.findByIdAndUpdate(collegeId,
        { $pull: { Students: id } },
        { new: true }
      );
    const pullDepartment= await Department.findByIdAndUpdate(departmentId,
        { $pull: { Students: id } },
        { new: true }
      );
      console.log(pullDepartment)
    console.log(result);
    res.status(200).send(result);
}

const fetchStudents=async(req,res)=>{
    const studentList=await Student.find().populate('College').populate('Department')
    res.send(studentList)
}

const fetchStudentToUpdate=async(req,res)=>{
    const id=req.body.id
    const student=await Student.findOne({_id:id}).populate("College").populate('Department')
    res.send(student)
}
module.exports={addStudent,updateStudent,deleteStudent,fetchStudents,fetchStudentToUpdate};