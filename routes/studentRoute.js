const express=require("express");
const router=express.Router();

const {addStudent,updateStudent, deleteStudent,countStudents,fetchStudents,fetchStudentsForCollege, fetchStudentToUpdate}=require("../controllers/studentController")

router.post("/addnew",addStudent)
router.post("/fetchStudentToUpdate",fetchStudentToUpdate)
router.get("/fetchStudents",fetchStudents)
router.post("/fetchStudents",fetchStudentsForCollege)
router.post("/delete",deleteStudent)
router.post("/update",updateStudent)
router.post("/countStudents",countStudents)

module.exports=router