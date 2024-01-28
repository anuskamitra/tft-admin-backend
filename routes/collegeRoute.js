const express = require("express");
const College = require("../models/collegeModel");
const Department = require("../models/departmentModel");
const Student = require("../models/studentModel");
const bcrypt = require("bcrypt");
const saltRound = 10;
const generateToken = require("../config/generateToken");
const router = express.Router();
const {login,addnew,fetchcolleges,fetchdepartments,deleteCollege,update,block,fetchcollegetoupdate,departmentAddnew,departmentDelete,fetchonecollege,addHoliday}=require("../controllers/collegeController")



router.get("/", (req, res) => {
  res.send("Hello College");
});

router.post("/login",login);
router.post("/addnew", addnew);

router.get("/fetchcolleges",fetchcolleges);
router.post("/fetchdepartments", fetchdepartments);
router.post("/delete",deleteCollege);
router.post("/update", update);
router.post("/block", block);

router.post("/fetchcollegetoupdate",fetchcollegetoupdate);
router.get("/:name/getstudents", async (req, res) => {
  // res.send("hello")
  let students = await College.find({ Name: req.params.name }).populate(
    "Students"
  );
  res.send(students);
});
router.post("/department/addnew", departmentAddnew);
router.post("/department/delete", departmentDelete);
router.post("/fetchonecollege",fetchonecollege);
router.post("/addHoliday",addHoliday)

module.exports = router;
