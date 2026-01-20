import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
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
export const login=async(req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Email"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        generateToken(user._id,res);
        return res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic,
        })
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    }
}
export const logout=(req,res)=>{
    try {
    res.cookie("jwt","",{maxAge:0})
    return res.status(200).json({message:"Logged out successfully"})
        
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    } 
    
}
export const updateProfile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id;
        const updateResponse=await cloudinary.uploader.upload(profilePic)
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:updateResponse.secure_url},{new:true})
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in uploading image",error)
        return res.status(500).json({message:"Internal server error",error});
    }
}

export const checkAuth=async(req,res)=>{
    try {
       res.status(200).json(req.user);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error",error})
    }
}