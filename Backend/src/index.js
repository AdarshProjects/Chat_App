import express from "express";
import authRoutes from "./route/auth.route.js";
import messageRoutes from "./route/message.route.js"
import dotenv from "dotenv"
import cors from "cors"

import path from "path";

import { connectdb } from "./lib/db.js";
import cookieparser from "cookie-parser"
import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:5173',
    credentials: true
 }));
const Port = process.env.PORT;
const _dirname = path.resolve();

app.use(cookieparser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(_dirname, "../frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(Port, ()=>{
    connectdb();
    console.log(`running on server Port:${Port}`)
})