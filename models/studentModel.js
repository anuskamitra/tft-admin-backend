const mongoose=require('mongoose')
const studentSchema=mongoose.Schema(
    {
        Name:{type:String,required:true},
        Email:{type:String,required:true},
        Alumni:{type:Boolean,default:false},
        PassingYear:{type:String},
        CGPA:{type:String},
        College:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"College",
        },
        Photo:{type:String,
            default:"avatar.png"
        },
        Password:{type:String,required:true},
        Birthday:{type:String},
        Department:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Department",
            default:null
        },
        Mother:{type:String},
        Father:{type:String},
        Mobile:{type:String},
        Sem:{type:Number},
        Results:[{
            Title:{type:Number},
            Result:{type:String},
            ResultStatus:{type:Boolean}

        }]
    },
    {
        timestamps: true,
    }
)
const Student=new mongoose.model("Student",studentSchema);
module.exports=Student