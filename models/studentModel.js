const mongoose=require('mongoose')
const studentSchema=mongoose.Schema(
    {
        Name:{type:String,required:true},
        Email:{type:String,required:true},
        College:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"College",
        },
        Photo:{type:String,
            default:"avatar.png"
        },
        Birthday:{type:String},
        Department:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Department",
        },
    },
    {
        timestamps: true,
    }
)
const Student=new mongoose.model("Student",studentSchema);
module.exports=Student