const mongoose=require("mongoose");

const professorSchema=mongoose.Schema({
    Photo:{type:String,
        default:"avatar.png"
    },
    Name:{type:String,required:true},
    Email:{type:String,required:true},
    College:{type:mongoose.Schema.Types.ObjectId,ref:"College",required:true},
    Department:{type:mongoose.Schema.Types.ObjectId,ref:"Department",required:true},
})

const Professor=mongoose.model("Professor",professorSchema)
module.exports=Professor;

