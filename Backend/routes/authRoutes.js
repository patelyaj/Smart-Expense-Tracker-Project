import express from "express";
import { logoutUser, registerUser, updateProfile, loginUser } from "../controller/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", authLimiter, logoutUser);

router.post("/updateProfile", verifyToken, updateProfile);

export default router;