const Student = require("../models/studentModel");
const College = require("../models/collegeModel");
const Department = require("../models/departmentModel");
const bcrypt = require("bcrypt");
const generateToken=require("../config/generateToken")

const saltRound = 10;
let createStudent="";

const addStudent = async (req, res) => {
  const Email = req.body.email;
  const Password=req.body.password
  try {
    const studentFound = await Student.findOne({ Email: Email });
    if (studentFound) {
      res.send("alreadyexist");
    } else {
      console.log("....................." + req.body.password);
      console.log(req.body.passingDate);
      let passingYear=req.body.passingDate?.substring(0,4);
       bcrypt.hash(Password,saltRound,async(err,hash)=>{
        createStudent = await Student.create({
            Name: req.body.name,
            Email: req.body.email,
            College: req.body.college,
            Birthday: req.body.birthDay,
            Department: req.body.department,
            PhotoInFileFormat: req.body.photoInFileFormat,
            Password: hash,
            Photo: req.body.photo || "avatar.png",
            Father:req.body.fatherName,
            Mother:req.body.motherName,
            Mobile:req.body.mobile,
            PassingYear:passingYear||"2023",
            Sem:req.body.sem,
          });
       })
      

      const collegeId = req.body.college;
      const departmentId = req.body.department;

      await College.findByIdAndUpdate(collegeId, {
        $push: { Students: createStudent._id },
      });
      await Department.findByIdAndUpdate(departmentId, {
        $push: { Students: createStudent._id },
      });
      if (createStudent) {
        console.log(createStudent);
        res.status(200).send("created");
      } else {
        res.status(400).send("Failed to create");
      }
    }
  } catch (err) {
    console.log("error in add new" + err);
  }
};

