const express=require("express");
const router=express.Router();

const {addStudent,updateStudent, deleteStudent, fetchStudents, fetchStudentToUpdate}=require("../controllers/studentController")

router.post("/addnew",addStudent)
router.post("/fetchStudentToUpdate",fetchStudentToUpdate)
router.get("/fetchStudents",fetchStudents)
router.post("/delete",deleteStudent)
router.post("/update",updateStudent)

module.exports=router