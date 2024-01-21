const mongoose=require("mongoose")
const collegeSchema=new mongoose.Schema({
    Name:{type:String,required:true},
    Email:{type:String,required:true},
    Password:{type:String,required:true},
    State:{type:String},
    City:{type:String},
    BlackListed:{type:Boolean, default:false},
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
    ],
    Holidays:[{
        StartDate:{type:String},
        EndDate:{type:String},
        StartDay:{type:String},
        EndDay:{type:String},
        Reason:{type:String},
    }]
},
{
    timestamps: true,
}

)

const College=new mongoose.model("College",collegeSchema);

module.exports=College;
