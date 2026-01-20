import { Message } from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar=async(req,res)=>{
    try {
        const loggedInUserId=req.user._id;
        const filteredUser=await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUser);
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({message:"Internal server error",error});
    }
}

export const sendMessage=async(req,res)=>{
    try {
       const {image,text}=req.body;
       const {id:receiverId}=req.params;
       const myId=req.user._id;
       let imageUrl;
       if(image){
        const uploadResponse=await cloudinary.uploader.upload(image)
        imageUrl=uploadResponse.secure_url;
       } 
         const newMessage=new Message({ 
            senderId:myId,
            receiverId,
            text,
            image:imageUrl
        });
        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (error) {
         return res.status(500).json({message:"Internal server error",error});
    }
}