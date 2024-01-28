const express=require("express");
const router=express.Router()
const {fetchdepartments,addnew,fetchdepartmenttoupdate,update,deleteDepartment}=require("../controllers/departmentController")

router.get("/fetchdepartments",fetchdepartments)
router.post("/addnew",addnew);
router.post("/fetchdepartmenttoupdate",fetchdepartmenttoupdate)
router.post("/update",update)
router.post("/delete",deleteDepartment)
module.exports=router