const updateStudent = async (req, res) => {
  const id = req.body.id;
  const currentStudent = await Student.findOne({ _id: id });
  let Password = req.body.password;
  console.log(req.body.fatherName)
  let result="";

  try {
 if(currentStudent.Email!=req.body.email){
  const changedEmail=req.body.email
  
 const ifExist= await Student.findOne({ Email: changedEmail });
 if(ifExist){
  console.log("----------------------------67"+req.body.email)
  res.send("alreadyexist");

  return;
 }
 }
    if (currentStudent.Password != Password) {
      console.log("....................." + req.body.password);
      console.log(req.body.passingDate);
      let passingYear=req.body.passingDate?.substring(0,4);
      bcrypt.hash(Password, saltRound, async (err, hash) => {
         result = await Student.updateOne(
          { _id: id },
          {
            $set: {
              Name: req.body.name,
              Email: req.body.email,
              Parent: req.body.parent,
              College: req.body.college,
              Department: req.body.department,
              Birthday: req.body.birthDay,
              Address: req.body.address,
              Password: hash,
              Sem:req.body.sem,
              Photo: req.body.photo,
              Father:req.body.fatherName,
              Mother:req.body.motherName,
              Mobile:req.body.mobile,
              PassingYear:passingYear||"2023",
            },
          }
        );
      });
    }
    else{
      console.log("....................." + req.body.password);
      console.log(req.body.passingDate);
      let passingYear=req.body.passingDate?.substring(0,4);
      console.log("----------------------------101"+req.body.email)
        result = await Student.updateOne(
            { _id: id },
            {
              $set: {
                Name: req.body.name,
                Email: req.body.email,
                Parent: req.body.parent,
                College: req.body.college,
                Department: req.body.department,
                Birthday: req.body.birthDay,
                Address: req.body.address,
                Photo: req.body.photo,
                Sem:req.body.sem,
                Father:req.body.fatherName,
              Mother:req.body.motherName,
              Mobile:req.body.mobile,
              PassingYear:passingYear||"2023",
              },
            }
          );
    }
    console.log("page  58" + req.body.prevDepartment);
    const collegeId = req.body.college;
    const prevCollegeId = req.body.prevCollege;
    const departmentId = req.body.department;
    const prevDepartmentId = req.body.prevDepartment;
    if (req.body.prevCollege !== collegeId) {
      console.log("req.body.prevCollege" + req.body.prevCollege);
      const pullCollege = await College.findByIdAndUpdate(
        prevCollegeId,
        { $pull: { Students: id } },
        { new: true }
      );
      await College.findByIdAndUpdate(
        collegeId,
        { $push: { Students: id } },
        { new: true }
      );
    }
    if (req.body.prevDepartment !== departmentId) {
      const pulldepartment = await Department.findByIdAndUpdate(
        prevDepartmentId,
        { $pull: { Students: id } },
        { new: true }
      );
      await Department.findByIdAndUpdate(
        departmentId,
        { $push: { Students: id } },
        { new: true }
      );
    }

    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

const deleteStudent = async (req, res) => {
  console.log(req.body);
  const Email = req.body.Email;
  const id = req.body._id;
  const collegeId = req.body.College._id;
  const departmentId = req.body.Department?._id;
  const result = await Student.deleteOne({ Email });
  const pullCollege = await College.findByIdAndUpdate(
    collegeId,
    { $pull: { Students: id } },
    { new: true }
  );
  if (departmentId) {
    const pullDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { $pull: { Students: id } },
      { new: true }
    );
    console.log(pullDepartment);
  }

  console.log(result);
  res.status(200).send(result);
};

const fetchStudents = async (req, res) => {
  const studentList = await Student.find()
    .populate("College")
    .populate("Department");
  res.send(studentList);
};
const fetchStudentsForCollege = async (req, res) => {
  const id = req.body.collegeId;
  const studentList = await Student.find({ College: id })
    .populate("College")
    .populate("Department");
  res.send(studentList);
};
const fetchAlumni=async(req,res)=>{
  const year=req.body.year;
  console.log("-----------------"+year)
  const alumniList=await Student.find({Alumni:true,PassingYear:year}).populate("College").populate("Department");
  console.log("------------------------------"+alumniList)
   res.send(alumniList)
}

const fetchOneStudent= async (req, res) => {
  const id = req.body.id;
  const student = await Student.findOne({ _id: id })
    .populate("College")
    .populate("Department");
    console.log("--------------------"+student)
  res.send(student);
};
const countStudents = async (req, res) => {
  id = req.body.collegeId;
  const studentList = await Student.find({ College: id })
  console.log("---------------------------------------------------"+studentList)
  res.send(studentList);
};
const updateMobile=async(req,res)=>{
  const id=req.body.id;
  console.log("----------------------------------------214"+id)
    const result=await Student.updateOne({_id:id},
      {
        $set:{
          Mobile:req.body.newNumber
        }
      })
  if(result){
    res.send("ok")
  }
  
}
const updateEmail=async(req,res)=>{
  const id=req.body.id;
  const email=req.body.newEmail;
  console.log(email+"------------------------------------------------")
  const result=await Student.updateOne({_id:id},
    {
      $set:{
        Email:email
      }
    })
    res.send(result)
  console.log(result);
}

const uploadResult=async(req,res)=>{
  let responseToBeSent="";
  const resultStatus=req.body.status;
  const Title=req.body.title
  const Result=req.body.result;
  const id=req.body.id;
  console.log("-----------------------------------------------"+resultStatus+" "+Title+" "+Result+" "+id);

 try{
  const newResult={
    Title:Title,
    Result:Result,
    ResultStatus:resultStatus
  }
  responseToBeSent =await Student.updateOne({_id:id},
    { $push: { Results: newResult } }

    )
    console.log(responseToBeSent)
   

 }catch(err){
  console.log(err)
 }

 const studentTOCheck=await Student.findOne({_id:id});

 console.log(studentTOCheck.Results)
 
 if(studentTOCheck.Results.length==4){
  let flag=0;
  for(let i=0;i<4;i++){
    if(studentTOCheck.Results[i].ResultStatus==false){
      flag=1;
      break; 
    }
  }
  if(flag==0){
    const response=await Student.updateOne({_id:id},
     {$set: {Alumni:true}}
      )
      console.log(response);
  }

  }
 res.send(responseToBeSent)

  
}
const deleteResult=async(req,res)=>{
  console.log("InDeleteResult")
console.log(req.body);
const {id,resultToBeDeleted}=req.body;
const pullResult = await Student.findByIdAndUpdate(
  {_id:id},
  { $pull: { Results: {Title:resultToBeDeleted} }},
  { new: true }
);
console.log(resultToBeDeleted)
console.log("------------------------------------------------------------255 "+pullResult);
if(pullResult){
  res.send("ok");
}

}
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await Student.findOne({ Email: email }).populate("College");
    if (!foundUser) {
        console.log("notFound");
      res.send("notFound");
    } else {
        console.log("-----------------------------------------288"+ foundUser);
        if(foundUser.College.BlackListed){
          res.send("BlackListed");
        }
        else{
      bcrypt.compare(password, foundUser.Password, async (err, result) => {
        if (result === true) {
          console.log(foundUser.College._id);
          res.status(201).json({
            _id: foundUser._id,
            name: foundUser.Name,
            email: foundUser.Email,
            department:foundUser.Department,
            college:foundUser.College._id,
            typeOfUser: "Student",
            sem:foundUser.Sem,
            token: generateToken(foundUser._id),
          });
        } else {
            console.log("Found");
          res.send("wrongPassword");
        }
      
      });
    }
    }
  } catch (err) {
    console.log("error in login" + err);
  }
};
module.exports = {
  addStudent,
  updateStudent,
  deleteStudent,
  fetchStudents,
  fetchStudentsForCollege,
  fetchOneStudent,
  countStudents,
  loginStudent,
  updateMobile,
  updateEmail,
  uploadResult,
  deleteResult,
  fetchAlumni
};
