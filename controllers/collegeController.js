const College = require("../models/collegeModel");
const Department = require("../models/departmentModel");
const Student = require("../models/studentModel");
const bcrypt = require("bcrypt");
const saltRound = 10;
const generateToken = require("../config/generateToken");

const login= async (req, res) => {
    const { email, password } = req.body;
    try {
      console.log("-----------line 26" + email + password);
      const foundUser = await College.findOne({ Email: email });
      if (!foundUser) {
        res.send("notFound");
      } else {
        console.log(foundUser)
        if (foundUser.BlackListed === true) {
          console.log("-----------------------------------------------23",foundUser.BlackListed)
          res.send("BlackListed");
  
        } else {
          bcrypt.compare(password, foundUser.Password, async (err, result) => {
            if (result == true) {
              console.log(foundUser.Email);
              res.status(201).json({
                _id: foundUser._id,
                name: foundUser.Name,
                email: foundUser.Email,
                typeOfUser: "College",
                token: generateToken(foundUser._id),
              });
            } else {
              res.send("wrongPassword");
            }
          });
        }
      }
    } catch (err) {
      console.log("error in login" + err);
    }
}
const addnew=async (req, res) => {
    const Email = req.body.Email;
    try {
      const collegeFound = await College.findOne({ Email: Email });
      if (collegeFound) {
        res.send("alreadyexist");
      } else {
        let Password = req.body.Password;
        const { Name, Email, State, City, Rating } = req.body;
        bcrypt.hash(Password, saltRound, async (err, hash) => {
          const createCollege = await College.create({
            Name,
            Email,
            State,
            City,
            Rating,
            Departments: req.body.departments,
            Password: hash,
          });
          if (createCollege) {
            res.status(200).send("created");
          } else {
            res.status(400).send("Failed to create");
          }
        });
      }
    } catch (err) {
      console.log("error in add new" + err);
    }
}
const fetchcolleges=async (req, res) => {
    const result = await College.find({})
      .populate("Students")
      .populate("Departments");
    res.send(result);
}
const fetchdepartments=async (req, res) => {
    id = req.body.collegeId;
    console.log(id);
    const departmentList = await College.findOne(
      { _id: id },
      { Departments: 1 }
    ).populate("Departments");
    console.log(departmentList);
    res.send(departmentList.Departments);
}
const deleteCollege= async (req, res) => {
    try {
    const Email = req.body.Email;
    const college = await College.findOne({ Email: Email });
    console.log(college);
    const deleteStudents = await Student.deleteMany({
      _id: { $in: college.Students },
    });
    const deleteCollege = await College.deleteOne({ Email });
    res.status(200).json({
      message: "College and associated students deleted successfully",
    });
  } catch (err) {
    console.log(err);
  }
}
const update= async (req, res) => {
const id = req.body.id;
const currentCollege = await College.findById(id);
const newDepartments = req.body.Departments;
const departmentsToAdd = newDepartments.filter(
  (dep) => !currentCollege.Departments.includes(dep)
);

const departmentsToRemove = req.body.RemovedDepartments;
let Password = req.body.Password;
if (currentCollege.Password != Password) {
  bcrypt.hash(Password, saltRound, async (err, hash) => {
    const result = await College.updateOne(
      { _id: id },
      {
        $set: {
          Name: req.body.Name,
          Email: req.body.Email,
          State: req.body.State,
          City: req.body.City,
          Rating: req.body.Rating,
          Password: hash,
          Departments: newDepartments,
        },
      }
    );
    res.send(result);
  });
} else {
  const result = await College.updateOne(
    { _id: id },
    {
      $set: {
        Name: req.body.Name,
        Email: req.body.Email,
        State: req.body.State,
        City: req.body.City,
        Rating: req.body.Rating,
        Departments: newDepartments,
      },
    }
  );
  res.send(result);
}
if (departmentsToRemove.length > 0) {
  const studentsToUpdate = await Student.find({
    College: id,
    Department: { $in: departmentsToRemove },
  });
  console.log("-----------------Line 80" + studentsToUpdate);

  const updatePromises = await studentsToUpdate.map((student) => {
    return Student.findByIdAndUpdate(student._id, {
      $set: { Department: null },
    });
  });

  await Promise.all(updatePromises);
  await Department.updateMany(
    { _id: { $in: departmentsToRemove } },
    {
      $pull: {
        Students: { $in: studentsToUpdate.map((student) => student._id) },
      },
    }
  );
}
}
const block=async (req, res) => {
    const id = req.body.id;
    const blackListed=req.body.blackListed;
    console.log("------------------------------" + 176 + "   " + id);
    const response = await College.updateOne(
      { _id: id },
      {
        BlackListed: blackListed ,
      }
    );
    console.log(response);
    res.send(response);
}
const fetchcollegetoupdate=async (req, res) => {
    const id = req.body.id;
    const result = await College.findOne({ _id: id });
    res.send(result);
}
const departmentAddnew = async (req, res) => {
    const Name = req.body.Name;
    const id = req.body.id;
    const currentCollege = await College.findById(id);
    let dep = await Department.findOne({ Name });
    const depId = dep._id;
    const departments = [...currentCollege.Departments, depId];
  
    const result = await College.updateOne(
      { _id: id },
      {
        $set: {
          Departments: departments,
        },
      }
    );
    res.send(result);
}
const departmentDelete=async (req, res) => {
    const { _id, collegeId } = req.body;
    const result = await College.updateOne(
      { _id: collegeId },
      { $pull: { Departments: _id } }
    );
  
    const resu = await Student.updateMany(
      { College: collegeId, Department: _id },
      { $set: { Department: null } }
    );
    console.log(resu);
    res.send(result);
}
const fetchonecollege=async (req, res) => {
 
    const collegeId = req.body.collegeId;
    console.log("Hello---------------------Hello"+collegeId)
    const college = await College.findOne({ _id: collegeId }).populate(
      "Departments"
    );
  console.log(college)
    res.send(college);
}
const addHoliday=async(req,res)=>{
    const collegeId = req.body.collegeId;
    const holidayDetails={
      StartDate:req.body.StartDate,
      EndDate:req.body.EndDate,
      StartDay:req.body.StartDay,
      EndDay:req.body.EndDay,
      Reason:req.body.Reason
    }
    // const holidayDetails=req.body.holidayArr;
    const college = await College.findOne({ _id: collegeId })
    // if(college.Holidays.includes(Date)){
    //   res.send("allready exisist")
    // }
    // else{
     const holidays=[...college.Holidays,holidayDetails];
    // const holidays=[...college.Holidays]
    //  holidays.push(...holidayDetails)
    const addHoliday=await College.updateOne({ _id: collegeId },
     { $set:{
        Holidays:holidays
      }}
      )
      console.log(addHoliday);
      res.send(addHoliday);
    // }
}
module.exports={login,addnew,fetchcolleges,fetchdepartments,deleteCollege,update,block,fetchcollegetoupdate,departmentAddnew,departmentDelete,fetchonecollege,addHoliday};

