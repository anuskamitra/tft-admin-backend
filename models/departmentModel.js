const mongoose=require("mongoose");

const departmentSchema=mongoose.Schema({
        Name:{type:String,required:true},
        Students:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Student"
            }
        ]
   },
{
    timestamps: true,
})
const Department=new mongoose.model("Department",departmentSchema);
module.exports=Department;