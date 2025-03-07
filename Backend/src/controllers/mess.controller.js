import cloudinary from "../lib/cloudinary.js";
import { getrecieversocketId, io } from "../lib/socket.js";
import Message from "../models/message.model..js";
import User from "../models/user.model.js";

export const getuserforSidebar = async(req,res) => {
    try{
        const userid = req.user._id;
        const filteredUsers = await User.find({_id: {$ne:userid}}).select("-password");
        return res.status(200).json(
            filteredUsers
        )
    }catch(error){
        console.log("Error in mess controlelr", error.message);
        return res.status(500).json({message: "Internal Server Error(nesscontroller.js)"});
    }
}

export const getMessages = async(req,res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
    
        const messages = await Message.find({
          $or: [ 
            { senderid: myId, recieverid: userToChatId },
            { senderid: userToChatId, recieverid: myId },
          ],
        });
        return res.status(202).json(messages);
   
    } catch (error) {
        console.log("Error in mess controlelr", error.message);
        return res.status(500).json({message: "Internal Server Error(getmessages.js)"});
    }
}

export const sendMessages = async(req,res) => {
    try {
        const {text, image} = req.body;
        const {id: recieverid} = req.params;
        const senderid = req.user._id;
        let imageUrl;
        if(image){
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (error) {
                console.log("imageurl error", error);
            }
        }
        const sendermessage = new Message({
            senderid,
            recieverid,
            message: text,
            image : imageUrl
        });
        await sendermessage.save();
        //todo: realtime functionality having => socket.io
        const recieverSocketId = getrecieversocketId(recieverid);
        if(recieverSocketId){
            console.log("sendermessage",sendermessage);
            io.to(recieverSocketId).emit("newMessage",sendermessage);
        }

        return res.status(202).json({
            sendermessage
        })
    } catch (error) {
        console.log("Error in mess controlelr", error.message);
        return res.status(500).json({message: "Internal Server Error(sendmessages.js)"});                      
    }
}