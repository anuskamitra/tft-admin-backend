
const Professor =require("../models/professorModel");
const getFetchprofessors=async(req,res)=>{
    await Professor.find().populate("Department").populate("College")
    .then(response=>{
        res.send(response);
    })
    }
const postFetchprofessors=async(req,res)=>{
    let collegeId=req.body.collegeId;
    await Professor.find({College:collegeId}).populate('Department')

    .then(response=>{
        res.send(response);
    })

}
const addnew=async(req,res)=>{

    const {Photo,Name,Email,College,Department}=req.body;
    console.log(Photo);
   const professorExist=await Professor.findOne({Email:Email})
    if(professorExist){
        res.send("alreadyExist");
    }
    else{
        const professor=await Professor.create({
            Photo:Photo||"avatar.png",
            Name,
            Email,
            College,
            Department
        })
        if(professor){
            res.status(200).send("created");
        }
        else{
            res.send("failed");
        }
    }
}
const fetchprofessortoupdate=async(req,res)=>{
    const id=req.body.id;
    console.log("----------------------49"+id)
    const professor=await Professor.findOne({_id:id}).populate('Department').populate('College')
    res.send(professor)
}
const update=async(req,res)=>{
    const {_id,Name,Email,College,Department,Photo}=req.body;
    console.log(_id,"  ",Name,"   ",Email,"    ",College,"   ",Department,"   ",Photo)
    const professor=await Professor.findOneAndUpdate({_id:_id},{
        $set:{
            Name,
            Email,
            College,
            Department,
            Photo
        }

    })
    console.log(professor)
    res.send(professor)


}
const deleteProf=async(req,res)=>{
    console.log("-----------------------------------------71 "+req.body._id)
    const id=req.body._id;
    const professor=await Professor.deleteOne({_id:id})
    res.send(professor)

}

module.exports={getFetchprofessors,postFetchprofessors,addnew,deleteProf,update, fetchprofessortoupdate}