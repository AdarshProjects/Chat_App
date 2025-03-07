import mongoose, { Schema } from "mongoose"
import User from "./user.model.js"

const messageschema = new mongoose.Schema({
    recieverid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    senderid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true, 
    },
    message:{
        type: String,
    },
    image: {
        type: String,
    }

},{timestamps: true})

const Message = mongoose.model("Message", messageschema);

export default Message;



/**
 * reciever hoga
 * senderhoga
 * text behjenge or
 * image bhej skte hai 
 */