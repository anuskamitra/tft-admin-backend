const express=require("express");
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

const {addStudent,updateStudent, deleteStudent,countStudents,fetchStudents,fetchStudentsForCollege, loginStudent, fetchOneStudent,updateMobile,updateEmail,uploadResult,deleteResult}=require("../controllers/studentController")

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
router.post("/uploadResult",upload.single("result"),uploadResult)
router.post("/deleteResult",deleteResult)

module.exports=router