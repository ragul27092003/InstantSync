import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup=async(req,res)=>{
    try {
    const {fullname,email,password}=req.body;
    if(!fullname||!email||!password){
        return res.status(400).json({message:"All fields are required"});
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
    }
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    //const salt=await bcrypt.genSalt(10);
    //const hashedPassword=await bcrypt.hash(password,salt)
    const hashedPassword=await bcrypt.hash(password,10)
    const newUser=new User({
        fullname,
        email,
        password:hashedPassword
    })
   if(newUser){
      generateToken(newUser._id,res);
      await newUser.save();
        return  res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullname,
            email:newUser.email,
            profilePic:newUser.profilePic,
        
        })
   }
    else{
        return res.status(400).json({message:"Invalid user data"});
    }    
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    }
    
}
export const login=(req,res)=>{
    res.send("Signup route");
}
export const logout=(req,res)=>{
    res.send("Logout route");
}