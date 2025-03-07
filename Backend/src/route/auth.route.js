import express from "express";
import { checkauth, login, logout, signup, updateprofile } from "../controllers/auth.controller.js";
import { protectedroute } from "../middlewares/auth.middlewares.js";


const router = express.Router();

router.post("/signup",signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update", protectedroute , updateprofile);

router.get("/check", protectedroute, checkauth);

export default router;
