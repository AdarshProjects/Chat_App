import cloudinary from "../lib/cloudinary.js";
import { generatetoken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async(req,res)=>{
    const {fullname, email, password} = req.body;
    try{
        if(!fullname || !password || !email){
            return res.status(404).json({
                message: "all fields are required"
            })
        }
        if(password.length < 6){
            return res.status(404).json({
                message: "password should be more than 6 words"
            });
        }
        const user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(404).json({
                message: "email already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);
        const newuser = new User({
            fullname,
            email,
            password: hashedpassword
        })
        if(newuser){
            //generating the token if new user is present
            generatetoken(newuser._id,res);
            await newuser.save();
            return res.status(201).json({
                _id: newuser._id,
                fullname: newuser.fullname,
                emai: newuser.email,
                profilePic: newuser.profilepic,
            });
        }else{
            return res.status(404).json({
                message: "Invalid user data"
            })
        }
    }catch(error){
        console.log("Error in signup controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async(req,res)=>{
    try{
       
        const email = req.body.email;
        const password = req.body.password;
       
      
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"Invalid credentials email.."
            })
        }
        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(404).json({
                message: "Invalid Credentials"
            })
        }

        generatetoken(user._id,res );

        return res.status(200).json({
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            password: user.password,
            profilePic: user.profilepic,
        })
    }catch(error){
        console.log("Error in signup controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = (req,res)=>{
    try{
        res.cookie("jwt", "", {maxAge: 0})
        return res.status(200).json({
        message: "Logged out successfully"
        })
    }catch(error){
        console.log("Error in signup controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export const updateprofile = async(req,res) => {
    try{
        const {profilepic} = req.body;
        const UserId = req.user._id;
        if(!profilepic){
            return res.status(404).json({
                message: "profile pic is not available"
            })
        }
        const updateResponse =  await cloudinary.uploader.upload(profilepic);
        const updateuser = await User.findByIdAndUpdate(UserId, {profilepic: updateResponse.secure_url }, {new: true});

        return res.status(200).json({
            message: "profile pic updated successfully",
            updateuser,
        })
    }catch(error){
        console.log("Error in Update profile", error.message);
        return res.status(500).json({message: "Internal Server Error(authcontroller.js)"});
    }
    
}

export const checkauth = (req,res) => { 
    try{
    return res.status(202).json(req.user)
    }catch(e){
        console.log("error in checkauth: ", e);
    }
}