import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const generatetoken = (userid, res) => {
    const token = jwt.sign({userid}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt",token, {
        maxAge: 7*24*60*60*1000,//have to put in milliseconds
        httpOnly: true,// prevent XSS attacks cross-site scripting attacks
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",

    })
    return token;
}