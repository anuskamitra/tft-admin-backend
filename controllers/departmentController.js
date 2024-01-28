const Department = require("../models/departmentModel")
const Student=require("../models/studentModel");

const fetchdepartments=async(req,res)=>{
    try{
        const result=await Department.find({}).populate("Students");
        res.send(result);
    }catch(err){

    }

}
const addnew=async(req,res)=>{
    console.log(req.body);
  const Name=req.body.Name;
    try{
       const DepartmentFound=await Department.findOne({Name:Name})
       if(DepartmentFound){
          res.send("DepartmentFound")
       }
       else{
           const createDepartment=await Department.create({
             Name 
           })
           if(createDepartment){
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
const fetchdepartmenttoupdate=async(req,res)=>{
    console.log("line 41"+req.body)
    const id=req.body.id;
    const result=await Department.findOne({_id:id})
    console.log(result);
    res.send(result);
   }
const update=async(req,res)=>{
    const id=req.body.id
    const result=await Department.updateOne({_id:id},{
        $set:{
            Name:req.body.Name,
         }
    })
    res.send(result);
}
const deleteDepartment=async(req,res)=>{
    const id=req.body._id;
   
    const updateStudents= await Student.updateMany({Department:id}, { $set:{Department:null} } );
    const result=await Department.deleteOne({_id:id})

    console.log(result)
    res.send(result);
}

module.exports={fetchdepartments,addnew,fetchdepartmenttoupdate,update,deleteDepartment};