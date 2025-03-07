import express, { Router } from "express"
import { protectedroute } from "../middlewares/auth.middlewares.js";
import { getMessages, getuserforSidebar, sendMessages } from "../controllers/mess.controller.js";
const router = express.Router();

router.get("/users", protectedroute, getuserforSidebar)
router.get("/:id", protectedroute, getMessages)
router.post("/send/:id",protectedroute, sendMessages)
export default router;