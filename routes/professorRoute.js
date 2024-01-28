const express=require("express");
const router=express.Router();
const {getFetchprofessors,postFetchprofessors,addnew,deleteProf,update, fetchprofessortoupdate}=require("../controllers/professorController")
router.get("/fetchprofessors",getFetchprofessors)
router.post("/fetchprofessors",postFetchprofessors)
router.post("/addnew",addnew)
router.post("/fetchprofessortoupdate",fetchprofessortoupdate)
router.post("/update",update)
router.post("/delete",deleteProf)

module.exports=router