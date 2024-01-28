const express=require("express");
const router=express.Router();
const {addStudent,updateStudent, deleteStudent,countStudents,fetchStudents,fetchStudentsForCollege, loginStudent, fetchOneStudent,updateMobile,updateEmail,uploadResult,deleteResult,fetchAlumni}=require("../controllers/studentController")

router.post("/addnew",addStudent)
router.post("/fetchOneStudent",fetchOneStudent)
router.get("/fetchStudents",fetchStudents)
router.post("/fetchStudents",fetchStudentsForCollege)
router.post("/delete",deleteStudent)
router.post("/update",updateStudent)
router.post("/countStudents",countStudents)
router.post("/login",loginStudent)
router.post("/updateMobile",updateMobile)
router.post("/updateEmail",updateEmail)
router.post("/uploadResult",uploadResult)
router.post("/deleteResult",deleteResult)
router.post("/fetchAlumni",fetchAlumni)

module.exports=router