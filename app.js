const env=require("dotenv");
const express=require("express");
const cors=require("cors");

const userRouter=require("./routes/userRoutes")
const studentRouter=require("./routes/studentRoute")
const collegeRouter=require("./routes/collegeRoute")
const departmentRouter=require("./routes/departmentRoute")
const professorRoute=require("./routes/professorRoute")
const samplePaperRoute=require("./routes/samplePaperRoute")
const connectDB =require("./config/db")

const app=express();
env.config();
// env.config({path:"../.env"});
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use(express.json());

app.use("/files",express.static("files"))
connectDB();

app.get("/",function(req,res){
    res.send("Hello");
})
app.use("/user",userRouter)

app.use("/api",studentRouter)

app.use("/college",collegeRouter)

app.use("/department",departmentRouter)

app.use("/professor",professorRoute)

app.use("/samplePaper",samplePaperRoute);

const port=process.env.PORT;
app.listen(port,function(req,res){
    console.log("listening at "+ port);
})