import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedroute = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                message: "UnAuthorised User"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(404).json({
                message: "Unauthorised User or Invalid token"
            })
        }
        const user = await User.findById(decoded.userid).select("-password");
        if(!user){
            return res.status(404).json({
                message: "User is not found"
            })
        }
        req.user = user;

        next();
    }catch(error){
        console.log("Error in signup controller", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }
}