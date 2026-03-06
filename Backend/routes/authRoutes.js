import express from "express";
import { logoutUser, registerUser, updateProfile } from "../controllers/authControllers.js";
import { loginUser } from "../controllers/authControllers.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
const router = express.Router();

router.post("/signup", authLimiter,registerUser);
router.post("/login", authLimiter,loginUser);
router.post("/logout", authLimiter,logoutUser);

router.post("/updateProfile/:id", verifyToken , updateProfile);

export default router;