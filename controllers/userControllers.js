const User=require("../models/userModel")
const bcrypt = require("bcrypt");
const generateToken=require("../config/generateToken")
const saltRound = 10;
const registerUser=async(req,res)=>{
    const{name,email,password}=req.body;
    try{
     const registered=await User.findOne({Email:email});
    
     if(registered){
         console.log("reg"+registered)
         res.send("user Already exists");
     }else {
         console.log("-----------line 26"+name+email+password)
         bcrypt.hash(password, saltRound, async (err, hash)=> {
           const createdUser = await User.create({
             Name: name,
             Email: email,
             Password: hash,
           })
           
           if(createdUser){
            console.log(createdUser)
               res.status(201).json({
                _id:createdUser._id,
                name:createdUser.Name,
                token:generateToken(createdUser._id)
               })
           }
           else{
            res.send("user Creation failed");
           }
         });
       }  
     }
    catch(err){
     console.log("error in registration" + err);
    }
}

const authUser=async(req,res)=>{
    const{email,password}=req.body;
    try {
        console.log("-----------line 26"+email+password)
      const foundUser = await User.findOne({ Email:email });
      if (!foundUser) {  
        res.send("notFound");
      } else {
        bcrypt.compare(password, foundUser.Password, async (err, result)=> {
          if (result == true) 
          {
            console.log(foundUser.Email);
            res.status(201).json({
                _id:foundUser._id,
                name:foundUser.Name,
                token:generateToken(foundUser._id)
            })
          } else {  
            res.send("wrongPassword")
          }
        });
      }
    } catch (err) {
      console.log("error in login" + err);
    }
}

module.exports={registerUser,authUser};