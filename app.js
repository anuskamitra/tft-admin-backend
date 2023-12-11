const env=require("dotenv");
const express=require("express");
const cors=require("cors");

const userRouter=require("./routes/userRoutes")
const studentRouter=require("./routes/studentRoute")
const collegeRouter=require("./routes/collegeRoute")
const connectDB =require("./config/db")

const app=express();
env.config();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))

app.use(express.json());

connectDB();

app.get("/",function(req,res){
    res.send("Hello");
})
app.use("/user",userRouter)

app.use("/api",studentRouter)

app.use("/college",collegeRouter)

const port=process.env.PORT;
app.listen(port,function(req,res){
    console.log("listening at "+ port);
})