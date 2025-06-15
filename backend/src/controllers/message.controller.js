import User from '../models/user.model.js'
import Message from '../models/message.model.js';
import cloudinary from '../lib/clodinary.js';
import { getReceiverSocketId, io } from '../lib/socket.js';
export const getUsersForSidebar = async (req,res)=>{
    try{
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUser._id}}).select("-password") 
        res.status(200).json(filteredUsers)
    }
    catch(err){
        console.log('Error while fetching users in side bar',err.message);
        res.status(500).json({
            msg: 'Internal Server Error'
        })
    }
}

export const getMessages = async (req,res)=>{
    try{
        const {id:userToChatId} = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,recieverId: userToChatId},
                {senderId:userToChatId,recieverId: myId}
            ]
        }) 
        res.status(200).json({
            messages
        })
    }
    catch(err){
        console.log('Error while fetching messages',err.message);
        res.status(500).json({
            msg: 'Internal Server Error'
        })
    }
} 



export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const recieverSocketId = getReceiverSocketId(recieverId);

    if(recieverSocketId){
        io.to(recieverSocketId).emit('newMessage',newMessage)
    }


    console.log(text)
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};