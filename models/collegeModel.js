const mongoose=require("mongoose")
const Student=require("./studentModel")
const collegeSchema=new mongoose.Schema({
    Name:{type:String,required:true},
    Email:{type:String,required:true},
    State:{type:String},
    City:{type:String},
    Rating:{type:Number},
    Students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student"
        }
    ],
    Departments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Department"
        }
    ]
},
{
    timestamps: true,
}
)


const College=new mongoose.model("College",collegeSchema);
module.exports=College;
